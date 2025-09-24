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
    const response = await fetch("http://localhost:8000/token", {
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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-80 flex flex-col gap-4 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Giriş Yap</h2>

        {/* Kullanıcı adı */}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Kullanıcı Adı"
          required
        />

        {/* Şifre */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Şifre"
          required
        />

        {/* Buton */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
