import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import RiskScores from "./pages/RiskScores";
import Interventions from "./pages/Interventions";
import Methodology from "./pages/Methodology";

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname === "/";

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {!isDashboard && <Navbar />}
      <Routes>
        <Route path="/" element={<RiskScores />} />
        <Route path="/interventions" element={<Interventions />} />
        <Route path="/about" element={<Home />} />
        <Route path="/methodology" element={<Methodology />} />
      </Routes>
      {!isDashboard && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
