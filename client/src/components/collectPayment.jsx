import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from 'axios';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';
import Swal from 'sweetalert2';

const CollectPayment = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanner, setScanner] = useState(null);
  const [playerExists, setPlayerExists] = useState(false);
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('');
  const [playerId, setPlayerId] = useState(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    if (isScanning) {
      const scannerInstance = new Html5QrcodeScanner('reader', {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      });

      scannerInstance.render(success, error);
      setScanner(scannerInstance);

      function success(result) {
        setScanResult(result);
        setPlayerId(result);
        console.log("Scan success:", result);
        stopScanning();
        checkPlayerExists(result);
      }

      function error(err) {
        console.warn("QR code parse error, error =", err);
      }

      return () => {
        scannerInstance.clear();
      };
    }
  }, [isScanning]);

  const checkPlayerExists = async (playerId) => {
    try {
      const response = await axios.get(`http://localhost:3001/player/${playerId}`);
      if (response.data) {
        setPlayerExists(true);
      } else {
        setPlayerExists(false);
      }
    } catch (error) {
      console.error("Error checking player ID:", error);
      setPlayerExists(false);
    }
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleSubmit = async () => {
    if (amount && month && playerId) {
      const paymentData = {
        date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        amount: parseFloat(amount), // Ensure the amount is a number
        month: month, // Month as a string
        playerId: playerId, // Player ID as a string
      };

      console.log("Submitting payment data:", paymentData); // Log payload

      try {
        const response = await axios.post("http://localhost:3001/payment", paymentData);
        console.log("Payment record created successfully:", response.data);
        Swal.fire({
          icon: 'success',
          title: 'Payment Recorded Successfully',
          showConfirmButton: false,
          timer: 1500
        });
        resetForm();
      } catch (error) {
        console.error("Error creating payment record:", error.response ? error.response.data : error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to Record the Payment',
          text: error.response ? error.response.data.message : error.message
        });
      }
    } else {
      alert("Please enter all fields.");
    }
  };

  const resetForm = () => {
    setAmount('');
    setMonth('');
    setPlayerExists(false);
    setPlayerId(null);
  };

  const startScanning = () => {
    setIsScanning(true);
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.clear();
      setScanner(null);
    }
    setIsScanning(false);
  };

  return (
    <div>
      <h1>Record Payment</h1>
      <div id="reader" style={{ display: isScanning ? 'block' : 'none' }}></div>
      {!isScanning && !playerExists && (
        <Button onClick={startScanning} variant="contained" color="primary" disabled={isScanning}>Start Scanning</Button>
      )}
      {isScanning && (
        <Button onClick={stopScanning} variant="contained" color="secondary" disabled={!isScanning}>Stop Scanning</Button>
      )}
      {playerExists && (
        <Box component="form" sx={{ mt: 3 }}>
          <TextField
            label="Amount"
            value={amount}
            onChange={handleAmountChange}
            type="number"
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="month-label">Month</InputLabel>
            <Select
              labelId="month-label"
              value={month}
              onChange={handleMonthChange}
              label="Month"
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>{month}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
        </Box>
      )}
    </div>
  );
}

export default CollectPayment;
