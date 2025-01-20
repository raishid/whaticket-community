import { useState, useContext, useEffect } from "react";
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  MenuItem,
  IconButton,
  Menu,
  Switch,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Brightness4Icon from "@mui/icons-material/Brightness4";

import MainListItems from "./MainListItems";
import NotificationsPopOver from "../components/NotificationsPopOver";
import UserModal from "../components/UserModal";
import { AuthContext } from "../context/Auth/AuthContext";
import BackdropLoading from "../components/BackdropLoading";
import { i18n } from "../translate/i18n";
import { useThemeContext } from "../context/DarkMode";
import type { ReactNode } from "react";

const drawerWidth = 240;

const RootStyles = styled("div")(({ theme }) => ({
  display: "flex",
  height: "100vh",
  [theme.breakpoints.down("sm")]: {
    height: "calc(100vh - 56px)",
  },
}));

const ToolbarStyled = styled(Toolbar)({
  paddingRight: 24,
});

const ToolbarIconStyled = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: "0 8px",
  minHeight: "48px",
});

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: theme.palette.background.default,
}));

const ContentStyled = styled("main")({
  flex: 1,
  overflow: "auto",
});

const SwitchStyled = styled(Switch)({
  transform: "scale(0.8)",
});

const TitleStyled = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  color: theme.palette.text.primary,
}));

const AppBarSpacerStyled = styled("div")({
  minHeight: "48px",
});

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const NotificationsPopOverStyled = styled(NotificationsPopOver)(
  ({ theme }) => ({
    color: theme.palette.text.primary,
  })
);

const ThemeSwitchContainerStyled = styled("div")({
  display: "flex",
  alignItems: "center",
});

const ThemeIconStyled = styled(Brightness4Icon)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const DrawerPaperStyled = styled(Drawer)(({ theme }) => ({
  position: "relative",
  whiteSpace: "nowrap",
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  backgroundColor: theme.palette.background.paper,
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: theme.palette.background.paper,
  },
}));

const DrawerPaperStyledClose = styled(Drawer)(({ theme }) => ({
  overflowX: "hidden",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: theme.spacing(7),
  [theme.breakpoints.up("sm")]: {
    width: theme.spacing(9),
  },
  "& .MuiDrawer-paper": {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
}));

const AppBarShiftStyled = styled(AppBar)(({ theme }) => ({
  marginLeft: drawerWidth,
  width: `calc(100% - ${drawerWidth}px)`,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
}));

const MenuButtonStyled = styled(IconButton)(({ theme }) => ({
  marginRight: 36,
  color: theme.palette.text.primary,
}));

const MenuButtonHiddenStyled = styled(IconButton)({
  display: "none",
});

const LoggedInLayout = ({ children }: { children: ReactNode }) => {
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { handleLogout, loading } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerVariant, setDrawerVariant] = useState<
    "permanent" | "temporary" | "persistent"
  >("permanent");
  const { user } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useThemeContext();

  useEffect(() => {
    if (document.body.offsetWidth > 600) {
      setDrawerOpen(true);
    }
  }, []);

  useEffect(() => {
    if (document.body.offsetWidth < 600) {
      setDrawerVariant("temporary");
    } else {
      setDrawerVariant("permanent");
    }
  }, [drawerOpen]);

  const handleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const handleOpenUserModal = () => {
    setUserModalOpen(true);
    handleCloseMenu();
  };

  const handleClickLogout = () => {
    handleCloseMenu();
    if (handleLogout) {
      handleLogout();
    }
  };

  const drawerClose = () => {
    if (document.body.offsetWidth < 600) {
      setDrawerOpen(false);
    }
  };

  if (loading) {
    return <BackdropLoading />;
  }

  return (
    <RootStyles>
      {drawerOpen} ? (
      <DrawerPaperStyled>
        <ToolbarIconStyled>
          <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
            <ChevronLeftIcon />
          </IconButton>
        </ToolbarIconStyled>
        <Divider />
        <List>
          <MainListItems drawerClose={drawerClose} />
        </List>
        <Divider />
      </DrawerPaperStyled>
      ) : (
      <DrawerPaperStyledClose>
        <ToolbarIconStyled>
          <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
            <ChevronLeftIcon />
          </IconButton>
        </ToolbarIconStyled>
        <Divider />
        <List>
          <MainListItems drawerClose={drawerClose} />
        </List>
        <Divider />
      </DrawerPaperStyledClose>
      )
      <UserModal
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        userId={user?.id}
      />
      {drawerOpen} ? (
      <AppBarShiftStyled>
        <ToolbarStyled variant="dense">
          {drawerOpen} ? (
          <MenuButtonHiddenStyled
            edge="start"
            aria-label="open drawer"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <MenuIcon />
          </MenuButtonHiddenStyled>
          ): (
          <MenuButtonStyled
            edge="start"
            aria-label="open drawer"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <MenuIcon />
          </MenuButtonStyled>
          )
          <TitleStyled component="h1" variant="h6" noWrap>
            WhaTicket
          </TitleStyled>
          <ThemeSwitchContainerStyled>
            <ThemeIconStyled />
            <SwitchStyled
              checked={darkMode}
              onChange={toggleTheme}
              color="default"
            />
          </ThemeSwitchContainerStyled>
          {/* @ts-ignore */}
          {user.id && <NotificationsPopOverStyled />}
          <div>
            <IconButtonStyled
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
            >
              <AccountCircle />
            </IconButtonStyled>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              // getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={menuOpen}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={handleOpenUserModal}>
                {i18n.t("mainDrawer.appBar.user.profile")}
              </MenuItem>
              <MenuItem onClick={handleClickLogout}>
                {i18n.t("mainDrawer.appBar.user.logout")}
              </MenuItem>
            </Menu>
          </div>
        </ToolbarStyled>
      </AppBarShiftStyled>
      ) : (
      <AppBarStyled>
        <ToolbarStyled variant="dense">
          {drawerOpen} ? (
          <MenuButtonHiddenStyled
            edge="start"
            aria-label="open drawer"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <MenuIcon />
          </MenuButtonHiddenStyled>
          ): (
          <MenuButtonStyled
            edge="start"
            aria-label="open drawer"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <MenuIcon />
          </MenuButtonStyled>
          )
          <TitleStyled component="h1" variant="h6" noWrap>
            WhaTicket
          </TitleStyled>
          <ThemeSwitchContainerStyled>
            <ThemeIconStyled />
            <SwitchStyled
              checked={darkMode}
              onChange={toggleTheme}
              color="default"
            />
          </ThemeSwitchContainerStyled>
          {/* @ts-ignore */}
          {user.id && <NotificationsPopOverStyled />}
          <div>
            <IconButtonStyled
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
            >
              <AccountCircle />
            </IconButtonStyled>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              // getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={menuOpen}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={handleOpenUserModal}>
                {i18n.t("mainDrawer.appBar.user.profile")}
              </MenuItem>
              <MenuItem onClick={handleClickLogout}>
                {i18n.t("mainDrawer.appBar.user.logout")}
              </MenuItem>
            </Menu>
          </div>
        </ToolbarStyled>
      </AppBarStyled>
      )
      <ContentStyled>
        <AppBarSpacerStyled />
        {children ? children : null}
      </ContentStyled>
    </RootStyles>
  );
};

export default LoggedInLayout;
