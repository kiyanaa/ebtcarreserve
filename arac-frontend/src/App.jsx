// App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
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

// AppWrapper token kontrolü yapıyor
function AppWrapper() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const payload = parseJwt(token);
  const username = payload?.username || "";

  useEffect(() => {
    if (!username) {
      navigate("/login"); // username boş ise login sayfasına yönlendir
    }
  }, [username, navigate]);

  return <App username={username} />;
}

function App({ username }) {
  return (
    <Routes>
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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/releasevehicle" element={<ReleaseVehiclePage />} />
      <Route path="/logout" element={<LogoutPage />} />
    </Routes>
  );
}

// Router en dışta sarmalıyor
export default function RootApp() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
