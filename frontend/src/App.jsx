import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import RiskScores from "./pages/RiskScores";
import Interventions from "./pages/Interventions";
import Methodology from "./pages/Methodology";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<RiskScores />} />
          <Route path="/interventions" element={<Interventions />} />
          <Route path="/about" element={<Home />} />
          <Route path="/methodology" element={<Methodology />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
