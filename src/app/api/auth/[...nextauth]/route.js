import authOptions from "@/components/auth/authOptions";
import NextAuth from "next-auth";
import { getSubdomain } from "@/lib/env";
import { headers } from "next/headers";

// This is the correct way to create a route handler with NextAuth in App Router
const handler = NextAuth({
  ...authOptions,
  callbacks: {
    ...authOptions.callbacks,
    async redirect({ url, baseUrl }) {
      // Get host from request headers
      const headersList = headers();
      const host = headersList.get("host") || "";
      console.log('🔍 [Auth Route] Request host from headers:', host);
      
      const parts = host.split('.');
      const subdomain = parts.length > 2 ? parts[0].toUpperCase() : null;
      console.log('🔍 [Auth Route] Extracted subdomain:', subdomain);
      
      // If we have a subdomain, check for subdomain-specific NEXTAUTH_URL
      let customBaseUrl = baseUrl;
      if (subdomain) {
        const subdomainNextAuthUrl = process.env[`${subdomain}_NEXTAUTH_URL`];
        console.log('🔍 [Auth Route] Subdomain NEXTAUTH_URL:', {
          key: `${subdomain}_NEXTAUTH_URL`,
          value: subdomainNextAuthUrl,
          currentBaseUrl: baseUrl
        });
        
        if (subdomainNextAuthUrl) {
          customBaseUrl = subdomainNextAuthUrl;
          console.log('🔍 [Auth Route] Updated baseUrl to:', customBaseUrl);
        }
      }
      
      // Ensure the URL is properly formed
      let finalUrl;
      if (url.startsWith(customBaseUrl)) {
        finalUrl = url;
      } else if (url.startsWith('/')) {
        finalUrl = `${customBaseUrl}${url}`;
      } else {
        finalUrl = customBaseUrl;
      }
      
      console.log('🔍 [Auth Route] Final URL:', finalUrl);
      return finalUrl;
    }
  }
});

export { handler as GET, handler as POST };