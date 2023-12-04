import { createMemoryRouter } from "react-router-dom";
import { Onboarding } from "./pages/home/onboarding";
import { Home } from "./pages/home/home";
import { Collection } from "./pages/collection/collection";
import { Saved } from "./pages/saved/saved";
import { Settings } from "./pages/settings/settings";
import { Spaces } from "./pages/spaces/spaces";
import { Login } from "./pages/home/login";

export const router = createMemoryRouter([
  {
    path: "/collection/:id",
    Component: () => <Collection />,
  },
  {
    path: "/spaces",
    Component: () => <Spaces />,
  },
  {
    path: "/saved",
    Component: () => <Saved />,
  },
  {
    path: "/settings",
    Component: () => <Settings />,
  },
  {
    path: "/onboarding",
    Component: () => <Onboarding />,
  },
  {
    path: "/login",
    Component: () => <Login />,
  },
  {
    path: "/",
    Component: () => <Home />,
  },
]);
