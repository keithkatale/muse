import { NextResponse } from "next/server"
import { uploadPrintFile, createOrder } from "@/lib/printful-mock"
import { cartItemsToKlaviyoItems, trackFulfilledOrder } from "@/lib/klaviyo"

/**
 * Fulfillment + Klaviyo Fulfilled Order.
 *
 * PRODUCTION: Triggered by Shopify orders/create or Printful package_shipped webhook.
 * 1. Upload print-ready image to Printful
 * 2. Create Printful fulfillment order
 * 3. When shipped, fire Klaviyo Fulfilled Order with tracking
 *
 * For local testing, pass trackingNumber / trackingUrl in the body to simulate ship.
 */

export async function POST(request: Request) {
  const body = await request.json()
  const {
    imageUrl,
    recipient,
    variantId,
    retailPrice,
    email,
    orderId,
    trackingNumber,
    trackingUrl,
    carrier,
    items,
    value,
  } = body

  try {
    const { fileId } = await uploadPrintFile(imageUrl)

    const order = await createOrder(recipient, [
      {
        variant_id: variantId,
        quantity: 1,
        files: [{ type: "default" as const, id: fileId }],
        retail_price: retailPrice,
      },
    ])

    const fulfillmentOrderId = String(orderId || order.orderId)
    const customerEmail = typeof email === "string" ? email.trim() : ""

    // Fire Fulfilled Order when we have an email (and preferably tracking).
    // Mock Printful returns pending without tracking; callers can pass tracking* to test emails.
    if (customerEmail.includes("@")) {
      const klaviyoItems = Array.isArray(items)
        ? cartItemsToKlaviyoItems(items)
        : undefined

      try {
        await trackFulfilledOrder({
          email: customerEmail,
          orderId: fulfillmentOrderId,
          items: klaviyoItems,
          value: typeof value === "number" ? value : retailPrice ? parseFloat(retailPrice) : undefined,
          trackingNumber: trackingNumber || `MOCK-TRACK-${order.orderId}`,
          trackingUrl:
            trackingUrl ||
            (trackingNumber
              ? `https://www.google.com/search?q=${encodeURIComponent(trackingNumber)}`
              : `https://www.google.com/search?q=MOCK-TRACK-${order.orderId}`),
          carrier: carrier || "Mock Carrier",
          extra: {
            PrintfulOrderId: order.orderId,
            PrintfulStatus: order.status,
          },
        })
      } catch (err) {
        console.error("Klaviyo Fulfilled Order failed (non-blocking):", err)
      }
    }

    return NextResponse.json({
      success: true,
      printfulOrderId: order.orderId,
      status: order.status,
      trackingNumber: trackingNumber || `MOCK-TRACK-${order.orderId}`,
    })
  } catch (error) {
    console.error("Fulfillment failed:", error)
    return NextResponse.json({ success: false, error: "Fulfillment failed" }, { status: 500 })
  }
}
