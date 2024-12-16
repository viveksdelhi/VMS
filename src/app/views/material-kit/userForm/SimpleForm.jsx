import {
  Button, 
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  MenuItem,
  styled
} from "@mui/material";
import { Span } from "app/components/Typography";
import { useEffect, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API, token } from "serverConnection";

const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px"
}));

const SimpleForm = () => {
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    username: "",
    mobileNo: "",
    password: "",
    confirmPassword: "",
    roleId: "",
    showPassword: false,
    showConfirmPassword: false
  });

  useEffect(() => {
    ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
      if (value !== state.password) return false;
      return true;
    });
    return () => ValidatorForm.removeValidationRule("isPasswordMatch");
  }, [state.password]);

  const navigate = useNavigate(); 

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    navigate("/all-user"); // Redirect after form submission
    
    // Create a simple data object
    const data = {
      firstName: state.firstName,
      lastName: state.lastName,
      emailId: state.emailId,
      username: state.username,
      mobileNo: state.mobileNo,
      password: state.password,
      roleId: state.roleId,
    };

    try {
      // Make an Axios POST request with JSON data
      const response = await axios.post(`${API}/api/User`, data, {
        headers: {
          "Content-Type": "application/json", // Specify JSON format
          "Authorization": `Bearer ${token}`  // Include authorization header
        }
      });
      console.log("Form submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };

  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword });
  };

  const handleClickShowConfirmPassword = () => {
    setState({ ...state, showConfirmPassword: !state.showConfirmPassword });
  };

  const {
    firstName,
    lastName,
    emailId,
    username,
    mobileNo,
    password,
    confirmPassword,
    roleId,
    showPassword,
    showConfirmPassword
  } = state;

  return (
    <div>
      <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
        <Grid container spacing={6}>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
            <TextField
              type="text"
              name="firstName"
              label="First Name"
              onChange={handleChange}
              value={firstName || ""}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />

            <TextField
              type="email"
              name="emailId"
              label="Email"
              value={emailId || ""}
              onChange={handleChange}
              validators={["required", "isEmail"]}
              errorMessages={["this field is required", "email is not valid"]}
            />

            <TextField
              type="text"
              name="username"
              value={username || ""}
              onChange={handleChange}
              errorMessages={["this field is required"]}
              label="Username (Min length 4, Max length 9)"
              validators={["required", "minStringLength: 4", "maxStringLength: 9"]}
            />

            <TextField
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              value={password || ""}
              onChange={handleChange}
              validators={["required"]}
              errorMessages={["this field is required"]}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
            <TextField
              type="text"
              name="lastName"
              label="Last Name"
              onChange={handleChange}
              value={lastName || ""}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />

            <TextField
              type="text"
              name="mobileNo"
              value={mobileNo || ""}
              label="Mobile Number"
              onChange={handleChange}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />

            <TextField
              select
              label="Role"
              value={roleId || ""}
              name="roleId"
              onChange={handleChange}
              validators={["required"]}
              errorMessages={["this field is required"]}
            >
              <MenuItem value="">Select Role</MenuItem>
              <MenuItem value="1">Admin</MenuItem>
              <MenuItem value="2">User</MenuItem>
              <MenuItem value="3">Master</MenuItem>
            </TextField>

            <TextField
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              onChange={handleChange}
              label="Confirm Password"
              value={confirmPassword || ""}
              validators={["required", "isPasswordMatch"]}
              errorMessages={["this field is required", "password didn't match"]}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Button color="primary" variant="contained" type="submit">
          <Icon>send</Icon>
          <Span sx={{ pl: 1, textTransform: "capitalize" }}>Submit</Span>
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default SimpleForm;
