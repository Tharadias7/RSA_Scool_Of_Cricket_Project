import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"; 
import Staff from "./pages/admin/Staff";  
import SignUp from "./pages/SignUp"; 

function App() {
  return <div className="App">
    <Router>
    <Link to="/SignUp">Register Staff</Link>
      <Routes>
        <Route path="/" exact Component={Staff}/>
        <Route path="/SignUp" exact Component={SignUp}/>  
      </Routes>
    </Router>
  </div>
}

export default App;
