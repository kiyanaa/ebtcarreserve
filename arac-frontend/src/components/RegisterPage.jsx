// components/RegisterPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    department: ""
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // JWT parse fonksiyonu
  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null; // hatalı token
    }
  };

  // Sayfa açıldığında token kontrolü
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const payload = parseJwt(token);
      const now = Math.floor(Date.now() / 1000);

      if (!payload || !payload.username || (payload.exp && payload.exp <= now)) {
        // Token hatalı veya expired ise sil
        localStorage.removeItem("token");
      } else {
        // Token geçerli ise kullanıcı zaten giriş yapmış
        navigate("/"); // Dashboard veya ana sayfa
      }
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("https://cardeal-vduj.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.detail || "Bir hata oluştu");
      } else {
        setMessage("Kayıt başarılı: " + data.user.username);
        setForm({ username: "", password: "", department: "" });

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (err) {
      setMessage("Sunucuya ulaşılamıyor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-700">Kayıt Ol</h2>

        <div className="flex flex-col">
          <label htmlFor="username" className="mb-1 text-gray-600 font-medium">
            Kullanıcı Adı
          </label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Kullanıcı Adı"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg border-red-500 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="mb-1 text-gray-600 font-medium">
            Şifre
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Şifre"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg border-red-500 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="department" className="mb-1 text-gray-600 font-medium">
            Departman (Opsiyonel)
          </label>
          <input
            id="department"
            type="text"
            name="department"
            placeholder="Departman"
            value={form.department}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg border-red-500 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Kayıt Ol
        </button>

        {message && <p className="text-center text-sm text-red-500">{message}</p>}
      </form>
    </div>
  );
}
