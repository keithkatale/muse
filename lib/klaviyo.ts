/**
 * KLAVIYO API v3 CLIENT IMPLEMENTATION
 *
 * This client communicates directly with Klaviyo's REST APIs to manage
 * profiles, subscribe contacts to lists, and track events.
 */

interface KlaviyoProfileAttributes {
  email: string
  first_name?: string
  last_name?: string
  phone_number?: string
  properties?: Record<string, any>
}

/**
 * Creates or updates a profile in Klaviyo with style preferences.
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
  const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY
  if (!apiKey) {
    console.warn("[Klaviyo] Private API key is missing. Skipping sync.")
    return { success: false, error: "API key missing" }
  }

  try {
    // Map list styles and attributes to nicely formatted strings
    const stylesString = profileData.styles?.join(", ") || ""
    const subjectsString = profileData.subjects?.join(", ") || ""
    const palettesString = profileData.palettes?.join(", ") || ""

    const body = {
      data: {
        type: "profile",
        attributes: {
          email: email.trim().toLowerCase(),
          properties: {
            "Muse Onboarding Style": stylesString,
            "Muse Onboarding Subject": subjectsString,
            "Muse Onboarding Palette": palettesString,
            "Muse Preferred Mood": profileData.mood || "",
            "Muse Preferred Room": profileData.room || "",
            "Muse Preferred Orientation": profileData.orientation || "",
            "Source": "AI Style Quiz"
          }
        }
      }
    }

    console.log(`[Klaviyo] Syncing profile for ${email}...`)

    const response = await fetch("https://a.klaviyo.com/api/profiles/", {
      method: "POST",
      headers: {
        "Authorization": `Klaviyo-API-Key ${apiKey}`,
        "accept": "application/json",
        "revision": "2024-10-15",
        "content-type": "application/json"
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Klaviyo] Profile sync failed with status ${response.status}:`, errorText)
      return { success: false, error: `Klaviyo error: ${response.status}` }
    }

    const json = await response.json()
    const profileId = json.data?.id
    console.log(`[Klaviyo] Successfully synced profile. ID: ${profileId}`)

    // If you have a specific main list ID configured, subscribe them to it
    const listId = process.env.KLAVIYO_LIST_ID
    if (listId && profileId) {
      await subscribeProfileToList(profileId, listId)
    }

    return { success: true, profileId }
  } catch (error) {
    console.error("[Klaviyo] Network or parsing error during sync:", error)
    return { success: false, error: String(error) }
  }
}

/**
 * Subscribes an existing profile to a specific list (v3 List API)
 */
export async function subscribeProfileToList(profileId: string, listId: string): Promise<boolean> {
  const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY
  if (!apiKey) return false

  try {
    const body = {
      data: [
        {
          type: "profile",
          id: profileId
        }
      ]
    }

    const response = await fetch(`https://a.klaviyo.com/api/lists/${listId}/relationships/profiles/`, {
      method: "POST",
      headers: {
        "Authorization": `Klaviyo-API-Key ${apiKey}`,
        "accept": "application/json",
        "revision": "2024-10-15",
        "content-type": "application/json"
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Klaviyo] Failed to subscribe profile ${profileId} to list ${listId}:`, errorText)
      return false
    }

    console.log(`[Klaviyo] Subscribed profile ${profileId} to list ${listId}`)
    return true
  } catch (error) {
    console.error("[Klaviyo] Error subscribing to list:", error)
    return false
  }
}
