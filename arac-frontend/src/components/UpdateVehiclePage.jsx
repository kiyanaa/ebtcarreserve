import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UpdateForm from "../components/UpdateVehicleForm";

export default function UpdateVehiclePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plaka } = location.state || {};

  const [updateForm, setUpdateForm] = useState({
    marka: '',
    model: '',
    yil: '',
    renk: '',
    plaka: "",
    yer: '',
    kullanan: '',
    baslangic: '',
    son: '',
    durum: '',
    tahsis: false,
    tahsisli: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!plaka) {
      // If no plaka passed, redirect back to /araclist
      alert("❌ Geçerli bir plaka bilgisi alınamadı. Araç listesine yönlendiriliyorsunuz.");
      navigate("/araclist");
      return;
    }

    const fetchVehicle = async () => {
      try {
        const response = await fetch(`http://localhost:8000/araclar/${encodeURIComponent(plaka)}`);
        if (!response.ok) throw new Error("Araç bilgisi alınamadı.");

        const data = await response.json();
        const vehicle = data.arac;
        setUpdateForm({
          marka: vehicle.marka || '',
          model: vehicle.model || '',
          yil: vehicle.yil || '',
          renk: vehicle.renk || '',
          plaka: vehicle.plaka || '',
          yer: vehicle.yer || '', 
          kullanan: vehicle.kullanan || '',
          baslangic: vehicle.baslangic || '',
          son: vehicle.son || '',
          durum: vehicle.durum || '',
          tahsis: vehicle.tahsis || false,
          tahsisli: vehicle.tahsisli || ''
        });
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

    try {
      const response = await fetch(`http://localhost:8000/arac_guncelle/${encodeURIComponent(updateForm.plaka)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            yer: updateForm.yer,
            kullanan: updateForm.kullanan,
            baslangic: updateForm.baslangic,
            son: updateForm.son,
            durum: updateForm.durum,
            tahsis: updateForm.tahsis,
            tahsisli: updateForm.tahsisli,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Güncelleme başarısız.");
      }

      alert("✅ Araç başarıyla güncellendi!");
      navigate("/araclist");
    } catch (err) {
      alert("Hata: " + err.message);
    }
  };

  if (loading) return <p>⏳ Yükleniyor...</p>;
  if (error) return <p className="text-red-500">Hata: {error}</p>;

  return (
    <div className="max-w-lg mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4">🚘 Araç Güncelle</h2>
      <UpdateForm
        updateForm={updateForm}
        setUpdateForm={setUpdateForm}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
