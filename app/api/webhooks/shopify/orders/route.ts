import { NextResponse } from "next/server"
import { createHmac, timingSafeEqual } from "crypto"
import {
  cartItemsToKlaviyoItems,
  trackPlacedOrder,
  type KlaviyoOrderItem,
} from "@/lib/klaviyo"

/**
 * Shopify orders/paid (or orders/create) webhook → Klaviyo Placed Order.
 *
 * Configure in Shopify Admin → Settings → Notifications → Webhooks:
 *   Event: Order payment
 *   URL:   https://your-domain.com/api/webhooks/shopify/orders
 *   Format: JSON
 *
 * Optional: set SHOPIFY_WEBHOOK_SECRET to the webhook signing secret.
 */

function verifyShopifyHmac(rawBody: string, hmacHeader: string | null): boolean {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET
  if (!secret) {
    // Allow local/dev testing without a secret; warn loudly
    console.warn("[Shopify Webhook] SHOPIFY_WEBHOOK_SECRET not set — skipping HMAC verification")
    return true
  }
  if (!hmacHeader) return false

  const digest = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64")
  try {
    const a = Buffer.from(digest)
    const b = Buffer.from(hmacHeader)
    return a.length === b.length && timingSafeEqual(a, b)
  } catch {
    return false
  }
}

function shopifyLineItemsToKlaviyo(order: Record<string, unknown>): KlaviyoOrderItem[] {
  const lineItems = (order.line_items as Array<Record<string, unknown>>) || []

  return lineItems.map((li) => {
    const quantity = Number(li.quantity) || 1
    const price = parseFloat(String(li.price ?? "0"))
    const props = (li.properties as Array<{ name: string; value: string }>) || []
    const prop = (name: string) => props.find((p) => p.name === name)?.value

    return {
      ProductID: String(li.product_id || li.variant_id || li.sku || li.name || "item"),
      ProductName: String(li.title || li.name || "Custom Print"),
      Quantity: quantity,
      ItemPrice: price,
      RowTotal: price * quantity,
      ImageURL: prop("__Image URL"),
      ProductCategories: ["Custom Print", "AI Art"],
      Size: prop("Size"),
      Medium: prop("Medium"),
      Frame: prop("Frame"),
      Mat: prop("Mat"),
    }
  })
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  const hmac = request.headers.get("x-shopify-hmac-sha256")

  if (!verifyShopifyHmac(rawBody, hmac)) {
    console.error("[Shopify Webhook] Invalid HMAC")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let order: Record<string, unknown>
  try {
    order = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const email =
    (order.email as string) ||
    ((order.customer as Record<string, unknown>)?.email as string) ||
    ""

  if (!email || !email.includes("@")) {
    console.warn("[Shopify Webhook] No customer email on order — skipping Klaviyo")
    return NextResponse.json({ success: true, skipped: true, reason: "no_email" })
  }

  const orderId = String(order.id || order.name || `shopify-${Date.now()}`)
  const totalPrice = parseFloat(String(order.total_price ?? order.current_total_price ?? "0"))

  let items = shopifyLineItemsToKlaviyo(order)
  if (items.length === 0) {
    // Fallback so the metric still fires with order totals
    items = cartItemsToKlaviyoItems([
      {
        id: orderId,
        title: `Order ${order.name || orderId}`,
        price: Math.round(totalPrice * 100),
        quantity: 1,
      },
    ])
  }

  try {
    await trackPlacedOrder({
      email,
      orderId,
      items,
      value: totalPrice,
      extra: {
        ShopifyOrderName: order.name,
        FinancialStatus: order.financial_status,
        FulfillmentStatus: order.fulfillment_status,
        Currency: order.currency,
      },
    })

    console.log(`[Shopify Webhook] Placed Order tracked for ${email} (order ${orderId})`)
    return NextResponse.json({ success: true, orderId })
  } catch (error) {
    console.error("[Shopify Webhook] Failed to track Placed Order:", error)
    return NextResponse.json(
      { error: "Failed to track order" },
      { status: 500 }
    )
  }
}
