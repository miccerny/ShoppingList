export class HttpRequestError extends Error {
    constructor(message, response) {
    super(message);
    this.name = "HttpRequestError";
    this.response = response;
  }
}