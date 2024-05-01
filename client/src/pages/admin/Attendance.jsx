import React from "react";
import SideBar from "../../components/SideBar";
import Box from "@mui/material/Box";

export default function Attendance() {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h1>Attendance</h1>
          </Box>
      </Box>
    </>
  );
}