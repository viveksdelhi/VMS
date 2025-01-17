import {
  Button,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  styled,
} from "@mui/material";
import { Span } from "app/components/Typography";
import { useEffect, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { API, token } from "serverConnection"; // Ensure these are correctly imported or defined
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px",
}));

const SimpleForm = () => {
  const [state, setState] = useState({
    name: "",
    nvrip: "",
    nvrType: "",
    port: "",
    username: "",
    password: "",
    showPassword: false,
  });

  useEffect(() => {
    // Add custom validation rules
    ValidatorForm.addValidationRule("isInteger", (value) => Number.isInteger(Number(value)));

    ValidatorForm.addValidationRule("isNumber", (value) => !isNaN(value));

    ValidatorForm.addValidationRule("isPortValid", (value) => {
      const port = Number(value);
      return port >= 1 && port <= 65535;
    });

    ValidatorForm.addValidationRule("isValidIP", (value) => {
      const ipPattern =
        /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
      return ipPattern.test(value);
    });

    ValidatorForm.addValidationRule("isnvrTypeSelected", (value) => value !== "");

    return () => {
      ValidatorForm.removeValidationRule("isInteger");
      ValidatorForm.removeValidationRule("isNumber");
      ValidatorForm.removeValidationRule("isPortValid");
      ValidatorForm.removeValidationRule("isValidIP");
      ValidatorForm.removeValidationRule("isnvrTypeSelected");
    };
  }, []);




  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    navigate("/all-nvr");
    try {
      const response = await axios.post(
        `${API}/api/NVR`,
        {
          name: state.name,
          nvrip: state.nvrip,
          nvrType: state.nvrType,
          port: state.port,
          username: state.username,
          password: state.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response:", response.data);
      // Handle success (e.g., show a success message or reset the form)
    } catch (error) {
      console.error("Error submitting form:", error);
      // console.log(error.response.data.message)
      alert(error.response.data.message)
      // Handle error (e.g., show an error message)
    }
  };

  function backtotable() {
    navigate('/all-nvr')
  }

  const handleClickShowPassword = () => {
    setState((prevState) => ({ ...prevState, showPassword: !prevState.showPassword }));
  };

  return (
    <div>
      <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
        <div className="text-end"><Button onClick={backtotable} className="bg-danger text-light">X</Button></div>
        <Grid container spacing={6} >
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
            <TextField
              type="text"
              name="name"
              label="Name"
              onChange={(e) => setState({ ...state, name: e.target.value })}
              value={state.name}
              validators={["required"]}
              errorMessages={["This field is required"]}
            />
            <TextField
              type="text"
              name="port"
              label="Port"
              onChange={(e) => setState({ ...state, port: e.target.value })}
              value={state.port}
              validators={["required", "isNumber", "isInteger", "isPortValid"]}
              errorMessages={[
                "This field is required",
                "Must be a number",
                "Must be an integer",
                "Port must be between 1 and 65535",
              ]}
            />

            <TextField
              type="text"
              name="username"
              label="Username"
              onChange={(e) => setState({ ...state, username: e.target.value })}
              value={state.username}
              validators={["required"]}
              errorMessages={["This field is required"]}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>

            <TextField
              type="text"
              name="nvrip"
              label="NVR IP"
              onChange={(e) => setState({ ...state, nvrip: e.target.value })}
              value={state.nvrip}
              validators={["required", "isValidIP"]}
              errorMessages={["This field is required", "Invalid IP address"]}
            />
            <TextField
              type={state.showPassword ? "text" : "password"}
              name="password"
              label="Password"
              onChange={(e) => setState({ ...state, password: e.target.value })}
              value={state.password}
              validators={["required"]}
              errorMessages={["This field is required"]}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {state.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Select
              name="nvrType"
              value={state.nvrType}
              onChange={(e) => setState({ ...state, nvrType: e.target.value })}
              displayEmpty
              variant="outlined"
              fullWidth
              validators={["required", "isnvrTypeSelected"]}
              errorMessages={["This field is required", "Please select an NVR type"]}
              sx={{ mb: 2 }}
            >
              <MenuItem value="">Select NVR Type</MenuItem>
              <MenuItem value="Hikvision">Hikvision</MenuItem>
              <MenuItem value="Honeywell">Honeywell</MenuItem>
              <MenuItem value="Dahua">Dahua</MenuItem>
              <MenuItem value="CPPlus">CP Plus</MenuItem>
              <MenuItem value="Uniview">Uniview</MenuItem>
              <MenuItem value="Genetec">Genetec</MenuItem>
              {/* <MenuItem value="Honeywell">Avigilon</MenuItem>
              <MenuItem value="Honeywell">Bosch</MenuItem>
              <MenuItem value="Honeywell">Milestone</MenuItem>
              <MenuItem value="Honeywell">Digital Watchdog</MenuItem> */}
            </Select>
          </Grid>
        </Grid>
        <Button color="success" variant="contained" type="submit">
          <Span sx={{ pl: 1, textTransform: "capitalize" }}>Submit</Span>
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default SimpleForm;
