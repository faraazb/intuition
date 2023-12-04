export class NotionClientError extends Error {
  /**
   *
   * @param {any} response Error response data from Notion
   * @param  {...any} params
   */
  constructor(response, error = {}, ...params) {
    let message = error?.message ?? "unknown error";

    if (error.name === "HTTPError") {
      const notionErrorName = response?.name ?? "unknown error";
      const notionErrorMessage = response?.message ?? "";
      const notionDebugMessage = response?.debugMessage ?? "";
      // TODO better message formatting
      message = `${notionErrorName} - ${notionErrorMessage} - ${notionDebugMessage}`;
    }
    super(message, ...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotionClientError);
    }

    this.name = "NotionClientError";
    this.response = response;
  }
}
