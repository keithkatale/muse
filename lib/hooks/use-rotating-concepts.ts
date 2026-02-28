"use client"

import { useState, useEffect, useCallback } from "react"
import type { StartingConcept } from "@/lib/types"
import { STARTING_CONCEPTS } from "@/lib/mock-data"

const ROTATE_INTERVAL_MS = 90 * 1000 // 1.5 minutes

export function useRotatingConcepts() {
  const [concepts, setConcepts] = useState<StartingConcept[]>(
    () => STARTING_CONCEPTS.slice(0, 6)
  )
  const [isLoading, setIsLoading] = useState(false)

  const fetchConcepts = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/generate-concepts")
      const data = await res.json()
      if (data.concepts && Array.isArray(data.concepts) && data.concepts.length > 0) {
        setConcepts(data.concepts)
      }
    } catch (err) {
      console.error("Failed to fetch concepts:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConcepts()

    const interval = setInterval(fetchConcepts, ROTATE_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [fetchConcepts])

  return { concepts, isLoading, refetch: fetchConcepts }
}
