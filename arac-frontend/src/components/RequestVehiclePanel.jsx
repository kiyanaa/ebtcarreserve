import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RequestsPanel = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function parseJwt(token) {
    try {
      const payloadBase64 = token.split('.')[1];
      return JSON.parse(atob(payloadBase64));
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

    const fetchRequests = async () => {
      try {
        const response = await fetch("https://cardeal-vduj.onrender.com/istekler", {
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

  const handleRequestDelete = async (kullanan) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Lütfen giriş yapın.");

    if (!window.confirm(`İsteği silmek istediğinize emin misiniz? Kullanıcı: ${kullanan}`)) return;

    try {
      const res = await fetch(
        `https://cardeal-vduj.onrender.com/istek_sil?kullanan=${encodeURIComponent(kullanan)}`,
        { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("İstek silinirken hata oluştu.");

      setRequests((prev) => prev.filter((r) => r.kullanan !== kullanan));
      alert("İstek silindi!");
    } catch (err) {
      alert("Hata: " + err.message);
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
      const response = await fetch("https://cardeal-vduj.onrender.com/uygun", {
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
          `https://cardeal-vduj.onrender.com/istek_olustur/${arac.plaka}`,
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
              yer: request.yer || "Bilinmiyor",
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
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Geri
      </button>

      <h2 className="text-2xl font-bold text-green-700">İstekler</h2>

      <table className="w-full table-auto border border-gray-300 rounded overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Kullanan</th>
            <th className="px-4 py-2 border">Başlangıç Yeri</th>
            <th className="px-4 py-2 border">Gidilecek Yer</th>
            <th className="px-4 py-2 border">Başlangıç</th>
            <th className="px-4 py-2 border">Bitiş</th>
            <th className="px-4 py-2 border">Neden</th>
            <th className="px-4 py-2 border">Aksiyonlar</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4">İstek yok</td>
            </tr>
          ) : (
            requests.map((request) => {
              const token = localStorage.getItem("token");
              const payload = token ? parseJwt(token) : { username: "", position: "" };
              const canAct =
                payload.username === request.kullanan ||
                payload.position === "admin" ||
                payload.position === "havuz";

              return (
                <tr key={request.kullanan + request.baslangic}>
                  <td className="px-4 py-2 border">{request.kullanan}</td>
                  <td className="px-4 py-2 border">{request.yer}</td>
                  <td className="px-4 py-2 border">{request.gidilecek_yer}</td>
                  <td className="px-4 py-2 border">{request.baslangic}</td>
                  <td className="px-4 py-2 border">{request.son}</td>
                  <td className="px-4 py-2 border">{request.neden}</td>
                  <td className="px-4 py-2 border flex gap-2">
                    <button
                      onClick={() => requestAvailableVehicles(request)}
                      className={`text-blue-600 hover:text-blue-800 px-2 py-1 border rounded ${!canAct ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={!canAct}
                    >
                      Uygun Araçları İste
                    </button>
                    <button
                      onClick={() => handleRequestDelete(request.kullanan)}
                      className="text-red-600 hover:text-red-800 px-2 py-1 border rounded"
                      disabled={!canAct}
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

      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => navigate("/addrequest")}
          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 text-sm"
        >
          <span className="material-icons">add_circle</span> İstek Ekle
        </button>
      </div>
    </div>
  );
};

export default RequestsPanel;
