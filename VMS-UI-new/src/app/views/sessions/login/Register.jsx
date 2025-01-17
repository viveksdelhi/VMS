import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  styled,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import backimg from "../../../../assets/Image/ajimg/loginbg.jpg";
import { API } from "serverConnection";
import axios from "axios";
import Cookies from "js-cookie";

// Styled components
const Auth0Root = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
});

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 650,
  width: "100%",
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  backgroundColor: theme.palette.background.paper,
}));

const FlexBox = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
});

const HalfBox = styled(Box)({
  flex: "1 1 calc(50% - 16px)", // Adjust to create two columns
  minWidth: "260px", // Ensures responsiveness
  padding: "0px 2px",
});

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    username: "",
    contactType: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };

  const validateForm = () => {
    const {
      password,
      confirmPassword,
      contactNumber,
      email,
      firstName,
      lastName,
      username,
      contactType,
    } = state;

    // Check if any field is empty
    if (
      !firstName ||
      !lastName ||
      !contactNumber ||
      !email ||
      !username ||
      !password ||
      !confirmPassword ||
      !contactType
    ) {
      setMessage("All fields are required");
      setOpenSnackbar(true);
      return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setOpenSnackbar(true);
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Invalid email format");
      setOpenSnackbar(true);
      return false;
    }

    // Validate contact number (e.g., length and numeric)
    const contactNumberRegex = /^\d{10}$/;
    if (!contactNumberRegex.test(contactNumber)) {
      setMessage("Contact number must be 10 digits");
      setOpenSnackbar(true);
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    const {
      password,
      contactNumber,
      email,
      firstName,
      lastName,
      username,
      contactType,
    } = state;

    try {
      setLoading(true);
      const response = await axios.post(`${API}/api/user/`, {
        firstName,
        lastName,
        mobileNo: contactNumber,
        emailId: email,
        username,
        password,
        roleId: contactType === "organization" ? 3 : 2,
        status: 1,
      });

      if (response.status !== 201) {
        throw new Error(response.data?.message || "Failed to register");
      }
      Cookies.set("user_id", response.data.id);
      navigate("/pricing-plan");
    } catch (error) {
      console.error("Registration error: ", error);
      setMessage(
        error.response?.data?.message || error.message || "An error occurred"
      );
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const {
    firstName,
    lastName,
    contactNumber,
    email,
    username,
    contactType,
    password,
    confirmPassword,
  } = state;

  return (
    <>
      <Auth0Root style={{ backgroundImage: `url(${backimg})` }}>
        <StyledCard>
          <Box textAlign="center">
            <br />
            <h5
              style={{
                fontFamily: "PapyrusLucida Handwriting",
                fontSize: "1.7rem",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                color: "#0D7C66",
              }}
            >
              Welcome <span style={{ color: "red" }}>A</span>
              <span style={{ color: "black" }}>jeevi VMS</span>
            </h5>
          </Box>

          <FlexBox>
            <HalfBox>
              <TextField
                name="firstName"
                label="First Name"
                value={firstName}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
            </HalfBox>
            <HalfBox>
              <TextField
                name="lastName"
                label="Last Name"
                value={lastName}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
            </HalfBox>
            <HalfBox>
              <TextField
                name="contactNumber"
                label="Contact Number"
                value={contactNumber}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
            </HalfBox>
            <HalfBox>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
            </HalfBox>
            <HalfBox>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Contact Type</InputLabel>
                <Select
                  name="contactType"
                  value={contactType}
                  onChange={handleChange}
                  label="Contact Type"
                >
                  <MenuItem value="personal">Personal</MenuItem>
                  <MenuItem value="organization">Organization</MenuItem>
                </Select>
              </FormControl>
            </HalfBox>
            <HalfBox>
              <TextField
                name="username"
                label="Username"
                value={username}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
            </HalfBox>

            <HalfBox>
              <TextField
                name="password"
                type="password"
                label="Password"
                value={password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
            </HalfBox>
            <HalfBox>
              <TextField
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
            </HalfBox>
          </FlexBox>

          <Button
            className="bg-success"
            fullWidth
            variant="contained"
            onClick={handleRegister}
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Register"
            )}
          </Button>
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
