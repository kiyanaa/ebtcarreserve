import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AracList = React.memo(function AracList({ onUzerineAl }) {
  const [vehicles, setVehicles] = useState([]); // State to store vehicle data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://localhost:8000/araclar");
        
        if (!response.ok) {
          throw new Error("Veri alırken bir hata oluştu");
        }

        const data = await response.json();
        setVehicles(data); // Set vehicle data in state
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        setError(err.message); // Set error message in case of failure
        setLoading(false); // Set loading to false even if there is an error
      }
    };

    fetchVehicles();
  }, []); // Empty dependency array means this runs only once when the component mounts

  const handleUzerineAl = (plaka) => () => onUzerineAl(plaka);

  const handleAddVehicle = () => {
    // Handle add vehicle logic
    console.log("Araç Ekle butonuna tıklandı.");
  };

  // Handle Delete Vehicle
  const handleDeleteVehicle = async (plaka) => {
    const confirmDelete = window.confirm(`Aracı silmek istediğinize emin misiniz? Plaka: ${plaka}`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/araclar/${plaka}`, {
        method: 'DELETE', // DELETE request
      });

      if (!response.ok) {
        throw new Error("Araç silinirken bir hata oluştu.");
      }

      // Remove the deleted vehicle from the state
      setVehicles(vehicles.filter(vehicle => vehicle.plaka !== plaka));
      alert("Araç başarıyla silindi.");
    } catch (error) {
      alert(`Hata: ${error.message}`);
    }
  };

  // Araç Güncelle butonuna tıklanınca çağrılacak fonksiyon
  const handleUpdateVehicle = (plaka) => {
    console.log("Gönderilen plaka:", plaka); // <- Bunu ekle, plaka geliyor mu kontrol et
    navigate("/updatevehicle", { state: { plaka } });
  };
  const handleRequestVehicle = (plaka) => {
    navigate("/requestvehicle", { state: { plaka } });
  }

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

  return (
    <div className="space-y-3">
      <h2 className="font-semibold text-lg text-gray-700">🚘 Araç Listesi</h2>
      <table className="w-full text-sm border rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
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
                <td className="px-2 py-1">{a.plaka}</td>
                <td className="px-2 py-1">{a.yer}</td>
                <td className="px-2 py-1">{a.durum}</td>
                <td className="px-2 py-1">{a.kullanan || '-'}</td>
                <td className="px-2 py-1">{a.baslangic || '-'}</td>
                <td className="px-2 py-1">{a.son || '-'}</td>
                <td className="px-2 py-1">{a.tahsis ? a.tahsisli : '-'}</td>
                <td className="px-2 py-1 space-x-2 flex justify-end">
                  {/* Araç Güncelle, Araç Sil, Aracı İste butonları */}
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    onClick={() => handleUpdateVehicle(a.plaka)}
                  >
                    Araç Güncelle
                  </button>
                  <button
                    className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 ml-2"
                    onClick={() => handleDeleteVehicle(a.plaka)} // Araç Sil işlevi
                  >
                    Araç Sil
                  </button>
                  <button
                    className="px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 ml-2"
                    onClick={() => handleRequestVehicle(a.plaka)}
                  >
                    Aracı İste
                  </button>
                  {/* Üzerine Al butonu */}
                  <button
                    onClick={handleUzerineAl(a.plaka)}
                    disabled={a.durum !== 'uygun'}
                    className={`px-2 py-1 text-xs rounded ml-2 ${
                      a.durum === 'uygun'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    Üzerine Al
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Araç Ekle Butonu sağ alt köşede */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={handleAddVehicle}
          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 text-sm"
        >
          <span className="material-icons">add_circle</span> 
        </button>
      </div>
    </div>
  );
});

export default AracList;
