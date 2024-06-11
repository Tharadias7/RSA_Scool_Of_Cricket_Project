import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "../../src/App.css"; 
import logoImage from "../assets/logo.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  let navigate = useNavigate(); // Initialize useNavigate

  const login = () => {
    const data = { username: username, password: password };
    axios.post("http://localhost:3001/user/login", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        sessionStorage.setItem("accessToken", response.data);
        navigate("/home"); // Use navigate instead of history.push
      }
    });
  };

  return (
    <div className="loginContainer">
      <img
            src={logoImage}
            alt="Lock"
            style={{ width: "100px", height: "100px" }}
          />
      <h1>Login</h1>
      
      <label>Username:</label>
      <input
        type="text"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
      <button onClick={login}> Login </button>
    </div>
  );
}

export default Login;



// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2"; // Import SweetAlert2
// import '../../src/App.css';  
// import logoImage from "../assets/logo.png";

// function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate(); // Hook for navigation

//   const login = () => {
//     const data = { username: username, password: password };
//     axios.post("http://localhost:3001/user/login", data)
//       .then((response) => {
//         if (response.data.success) {
//           navigate('/home'); // Redirect to home page
//         } else {
//           Swal.fire({
//             icon: 'error',
//             title: 'Failed to login',
//             text: 'Invalid username or password',
//           });
//         }
//       })
//       .catch((error) => {
//         console.error("There was an error!", error);
//         Swal.fire({
//           icon: 'error',
//           title: 'Failed to login',
//           text: 'Internal server error',
//         });
//       });
//   };

//   return (
//     <div className="sign_in-container">
//       <div className="sign_in-top">
//         <div className="sign_in-logo">
//           <img
//             src={logoImage}
//             alt="Logo"
//             style={{ width: "100px", height: "100px" }}
//           />
//         </div>
//         <h1 className="sign_in-title">Login</h1>
//       </div>
//       <div className="sign_in-form">
//         <label className="sign_in-label">Username:</label>
//         <input
//           type="text"
//           className="sign_in-input"
//           onChange={(event) => {
//             setUsername(event.target.value);
//           }}
//         />
//         <label className="sign_in-label">Password:</label>
//         <input
//           type="password"
//           className="sign_in-input"
//           onChange={(event) => {
//             setPassword(event.target.value);
//           }}
//         />
//         <button className="sign_in-button" onClick={login}>Login</button>
//       </div>
//     </div>
//   );
// }

// export default Login;
