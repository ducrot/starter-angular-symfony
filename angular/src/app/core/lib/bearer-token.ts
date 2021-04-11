export function bearerTokenParse(header: string | null): BearerToken | null {
  if (!header) {
    return null;
  }
  const match = re_www_authenticate_bearer_token[Symbol.match](header);
  if (!match) {
    return null;
  }
  return {
    token: match[1] as string,
    error: match[2] as string,
    error_description: match[3] as string,
  };
}

interface BearerToken {
  token: string;
  error: string | null;
  error_description: string | null;
}

const re_www_authenticate_bearer_token = /Bearer token="([^"]+)"(?:, error="([^"]+)")?(?:, error_description="([^"]+)")?/;

