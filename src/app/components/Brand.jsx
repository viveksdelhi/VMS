import { Box, styled } from "@mui/material";

import { Span } from "./Typography";
import logo from "../../assets/Image/ajimg/ajeevi.jpeg"
import useSettings from "app/hooks/useSettings";

// STYLED COMPONENTS
const BrandRoot = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px 18px 20px 29px"
}));

const StyledSpan = styled(Span)(({ mode }) => ({
  fontSize: 18,
  marginLeft: ".5rem",
  display: mode === "compact" ? "none" : "block"
}));

export default function Brand({ children }) {
  const { settings } = useSettings();
  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode } = leftSidebar;

  return (
    <BrandRoot>
      <Box display="flex" alignItems="center">
        {/* <img src={logo} height={25} width={80} alt="brand_logo"/> */}
        <StyledSpan mode={mode} className="sidenavHoverShow">
          <span style={{ border: "1px solid white", padding: "2px 3px", borderRadius: "5px" }}><strong style={{ color: "#E14A3B" }}>a</strong><span style={{ color: "#ffff" }}>jeevi</span></span> VMS
          {/* VMS */}
        </StyledSpan>
      </Box>
      <Box className="sidenavHoverShow" sx={{ display: mode === "compact" ? "none" : "block" }}>
        {children || null}
      </Box>
    </BrandRoot>
  );
}
