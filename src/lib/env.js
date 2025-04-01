/**
 * Get the subdomain from the current URL
 * @returns {string|null} The subdomain or null if no subdomain
 */
export function getSubdomain() {
  if (typeof window === 'undefined') {
    // Server-side
    const host = process.env.HOST || '';
    const parts = host.split('.');
    if (parts.length > 2) {
      return parts[0].toUpperCase();
    }
    return null;
  }
  
  // Client-side
  const host = window.location.host;
  const parts = host.split('.');
  if (parts.length > 2) {
    return parts[0].toUpperCase();
  }
  return null;
}

/**
 * Get an environment variable value, checking for subdomain-specific override
 * @param {string} key The environment variable key
 * @param {string} defaultValue The default value if no override is found
 * @returns {string} The resolved environment variable value
 */
export function getEnvVar(key, defaultValue) {
  const subdomain = getSubdomain();
  if (subdomain) {
    const subdomainKey = `${subdomain}_${key}`;
    if (process.env[subdomainKey]) {
      return process.env[subdomainKey];
    }
  }
  return process.env[key] || defaultValue;
}

// Export commonly used environment variables with subdomain support
export const env = {
  appUrl: getEnvVar('APP_URL', 'http://localhost:1980'),
  nextAuthUrl: getEnvVar('NEXTAUTH_URL', 'http://localhost:1980'),
  googleClientId: getEnvVar('GOOGLE_CLIENT_ID', ''),
  googleClientSecret: getEnvVar('GOOGLE_CLIENT_SECRET', ''),
}; 