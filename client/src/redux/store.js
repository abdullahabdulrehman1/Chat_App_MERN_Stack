import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducer/auth,js";
import api from "./api/api.js";
import miscSlice from "./reducer/misc.js";
export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [api.reducerPath]: api.reducer,
    [miscSlice.name]: miscSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    api.middleware,
  ],
});
