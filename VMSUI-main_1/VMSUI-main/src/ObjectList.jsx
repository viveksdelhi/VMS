import React, { useState } from 'react';
import { Grid, Typography, Container, Paper, Box, Checkbox, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const cocoCategories = [
  "Person", "Bicycle", "Car", "Motorcycle", "Airplane", "Bus", "Train", "Truck", "Boat",
  "Traffic light", "Fire hydrant", "Stop sign", "Parking meter", "Bench", "Bird", "Cat",
  "Dog", "Horse", "Sheep", "Cow", "Elephant", "Bear", "Zebra", "Giraffe", "Backpack",
  "Umbrella", "Handbag", "Tie", "Suitcase", "Frisbee", "Skis", "Snowboard", "Sports ball",
  "Kite", "Baseball bat", "Baseball glove", "Skateboard", "Surfboard", "Tennis racket",
  "Bottle", "Wine glass", "Cup", "Fork", "Knife", "Spoon", "Bowl", "Banana", "Apple",
  "Sandwich", "Orange", "Broccoli", "Carrot", "Hot dog", "Pizza", "Donut", "Cake",
  "Chair", "Couch", "Potted plant", "Bed", "Dining table", "Toilet", "TV", "Laptop",
  "Mouse", "Remote", "Keyboard", "Cell phone", "Microwave", "Oven", "Toaster", "Sink",
  "Refrigerator", "Book", "Clock", "Vase", "Scissors", "Teddy bear", "Hair drier", "Toothbrush"
];

const darkBlue = 'rgb(34, 42, 68)';
const lightBlue = 'rgb(60, 78, 106)';
const textColor = '#ffffff';

const ObjectList = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleCheckboxChange = (category) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((item) => item !== category)
        : [...prevSelected, category]
    );
  };

  const handleViewSelected = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem', backgroundColor: darkBlue }}>
      <Paper elevation={3} style={{ padding: '24px', backgroundColor: lightBlue }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" style={{ color: textColor, fontWeight: 'bold' }}>
          Ajeevi VMS Object Detection List [ 80 ]
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleViewSelected}
          style={{ marginBottom: '16px' }}
        >
          View Selected Items
        </Button>
        <Grid container spacing={2}>
          {cocoCategories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                style={{
                  height: '140px', // Increased height for checkbox
                  border: `1px solid ${darkBlue}`,
                  borderRadius: '8px',
                  backgroundColor: textColor,
                  padding: '16px',
                  boxShadow: `0px 4px 8px rgba(0, 0, 0, 0.3)`,
                  textAlign: 'center',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: `0px 6px 12px rgba(0, 0, 0, 0.4)`,
                    backgroundColor: '#f0f0f0'
                  }
                }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Typography variant="body1" style={{ color: darkBlue, fontWeight: 'bold' }}>
                    {category}
                  </Typography>
                  <Checkbox
                    checked={selectedItems.includes(category)}
                    onChange={() => handleCheckboxChange(category)}
                    style={{ color: darkBlue }}
                  />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Selected Items</DialogTitle>
        <DialogContent>
          {selectedItems.length > 0 ? (
            <ul>
              {selectedItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <Typography>No items selected</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ObjectList;
  