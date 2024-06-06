import React from "react";
import SideBar from "../../components/SideBar";
import Box from "@mui/material/Box";
import InfoCard from "../../components/infoCard"; // Adjust the import path as necessary

export default function Home() {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}> 
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            <InfoCard title="Players" value="100" bgColor="#4B4A5A" />
            <InfoCard title="Coaches" value="5" bgColor="#A0ECA0" />
            <InfoCard title="Staff" value="4" bgColor="#A0F0F0" />
            <InfoCard title="Next Training Session" value="2024/08/08" bgColor="#8EF0CE" />
            <InfoCard title="Last Training Session" value="2024/08/01" bgColor="#4B4A5A" />
          </Box>
        </Box>
      </Box>
    </>
  );
}
