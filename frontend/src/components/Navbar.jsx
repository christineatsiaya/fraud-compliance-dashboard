import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-2xl font-bold">Fraud Compliance Dashboard</h1>
          <div className="flex flex-wrap gap-6">
            <Link to="/" className="hover:text-blue-400 transition-colors">
              Risk Scores
            </Link>
            <Link
              to="/interventions"
              className="hover:text-blue-400 transition-colors"
            >
              Interventions
            </Link>
            <Link
              to="/about"
              className="hover:text-blue-400 transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
