import React, { useState, useEffect } from "react";
import { Addcamera, API, ONVIFAPI, StreamAPI, token } from "serverConnection";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function Expand({ data }) {
  const [cameraData, setCameraData] = useState([]);
  const [addCameraData, setAddCameraData] = useState([]);
  const [nvrData, setNvrData] = useState(data);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCameras, setSelectedCameras] = useState([]);
  const navigate = useNavigate();

  const handleApiResponse = (response) => {
    const error = response?.[nvrData.nvrip]?.error;
    if (error) {
      setError(error);
    } else {
      setError(null);
      setCameraData(response[nvrData.nvrip] || []);
    }
  };

  const handleCheckboxChange = (e, camera) => {
    if (
      addCameraData.some(
        (addcamera) => addcamera.rtspurl === camera["Stream URI"]
      )
    ) {
      return; // Ignore changes for disabled checkboxes
    }

    const isChecked = e.target.checked;
    setSelectedCameras((prev) =>
      isChecked
        ? [...prev, camera]
        : prev.filter((item) => item["Stream URI"] !== camera["Stream URI"])
    );
  };

  const submitCameras = async () => {
    if (selectedCameras.length === 0) {
      setError("Please select at least one camera.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      for (const camera of selectedCameras) {
        // const response = await fetch(`${StreamAPI}/start_recording`, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${token}`,
        //   },
        //   body: JSON.stringify({
        //     camera_name: camera["Camera Name"],
        //     rtsp_url: camera["Stream URI"],
        //   }),
        // });
        // if (!response.ok) {
        //   throw new Error(`Error with second API call: ${response.status}`);
        // }

        // const data = await response.json();
        // console.log("Record API response:", data);
        // console.log(selectedCameras);

        const response2 = await fetch(`${Addcamera}/camera_details`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            camera_name: camera["Camera Name"],
            camera_ip: camera["Camera Name"] || "NONE",
            nvr: nvrData.id,
            area: camera["Area"] || "NONE",
            location: camera["Location"] || "India",
            public_url: camera["Stream URI"],
            port: camera["Port"] || "554",
            hotspot: camera["GroupId"] || 3,
            brand: camera["Brand"] || "NONE",
            manufacture: camera["Manufacturer"] || "NONE",
            mac_address: camera["Mac Address"] || "NONE",
            channel_id: camera["Channel"] || "0",
            lattitude: camera["Latitude"] || "21.14",
            longitude: camera["Longitude"] || "79.08",
          }),
        });

        if (!response2.ok) {
          throw new Error(`Error with second API call: ${response2.status}`);
        }

        const data2 = await response2.json();
        console.log("Second API response:", data2); // Handle success
      }
    } catch (err) {
      console.error("Error submitting cameras:", err);
      setError("ADD Camera: " + err.message); // Update error message
    } finally {
      window.location.reload();
      navigate("/all-nvr");
      setLoading(false);
      setSelectedCameras([]);
    }
  };

  const fetchCameraDetails = async () => {
    setLoading(true);
    setError(""); // Reset error
    try {
      const response = await fetch(`${API}/api/Camera/GetAll`);

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setAddCameraData(data); // Assuming the response is an array or object with camera details
    } catch (err) {
      setError("Error: " + err.message);
    }

    try {
      const response = await fetch(`${ONVIFAPI}/get_camera_details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cameras: [
            {
              nvr_ip: nvrData.nvrip,
              username: nvrData.username,
              password: nvrData.password,
              nvr_port: parseInt(nvrData.port, 10),
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      handleApiResponse(data);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameraDetails();
  }, []); // Fetch data when component mounts

  // Determine if the camera is already in the addCameraData (pre-selected)

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : cameraData.length === 0 ? (
        <p style={{ color: "red" }}>No Cameras Found</p>
      ) : (
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
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                  {/* <input
                    type="checkbox"
                    checked={addCameraData.some(
                      (addcamera) => addcamera.rtspurl === camera["Stream URI"]
                    )}
                    disabled={addCameraData.some(
                      (addcamera) => addcamera.rtspurl === camera["Stream URI"]
                    )}
                    onChange={(e) => handleCheckboxChange(e, camera)}
                  /> */}
                  {addCameraData.some(
                    (addcamera) => addcamera.rtspurl === camera["Stream URI"]
                  ) ? (
                    <input type="checkbox" checked={true} disabled={true} />
                  ) : (
                    <input
                      type="checkbox"
                      onChange={(e) => handleCheckboxChange(e, camera)}
                    />
                  )}
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                  {camera["Camera Name"]}
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                  {camera["Stream URI"]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedCameras.length !== 0 && (
        <Button
          color="success"
          variant="contained"
          style={{ margin: "5px" }}
          onClick={submitCameras}
        >
          ADD Selected Cameras
        </Button>
      )}
    </>
  );
}

export default Expand;
