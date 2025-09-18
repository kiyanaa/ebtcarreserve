import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RequestForm from "./AddRequestForm";

export default function AddRequestPage() {
  const navigate = useNavigate();
  const [requestForm, setRequestForm] = useState({
    kullanan: "",
    yer: "",
    gidilecek_yer: "",
    baslangic: "",
    son: "",
    neden: "",
    aciliyet: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/istek_olustur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestForm)
      });

      if (!response.ok) {
        throw new Error("İstek eklenirken bir hata oluştu.");
      }

      alert("İstek başarıyla eklendi.");
      navigate("/istekler");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      {/* Form bileşenine state ve setState gönderelim */}
      <RequestForm requestForm={requestForm} setRequestForm={setRequestForm} />

      <div className="flex gap-2 mt-4">
        {/* Kaydet butonu */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>

        {/* Geri butonu */}
        <button
          onClick={() => navigate("/")}
          className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Geri
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
