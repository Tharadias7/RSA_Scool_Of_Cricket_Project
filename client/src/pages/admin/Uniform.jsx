import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../../components/SideBar";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal, Box, TextField, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../App.css";

function Uniform() {
  const [listOfUniforms, setListOfUniforms] = useState([]);
  const [listOfCoaches, setListOfCoaches] = useState([]);
  const [listOfActivePlayers, setListOfActivePlayers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUniform, setSelectedUniform] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [playerId, setPlayerId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/uniform")
      .then((response) => {
        setListOfUniforms(response.data);
      })
      .catch(error => {
        console.error("Error fetching uniforms:", error);
      });

    axios.get("http://localhost:3001/coach")
      .then((response) => {
        setListOfCoaches(response.data);
      })
      .catch(error => {
        console.error("Error fetching coaches:", error);
      });

    axios.get("http://localhost:3001/player")
      .then((response) => {
        setListOfActivePlayers(response.data);
      })
      .catch(error => {
        console.error("Error fetching active players:", error);
      });
  }, []); // Empty dependency array to ensure this runs only once

  const handleOpen = (uniform) => {
    setSelectedUniform(uniform);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setQuantity("");
    setPlayerId("");
  };

  const handleIssueConfirm = () => {
    const payload = {
      stockId: selectedUniform.stockId,
      playerId: playerId,
      quantity: parseInt(quantity, 10), // Ensure quantity is an integer
      date: new Date().toISOString(), // Ensure the date is in a valid format
    };
    console.log("Payload:", payload);

    axios.post("http://localhost:3001/purchase", payload)
      .then(() => {
        handleClose();
        Swal.fire({
          title: 'Success!',
          text: 'Issue successful',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      })
      .catch(error => {
        handleClose();
        Swal.fire({
          title: 'Oh Snap!',
          text: error.response?.data?.message || 'Something went wrong!',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        console.error("Error issuing uniform:", error);
      });
  };

  const handleAddUniform = () => {
    navigate("/addUniform");
  };

  const handlePurchaseData = () => {
    navigate("/purchases");
  };

  const handleEditUniform = (uniform) => {
    navigate('/editUniform', { state: { uniform } });
  };

  const handleRemoveUniform = (stockId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: '#791414',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3001/uniform/${stockId}`)
          .then(() => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Record has been deleted.',
              icon: 'success',
              confirmButtonColor: '#791414',
            });
            setListOfUniforms(listOfUniforms.filter((uniform) => uniform.stockId !== stockId));
          })
          .catch(error => {
            Swal.fire({
              title: 'Failed!',
              text: error.response?.data?.message || 'Something went wrong',
              icon: 'error',
              confirmButtonColor: '#791414',
            });
            console.error("Error deleting uniform:", error);
          });
      }
    });
  };

  const columns = [
    { field: "stockId", headerName: "Stock ID", width: 150 },
    { field: "item", headerName: "Item", width: 150 },
    { field: "size", headerName: "Size", width: 150 },
    { field: "unitPrice", headerName: "Unit Price (Rs.)", width: 150 },
    { field: "currentStock", headerName: "Current Stock", width: 150 },
    {
      field: "issue",
      headerName: "Issue",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => handleOpen(params.row)}
        >
          Issue
        </Button>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <>
          <Button
            className="button button-margin-right"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => handleEditUniform(params.row)}
            style={{ marginRight: '10px' }}
          >
          </Button>
          <Button
            className="button button-margin-right"
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={() => handleRemoveUniform(params.row.stockId)}
          >
          </Button>
        </>
      )
    }
  ];

  return (
    <div style={{ width: "100%", display: "flex" }}>
      <SideBar />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "20px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            marginBottom: "20px",
            marginLeft: "500px",
          }}
        >
          <Button
            className="button button-margin-right"
            variant="outlined"
            onClick={handlePurchaseData}
          >
            Purchase Data
          </Button>
          <Button
            className="button button-margin-right"
            variant="outlined"
            startIcon={<ControlPointIcon />}
            onClick={handleAddUniform}
          >
            Add
          </Button>
        </div>
        <div style={{ height: 400, width: "auto", margin: "20px" }}>
          <DataGrid
            rows={listOfUniforms}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row.stockId}
          />
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="issue-uniform-modal-title"
        aria-describedby="issue-uniform-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography id="issue-uniform-modal-title" variant="h6" component="h2">
            ISSUE UNIFORM
          </Typography>
          <TextField
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            margin="normal"
            fullWidth
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="player-id-label">Player ID</InputLabel>
            <Select
              labelId="player-id-label"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              label="Player ID"
            >
              {listOfActivePlayers.map((player) => (
                <MenuItem key={player.playerId} value={player.playerId}>
                  {player.playerId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            className="issueConBtn"
            variant="contained"
            onClick={handleIssueConfirm}
            sx={{ mt: 2 }}
          >
            CONFIRM
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default Uniform;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import SideBar from "../../components/SideBar";
// import { DataGrid } from "@mui/x-data-grid";
// import { Button, Modal, Box, TextField, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import ControlPointIcon from "@mui/icons-material/ControlPoint";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import "../../App.css";

// function Uniform() {
//   const [listOfUniforms, setListOfUniforms] = useState([]);
//   const [listOfCoaches, setListOfCoaches] = useState([]);
//   const [listOfActivePlayers, setListOfActivePlayers] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [selectedUniform, setSelectedUniform] = useState(null);
//   const [quantity, setQuantity] = useState("");
//   const [playerId, setPlayerId] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get("http://localhost:3001/uniform")
//       .then((response) => {
//         setListOfUniforms(response.data);
//       })
//       .catch(error => {
//         console.error("Error fetching uniforms:", error);
//       });

//     axios.get("http://localhost:3001/coach")
//       .then((response) => {
//         setListOfCoaches(response.data);
//       })
//       .catch(error => {
//         console.error("Error fetching coaches:", error);
//       });

//     axios.get("http://localhost:3001/player")
//       .then((response) => {
//         setListOfActivePlayers(response.data);
//       })
//       .catch(error => {
//         console.error("Error fetching active players:", error);
//       });
//   }, []); // Empty dependency array to ensure this runs only once

//   const handleOpen = (uniform) => {
//     setSelectedUniform(uniform);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setQuantity("");
//     setPlayerId("");
//   };

//   const handleIssueConfirm = () => {
//     const payload = {
//       stockId: selectedUniform.stockId,
//       employee_no: playerId,
//       issuedAmount: parseInt(quantity, 10), // Ensure quantity is an integer
//       issuedDate: new Date().toISOString(), // Ensure the date is in a valid format
//       collectedDate: null,
//     };
//     console.log("Payload:", payload);

//     axios.post("http://localhost:3001/lending", payload)
//       .then(() => {
//         handleClose();
//         Swal.fire({
//           title: 'Success!',
//           text: 'Issue successful',
//           icon: 'success',
//           confirmButtonText: 'OK',
//         });
//       })
//       .catch(error => {
//         handleClose();
//         Swal.fire({
//           title: 'Oh Snap!',
//           text: error.response?.data?.message || 'Something went wrong!',
//           icon: 'error',
//           confirmButtonText: 'OK',
//         });
//         console.error("Error issuing uniform:", error);
//       });
//   };

//   const handleAddUniform = () => {
//     navigate("/addUniform");
//   };

//   const handlePurchaseData = () => {
//     navigate("/purchases");
//   };

//   const handleEditUniform = (uniform) => {
//     navigate('/editUniform', { state: { uniform } });
//   };

//   const handleRemoveUniform = (stockId) => {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: 'You will not be able to recover this record!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: 'green',
//       cancelButtonColor: '#791414',
//       confirmButtonText: 'Yes, delete it!',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         axios.delete(`http://localhost:3001/uniform/${stockId}`)
//           .then(() => {
//             Swal.fire({
//               title: 'Deleted!',
//               text: 'Record has been deleted.',
//               icon: 'success',
//               confirmButtonColor: '#791414',
//             });
//             setListOfUniforms(listOfUniforms.filter((uniform) => uniform.stockId !== stockId));
//           })
//           .catch(error => {
//             Swal.fire({
//               title: 'Aw Snap!',
//               text: error.response?.data?.message || 'Something went wrong!',
//               icon: 'error',
//               confirmButtonColor: '#791414',
//             });
//             console.error("Error deleting uniform:", error);
//           });
//       }
//     });
//   };

//   const columns = [
//     { field: "stockId", headerName: "Stock ID", width: 150 },
//     { field: "item", headerName: "Item", width: 150 },
//     { field: "size", headerName: "Size", width: 150 },
//     { field: "unitPrice", headerName: "Unit Price (Rs.)", width: 150 },
//     { field: "currentStock", headerName: "Current Stock", width: 150 },
//     {
//       field: "issue",
//       headerName: "Issue",
//       width: 150,
//       renderCell: (params) => (
//         <Button
//           variant="outlined"
//           onClick={() => handleOpen(params.row)}
//         >
//           Issue
//         </Button>
//       ),
//     },
//     {
//       field: 'actions',
//       headerName: 'Actions',
//       width: 200,
//       sortable: false,
//       renderCell: (params) => (
//         <>
//           <Button
//             className="button button-margin-right"
//             variant="outlined"
//             startIcon={<EditIcon />}
//             onClick={() => handleEditUniform(params.row)}
//             style={{ marginRight: '10px' }}
//           >
//           </Button>
//           <Button
//             className="button button-margin-right"
//             variant="outlined"
//             startIcon={<DeleteIcon />}
//             onClick={() => handleRemoveUniform(params.row.stockId)}
//           >
//           </Button>
//         </>
//       )
//     }
//   ];

//   return (
//     <div style={{ width: "100%", display: "flex" }}>
//       <SideBar />
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           marginLeft: "20px",
//           overflow: "hidden",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             width: "100%",
//             marginBottom: "20px",
//             marginLeft: "500px",
//           }}
//         >
//           <Button
//             className="button button-margin-right"
//             variant="outlined"
//             onClick={handlePurchaseData}
//           >
//             Purchase Data
//           </Button>
//           <Button
//             className="button button-margin-right"
//             variant="outlined"
//             startIcon={<ControlPointIcon />}
//             onClick={handleAddUniform}
//           >
//             Add
//           </Button>
//         </div>
//         <div style={{ height: 400, width: "auto", margin: "20px" }}>
//           <DataGrid
//             rows={listOfUniforms}
//             columns={columns}
//             pageSize={5}
//             rowsPerPageOptions={[5]}
//             getRowId={(row) => row.stockId}
//           />
//         </div>
//       </div>
//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="issue-uniform-modal-title"
//         aria-describedby="issue-uniform-modal-description"
//       >
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 400,
//             bgcolor: "background.paper",
//             boxShadow: 24,
//             p: 4,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           <Typography id="issue-uniform-modal-title" variant="h6" component="h2">
//             ISSUE UNIFORM
//           </Typography>
//           <TextField
//             label="Quantity"
//             value={quantity}
//             onChange={(e) => setQuantity(e.target.value)}
//             margin="normal"
//             fullWidth
//           />
//           <FormControl fullWidth margin="normal">
//             <InputLabel id="player-id-label">Player ID</InputLabel>
//             <Select
//               labelId="player-id-label"
//               value={playerId}
//               onChange={(e) => setPlayerId(e.target.value)}
//               label="Player ID"
//             >
//               {listOfActivePlayers.map((player) => (
//                 <MenuItem key={player.playerId} value={player.playerId}>
//                   {player.playerId}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <Button
//             className="issueConBtn"
//             variant="contained"
//             onClick={handleIssueConfirm}
//             sx={{ mt: 2 }}
//           >
//             CONFIRM
//           </Button>
//         </Box>
//       </Modal>
//     </div>
//   );
// }

// export default Uniform;
