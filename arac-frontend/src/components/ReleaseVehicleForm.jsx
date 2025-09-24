import React from "react";

export default function ReleaseVehicleForm({ releaseForm, setReleaseForm, onSubmit }) {
  if (!releaseForm) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReleaseForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 p-2">
      <h3 className="font-semibold text-lg text-gray-700">🚗 Araç İade</h3>

      {/* Marka */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Marka</label>
        <input
          name="marka"
          value={releaseForm?.marka || ""}
          readOnly
          className="w-full p-2 border border-red-500 rounded-lg bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Model */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Model</label>
        <input
          name="model"
          value={releaseForm?.model || ""}
          readOnly
          className="w-full p-2 border border-red-500 rounded-lg bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Yıl */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Yıl</label>
        <input
          name="yil"
          value={releaseForm?.yil || ""}
          readOnly
          className="w-full p-2 border border-red-500 rounded-lg bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Renk */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Renk</label>
        <input
          name="renk"
          value={releaseForm?.renk || ""}
          readOnly
          className="w-full p-2 border border-red-500 rounded-lg bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Plaka */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Plaka</label>
        <input
          name="plaka"
          value={releaseForm?.plaka || ""}
          readOnly
          className="w-full p-2 border border-red-500 rounded-lg bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Bulunduğu yer */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Bulunduğu Yer</label>
        <input
          name="yer"
          value={releaseForm?.yer || ""}
          onChange={handleChange}
          className="w-full p-2 border border-red-500 rounded-lg focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* İade zamanı */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">İade Zamanı</label>
        <input
          type="text"
          name="son"
          placeholder="örn: 2025-09-17T14:00"
          value={releaseForm?.son || ""}
          onChange={handleChange}
          className="w-full p-2 border border-red-500 rounded-lg focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* İade nedeni */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">İade Nedeni</label>
        <input
          name="neden"
          placeholder="İade nedeni"
          value={releaseForm?.neden || ""}
          onChange={handleChange}
          className="w-full p-2 border border-red-500 rounded-lg focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Submit Buton */}
      <button
        type="submit"
        className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Araç İade Et
      </button>
    </form>
  );
}
