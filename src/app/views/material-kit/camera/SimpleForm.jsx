// import { DatePicker } from "@mui/lab";
// import AdapterDateFns from "@mui/lab/AdapterDateFns";
// import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {
  Button,
  Grid,
  Icon,
  // IconButton,
  // InputAdornment,
  MenuItem,
  Select,
  styled, //ok
} from "@mui/material";
import { Span } from "app/components/Typography";
import { useEffect, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { API, token } from "serverConnection";
import { useNavigate } from "react-router-dom";

const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px",
}));

const SimpleForm = () => {
  const [state, setState] = useState({
    name: "",
    cameraIP: "",
    location: "",
    nvrId: "",
    groupId: "",
    port: "",
    channelId: "",
    latitude: "",
    longitude: "",
    rtspurl: "",
    area: "",
    brand: "",
    manufacture: "",
    macAddress: "",
  });

  const [nvrOptions, setNvrOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);

  useEffect(() => {
    // Fetch NVR and Group data on component mount
    const fetchNvrAndGroupData = async () => {
      try {
        const nvrResponse = await axios.get(`${API}/api/NVR/GetAll`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const groupResponse = await axios.get(`${API}/api/Group/GetAll`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNvrOptions(nvrResponse.data); // Assuming response is an array of NVRs
        setGroupOptions(groupResponse.data); // Assuming response is an array of Groups
      } catch (error) {
        console.error("Error fetching NVR and Group data:", error);
      }
    };

    fetchNvrAndGroupData();

    ValidatorForm.addValidationRule("isInteger", (value) => {
      return Number.isInteger(Number(value));
    });

    ValidatorForm.addValidationRule("isNumber", (value) => {
      return !isNaN(value);
    });

    ValidatorForm.addValidationRule("isPortValid", (value) => {
      const port = Number(value);
      return port >= 1 && port <= 65535;
    });

    ValidatorForm.addValidationRule("isRTSPUrl", (value) => {
      const rtspUrlPattern =
        /^rtsp:\/\/(?:\S+(?::\S*)?@)?(?:[A-Za-z0-9.-]+|\[[A-Fa-f0-9:.]+\])(?::\d+)?(?:\/[^\s]*)?$/;
      return rtspUrlPattern.test(value);
    });

    ValidatorForm.addValidationRule("isValidLatitude", (value) => {
      const num = parseFloat(value);
      return num >= -90 && num <= 90;
    });

    ValidatorForm.addValidationRule("isValidLongitude", (value) => {
      const num = parseFloat(value);
      return num >= -180 && num <= 180;
    });

    ValidatorForm.addValidationRule("isValidIP", (value) => {
      const ipPattern =
        /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
      return ipPattern.test(value);
    });

    return () => {
      ValidatorForm.removeValidationRule("isInteger");
      ValidatorForm.removeValidationRule("isNumber");
      ValidatorForm.removeValidationRule("isPortValid");
      ValidatorForm.removeValidationRule("isRTSPUrl");
      ValidatorForm.removeValidationRule("isValidLatitude");
      ValidatorForm.removeValidationRule("isValidLongitude");
      ValidatorForm.removeValidationRule("isValidIP");
    };
  }, []);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    
    console.log(state)
    // Post data to the server
    axios
      .post(`${API}/api/Camera`, state, {
        headers: {
          Authorization: `Bearer ${token}`, // Include if you need authorization
        },
      })
      .then((response) => {
        console.log("Form submitted successfully:", response.data);
        if (response.data.id) {
          axios.post(`${API}/api/CameraAlertStatus`, {
            cameraId: response.data.id,
            recording: true,
            anpr: false,
            snapshot: false,
            personDetection: false,
            fireDetection: false,
            animalDetection: false,
            bikeDetection: false,
            maskDetection: false,
            umbrelaDetection: false,
            brifecaseDetection: false,
            garbageDetection: false,
            weaponDetection: false,
            wrongDetection: false,
            queueDetection: false,
            smokeDetection: false
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          },
        );
        }
        navigate("/all-camera");
        // Handle success
      })
      .catch((error) => {
        console.error("There was an error submitting the form:", error);
        // Handle error
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };

  function backtotable(){
    navigate('/all-camera')
  }

  // const handleDateChange = (date) => setState({ ...state, lastLive: date });

  const {
    name,
    cameraIP,
    location,
    nvrId,
    groupId,
    port,
    channelId,
    latitude,
    longitude,
    rtspurl,
    macAddress,
    manufacture,
    brand,
    area,
  } = state;

  return (
    <div>
      <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
      <div className="text-end"><Button onClick={backtotable} className="bg-primary text-light">X</Button></div>

        <Grid container spacing={6}>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
            <TextField
              type="text"
              name="name"
              label="Name"
              onChange={handleChange}
              value={name}
              validators={["required"]}
              errorMessages={["This field is required"]}
            />

            <TextField
              type="text"
              name="cameraIP"
              label="Camera IP"
              onChange={handleChange}
              value={cameraIP}
              validators={["required", "isValidIP"]}
              errorMessages={["This field is required", "Invalid IP address"]}
            />

            <TextField
              type="text"
              name="location"
              label="Location"
              onChange={handleChange}
              value={location}
              validators={["required"]}
              errorMessages={["This field is required"]}
            />

            <Grid container spacing={3} sx={{ mt: -3 }}>
              <Grid item xs={6}>
                <TextField
                  type="text"
                  name="port"
                  label="Port"
                  onChange={handleChange}
                  value={port}
                  validators={["required", "isInteger", "isPortValid"]}
                  errorMessages={[
                    "This field is required",
                    "Must be a valid integer",
                    "Port number must be between 1 and 65535",
                  ]}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  type="text"
                  name="channelId"
                  label="Channel ID"
                  onChange={handleChange}
                  value={channelId}
                  validators={["required", "isInteger"]}
                  errorMessages={[
                    "This field is required",
                    "Must be a valid integer",
                  ]}
                />
              </Grid>
            </Grid>


            <Grid container spacing={3} sx={{ mt: -3 }}>
              <Grid item xs={6}>
                <TextField
                  type="text"
                  name="manufacture"
                  label="Manufacture"
                  onChange={handleChange}
                  value={manufacture}  
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  type="text"
                  name="macAddress"
                  label="MAC Address"
                  onChange={handleChange}
                  value={macAddress}
                />
              </Grid>
            </Grid>


          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
            <Select
              name="nvrId"
              value={nvrId}
              onChange={handleChange}
              displayEmpty
              fullWidth
              sx={{ marginBottom: "16px" }}
              validators={["required", "isInteger"]}
              errorMessages={["This field is required", "Must be an integer"]}
            >
              <MenuItem value="" disabled>
                NVR
              </MenuItem>
              {nvrOptions.map((nvr) => (
                <MenuItem key={nvr.id} value={nvr.id}>
                  {nvr.name}
                </MenuItem>
              ))}
            </Select>

            <Select
              name="groupId"
              value={groupId}
              onChange={handleChange}
              displayEmpty
              fullWidth
              sx={{ marginBottom: "16px" }}
              validators={["required", "isInteger"]}
              errorMessages={["This field is required", "Must be an integer"]}
            >
              <MenuItem value="" disabled>
                Hotspot
              </MenuItem>
              {groupOptions.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>

            <TextField
              type="text"
              name="rtspurl"
              label="Public URL"
              onChange={handleChange}
              value={rtspurl}
              validators={["required", "isRTSPUrl"]}
              errorMessages={[
                "This field is required",
                "Must be a valid RTSP URL",
              ]}
            />

            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  type="text"
                  name="latitude"
                  label="Latitude"
                  onChange={handleChange}
                  value={latitude}
                  validators={["required", "isNumber", "isValidLatitude"]}
                  errorMessages={[
                    "This field is required",
                    "Must be a valid number",
                    "Latitude must be between -90 and 90",
                  ]}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  type="text"
                  name="longitude"
                  label="Longitude"
                  onChange={handleChange}
                  value={longitude}
                  validators={["required", "isNumber", "isValidLongitude"]}
                  errorMessages={[
                    "This field is required",
                    "Must be a valid number",
                    "Longitude must be between -180 and 180",
                  ]}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  type="text"
                  name="area"
                  label="Area"
                  onChange={handleChange}
                  value={area}
                  
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  type="text"
                  name="brand"
                  label="Brand"
                  onChange={handleChange}
                  value={brand}
                 
                />
              </Grid>
            </Grid>

            <Button color="primary" variant="contained" type="submit">
              <Icon>send</Icon>
              <Span sx={{ pl: 1, textTransform: "capitalize" }}>Submit</Span>
            </Button>
          </Grid>
        </Grid>
      </ValidatorForm>
    </div>
  );
};

export default SimpleForm;
