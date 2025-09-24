import React, { useState, useEffect } from "react";
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

  // ✅ Şu anki kullanıcıyı token’dan otomatik çek
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const username = payload.username || payload.user || "";
      if (!username) throw new Error("Token geçersiz");

      setRequestForm(prev => ({ ...prev, kullanan: username }));
    } catch (e) {
      console.error("Token parse hatası veya bozuk token", e);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Lütfen giriş yapın.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/istek_olustur", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestForm)
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.detail || "İstek eklenirken bir hata oluştu.");
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
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Yeni Araç İsteği</h1>

      <RequestForm requestForm={requestForm} setRequestForm={setRequestForm} />

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>

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
