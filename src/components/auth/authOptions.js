import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
//import LinkedInProvider from "next-auth/providers/linkedin";
//import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma/client";
import formData from 'form-data';
import sgMail from '@sendgrid/mail';
import { env } from '@/lib/env';

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const allowedEmails = [
  'walshseanp@yahoo.com',
  'walshseanp@gmail.com', 
  'jdurso@chalkx.com'
];

const allowedDomains = [
  'rcmlabs.io',
  'axa.com'
];

const isEmailAllowed = (email) => {
  // Check if email is in allowed list
  if (allowedEmails.includes(email.toLowerCase())) {
    return true;
  }
  
  // Check if email domain is allowed
  const domain = email.toLowerCase().split('@')[1];
  return allowedDomains.includes(domain);
};

const sendVerificationRequest = async ({ identifier: email, url, provider }) => {
  const { maxAge } = provider;
  const maxAgeHours = Math.floor(maxAge / 3600);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Sign in to Red Cat Multiverse</title>
        <style>
          /* Base styles */
          body {
            background-color: #f6f9fc;
            font-family: 'Open Sans', 'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            font-size: 16px;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
          }
          .container {
            background-color: #ffffff;
            border-radius: 8px;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            padding: 20px 0;
          }
          .brand {
            color: #314158;
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          .tagline {
            color: #122631;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 30px;
          }
          .button {
            background-color: #f5ad1b;
            border-radius: 8px;
            color: #122631;
            display: inline-block;
            font-weight: 600;
            margin: 20px 0;
            padding: 12px 24px;
            text-decoration: none;
          }
          .footer {
            border-top: 1px solid #e1e1e1;
            color: #8e8e8e;
            font-size: 12px;
            margin-top: 30px;
            padding-top: 20px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="brand">Red Cat Multiverse</div>
            <div class="tagline">Level up your soft skills with the Red Cat Multiverse</div>
          </div>

          <p>Hi there,</p>

          <p>Thank you for using Red Cat Multiverse. Here's your magic link to securely sign in:</p>

          <div style="text-align: center;">
            <a href="${url}" class="button">Sign in to Red Cat Multiverse</a>
          </div>

          <p>Just click the button above to access your account. This link will expire in ${maxAgeHours} hours for security reasons, so please use it soon!</p>

          <p>If you didn't request this link, you can ignore this email—your account is safe.</p>

          <p>Best regards,<br>Red Cat Multiverse</p>

          <div class="footer">
            <p>Copyright © ${new Date().getFullYear()} Red Cat Multiverse. All rights reserved.</p>
            <p>This email was sent to ${email} at your request.<br>
            If you did not make this request, please ignore this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: 'Your Magic Link to Sign In to Red Cat Multiverse',
    text: `Sign in to Red Cat Multiverse: ${url}\n\nThis link will expire in ${maxAgeHours} hours.`,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('SEND_VERIFICATION_EMAIL_ERROR', error);
  }
};

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
    }),
    EmailProvider({
      from: process.env.EMAIL_FROM,
      maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
      sendVerificationRequest,
    }),/*
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
    AzureADB2CProvider({
      tenantId: process.env.AZURE_AD_B2C_TENANT_NAME,
      clientId: process.env.AZURE_AD_B2C_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET,
      primaryUserFlow: process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW,
      authorization: { params: { scope: "offline_access openid" } },
    }),*/
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request', // Set path to your custom verify request page (for email verification)
  },
  callbacks: {
    async signIn({ user, account }) {
      const email = user?.email?.toLowerCase();
      
      if (!email) {
        console.log('🔴 [Auth] Sign in failed: No email provided');
        return false;
      }

      const isAllowed = isEmailAllowed(email);
      
      console.log('🔵 [Auth] SignIn Callback:', {
        provider: account?.provider,
        userId: user?.id,
        email: email,
        isAllowed: isAllowed
      });

      return isAllowed;
    },

    async jwt({ token }) {
      console.log('🔵 [Auth] JWT Callback:', {
        userId: token.sub
      });
      return token;
    },

    async session({ session, token }) {
      console.log('🔵 [Auth] Session Callback:', {
        userId: token.sub,
        email: session.user?.email
      });

      // Add the user ID to the session
      if (session.user) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
};

export default authOptions;
