import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../components/constants/config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
  tagTypes: ["Chats"],
  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({
        url: `chats/my`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Chats"],
    }),
  }),
});

export default api;
export const { useMyChatsQuery } = api;
