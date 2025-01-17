import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import backimg from "../../../assets/Image/ajimg/loginbg.jpg"; // Adjust the path based on your project structure
import axios from "axios";
import { CreditAPI } from "serverConnection";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  borderRadius: "12px",
  textAlign: "center",
  padding: theme.spacing(3),
  height: "100%", // Make cards take full height
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const pricingPlans = [
  {
    title: "Silver",
    price: "5000 Credits",
    features: [
      // "Basic Support",
      //  "10 Projects",
      //   "100 Users",
      //    "Email Support"
    ],
    buttonText: "Choose Silver",
    color: "#C0C0C0", // Silver color
    credits: 5000,
  },
  {
    title: "Gold",
    price: "7000 Credits",
    features: [
      // "Priority Support",
      // "Unlimited Projects",
      // "500 Users",
      // "Phone + Email Support",
    ],
    buttonText: "Choose Gold",
    color: "#FFD700", // Gold color
    credits: 7000,
  },
  {
    title: "Diamond",
    price: "10000 Credits",
    features: [
      // "Premium Support",
      // "Unlimited Projects",
      // "Unlimited Users",
      // "Dedicated Manager",
    ],
    buttonText: "Choose Diamond",
    color: "#B9F2FF", // Diamond color
    credits: 10000,
  },
];

const BackgroundBox = styled(Box)({
  backgroundImage: `url(${backimg})`, // Set your background image here
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export default function PricingPlan() {
  const navigate = useNavigate();
  const handlePlanSelection = async (credit) => {
    const userId = Cookies.get("user_id");
    try {
      const payload = {
        entity_id: userId, // Ensure USER_ID is defined and valid
        allocated_credit: credit, // Ensure credit is a valid value
        available_credit: credit,
      };

      console.log("Sending payload:", payload); // Debug the payload

      const response = await axios.post(`${CreditAPI}/event_credit`, payload);

      if (response.status === 201) {
        console.log("Plan selected successfully:", response.data);
        Cookies.set("credit_id", response.data["credit_id"]);
        navigate("/");
      } else {
        console.error("Failed to select plan:", response);
      }
    } catch (error) {
      console.error(
        "Error selecting plan:",
        error.response?.data || error.message || error
      );
    }
  };

  return (
    <BackgroundBox>
      <Box
        sx={{
          flexGrow: 1,
          padding: "32px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <Box textAlign="center" marginBottom={4}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#333",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            Our Pricing Plans
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {pricingPlans.map((plan, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              style={{ height: "100%" }}
            >
              <StyledCard
                sx={{ borderTop: `5px solid ${plan.color}`, height: "250px" }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    component="div"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: plan.color }}
                  >
                    {plan.title}
                  </Typography>

                  <Typography variant="h4" color="text.primary" gutterBottom>
                    {plan.price}
                  </Typography>

                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {plan.features.map((feature, i) => (
                      <li key={i}>
                        <Typography variant="body1" color="text.secondary">
                          {feature}
                        </Typography>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: plan.color,
                      color: "#fff",
                      marginTop: "16px",
                    }}
                    onClick={() => handlePlanSelection(plan.credits)} // Handle button click
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </BackgroundBox>
  );
}
