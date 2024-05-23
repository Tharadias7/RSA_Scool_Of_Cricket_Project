import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";

const TakeAttendance = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    if (isScanning) {
      const scannerInstance = new Html5QrcodeScanner('reader', {
        qrbox: {
          width: 250,
          height: 250
        },
        fps: 5,
      });

      scannerInstance.render(success, error);
      setScanner(scannerInstance);

      function success(result) {
        setScanResult(result);
        console.log(result);
        stopScanning();
      }

      function error(err) {
        console.warn(err);
      }

      return () => {
        scannerInstance.clear();
      };
    }
  }, [isScanning]);

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
      <h1>Scan QR Code to Record Attendance</h1>
      {scanResult ? (
        <div>
          Success: <a href={"http://" + scanResult}>{scanResult}</a>
        </div>
      ) : (
        <div>
          <div id="reader" style={{ display: isScanning ? 'block' : 'none' }}></div>
          <button onClick={startScanning} disabled={isScanning}>Start Scanning</button>
          <button onClick={stopScanning} disabled={!isScanning}>Stop Scanning</button>
        </div>
      )}
    </div>
  );
}

export default TakeAttendance;
