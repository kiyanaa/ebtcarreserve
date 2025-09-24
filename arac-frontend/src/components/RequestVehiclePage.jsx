import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RequestForm from "../components/RequestVehicleForm";

// JWT payload'ı decode etmek için basit fonksiyon
function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (e) {
    return {};
  }
}

export default function RequestVehiclePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plaka } = location.state || {};

  const [requestForm, setRequestForm] = useState({
    marka: "",
    model: "",
    yil: "",
    renk: "",
    plaka: "",
    yer: "",
    gidilecek_yer: "",
    kullanan: "",
    sahip: "",
    baslangic: "",
    son: "",
    neden: "",
    aciliyet: ""
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

    const decoded = parseJwt(token);
    const currentUser = decoded.username || decoded.user || "";

    if (!currentUser) {
      alert("Kullanıcı bilgisi alınamadı.");
      navigate("/login");
      return;
    }

    setRequestForm(prev => ({ ...prev, sahip: currentUser }));

    if (!plaka) {
      setError("❌ Plaka bilgisi alınamadı.");
      setLoading(false);
      return;
    }

    const fetchVehicle = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/araclar/${encodeURIComponent(plaka)}`,
          {
            headers: { "Authorization": `Bearer ${token}` }
          }
        );
        if (!response.ok) throw new Error("Araç bilgisi alınamadı.");

        const data = await response.json();
        const vehicle = data.arac;
        setRequestForm(prev => ({
          ...prev,
          marka: vehicle.marka || "",
          model: vehicle.model || "",
          yil: vehicle.yil || "",
          renk: vehicle.renk || "",
          plaka: vehicle.plaka || plaka,
          sahip: vehicle.tahsisli || "havuz",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Lütfen giriş yapın.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/istek_olustur/${encodeURIComponent(plaka)}`,
        {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(requestForm)
        }
      );

      const result = await response.json();

      if (!response.ok) throw new Error(result.detail || "İstek oluşturma başarısız.");

      alert("✅ İstek başarıyla oluşturuldu.");
      navigate("/arac_istekleri");
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
