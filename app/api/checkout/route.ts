import { NextResponse } from "next/server"
import { createDraftOrder, isShopifyConfigured } from "@/lib/shopify-admin"
import type { CartItem } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, email } = body as { items: CartItem[]; email?: string }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 }
      )
    }

    // Check if Shopify is configured
    if (!isShopifyConfigured()) {
      console.warn("⚠️  Shopify not configured - returning mock checkout URL")
      console.warn("⚠️  Set SHOPIFY_STORE_DOMAIN and SHOPIFY_ACCESS_TOKEN in .env.local")
      
      return NextResponse.json({
        checkoutUrl: "/checkout-placeholder",
        orderId: `mock-order-${Date.now()}`,
        isMock: true
      })
    }

    console.log(`🛒 Creating Shopify draft order with ${items.length} items...`)

    // Convert cart items to Shopify line items
    const lineItems = items.map(item => ({
      title: item.title,
      quantity: item.quantity,
      price: (item.price / 100).toFixed(2), // Convert cents to dollars
      variant_id: item.variantId && !item.variantId.includes('mock') 
        ? parseInt(item.variantId.split('/').pop() || '0') 
        : undefined,
      image: item.imageUrl ? { src: item.imageUrl } : undefined,
      properties: [
        { name: "__Image URL", value: item.imageUrl },
        { name: "Size", value: item.size },
        { name: "Medium", value: item.medium },
        { name: "Frame", value: item.frame },
        { name: "Mat", value: item.mat }
      ]
    }))

    // Create draft order in Shopify
    const { id, invoiceUrl } = await createDraftOrder(
      { email: email || 'customer@example.com' },
      lineItems,
      ['ai-art', 'custom-print']
    )

    console.log(`✅ Shopify draft order created: ${id}`)
    console.log(`🔗 Invoice URL: ${invoiceUrl}`)

    return NextResponse.json({
      checkoutUrl: invoiceUrl,
      orderId: id,
      isMock: false
    })

  } catch (error) {
    console.error("❌ Checkout error:", error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to create checkout",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
