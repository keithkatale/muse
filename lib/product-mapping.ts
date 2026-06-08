/**
 * Shopify Product Variant Mapping
 * 
 * This maps your app's product configurations to Shopify variant IDs.
 * You need to create products in Shopify first, then add the variant IDs here.
 * 
 * To get variant IDs:
 * 1. Go to Shopify admin > Products
 * 2. Click on a product
 * 3. Click on a variant
 * 4. Look at the URL: .../products/123456/variants/789012
 * 5. The full GID is: gid://shopify/ProductVariant/789012
 */

export const PRODUCT_VARIANTS: Record<string, string> = {
  // Example mappings - REPLACE THESE WITH YOUR ACTUAL SHOPIFY VARIANT IDS
  // Format: "size-medium-frame" -> Shopify variant GID
  
  // 16x20 variants
  "16x20-paper-none": "gid://shopify/ProductVariant/REPLACE_WITH_YOUR_ID",
  "16x20-paper-black": "gid://shopify/ProductVariant/REPLACE_WITH_YOUR_ID",
  "16x20-paper-white": "gid://shopify/ProductVariant/REPLACE_WITH_YOUR_ID",
  "16x20-canvas-none": "gid://shopify/ProductVariant/REPLACE_WITH_YOUR_ID",
  "16x20-canvas-black": "gid://shopify/ProductVariant/REPLACE_WITH_YOUR_ID",
  
  // 24x36 variants
  "24x36-paper-none": "gid://shopify/ProductVariant/REPLACE_WITH_YOUR_ID",
  "24x36-canvas-none": "gid://shopify/ProductVariant/REPLACE_WITH_YOUR_ID",
  
  // Add more variants as needed...
  // You can generate these programmatically or add them manually
}

/**
 * Get Shopify variant ID for a product configuration
 */
export function getShopifyVariantId(size: string, medium: string, frame: string): string {
  const key = `${size}-${medium}-${frame}`
  const variantId = PRODUCT_VARIANTS[key]
  
  if (!variantId || variantId.includes("REPLACE_WITH_YOUR_ID")) {
    console.warn(`⚠️  No Shopify variant ID configured for: ${key}`)
    console.warn(`⚠️  Using mock variant ID. Set up products in Shopify and update lib/product-mapping.ts`)
    // Return a mock variant ID for development
    return `gid://shopify/ProductVariant/mock-${Date.now()}`
  }
  
  return variantId
}

/**
 * Check if Shopify product mapping is configured
 */
export function isProductMappingConfigured(): boolean {
  const firstVariant = Object.values(PRODUCT_VARIANTS)[0]
  return !!(firstVariant && !firstVariant.includes("REPLACE_WITH_YOUR_ID"))
}

/**
 * Get all configured variant keys
 */
export function getConfiguredVariants(): string[] {
  return Object.keys(PRODUCT_VARIANTS).filter(key => {
    const id = PRODUCT_VARIANTS[key]
    return id && !id.includes("REPLACE_WITH_YOUR_ID")
  })
}
