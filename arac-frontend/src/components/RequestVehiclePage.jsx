import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RequestForm from "../components/RequestVehicleForm";

export default function RequestVehiclePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plaka } = location.state || {};

  const [requestForm, setRequestForm] = useState({
    plaka: "",
    yer: "",
    gidilecek_yer: "",
    kullanan: "",
    baslangic: "",
    son: "",
    neden: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!plaka) {
      setError("❌ Plaka bilgisi alınamadı.");
      setLoading(false);
      return;
    }

    const fetchVehicle = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/araclar/${encodeURIComponent(plaka)}`
        );
        if (!response.ok) throw new Error("Araç bilgisi alınamadı.");

        const data = await response.json();
        setRequestForm((prev) => ({
          ...prev,
          plaka: data.plaka,
          yer: data.yer || "",
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [plaka]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      `http://localhost:8000/istek_olustur/${encodeURIComponent(plaka)}`,
      {
        method: "PUT", // backend ile uyumlu
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            plaka: requestForm.plaka || plaka,       // URL ile aynı olmalı
            kullanan: requestForm.kullanan || "Bilinmiyor", 
            yer: requestForm.yer || "Bilinmiyor",
            gidilecek_yer: requestForm.gidilecek_yer || "Bilinmiyor",
            baslangic: requestForm.baslangic || "Bilinmiyor",
            son: requestForm.son || "Belli değil",
            neden: requestForm.neden || "Yok",
            aciliyet: requestForm.aciliyet || "Yok",
            })
      }
    );

        const result = await response.json();

        if (!response.ok) {
        throw new Error(result.detail || "İstek oluşturma başarısız.");
        }

        alert("✅ İstek başarıyla oluşturuldu.");
        navigate("/AracList");
    } catch (err) {
        alert("Hata: " + err.message);
    }
    };

  if (loading) return <div className="text-gray-500">⏳ Yükleniyor...</div>;
  if (error) return <div className="text-red-500">Hata: {error}</div>;

  return (
    <RequestForm
      requestForm={requestForm}
      setRequestForm={setRequestForm}
      onSubmit={handleSubmit}
    />
  );
}
