import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import vmspdf from './assets/Image/vmsfile.pdf'
const useStyles = makeStyles(() => ({
  pdfContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '16px',  // Replacing theme.spacing(2) with '16px'
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',  // Replacing theme.shape.borderRadius with '8px'
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',  // Custom shadow
    marginTop: '32px',  // Replacing theme.spacing(4) with '32px'
    maxWidth: '90%',  // Ensure the container is responsive
  },
  iframe: {
    width: '100%',
    height: '600px',  // Adjust the height as needed
    border: 'none',
  },
  title: {
    marginBottom: '16px',  // Replacing theme.spacing(2) with '16px'
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '16px',  // Replacing theme.spacing(2) with '16px'
  },
}));

const Aboutvms = () => {
  const classes = useStyles();
  const pdfFile = '/vms.pdf'; // Update this to your actual PDF path

  return (
    <Container className={classes.pdfContainer}>
      <Typography variant="h6" className={classes.title}>
        PDF Preview
      </Typography>
      <iframe
        src={vmspdf}
        className={classes.iframe}
        title="PDF Viewer"
      ></iframe>
    </Container>
  );
};

export default Aboutvms;
