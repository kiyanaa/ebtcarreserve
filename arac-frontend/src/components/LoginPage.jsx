// components/AuthPage.jsx
import React, { useState } from "react";

export default function AuthPage() {
  // Login state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  // Register state
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regDepartment, setRegDepartment] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMessage("");

    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("username", loginUsername);
    formData.append("password", loginPassword);

    try {
      const response = await fetch("https://cardeal-vduj.onrender.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (!response.ok) throw new Error("Giriş başarısız");

      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        setLoginMessage("Giriş başarılı!");
        window.location.href = "/";
      } else {
        setLoginMessage("Hatalı kullanıcı adı veya şifre!");
      }
    } catch (err) {
      console.error(err);
      setLoginMessage("Sunucuya ulaşılamıyor!");
    }
  };

  // Register handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterMessage("");

    try {
      const res = await fetch("https://cardeal-vduj.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: regUsername,
          password: regPassword,
          department: regDepartment,
        }),
      });

      const data = await res.json();
      if (!res.ok) setRegisterMessage(data.detail || "Kayıt başarısız");
      else {
        setRegisterMessage("Kayıt başarılı: " + data.user.username);
        setRegUsername("");
        setRegPassword("");
        setRegDepartment("");
      }
    } catch (err) {
      console.error(err);
      setRegisterMessage("Sunucuya ulaşılamıyor!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex gap-12">
        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl shadow-md w-80 flex flex-col gap-4"
        >
          <h2 className="text-2xl font-bold text-center text-gray-700">Giriş Yap</h2>
          <label className="text-left font-medium">Kullanıcı Adı</label>
          <input
            type="text"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            placeholder="Kullanıcı Adı"
            required
            className="w-full px-3 py-2 border border-red-500 rounded"
          />
          <label className="text-left font-medium">Şifre</label>
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="Şifre"
            required
            className="w-full px-3 py-2 border border-red-500 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Giriş Yap
          </button>
          {loginMessage && <p className="text-sm text-red-500 text-center">{loginMessage}</p>}
        </form>

        {/* Register Form */}
        <form
          onSubmit={handleRegister}
          className="bg-white p-8 rounded-xl shadow-md w-80 flex flex-col gap-4"
        >
          <h2 className="text-2xl font-bold text-center text-gray-700">Kayıt Ol</h2>
          <label className="text-left font-medium">Kullanıcı Adı</label>
          <input
            type="text"
            value={regUsername}
            onChange={(e) => setRegUsername(e.target.value)}
            placeholder="Kullanıcı Adı"
            required
            className="w-full px-3 py-2 border border-red-500 rounded"
          />
          <label className="text-left font-medium">Şifre</label>
          <input
            type="password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            placeholder="Şifre"
            required
            className="w-full px-3 py-2 border border-red-500 rounded"
          />
          <label className="text-left font-medium">Departman (Opsiyonel)</label>
          <input
            type="text"
            value={regDepartment}
            onChange={(e) => setRegDepartment(e.target.value)}
            placeholder="Departman"
            className="w-full px-3 py-2 border border-red-500 rounded"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Kayıt Ol
          </button>
          {registerMessage && <p className="text-sm text-red-500 text-center">{registerMessage}</p>}
        </form>
      </div>
    </div>
  );
}
