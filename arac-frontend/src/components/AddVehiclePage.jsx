import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
    try {
      const response = await fetch("http://localhost:8000/arac_ekle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          marka: vehicleForm.marka,
          model: vehicleForm.model,
          yil: vehicleForm.yil,
          renk: vehicleForm.renk,
          plaka: vehicleForm.plaka,
          yer: vehicleForm.yer,
          kullanan: vehicleForm.kullanan,
          baslangic: vehicleForm.baslangic,
          son: vehicleForm.son,
          durum: vehicleForm.durum,
          tahsis: vehicleForm.tahsis,
          tahsisli: vehicleForm.tahsisli
        })
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error("Araç eklenirken bir hata oluştu.");
      }

      alert("Araç başarıyla eklendi.");
      navigate("/AracList"); // dikkat: route ismin doğru mu kontrol et
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
        onSubmit={handleSubmit} // handleSubmit artık doğru şekilde bağlandı
        isUpdate={false}
      />
    </div>
  );
}
