import * as React from "react";
import { Formik, Form } from "formik";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import logoImage from "../assets/logo.png";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import * as Yup from "yup";

const defaultTheme = createTheme();

export default function SignIn() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const initialValues = {
    username: "",
    password: "",
    showPassword: false,
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      console.log(values);
      setSubmitting(false);
    }, 400);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <Form>
          <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box
                sx={{
                  marginTop: 15,
                  padding: 5,
                  display: "flex",
                  // border: "1px solid #000",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={logoImage}
                  alt="Lock"
                  style={{ width: "100px", height: "100px" }}
                />

                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="off"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoFocus
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    helperText={touched.password && errors.password}
                    id="password"
                    value={values.password}
                    error={touched.password && Boolean(errors.password)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ mt: 3, mb: 2 }}
                  >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        </Form>
      )}
    </Formik>
  );
}
