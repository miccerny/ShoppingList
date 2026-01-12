
/**
 * Custom HTTP request error.
 *
 * Responsibilities:
 * - Represents an HTTP error returned from a fetch request.
 * - Extends the native Error object with HTTP-specific metadata.
 *
 * Note:
 * This error type allows higher layers (services, components)
 * to react differently based on HTTP status codes.
 */
export class HttpRequestError extends Error {
   /**
     * Creates a new HttpRequestError instance.
     *
     * @param {string} message Human-readable error message
     * @param {Response} response Fetch API Response object
     *
     * My note:
     * The full response object is stored to allow detailed
     * error handling (status, headers, body if needed).
     */
    constructor(message, response) {
      // Explicitly set error name for easier identification
    super(message);
    // Original fetch Response object
    this.name = "HttpRequestError";
    this.response = response;

     // Convenience properties for quick access
    this.statusCode = response.status;
    this.statusText = response.statusText;
  }
}