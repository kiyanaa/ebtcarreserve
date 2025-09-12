import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom"; // Import Link and useLocation
import AracList from "./components/AracList";
import RequestsPanel from "./components/RequestsPanel";
import RequestVehiclePage from './components/RequestVehiclePage'
import UpdateVehiclePage from './components/UpdateVehiclePage'

function Menu() {
  const location = useLocation(); // Get current route location

  // Conditionally render the menu based on the current route
  const showMenu = location.pathname === "/";

  return (
    <>
      {showMenu && (
        <div className="max-w-6xl mx-auto p-8 space-y-6">
          <h2 className="text-xl font-semibold text-gray-700">Menü</h2>

          {/* Navigation buttons */}
          <div className="flex gap-4">
            <Link to="/AracList">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Araç Listesi
              </button>
            </Link>
            <Link to="/istekler">
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                İstekler
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <div>
        {/* Header Section */}
        <header className="p-6 bg-blue-600 text-white">
          <h1 className="text-3xl font-bold">Araç Tahsis Sistemi</h1>
        </header>

        {/* Menu Component is now inside Router */}
        <Menu />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<div>Welcome to the Menu! Please select an option above.</div>} />
          <Route path="/AracList" element={<AracList />} />
          <Route path="/istekler" element={<RequestsPanel />} />
          <Route path="/updatevehicle" element={<UpdateVehiclePage />} />
          <Route path="/requestvehicle" element={<RequestVehiclePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
