/**
 * API Client for Trivesa CRM Frontend
 * Handles all API requests with centralized error handling and configuration
 * Uses HTTP-only cookies for authentication (no localStorage)
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT || "10000", 10);

class APIClient {
  constructor() {
    this.baseURL = API_URL;
    this.timeout = API_TIMEOUT;
  }

  /**
   * Fetch wrapper with timeout support
   * Credentials are automatically included in every request (for HTTP-only cookies)
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      // Setup headers
      const headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      const response = await fetch(url, {
        ...options,
        headers,
        // CRITICAL: Include credentials so HTTP-only cookies are sent with every request
        credentials: "include",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-JSON responses
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Check if response is ok
      if (!response.ok) {
        throw new APIError(
          data?.message || "Request failed",
          response.status,
          data
        );
      }

      return { success: true, data, status: response.status };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof APIError) {
        throw error;
      }

      if (error.name === "AbortError") {
        throw new APIError("Request timeout", 408);
      }

      throw new APIError(error.message || "Network error", 0, error);
    }
  }

  /**
   * POST request
   */
  async post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    });
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: "GET",
      ...options,
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: "DELETE",
      ...options,
    });
  }
}

/**
 * Custom API Error class
 */
class APIError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.details = details;
  }
}

// Export singleton instance
export const apiClient = new APIClient();

/**
 * Custom API Error class
 */
class APIError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.details = details;
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Auth API methods (now uses HTTP-only cookies - no need to handle tokens)
export const authAPI = {
  login: (email, password) =>
    apiClient.post("/api/auth/login", { email, password }),

  logout: () =>
    apiClient.post("/api/auth/logout", {}),

  verify: () => apiClient.get("/api/auth/verify"),
};

export { APIError };
