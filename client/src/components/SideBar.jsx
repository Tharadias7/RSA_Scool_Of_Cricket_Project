import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from '@mui/icons-material/Home';
import PaidIcon from '@mui/icons-material/Paid';
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SummarizeIcon from "@mui/icons-material/Summarize";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function SideBar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [inventoryOpen, setInventoryOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the user role from localStorage
  const userRole = localStorage.getItem("userRole");

  // Define the allowed routes based on userRole
  const allowedRoutes = {
    receptionist: [
      { path: "/home", icon: <HomeIcon />, label: "Home" },
      { path: "/Staff", icon: <GroupIcon />, label: "Staff" },
      { path: "/Player", icon: <SportsHandballIcon />, label: "Player" },
      { path: "/Attendance", icon: <AssignmentIcon />, label: "Attendance" },
      { path: "/Payment", icon: <PaidIcon />, label: "Payments" },
    ],
    inventoryManager: [
      { path: "/home", icon: <HomeIcon />, label: "Home" },
      { path: "/Staff", icon: <GroupIcon />, label: "Staff" },
      { path: "/Player", icon: <SportsHandballIcon />, label: "Player" },
      {
        path: "/Inventory",
        icon: <Inventory2Icon />,
        label: "Inventory",
        nested: [
          { path: "/Equipment", icon: <SportsCricketIcon />, label: "Equipment" },
          { path: "/Uniform", icon: <CheckroomIcon />, label: "Uniform" }
        ]
      },
    ],
    coach: [
      { path: "/home", icon: <HomeIcon />, label: "Home" },
      { path: "/Staff", icon: <GroupIcon />, label: "Staff" },
      { path: "/Player", icon: <SportsHandballIcon />, label: "Player" },
      {
        path: "/Inventory",
        icon: <Inventory2Icon />,
        label: "Inventory",
        nested: [
          { path: "/Equipment", icon: <SportsCricketIcon />, label: "Equipment" },
          { path: "/Uniform", icon: <CheckroomIcon />, label: "Uniform" }
        ]
      },
    ],
    manager: [
      { path: "/home", icon: <HomeIcon />, label: "Home" },
      { path: "/Staff", icon: <GroupIcon />, label: "Staff" },
      { path: "/Player", icon: <SportsHandballIcon />, label: "Player" },
      { path: "/Attendance", icon: <AssignmentIcon />, label: "Attendance" },
      { path: "/Payment", icon: <PaidIcon />, label: "Payments" },
      {
        path: "/Inventory",
        icon: <Inventory2Icon />,
        label: "Inventory",
        nested: [
          { path: "/Equipment", icon: <SportsCricketIcon />, label: "Equipment" },
          { path: "/Uniform", icon: <CheckroomIcon />, label: "Uniform" }
        ]
      },
    ],
  };

  // Get allowed menu items based on userRole
  const menuItems = allowedRoutes[userRole] || [];

  // Use useEffect to set inventoryOpen based on the current location
  React.useEffect(() => {
    const inventoryPaths = ["/Equipment", "/Uniform"];
    if (inventoryPaths.includes(location.pathname)) {
      setInventoryOpen(true);
    } else {
      setInventoryOpen(false);
    }
  }, [location.pathname]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Drawer variant="permanent" open={open}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: 2,
            paddingBottom: 2,
            paddingRight: 2,
          }}
        >
          <MenuIcon onClick={() => setOpen(!open)} style={{ color: "#791414" }}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </MenuIcon>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.label}>
              <ListItem
                disablePadding
                sx={{ display: "block" }}
                onClick={() => {
                  if (item.nested) {
                    setInventoryOpen(!inventoryOpen);
                  } else {
                    navigate(item.path);
                  }
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    backgroundColor: location.pathname === item.path ? '#791414' : 'inherit',
                    color: location.pathname === item.path ? '#ffffff' : 'inherit',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: location.pathname === item.path ? '#ffffff' : '#791414',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
                  {item.nested && (inventoryOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                </ListItemButton>
              </ListItem>
              {item.nested && inventoryOpen && (
                <Box sx={{ pl: 4 }}>
                  {item.nested.map((nestedItem) => (
                    <ListItem
                      key={nestedItem.label}
                      disablePadding
                      sx={{ display: "block" }}
                      onClick={() => {
                        navigate(nestedItem.path);
                      }}
                    >
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                          backgroundColor: location.pathname === nestedItem.path ? '#791414' : 'inherit',
                          color: location.pathname === nestedItem.path ? '#ffffff' : 'inherit',
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                            color: location.pathname === nestedItem.path ? '#ffffff' : '#791414',
                          }}
                        >
                          {nestedItem.icon}
                        </ListItemIcon>
                        <ListItemText primary={nestedItem.label} sx={{ opacity: open ? 1 : 0 }} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </Box>
              )}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
