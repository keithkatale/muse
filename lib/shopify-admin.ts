/**
 * Shopify Admin API Client
 * 
 * Uses the Admin API to create draft orders.
 * Draft orders allow customers to complete checkout on Shopify's hosted checkout page.
 */

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN
const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID
const SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2026-01'

// Static legacy fallback if set directly
const SHOPIFY_STATIC_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN

interface OrderItem {
  title: string
  quantity: number
  price: string
  sku?: string
  variant_id?: number
  properties?: Array<{ name: string; value: string }>
  image?: { src: string }
}

interface ShopifyTokenCache {
  token: string
  expiresAt: number // timestamp in milliseconds
}

const globalForShopify = global as unknown as {
  shopifyCache?: ShopifyTokenCache
}

/**
 * Dynamically gets a valid Admin API access token.
 * It uses the Client ID and Secret to generate/refresh the token as needed.
 */
export async function getShopifyAccessToken(): Promise<string> {
  // 1. If a static access token is specified in env, use it directly
  if (SHOPIFY_STATIC_TOKEN) {
    return SHOPIFY_STATIC_TOKEN
  }

  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_CLIENT_ID || !SHOPIFY_CLIENT_SECRET) {
    throw new Error('Shopify credentials not configured. Please set SHOPIFY_STORE_DOMAIN, SHOPIFY_CLIENT_ID, and SHOPIFY_CLIENT_SECRET in .env.local')
  }

  const cleanDomain = SHOPIFY_STORE_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '')

  // 2. Check if we have a valid cached token
  const now = Date.now()
  if (globalForShopify.shopifyCache && globalForShopify.shopifyCache.expiresAt > now + 60000) {
    // Return cached token if valid for at least another minute
    return globalForShopify.shopifyCache.token
  }

  // 3. Request a new token using client_credentials grant
  console.log('🔑 Shopify Token expired or missing. Fetching a fresh token...')
  const url = `https://${cleanDomain}/admin/oauth/access_token`

  try {
    const params = new URLSearchParams()
    params.append('grant_type', 'client_credentials')
    params.append('client_id', SHOPIFY_CLIENT_ID)
    params.append('client_secret', SHOPIFY_CLIENT_SECRET)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Shopify Token Request failed:', response.status, errorText)
      throw new Error(`Shopify Token authentication failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const token = data.access_token
    const expiresIn = data.expires_in || 86400

    if (!token) {
      throw new Error('No access_token returned in Shopify OAuth response.')
    }

    // Cache the token (cache for slightly less than actual duration to be safe, e.g., actual duration minus 10 minutes)
    globalForShopify.shopifyCache = {
      token,
      expiresAt: now + (expiresIn - 600) * 1000
    }

    console.log('✅ Successfully obtained and cached fresh Shopify Admin token.')
    return token
  } catch (error) {
    console.error('❌ Failed to fetch Shopify OAuth token:', error)
    throw error
  }
}

/**
 * Creates a Shopify Draft Order and returns the invoice URL.
 * Customer will be redirected to this URL to complete checkout.
 */
export async function createDraftOrder(
  customer: { email: string },
  items: OrderItem[],
  tags: string[] = ['ai-art', 'custom-print']
): Promise<{ id: number; invoiceUrl: string }> {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify credentials not configured. Please check your .env.local')
  }

  // Clean domain (remove https:// and trailing slash)
  const cleanDomain = SHOPIFY_STORE_DOMAIN!.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const url = `https://${cleanDomain}/admin/api/${SHOPIFY_API_VERSION}/draft_orders.json`

  const draftOrderData = {
    draft_order: {
      email: customer.email,
      tags: tags.join(', '),
      line_items: items.map(item => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        variant_id: item.variant_id,
        properties: item.properties,
        requires_shipping: true,
        image: item.image
      })),
      use_customer_default_address: false
    }
  }

  console.log('🛍️  Creating Shopify draft order...')
  console.log('   Domain:', cleanDomain)
  console.log('   Items:', items.length)

  try {
    const accessToken = await getShopifyAccessToken()
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(draftOrderData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Shopify API error:', response.status, errorText)
      
      if (response.status === 401) {
        throw new Error('Shopify authentication failed. Check your SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET or Admin access token.')
      }
      
      if (response.status === 403) {
        throw new Error('Shopify Permission Error (403 Forbidden): Your Custom App token does not have the required "write_draft_orders" scope. To fix this: 1. Go to Shopify Partners Dashboard. 2. Open your App settings. 3. Go to Configuration -> Admin API integration. 4. Enable "write_draft_orders" and "read_draft_orders" scopes. 5. Save and Release the configuration. 6. Reinstall the app on your store.')
      }
      
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}. Details: ${errorText}`)
    }

    const data = await response.json()
    const invoiceUrl = data.draft_order.invoice_url
    const orderId = data.draft_order.id

    console.log('✅ Draft order created successfully')
    console.log('   Order ID:', orderId)
    console.log('   Invoice URL:', invoiceUrl)

    return {
      id: orderId,
      invoiceUrl
    }
  } catch (error) {
    console.error('❌ Failed to create draft order:', error)
    throw error
  }
}

/**
 * Check if Shopify Admin API is configured
 */
export function isShopifyConfigured(): boolean {
  return !!(SHOPIFY_STORE_DOMAIN && (SHOPIFY_STATIC_TOKEN || (SHOPIFY_CLIENT_ID && SHOPIFY_CLIENT_SECRET)))
}
