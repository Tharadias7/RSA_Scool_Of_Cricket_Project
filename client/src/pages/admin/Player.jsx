import React from "react";
import SideBar from "../../components/SideBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Player() {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <SideBar />
        
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <h1>Player</h1>
        </Box>
      </Box>
    </>
  );
}
