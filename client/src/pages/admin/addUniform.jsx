import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import SideBar from "../../components/SideBar";
import axios from "axios";
import logoImage from "../../assets/logo.png";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import "../../App.css";

function AddUniform() {
  const initialValues = {
    item: "",
    size: "",
    unitPrice: "",
    amount: "",
  };

  const validationSchema = Yup.object().shape({
    item: Yup.string().required("Item is required"),
    size: Yup.string().required("Size is required"),
    unitPrice: Yup.number()
      .required("Unit price is required")
      .min(1, "Unit price must be greater than 0"),
    amount: Yup.number()
      .required("Amount is required")
      .min(1, "Amount must be greater than 0"),
  });

  const onSubmit = async (data, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);

      const response = await axios.post(
        "http://localhost:3001/uniform",
        data
      );
      console.log("Uniform added successfully", response.data);

      Swal.fire({
        icon: "success",
        title: "Success",
        confirmButtonColor: "#791414",
        text: "Items added to the stock successfully",
      });

      resetForm();
    } catch (error) {
      console.log("Error adding uniform", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        confirmButtonColor: "#791414",
        text: "Failed to add items to the stock",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="registerUserPage">
      <SideBar />
      <div className="container">
        <div className="logo-container">
          <img
            src={logoImage}
            alt="Logo"
            style={{ width: "100px", height: "100px" }}
          />
          <Typography component="h1" variant="h5">
            Add Uniform to Stock
          </Typography>
        </div>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({ setFieldValue }) => (
            <Form className="formContainer">
              <label>Item</label>
              <ErrorMessage name="item" component="span" className="msg" />
              <Autocomplete
                freeSolo
                options={[
                  "Jersey",
                  "Pants",
                  "Cap",
                  "Socks",
                  "Shoes",
                ]}
                onChange={(event, value) => setFieldValue("item", value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="item"
                    onChange={(e) => setFieldValue("item", e.target.value)}
                  />
                )}
              />

              <label>Size</label>
              <ErrorMessage name="size" component="span" className="msg" />
              <Autocomplete
                freeSolo
                options={["XS","S", "M", "L", "XL"]}
                onChange={(event, value) => setFieldValue("size", value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="size"
                    onChange={(e) => setFieldValue("size", e.target.value)}
                  />
                )}
              />

              <label>Unit Price</label>
              <ErrorMessage name="unitPrice" component="span" className="msg" />
              <Field type="number" id="inputRegisterUser" name="unitPrice" />

              <label>Amount</label>
              <ErrorMessage name="amount" component="span" className="msg" />
              <Field type="number" id="inputRegisterUser" name="amount" />

              <div className="button-container">
                <button type="submit" style={{ width: "50%" }}>
                  Add Uniform
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default AddUniform;
