import React, { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import QRCode from "react-qr-code";
import ReactToPrint from "react-to-print";

export default function qrGeneration() {
  const [qrCodeValue, setQrCodeValue] = useState("");
  const qrRef = useRef();

  const handleSubmit = (values, { setSubmitting }) => {
    setQrCodeValue(values.playerId);
    setSubmitting(false);
  };

  return (
    <Formik initialValues={{ playerId: "" }} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form className="qrForm">
          <h1 className="qrTitle"> QR Code Generator</h1>
          <label htmlFor="playerId">Player ID</label>
          <Field
            type="text"
            name="playerId"
            className="qrInput"
            required
            placeholder="Enter player ID"
          />
          <ErrorMessage name="playerId" component="div" className="qrError" />
          <button type="submit" className="qrButton" disabled={isSubmitting}>
            Generate
          </button>

          {qrCodeValue && (
            <div className="qrCodeContainer" >
            <div ref={qrRef}>
              <QRCode value={qrCodeValue} />
            </div>
              <ReactToPrint
                trigger={() => 
                  <button type="button" className="qrPrintButton">Print</button>
                }
                content={() => qrRef.current}
                documentTitle="QR Code"
                pageStyle="@page { size: 3in 3in; margin: 0; } @media print { body { margin: 0; } }"
                onAfterPrint={()=> {console.log("QR Printed")}}
              />
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
}

// import React, { useState, useRef } from "react";
// import axios from "axios";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import QRCode from "react-qr-code";
// import ReactToPrint from "react-to-print";

// export default function qrGeneration() {
//   const [playerExists, setPlayerExists] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [qrCodeValue, setQrCodeValue] = useState("");
//   const qrRef = useRef();

//   const handleSubmit = async (values, { setSubmitting }) => {
//     setSubmitting(true);
//     setErrorMessage(""); // Clear previous error message
//     setPlayerExists(false); // Reset playerExists state
//     setQrCodeValue(""); // Clear previous QR code value

//     try {
//       const response = await axios.get(
//         `http://localhost:3001/player/${values.playerId}`
//       );

//       if (response.data && response.data.playerId == values.playerId) {
//         // Player data is returned, update the component state
//         setPlayerExists(true);
//         setQrCodeValue(values.playerId);
//       } else {
//         // Player data is not returned, show an error message
//         setPlayerExists(false);
//         setQrCodeValue(""); // Clear previous QR code value
//         setErrorMessage("An error occurred while checking the player ID");
//       }
//     } catch (error) {
//       console.error(error);
//       setQrCodeValue("");
//       setErrorMessage("Invalid player ID");
//     }

//     setSubmitting(false);
//   };

//   return (
//     <Formik initialValues={{ playerId: "" }} onSubmit={handleSubmit}>
//       {({ isSubmitting }) => (
//         <Form className="qrForm">
//           <h1 className="qrTitle"> QR Code Generator</h1>
//           <label htmlFor="playerId">Player ID</label>
//           <Field
//             type="text"
//             name="playerId"
//             className="qrInput"
//             required
//             placeholder="Enter player ID"
//           />
//           <ErrorMessage name="playerId" component="div" className="qrError" />
//           <button type="submit" className="qrButton" disabled={isSubmitting}>
//             Generate
//           </button>
//           {errorMessage && <p className="qrError">{errorMessage}</p>}

//           {playerExists && (
//             <div className="qrCodeContainer" >
//             <div ref={qrRef}>
//               <QRCode value={qrCodeValue} />
//             </div>
//               <ReactToPrint
//                 trigger={() => 
//                   <button type="button" className="qrPrintButton">Print</button>
//                 }
//                 content={() => qrRef.current}
//                 documentTitle="QR Code"
//                 pageStyle="@page { size: 3in 3in; margin: 0; } @media print { body { margin: 0; } }"
//                 onAfterPrint={()=> {console.log("QR Printed")}}
//               />
//             </div>
//           )}
//         </Form>
//       )}
//     </Formik>
//   );
// }
