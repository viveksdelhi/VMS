import {
  Button,
  Grid,
  // Icon,
  IconButton,
  InputAdornment,
  // MenuItem,
  // Select,
  styled,
} from "@mui/material";
import { Span } from "app/components/Typography";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Addcamera,
  API,
  CREDIT_ID,
  ONVIFAPI,
  // StreamAPI,
  token,
  userId,
} from "serverConnection"; // Ensure these are correctly imported or defined
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "Loader";
import Cookies from "js-cookie";

const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px",
}));

const SimpleForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    nvrip: "",
    nvrType: "",
    port: 80,
    username: "",
    location: "",
    zone: "",
    password: "",
    RPname: "",
    RPnumber: "",
    images: [],
    showPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cameraData, setCameraData] = useState(null); // Store response data
  const [modalOpen, setModalOpen] = useState(false); // Control modal visibility
  const [selectedCameras, setSelectedCameras] = useState([]);

  useEffect(() => {
    // Add custom validation rules
    ValidatorForm.addValidationRule("isInteger", (value) =>
      Number.isInteger(Number(value))
    );

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

    ValidatorForm.addValidationRule(
      "isnvrTypeSelected",
      (value) => value !== ""
    );

    return () => {
      ValidatorForm.removeValidationRule("isInteger");
      ValidatorForm.removeValidationRule("isNumber");
      ValidatorForm.removeValidationRule("isPortValid");
      ValidatorForm.removeValidationRule("isValidIP");
      ValidatorForm.removeValidationRule("isnvrTypeSelected");
    };
  }, []);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const files = e.target.files;
    const selectedImages = Array.from(files);
    setFormData({
      ...formData,
      images: selectedImages, // Store selected images in the state
    });
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   navigate("/all-nvr");
  //   try {
  //     const response = await axios.post(
  //       `${API}/api/NVR`,
  //       {
  //         name: state.name,
  //         nvrip: state.nvrip,
  //         nvrType: state.nvrType,
  //         port: state.port,
  //         username: state.username,
  //         password: state.password,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     console.log("Response:", response.data);
  //     // Handle success (e.g., show a success message or reset the form)
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     // console.log(error.response.data.message)
  //     alert(error.response.data.message);
  //     // Handle error (e.g., show an error message)
  //   }
  // };

  const handleApiResponse = (response) => {
    if (response?.[formData.nvrip]?.error) {
      // If there's an error in the response, set the error message
      setLoading(false);
      setError(response[formData.nvrip].error);
      alert(response[formData.nvrip].error); // Display the error message as an alert
    } else {
      // Otherwise, set the camera data (or do something else)
      setError(null); // Clear any previous errors
      setCameraData(response[formData.nvrip]); // Store camera data
      setModalOpen(true); // Open the modal
    }
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  const handleCheckboxChange = (e, cameraName) => {
    const isChecked = e.target.checked;

    // Update selected cameras based on checkbox state
    if (isChecked) {
      setSelectedCameras([...selectedCameras, cameraName]);
    } else {
      setSelectedCameras(selectedCameras.filter((name) => name !== cameraName));
    }
  };

  // const submitCameras = async () => {
  //   // if (selectedCameras.length === 0) {
  //   //   setError("Please select at least one camera.");
  //   //   return;
  //   // }

  //   setError(null);
  //   setLoading(true);

  //   try {
  //     // Prepare data to submit (only selected cameras)
  //     const camerasToSubmit = cameraData.filter((camera) =>
  //       selectedCameras.includes(camera["Camera Name"])
  //     );
  //     console.log(camerasToSubmit);

  //     // Create FormData for the multipart API
  //     const formDatas = new FormData();
  //     formDatas.append("name", cameraData[0]?.Model + cameraData[0]?.Make);
  //     formDatas.append("nvrip", formData.nvrip); // Adjust as necessary
  //     formDatas.append("port", formData.port); // Adjust as necessary
  //     formDatas.append("username", formData.username); // Adjust as necessary
  //     formDatas.append("password", formData.password); // Adjust as necessary
  //     formDatas.append("model", cameraData[0]?.Model);
  //     formDatas.append("location", formData.location); // Example, adjust as necessary
  //     formDatas.append("make", cameraData[0]?.Make);
  //     formDatas.append("zone", formData.zone); // Example, adjust as necessary
  //     formDatas.append(
  //       "responsible_Person",
  //       formData.RPname + "," + formData.RPnumber
  //     ); // Adjust as necessary

  //     // If there's an image or file
  //     formData.images.forEach((image, index) => {
  //       formDatas.append(`img`, image);
  //     });

  //     // First API call with FormData
  //     const response1 = await fetch(`${API}/api/nvr`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`, // Do not set `Content-Type` for FormData; it will be set automatically
  //       },
  //       body: formDatas,
  //     });
  //     //show message allready add nvr
  //     const res = await response1.json();

  //     if (!response1.ok) {
  //       alert(res.message||"success");
  //       throw new Error(`Error with first API call: ${response1.status}`);
  //     }

  //     const data1 = await response1.json();
  //     console.log("First API response:", data1);

  //     // Extract the ID from the first API response
  //     const { id } = data1;
  //     if (!id) {
  //       throw new Error("ID not returned from the first API.");
  //     }

  //     // Second API call for additional cameras
  //     for (const camera of camerasToSubmit) {
  //       const response2 = await fetch(`${Addcamera}/camera_details`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           camera_name: camera["Camera Name"],
  //           camera_ip: camera["Camera Name"] || "NONE",
  //           nvr: id,
  //           area: camera["Area"] || "NONE",
  //           location: camera["Location"] || "India",
  //           public_url: camera["Stream URI"],
  //           port: camera["Port"] || 554,
  //           hotspot: camera["GroupId"] || 7,
  //           brand: camera["Brand"] || "NONE",
  //           manufacture: camera["Manufacturer"] || "NONE",
  //           mac_address: camera["Mac Address"] || "NONE",
  //           channel_id: camera["Channel"] || 0,
  //           lattitude: camera["Latitude"] || 21.1466,
  //           longitude: camera["Longitude"] || 79.0889,
  //         }),
  //       });

  //       if (!response2.ok) {
  //         throw new Error(`Error with second API call: ${response2.status}`);
  //       }

  //       const data2 = await response2.json();
  //       console.log("Second API response:", data2);
  //     }

  //     // Handle success and close modal
  //     setModalOpen(false);
  //     backtotable();
  //   } catch (err) {
  //     console.error("Error submitting cameras:", err);
  //     setError("ADD NVR: " + err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const submitCameras = async () => {
    // Reset error and set loading
    setError(null);
    setLoading(true);

    try {
      // Validate selected cameras
      if (selectedCameras.length === 0) {
        setError("Please select at least one camera.");
        return;
      }

      // Prepare data for the first API call (NVR)
      const camerasToSubmit = cameraData.filter((camera) =>
        selectedCameras.includes(camera["Camera Name"])
      );
      console.log(camerasToSubmit);

      // Create FormData for the first API call
      const formDatas = new FormData();
      formDatas.append("name", cameraData[0]?.Model + cameraData[0]?.Make);
      formDatas.append("userid", parseInt(Cookies.get("user_id")));
      formDatas.append("nvrip", formData.nvrip);
      formDatas.append("port", formData.port);
      formDatas.append("username", formData.username);
      formDatas.append("password", formData.password);
      formDatas.append("model", cameraData[0]?.Model);
      formDatas.append("location", formData.location);
      formDatas.append("make", cameraData[0]?.Make);
      formDatas.append("zone", formData.zone);
      formDatas.append(
        "responsible_Person",
        formData.RPname + "," + formData.RPnumber
      );

      // Append images to FormData if present
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image) => {
          formDatas.append("img", image);
        });
      }

      // First API call (Add NVR)
      const response1 = await fetch(`${API}/api/NVR/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDatas,
      });

      const res1 = await response1.json();
      if (!response1.ok) {
        alert(res1.message || "Error adding NVR");
        throw new Error(`Error with first API call: ${response1.status}`);
      }

      console.log("First API response:", res1);
      const { id } = res1;

      if (!id) {
        throw new Error("ID not returned from the first API.");
      }

      // Prepare the second API requests for the selected cameras
      const cameraRequests = camerasToSubmit.map((camera) => {
        const cameraDetails = {
          camera_name: camera["Camera Name"],
          camera_ip: camera["Camera Name"] || "NONE", // Ensure this field is correct
          nvr: id,
          area: formData.zone || "None",
          location: formData.location || "None",
          public_url: camera["Stream URI"],
          port: camera["Port"] || "554",
          hotspot: camera["GroupId"] || 5,
          brand: camera["Brand"] || "NONE",
          manufacturer: camera["Manufacturer"] || "NONE",
          mac_address: camera["Mac Address"] || "NONE",
          channel_id: camera["Channel"] || "0",
          lattitude: camera["Latitude"] || "21.1466",
          longitude: camera["Longitude"] || "79.0889",
          user_id: parseInt(Cookies.get("user_id")),
          credit_id: parseInt(Cookies.get("credit_id")),
        };

        return fetch(`${Addcamera}/camera_details`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cameraDetails),
        });
      });

      // Make the API calls concurrently using Promise.all
      const responses = await Promise.all(cameraRequests);

      // Process all responses
      for (const response2 of responses) {
        const data2 = await response2.json();
        if (!response2.ok) {
          throw new Error(`Error with second API call: ${response2.status}`);
        }
        console.log("Second API response:", data2);
      }

      // Success handling
      setModalOpen(false);
      backtotable();
      alert("NVR and cameras added successfully!");
    } catch (err) {
      console.error("Error submitting cameras:", err);
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation: Check required fields
    if (!formData.username || !formData.password || !formData.nvrip) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      // Prepare data to submit
      const response = await fetch(`${ONVIFAPI}/get_camera_details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cameras: [
            {
              nvr_ip: formData.nvrip,
              username: formData.username,
              password: formData.password,
              nvr_port: parseInt(formData.port, 10),
            },
          ],
        }),
      });

      console.log(response);
      if (response.status !== 200) {
        alert(`Error: connecting`);
      }
      if (!response.ok) {
        alert(`Error: ${response.status}`);
      }

      const data = await response.json();
      // const data = {
      //   "115.242.203.134": [
      //     {
      //       "Camera Token": "Profile1",
      //       "Camera Name": "Main Stream",
      //       "Video Source Name": "Primary Source",
      //       "Source Token": "SourceToken1",
      //       "Video Encoder Name": "H.264 Encoder",
      //       Encoding: "H264",
      //       "Video Encoder Token": "EncoderToken1",
      //       Make: "Dahua",
      //       Model: "NVR2116HS-4KS2",
      //       "Stream URI": "rtsp://admin:password@192.168.1.100/stream1",
      //     },
      //   ],
      // };
      handleApiResponse(data); // Store cameras data to use for selection
      setModalOpen(true); // Open modal after successful submission
      console.log(cameraData, modalOpen);
    } catch (err) {
      console.error("Error submitting NVR:", err);
      setError("ADD NVR: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  function backtotable() {
    navigate("/all-nvr");
  }

  const handleClickShowPassword = () => {
    setFormData((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));
  };
  console.log(error);

  return (
    <div>
      {loading && <Loader />}
      <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
        <div className="text-end">
          <Button onClick={backtotable} className="bg-danger text-light">
            X
          </Button>
        </div>
        <Grid container spacing={1}>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 1 }}>
            <TextField
              type="text"
              name="username"
              label="Username"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              value={formData.username}
              validators={["required"]}
              errorMessages={["This field is required"]}
              required
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 1 }}>
            <TextField
              type={formData.showPassword ? "text" : "password"}
              name="password"
              label="Password"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              value={formData.password}
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
                      {formData.showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 1 }}>
            <TextField
              type="text"
              name="port"
              label={formData.port}
              onChange={(e) =>
                setFormData({ ...formData, port: e.target.value })
              }
              value={formData.port}
              validators={["isNumber", "isInteger", "isPortValid"]}
              errorMessages={[
                "Must be a number",
                "Must be an integer",
                "Port must be between 1 and 65535",
              ]}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 1 }}>
            <TextField
              type="text"
              name="nvrip"
              label="NVR IP"
              onChange={(e) =>
                setFormData({ ...formData, nvrip: e.target.value })
              }
              value={formData.nvrip}
              validators={["required", "isValidIP"]}
              errorMessages={["This field is required", "Invalid IP address"]}
              required
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 1 }}>
            <TextField
              type="text"
              name="location"
              label="Location"
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              value={formData.location}
              // validators={["required"]}
              // errorMessages={["This field is required"]}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 1 }}>
            <TextField
              type="text"
              name="zone"
              label="Zone"
              onChange={(e) =>
                setFormData({ ...formData, zone: e.target.value })
              }
              value={formData.zone}
              // validators={["required"]}
              // errorMessages={["This field is required"]}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 1 }}>
            <TextField
              type="text"
              name="RPname"
              label="Responsible Person Name"
              onChange={(e) =>
                setFormData({ ...formData, RPname: e.target.value })
              }
              value={formData.RPname}
              // validators={["required"]}
              // errorMessages={["This field is required"]}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 1 }}>
            <TextField
              type="text"
              name="RPnumber"
              label="Responsible Person Contact Number"
              onChange={(e) =>
                setFormData({ ...formData, RPnumber: e.target.value })
              }
              value={formData.RPnumber}
              // validators={["required"]}
              // errorMessages={["This field is required"]}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 1 }}>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              accept="image/*"
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                fontSize: "14px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#fff",
              }}
              onChange={handleFileChange}
            />
          </Grid>
        </Grid>

        <Button color="success" variant="contained" type="submit">
          <Span sx={{ pl: 1, textTransform: "capitalize" }}>
            {loading ? "Submitting..." : "Submit"}
          </Span>
        </Button>
      </ValidatorForm>
      {modalOpen && cameraData && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
            maxHeight: "500px",
            overflow: "scroll",
            width: "80%",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <h3>NVR Details</h3>
            <p>
              <strong>NVR IP:</strong> {formData.nvrip}
            </p>
            <p>
              <strong>Make:</strong> {cameraData[0]?.Make || "N/A"}
            </p>
            <p>
              <strong>Model:</strong> {cameraData[0]?.Model || "N/A"}
            </p>
            <p>
              <strong>Firmware Version:</strong>{" "}
              {cameraData[0]["Firmware Version"] || "N/A"}
            </p>
            <p>
              <strong>Serial Number:</strong>{" "}
              {cameraData[0]["Serial Number"] || "N/A"}
            </p>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "2px solid #ddd", padding: "8px" }}>
                  Select
                </th>
                <th style={{ borderBottom: "2px solid #ddd", padding: "8px" }}>
                  Camera Name
                </th>
                <th style={{ borderBottom: "2px solid #ddd", padding: "8px" }}>
                  Stream URI
                </th>
              </tr>
            </thead>
            <tbody>
              {cameraData.map((camera, index) => (
                <tr key={index}>
                  <td
                    style={{ padding: "8px", borderBottom: "1px solid #ddd" }}
                  >
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleCheckboxChange(e, camera["Camera Name"])
                      }
                    />
                  </td>
                  <td
                    style={{ padding: "8px", borderBottom: "1px solid #ddd" }}
                  >
                    {camera["Camera Name"]}
                  </td>
                  <td
                    style={{ padding: "8px", borderBottom: "1px solid #ddd" }}
                  >
                    {camera["Stream URI"]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedCameras.length !== 0 && (
            // <button
            //   onClick={submitCameras}
            //   style={{
            //     marginTop: "10px",
            //     padding: "10px 20px",
            //     backgroundColor: "black",
            //     color: "#fff",
            //     border: "none",
            //     borderRadius: "4px",
            //     float: "left",
            //   }}
            // >
            //   Submit Selected Cameras
            // </button>
            <Button
              color="success"
              variant="contained"
              // type="submit"
              style={{ margin: "5px" }}
              onClick={submitCameras}
            >
              ADD Selected Cameras
            </Button>
          )}
          {/* <button
            onClick={() => setModalOpen(false)}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "red",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              position: "absolute",
              top: "5%",
              right: "2%",
            }}
          >
            X
          </button> */}
          <Button
            onClick={() => setModalOpen(false)}
            className="bg-danger text-light"
            style={{ position: "fixed", top: "2%", right: "3%" }}
          >
            X
          </Button>
        </div>
      )}
    </div>
  );
};

export default SimpleForm;
