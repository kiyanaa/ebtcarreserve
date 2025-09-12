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
        const response = await fetch("http://localhost:8000/istekler");
        
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
            <th>Kullanıcı</th>
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
                    onClick={() => onTake(request)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Al
                  </button>
                  <button
                    onClick={() => onDelete(request.kullanan)}
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
    </div>
  );
};

export default RequestsPanel;
