import { NextResponse } from "next/server"
import { createDraftOrder, isShopifyConfigured } from "@/lib/shopify-admin"
import { cartItemsToKlaviyoItems, trackStartedCheckout } from "@/lib/klaviyo"
import type { CartItem } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, email } = body as { items: CartItem[]; email?: string }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    const customerEmail = email?.trim() || "customer@example.com"

    // Check if Shopify is configured
    if (!isShopifyConfigured()) {
      console.warn("⚠️  Shopify not configured - returning mock checkout URL")
      console.warn("⚠️  Set SHOPIFY_STORE_DOMAIN and SHOPIFY_ACCESS_TOKEN in .env.local")

      const orderId = `mock-order-${Date.now()}`
      const checkoutUrl = "/checkout-placeholder"

      // Still track Started Checkout so abandoned-cart flows can be tested
      if (email?.includes("@")) {
        try {
          await trackStartedCheckout({
            email: customerEmail,
            items: cartItemsToKlaviyoItems(items),
            checkoutUrl,
            orderId,
          })
        } catch (err) {
          console.error("Klaviyo Started Checkout failed (non-blocking):", err)
        }
      }

      return NextResponse.json({
        checkoutUrl,
        orderId,
        isMock: true,
      })
    }

    console.log(`🛒 Creating Shopify draft order with ${items.length} items...`)

    const lineItems = items.map((item) => ({
      title: item.title,
      quantity: item.quantity,
      price: (item.price / 100).toFixed(2),
      variant_id:
        item.variantId && !item.variantId.includes("mock")
          ? parseInt(item.variantId.split("/").pop() || "0")
          : undefined,
      image: item.imageUrl ? { src: item.imageUrl } : undefined,
      properties: [
        { name: "__Image URL", value: item.imageUrl },
        { name: "Size", value: item.size },
        { name: "Medium", value: item.medium },
        { name: "Frame", value: item.frame },
        { name: "Mat", value: item.mat },
      ],
    }))

    const { id, invoiceUrl } = await createDraftOrder(
      { email: customerEmail },
      lineItems,
      ["ai-art", "custom-print"]
    )

    console.log(`✅ Shopify draft order created: ${id}`)
    console.log(`🔗 Invoice URL: ${invoiceUrl}`)

    if (customerEmail.includes("@")) {
      try {
        await trackStartedCheckout({
          email: customerEmail,
          items: cartItemsToKlaviyoItems(items),
          checkoutUrl: invoiceUrl,
          orderId: String(id),
        })
      } catch (err) {
        console.error("Klaviyo Started Checkout failed (non-blocking):", err)
      }
    }

    return NextResponse.json({
      checkoutUrl: invoiceUrl,
      orderId: id,
      isMock: false,
    })
  } catch (error) {
    console.error("❌ Checkout error:", error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create checkout",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
