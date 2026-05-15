// Quick test script to verify Vertex AI / GenAI integration
// Run with: node test-gemini.js
//
// Authentication options:
//   1. Vertex AI (preferred): Set GOOGLE_CLOUD_PROJECT + GOOGLE_CLOUD_LOCATION
//      Then run: gcloud auth application-default login
//   2. Gemini Developer API (fallback): Set GOOGLE_AI_API_KEY

const { GoogleGenAI } = require("@google/genai");

function buildClient() {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
  const apiKey = process.env.GOOGLE_AI_API_KEY;

  if (project) {
    console.log(`✅ Using Vertex AI (project: ${project}, location: ${location})`);
    return new GoogleGenAI({ enterprise: true, project, location });
  }

  if (apiKey) {
    console.log("✅ Using Gemini Developer API (API key)");
    return new GoogleGenAI({ apiKey });
  }

  return null;
}

async function testGenAI() {
  const ai = buildClient();

  if (!ai) {
    console.error("❌ No GenAI backend configured");
    console.log("\nTo fix this, set one of:");
    console.log("  Option 1 (Vertex AI):");
    console.log("    export GOOGLE_CLOUD_PROJECT=your-project-id");
    console.log("    export GOOGLE_CLOUD_LOCATION=us-central1");
    console.log("    gcloud auth application-default login");
    console.log("  Option 2 (Developer API):");
    console.log("    export GOOGLE_AI_API_KEY=your_api_key_here");
    process.exit(1);
  }

  console.log("🔄 Testing GenAI connection with gemini-2.5-flash...\n");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a single creative wall art concept as JSON: {\"title\":\"...\",\"prompt\":\"...\"}",
      config: {
        temperature: 0.7,
        maxOutputTokens: 256,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (text) {
      console.log("✅ SUCCESS! GenAI is working correctly");
      console.log(`   Response: ${text}`);
      console.log("\n🎉 Your Vertex AI / GenAI integration is working!");
      console.log("\nNext steps:");
      console.log("1. Run: npm run dev");
      console.log("2. Visit: http://localhost:3000");
      console.log("3. Complete the style quiz at /discover");
      console.log("4. Generate real AI art at /create");
      return;
    }

    console.log("⚠️  No text found in response");
    console.log("Response:", JSON.stringify(response, null, 2));

  } catch (error) {
    console.error("\n❌ Error testing GenAI:");
    console.error(error.message);

    if (error.message?.includes("PERMISSION_DENIED") || error.message?.includes("401")) {
      console.log("\n💡 Authentication failed. For Vertex AI:");
      console.log("   1. Enable Vertex AI API: https://console.cloud.google.com/ai/enablement");
      console.log("   2. Run: gcloud auth application-default login");
      console.log("   3. Ensure your project ID is correct");
    } else if (error.message?.includes("429")) {
      console.log("\n💡 Rate limit exceeded - wait a minute and try again");
    } else if (error.message?.includes("quota")) {
      console.log("\n💡 Quota exceeded - check your usage in Google Cloud Console");
    }
  }
}

// Load environment variables from .env.local if it exists
try {
  const fs = require('fs');
  const path = require('path');
  const envPath = path.join(__dirname, '.env.local');

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = value;
        }
      }
    });
  }
} catch (error) {
  // Ignore errors loading .env.local
}

testGenAI();
