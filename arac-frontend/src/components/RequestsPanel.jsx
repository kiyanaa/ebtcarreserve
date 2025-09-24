import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RequestsPanel = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    kullanan: "",
    baslangicYer: "",
    gidilecekYer: "",
    baslangic: "",
    son: "",
    neden: "",
  });

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

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Lütfen giriş yapın.");

    try {
      const res = await fetch("https://cardeal-vduj.onrender.com/istek_ekle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("İstek oluşturulamadı.");

      const newRequest = await res.json();
      setRequests((prev) => [...prev, newRequest]);
      setFormOpen(false);
      setForm({
        kullanan: "",
        baslangicYer: "",
        gidilecekYer: "",
        baslangic: "",
        son: "",
        neden: "",
      });
      alert("İstek başarıyla oluşturuldu!");
    } catch (err) {
      alert("Hata: " + err.message);
    }
  };

  const requestAvailableVehicles = async (request) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Lütfen giriş yapın.");

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
        await fetch(
          `https://cardeal-vduj.onrender.com/istek_olustur/${arac.plaka}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ ...request, sahip: arac.tahsisli || "havuz" })
          }
        );
      }

      alert("✅ Tüm uygun araçlar için istekler oluşturuldu!");
    } catch (err) {
      alert("Hata: " + err.message);
    }
  };

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

      {/* Form */}
      {formOpen && (
        <form
          onSubmit={handleRequestSubmit}
          className="border p-4 rounded shadow-md space-y-3 bg-gray-50"
        >
          <input
            type="text"
            placeholder="Kullanan"
            value={form.kullanan}
            onChange={(e) => setForm({ ...form, kullanan: e.target.value })}
            className="w-full border px-2 py-1 rounded"
            required
          />
          <input
            type="text"
            placeholder="Başlangıç Yeri"
            value={form.baslangicYer}
            onChange={(e) => setForm({ ...form, baslangicYer: e.target.value })}
            className="w-full border px-2 py-1 rounded"
            required
          />
          <input
            type="text"
            placeholder="Gidilecek Yer"
            value={form.gidilecekYer}
            onChange={(e) => setForm({ ...form, gidilecekYer: e.target.value })}
            className="w-full border px-2 py-1 rounded"
            required
          />
          <input
            type="datetime-local"
            placeholder="Başlangıç"
            value={form.baslangic}
            onChange={(e) => setForm({ ...form, baslangic: e.target.value })}
            className="w-full border px-2 py-1 rounded"
            required
          />
          <input
            type="datetime-local"
            placeholder="Bitiş"
            value={form.son}
            onChange={(e) => setForm({ ...form, son: e.target.value })}
            className="w-full border px-2 py-1 rounded"
            required
          />
          <textarea
            placeholder="Neden"
            value={form.neden}
            onChange={(e) => setForm({ ...form, neden: e.target.value })}
            className="w-full border px-2 py-1 rounded"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Oluştur
            </button>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              İptal
            </button>
          </div>
        </form>
      )}

      {/* İstek Tablosu */}
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
              const canReqVehicle =
                payload.username === request.kullanan ||
                payload.position === "admin" ||
                payload.position === "havuz";

              return (
                <tr key={request.id}>
                  <td className="px-4 py-2 border">{request.kullanan}</td>
                  <td className="px-4 py-2 border">{request.yer}</td> {/* Başlangıç Yeri */}
                  <td className="px-4 py-2 border">{request.gidilecek_yer}</td> {/* Gidilecek Yer */}
                  <td className="px-4 py-2 border">{request.baslangic}</td>
                  <td className="px-4 py-2 border">{request.son}</td>
                  <td className="px-4 py-2 border">{request.neden}</td>
                  <td className="px-4 py-2 border flex gap-2">
                    <button
                      onClick={() => requestAvailableVehicles(request)}
                      className={`text-blue-600 hover:text-blue-800 px-2 py-1 border rounded ${!canReqVehicle ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={!canReqVehicle}
                    >
                      Uygun Tüm Araçları İste
                    </button>
                    <button
                      onClick={() => handleRequestDelete(request.kullanan)}
                      className="text-red-600 hover:text-red-800 px-2 py-1 border rounded"
                      disabled={!canReqVehicle}
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
      {!formOpen && (
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 text-sm"
          >
            <span className="material-icons">add_circle</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RequestsPanel;
