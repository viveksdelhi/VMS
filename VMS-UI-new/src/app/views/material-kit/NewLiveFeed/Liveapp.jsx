import { styled } from "@mui/material";
// import LiveFeedGrid from "./LiveFeed";
// import SimpleCardvms from "./SimpleCardvms";
import VideoGrid from "./LiveFeed";
// import SimpleTable from "./SimpleTable";
// import { SimpleCard } from "app/components";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "0px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));

export default function Liveapp() {
  return (
    <Container>
    
    
      {/* <Box className="breadcrumb">
      { name: "Material", path: "/material" },
        <Breadcrumb routeSegments={[ { name: "Table" }]} />
      </Box> */}

      {/* <SimpleCard title="Simple Table">
        <SimpleTable />
      </SimpleCard> */}

      {/* <SimpleCard> */}
        {/* <LiveFeed /> */}
      {/* </SimpleCard> */}
      {/* <SimpleCardvms> */}
        {/* <LiveFeedGrid/> */}
        <VideoGrid/>
      {/* </SimpleCardvms> */}
      
    </Container>
  );
}
