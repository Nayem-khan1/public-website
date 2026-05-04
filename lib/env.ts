type AppEnvironment = "development" | "staging" | "production";

const DEFAULT_LOCAL_SITE_URL = "http://localhost:3000";
const DEFAULT_LOCAL_API_BASE_URL = "http://localhost:5000/api/v1";

function normalizeAppEnvironment(): AppEnvironment {
  const rawEnvironment =
    process.env.NEXT_PUBLIC_APP_ENV ??
    process.env.APP_ENV ??
    process.env.VERCEL_ENV ??
    process.env.NODE_ENV;
  const environment = rawEnvironment?.trim().toLowerCase();

  if (!environment || environment === "local") {
    return "development";
  }

  if (
    environment === "development" ||
    environment === "staging" ||
    environment === "production"
  ) {
    return environment;
  }

  throw new Error(
    "Invalid environment configuration: NEXT_PUBLIC_APP_ENV must be development, staging, or production",
  );
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function normalizeApiBasePath(pathname: string): string {
  const trimmedPath = pathname.replace(/^\/+|\/+$/g, "");

  if (!trimmedPath) {
    return "/api/v1";
  }

  const path = `/${trimmedPath}`;

  if (path === "/api/v1" || path.endsWith("/api/v1")) {
    return path;
  }

  if (path === "/api" || path.endsWith("/api")) {
    return `${path}/v1`;
  }

  return `${path}/api/v1`;
}

function normalizeSiteUrl(rawValue: string | undefined): string {
  const value = rawValue?.trim();

  if (!value) {
    return DEFAULT_LOCAL_SITE_URL;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("invalid protocol");
    }

    url.pathname = stripTrailingSlash(url.pathname);
    url.search = "";
    url.hash = "";

    return stripTrailingSlash(url.toString());
  } catch {
    throw new Error(
      "Invalid environment configuration: NEXT_PUBLIC_SITE_URL must be a valid http(s) URL",
    );
  }
}

function normalizeConfiguredApiBaseUrl(
  rawValue: string | undefined,
  variableName: string,
): string {
  const value = rawValue?.trim();

  if (!value) {
    return "";
  }

  if (value.startsWith("/")) {
    return normalizeApiBasePath(value);
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("invalid protocol");
    }

    url.pathname = normalizeApiBasePath(url.pathname);
    url.search = "";
    url.hash = "";

    return stripTrailingSlash(url.toString());
  } catch {
    throw new Error(
      `Invalid environment configuration: ${variableName} must be an absolute http(s) URL or a same-origin path`,
    );
  }
}

function assertHttpsUrl(value: string, variableName: string): void {
  if (value.startsWith("/")) {
    return;
  }

  const url = new URL(value);

  if (url.protocol !== "https:") {
    throw new Error(
      `Invalid environment configuration: ${variableName} must use https in production`,
    );
  }
}

function toAbsoluteApiBaseUrl(value: string, siteUrl: string): string {
  if (!value.startsWith("/")) {
    return value;
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}${value}`;
  }

  return new URL(value, siteUrl).toString().replace(/\/+$/, "");
}

export const appEnvironment = normalizeAppEnvironment();
export const isProductionApp = appEnvironment === "production";

const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL,
);
const publicApiBaseUrl = normalizeConfiguredApiBaseUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL,
  "NEXT_PUBLIC_API_BASE_URL",
);
const serverApiBaseUrl = normalizeConfiguredApiBaseUrl(
  typeof window === "undefined" ? process.env.API_BASE_URL : undefined,
  "API_BASE_URL",
);

if (isProductionApp) {
  if (!process.env.NEXT_PUBLIC_SITE_URL?.trim()) {
    throw new Error(
      "Invalid environment configuration: NEXT_PUBLIC_SITE_URL is required in production",
    );
  }

  if (!process.env.NEXT_PUBLIC_API_BASE_URL?.trim()) {
    throw new Error(
      "Invalid environment configuration: NEXT_PUBLIC_API_BASE_URL is required in production",
    );
  }

  assertHttpsUrl(siteUrl, "NEXT_PUBLIC_SITE_URL");
  assertHttpsUrl(publicApiBaseUrl, "NEXT_PUBLIC_API_BASE_URL");
}

export function getSiteUrl(): string {
  return siteUrl;
}

export function getApiBaseUrl(): string {
  const configuredApiBaseUrl =
    typeof window === "undefined"
      ? serverApiBaseUrl || publicApiBaseUrl
      : publicApiBaseUrl;

  return toAbsoluteApiBaseUrl(
    configuredApiBaseUrl || DEFAULT_LOCAL_API_BASE_URL,
    siteUrl,
  );
}
