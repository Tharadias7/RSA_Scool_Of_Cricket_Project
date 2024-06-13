import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import SideBar from "../../components/SideBar";
import Profile from "../../components/profile";
import "../../App.css";
import Button from "@mui/material/Button";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DownloadIcon from '@mui/icons-material/Download';

function DeletedItems() {
  const [listOfDeletedItems, setListOfDeletedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef();

  useEffect(() => {
    const fetchDeletedItems = async () => {
      try {
        const response = await axios.get("http://localhost:3001/deletedItem");
        const data = response.data.map(item => ({
          ...item,
          id: item.id,
          item: item.Equipment?.item || 'Unknown',
          brand: item.Equipment?.brand || 'Unknown',
          amount: item.amount,
          date: formatDate(item.date),
          description: item.description,
        }));
        setListOfDeletedItems(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching deleted items:", error);
        setLoading(false);
      }
    };

    fetchDeletedItems();
  }, []);

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('en-US'); 
  };

  const columns = [
    { field: "item", headerName: "Item", width: 150 },
    { field: "brand", headerName: "Brand", width: 150 },
    { field: "amount", headerName: "Removed Amount", width: 150 },
    { field: "date", headerName: "Removed Date", width: 150 },
    { field: "description", headerName: "Reason for Removal", width: 250 },
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
      Deleted Item Report  
      </Button>
<div ref={pdfRef}>
        <div className="topic" style={{marginBottom: '40px'}}>
        Deleted Item Records
      </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <DataGrid
              rows={listOfDeletedItems}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              getRowId={(row) => row.id}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default DeletedItems;
