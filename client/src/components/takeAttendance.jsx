import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from 'axios';
import Swal from 'sweetalert2';

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
        handleScanResult(result);
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

  const handleScanResult = async (playerId) => {
    try {
      const playerResponse = await axios.get(`http://localhost:3001/player/${playerId}`);
      const playerData = playerResponse.data;

      if (playerData && playerData.active) {
        const attendanceResponse = await axios.get(`http://localhost:3001/attendance/check/${playerId}`);
        const attendanceData = attendanceResponse.data;

        if (!attendanceData.recorded) {
          const today = new Date().toISOString().split('T')[0];
          const attendanceData = {
            playerId: playerId,
            date: today,
            attendanceStatus: true
          };

          await axios.post('http://localhost:3001/attendance', attendanceData);
          Swal.fire({
            icon: 'success',
            title: 'Attendance Recorded Successfully',
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Attendance Already Recorded',
            text: `${playerId} player's attendance is already recorded for today.`,
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Not a Valid Player',
          text: 'The player ID is invalid or inactive. Please scan a valid and active player ID.'
        });
      }
    } catch (error) {
      console.error('Error processing scan result', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Record the Attendance',
        text: 'This player already has attendance recorded for today'
      });
    }
  };

  return (
    <div>
      {scanResult ? (
        <div>
          Result: <a href={"http://" + scanResult}>{scanResult}</a>
        </div>
      ) : (
        <div>
          <div id="reader" style={{ display: isScanning ? 'block' : 'none' }}></div>
          <button onClick={startScanning} disabled={isScanning}>Open Scanner</button>
          <button onClick={stopScanning} disabled={!isScanning}>Close Scanner</button>
        </div>
      )}
    </div>
  );
}

export default TakeAttendance;


// import React, { useEffect, useState } from 'react';
// import { Html5QrcodeScanner } from "html5-qrcode";
// import axios from 'axios';
// import Swal from 'sweetalert2';

// const TakeAttendance = () => {
//   const [scanResult, setScanResult] = useState(null);
//   const [isScanning, setIsScanning] = useState(false);
//   const [scanner, setScanner] = useState(null);

//   useEffect(() => {
//     if (isScanning) {
//       const scannerInstance = new Html5QrcodeScanner('reader', {
//         qrbox: {
//           width: 250,
//           height: 250
//         },
//         fps: 5,
//       });

//       scannerInstance.render(success, error);
//       setScanner(scannerInstance);

//       function success(result) {
//         setScanResult(result);
//         console.log(result);
//         stopScanning();
//         handleScanResult(result);
//       }

//       function error(err) {
//         console.warn(err);
//       }

//       return () => {
//         scannerInstance.clear();
//       };
//     }
//   }, [isScanning]);

//   const startScanning = () => {
//     setIsScanning(true);
//   };

//   const stopScanning = () => {
//     if (scanner) {
//       scanner.clear();
//       setScanner(null);
//     }
//     setIsScanning(false);
//   };

//   const handleScanResult = async (playerId) => {
//     try {
//       const playerResponse = await axios.get('http://localhost:3001/player');
//       const players = playerResponse.data;

//       const playerExists = players.some(player => player.playerId === playerId);

//       if (playerExists) {
//         const attendanceData = {
//           playerId: playerId,
//           date: new Date().toISOString().split('T')[0],
//           attendanceStatus: true
//         };

//         await axios.post('http://localhost:3001/attendance', attendanceData);
//         Swal.fire({
//           icon: 'success',
//           title: 'Attendance Recorded Successfully',
//           showConfirmButton: false,
//           timer: 1500
//         });
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'Not a Valid Player',
//           text: 'The player Id is invalid. Please scan a valid player Id'
//         });
//       }
//     } catch (error) {
//       console.error('Error processing scan result', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Failed to Record the Attendance',
//         text: 'There was an error while recording the attendance.'
//       });
//     }
//   };

//   return (
//     <div>
//       {scanResult ? (
//         <div>
//           Result: <a href={"http://" + scanResult}>{scanResult}</a>
//         </div>
//       ) : (
//         <div>
//           <div id="reader" style={{ display: isScanning ? 'block' : 'none' }}></div>
//           <button onClick={startScanning} disabled={isScanning}>Open Scanner</button>
//           <button onClick={stopScanning} disabled={!isScanning}>Close Scanner</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default TakeAttendance;
