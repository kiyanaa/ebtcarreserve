import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AracList from "./components/AracList";
import RequestsPanel from "./components/RequestsPanel";
import RequestVehiclePage from './components/RequestVehiclePage';
import UpdateVehiclePage from './components/UpdateVehiclePage';
import AddVehiclePage from './components/AddVehiclePage';
import RequestVehiclePanel from "./components/RequestVehiclePanel";
import AddRequestPage from "./components/AddRequestPage";
import ReleaseVehiclePage from "./components/ReleaseVehiclePage";
import Menu from "./Menu"; 
import LoginPage from "./components/LoginPage";
import LogoutPage from "./components/LogoutPage";
import RegisterPage from "./components/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login / Register route'ları herkese açık */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected route'lar */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <div>
                <Menu />
                <div>Egebimtes Araç Kontrol Sistemine Hoşgeldiniz.</div>
              </div>
            </ProtectedRoute>
          } 
        />
        <Route path="/AracList" element={
          <ProtectedRoute><AracList /></ProtectedRoute>
        } />
        <Route path="/istekler" element={
          <ProtectedRoute><RequestsPanel /></ProtectedRoute>
        } />
        <Route path="/updatevehicle" element={
          <ProtectedRoute><UpdateVehiclePage /></ProtectedRoute>
        } />
        <Route path="/requestvehicle" element={
          <ProtectedRoute><RequestVehiclePage /></ProtectedRoute>
        } />
        <Route path="/addvehicle" element={
          <ProtectedRoute><AddVehiclePage /></ProtectedRoute>
        } />
        <Route path="/arac_istekleri" element={
          <ProtectedRoute><RequestVehiclePanel /></ProtectedRoute>
        } />
        <Route path="/request" element={
          <ProtectedRoute><AddRequestPage /></ProtectedRoute>
        } />
        <Route path="/releasevehicle" element={
          <ProtectedRoute><ReleaseVehiclePage /></ProtectedRoute>
        } />
        <Route path="/logout" element={
          <ProtectedRoute><LogoutPage /></ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
