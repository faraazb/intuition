import ky from "ky";
import { v4 } from "uuid";
import { createPageInCollection } from "../transactions";
import { NotionClientError } from "../utils/client-error";

const BASE_URL = "https://www.notion.so/api/v3/";

const Transactions = {
  createPageInCollection,
};

export class NotionClient {
  constructor({ userId }) {
    // TODO changing user ID function
    this.userId = userId;
    this.client = ky.create({
      prefixUrl: BASE_URL,
      headers: {
        Accept: "*/*",
        "x-notion-active-user-header": userId,
        "Content-Type": "application/json",
      },
      method: "post",
      withCredentials: true,
    });

    this.cache = {};
  }

  async getClientError(error) {
    if (error.name === "HTTPError") {
      const errorResponse = await error.response.json();
      return NotionClientError(errorResponse, error);
    }
    return error;
  }

  async getRecentPageVisits({ spaceId, userId }) {
    try {
      const response = await this.client("getRecentPageVisits", {
        json: {
          spaceId,
          userId,
        },
      });
      const body = await response.json();

      if (!response.ok) {
        throw new NotionClientError(body);
      }
      return body;
    } catch (error) {
      throw this.getClientError(error);
    }
  }

  async getSpaces() {
    if ("getSpaces" in this.cache) {
      return this.cache.getSpaces;
    }
    try {
      const response = await this.client("getSpaces");
      const body = await response.json();

      if (!response.ok) {
        throw new NotionClientError(body);
      }

      this.cache.getSpaces = body;
      return body;
    } catch (error) {
      throw this.getClientError(error);
    }
  }

  async getCollection({ id, spaceId }) {
    try {
      const body = {
        requests: [
          {
            pointer: {
              id,
              spaceId,
              table: "collection",
            },
            version: -1,
          },
        ],
      };
      const response = await this.client("syncRecordValues", {
        json: body,
      });
      const responseBody = await response.json();

      if (!response.ok) {
        throw new NotionClientError(body);
      }
      return responseBody;
    } catch (error) {
      throw this.getClientError(error);
    }
  }

  async createPageInCollection({ userId, spaceId, collectionId, properties }) {
    try {
      const time = new Date().valueOf();

      const page = { properties, time };

      const body = {
        requestId: v4(),
        transactions: [
          Transactions.createPageInCollection({
            userId,
            spaceId,
            collectionId,
            page,
          }),
        ],
      };

      const response = await this.client("saveTransactions", {
        json: body,
      });

      if (!response.ok) {
        throw new NotionClientError({ response });
      }

      return await response.json();
    } catch (error) {
      throw this.getClientError(error);
    }
  }

  async searchCollections({ query, spaceId, limit = 20 }) {
    try {
      const body = {
        type: "CollectionsInSpace",
        query,
        spaceId,
        limit,
        filters: {
          isDeletedOnly: false,
          excludeTemplates: true,
          navigableBlockContentOnly: true,
          requireEditPermissions: true,
          includePublicPagesWithoutExplicitAccess: false,
          ancestors: [],
          createdBy: [],
          editedBy: [],
          lastEditedTime: {},
          createdTime: {},
          inTeams: [],
        },
        sort: {
          field: "relevance",
        },
        source: "quick_find_input_change",
      };

      const response = await this.client("search", {
        json: body,
      });

      if (!response.ok) {
        throw new NotionClientError({ response });
      }

      return await response.json();
    } catch (error) {
      throw this.getClientError(error);
    }
  }
}
