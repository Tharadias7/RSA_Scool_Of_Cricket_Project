import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideBar from "../../components/SideBar";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import "../../App.css";
import Button from "@mui/material/Button";
import Profile from "../../components/profile";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DownloadIcon from '@mui/icons-material/Download';

function Purchases() {
  const [listOfPurchases, setListOfPurchases] = useState([]);
  const [listOfUniforms, setListOfUniforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 
  const pdfRef = useRef();

  useEffect(() => {
    const fetchUniforms = async () => {
      try {
        const response = await axios.get("http://localhost:3001/uniform");
        setListOfUniforms(response.data);
      } catch (error) {
        console.error("Error fetching uniforms:", error);
      }
    };

    fetchUniforms();
  }, []);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get("http://localhost:3001/purchase");
        setListOfPurchases(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching purchases:", error);
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  const mergedPurchases = listOfPurchases.map((purchase) => {
    const uniform = listOfUniforms.find((uniform) => uniform.stockId === purchase.stockId);
    return {
      ...purchase,
      id: purchase.transactionId,
      item: uniform ? uniform.item : 'Unknown',
      size: uniform ? uniform.size : 'Unknown',
    };
  });

  const handleEdit = (purchase) => {
    navigate("/editPurchases", { state: { purchase } });  // Use navigate to go to the edit page
  };

  const handleDelete = (purchaseId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3001/purchase/${purchaseId}`)
          .then(() => {
            setListOfPurchases(listOfPurchases.filter((purchase) => purchase.transactionId !== purchaseId));
            Swal.fire(
              'Deleted!',
              'Purchase has been deleted.',
              'success'
            );
          })
          .catch(error => {
            Swal.fire(
              'Error!',
              error.response?.data?.message || 'Something went wrong!',
              'error'
            );
            console.error("Error deleting purchase:", error);
          });
      }
    });
  };

  const columns = [
    { field: "item", headerName: "Item", width: 125 },
    { field: "size", headerName: "Size", width: 150 },
    { field: "playerId", headerName: "Player ID", width: 150 },
    { field: "unitPrice", headerName: "Unit Price", width: 150 },
    { field: "quantity", headerName: "Quantity", width: 150 },
  ];

  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4', true);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 30;
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save('purchases.pdf');
    });
};

  return (
    <div style={{ width: "100%", display: "flex" }}>
      <SideBar />
      <div className="profileBox">
        <Profile />
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "20px",
          marginTop: "60px",
          overflow: "hidden",
        }}
       
      >
      <Button
      className="button button-margin-right"
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={downloadPDF}
        style={{ marginBottom: "20px" }}
      >
        purchases Report  
      </Button>
<div ref={pdfRef}>
      <div className='topic' style={{marginBottom: '20px', alignItems: "center",justifyContent: "center",}}>
      Uniform Purchase Records
      </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <DataGrid
              rows={mergedPurchases}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              getRowId={(row) => row.id}
            />
          )} </div>
        </div>
      </div>
  );
}

export default Purchases;