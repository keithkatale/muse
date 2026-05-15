# Muse — Current Project State

**Last updated:** May 2026

## In place now

- Core customer flow is built and working in the app: landing, style quiz, create, configure, gallery, cart.
- Style quiz selections are saved and used in creation.
- Prompt enhancement endpoint is in place and working (template/rule-based generation from user input + quiz profile).
- Image generation endpoint is integrated with fal model `fal-ai/nano-banana-pro`.
- Product configurator is built (size, medium, frame, mat) with pricing updates.
- Cart logic is in place.

## Conditional (works when credentials are configured)

- Real AI image output works when `FAL_KEY` is present.
- Rotating create-page concepts use Google AI when `GOOGLE_AI_API_KEY` is present.
- Shopify draft-order checkout works when `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_ACCESS_TOKEN` are configured.

## Missing / not yet live

- If `FAL_KEY` is missing, create flow falls back to sample/mock gallery images.
- If Shopify credentials are missing, checkout falls back to `/checkout-placeholder` (no live payment).
- Printful fulfillment is still mock/simulated in the current codebase (no live production fulfillment pipeline yet).
- Prompt enhancement is not yet connected to a live LLM provider.

## Current overall state

- **Demo-ready:** Yes (full browse/create/configure/cart story is usable).
- **Live-payment ready:** Partial (requires Shopify credentials + store setup).
- **Live-fulfillment ready:** No (Printful integration still mock).
