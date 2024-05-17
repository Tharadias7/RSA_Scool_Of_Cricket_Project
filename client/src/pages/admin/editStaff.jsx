import React from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function EditStaff() {
  const location = useLocation();

  // Extract the selected row data from the URL and decode it
  const pathname = location.pathname;
  const encodedData = pathname.substring(pathname.lastIndexOf('/') + 1);
  const selectedRow = JSON.parse(decodeURIComponent(encodedData));

  // Initialize the Formik values with the selected row data
  const initialValues = {
    employee_no: selectedRow.employee_no,
    name: selectedRow.name,
    designation: selectedRow.designation,
    contact_no: selectedRow.contact_no,
  };

  // Define the validation schema using Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    designation: Yup.string().required('Designation is required'),
    contact_no: Yup.string()
      .matches(/^[0-9]+$/, 'Contact number must be a number')
      .min(10, 'Contact number must be at least 10 digits')
      .max(12, 'Contact number must not exceed 12 digits')
      .required('Contact number is required'),
  });

  // Handle form submission to update the staff member
  const handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);

    // Make an API call to update the staff member
    axios.put(`http://localhost:3001/staff/${values.employee_no}`, values)
      .then(() => {
        // Redirect to the Staff page after successful update
        window.history.back();
      })
      .catch((error) => {
        console.log(error);
        setSubmitting(false);
      });
  };

  return (
    <div>
      <h1>Edit Staff Member</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field type="hidden" name="employee_no" />
            <label htmlFor="name">Name</label>
            <Field type="text" name="name" />
            <ErrorMessage name="name" component="div" />
            <label htmlFor="designation">Designation</label>
            <Field type="text" name="designation" />
            <ErrorMessage name="designation" component="div" />
            <label htmlFor="contact_no">Contact Number</label>
            <Field type="text" name="contact_no" />
            <ErrorMessage name="contact_no" component="div" />
            <button type="submit" disabled={isSubmitting}>
              Save Changes
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EditStaff;
