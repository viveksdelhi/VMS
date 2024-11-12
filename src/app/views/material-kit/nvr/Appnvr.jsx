import { Stack } from "@mui/material";
import { styled } from "@mui/material";
import { SimpleCard } from "app/components";
import SimpleForm from "./SimpleForm";
// import StepperForm from "./StepperForm";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));

export default function Appnvr() {
  return (
    <Container>
      {/* <Box className="breadcrumb">
      { name: "Material", path: "/material" },
        <Breadcrumb routeSegments={[ { name: "Form" }]} />
      </Box> */}
        
      

        <SimpleCard title="NVR Details">
        <SimpleForm />
        </SimpleCard>
    </Container>
  );
}
