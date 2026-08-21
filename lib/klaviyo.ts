/**
 * Klaviyo API v3 client — profiles, list subscription, and event tracking.
 *
 * Events power flows for quiz nurture, abandoned checkout, order confirmation,
 * and shipping/tracking emails.
 */

const KLAVIYO_REVISION = "2024-10-15"
const KLAVIYO_BASE = "https://a.klaviyo.com/api"

export interface KlaviyoOrderItem {
  ProductID: string
  ProductName: string
  Quantity: number
  ItemPrice: number
  RowTotal: number
  ImageURL?: string
  ProductURL?: string
  ProductCategories?: string[]
  Size?: string
  Medium?: string
  Frame?: string
  Mat?: string
}

export interface TrackEventOptions {
  metric: string
  email: string
  properties?: Record<string, unknown>
  value?: number
  uniqueId?: string
  time?: string
}

function getApiKey(): string | null {
  return process.env.KLAVIYO_PRIVATE_API_KEY || null
}

function klaviyoHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Klaviyo-API-Key ${apiKey}`,
    accept: "application/json",
    revision: KLAVIYO_REVISION,
    "content-type": "application/json",
  }
}

/** Convert cart line prices (cents) into Klaviyo item shape (dollars). */
export function cartItemsToKlaviyoItems(
  items: Array<{
    id?: string
    imageId?: string
    imageUrl?: string
    title: string
    size?: string
    medium?: string
    frame?: string
    mat?: string
    price: number
    quantity: number
  }>
): KlaviyoOrderItem[] {
  return items.map((item) => {
    const unitPrice = item.price / 100
    return {
      ProductID: item.imageId || item.id || item.title,
      ProductName: item.title,
      Quantity: item.quantity,
      ItemPrice: unitPrice,
      RowTotal: unitPrice * item.quantity,
      ImageURL: item.imageUrl,
      ProductCategories: ["Custom Print", "AI Art"],
      Size: item.size,
      Medium: item.medium,
      Frame: item.frame,
      Mat: item.mat,
    }
  })
}

/**
 * Creates or updates a profile in Klaviyo with style preferences.
 * On duplicate email (409), patches the existing profile.
 */
export async function syncLeadToKlaviyo(
  email: string,
  profileData: {
    styles?: string[]
    subjects?: string[]
    palettes?: string[]
    mood?: string
    room?: string
    orientation?: string
  }
): Promise<{ success: boolean; profileId?: string; error?: string }> {
  const apiKey = getApiKey()
  if (!apiKey) {
    console.warn("[Klaviyo] Private API key is missing. Skipping sync.")
    return { success: false, error: "API key missing" }
  }

  const normalizedEmail = email.trim().toLowerCase()
  const properties: Record<string, string | boolean> = {
    "Muse Onboarding Style": profileData.styles?.join(", ") || "",
    "Muse Onboarding Subject": profileData.subjects?.join(", ") || "",
    "Muse Onboarding Palette": profileData.palettes?.join(", ") || "",
    "Muse Preferred Mood": profileData.mood || "",
    "Muse Preferred Room": profileData.room || "",
    "Muse Preferred Orientation": profileData.orientation || "",
    Source: "AI Style Quiz",
    "Accepts Marketing": true,
  }

  try {
    console.log(`[Klaviyo] Syncing profile for ${normalizedEmail}...`)

    const createResponse = await fetch(`${KLAVIYO_BASE}/profiles/`, {
      method: "POST",
      headers: klaviyoHeaders(apiKey),
      body: JSON.stringify({
        data: {
          type: "profile",
          attributes: {
            email: normalizedEmail,
            properties,
          },
        },
      }),
    })

    if (createResponse.ok) {
      const json = await createResponse.json()
      const profileId = json.data?.id as string | undefined
      console.log(`[Klaviyo] Successfully created profile. ID: ${profileId}`)

      // Sets consent + list membership together. Do NOT call subscribeProfileToList
      // afterward on a double-opt-in list — that only sends a confirmation email.
      await subscribeEmailMarketing(normalizedEmail)

      return { success: true, profileId }
    }

    // Existing profile — update instead of failing
    if (createResponse.status === 409) {
      const errorJson = await createResponse.json().catch(() => null)
      const duplicateId = errorJson?.errors?.[0]?.meta?.duplicate_profile_id as
        | string
        | undefined

      if (!duplicateId) {
        console.error("[Klaviyo] 409 without duplicate_profile_id:", errorJson)
        return { success: false, error: "Duplicate profile without id" }
      }

      const patchResponse = await fetch(`${KLAVIYO_BASE}/profiles/${duplicateId}/`, {
        method: "PATCH",
        headers: klaviyoHeaders(apiKey),
        body: JSON.stringify({
          data: {
            type: "profile",
            id: duplicateId,
            attributes: { properties },
          },
        }),
      })

      if (!patchResponse.ok) {
        const errorText = await patchResponse.text()
        console.error(`[Klaviyo] Profile update failed (${patchResponse.status}):`, errorText)
        return { success: false, error: `Klaviyo update error: ${patchResponse.status}` }
      }

      console.log(`[Klaviyo] Updated existing profile. ID: ${duplicateId}`)

      await subscribeEmailMarketing(normalizedEmail)

      return { success: true, profileId: duplicateId }
    }

    const errorText = await createResponse.text()
    console.error(`[Klaviyo] Profile sync failed (${createResponse.status}):`, errorText)
    return { success: false, error: `Klaviyo error: ${createResponse.status}` }
  } catch (error) {
    console.error("[Klaviyo] Network or parsing error during sync:", error)
    return { success: false, error: String(error) }
  }
}

/**
 * Subscribes an existing profile to a specific list (v3 List API).
 * Note: this only adds membership — it does NOT set email marketing consent.
 */
export async function subscribeProfileToList(profileId: string, listId: string): Promise<boolean> {
  const apiKey = getApiKey()
  if (!apiKey) return false

  try {
    const response = await fetch(
      `${KLAVIYO_BASE}/lists/${listId}/relationships/profiles/`,
      {
        method: "POST",
        headers: klaviyoHeaders(apiKey),
        body: JSON.stringify({
          data: [{ type: "profile", id: profileId }],
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `[Klaviyo] Failed to subscribe profile ${profileId} to list ${listId}:`,
        errorText
      )
      return false
    }

    console.log(`[Klaviyo] Subscribed profile ${profileId} to list ${listId}`)
    return true
  } catch (error) {
    console.error("[Klaviyo] Error subscribing to list:", error)
    return false
  }
}

/**
 * Explicitly opt the profile into email marketing.
 * - New profiles: historical import (no double-opt-in email) with a second-precision timestamp
 * - Already subscribed: no-op (re-importing consent fails and list-add alone triggers DOI confirms)
 */
export async function subscribeEmailMarketing(
  email: string,
  options?: { listId?: string; source?: string; historicalImport?: boolean }
): Promise<boolean> {
  const apiKey = getApiKey()
  if (!apiKey) return false

  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail.includes("@")) return false

  const listId = options?.listId || process.env.KLAVIYO_LIST_ID
  const source = options?.source || "Muse Style Quiz"

  // Skip if already subscribed — re-posting historical consent errors and
  // falling back to list membership on a DOI list sends a confirmation email.
  try {
    const existing = await fetch(
      `${KLAVIYO_BASE}/profiles/?filter=${encodeURIComponent(`equals(email,"${normalizedEmail}")`)}&additional-fields[profile]=subscriptions`,
      {
        headers: {
          Authorization: `Klaviyo-API-Key ${apiKey}`,
          accept: "application/vnd.api+json",
          revision: KLAVIYO_REVISION,
        },
      }
    )
    if (existing.ok) {
      const json = await existing.json()
      const consent =
        json.data?.[0]?.attributes?.subscriptions?.email?.marketing?.consent
      if (consent === "SUBSCRIBED") {
        console.log(`[Klaviyo] ${normalizedEmail} already subscribed — skipping consent upsert`)
        return true
      }
    }
  } catch (error) {
    console.warn("[Klaviyo] Could not pre-check subscription status:", error)
  }

  // Klaviyo rejects millisecond timestamps (…27.509+00:00) for historical import.
  const consentedAt = new Date().toISOString().replace(/\.\d{3}Z$/, "+00:00")
  const useHistorical = options?.historicalImport ?? true

  const buildBody = (historical: boolean) => {
    const marketing: Record<string, string> = { consent: "SUBSCRIBED" }
    if (historical) marketing.consented_at = consentedAt

    return {
      data: {
        type: "profile-subscription-bulk-create-job",
        attributes: {
          custom_source: source,
          ...(historical ? { historical_import: true } : {}),
          profiles: {
            data: [
              {
                type: "profile",
                attributes: {
                  email: normalizedEmail,
                  subscriptions: {
                    email: { marketing },
                  },
                },
              },
            ],
          },
        },
        ...(listId
          ? {
              relationships: {
                list: {
                  data: { type: "list", id: listId },
                },
              },
            }
          : {}),
      },
    }
  }

  const postSubscribe = async (historical: boolean) => {
    const response = await fetch(`${KLAVIYO_BASE}/profile-subscription-bulk-create-jobs/`, {
      method: "POST",
      headers: {
        ...klaviyoHeaders(apiKey),
        accept: "application/vnd.api+json",
        "content-type": "application/vnd.api+json",
      },
      body: JSON.stringify(buildBody(historical)),
    })
    return response
  }

  try {
    let response = await postSubscribe(useHistorical)

    // If historical import is rejected (bad timestamp / already has older consent),
    // do NOT fall back to a DOI list add — that only emails a confirmation link.
    if (!response.ok && useHistorical) {
      const errorText = await response.text()
      console.warn(
        `[Klaviyo] Historical subscribe failed (${response.status}): ${errorText.slice(0, 300)}`
      )
      // Retry once without historical only when there is no list (avoids DOI confirm mail).
      if (!listId) {
        response = await postSubscribe(false)
      } else {
        console.warn(
          "[Klaviyo] Skipping DOI fallback subscribe — profile can still receive flow email if consent exists"
        )
        return false
      }
    }

    if (response.status === 202 || response.ok) {
      console.log(`[Klaviyo] Queued email marketing subscribe for ${normalizedEmail}`)
      return true
    }

    const errorText = await response.text()
    console.error(
      `[Klaviyo] Email marketing subscribe failed (${response.status}):`,
      errorText
    )
    return false
  } catch (error) {
    console.error("[Klaviyo] Error subscribing email marketing:", error)
    return false
  }
}

/**
 * Track a metric event for a profile (Create Event API).
 * Returns 202 when accepted; skips quietly if API key is missing.
 */
export async function trackKlaviyoEvent(
  options: TrackEventOptions
): Promise<{ success: boolean; error?: string }> {
  const apiKey = getApiKey()
  if (!apiKey) {
    console.warn(`[Klaviyo] Skipping event "${options.metric}" — API key missing`)
    return { success: false, error: "API key missing" }
  }

  const email = options.email.trim().toLowerCase()
  if (!email || !email.includes("@")) {
    return { success: false, error: "Invalid email" }
  }

  try {
    const attributes: Record<string, unknown> = {
      properties: options.properties || {},
      metric: {
        data: {
          type: "metric",
          attributes: { name: options.metric },
        },
      },
      profile: {
        data: {
          type: "profile",
          attributes: { email },
        },
      },
    }

    if (typeof options.value === "number") {
      attributes.value = options.value
    }
    if (options.uniqueId) {
      attributes.unique_id = options.uniqueId
    }
    if (options.time) {
      attributes.time = options.time
    }

    const response = await fetch(`${KLAVIYO_BASE}/events/`, {
      method: "POST",
      headers: klaviyoHeaders(apiKey),
      body: JSON.stringify({
        data: {
          type: "event",
          attributes,
        },
      }),
    })

    // 202 Accepted is success for Create Event
    if (response.status === 202 || response.ok) {
      console.log(`[Klaviyo] Tracked "${options.metric}" for ${email}`)
      return { success: true }
    }

    const errorText = await response.text()
    console.error(`[Klaviyo] Event "${options.metric}" failed (${response.status}):`, errorText)
    return { success: false, error: `Klaviyo error: ${response.status}` }
  } catch (error) {
    console.error(`[Klaviyo] Network error tracking "${options.metric}":`, error)
    return { success: false, error: String(error) }
  }
}

export async function trackCompletedStyleQuiz(
  email: string,
  profile: {
    styles?: string[]
    subjects?: string[]
    palettes?: string[]
    mood?: string | null
    room?: string | null
    orientation?: string | null
  }
) {
  return trackKlaviyoEvent({
    metric: "Completed Style Quiz",
    email,
    uniqueId: `quiz-${email.trim().toLowerCase()}-${Date.now()}`,
    properties: {
      Styles: profile.styles || [],
      Subjects: profile.subjects || [],
      Palettes: profile.palettes || [],
      Mood: profile.mood || "",
      Room: profile.room || "",
      Orientation: profile.orientation || "",
      Source: "Muse Style Quiz",
    },
  })
}

export async function trackStartedCheckout(params: {
  email: string
  items: KlaviyoOrderItem[]
  checkoutUrl?: string
  orderId?: string
}) {
  const itemNames = params.items.map((i) => i.ProductName)
  const value = params.items.reduce((sum, i) => sum + i.RowTotal, 0)

  return trackKlaviyoEvent({
    metric: "Started Checkout",
    email: params.email,
    value,
    uniqueId: `${params.orderId || "checkout"}_${Date.now()}`,
    properties: {
      OrderId: params.orderId,
      ItemNames: itemNames,
      Items: params.items,
      CheckoutURL: params.checkoutUrl,
      Categories: ["Custom Print", "AI Art"],
      ItemCount: params.items.reduce((n, i) => n + i.Quantity, 0),
    },
  })
}

export async function trackPlacedOrder(params: {
  email: string
  orderId: string
  items: KlaviyoOrderItem[]
  value: number
  checkoutUrl?: string
  extra?: Record<string, unknown>
}) {
  const itemNames = params.items.map((i) => i.ProductName)

  const placed = await trackKlaviyoEvent({
    metric: "Placed Order",
    email: params.email,
    value: params.value,
    uniqueId: `placed-${params.orderId}`,
    properties: {
      OrderId: params.orderId,
      ItemNames: itemNames,
      Items: params.items,
      Categories: ["Custom Print", "AI Art"],
      Brands: ["Muse"],
      ...(params.checkoutUrl ? { CheckoutURL: params.checkoutUrl } : {}),
      ...params.extra,
    },
  })

  // One Ordered Product event per line — enables product-level segmentation
  await Promise.all(
    params.items.map((item, index) =>
      trackKlaviyoEvent({
        metric: "Ordered Product",
        email: params.email,
        value: item.RowTotal,
        uniqueId: `ordered-${params.orderId}-${item.ProductID}-${index}`,
        properties: {
          OrderId: params.orderId,
          ...item,
        },
      })
    )
  )

  return placed
}

export async function trackFulfilledOrder(params: {
  email: string
  orderId: string
  items?: KlaviyoOrderItem[]
  value?: number
  trackingNumber?: string | null
  trackingUrl?: string | null
  carrier?: string | null
  extra?: Record<string, unknown>
}) {
  return trackKlaviyoEvent({
    metric: "Fulfilled Order",
    email: params.email,
    value: params.value,
    uniqueId: `fulfilled-${params.orderId}-${params.trackingNumber || "ship"}`,
    properties: {
      OrderId: params.orderId,
      TrackingNumber: params.trackingNumber || "",
      TrackingURL: params.trackingUrl || "",
      Carrier: params.carrier || "",
      ItemNames: params.items?.map((i) => i.ProductName) || [],
      Items: params.items || [],
      Categories: ["Custom Print", "AI Art"],
      Brands: ["Muse"],
      ...params.extra,
    },
  })
}
