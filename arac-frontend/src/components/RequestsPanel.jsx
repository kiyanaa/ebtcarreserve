import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

// RequestsPanel Component
const RequestsPanel = ({ onDelete, onTake }) => {
  const [requests, setRequests] = useState([]); // State to store request data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); // Create navigate function

  // Fetch the requests from the API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("https://cardeal-vduj.onrender.com/istekler");
        
        if (!response.ok) {
          throw new Error("Veri alırken bir hata oluştu");
        }

        const data = await response.json();
        setRequests(data); // Set the request data in the state
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        setError(err.message); // Set error message if fetch fails
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchRequests();
  }, []); // Empty dependency array means this runs only once when the component mounts

  if (loading) {
    return (
      <div className="text-center text-gray-500">
        Veriler yükleniyor...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Hata: {error}
      </div>
    );
  }
  const handleAddRequest = () => {
    navigate("/Request"); // Navigate to the home page
  };

  const handleRequestDelete = async (kullanan) => {
  const confirmDelete = window.confirm(
    `İsteği silmek istediğinize emin misiniz? Kullanıcı: ${kullanan}`
  );
  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `https://cardeal-vduj.onrender.com/istek_sil?kullanan=${encodeURIComponent(kullanan)}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("İstek silinirken bir hata oluştu.");
    }

    alert("İstek silindi!");
    // Request listesini güncelle
    setRequests((prev) => prev.filter((r) => r.kullanan !== kullanan));
  } catch (error) {
    alert(`Hata: ${error.message}`);
  }
};
const requestAvailableVehicles = async (request) => {
  try {
    // 1️⃣ Backend'den sadece uygun araçları al
    const response = await fetch("https://cardeal-vduj.onrender.com/uygun");
    
    if (!response.ok) throw new Error("Uygun araçlar alınamadı.");
    const uygunAraclar = await response.json();

    if (uygunAraclar.length === 0) {
      alert("Uygun araç bulunamadı.");
      return;
    }

    // 2️⃣ Her araç için istek oluştur
    for (const arac of uygunAraclar) {
      const res = await fetch(
      `https://cardeal-vduj.onrender.com/istek_olustur/${arac.plaka}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: arac.model || "Bilinmiyor",
          marka: arac.marka || "Bilinmiyor",
          yil: arac.yil || "Bilinmiyor",
          renk: arac.renk || "Bilinmiyor",
          plaka: arac.plaka,
          kullanan: request.kullanan,
          yer: arac.yer || "Bilinmiyor",
          gidilecek_yer: request.gidilecek_yer || "Bilinmiyor",
          baslangic: request.baslangic || "Bilinmiyor",
          son: request.son || "Bilinmiyor",
          neden: request.neden || "Otomatik istektir",
          aciliyet: request.aciliyet || "Orta",
        }),
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


  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")} // Navigate to the / route when clicked
        className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        Geri
      </button>

      <h2 className="text-2xl font-bold text-green-700">İstekler</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th>Kullanan</th>
            <th>Başlangıç</th>
            <th>Son</th>
            <th>Aksiyonlar</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                İstek bulunamadı
              </td>
            </tr>
          ) : (
            requests.map((request) => (
              <tr key={request.kullanan}>
                <td>{request.kullanan}</td>
                <td>{request.baslangic}</td>
                <td>{request.son}</td>
                <td>
                  <button
                    onClick={() => requestAvailableVehicles(request)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Uygun Tüm Araçları İste
                  </button>
                  <button
                    onClick={() => handleRequestDelete(request.kullanan)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="fixed bottom-4 right-4">
        <button
          onClick={handleAddRequest}
          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 text-sm"
        >
          <span className="material-icons">add_circle</span> 
        </button>
      </div>
    </div>
  );
};

export default RequestsPanel;
