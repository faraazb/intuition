import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const themes = [
  {
    title: "Use system setting",
    value: "",
  },
  {
    title: "Light",
    value: "light",
  },
  {
    title: "Dark",
    value: "dark",
  },
];

const initialState = {
  theme: {
    fetchStatus: "idle",
    ...themes[0],
    options: themes,
  },
};

const browser = chrome;

export const fetchThemeFromExtensionLocalStorage = createAsyncThunk(
  "settings/fetchTheme",
  async (arg, { rejectWithValue }) => {
    const response = await browser.storage.local.get("theme");
    if (!response.theme) {
      rejectWithValue({ ...themes[0] });
    }
    return response.theme;
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      const { title, value } = action.payload;
      state.theme = {
        ...state.theme,
        title,
        value,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchThemeFromExtensionLocalStorage.fulfilled,
        (state, action) => {
          const { title, value } = action.payload;
          state.theme = {
            ...state.theme,
            fetchStatus: "success",
            title,
            value,
          };
        }
      )
      .addCase(
        fetchThemeFromExtensionLocalStorage.rejected,
        (state, action) => {
          const { title, value } = action.payload;
          state.theme = {
            ...state.theme,
            fetchStatus: "failed",
            title,
            value,
          };
        }
      );
  },
});

export const selectTheme = (state) => state.settings.theme;

export const { setTheme } = settingsSlice.actions;

const settingsReducer = settingsSlice.reducer;

export { settingsReducer };
