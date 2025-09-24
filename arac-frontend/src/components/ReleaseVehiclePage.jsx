import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReleaseVehicleForm from "../components/ReleaseVehicleForm";

export default function ReleaseVehiclePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plaka: statePlaka } = location.state || {};
  const urlPlaka = new URLSearchParams(window.location.search).get("plaka");
  const plaka = statePlaka || urlPlaka;

  const [releaseForm, setReleaseForm] = useState({
    marka: "",
    model: "",
    yil: "",
    renk: "",
    plaka: "",
    yer: "",
    son: "",
    neden: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Lütfen giriş yapın.");
      navigate("/login");
      return;
    }

    if (!plaka) {
      setError("❌ Plaka bilgisi alınamadı.");
      setLoading(false);
      return;
    }

    const fetchVehicle = async () => {
      try {
        const response = await fetch(
          `https://cardeal-vduj.onrender.com/araclar/${encodeURIComponent(plaka)}`,
          { headers: { "Authorization": `Bearer ${token}` } }
        );
        if (!response.ok) throw new Error("Araç bilgisi alınamadı.");

        const data = await response.json();
        const vehicle = data.arac;

        setReleaseForm(prev => ({
          ...prev,
          marka: vehicle.marka || "",
          model: vehicle.model || "",
          yil: vehicle.yil || "",
          renk: vehicle.renk || "",
          plaka: vehicle.plaka,
          yer: vehicle.yer || "Bilinmiyor",
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [plaka, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Lütfen giriş yapın.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `https://cardeal-vduj.onrender.com/iade`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify({
            marka: releaseForm.marka,
            model: releaseForm.model,
            yil: releaseForm.yil,
            renk: releaseForm.renk,
            plaka: releaseForm.plaka,
            yer: releaseForm.yer,
            son: releaseForm.son,
            neden: releaseForm.neden || "İş",
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || "İade işlemi başarısız.");

      alert("✅ Araç başarıyla iade edildi.");
      navigate("/AracList");
    } catch (err) {
      alert("Hata: " + err.message);
    }
  };

  if (loading) return <div className="text-gray-500">⏳ Yükleniyor...</div>;
  if (error) return <div className="text-red-500">Hata: {error}</div>;

  return (
    <ReleaseVehicleForm
      releaseForm={releaseForm}
      setReleaseForm={setReleaseForm}
      onSubmit={handleSubmit}
    />
  );
}
