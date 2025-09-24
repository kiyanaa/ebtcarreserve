// components/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    department: ""
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // <-- navigate hook

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

        // 1 saniye sonra login sayfasına yönlendir
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

        <input
          type="text"
          name="username"
          placeholder="Kullanıcı Adı"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Şifre"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
        />

        <input
          type="text"
          name="department"
          placeholder="Departman (Opsiyonel)"
          value={form.department}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
        />

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
