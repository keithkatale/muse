import { NextResponse } from "next/server"
import { isShopifyConfigured, getShopifyAccessToken } from "@/lib/shopify-admin"

export async function GET() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const version = process.env.SHOPIFY_API_VERSION || '2026-01'
  const isConfigured = isShopifyConfigured()

  console.log("🔍 Shopify Configuration Check:")
  console.log("Domain:", domain || "NOT SET")
  console.log("Is Configured:", isConfigured)
  console.log("Version:", version)

  if (!isConfigured) {
    return NextResponse.json({
      configured: false,
      message: "❌ Shopify credentials not configured",
      details: {
        domain: !!domain,
        clientId: !!process.env.SHOPIFY_CLIENT_ID,
        clientSecret: !!process.env.SHOPIFY_CLIENT_SECRET,
        version: !!version
      },
      instructions: "Set SHOPIFY_STORE_DOMAIN, SHOPIFY_CLIENT_ID, and SHOPIFY_CLIENT_SECRET in .env.local"
    })
  }

  // Test the Admin API connection
  const cleanDomain = domain!.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const endpoint = `https://${cleanDomain}/admin/api/${version}/shop.json`
  
  try {
    console.log("🔗 Testing Admin API connection to:", endpoint)
    
    // Retrieve dynamic access token
    const token = await getShopifyAccessToken()
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      }
    })

    console.log("📡 Response status:", response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Error response:", errorText)
      
      return NextResponse.json({
        configured: true,
        connected: false,
        status: response.status,
        message: `❌ Shopify Admin API returned ${response.status}`,
        error: errorText,
        troubleshooting: {
          "401": "Invalid access token or missing Admin API permissions. Go to your app → Configuration → Admin API → Enable 'write_draft_orders' scope → Reinstall app",
          "403": "Access token doesn't have required permissions. Enable Admin API scopes in Shopify admin",
          "404": "Store domain incorrect. Check SHOPIFY_STORE_DOMAIN (should be: your-store.myshopify.com)"
        }
      })
    }

    const data = await response.json()
    console.log("📦 Shop data received:", data.shop?.name)

    return NextResponse.json({
      configured: true,
      connected: true,
      message: "✅ Shopify Admin API connection successful!",
      shop: {
        name: data.shop?.name,
        domain: data.shop?.domain,
        email: data.shop?.email
      },
      endpoint,
      nextSteps: [
        "Your Shopify integration is working!",
        "Make sure your app has 'write_draft_orders' permission",
        "Test checkout by adding items to cart and clicking 'Proceed to Checkout'"
      ]
    })

  } catch (error) {
    console.error("❌ Connection error:", error)
    return NextResponse.json({
      configured: true,
      connected: false,
      message: "❌ Failed to connect to Shopify",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}
