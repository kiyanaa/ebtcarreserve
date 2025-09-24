import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AracList = React.memo(function AracList() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token") || "";

  const getTokenPayload = (token) => {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  const payload = getTokenPayload(token);
  const currentUser = payload?.username || "";
  const userPosition = payload?.position || "";
  const canEdit = ["admin", "havuz"].includes(userPosition);

  // Token ve payload kontrolü
  useEffect(() => {
    if (!token || !payload || !payload.username || (payload.exp && payload.exp < Math.floor(Date.now() / 1000))) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    // Payload username alert
    alert("Payload position: " + payload.position);

    const fetchVehicles = async () => {
      try {
        const response = await fetch("https://cardeal-vduj.onrender.com/araclar", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Veriler alınamadı");
        const data = await response.json();

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
  }, [token, payload, navigate]);

  const handleDeleteVehicle = async (plaka) => {
    if (!window.confirm(`Aracı silmek istediğinize emin misiniz? Plaka: ${plaka}`)) return;
    try {
      const response = await fetch(`https://cardeal-vduj.onrender.com/araclar/${plaka}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Silme işlemi başarısız");

      setVehicles((prev) => prev.filter((v) => v.plaka !== plaka));
      alert("Araç başarıyla silindi.");
    } catch (err) {
      alert(`Hata: ${err.message}`);
    }
  };

  const handleTakeVehicle = async (vehicle) => {
    try {
      const response = await fetch(`https://cardeal-vduj.onrender.com/uzerine_al/${vehicle.plaka}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          kullanan: vehicle.tahsisli,
          yer: vehicle.yer,
          baslangic: new Date().toISOString(),
          son: vehicle.son || "Belli değil",
          neden: "Tahsisli alım",
        }),
      });
      if (!response.ok) throw new Error("Tahsisli alım başarısız");

      setVehicles((prev) =>
        prev.map((v) =>
          v.plaka === vehicle.plaka ? { ...v, durum: "kullanımda", kullanan: vehicle.tahsisli } : v
        )
      );

      alert("✅ Araç tahsisli kullanıcıya alındı.");
    } catch (err) {
      alert("Hata: " + err.message);
    }
  };

  const handleUpdateVehicle = (plaka) => navigate("/updatevehicle", { state: { plaka } });
  const handleRequestVehicle = (plaka) => navigate("/requestvehicle", { state: { plaka } });
  const handleAddVehicle = () => navigate("/addvehicle");
  const handleReleaseVehicle = (plaka) => navigate("/releasevehicle", { state: { plaka } });
  const handlereserved = (plaka) => navigate("/reserve", { state: { plaka } });

  if (loading) return <div className="text-center text-gray-500">Veriler yükleniyor...</div>;
  if (error) return <div className="text-center text-red-500">Hata: {error}</div>;

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
              <td colSpan="12" className="px-2 py-4 text-center text-gray-500">
                Araç bulunamadı.
              </td>
            </tr>
          ) : (
            vehicles.map((a) => {
              const canRelease =
                a.kullanan === currentUser ||
                a.tahsisli === currentUser ||
                ["admin", "havuz"].includes(userPosition);

              const canTake =
                (a.tahsisli === currentUser && a.durum === "uygun") ||
                ["admin", "havuz"].includes(userPosition);

              return (
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
                    {canEdit && (
                      <button
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        onClick={() => handleUpdateVehicle(a.plaka)}
                      >
                        Araç Güncelle
                      </button>
                    )}

                    {canEdit && (
                      <button
                        className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 ml-2"
                        onClick={() => handleDeleteVehicle(a.plaka)}
                      >
                        Araç Sil
                      </button>
                    )}

                    {a.durum.toLowerCase() === "uygun" && (
                      <button
                        className="px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 ml-2"
                        onClick={() => handleRequestVehicle(a.plaka)}
                      >
                        Aracı İste
                      </button>
                    )}

                    {a.durum.toLowerCase() === "kullanımda" && (
                      <button
                        className="px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 ml-2"
                        onClick={() => handlereserved(a.plaka)}
                      >
                        Aracı İste
                      </button>
                    )}

                    {canRelease && (
                      <button
                        className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 ml-2"
                        onClick={() => handleReleaseVehicle(a.plaka)}
                      >
                        Araç Bırak
                      </button>
                    )}

                    {a.tahsis && a.durum === "uygun" && canTake && (
                      <button
                        className="px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 ml-2"
                        onClick={() => handleTakeVehicle(a)}
                      >
                        Aracı Al
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <div className="fixed bottom-4 right-4 flex">
        <button
          onClick={handleAddVehicle}
          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 text-sm"
        >
          <span className="material-icons">add_circle</span>
        </button>
        <button
          className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 ml-2"
          onClick={() => navigate("/")}
        >
          Geri Git
        </button>
      </div>
    </div>
  );
});

export default AracList;
