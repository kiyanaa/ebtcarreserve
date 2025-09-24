import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VehicleForm from "../components/AddVehicleForm";

export default function AddVehiclePage() {
  const navigate = useNavigate();

  const [vehicleForm, setVehicleForm] = useState({
    marka: "",
    model: "",
    yil: "",
    renk: "",
    plaka: "",
    yer: "",
    kullanan: "",
    baslangic: "",
    son: "",
    durum: "",
    tahsis: false,
    tahsisli: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Lütfen giriş yapın.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/arac_ekle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // ✅ Token header olarak eklendi
        },
        body: JSON.stringify(vehicleForm)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Araç eklenirken bir hata oluştu.");
      }

      alert("Araç başarıyla eklendi.");
      navigate("/AracList"); 
    } catch (err) {
      alert(`Hata: ${err.message}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Araç Ekle</h2>
      <VehicleForm
        vehicleForm={vehicleForm}
        setVehicleForm={setVehicleForm}
        onSubmit={handleSubmit}
        isUpdate={false}
      />
    </div>
  );
}
