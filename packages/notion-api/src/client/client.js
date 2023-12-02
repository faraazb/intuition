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
        "Accept": "*/*",
        "x-notion-active-user-header": userId,
        "Content-Type": "application/json",
      },
      method: "post",
      withCredentials: true,
    });

    this.cache = {};
  }

  async getRecentPageVisits({ spaceId, userId }) {
    const response = await this.client("getRecentPageVisits", {
      json: {
        spaceId,
        userId,
      },
    }).json();
    return response;
  }

  async getSpaces() {
    if ("getSpaces" in this.cache) {
      return this.cache.getSpaces;
    }
    const response = await this.client("getSpaces").json();
    this.cache.getSpaces = response;
    return response;
  }

  async getCollection({ id, spaceId }) {
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
    }).json();
    return response;
  }

  async createPageInCollection({ userId, spaceId, collectionId, properties }) {
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
  }

  async searchCollections({ query, spaceId, limit = 20 }) {
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
  }
}
