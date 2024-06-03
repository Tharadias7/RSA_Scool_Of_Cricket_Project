import "./App.css";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom"; 
import Staff from "./pages/admin/Staff";  
import SignUp from "./pages/SignUp"; 
import Home from "./pages/admin/Home";
import Player from "./pages/admin/Player"; 
import playerRegistration from "./components/playerRegistration";
import Attendance from "./pages/admin/Attendance";
import qrGeneration from "./components/qrGeneration";
import Inventory from "./pages/admin/Inventory";
import takeAttendance from "./components/takeAttendance";
import Payment from "./pages/admin/Payment";
import CollectPayment from "./components/collectPayment";
import Equipment from "./pages/admin/Equipment";
import Uniform from "./pages/admin/Uniform";
import AddEquipment from "./pages/admin/addEquipment";
import issueItems from "./components/issueItems";
import editStaff from "./pages/admin/editStaff";
import editPlayer from "./components/editPlayer";
import AddUniform from "./pages/admin/addUniform";
import EditUniform from "./pages/admin/editUniform";
import editEquipment from "./pages/admin/editEquipment";

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
        <Route path="/collectPayment" exact Component={CollectPayment}/>
        <Route path="/equipment" exact Component={Equipment}/>
        <Route path="/uniform" exact Component={Uniform}/>
        <Route path="/addEquipment" exact Component={AddEquipment}/>
        <Route path="/issueItems" exact Component={issueItems}/>
        <Route path="/editStaff" exact Component={editStaff} />
        <Route path="/editPlayer" exact Component={editPlayer} />
        <Route path="/addUniform" exact Component={AddUniform} />
        <Route path="/editUniform" exact Component={EditUniform} />
        <Route path="/editEquipment" exact Component={editEquipment} />
      </Routes>
    </Router>
  </div>
}

export default App;
