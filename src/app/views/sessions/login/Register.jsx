import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Card, Grid, styled, TextField } from "@mui/material";

// styled components
const Auth0Root = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh !important"
});

const StyledCard = styled(Card)({
  maxWidth: 800,
  margin: "1rem",
  borderRadius: 12,
  "& .cardHolder": { background: "#1A2038" }
});

const FlexBox = styled(Box)({
  display: "flex"
});

export default function RegisterForm() {
  const [message, setMessage] = useState("");
  const [state, setState] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };

  const handleRegister = async () => {
    const { password, confirmPassword } = state;
    
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    // Registration logic here (e.g., call an API)
    try {
      // Simulate successful registration
      navigate("/");
    } catch (e) {
      setMessage(e.message);
    }
  };

  const { username, password, confirmPassword } = state;

  return (
    <Auth0Root>
      <StyledCard>
        <Grid container>
          <Grid item sm={12} xs={12}>
            <FlexBox p={4} bgcolor="background.default" flexDirection={"column"}>
              {/* <img src="/assets/images/illustrations/register.svg" width="400" alt="Register" /> */}
              
              <TextField  
                type="text"
                name="username"
                label="Username"
                value={username}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                sx={{ width: 400 }}
              />
              
              <TextField
                name="password"
                type="password"
                label="Password"
                value={password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                sx={{ width: 400 }}
              />
              
              <TextField
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                sx={{ width: 400 }}
              />
            </FlexBox>

            <FlexBox p={4} flexDirection={"column"} alignItems="center">
              <Button
                fullWidth
                variant="contained"
                onClick={handleRegister}
                sx={{ width: 400 }}
              >
                Register
              </Button>
            </FlexBox>

            {message && <p style={{ color: "red" }}>{message}</p>}
          </Grid>
        </Grid>
      </StyledCard>
    </Auth0Root>
  );
}
