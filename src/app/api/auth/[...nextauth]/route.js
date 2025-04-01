import authOptions from "@/components/auth/authOptions";
import NextAuth from "next-auth";
import { getSubdomain } from "@/lib/env";

const handler = async (req, res) => {
  // Get the subdomain from the request
  const host = req.headers.host || '';
  const parts = host.split('.');
  const subdomain = parts.length > 2 ? parts[0].toUpperCase() : null;

  // If we have a subdomain, check for subdomain-specific NEXTAUTH_URL
  if (subdomain) {
    const subdomainNextAuthUrl = process.env[`${subdomain}_NEXTAUTH_URL`];
    if (subdomainNextAuthUrl) {
      process.env.NEXTAUTH_URL = subdomainNextAuthUrl;
    }
  }

  return NextAuth(authOptions)(req, res);
};

export { handler as GET, handler as POST };