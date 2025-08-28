import { Card, Box, styled } from "@mui/material";

// STYLED COMPONENTS
const CardRoot = styled(Card)({
  height: "580px",
  padding: "20px 0px",
  marginTop: "-20px", 
  backgroundColor: "gray",
});

const CardTitle = styled("div")(({ subtitle }) => ({
  fontSize: "1rem",
  fontWeight: "500",
  textTransform: "capitalize",
  marginBottom: !subtitle && "16px",
}));

export default function SimpleCardvms({ children, title, subtitle }) {
  return (
    <CardRoot elevation={6}>
      <CardTitle subtitle={subtitle}>{title}</CardTitle>
      {subtitle && <Box mb={2}>{subtitle}</Box>}
      {children}
    </CardRoot>
  );
}
