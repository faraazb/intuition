// import Router, { route } from "preact-router";
// import { h, render, Fragment } from "preact";
// import { useEffect } from "preact/hooks";
// import browser from "webextension-polyfill";
// import history from "./pages/history";
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
// import { Home } from "./pages/home/home";
// import { Onboarding } from "./pages/home/onboarding";
// import NotionContext, { NotionProvider } from "../notionContext";
// import { Settings } from "./pages/settings/settings";
// import { Spaces } from "./pages/spaces/spaces";
// import { Collection } from "./pages/collection/collection";
// import { Saved } from "./pages/saved/saved";
// import { Login } from "./pages/home/login";
// import { useContext } from "preact/hooks";

const Content = () => {
  // const { theme } = useContext(NotionContext);

  // useEffect(() => {
  // 	console.log(theme);
  // }, [theme]);
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  useEffect(() => {
    console.log(theme);
  }, [theme]);

  useEffect(() => {
    dispatch(fetchThemeFromExtensionLocalStorage());
  }, []);

  return (
    <div id="popup" className={theme ? theme.value : ""}>
      <RouterProvider router={router} />
      {/* <Router history={history}>
				<Collection path="/collection/:id" />
				<Onboarding path="/onboarding" />
				<Settings path="/settings" />
				<Spaces path="/spaces" />
				<Saved path="/saved" />
				<Login path="/login" />
				<Home path="/" />
			</Router> */}
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
