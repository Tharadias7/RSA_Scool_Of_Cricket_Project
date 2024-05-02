import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"; 
import Staff from "./pages/admin/Staff";  
import SignUp from "./pages/SignUp"; 
import Home from "./pages/admin/Home";

function App() {
  return <div className="App">
    <Router>
    
      <Routes>
        <Route path="/" exact Component={Home}/>
        <Route path="/staff" exact Component={Staff}/>
        <Route path="/SignUp" exact Component={SignUp}/>  
      </Routes>
    </Router>
  </div>
}

export default App;
