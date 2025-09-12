import React from "react";
import { Link } from "react-router-dom"; // Link component for routing
import { CarFront, ClipboardList } from "lucide-react"; // Icons for car and clipboard

const Menu = () => {
  return (
    <div className="space-y-6 p-8 min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-extrabold text-blue-800 flex items-center gap-3">
          <CarFront className="w-10 h-10 text-blue-600" />
          Araç Tahsis Sistemi
        </h1>
        <p className="text-gray-600 mt-2">Menüden bir sayfa seçin</p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Araçlar Sayfasına Yönlendiren Link */}
        <Link to="/arac-list">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-4">
            <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2">
              <CarFront className="w-6 h-6 text-blue-600" />
              Araçlar
            </h2>
            <p className="text-gray-600">Araçların listelendiği sayfa.</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">
              Git
            </button>
          </div>
        </Link>

        {/* İstekler Sayfasına Yönlendiren Link */}
        <Link to="/requests-panel">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-4">
            <h2 className="text-xl font-semibold text-green-700 flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-green-600" />
              İstekler
            </h2>
            <p className="text-gray-600">İsteklerin listelendiği sayfa.</p>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700">
              Git
            </button>
          </div>
        </Link>
      </main>
    </div>
  );
};

export default Menu;
