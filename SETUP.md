# Muse - Setup Guide for Real Image Generation

This guide will help you set up real AI image generation using fal.ai's FLUX model.

## Quick Start

### 1. Get Your fal.ai API Key

1. Visit [fal.ai dashboard - Keys](https://fal.ai/dashboard/keys)
2. Sign in or create an account
3. Create a new API key (use API scope for model access)
4. Copy the key (format: `key_id:key_secret`)

### 2. Configure Environment Variables

1. Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

2. Open `.env.local` and add your API key:

```env
FAL_KEY=your_actual_fal_key_here
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run the Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## How It Works

### Image Generation Flow

1. **User Input** → User enters a prompt in the Generation Studio
2. **Prompt Enhancement** → The prompt is enhanced with style profile data
3. **fal.ai API Call** → Enhanced prompt is sent to fal's FLUX model (`fal-ai/flux/dev`)
4. **Image Response** → fal returns image URLs (CDN-hosted; retained ~30 days)
5. **Display** → Images are displayed in the UI

### Models and Quality

- **Standard Quality**: `fal-ai/flux/dev` with default inference steps (28) and guidance scale (3.5)
  - Fast generation
  - Best for: Quick iterations, high-volume generation

- **Premium Quality**: Same model with higher `num_inference_steps` (38) and `guidance_scale` (4)
  - Finer detail and prompt adherence
  - Best for: Final artwork, complex prompts

### Aspect Ratios Supported

- Portrait (3:4): 864x1184 → fal `portrait_4_3`
- Square (1:1): 1024x1024 → fal `square_hd`
- Landscape (4:3): 1184x864 → fal `landscape_4_3`
- Wide (16:9): 1344x768 → fal `landscape_16_9`

## Testing the Integration

### 1. Without API Key (Mock Mode)

If you don't add `FAL_KEY`, the app will automatically fall back to mock mode using the gallery images. You'll see a warning in the console:

```
FAL_KEY not found - using mock images
```

### 2. With API Key (Real Generation)

Once you add your API key:

1. Go to `/discover` and complete the style quiz
2. Navigate to `/create` (Generation Studio)
3. Enter a prompt like: "A serene mountain landscape at sunset with vibrant colors"
4. Click "Generate Art"
5. Wait for real AI-generated images (typically a few seconds per batch)

## Troubleshooting

### Images Not Generating

**Problem**: API key not working
**Solution**:
- Verify `FAL_KEY` is set correctly in `.env.local` (format: `key_id:key_secret`)
- Restart the dev server after adding the key
- Check the console for error messages

**Problem**: Rate limit or quota errors
**Solution**:
- Check your fal.ai dashboard for usage and limits
- Wait and try again; implement backoff if needed

### Mock Images Still Showing

**Problem**: Still seeing gallery images after adding API key
**Solution**:
- Restart the development server (`pnpm dev`)
- Clear your browser cache
- Check that `.env.local` is in the project root (not in a subdirectory)

### API Errors

**Problem**: 400 Bad Request
**Solution**:
- Check that your prompt is valid and not empty
- Verify the aspect ratio is one of the supported values

**Problem**: 429 or 5xx errors
**Solution**:
- Check [fal.ai status](https://status.fal.ai/)
- Retry after a short delay; the route falls back to mock images on error

## Cost Considerations

### fal.ai Pricing

- FLUX dev is billed per megapixel (see [fal.ai pricing](https://fal.ai/pricing))
- Check current rates and free tier at the fal dashboard

### Optimization Tips

1. Use Standard quality for testing and iterations
2. Use Premium quality only for final production images
3. Consider persisting image URLs via `/api/upload-image` if you need long-term storage for checkout/fulfillment

## Advanced Configuration

### Customizing Image Generation

Edit `app/api/generate/route.ts` to customize:

- `num_inference_steps`: higher for more detail (e.g. 38 for premium)
- `guidance_scale`: higher for stronger prompt adherence
- `image_size`: use fal's enum (`square_hd`, `portrait_4_3`, etc.)

## Next Steps

### Production Deployment

1. **Environment Variables**: Add `FAL_KEY` to your hosting platform
2. **Rate Limiting**: Implement rate limiting on your API routes if needed
3. **Error Handling**: The route already falls back to mock images on fal errors
4. **Long-lived URLs**: For Shopify/Printful, consider uploading generated images via `/api/upload-image` and storing the returned URL in the cart

### Optional Integrations

The app is also ready for:
- **Shopify Storefront API**: For real checkout
- **Printful API**: For print-on-demand fulfillment
- **Anthropic Claude**: For better prompt enhancement

See the main README.md for details on these integrations.

## Support

- [fal.ai Documentation](https://docs.fal.ai/)
- [fal.ai Model APIs](https://docs.fal.ai/model-apis)
- [FLUX dev model](https://fal.ai/models/fal-ai/flux/dev)
- [fal.ai Pricing](https://fal.ai/pricing)

## License

Private - All rights reserved
