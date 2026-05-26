import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import RiskScores from "./pages/RiskScores";
import Interventions from "./pages/Interventions";
import Methodology from "./pages/Methodology";
import RiskMap from "./pages/RiskMap";
import SarAnalytics from "./pages/SarAnalytics";

function AppContent() {
  const location = useLocation();
  const isDashboard =
    location.pathname === "/dashboard" ||
    location.pathname === "/interventions" ||
    location.pathname === "/methodology" ||
    location.pathname === "/risk-map" ||
    location.pathname === "/sar-analytics";

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {!isDashboard && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<RiskScores />} />
        <Route path="/interventions" element={<Interventions />} />
        <Route path="/about" element={<Home />} />
        <Route path="/methodology" element={<Methodology />} />
        <Route path="/risk-map" element={<RiskMap />} />
        <Route path="/sar-analytics" element={<SarAnalytics />} />
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
