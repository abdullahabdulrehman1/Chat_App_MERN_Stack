import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../components/constants/config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
  tagTypes: ["Chats", "User", "Message"],
  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({
        url: `chats/my`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Chats"],
    }),
    searchUser: builder.query({
      query: (name) => ({
        url: `users/search?name=${name}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    sendFriendRequest: builder.mutation({
      query: (id) => ({
        url: `users/sendrequest`,
        method: "PUT",
        credentials: "include",
        body: id,
      }),
      invalidatesTags: ["User"],
    }),
    getNotifications: builder.query({
      query: () => ({
        url: `users/notifications`,
        method: "GET",
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),
    acceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: `users/acceptrequest`,
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Chats"],
    }),
    chatsDetails: builder.query({
      query: ({ chatId, populate = false }) => {
        let url = `chats/${chatId}`;
        if (populate) url += `?populate=true`;
        return {
          url,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["Chats"],
    }),
    getMessages: builder.query({
      query: ({ chatId, page }) => ({
        url: `chats/message/${chatId}?page=${page}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Message"],
    }),
  }),
});

export default api;
export const {
  useMyChatsQuery,
  useGetMessagesQuery,
  useChatsDetailsQuery,
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
  useGetNotificationsQuery,
  useAcceptFriendRequestMutation,
} = api;
