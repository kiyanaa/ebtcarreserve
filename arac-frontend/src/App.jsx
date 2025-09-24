// App.jsx
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

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}


function App() {
  const token = localStorage.getItem("token");
  const payload = parseJwt(token);
  const username = payload.username;
  return (
    <Router>
      <Routes>
        {/* Menü sadece / rotasında görünecek */}
        <Route 
          path="/" 
          element={
            <div>
              <Menu />
              <div>{username} Egebimtes Araç Kontrol Sistemine Hoşgeldiniz.</div>
            </div>
          } 
        />

        <Route path="/AracList" element={<AracList />} />
        <Route path="/istekler" element={<RequestsPanel />} />
        <Route path="/updatevehicle" element={<UpdateVehiclePage />} />
        <Route path="/requestvehicle" element={<RequestVehiclePage />} />
        <Route path="/addvehicle" element={<AddVehiclePage />} />
        <Route path="/arac_istekleri" element={<RequestVehiclePanel />} />
        <Route path="/request" element={<AddRequestPage />} />
        <Route path="/login" element= {<LoginPage />} />
        <Route path="/releasevehicle" element={<ReleaseVehiclePage />} />
        <Route path="/logout" element= {<LogoutPage />} />
        <Route path="/register" element= {<RegisterPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
