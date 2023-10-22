// import { Notion } from "../api/notion";
import { NotionClient } from "@intuition/notion-api";
import "../hmr/enableDevHmr";

console.log("AddToNotion background.js service is now running");

const browser = chrome;

// TODO Better error handling
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
  chrome.storage.local.get("theme").then((result) => {
    if (!result.theme) {
      chrome.storage.local.set({
        theme: { title: "Use system setting", value: "" },
      });
    }
  });
});

async function getCookie({ name, ...rest }) {
  let cookie = await browser.cookies.get({
    name: name,
    url: "https://www.notion.so/",
    ...rest,
  });
  // console.log(cookie)
  if (cookie) return cookie.value;
}

let client;

(async function () {
  const token = await getCookie({ name: "token_v2" });
  const userId = await getCookie({ name: "notion_user_id" });

  client = new NotionClient({ token, userId });

  // console.log(await getRecentCollections({spaceId: "a99691de-ae21-4802-bd1d-9cb351aaa53c", userId}))

  // const response = await client.getSpaces()
  // console.log(response)

  // const { store, notionApi } = configureNotionStore({ client })
  // const dispatch = store.dispatch;

  // async function getUsers() {
  //     const spaceId = "a99691de-ae21-4802-bd1d-9cb351aaa53c"
  //     const response = await dispatch(notionApi.endpoints.getRecentPageVisits.initiate({userId, spaceId}));
  //     console.log(response);
  //     console.log(store.getState())
  // }

  // getUsers();
})();
// const token = getCookie({ name: "token_v2" }).then((value) => value);
// const userId = getCookie({ name: "notion_user_id" }).then((value) => value);

async function getRecentCollections({ spaceId, userId }) {
  const response = await client.getRecentPageVisits({ spaceId, userId });
  const collectionRecordMap = response?.recordMap?.collection;
  if (!collectionRecordMap) {
    return {};
  }
  const collections = {};
  Object.entries(collectionRecordMap).forEach(([collectionId, item]) => {
    if (item?.value) {
      collections[collectionId] = item?.value;
    }
  });
  return collections;
}

async function getUsers() {
  const response = await client.getSpaces();
  const users = {};

  Object.entries(response).forEach(([userId, record]) => {
    const user = record?.notion_user[userId].value;
    const spaceIds = "space" in record ? Object.keys(record.space) : [];
    user.spaces = spaceIds;
    users[userId] = user;
  });
  return users;
}

async function getSpaces() {
  const response = await client.getSpaces();
  const spaces = {};
  Object.entries(response).forEach(([userId, record]) => {
    if ("space" in record) {
      Object.entries(record.space).forEach(([spaceId, space]) => {
        spaces[spaceId] = space.value;
      });
    }
  });
  return spaces;
}

async function getUser() {
  const userId = await getCookie({ name: "notion_user_id" });
  const users = await getUsers();
  if (!userId || !users) {
    return { error: { name: "NOT_LOGGED_IN" } };
  }
  return users[userId];
}

async function getSpace() {
  const result = await browser.storage.local.get("notion_space");
  const spaces = await getSpaces();
  if (!("notion_space" in result)) {
    const user = await getUser();
    const users = await getUsers();
    if (!user.id || !spaces || !users) {
      return { error: { name: "NO_SPACE" } };
    }
    const spaceIds = users[user.id]?.spaces;
    return spaces[spaceIds[0]];
  }
  return spaces[result.notion_space];
}

async function getCollection({ id, spaceId }) {
  const response = await client.getCollection({ id, spaceId });
  const collection = response?.recordMap?.collection[id]?.value;

  // After title field, url fields must be shown, then text and so on.
  let columnOrder = {
    title: 1,
    url: 2,
    text: 3,
    multi_select: 4,
    select: 5,
  };

  const getColumnOrder = (type) => {
    if (columnOrder.hasOwnProperty(type)) {
      return columnOrder[type];
    }
    // phone, email, status, date
    return 5;
  };

  if (collection.hasOwnProperty("schema")) {
    let schemaOrder = Object.keys(collection.schema).sort((a, b) => {
      return (
        getColumnOrder(collection.schema[a].type) -
        getColumnOrder(collection.schema[b].type)
      );
    });
    collection.schemaOrder = schemaOrder;
  }

  return collection;
}

async function createPageInCollection({
  userId,
  spaceId,
  collectionId,
  properties,
}) {
  try {
    await client.createPageInCollection({
      userId,
      spaceId,
      collectionId,
      properties,
    });
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

async function searchCollections({ query, spaceId, limit }) {
  // here the response will have a key - results, whose value is
  // an array of objects which have a key collectionId
  const collections = {};
  const response = await client.searchCollections({ query, spaceId, limit });
  if (!response.total) {
    return { error: "No results found" };
  }
  const recordMapCollections = response?.recordMap?.collection;
  response.results.forEach((result) => {
    if (
      "collectionId" in result &&
      result.collectionId in recordMapCollections
    ) {
      collections[result.collectionId] =
        recordMapCollections[result.collectionId].value;
    }
  });
  return collections;
}

const handler = {
  getSpaces,
  getUsers,
  getUser,
  getSpace,
  getRecentCollections,
  getCollection,
  createPageInCollection,
  searchCollections,
  getCookie,
};

async function handleMessage({ action, payload }) {
  const handle =
    typeof payload !== "undefined"
      ? handler[action](payload)
      : handler[action]();

  return new Promise((resolve, reject) => {
    handle.then(resolve).catch(reject);
  });
}

// error handling, any handler function can simply throw an error
// filtering and presentation layer changes can be done below
// e.g. user facing errors

browser.runtime.onMessage.addListener(
  ({ action, payload }, sender, sendResponse) => {
    // console.log(action, props);
    console.log(action, payload);
    if (handler.hasOwnProperty(action)) {
      console.log(action, payload, "handler found");
      handleMessage({ action, payload })
        .then((v) => sendResponse(v.error ? v : { data: v }))
        .catch((error) => {
          console.log(error)
          sendResponse({ error: error.message, internal: true });
        });
      // keep messaging channel open (hack for Chromium)
      // on Firefox promises can be returned directly
      return true;
    }
  }
);