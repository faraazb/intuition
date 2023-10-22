import { configureStore } from "@reduxjs/toolkit";
import { background } from "./api/notion";
import { settingsReducer } from "./slices/settings";

const store = configureStore({
  reducer: {
    [background.reducerPath]: background.reducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(background.middleware);
  },
});

export default store;
