import React from "react";
import axios from "axios";
import { useState} from "react";
import SideBar from "../../components/SideBar";

function Staff() {
  const [listOfUsers, setListOfUsers] = useState([]); 

  React.useEffect(() => {
    axios.get("http://localhost:3001/user").then((response) => {   
      setListOfUsers(response.data); 
    });
  } , []);

  return (
    
    <div>
    <SideBar />
    {listOfUsers.map((value, key) => {
        return (
          <div className="user">
          <div className="title">{value.username}</div>
          <div className="body">{value.password}</div>
          <div className="footer">{value.role}</div>
          </div>
        );
      })}
    </div>
  );
}

export default Staff;
