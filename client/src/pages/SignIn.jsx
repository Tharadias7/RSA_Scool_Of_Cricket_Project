import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import logoImage from "../assets/logo.png";
import { Button, TextField, Typography, Box } from '@mui/material';
import Swal from 'sweetalert2';

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate(); // Initialize useNavigate

  const login = () => {
    const data = { username: username, password: password };
    axios.post("http://localhost:3001/user/login", data)
      .then((response) => {
        if (response.data.error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.data.error,
            confirmButtonColor: '#791414',
          });
        } else {
          const userRole = response.data.role; // Extract user role from the response
          localStorage.setItem("userRole", userRole); // Store user role in local storage
          const username = response.data.username; 
          localStorage.setItem("username", username);

          navigate("/home");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Something went wrong. Please try again.',
          confirmButtonColor: '#791414',
        });
      });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <img src={logoImage} alt="logo" style={{ width: '100px', height: 'auto', marginBottom: '20px' }} />
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          label="Password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          fullWidth
          sx={{ marginBottom: '20px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={login}
          sx={{ backgroundColor: '#791414', marginBottom: '20px' }}
        >
          Login
        </Button>
      </Box>
    </div>
  );
}

export default SignIn;
