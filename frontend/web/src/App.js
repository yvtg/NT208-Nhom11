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
import Message from "./pages/messages";
import Spinner from "./components/Spinner";

import IntroPage from "./pages/user/intro";

const isAuthenticated = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const response = await fetch("http://localhost:3000/api/auth/verify-token", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Invalid token");
    }

    const data = await response.json();
    return data.valid;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
};

function App() {

  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const checkAuth = async () => {
          const authenticated = await isAuthenticated();
          setAuthenticated(authenticated);
          setLoading(false)
      };

      checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    setAuthenticated(false);
  };

  if (loading) {
    return <Spinner />
  }
  

  return (
    <Router>
      <Routes key={authenticated}>
        <Route path="/" element={<Home />} />
        <Route path="/settings/change-password" element={<ChangePassword />} />
        <Route path="/settings/change-profile" element={<ChangeProfile />} />
        <Route path="/settings/change-cv" element={<ChangeCV />} />
        <Route path="/test" element={<Test />} />
        
        <Route path="/signup" element={authenticated ? <Navigate to="/dashboard" /> : <SignUp />} />
        <Route path="/login" element={authenticated ? <Navigate to="/dashboard" /> : <Login setAuthenticated={setAuthenticated} />} /> 
        <Route path="/dashboard" element={authenticated ? <DashBoard onLogout={handleLogout} /> : <Navigate to="/login" />} />

        <Route path="/jobs/post" element={<PostJob />} />
        <Route path="/jobs/page" element={<JobPage />} />
        <Route path="/jobs/search" element={<SearchJob />} />
        <Route path="/messages/:id" element={authenticated ? <Message onLogout={handleLogout} /> : <Navigate to="/login" />} />

        <Route path="/profile" element={authenticated ? <IntroPage /> : <Navigate to="/login" />} /> 
        <Route path="/user/intro" element={<IntroPage />} />

      </Routes>
    </Router>
  );
}

export default App;
