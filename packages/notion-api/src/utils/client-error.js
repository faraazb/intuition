export class NotionClientError extends Error {
  /**
   *
   * @param {any} response Error response data from Notion
   * @param  {...any} params
   */
  constructor(error = {}, ...params) {
    let message = error?.message ?? "NotionClient: Unknown error";
    if (!message) {
      const notionErrorName = error?.response?.name;
      const notionErrorMessage = error?.response?.message;
      message =
        notionErrorName &&
        notionErrorMessage &&
        `Notion API: ${notionErrorName} - ${notionErrorMessage}`;
    }
    super(message, ...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotionClientError);
    }

    this.name = "CustomError";
    this.response = error?.response;
  }
}
