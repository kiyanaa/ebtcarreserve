import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const RequestVehiclePanel = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Lütfen giriş yapın.");
      navigate("/login");
      return;
    }

    const decoded = parseJwt(token);
    const username = decoded.username || decoded.user || "";
    setCurrentUser(username);

    const fetchRequests = async () => {
      try {
        const response = await fetch("https://cardeal-vduj.onrender.com/istek_araclar", {
          headers: { "Authorization": `Bearer ${token}` },
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

  if (loading) return <div className="text-center text-gray-500">Veriler yükleniyor...</div>;
  if (error) return <div className="text-center text-red-500">Hata: {error}</div>;

  const handle_request_vehicle = () => {
    navigate("/AracList");
  };

  const handleConfirmRequest = async (request) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Lütfen giriş yapın.");
      navigate("/login");
      return;
    }

    const confirmAction = window.confirm(
      `İsteği onaylamak istediğinize emin misiniz?\n` +
      `Kullanıcı: ${request.kullanan}\n` +
      `Plaka: ${request.plaka}\n` +
      `Başlangıç Yeri: ${request.yer}\n` +
      `Gidilecek Yer: ${request.gidilecek_yer}`
    );
    if (!confirmAction) return;

    try {
      const response = await fetch(`https://cardeal-vduj.onrender.com/arac_guncelle/${request.plaka}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          durum: "kullanımda",
          kullanan: request.kullanan,
          sahip: request.tahsisli || "havuz",
          baslangic: request.baslangic,
          son: request.son,
          yer: request.yer,
          gidilecek_yer: request.gidilecek_yer
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Araç güncellenemedi");
      }

      // İstekleri sil
      await fetch(`https://cardeal-vduj.onrender.com/istek_sil_tumu/${request.kullanan}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      await fetch(`https://cardeal-vduj.onrender.com/istek_sil_plaka/${request.plaka}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      setRequests(prev => prev.filter(r => r.kullanan !== request.kullanan && r.plaka !== request.plaka));
      alert("Araç başarılı bir şekilde kullanımda olarak atandı!");
    } catch (error) {
      alert(`Hata: ${error.message}`);
    }
  };

  const handleRequestDelete = async (kullanan, plaka) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Lütfen giriş yapın.");
      navigate("/login");
      return;
    }

    const confirmDelete = window.confirm(
      `İsteği silmek istediğinize emin misiniz? Kullanıcı: ${kullanan}, Plaka: ${plaka}`
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://cardeal-vduj.onrender.com/istek_arac_sil`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ kullanan, plaka }),
      });

      if (!response.ok) throw new Error("İstek silinirken bir hata oluştu.");

      setRequests(prev =>
        prev.filter(req => !(req.kullanan === kullanan && req.plaka === plaka))
      );
    } catch (error) {
      alert(`Hata: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/")}
        className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        Geri
      </button>

      <h2 className="text-2xl font-bold text-green-700">İstekler</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th>Marka</th>
            <th>Model</th>
            <th>Yıl</th>
            <th>Renk</th>
            <th>Plaka</th>
            <th>Kullanan</th>
            <th>Sahip</th>
            <th>Başlangıç</th>
            <th>Son</th>
            <th>Yer</th>
            <th>Gidilecek Yer</th>
            <th>Aksiyonlar</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="12" className="text-center">İstek bulunamadı</td>
            </tr>
          ) : (
            requests.map(request => {
              const token = localStorage.getItem("token");
              const decoded = parseJwt(token);
              const currentUser = decoded.username;
              const pozisyon = decoded.position;

              const canConfirm = (
                (request.sahip === "havuz" && (pozisyon === "admin" || pozisyon === "havuz")) ||
                (request.sahip !== "havuz" && (currentUser === request.sahip || pozisyon === "admin"))
              );

              return (
                <tr key={`${request.plaka}-${request.kullanan}`}>
                  <td>{request.marka}</td>
                  <td>{request.model}</td>
                  <td>{request.yil}</td>
                  <td>{request.renk}</td>
                  <td>{request.plaka}</td>
                  <td>{request.kullanan}</td>
                  <td>{request.sahip}</td>
                  <td>{request.baslangic}</td>
                  <td>{request.son}</td>
                  <td>{request.yer}</td>
                  <td>{request.gidilecek_yer}</td>
                  <td>
                    {canConfirm && (
                      <button
                        onClick={() => handleConfirmRequest(request)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Onay Ver
                      </button>
                    )}
                    <button
                      onClick={() => handleRequestDelete(request.kullanan, request.plaka)}
                      className="ml-2 text-red-600 hover:text-red-800"
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
          onClick={handle_request_vehicle}
          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 text-sm"
        >
          <span className="material-icons">add_circle</span> 
        </button>
      </div>
    </div>
  );
};

export default RequestVehiclePanel;
