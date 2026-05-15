// Quick test script to verify fal.ai image generation (Nano Banana Pro)
// Run with: node test-image-gen.js
//
// This tests the core image generation pipeline used by the app:
//   - fal.ai Nano Banana Pro model (fal-ai/nano-banana-pro)
//   - Multiple aspect ratios: 3:4, 1:1, 4:3, 16:9
//   - Standard & Premium quality (1K / 2K resolution)
//   - Multi-image generation (1-4 images per request)

const { fal } = require("@fal-ai/client");

const IMAGE_MODEL = "fal-ai/nano-banana-pro";

const ASPECT_RATIOS = {
  "3:4":  { width: 864,  height: 1184, label: "Portrait" },
  "1:1":  { width: 1024, height: 1024, label: "Square" },
  "4:3":  { width: 1184, height: 864,  label: "Landscape" },
  "16:9": { width: 1344, height: 768,  label: "Wide" },
};

// Load environment variables from .env.local
try {
  const fs = require("fs");
  const path = require("path");
  const envPath = path.join(__dirname, ".env.local");
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, "utf8")
      .split("\n")
      .forEach((line) => {
        const [key, ...valueParts] = line.split("=");
        if (key && valueParts.length > 0 && !process.env[key.trim()]) {
          process.env[key.trim()] = valueParts.join("=").trim();
        }
      });
  }
} catch {}

async function testImageGeneration() {
  const apiKey = process.env.FAL_KEY;

  if (!apiKey) {
    console.error("❌ FAL_KEY not found in environment variables");
    console.log("\nTo fix this:");
    console.log("  1. Add FAL_KEY=your_key_here to .env.local");
    console.log("  2. Get your key at: https://fal.ai/dashboard/keys");
    process.exit(1);
  }

  console.log("✅ FAL_KEY found");
  console.log(`   Key: ${apiKey.substring(0, 10)}...`);
  fal.config({ credentials: apiKey });

  // ── Test 1: Single image, portrait (3:4), standard quality ──
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Test 1: Single image — Portrait 3:4, Standard (1K)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📝 Prompt: A golden retriever in a sunlit field, photorealistic portrait");

  try {
    const start = Date.now();
    const result = await fal.subscribe(IMAGE_MODEL, {
      input: {
        prompt: "A golden retriever in a sunlit field, photorealistic portrait with soft natural lighting",
        aspect_ratio: "3:4",
        num_images: 1,
        resolution: "1K",
      },
    });
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);

    const data = result.data;
    if (data?.images?.length > 0) {
      const img = data.images[0];
      console.log(`✅ SUCCESS! Image generated in ${elapsed}s`);
      console.log(`   URL:  ${img.url}`);
      console.log(`   Size: ${img.width || "?"}x${img.height || "?"}`);
    } else {
      console.log("⚠️  No images returned");
      console.log("   Response:", JSON.stringify(data, null, 2).substring(0, 500));
    }
  } catch (error) {
    console.error("❌ Test 1 FAILED:", error.message);
  }

  // ── Test 2: Multiple images, landscape (16:9), standard quality ──
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Test 2: 4 images — Wide 16:9, Standard (1K)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📝 Prompt: Misty mountain range at dawn with golden light");

  try {
    const start = Date.now();
    const result = await fal.subscribe(IMAGE_MODEL, {
      input: {
        prompt: "Misty mountain range at dawn with golden light breaking through clouds, photorealistic landscape",
        aspect_ratio: "16:9",
        num_images: 4,
        resolution: "1K",
      },
    });
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);

    const data = result.data;
    if (data?.images?.length > 0) {
      console.log(`✅ SUCCESS! ${data.images.length} images generated in ${elapsed}s`);
      data.images.forEach((img, i) => {
        console.log(`   Image ${i + 1}: ${img.url}`);
        console.log(`            ${img.width || "?"}x${img.height || "?"}`);
      });
    } else {
      console.log("⚠️  No images returned");
    }
  } catch (error) {
    console.error("❌ Test 2 FAILED:", error.message);
  }

  // ── Test 3: Premium quality, square (1:1) ──
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Test 3: 1 image — Square 1:1, Premium (2K)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📝 Prompt: Abstract geometric art with warm sunset tones");

  try {
    const start = Date.now();
    const result = await fal.subscribe(IMAGE_MODEL, {
      input: {
        prompt: "Abstract geometric art with warm sunset tones, golden orange and coral, professional wall art composition",
        aspect_ratio: "1:1",
        num_images: 1,
        resolution: "2K",
      },
    });
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);

    const data = result.data;
    if (data?.images?.length > 0) {
      const img = data.images[0];
      console.log(`✅ SUCCESS! Premium image generated in ${elapsed}s`);
      console.log(`   URL:  ${img.url}`);
      console.log(`   Size: ${img.width || "?"}x${img.height || "?"}`);
    } else {
      console.log("⚠️  No images returned");
    }
  } catch (error) {
    console.error("❌ Test 3 FAILED:", error.message);
  }

  // ── Summary ──
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Summary");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Model:      ${IMAGE_MODEL}`);
  console.log(`Aspect ratios supported: ${Object.keys(ASPECT_RATIOS).join(", ")}`);
  console.log(`Resolutions: 1K (standard), 2K (premium)`);
  console.log(`Max images per request: 4`);
  console.log("\nIf all tests passed, your image generation pipeline is ready!");
  console.log("Run `npm run dev` and visit http://localhost:3000/create");
}

testImageGeneration();
