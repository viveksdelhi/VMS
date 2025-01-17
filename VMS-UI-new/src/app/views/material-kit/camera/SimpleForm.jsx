import {
  Button,
  Grid,
  // Icon,
  MenuItem,
  Select,
  styled,
} from "@mui/material";
import { Span } from "app/components/Typography";
import { useEffect, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import axios from "axios";
import { API, token, Addcamera } from "serverConnection";
import { useNavigate } from "react-router-dom";

const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px",
}));

const SimpleForm = () => {
  const [state, setState] = useState({
    camera_name: "",
    camera_ip: "",
    nvr: "",
    hotspot: "",
    location: "",
    public_url: "",
    port: "",
    channel_id: "",
    manufacture: "",
    mac_address: "",
    latitude: "",
    longitude: "",
    area: "NA",
    brand: "",
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
        setNvrOptions(nvrResponse.data);
        setGroupOptions(groupResponse.data);
      } catch (error) {
        console.error("Error fetching NVR and Group data:", error);
      }
    };

    fetchNvrAndGroupData();

    // Adding validation rules for the form
    ValidatorForm.addValidationRule("isInteger", (value) =>
      Number.isInteger(Number(value))
    );
    ValidatorForm.addValidationRule("isNumber", (value) => !isNaN(value));
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${Addcamera}/camera_details`,
        {
          camera_name: state.camera_name,
          camera_ip: state.camera_ip,
          nvr: state.nvr,
          hotspot: state.hotspot,
          location: state.location,
          public_url: state.public_url,
          port: state.port,
          channel_id: state.channel_id,
          manufacture: state.manufacture,
          mac_address: state.mac_address,
          lattitude: state.latitude,
          longitude: state.longitude,
          area: state.area,
          brand: state.brand,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Form submitted successfully:", response.data);
      alert("Camera Add successfully");
      navigate("/all-camera");
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };

  const backToTable = () => {
    navigate("/all-camera");
  };

  const {
    camera_name,
    camera_ip,
    location,
    port,
    channel_id,
    latitude,
    longitude,
    public_url,
    mac_address,
    manufacture,
    brand,
    // area,
    nvr,
    hotspot,
  } = state;

  return (
    <div>
      <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
        <div className="text-end">
          <Button onClick={backToTable} className="bg-danger text-light">
            X
          </Button>
        </div>
        <Grid container spacing={6}>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
            <TextField
              type="text"
              name="camera_name"
              label="Camera Name"
              onChange={handleChange}
              value={camera_name}
              validators={["required"]}
              errorMessages={["This field is required"]}
            />

            <TextField
              type="text"
              name="camera_ip"
              label="Camera IP"
              onChange={handleChange}
              value={camera_ip}
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
                  name="channel_id"
                  label="Channel ID"
                  onChange={handleChange}
                  value={channel_id}
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
                  label="Make "
                  onChange={handleChange}
                  value={manufacture}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  type="text"
                  name="mac_address"
                  label="MAC Address"
                  onChange={handleChange}
                  value={mac_address}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
            <Select
              name="nvr"
              value={nvr}
              onChange={handleChange}
              displayEmpty
              fullWidth
              sx={{ marginBottom: "16px" }}
              validators={["required"]}
              errorMessages={["This field is required"]}
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
              name="hotspot"
              value={hotspot}
              onChange={handleChange}
              displayEmpty
              fullWidth
              sx={{ marginBottom: "16px" }}
              validators={["required"]}
              errorMessages={["This field is required"]}
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
              name="public_url"
              label="Public URL"
              onChange={handleChange}
              value={public_url}
              validators={["required", "isRTSPUrl"]}
              errorMessages={[
                "This field is required",
                "Please enter a valid RTSP URL",
              ]}
            />

            <Grid container spacing={3} sx={{ mt: -3 }}>
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

            <Grid container spacing={3} sx={{ mt: -3 }}>
              {/* <Grid item xs={6}>
                <TextField
                  type="text"
                  name="area"
                  label="Area"
                  onChange={handleChange}
                  value={area}
                />
              </Grid> */}

              <Grid item xs={6}>
                <TextField
                  type="text"
                  name="brand"
                  label="Model"
                  onChange={handleChange}
                  value={brand}
                />
              </Grid>
            </Grid>
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

// // import { DatePicker } from "@mui/lab";
// // import AdapterDateFns from "@mui/lab/AdapterDateFns";
// // import LocalizationProvider from "@mui/lab/LocalizationProvider";
// import {
//   Button,
//   Grid,
//   Icon,
//   // IconButton,
//   // InputAdornment,
//   MenuItem,
//   Select,
//   styled, //ok
// } from "@mui/material";
// import { Span } from "app/components/Typography";
// import { useEffect, useState } from "react";
// import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
// // import Visibility from "@mui/icons-material/Visibility";
// // import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import axios from "axios";
// import { API, token } from "serverConnection";
// import { useNavigate } from "react-router-dom";

// const TextField = styled(TextValidator)(() => ({
//   width: "100%",
//   marginBottom: "16px",
// }));

// const SimpleForm = () => {
//   const [state, setState] = useState({
//     // name: "",
//     // cameraIP: "",
//     // location: "",
//     // nvrId: "",
//     // groupId: "",
//     // port: "",
//     // channelId: "",
//     // latitude: "",
//     // longitude: "",
//     // rtspurl: "",
//     // area: "",
//     // brand: "",
//     // manufacture: "",
//     // macAddress: "",
//     camera_name : "",
//     camera_ip: "",
//     nvr : "",
//     hotspot : "",
//     location : "",
//     public_url : "",
//     port : "",
//     channel_id : "",
//     manufacture: "",
//     mac_address : "",
//     lattitude:"",
//     longitude : "",
//     area : "",
//     brand : "",

//   });

//   const [nvrOptions, setNvrOptions] = useState([]);
//   const [groupOptions, setGroupOptions] = useState([]);

//   useEffect(() => {
//     // Fetch NVR and Group data on component mount
//     const fetchNvrAndGroupData = async () => {
//       try {
//         const nvrResponse = await axios.get(`${API}/api/NVR/GetAll`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const groupResponse = await axios.get(`${API}/api/Group/GetAll`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setNvrOptions(nvrResponse.data); // Assuming response is an array of NVRs
//         setGroupOptions(groupResponse.data); // Assuming response is an array of Groups
//       } catch (error) {
//         console.error("Error fetching NVR and Group data:", error);
//       }
//     };

//     fetchNvrAndGroupData();

//     ValidatorForm.addValidationRule("isInteger", (value) => {
//       return Number.isInteger(Number(value));
//     });

//     ValidatorForm.addValidationRule("isNumber", (value) => {
//       return !isNaN(value);
//     });

//     ValidatorForm.addValidationRule("isPortValid", (value) => {
//       const port = Number(value);
//       return port >= 1 && port <= 65535;
//     });

//     ValidatorForm.addValidationRule("isRTSPUrl", (value) => {
//       const rtspUrlPattern =
//         /^rtsp:\/\/(?:\S+(?::\S*)?@)?(?:[A-Za-z0-9.-]+|\[[A-Fa-f0-9:.]+\])(?::\d+)?(?:\/[^\s]*)?$/;
//       return rtspUrlPattern.test(value);
//     });

//     ValidatorForm.addValidationRule("isValidLatitude", (value) => {
//       const num = parseFloat(value);
//       return num >= -90 && num <= 90;
//     });

//     ValidatorForm.addValidationRule("isValidLongitude", (value) => {
//       const num = parseFloat(value);
//       return num >= -180 && num <= 180;
//     });

//     ValidatorForm.addValidationRule("isValidIP", (value) => {
//       const ipPattern =
//         /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
//       return ipPattern.test(value);
//     });

//     return () => {
//       ValidatorForm.removeValidationRule("isInteger");
//       ValidatorForm.removeValidationRule("isNumber");
//       ValidatorForm.removeValidationRule("isPortValid");
//       ValidatorForm.removeValidationRule("isRTSPUrl");
//       ValidatorForm.removeValidationRule("isValidLatitude");
//       ValidatorForm.removeValidationRule("isValidLongitude");
//       ValidatorForm.removeValidationRule("isValidIP");
//     };
//   }, []);

//   const navigate = useNavigate();

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     console.log(state);

//     // Post camera data to the server
//     axios
//       .post("http://192.168.1.161:5000/camera_details", {
//         camera_name: state.camera_name,  // camera_name mapped correctly
//         camera_ip: state.camera_ip,      // camera_ip from state
//         nvr: state.nvr,                  // nvr
//         hotspot: state.hotspot,          // hotspot
//         location: state.location,        // location
//         public_url: state.public_url,    // public_url (RTSP URL)
//         port: state.port,                // port
//         channel_id: state.channel_id,    // channel_id
//         manufacture: state.manufacture,  // manufacture
//         mac_address: state.mac_address,  // mac_address
//         lattitude: state.lattitude,      // latitude
//         longitude: state.longitude,      // longitude
//         area: state.area,                // area
//         brand: state.brand,              // brand
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,  // Include token if needed
//         },
//       })
//       // .then((response) => {
//       //   console.log("Form submitted successfully:", response.data);
//       //   // If the camera was created successfully, post alert status
//       //   if (response.data.id) {
//       //     axios.post(`${API}/api/CameraAlertStatus`, {
//       //       cameraId: response.data.id,
//       //       recording: true,
//       //       anpr: false,
//       //       snapshot: false,
//       //       personDetection: false,
//       //       fireDetection: false,
//       //       animalDetection: false,
//       //       bikeDetection: false,
//       //       maskDetection: false,
//       //       umbrelaDetection: false,
//       //       brifecaseDetection: false,
//       //       garbageDetection: false,
//       //       weaponDetection: false,
//       //       wrongDetection: false,
//       //       queueDetection: false,
//       //       smokeDetection: false
//       //     }, {
//       //       headers: {
//       //         'Authorization': `Bearer ${token}`,
//       //       }
//       //     });
//       //   }
//       //   navigate("/all-camera"); // Navigate to the camera list page on success
//       // })
//       // .catch((error) => {
//       //   console.error("There was an error submitting the form:", error);
//       //   // Handle the error
//       // });
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setState({ ...state, [name]: value });
//   };

//   function backtotable(){
//     navigate('/all-camera')
//   }

//   // const handleDateChange = (date) => setState({ ...state, lastLive: date });

//   const {
//     name,
//     cameraIP,
//     location,
//     nvrId,
//     groupId,
//     port,
//     channelId,
//     latitude,
//     longitude,
//     rtspurl,
//     macAddress,
//     manufacture,
//     brand,
//     area,
//   } = state;

//   return (
//     <div>
//       <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
//       <div className="text-end"><Button onClick={backtotable} className="bg-primary text-light">X</Button></div>
//         {/* {console.log(token)} */}
//         <Grid container spacing={6}>
//           <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
//             <TextField
//               type="text"
//               name="name"
//               label="Name"
//               onChange={handleChange}
//               value={name}
//               validators={["required"]}
//               errorMessages={["This field is required"]}
//             />

//             <TextField
//               type="text"
//               name="cameraIP"
//               label="Camera IP"
//               onChange={handleChange}
//               value={cameraIP}
//               validators={["required", "isValidIP"]}
//               errorMessages={["This field is required", "Invalid IP address"]}
//             />

//             <TextField
//               type="text"
//               name="location"
//               label="Location"
//               onChange={handleChange}
//               value={location}
//               validators={["required"]}
//               errorMessages={["This field is required"]}
//             />

//             <Grid container spacing={3} sx={{ mt: -3 }}>
//               <Grid item xs={6}>
//                 <TextField
//                   type="text"
//                   name="port"
//                   label="Port"
//                   onChange={handleChange}
//                   value={port}
//                   validators={["required", "isInteger", "isPortValid"]}
//                   errorMessages={[
//                     "This field is required",
//                     "Must be a valid integer",
//                     "Port number must be between 1 and 65535",
//                   ]}
//                 />
//               </Grid>

//               <Grid item xs={6}>
//                 <TextField
//                   type="text"
//                   name="channelId"
//                   label="Channel ID"
//                   onChange={handleChange}
//                   value={channelId}
//                   validators={["required", "isInteger"]}
//                   errorMessages={[
//                     "This field is required",
//                     "Must be a valid integer",
//                   ]}
//                 />
//               </Grid>
//             </Grid>

//             <Grid container spacing={3} sx={{ mt: -3 }}>
//               <Grid item xs={6}>
//                 <TextField
//                   type="text"
//                   name="manufacture"
//                   label="Manufacture"
//                   onChange={handleChange}
//                   value={manufacture}
//                 />
//               </Grid>

//               <Grid item xs={6}>
//                 <TextField
//                   type="text"
//                   name="macAddress"
//                   label="MAC Address"
//                   onChange={handleChange}
//                   value={macAddress}
//                 />
//               </Grid>
//             </Grid>

//           </Grid>

//           <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
//             <Select
//               name="nvrId"
//               value={nvrId}
//               onChange={handleChange}
//               displayEmpty
//               fullWidth
//               sx={{ marginBottom: "16px" }}
//               validators={["required", "isInteger"]}
//               errorMessages={["This field is required", "Must be an integer"]}
//             >
//               <MenuItem value="" disabled>
//                 NVR
//               </MenuItem>
//               {nvrOptions.map((nvr) => (
//                 <MenuItem key={nvr.id} value={nvr.id}>
//                   {nvr.name}
//                 </MenuItem>
//               ))}
//             </Select>

//             <Select
//               name="groupId"
//               value={groupId}
//               onChange={handleChange}
//               displayEmpty
//               fullWidth
//               sx={{ marginBottom: "16px" }}
//               validators={["required", "isInteger"]}
//               errorMessages={["This field is required", "Must be an integer"]}
//             >
//               <MenuItem value="" disabled>
//                 Hotspot
//               </MenuItem>
//               {groupOptions.map((group) => (
//                 <MenuItem key={group.id} value={group.id}>
//                   {group.name}
//                 </MenuItem>
//               ))}
//             </Select>

//             <TextField
//               type="text"
//               name="rtspurl"
//               label="Public URL"
//               onChange={handleChange}
//               value={rtspurl}
//               validators={["required", "isRTSPUrl"]}
//               errorMessages={[
//                 "This field is required",
//                 "Must be a valid RTSP URL",
//               ]}
//             />

//             <Grid container spacing={3}>
//               <Grid item xs={6}>
//                 <TextField
//                   type="text"
//                   name="latitude"
//                   label="Latitude"
//                   onChange={handleChange}
//                   value={latitude}
//                   validators={["required", "isNumber", "isValidLatitude"]}
//                   errorMessages={[
//                     "This field is required",
//                     "Must be a valid number",
//                     "Latitude must be between -90 and 90",
//                   ]}
//                 />
//               </Grid>

//               <Grid item xs={6}>
//                 <TextField
//                   type="text"
//                   name="longitude"
//                   label="Longitude"
//                   onChange={handleChange}
//                   value={longitude}
//                   validators={["required", "isNumber", "isValidLongitude"]}
//                   errorMessages={[
//                     "This field is required",
//                     "Must be a valid number",
//                     "Longitude must be between -180 and 180",
//                   ]}
//                 />
//               </Grid>
//             </Grid>
//             <Grid container spacing={3}>
//               <Grid item xs={6}>
//                 <TextField
//                   type="text"
//                   name="area"
//                   label="Area"
//                   onChange={handleChange}
//                   value={area}

//                 />
//               </Grid>

//               <Grid item xs={6}>
//                 <TextField
//                   type="text"
//                   name="brand"
//                   label="Brand"
//                   onChange={handleChange}
//                   value={brand}

//                 />
//               </Grid>
//             </Grid>

//             <Button color="primary" variant="contained" type="submit">
//               <Icon>send</Icon>
//               <Span sx={{ pl: 1, textTransform: "capitalize" }}>Submit</Span>
//             </Button>
//           </Grid>
//         </Grid>
//       </ValidatorForm>
//     </div>
//   );
// };

// export default SimpleForm;
