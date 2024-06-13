import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you are using react-router-dom for navigation
import '../App.css'; 
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PersonIcon from '@mui/icons-material/Person';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Profile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState({ username: '', role: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('userRole');
    if (storedUsername && storedRole) {
      setUser({ username: storedUsername, role: storedRole });
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    navigate('/'); 
  };

  return (
    <div className="profile-container">
      <div className="profile-header" onClick={toggleDropdown}>
        <AccountCircleIcon className="profile-icon" />
        <span className="profile-name">{user.username}</span>
        <div className="profile-arrow">
          {isDropdownOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </div>
      </div>
      {isDropdownOpen && (
        <div className="profile-dropdown">
          <div className="dropdown-item">
            <PersonIcon className="dropdown-icon" />
            {user.role}
          </div>
          <div className="dropdown-item">
            <VpnKeyIcon className="dropdown-icon" />
            Change Password
          </div>
          <div className="dropdown-item" onClick={handleLogout}>
            <ExitToAppIcon className="dropdown-icon" />
            Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;