import { lazy } from "react";
import locales from "./locales";
import routes from "./routes";
import themes from "./themes";
import parseLanguages from "base-shell/lib/utils/locale";
import Loading from "../components/Loading/Loading";

const config = {
  containers: {
    LayoutContainer: lazy(() =>
      import("material-ui-shell/lib/containers/LayoutContainer/LayoutContainer")
    ),
  },
  components: {
    Loading,
    Menu: lazy(() => import("material-ui-shell/lib/containers/Menu/Menu")),
  },
  auth: {
    signInURL: "/signin",
  },
  pwa: {
    useiOSPWAPrompt: true,
    iOSPWAPromptProps: {},
  },
  routes,
  locale: {
    locales,
    defaultLocale: parseLanguages(["tr","en"], "tr"),
    onError: (e) => {
      // Here we warn the user about translation error
      //console.warn(e)
      return;
    },
  },
  menu: {
    width: 240,
    offlineIndicatorHeight: 12,
    initialAuthMenuOpen: false,
    initialMiniMode: false,
    initialMenuOpen: false,
    initialMobileMenuOpen: false,
    initialMiniSwitchVisibility: false,
    MenuHeader: lazy(() =>
      import("material-ui-shell/lib/components/MenuHeader/MenuHeader")
    ),
    MenuContent: lazy(() => import("../components/Menu/MenuContent")),
    useWindowWatcher: false,
  },
  theme: {
    themes,
    defaultThemeID: "default",
    defaultIsDarkMode: true,
    defaultIsRTL: false, //change this to true for default Right to Left Language support
  },
  pages: {
    LandingPage: lazy(() => import("../pages/LandingPage/LandingPage")),
    PageNotFound: lazy(() => import("../pages/PageNotFound/PageNotFound")),
  },
};

export default config;
