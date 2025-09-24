import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CarFront, ClipboardList, LogIn, LogOut, UserPlus, PlusCircle } from "lucide-react";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

const Menu = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const payload = parseJwt(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (!payload || !payload.username || (payload.exp && payload.exp < currentTime)) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8 flex flex-col relative">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <CarFront className="w-8 h-8 text-blue-600" /> Araç Tahsis Sistemi
        </h1>
      </header>

      {/* Üst sıra menü */}
      <div className="flex justify-center gap-6 mb-6">
        <button
          onClick={() => navigate("/AracList")}
          className="w-24 h-24 flex flex-col items-center justify-center bg-white shadow-md rounded-xl hover:bg-blue-50"
        >
          <CarFront className="w-10 h-10 text-blue-600" />
          <span className="text-sm mt-2 text-blue-700">Araçlar</span>
        </button>
        <button
          onClick={() => navigate("/istekler")}
          className="w-24 h-24 flex flex-col items-center justify-center bg-white shadow-md rounded-xl hover:bg-green-50"
        >
          <ClipboardList className="w-10 h-10 text-green-600" />
          <span className="text-sm mt-2 text-green-700">İsteklerim</span>
        </button>
        <button
          onClick={() => navigate("/arac_istekleri")}
          className="w-24 h-24 flex flex-col items-center justify-center bg-white shadow-md rounded-xl hover:bg-purple-50"
        >
          <ClipboardList className="w-10 h-10 text-purple-600" />
          <span className="text-sm mt-2 text-purple-700">Araç İsteklerim</span>
        </button>
      </div>

      {/* Alt sıra menü */}
      <div className="flex justify-center gap-6 mb-6">
        <button
          onClick={() => navigate("/request")}
          className="w-24 h-24 flex flex-col items-center justify-center bg-white shadow-md rounded-xl hover:bg-red-50"
        >
          <PlusCircle className="w-10 h-10 text-red-600" />
          <span className="text-sm mt-2 text-red-700">İstek Ekle</span>
        </button>
        <button
          onClick={() => navigate("/AracList")}
          className="w-24 h-24 flex flex-col items-center justify-center bg-white shadow-md rounded-xl hover:bg-yellow-50"
        >
          <PlusCircle className="w-10 h-10 text-yellow-600" />
          <span className="text-sm mt-2 text-yellow-700">Araç Talebi</span>
        </button>
      </div>

      {/* Sağ alt login/logout/register */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 px-4 py-2 bg-white shadow-md rounded-lg hover:bg-gray-50"
        >
          <LogIn className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Login</span>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-white shadow-md rounded-lg hover:bg-gray-50"
        >
          <LogOut className="w-5 h-5 text-red-600" />
          <span className="text-sm font-medium text-red-700">Logout</span>
        </button>

        <button
          onClick={() => navigate("/register")}
          className="flex items-center gap-2 px-4 py-2 bg-white shadow-md rounded-lg hover:bg-gray-50"
        >
          <UserPlus className="w-5 h-5 text-red-600" />
          <span className="text-sm font-medium text-red-700">Register</span>
        </button>
      </div>
    </div>
  );
};

export default Menu;
