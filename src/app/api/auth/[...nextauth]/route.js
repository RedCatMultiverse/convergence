import authOptions from "@/components/auth/authOptions";
import NextAuth from "next-auth";
import { getSubdomain } from "@/lib/env";
import { headers } from "next/headers";

// Function to get the correct NEXTAUTH_URL based on subdomain
function getNextAuthUrl(host) {
  const parts = host.split('.');
  const subdomain = parts.length > 2 ? parts[0].toUpperCase() : null;
  
  if (subdomain) {
    const subdomainKey = `${subdomain}_NEXTAUTH_URL`;
    const subdomainUrl = process.env[subdomainKey];
    if (subdomainUrl) {
      console.log(`🔍 [Auth] Using ${subdomainKey}:`, subdomainUrl);
      return subdomainUrl;
    }
  }
  
  return process.env.NEXTAUTH_URL;
}

// This is the correct way to create a route handler with NextAuth in App Router
const handler = (req, ctx) => {
  // Get host from request headers
  const headersList = headers();
  const host = headersList.get("host") || "";
  console.log('🔍 [Auth Init] Request host:', host);
  
  // Override NEXTAUTH_URL for this request
  const url = getNextAuthUrl(host);
  
  // Create a custom options object with the correct URL
  const options = {
    ...authOptions,
    basePath: null, // Ensures NextAuth doesn't try to use a custom base path
    url: url, // Explicitly set the URL
    callbacks: {
      ...authOptions.callbacks,
      async redirect({ url, baseUrl }) {
        // Get host from request headers again (in case it changed during the request)
        const host = headersList.get("host") || "";
        console.log('🔍 [Auth Redirect] Request host:', host);
        
        // Get the correct URL based on subdomain
        const correctBaseUrl = getNextAuthUrl(host);
        console.log('🔍 [Auth Redirect] Original baseUrl:', baseUrl);
        console.log('🔍 [Auth Redirect] Correct baseUrl:', correctBaseUrl);
        
        // Use the correct baseUrl for redirection
        let finalUrl;
        if (url.startsWith(correctBaseUrl)) {
          finalUrl = url;
        } else if (url.startsWith('/')) {
          finalUrl = `${correctBaseUrl}${url}`;
        } else {
          finalUrl = correctBaseUrl;
        }
        
        console.log('🔍 [Auth Redirect] Final URL:', finalUrl);
        return finalUrl;
      }
    }
  };
  
  return NextAuth(options)(req, ctx);
};

export { handler as GET, handler as POST };