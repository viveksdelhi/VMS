import { Stack } from "@mui/material";
import { styled } from "@mui/material";
import { SimpleCard } from "app/components";
// import SimpleForm from "./SimpleForm";
import Recording from "./Recording";
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
    <Container className="container-fluid p-0 m-0">
      {/* <Box className="breadcrumb">
      { name: "Material", path: "/material" },
        <Breadcrumb routeSegments={[ { name: "Form" }]} />
      </Box> */}

        <SimpleCard title={<span style={{ textAlign: "left", display: "block" }}>Recordings</span>}>
          <Recording />
        </SimpleCard>

        {/* <SimpleCard title="stepper form">
          <StepperForm />
        </SimpleCard> */}
    </Container>
  );
}
