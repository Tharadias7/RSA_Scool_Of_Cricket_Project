import React from "react";
import SideBar from "../../components/SideBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Reports() {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <SideBar />
   
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <h1>Reports</h1>
        </Box>
      </Box>
    </>
  );
}
