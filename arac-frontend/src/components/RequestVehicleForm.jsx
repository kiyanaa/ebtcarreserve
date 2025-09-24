import React from "react";

export default function RequestForm({ requestForm, setRequestForm, onSubmit }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequestForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 p-2">
      <h3 className="font-semibold text-lg text-gray-700">📋 İstek Oluştur</h3>

      {/* Sahip */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Sahip</label>
        <input
          name="sahip"
          value={requestForm.sahip || "Havuz"}
          readOnly
          disabled
          className="w-full p-2 border border-red-500 rounded-lg bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Plaka */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Plaka</label>
        <input
          name="plaka"
          required
          value={requestForm.plaka || ""}
          onChange={handleChange}
          className="w-full p-2 border border-red-500 rounded-lg focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Bulunduğu Yer */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Bulunduğu Yer</label>
        <input
          name="yer"
          value={requestForm.yer || ""}
          onChange={handleChange}
          className="w-full p-2 border border-red-500 rounded-lg focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Gidilecek Yer */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Gidilecek Yer</label>
        <input
          name="gidilecek_yer"
          value={requestForm.gidilecek_yer || ""}
          onChange={handleChange}
          className="w-full p-2 border border-red-500 rounded-lg focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Başlangıç */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Başlangıç</label>
        <input
          name="baslangic"
          placeholder="Başlangıç (tarih/saat)"
          value={requestForm.baslangic || ""}
          onChange={handleChange}
          className="w-full p-2 border border-red-500 rounded-lg focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Son ve Neden */}
      <div className="flex gap-2">
        <div className="flex-1 flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Son</label>
          <input
            name="son"
            placeholder="Son"
            value={requestForm.son || ""}
            onChange={handleChange}
            className="w-full p-2 border border-red-500 rounded-lg focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Neden</label>
          <input
            name="neden"
            placeholder="Neden"
            value={requestForm.neden || ""}
            onChange={handleChange}
            className="w-full p-2 border border-red-500 rounded-lg focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>

      {/* Aciliyet */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Aciliyet</label>
        <input
          name="aciliyet"
          placeholder="Aciliyet"
          value={requestForm.aciliyet || ""}
          onChange={handleChange}
          className="w-full p-2 border border-red-500 rounded-lg focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Submit Buton */}
      <button
        type="submit"
        className="w-full py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
      >
        İstek Gönder
      </button>
    </form>
  );
}
