import { styled } from "@mui/material";
// import SimpleTable from "./SimpleTable";
// import PaginationTable from "./PaginationTable"; //one
// import { SimpleCard } from "app/components";
import Analytics from "./Analytics";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "0px",//30
  [theme.breakpoints.down("sm")]: { margin: "0px" },//16
  "& .breadcrumb": {
    marginBottom: "0px",//30
    [theme.breakpoints.down("sm")]: { marginBottom: "0px" }//16
  }
}));

export default function AppGroup() {
  return (
    <Container className="p-0 m-0">
      {/* <Box className="breadcrumb">
      { name: "Material", path: "/material" },
        <Breadcrumb routeSegments={[ { name: "Table" }]} />
      </Box> */}

      {/* <SimpleCard title="Simple Table">
        <SimpleTable />
      </SimpleCard> */}

      {/* <SimpleCard title={<span style={{ textAlign: "left", display: "block" }}>ANPR</span>}> */}
        <Analytics />
      {/* </SimpleCard> */}
    </Container>
  );
}
