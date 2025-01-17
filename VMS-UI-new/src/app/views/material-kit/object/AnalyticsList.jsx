import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { API, token, detection, userId, CREDIT_ID } from "serverConnection";

// Categorized items by logical grouping
const categorizedItems = {
  Vehicles: [
    "Bicycle",
    "Car",
    "Motorcycle",
    "Airplane",
    "Bus",
    "Train",
    "Truck",
    "Boat",
  ],
  Traffic: [
    "Traffic Light",
    "Without Seat belt",
    "Without Helmet",
    "Triple Ridding",
    "Cattle on road",
  ],
  Person: ["Person"],
  Animals: [
    "Bird",
    "Cat",
    "Dog",
    "Horse",
    "Sheep",
    "Cow",
    "Elephant",
    "Bear",
    "Zebra",
    "Giraffe",
  ],

  Furniture: [
    "Chair",
    "Couch",
    "Potted Plant",
    "Bed",
    "Dining Table",
    "Bench",
    "Bookshelf",
  ],
  Electronics: [
    "TV",
    "Laptop",
    "Mouse",
    "Remote",
    "Keyboard",
    "Cell Phone",
    "Microwave",
    "Oven",
    "Hair drier",
    "Fridge",
  ],
  Objects: [
    "Fire Hydrant",
    "Stop Sign",
    "Parking Meter",
    "Umbrella",
    "Handbag",
    "Tie",
    "Suitcase",
    "Frisbee",
    "Skateboard",
    "Surfboard",
    "Sports Ball",
    "Toothbrush",
    "Toothpaste",
    "Bottle",
    "Wine Glass",
    "Corkscrew",
    "Scissors",
    "Book",
    "Clock",
    "Vase",
    "Scissors",
    "Teddy Bear",
    "Shampoo",
  ],
};

const totalCount = Object.values(categorizedItems).reduce(
  (acc, category) => acc + category.length,
  0
);

const AnalyticsList = ({
  show,
  handleClose,
  cameraIP,
  cameraId,
  publicUrl,
}) => {
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedobject, setSelectedobject] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [analytics, setAnalytics] = useState("");

  // Fetch existing data from API filtered by CameraIP
  const fetchExistingData = async () => {
    try {
      const response1 = await axios.get(`${API}/api/CameraAlertStatus/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data1 = response1.data.results;
      // Filter data based on the cameraId
      setAnalytics(data1.find((item) => item.cameraId === cameraId))

      const response = await axios.get(
        `${API}/api/CameraIPList/?cameraIp=${cameraIP}`
      );
      const data = response.data.results[0];
      setSelectedobject(data)
      const updatedSelection = {};
      const objectList = JSON.parse(data.objectList || "[]");
      objectList.forEach((name) => {
        updatedSelection[name] = true; // Set checkbox as checked
      });
      setSelectedItems(updatedSelection);
    } catch (error) {
      console.error("Error fetching existing data:", error);
    }
  };

  const handleCheckboxChange = (name) => {
    setSelectedItems((prevSelected) => ({
      ...prevSelected,
      [name]: !prevSelected[name],
    }));
  };

  const handleSubmit = async () => {
    const ObjectList = Object.keys(selectedItems).filter(
      (name) => selectedItems[name]
    );

    const postData = {
      objectList: JSON.stringify(ObjectList),
      cameraIP: cameraIP,
      userid:userId
    };
    const putData = {
      id:selectedobject.id,
      objectList: JSON.stringify(ObjectList),
      cameraIP: cameraIP,
      userid:userId
    };
    const postData2 = {
      objectlist: JSON.stringify(ObjectList),
      camera_id: cameraId,
      url: publicUrl,
      camera_ip: cameraIP,
      running: analytics.personDetection ? "true" : "false",
      user_id: userId,
      credit_id: CREDIT_ID,
    };

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
    if (Object.keys(selectedItems).length <= 0) {
      await axios.post(`${API}/api/CameraIPList/?cameraIp=${cameraIP}`, postData, { headers });
    } else {
      await axios.put(`${API}/api/CameraIPList/${selectedobject.id}/`, putData, { headers });
    }
      await axios.post(`${detection}/CameraDetails`, { cameras: [postData2] });
      alert("Analytics list added successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  useEffect(() => {
    if (show) {
      fetchExistingData();
    }
  }, [show, cameraIP]);

  const filteredItems = Object.keys(categorizedItems).reduce(
    (acc, category) => {
      const searchFilteredItems = categorizedItems[category].filter((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (searchFilteredItems.length > 0) {
        acc[category] = searchFilteredItems;
      }
      return acc;
    },
    {}
  );

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select Object (Total Object:{totalCount})</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Search Bar */}
        <Form.Control
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-3"
        />
        <Form>
          {Object.entries(filteredItems).map(([category, items]) => (
            <div key={category}>
              <h5 className="mt-3">{category}</h5>
              <Row>
                {items.map((item) => (
                  <Col xs={6} sm={4} md={3} lg={2} key={item}>
                    <Form.Check
                      type="checkbox"
                      id={`checkbox-${item}`}
                      label={item}
                      checked={selectedItems[item] || false}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            handleSubmit();
            handleClose();
          }}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AnalyticsList;
