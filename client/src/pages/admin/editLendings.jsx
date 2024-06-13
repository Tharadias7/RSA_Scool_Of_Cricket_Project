import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  Button,
  TextField,
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import logoImage from "../../assets/logo.png";
import SideBar from "../../components/SideBar";
import Swal from "sweetalert2";
import Profile from "../../components/profile";

const LendingsSchema = Yup.object().shape({
  item: Yup.string().required("Item is required"),
  brand: Yup.string().required("Brand is required"),
  coach: Yup.string().required("Coach is required"),
  amount: Yup.number()
    .required("Amount is required")
    .integer("Must be an integer")
    .positive("Must be positive"),
  issuedDate: Yup.date().required("Issued Date is required").nullable(),
});

const EditLendings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lending } = location.state || {};
  const [lendingData, setLendingData] = useState(lending);
  const [options, setOptions] = useState({
    items: [],
    brands: [],
    activeCoaches: [],
  });

  useEffect(() => {
    if (!lending) {
      navigate("/lendings"); // Redirect to lendings list if no lending data is found
    }

    const fetchOptions = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3001/equipment/options"
        );
        setOptions(data);
      } catch (error) {
        console.error("Error fetching options", error);
      }
    };

    fetchOptions();
  }, [lending, navigate]);

  const handleSubmit = async (values) => {
    try {
      if (!lendingData.id) {
        throw new Error("Lending ID is not defined.");
      }

      // Fetch the stockId based on the selected item and brand
      const stockResponse = await axios.get(
        "http://localhost:3001/equipment/stock", {
          params: {
            item: values.item,
            brand: values.brand
          }
        }
      );

      const stockId = stockResponse.data.stockId;

      // Prepare the updated values for the lending record
      const updatedValues = {
        stockId,
        item: values.item,
        brand: values.brand,
        employee_no: values.coach,  // Already in employee_no format
        issuedAmount: values.amount,
        issuedDate: values.issuedDate,
      };

      // Update the lending record
      await axios.put(
        `http://localhost:3001/lendings/${lendingData.id}`,
        updatedValues
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Lending data updated successfully!",
        confirmButtonColor: "#791414",
      });

      navigate("/lendings");
    } catch (error) {
      console.error("Error updating lending:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error updating lending data.",
        confirmButtonColor: "#791414",
      });
    }
  };

  return (
    <div style={{ width: "100%", display: "flex" }}>
      <SideBar />
      <div className="profileBox">
        <Profile />
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            bgcolor: "background.paper",
          }}
        >
          <img
            src={logoImage}
            alt="logo"
            style={{ width: "120px", height: "auto", marginBottom: "20px" }}
          />
          <Typography component="h1" variant="h5">
            Edit Lending Data
          </Typography>
          <Formik
            initialValues={{
              item: lendingData?.item || "",
              brand: lendingData?.brand || "",
              coach: lendingData?.coach || "",
              amount: lendingData?.issuedAmount || "",
              issuedDate: lendingData?.issuedDate || "",
              collectedDate: lendingData?.collectedDate || "",
            }}
            validationSchema={LendingsSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched, values, setFieldValue }) => (
              <Form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "auto",
                  width: "300px",
                  marginTop: "20px",
                  marginBottom: "60px",
                }}
              >
                <FormControl variant="outlined" margin="normal" fullWidth>
                  <InputLabel id="item-label">Item</InputLabel>
                  <Field
                    as={Select}
                    labelId="item-label"
                    id="item"
                    name="item"
                    label="Item"
                    value={values.item}
                    onChange={(e) => {
                      setFieldValue("item", e.target.value);
                      setLendingData({ ...lendingData, item: e.target.value });
                    }}
                    error={touched.item && !!errors.item}
                  >
                    {options.items.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="item"
                    component="div"
                    style={{ color: "red", marginTop: "10px" }}
                  />
                </FormControl>
                <FormControl variant="outlined" margin="normal" fullWidth>
                  <InputLabel id="brand-label">Brand</InputLabel>
                  <Field
                    as={Select}
                    labelId="brand-label"
                    id="brand"
                    name="brand"
                    label="Brand"
                    value={values.brand}
                    onChange={(e) => {
                      setFieldValue("brand", e.target.value);
                      setLendingData({ ...lendingData, brand: e.target.value });
                    }}
                    error={touched.brand && !!errors.brand}
                  >
                    {options.brands.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="brand"
                    component="div"
                    style={{ color: "red", marginTop: "10px" }}
                  />
                </FormControl>
                <FormControl variant="outlined" margin="normal" fullWidth>
                  <InputLabel id="coach-label">Coach</InputLabel>
                  <Field
                    as={Select}
                    labelId="coach-label"
                    id="coach"
                    name="coach"
                    label="Coach"
                    value={values.coach}
                    onChange={(e) => {
                      setFieldValue("coach", e.target.value);
                      setLendingData({ ...lendingData, coach: e.target.value });
                    }}
                    error={touched.coach && !!errors.coach}
                  >
                    {options.activeCoaches.map((coach) => (
                      <MenuItem
                        key={coach.employee_no}
                        value={coach.employee_no}
                      >
                        {`${coach.name} (${coach.employee_no})`}
                      </MenuItem>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="coach"
                    component="div"
                    style={{ color: "red", marginTop: "10px" }}
                  />
                </FormControl>
                <Field
                  as={TextField}
                  name="amount"
                  label="Amount"
                  type="number"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  error={touched.amount && !!errors.amount}
                  helperText={touched.amount && errors.amount}
                />
                <Field
                  as={TextField}
                  name="issuedDate"
                  label="Issued Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  error={touched.issuedDate && !!errors.issuedDate}
                  helperText={touched.issuedDate && errors.issuedDate}
                />
                <Field
                  as={TextField}
                  name="collectedDate"
                  label="Collected Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  style={{
                    display: lendingData?.collectedDate ? "block" : "none",
                  }}
                  error={touched.collectedDate && !!errors.collectedDate}
                  helperText={touched.collectedDate && errors.collectedDate}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: "20px", backgroundColor: "#791414" }}
                >
                  Update
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </div>
    </div>
  );
};

export default EditLendings;
