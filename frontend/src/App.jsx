import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RiskScores from "./pages/RiskScores";
import Interventions from "./pages/Interventions";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<RiskScores />} />
          <Route path="/interventions" element={<Interventions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
