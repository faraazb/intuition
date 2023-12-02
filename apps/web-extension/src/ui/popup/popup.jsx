import "../../hmr/enableDevHmr";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./popup.scss";
import { router } from "./router";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./store";
import {
  fetchThemeFromExtensionLocalStorage,
  selectTheme,
} from "./store/slices/settings";

const Content = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  useEffect(() => {
    dispatch(fetchThemeFromExtensionLocalStorage());
  }, []);

  return (
    <div id="popup" className={theme ? theme.value : ""}>
      <RouterProvider router={router} />
    </div>
  );
};

export const Popup = () => {
  return <Content />;
};

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Popup />
    </Provider>
  </React.StrictMode>
);
