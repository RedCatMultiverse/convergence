import authOptions from "@/components/auth/authOptions";
import NextAuth from "next-auth";
import { getSubdomain } from "@/lib/env";

const handler = async (req, res) => {
  // Get the subdomain from the request
  const host = req.headers.host || '';
  console.log('🔍 [Auth Route] Request host:', host);
  
  const parts = host.split('.');
  const subdomain = parts.length > 2 ? parts[0].toUpperCase() : null;
  console.log('🔍 [Auth Route] Extracted subdomain:', subdomain);

  // If we have a subdomain, check for subdomain-specific NEXTAUTH_URL
  if (subdomain) {
    const subdomainNextAuthUrl = process.env[`${subdomain}_NEXTAUTH_URL`];
    console.log('🔍 [Auth Route] Subdomain NEXTAUTH_URL:', {
      key: `${subdomain}_NEXTAUTH_URL`,
      value: subdomainNextAuthUrl,
      currentNEXTAUTH_URL: process.env.NEXTAUTH_URL
    });
    
    if (subdomainNextAuthUrl) {
      process.env.NEXTAUTH_URL = subdomainNextAuthUrl;
      console.log('🔍 [Auth Route] Updated NEXTAUTH_URL to:', process.env.NEXTAUTH_URL);
    }
  }

  return NextAuth(authOptions)(req, res);
};

export { handler as GET, handler as POST };