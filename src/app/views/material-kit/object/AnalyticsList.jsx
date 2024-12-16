import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { API, token, detection } from "serverConnection";

const AnalyticsList = ({ show, handleClose, cameraIP, cameraId, publicUrl }) => {
  // Original items list
  const allItems = [
    { name: 'Cattle on road' },
    { name: 'Without Seat belt' },
    { name: 'Without Helmet' },
    { name: 'Triple Ridding' },
    { name: 'Person' },
    { name: 'Bicycle' },
    { name: 'Car' },
    { name: 'Motorcycle' },
    { name: 'Airplane' },
    { name: 'Bus' },
    { name: 'Train' },
    { name: 'Truck' },
    { name: 'Boat' },
    { name: 'Traffic Light' },
    { name: 'Fire Hydrant' },
    { name: 'Stop Sign' },
    { name: 'Parking Meter' },
    { name: 'Bench' },
    { name: 'Bird' },
    { name: 'Cat' },
    { name: 'Dog' },
    { name: 'Horse' },
    { name: 'Sheep' },
    { name: 'Cow' },
    { name: 'Elephant' },
    { name: 'Bear' },
    { name: 'Zebra' },
    { name: 'Giraffe' },
    { name: 'Backpack' },
    { name: 'Umbrella' },
    { name: 'Handbag' },
    { name: 'Tie' },
    { name: 'Suitcase' },
    { name: 'Frisbee' },
    { name: 'Skis' },
    { name: 'Snowboard' },
    { name: 'Sports Ball' },
    { name: 'Kite' },
    { name: 'Baseball Bat' },
    { name: 'Baseball Glove' },
    { name: 'Skateboard' },
    { name: 'Surfboard' },
    { name: 'Tennis Racket' },
    { name: 'Bottle' },
    { name: 'Wine Glass' },
    { name: 'Cup' },
    { name: 'Fork' },
    { name: 'Knife' },
    { name: 'Spoon' },
    { name: 'Bowl' },
    { name: 'Banana' },
    { name: 'Apple' },
    { name: 'Sandwich' },
    { name: 'Orange' },
    { name: 'Broccoli' },
    { name: 'Carrot' },
    { name: 'Hot Dog' },
    { name: 'Pizza' },
    { name: 'Donut' },
    { name: 'Cake' },
    { name: 'Chair' },
    { name: 'Couch' },
    { name: 'Potted Plant' },
    { name: 'Bed' },
    { name: 'Dining Table' },
    { name: 'Toilet' },
    { name: 'TV' },
    { name: 'Laptop' },
    { name: 'Mouse' },
    { name: 'Remote' },
    { name: 'Keyboard' },
    { name: 'Cell Phone' },
    { name: 'Microwave' },
    { name: 'Oven' },
    { name: 'Toaster' },
    { name: 'Sink' },
    { name: 'Refrigerator' },
    { name: 'Book' },
    { name: 'Clock' },
    { name: 'Vase' },
    { name: 'Scissors' },
    { name: 'Teddy Bear' },
    { name: 'Hair Drier' },
    { name: 'Toothbrush' }
  ];

  const [selectedItems, setSelectedItems] = useState({});

  // Fetch existing data from API filtered by CameraIP
  const fetchExistingData = async () => {
    try {
      const response = await axios.get(`${API}/api/CameraIPList/GetByCameraIP?cameraIP=${cameraIP}`
      );
      const data = response.data;
      console.log(data)
      // Update selectedItems based on filtered data
      const updatedSelection = {};
      const objectList = JSON.parse(data.objectList || '[]'); // Ensure the ObjectList is parsed
      objectList.map(name => {
        updatedSelection[name] = true; // Set checkbox as checked
      });

      setSelectedItems(updatedSelection);
    } catch (error) {
      console.error('Error fetching existing data:', error);
    }
  };


  const handleCheckboxChange = (name) => {
    setSelectedItems((prevSelected) => ({
      ...prevSelected,
      [name]: !prevSelected[name],
    }));
  };

  const handleSubmit = async () => {
    const ObjectList = Object.keys(selectedItems).filter(name => selectedItems[name]);


    const postData = {
      objectList: JSON.stringify(ObjectList),
      cameraIP: cameraIP,
    };
    const postData2 = {
      objectlist: JSON.stringify(ObjectList),
      camera_id: cameraId, // Ensure camera_id is an integer
      url: publicUrl,
      camera_ip: cameraIP,
      running: "true"
    };
    // console.log(postData2)
    try {
      // Create the headers object
      const headers = {
        Authorization: `Bearer ${token}`,
        // Do not manually set 'Content-Type' if using FormData, it will be set automatically by axios
      };

      // Make the POST request
      await axios.post(`${API}/api/CameraIPList/Post`, postData, { headers });
      await axios.post(`${detection}/details`, { cameras: [postData2] });
      alert("Analytics list add successfully")
      window.location.reload();
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };


  useEffect(() => {
    if (show) {
      fetchExistingData(); // Fetch data when modal is shown
    }
  }, [show, cameraIP]); // Added cameraIP to dependency array

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select Items</Modal.Title>
      </Modal.Header>
      {console.log(cameraIP)}
      <Modal.Body>
        <Form>
          <Row>
            {allItems.map((item) => (
              <Col xs={6} sm={4} md={3} lg={2} key={item.name}>
                <Form.Check
                  className='border-black'
                  type="checkbox"
                  id={`checkbox-${item.name}`}
                  label={item.name}
                  checked={selectedItems[item.name] || false}
                  onChange={() => handleCheckboxChange(item.name)}
                />
              </Col>
            ))}
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => { handleSubmit(); handleClose(); }}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AnalyticsList;

