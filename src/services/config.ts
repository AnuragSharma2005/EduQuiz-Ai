export function getBackendOrigin(): string {
  try {
    // 1. Environment variable override for deployed builds
    const envApiUrl = (import.meta as any)?.env?.VITE_API_URL;
    if (envApiUrl) {
      return envApiUrl.replace(/\/$/, '');
    }

    // 2. Allow local override via localStorage (key: "BACKEND_URL" or "backend_url")
    if (typeof window !== 'undefined' && window.localStorage) {
      const override = window.localStorage.getItem('BACKEND_URL') || window.localStorage.getItem('backend_url');
      if (override) return override.replace(/\/$/, '');
    }

    if (typeof window === 'undefined') {
      return 'https://eduquiz-ai-knia.onrender.com';
    }

    const host = window.location.hostname;

    // 3. Local development environment
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.startsWith('192.168.') ||
      host.startsWith('10.') ||
      host.startsWith('172.') ||
      host === ''
    ) {
      return 'http://localhost:5001';
    }

    // 4. Production deployment environment (Render / Vercel / Netlify)
    return 'https://eduquiz-ai-knia.onrender.com';
  } catch (err) {
    return 'https://eduquiz-ai-knia.onrender.com';
  }
}

export function getApiBase(): string {
  return `${getBackendOrigin().replace(/\/$/, '')}/api`;
}

export function getFrontendOrigin(): string {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin;
  }
  return 'http://localhost:5173';
}
