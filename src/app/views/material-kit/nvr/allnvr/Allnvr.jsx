import { styled } from "@mui/material";
// import SimpleTable from "./SimpleTable";
import PaginationTable from "./PaginationTable"; //one
import { SimpleCard } from "app/components";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));

export default function Allnvr() {
  return (
    <Container className="container-fluid m-0 p-1">
      {/* <Box className="breadcrumb">
      { name: "Material", path: "/material" },
        <Breadcrumb routeSegments={[ { name: "Table" }]} />
      </Box> */}

      {/* <SimpleCard title="Simple Table">
        <SimpleTable />
      </SimpleCard> */}

      {/* <SimpleCard> */}
        <PaginationTable />
      {/* </SimpleCard> */}
    </Container>
  );
}
