import "./App.css";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom"; 
import Staff from "./pages/admin/Staff";  
import SignUp from "./pages/SignUp"; 
import Home from "./pages/admin/Home";
import Player from "./pages/admin/Player"; 
import playerRegistration from "./pages/admin/playerRegistration";
import Attendance from "./pages/admin/Attendance";
import qrGeneration from "./pages/admin/qrGeneration";
import Inventory from "./pages/admin/Inventory";
import takeAttendance from "./pages/admin/takeAttendance";
import Payment from "./pages/admin/Payment";


function App() {
  return <div className="App">
    <Router>
    
      <Routes>
        <Route path="/" exact Component={Home}/>
        <Route path="/staff" exact Component={Staff}/>
        <Route path="/SignUp" exact Component={SignUp}/>  
        <Route path="/player" exact Component={Player}/> 
        <Route path="/playerRegistration" exact Component={playerRegistration}/>
        <Route path="/attendance" exact Component={Attendance}/>
        <Route path="/qrGeneration" exact Component={qrGeneration}/> 
        <Route path="/inventory" exact Component={Inventory}/>
        <Route path="/takeAttendance" exact Component={takeAttendance}/>
        <Route path="/payment" exact Component={Payment}/>
      </Routes>
    </Router>
  </div>
}

export default App;
