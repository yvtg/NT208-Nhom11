import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings/change-password" element={<ChangePassword />} />
        <Route path="/settings/change-profile" element={<ChangeProfile />} />
        <Route path="/settings/change-cv" element={<ChangeCV />} />
        <Route path="/test" element={<Test />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/dashboard" element={<DashBoard />} /> 
        <Route path="jobs/post" element={<PostJob />} />
        <Route path="jobs/page" element={<JobPage />} />
        <Route path="jobs/search" element={<SearchJob />} />
        <Route path="messages/*" element={<Message />} />      




      </Routes>
    </Router>
  );
}

export default App;
