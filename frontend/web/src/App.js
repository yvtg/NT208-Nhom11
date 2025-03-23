import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import ChangePassword from "./pages/settings/change-password";
import ChangeProfile from "./pages/settings/change-profile";
import ChangeCV from "./pages/settings/change-cv";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings/change-password" element={<ChangePassword />} />
        <Route path="/settings/change-profile" element={<ChangeProfile />} />
        <Route path="/settings/change-cv" element={<ChangeCV />} />
      </Routes>
    </Router>
  );
}

export default App;
