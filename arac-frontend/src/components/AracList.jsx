import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AracList = React.memo(function AracList() {
  const [vehicles, setVehicles] = useState([]); // Araç verileri
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("https://cardeal-vduj.onrender.com/araclar");
        if (!response.ok) throw new Error("Veri alırken bir hata oluştu");
        const data = await response.json();

        // Durumu 'uygun' olanlar en üstte olacak şekilde sırala
        const sortedData = data.sort((a, b) => {
          if (a.durum === "uygun" && b.durum !== "uygun") return -1;
          if (a.durum !== "uygun" && b.durum === "uygun") return 1;
          if (a.durum === "kullanımda" && b.durum !== "kullanımda") return -1;
          if (a.durum !== "kullanımda" && b.durum === "kullanımda") return 1;  
          
          return 0;
        });

        setVehicles(sortedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleDeleteVehicle = async (plaka) => {
    const confirmDelete = window.confirm(
      `Aracı silmek istediğinize emin misiniz? Plaka: ${plaka}`
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://cardeal-vduj.onrender.com/araclar/${plaka}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Araç silinirken bir hata oluştu.");
      }

      setVehicles(vehicles.filter((vehicle) => vehicle.plaka !== plaka));
      alert("Araç başarıyla silindi.");
    } catch (error) {
      alert(`Hata: ${error.message}`);
    }
  };

  const handleUpdateVehicle = (plaka) => {
    navigate("/updatevehicle", { state: { plaka } });
  };

  const handleRequestVehicle = (plaka) => {
    navigate("/requestvehicle", { state: { plaka } });
  };

  const handleAddVehicle = () => {
    navigate("/addvehicle");
  };

  const handleReleaseVehicle = (plaka) => {
    navigate("/releasevehicle", { state: { plaka } });
  };
  const handleBack = () => {
    navigate("/");
  };

  // 🟡 Tahsisli aracı al
  const handleTakeVehicle = async (vehicle) => {
    try {
      const response = await fetch(`https://cardeal-vduj.onrender.com/uzerine_al/${vehicle.plaka}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kullanan: vehicle.tahsisli,
          yer: vehicle.yer,
          baslangic: new Date().toISOString(), // Başlangıcı şimdi yapıyoruz
          son: vehicle.son || "Belli değil",
          neden: "Tahsisli alım",
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.detail || "Araç üzerine alma başarısız.");
      }

      // Durumu UI’de güncelle
      setVehicles((prev) =>
        prev.map((v) =>
          v.plaka === vehicle.plaka
            ? { ...v, durum: "Tahsisli", kullanan: vehicle.tahsisli }
            : v
        )
      );

      alert("✅ Araç tahsisli kullanıcıya alındı.");
    } catch (err) {
      alert("Hata: " + err.message);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Veriler yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Hata: {error}</div>;
  }

  return (
    <div className="space-y-3">
      <h2 className="font-semibold text-lg text-gray-700">🚘 Araç Listesi</h2>
      <table className="w-full text-sm border rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-2 py-1 text-left">Marka</th>
            <th className="px-2 py-1 text-left">Model</th>
            <th className="px-2 py-1 text-left">Yıl</th>
            <th className="px-2 py-1 text-left">Renk</th>
            <th className="px-2 py-1 text-left">Plaka</th>
            <th className="px-2 py-1 text-left">Yer</th>
            <th className="px-2 py-1">Durum</th>
            <th className="px-2 py-1">Kullanan</th>
            <th className="px-2 py-1">Başlangıç</th>
            <th className="px-2 py-1">Son</th>
            <th className="px-2 py-1">Tahsisli</th>
            <th className="px-2 py-1">Eylemler</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length === 0 ? (
            <tr>
              <td colSpan="8" className="px-2 py-4 text-center text-gray-500">
                Araç bulunamadı.
              </td>
            </tr>
          ) : (
            vehicles.map((a) => (
              <tr key={a.plaka} className="border-t hover:bg-gray-50">
                <td className="px-2 py-1">{a.marka || "-"}</td>
                <td className="px-2 py-1">{a.model || "-"}</td>
                <td className="px-2 py-1">{a.yil || "-"}</td>
                <td className="px-2 py-1">{a.renk || "-"}</td>
                <td className="px-2 py-1">{a.plaka}</td>
                <td className="px-2 py-1">{a.yer}</td>
                <td className="px-2 py-1">{a.durum}</td>
                <td className="px-2 py-1">{a.kullanan || "-"}</td>
                <td className="px-2 py-1">{a.baslangic || "-"}</td>
                <td className="px-2 py-1">{a.son || "-"}</td>
                <td className="px-2 py-1">{a.tahsis ? a.tahsisli : "-"}</td>
                <td className="px-2 py-1 space-x-2 flex justify-end">
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    onClick={() => handleUpdateVehicle(a.plaka)}
                  >
                    Araç Güncelle
                  </button>
                  <button
                    className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 ml-2"
                    onClick={() => handleDeleteVehicle(a.plaka)}
                  >
                    Araç Sil
                  </button>
                  <button
                    className={`px-2 py-1 text-white rounded text-xs ml-2 ${
                      a.durum.toUpperCase().startsWith("T")
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-yellow-600 hover:bg-yellow-700"
                    }`}
                    onClick={() =>
                      !a.durum.toUpperCase().startsWith("T") &&
                      handleRequestVehicle(a.plaka)
                    }
                    disabled={a.durum.toUpperCase().startsWith("T")}
                  >
                    Aracı İste
                  </button>
                  <button
                    className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 ml-2"
                    onClick={() => handleReleaseVehicle(a.plaka)}
                  >
                    Araç Bırak
                  </button>

                  {/* 🟡 Tahsisli araçlar için Aracı Al butonu */}
                  {a.tahsis && a.durum === "uygun" && (
                    <button
                      className="px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 ml-2"
                      onClick={() => handleTakeVehicle(a)}
                    >
                      Aracı Al
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Araç Ekle Butonu */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={handleAddVehicle}
          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 text-sm"
        >
          <span className="material-icons">add_circle</span>
        </button>
        <button
          className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 ml-2"
          onClick={() => handleBack()}
          >
          Geri Git
        </button>
      </div>
    </div>
  );
});

export default AracList;
