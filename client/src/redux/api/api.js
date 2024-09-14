import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../components/constants/config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
  tagTypes: ["Chats", "User"],
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

    })
  }),
});

export default api;
export const { useMyChatsQuery, useLazySearchUserQuery,useSendFriendRequestMutation } = api;
