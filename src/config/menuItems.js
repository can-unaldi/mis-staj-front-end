import React from "react";
import {
  AccountBox as AccountBoxIcon,
  ChatBubble,
  ChromeReaderMode,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  FilterList,
  FormatTextdirectionRToL as RTLIcon,
  FormatTextdirectionLToR as LTRIcon,
  GetApp,
  InfoOutlined,
  Language as LanguageIcon,
  Lock as LockIcon,
  MenuOpen as MenuOpenIcon,
  QuestionAnswer,
  SettingsApplications as SettingsIcon,
  Style as StyleIcon,
  Tab,
  ViewList,
  Web,
} from "@mui/icons-material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

import allLocales from "./locales";
import allThemes from "./themes";

const getMenuItems = (props) => {
  const {
    intl,
    updateLocale,
    locale,
    menuContext,
    themeContext,
    auth: authData,
  } = props;
  const { toggleThis, isDesktop, isAuthMenuOpen, isMiniSwitchVisibility } =
    menuContext;
  const { themeID, setThemeID } = themeContext;

  const { auth, setAuth } = authData;
  console.log("Menu:", auth);

  const localeItems = allLocales.map((l) => {
    return {
      value: undefined,
      visible: true,
      primaryText: intl.formatMessage({ id: l.locale }),
      onClick: () => {
        updateLocale(l.locale);
      },
      leftIcon: <LanguageIcon />,
    };
  });

  const isAuthorised = auth.isAuthenticated;
  const userType = auth.userType;

  const themeItems = allThemes.map((t) => {
    return {
      value: undefined,
      visible: true,
      primaryText: intl.formatMessage({ id: t.id }),
      onClick: () => {
        setThemeID(t.id);
      },
      leftIcon: <StyleIcon style={{ color: t.color }} />,
    };
  });

  return [
    {
      value: "/home",
      visible: isAuthorised,
      primaryText: intl.formatMessage({ id: "home" }),
      leftIcon: <DashboardIcon />,
    },
    {
      value: "/application-process",
      visible: isAuthorised && userType === 0,
      primaryText: intl.formatMessage({ id: "InternshipApplicationProcess" }),
      leftIcon: <FormatListBulletedIcon />,
    },
    {
      value: "/internships",
      visible: isAuthorised && userType === 0,
      primaryText: intl.formatMessage({ id: "Internships" }),
      leftIcon: <FormatListBulletedIcon />,
    },
    {
      value: "/old-internships",
      visible: isAuthorised && userType === 0,
      primaryText: intl.formatMessage({ id: "OldInternships" }),
      leftIcon: <FormatListBulletedIcon />,
    },
    {
      value: "/approved-internships",
      visible: isAuthorised && userType === 3,
      primaryText: intl.formatMessage({ id: "ApprovedInternships" }),
      leftIcon: <FormatListBulletedIcon />,
    },
    {
      value: "/admin/finished-internships",
      visible: isAuthorised && userType === 4,
      primaryText: intl.formatMessage({ id: "FinishedInternships" }),
      leftIcon: <FormatListBulletedIcon />,
    },
    { divider: true,
      visible: isAuthorised,
    },
    {
      value: "/my_account",
      visible: isAuthorised && userType === 0,
      primaryText: intl.formatMessage({
        id: "my_account",
        defaultMessage: "My Account",
      }),
      leftIcon: <AccountBoxIcon />,
    },
    {
      primaryText: intl.formatMessage({ id: "settings" }),
      primaryTogglesNestedList: true,
      visible: isAuthorised,
      leftIcon: <SettingsIcon />,
      nestedItems: [
        {
          primaryText: intl.formatMessage({ id: "theme" }),
          secondaryText: intl.formatMessage({ id: themeID }),
          primaryTogglesNestedList: true,
          leftIcon: <StyleIcon />,
          nestedItems: themeItems,
        },
        {
          primaryText: intl.formatMessage({ id: "language" }),
          secondaryText: intl.formatMessage({ id: locale }),
          primaryTogglesNestedList: true,
          leftIcon: <LanguageIcon />,
          nestedItems: localeItems,
        },
        {
          visible: isDesktop ? true : false,
          onClick: () => {
            toggleThis("isMiniSwitchVisibility");
          },
          primaryText: intl.formatMessage({
            id: "menu_mini_mode",
          }),
          leftIcon: isMiniSwitchVisibility ? (
            <MenuOpenIcon />
          ) : (
            <ChromeReaderMode />
          ),
        },
      ],
    },
    {
      value: "/signin",
      onClick: isAuthorised
        ? () => {
            setAuth({ isAuthenticated: false });
          }
        : () => {},
      visible: true,
      primaryText: isAuthorised
        ? intl.formatMessage({ id: "sign_out" })
        : intl.formatMessage({ id: "sign_in" }),
      leftIcon: isAuthorised ? <ExitToAppIcon /> : <LockIcon />,
    },
  ];
};
export default getMenuItems;
