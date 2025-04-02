import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/home";
import ChangePassword from "./pages/settings/change-password";
import ChangeProfile from "./pages/settings/change-profile";
import ChangeCV from "./pages/settings/change-cv";
import PostJob from "./pages/jobs/post";
import JobPage from "./pages/jobs/page";
import SearchJob from "./pages/jobs/search"; 
import Test from "./pages/test"
import SignUp from "./pages/signup"; 
import Login from "./pages/login"; 
import DashBoard from "./pages/dashboard";  

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token != null;
};

function App() {

  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, [authenticated]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings/change-password" element={<ChangePassword />} />
        <Route path="/settings/change-profile" element={<ChangeProfile />} />
        <Route path="/settings/change-cv" element={<ChangeCV />} />
        <Route path="/test" element={<Test />} />
        
        <Route path="/signup" element={authenticated ? <Navigate to="/dashboard" /> : <SignUp />} />
        <Route path="/login" element={authenticated ? <Navigate to="/dashboard" /> : <Login />} /> 
        
        <Route path="/dashboard" element={authenticated ? <DashBoard /> : <Navigate to="/login" />} />

        <Route path="jobs/post" element={<PostJob />} />
        <Route path="jobs/page" element={<JobPage />} />
        <Route path="jobs/search" element={<SearchJob />} />





      </Routes>
    </Router>
  );
}

export default App;
