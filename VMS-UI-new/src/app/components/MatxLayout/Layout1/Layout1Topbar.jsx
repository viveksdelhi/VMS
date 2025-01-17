import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  styled,
  Avatar,
  useTheme,
  MenuItem,
  IconButton,
  useMediaQuery,
} from "@mui/material";

import Cookies from "js-cookie";
import useSettings from "app/hooks/useSettings";
import { Span } from "app/components/Typography";
import { MatxMenu } from "app/components";
import { themeShadows } from "app/components/MatxTheme/themeColors";

import profile from "../../../../assets/Image/ajimg/profile.png";
import { topBarHeight } from "app/utils/constant";

import { Menu, Person, PowerSettingsNew } from "@mui/icons-material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import axios from "axios";
import { CreditAPI } from "serverConnection";

// STYLED COMPONENTS
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const TopbarRoot = styled("div")({
  top: 0,
  zIndex: 96,
  height: topBarHeight,
  boxShadow: themeShadows[8],
  transition: "all 0.3s ease",
});

const TopbarContainer = styled(Box)(({ theme }) => ({
  padding: "8px",
  paddingLeft: 18,
  paddingRight: 20,
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: theme.palette.primary.main,
  [theme.breakpoints.down("sm")]: { paddingLeft: 16, paddingRight: 16 },
  [theme.breakpoints.down("xs")]: { paddingLeft: 14, paddingRight: 16 },
}));

const UserMenu = styled(Box)({
  padding: 4,
  display: "flex",
  borderRadius: 24,
  cursor: "pointer",
  alignItems: "center",
  "& span": { margin: "0 8px" },
});

const StyledItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  minWidth: 185,
  "& a": {
    width: "100%",
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  "& span": { marginRight: "10px", color: theme.palette.text.primary },
}));

// Get cookies for user information

const Layout1Topbar = () => {
  const [credit, setCredit] = useState(null);
  const navigate = useNavigate();
  const username = Cookies.get("username");
  const user_id = Cookies.get("user_id");

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("user_id");
    Cookies.remove("username");
    navigate("/");
  };

  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));

  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({
      layout1Settings: { leftSidebar: { ...sidebarSettings } },
    });
  };

  const handleSidebarToggle = () => {
    let { layout1Settings } = settings;
    let mode;
    if (isMdScreen) {
      mode = layout1Settings.leftSidebar.mode === "close" ? "mobile" : "close";
    } else {
      mode = layout1Settings.leftSidebar.mode === "full" ? "close" : "full";
    }
    updateSidebarMode({ mode });
  };

  useEffect(() => {
    const fetchCredit = async () => {
      try {
        const response = await axios.get(`${CreditAPI}/event_credit`);
        const data = response.data.event_credits;
        const latestCredit = data
          .filter((credit) => credit.entity_id === parseInt(user_id, 10))
          .map((credit) => credit.available_credit)
          .pop();
        setCredit(latestCredit);
      } catch (error) {
        console.error("Error fetching credit data:", error);
      }
    };
    fetchCredit();
  }); // Dependency array to avoid infinite loops

  return (
    <TopbarRoot>
      <TopbarContainer sx={{ backgroundColor: "#F5F5F7" }}>
        <Box display="flex">
          <StyledIconButton className="text-dark" onClick={handleSidebarToggle}>
            <Menu />
          </StyledIconButton>
        </Box>

        <Box display="flex" alignItems="center">
          <MatxMenu
            menuButton={
              <UserMenu>
                <Avatar src={profile} sx={{ cursor: "pointer" }} />
              </UserMenu>
            }
          >
            <StyledItem>
              <Link to="/dashboard">
                <Person />
                <Span>{username}</Span>
              </Link>
            </StyledItem>
            <StyledItem>
              <Link to="/dashboard">
                <CreditCardIcon />
                <Span>
                  {credit !== null ? `${credit}` : "No available credit"}
                </Span>
              </Link>
            </StyledItem>
            <StyledItem>
              <PowerSettingsNew />
              <Span onClick={handleLogout}>Logout</Span>
            </StyledItem>
          </MatxMenu>
        </Box>
      </TopbarContainer>
    </TopbarRoot>
  );
};

export default Layout1Topbar;
