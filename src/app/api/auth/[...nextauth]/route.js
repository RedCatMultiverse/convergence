import authOptions from "@/components/auth/authOptions";
import NextAuth from "next-auth";
import { getSubdomain } from "@/lib/env";
import { headers } from "next/headers";
import GoogleProvider from "next-auth/providers/google";

// This is the correct way to create a route handler with NextAuth in App Router
export async function GET(request, context) {
  return await handleAuth(request, context);
}

export async function POST(request, context) {
  return await handleAuth(request, context);
}

// Main handler function that temporarily sets environment variables
async function handleAuth(request, context) {
  // Get host from request headers
  const headersList = headers();
  const host = headersList.get("host") || "";
  console.log('🔍 [Auth] Request host:', host);
  
  // Extract subdomain
  const parts = host.split('.');
  const subdomain = parts.length > 2 ? parts[0].toUpperCase() : null;
  console.log('🔍 [Auth] Extracted subdomain:', subdomain);

  // Save original environment variables
  const originalNextAuthUrl = process.env.NEXTAUTH_URL;
  const originalGoogleClientId = process.env.GOOGLE_CLIENT_ID;
  const originalGoogleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  try {
    // Apply subdomain-specific overrides if available
    if (subdomain) {
      // Override NEXTAUTH_URL
      const subdomainNextAuthUrl = process.env[`${subdomain}_NEXTAUTH_URL`];
      if (subdomainNextAuthUrl) {
        console.log(`🔍 [Auth] Temporarily setting NEXTAUTH_URL to ${subdomainNextAuthUrl}`);
        process.env.NEXTAUTH_URL = subdomainNextAuthUrl;
      }
      
      // Override Google OAuth credentials
      const subdomainGoogleClientId = process.env[`${subdomain}_GOOGLE_CLIENT_ID`];
      const subdomainGoogleClientSecret = process.env[`${subdomain}_GOOGLE_CLIENT_SECRET`];
      if (subdomainGoogleClientId && subdomainGoogleClientSecret) {
        console.log(`🔍 [Auth] Temporarily setting Google OAuth credentials for ${subdomain}`);
        process.env.GOOGLE_CLIENT_ID = subdomainGoogleClientId;
        process.env.GOOGLE_CLIENT_SECRET = subdomainGoogleClientSecret;
      }
    }
    
    // Create a custom configuration with modified providers
    const options = {
      ...authOptions,
      providers: getProvidersWithSubdomainSupport(subdomain, authOptions.providers),
      debug: true, // Enable debug to see more information
    };

    // Process the request with NextAuth
    return await NextAuth(options)(request, context);
  } finally {
    // Restore original environment variables
    process.env.NEXTAUTH_URL = originalNextAuthUrl;
    process.env.GOOGLE_CLIENT_ID = originalGoogleClientId;
    process.env.GOOGLE_CLIENT_SECRET = originalGoogleClientSecret;
    console.log('🔍 [Auth] Restored original environment variables');
  }
}

// Helper function to create providers with subdomain-specific credentials
function getProvidersWithSubdomainSupport(subdomain, originalProviders) {
  // If no subdomain, return original providers
  if (!subdomain) return originalProviders;
  
  // Create a copy of the providers array
  const providers = [...originalProviders];
  
  // Find Google provider and replace it with subdomain-specific one if available
  const googleProviderIndex = providers.findIndex(provider => provider.id === 'google');
  
  if (googleProviderIndex !== -1) {
    const subdomainGoogleClientId = process.env[`${subdomain}_GOOGLE_CLIENT_ID`];
    const subdomainGoogleClientSecret = process.env[`${subdomain}_GOOGLE_CLIENT_SECRET`];
    
    if (subdomainGoogleClientId && subdomainGoogleClientSecret) {
      providers[googleProviderIndex] = GoogleProvider({
        clientId: subdomainGoogleClientId,
        clientSecret: subdomainGoogleClientSecret,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
      });
      console.log(`🔍 [Auth] Created custom Google provider for ${subdomain}`);
    }
  }
  
  return providers;
}