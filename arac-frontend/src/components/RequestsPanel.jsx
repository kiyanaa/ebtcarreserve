import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RequestsPanel = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  function parseJwt(token) {
  try {
    // Token parçalarını ayır
    const payloadBase64 = token.split('.')[1];

    // Base64 decode et ve JSON'a çevir
    const payload = JSON.parse(atob(payloadBase64));

    return payload;
  } catch (e) {
    console.error("Token parse edilemedi:", e);
    return null;
  }
}

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Lütfen giriş yapın.");
      navigate("/login");
      return;
    }
    const currentUser = parseJwt(token);
    const fetchRequests = async () => {
      try {
        const response = await fetch("http://localhost:8000/istekler", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Veri alırken bir hata oluştu");

        const data = await response.json();
        setRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [navigate]);

  const handleAddRequest = () => {
    navigate("/Request");
  };

  const handleRequestDelete = async (kullanan) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Lütfen giriş yapın.");
      navigate("/login");
      return;
    }

    const confirmDelete = window.confirm(
      `İsteği silmek istediğinize emin misiniz? Kullanıcı: ${kullanan}`
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8000/istek_sil?kullanan=${encodeURIComponent(kullanan)}`,
        {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        }
      );
      if (!response.ok) throw new Error("İstek silinirken bir hata oluştu.");

      alert("İstek silindi!");
      setRequests((prev) => prev.filter((r) => r.kullanan !== kullanan));
    } catch (err) {
      alert(`Hata: ${err.message}`);
    }
  };

  const requestAvailableVehicles = async (request) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Lütfen giriş yapın.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/uygun", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Uygun araçlar alınamadı.");

      const uygunAraclar = await response.json();
      if (uygunAraclar.length === 0) {
        alert("Uygun araç bulunamadı.");
        return;
      }

      for (const arac of uygunAraclar) {
        const res = await fetch(
          `http://localhost:8000/istek_olustur/${arac.plaka}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              model: arac.model || "Bilinmiyor",
              marka: arac.marka || "Bilinmiyor",
              yil: arac.yil || "Bilinmiyor",
              renk: arac.renk || "Bilinmiyor",
              plaka: arac.plaka,
              kullanan: request.kullanan,
              sahip: arac.tahsisli || "havuz",
              yer: arac.yer || "Bilinmiyor",
              gidilecek_yer: request.gidilecek_yer || "Bilinmiyor",
              baslangic: request.baslangic || "Bilinmiyor",
              son: request.son || "Bilinmiyor",
              neden: request.neden || "Otomatik istektir",
              aciliyet: request.aciliyet || "Orta"
            })
          }
        );

        if (!res.ok) {
          const err = await res.json();
          console.error(`Araç ${arac.plaka} için istek oluşturulamadı:`, err.detail);
        }
      }

      alert("✅ Tüm uygun araçlar için istekler oluşturuldu!");
    } catch (err) {
      alert("Hata: " + err.message);
    }
  };

  if (loading) return <div className="text-center text-gray-500">Veriler yükleniyor...</div>;
  if (error) return <div className="text-center text-red-500">Hata: {error}</div>;
return (
  <div className="space-y-6 p-4">
    {/* Geri Butonu */}
    <button
      onClick={() => navigate("/")}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    >
      Geri
    </button>

    {/* Başlık */}
    <h2 className="text-2xl font-bold text-green-700">İstekler</h2>

    {/* İstek Tablosu */}
    <table className="w-full table-auto border border-gray-300 rounded overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 border">Kullanan</th>
          <th className="px-4 py-2 border">Başlangıç</th>
          <th className="px-4 py-2 border">Son</th>
          <th className="px-4 py-2 border">Aksiyonlar</th>
        </tr>
      </thead>
      <tbody>
        {requests.length === 0 ? (
          <tr>
            <td colSpan="4" className="text-center py-4">
              İstek yok
            </td>
          </tr>
        ) : (
          requests.map((request) => {
            // JWT'den currentUser alındıysa
            const token = localStorage.getItem("token");
            let currentUser = { username: "", position: "" };
            if (token) {
              const payload = JSON.parse(atob(token.split(".")[1]));
              currentUser.username = payload.username;
              currentUser.position = payload.position;
            }

            // Yetkili mi?
            const canReqVehicle =
              currentUser.username === request.kullanan ||
              currentUser.position === "admin" ||
              currentUser.position === "havuz";

            return (
              <tr key={request.kullanan}>
                <td className="px-4 py-2 border">{request.kullanan}</td>
                <td className="px-4 py-2 border">{request.baslangic}</td>
                <td className="px-4 py-2 border">{request.son}</td>
                <td className="px-4 py-2 border flex gap-2">
                  <button
                    onClick={() => requestAvailableVehicles(request)}
                    className={`text-blue-600 hover:text-blue-800 px-2 py-1 border rounded ${
                      !canReqVehicle ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!canReqVehicle}
                  >
                    Uygun Tüm Araçları İste
                  </button>
                  <button
                    onClick={() => handleRequestDelete(request.kullanan)}
                    className="text-red-600 hover:text-red-800 px-2 py-1 border rounded"
                    disabled = {!canReqVehicle}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>

    {/* İstek Ekle Butonu */}
    <div className="fixed bottom-4 right-4">
      <button
        onClick={handleAddRequest}
        className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 text-sm"
      >
        <span className="material-icons">add_circle</span>
      </button>
    </div>
  </div>
);}


export default RequestsPanel;
