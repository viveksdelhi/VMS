import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API, CreditAPI } from "serverConnection";
import {
  Box,
  Button,
  Card,
  styled,
  TextField,
  // Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import Cookies from "js-cookie";

import backimg from "../../../../assets/Image/ajimg/loginbg.jpg";
import loginbody from "../../../../assets/Image/ajimg/loginbody.png";
import axios from "axios";
// styled components
const Auth0Root = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  backgroundImage: `url('https://black-forest-labs-flux-1-schnell.hf.space/file=/tmp/gradio/23f13ae8869adfa32ad3e689a5718afdc307c66a/image.webp')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
});

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  width: "100%",
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: theme.palette.background.paper,
}));

const FlexBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "100%",
});

// const FormTitle = styled(Typography)(({ theme }) => ({
//   marginBottom: theme.spacing(3),
//   color: theme.palette.text.primary,
// }));

export default function LoginFirst() {
  const [state, setState] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState(""); // For feedback
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar visibility
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // const handleLogin = async () => {
  //   setLoading(true);
  //   const hardcodedUsername = "admin";
  //   const hardcodedPassword = "admin";

  //   if (
  //     state.username === hardcodedUsername &&
  //     state.password === hardcodedPassword
  //   ) {
  //     Cookies.set("authToken", "djvgyffds456656776dre755657r677");
  //     navigate("/dashboard");
  //   } else {
  //     setMessage("Invalid username or password");
  //     setOpenSnackbar(true);
  //   }

  //   setLoading(false);
  // };

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await axios.post(`${API}/api/Auth/login`, {
        username: state.username,
        password: state.password,
      });

      if (response.status === 200) {
        const data = response.data;
        const user_id = data.user_id;
        Cookies.set("username", data["username"], { path: "/" });
        Cookies.set("user_id", data["user_id"], { path: "/" });
        try {
          const response = await axios.get(`${CreditAPI}/event_credit`);
          const data = response.data.event_credits;
          const latestCredit = data
            .filter((credit) => credit.entity_id === user_id)
            .map((credit) => credit.id)
            .pop();
          console.log(data["user_id"], latestCredit, data);
          Cookies.set("credit_id", latestCredit, { path: "/" });
        } catch (error) {
          console.error("Error fetching credit data:", error);
        }
        console.log("Cookies set:", data["username"], data["user_id"]);
        navigate("/dashboard");
      } else {
        console.error("Failed to login:", response);
      }
    } catch (error) {
      setMessage("Invalid username or password");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };

  return (
    <>
      <Auth0Root
        style={{
          backgroundImage: `url(${backimg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh", // Adjust as needed
          width: "100vw", // Adjust as needed
        }}
      >
        <StyledCard
          style={{
            backgroundColor: "white", // 30% opacity white background
            padding: "20px", // Example padding
            borderRadius: "8px", // Example border radius
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Example box shadow
          }}
        >
          <div className="row">
            <div className="col-md-6">
              <br />
              <div
                style={{
                  fontFamily: "PapyrusLucida Handwriting",
                  fontSize: "1.7rem",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                  color: "#0D7C66",
                }}
              >
                Welcome
              </div>
              <h5 className="">
                <span style={{ color: "red" }}>A</span>jeevi VMS
              </h5>
            </div>
            <div className="col-md-6 text-center">
              <img src={loginbody} height={120} width={170} alt="Login" />
            </div>
          </div>{" "}
          <FlexBox>
            <TextField
              type="text"
              name="username"
              label="Username"
              value={state.username}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />

            <TextField
              name="password"
              type="password"
              label="Password"
              value={state.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
          </FlexBox>
          <FlexBox>
            <Button
              className="bg-success "
              fullWidth
              variant="contained"
              onClick={handleLogin}
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </FlexBox>
          <FlexBox style={{ textAlign: "center", marginTop: "16px" }}>
            <span>
              If not registered?{" "}
              <a
                href="/register" // Replace with the correct registration route
                style={{
                  color: "lightblue",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Sign Up
              </a>
            </span>
          </FlexBox>
        </StyledCard>
      </Auth0Root>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
