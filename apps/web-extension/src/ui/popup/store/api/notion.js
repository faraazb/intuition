import { createApi, retry } from "@reduxjs/toolkit/query/react";

const browser = chrome;

const sendMessage = async ({ action, payload }) => {
  try {
    const response = await browser.runtime.sendMessage({ action, payload });
    return response;
  } catch (error) {
    console.error("Intuition:", error);
    return { error: { data: { message: error.message } } };
  }
};

const sendQueryMessage = () => sendMessage;

export const background = createApi({
  reducerPath: "notion",
  baseQuery: retry(sendMessage),
  tagTypes: ["Space"],
  endpoints: (build) => ({
    getUser: build.query({
      query: () => ({ action: "getUser" }),
    }),
    getUsers: build.query({
      query: () => ({ action: "getUsers" }),
    }),
    getSpace: build.query({
      query: () => ({ action: "getSpace" }),
      providesTags: ["Space"],
    }),
    setSpace: build.mutation({
      query: ({ userId, spaceId }) => ({
        action: "setSpace",
        payload: { userId, spaceId },
      }),
      invalidatesTags: ["Space"],
    }),
    getSpaces: build.query({
      query: () => ({ action: "getSpaces" }),
    }),
    getRecentCollections: build.query({
      query: ({ userId, spaceId }) => ({
        action: "getRecentCollections",
        payload: { userId, spaceId },
      }),
    }),
    getCollection: build.query({
      query: ({ id, spaceId }) => ({
        action: "getCollection",
        payload: { id, spaceId },
      }),
    }),
    createPageInCollection: build.mutation({
      query: ({ userId, spaceId, collectionId, properties }) => ({
        action: "createPageInCollection",
        payload: { userId, spaceId, collectionId, properties },
      }),
    }),
    searchCollections: build.query({
      query: ({ query, spaceId, limit }) => ({
        action: "searchCollections",
        payload: { query, spaceId, limit },
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useGetSpacesQuery,
  useSetSpaceMutation,
  useGetSpaceQuery,
  useGetRecentCollectionsQuery,
  useGetCollectionQuery,
  useCreatePageInCollectionMutation,
  useSearchCollectionsQuery,
} = background;
