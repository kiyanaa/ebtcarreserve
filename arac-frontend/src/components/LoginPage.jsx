// components/LoginPage.jsx
import React, { useState } from "react";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch("https://cardeal-vduj.onrender.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error("Sunucu hatası veya giriş başarısız");
      }

      const data = await response.json();

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        alert("Giriş başarılı!");
        window.location.href = "/";
      } else {
        alert("Hatalı kullanıcı adı veya şifre!");
      }
    } catch (err) {
      console.error(err);
      alert("Giriş yapılırken bir hata oluştu!");
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-80 flex flex-col gap-4 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Giriş Yap</h2>

        {/* Kullanıcı adı */}
        <label htmlFor="username" className="text-left font-medium">
          Kullanıcı Adı
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border border-red-500 rounded"
          placeholder="Kullanıcı Adı"
          required
        />

        {/* Şifre */}
        <label htmlFor="password" className="text-left font-medium">
          Şifre
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-red-500 rounded"
          placeholder="Şifre"
          required
        />

        {/* Giriş Butonu */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Giriş Yap
        </button>
      </form>

      {/* Kayıt Ol Butonu */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => (window.location.href = "/register")}
          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 text-sm"
        >
          Kayıt Ol
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
