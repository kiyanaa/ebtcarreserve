import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

// RequestsPanel Component
const RequestVehiclePanel = ({ onDelete, onTake }) => {
  const [requests, setRequests] = useState([]); // State to store request data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); // Create navigate function

  // Fetch the requests from the API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("https://cardeal-vduj.onrender.com/istek_araclar");
        
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
  const handle_request_vehicle = () => {
    navigate("/AracList"); // Navigate to the home page
  };

  const handleConfirmRequest = async (request) => {
    const confirmAction = window.confirm(
      `İsteği onaylamak istediğinize emin misiniz?\nKullanıcı: ${request.kullanan}\nPlaka: ${request.plaka}`
    );
    if (!confirmAction) return;

    try {
      // Backend'e PUT isteği göndererek aracın durumunu "kullanımda" yap
      const response = await fetch(`https://cardeal-vduj.onrender.com/arac_guncelle/${request.plaka}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          durum: "kullanımda",
          kullanan: request.kullanan,
          baslangic: request.baslangic,
          son: request.son,
          yer: request.yer
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Araç güncellenemedi");
      }

      const result = await response.json();
      console.log("Güncel araç:", result.arac);

      // İstek kaydını sil
      await fetch(`https://cardeal-vduj.onrender.com/istek_sil_tumu/${request.kullanan}`, {
        method: "DELETE"
      });

      // Frontend state güncelle
      

      await fetch(`https://cardeal-vduj.onrender.com/istek_sil_plaka/${request.plaka}`, {
        method: "DELETE"
      });
      setRequests(prev => prev.filter(r => r.kullanan !== request.kullanan));
      setRequests(prev => prev.filter(r => r.plaka !== request.plaka));

      alert("Araç başarılı bir şekilde kullanımda olarak atandı!");

    } catch (error) {
      alert(`Hata: ${error.message}`);
    }
  };

  const handleRequestDelete = async (kullanan, plaka) => {
  const confirmDelete = window.confirm(
    `İsteği silmek istediğinize emin misiniz? Kullanıcı: ${kullanan}, Plaka: ${plaka}`
  );
  if (!confirmDelete) return;

  try {
    const response = await fetch(`https://cardeal-vduj.onrender.com/istek_arac_sil`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ kullanan, plaka }), // API'ye JSON gönder
    });

    if (!response.ok) {
      throw new Error("İstek silinirken bir hata oluştu.");
    }

    // Başarılı silme sonrası frontend listesinden çıkar
    setRequests((prev) =>
      prev.filter(
        (req) => !(req.kullanan === kullanan && req.plaka === plaka)
      )
    );
  } catch (error) {
    alert(`Hata: ${error.message}`);
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
      <table className="w-full tiable-auto border-collapse">
        <thead>
          <tr>
            <th>Marka</th>
            <th>Model</th>
            <th>Yıl</th>
            <th>Renk</th>
            <th>Plaka</th>
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
              <tr key={`${request.plaka}-${request.kullanan}`}>
                <td>{request.marka}</td>
                <td>{request.model}</td>
                <td>{request.yil}</td>
                <td>{request.renk}</td>
                <td>{request.plaka}</td>
                <td>{request.kullanan}</td>
                <td>{request.baslangic}</td>
                <td>{request.son}</td>
                <td>
                  <button
                    onClick={() => handleConfirmRequest(request)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Onay Ver
                  </button>
                  <button
                    onClick={() => handleRequestDelete(request.kullanan, request.plaka)}
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
