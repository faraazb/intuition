import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

const browser = chrome;

const sendMessage = async ({ action, payload }) => {
  try {
    const response = await browser.runtime.sendMessage({ action, payload });
    // console.log(response)
    return response;
  } catch (error) {
    console.log("From popup", error);
    return { error };
  }
};

export const background = createApi({
  reducerPath: "notion",
  baseQuery: fakeBaseQuery,
  endpoints: (build) => ({
    getUser: build.query({
      queryFn: async () => await sendMessage({ action: "getUser" }),
    }),
    getUsers: build.query({
      queryFn: async () => await sendMessage({ action: "getUsers" }),
    }),
    getSpace: build.query({
      queryFn: async () => await sendMessage({ action: "getSpace" }),
    }),
    getSpaces: build.query({
      queryFn: async () => await sendMessage({ action: "getSpaces" }),
    }),
    getRecentCollections: build.query({
      queryFn: async ({ userId, spaceId }) =>
        await sendMessage({
          action: "getRecentCollections",
          payload: { userId, spaceId },
        }),
    }),
    getCollection: build.query({
      queryFn: async ({ id, spaceId }) =>
        await sendMessage({
          action: "getCollection",
          payload: { id, spaceId },
        }),
    }),
    createPageInCollection: build.mutation({
      queryFn: async ({ userId, spaceId, collectionId, properties }) =>
        await sendMessage({
          action: "createPageInCollection",
          payload: { userId, spaceId, collectionId, properties },
        }),
    }),
    searchCollections: build.query({
      queryFn: async ({query, spaceId, limit}) => 
        await sendMessage({
          action: "searchCollections",
          payload: { query, spaceId, limit },
        })
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useGetSpacesQuery,
  useGetSpaceQuery,
  useGetRecentCollectionsQuery,
  useGetCollectionQuery,
  useCreatePageInCollectionMutation,
  useSearchCollectionsQuery,
} = background;
