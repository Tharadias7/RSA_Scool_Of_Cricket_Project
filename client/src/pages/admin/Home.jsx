import React from "react";
import SideBar from "../../components/SideBar";
import Box from "@mui/material/Box";
import InfoCard from "../../components/infoCard"; 
import Profile from "../../components/profile";
import "../../App.css";

export default function Home() {
  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <div className="profileBox">
          <Profile />
        </div>
        {/* <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          <InfoCard title="Players" value="100" />
          <InfoCard title="Coaches" value="5" />
          <InfoCard title="Staff" value="4" />
          <InfoCard title="Next Training Session" value="2024/08/08" />
          <InfoCard title="Last Training Session" value="2024/08/01" />
        </Box> */}

       
          
        <div style={{ width: '1140px', height: '541.25px', overflow: 'hidden' }}>
          <iframe
            title="Report3"
            width="1140"
            height="541.25"
            src="https://app.powerbi.com/reportEmbed?reportId=4b858df4-bffe-40b6-8d93-ee3d620ac7f4&autoAuth=true&ctid=aa232db2-7a78-4414-a529-33db9124cba7"
            frameBorder="0"
            allowFullScreen="true"
            style={{ transform: 'scale(1.1)' }}
          ></iframe>
        </div>
         
      </Box>
    </Box>
  );
}