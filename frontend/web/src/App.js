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
import ChatBot from "./components/ChatBot";
import { ToastProvider } from "./contexts/ToastContext";
import { SocketProvider } from "./contexts/SocketContext";
import MessageHandler from "./components/MessageHandler";

const AppContent = () => {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setAuthenticated(!!token);
    };
    
    checkAuth();
    // Thêm event listener để lắng nghe thay đổi trong localStorage
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
  };

  if (authenticated === null) {
    return <Spinner />;
  }

  return (
    <>
      <MessageHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!authenticated ? <Login setAuthenticated={setAuthenticated} /> : <Navigate to="/dashboard" replace />} />
        <Route path="/signup" element={!authenticated ? <SignUp /> : <Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={authenticated ? <DashBoard onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/settings/change-password" element={authenticated ? <ChangePassword onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/settings/change-profile" element={authenticated ? <ChangeProfile onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/settings/change-cv" element={authenticated ? <ChangeCV onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/jobs/post" element={authenticated ? <PostJob onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/jobs/:id" element={authenticated ? <JobPage onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/jobs/search" element={authenticated ? <SearchJob onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/test" element={<Test />} />
        <Route path="/messages" element={authenticated ? <Message onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/messages/:id" element={authenticated ? <Message onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={authenticated ? <IntroPage /> : <Navigate to="/login" replace />} />
        <Route path="/user/intro" element={authenticated ? <IntroPage /> : <Navigate to="/login" replace />} />
      </Routes>
      <ChatBot />
    </>
  );
};

function App() {
  return (
    <Router>
      <SocketProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </SocketProvider>
    </Router>
  );
}

export default App;
