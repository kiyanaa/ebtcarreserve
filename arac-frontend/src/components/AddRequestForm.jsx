import React from "react";

export default function AddRequestForm({ requestForm, setRequestForm, onSubmit }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequestForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const token = localStorage.getItem("token") || "";
  const userPosition = token ? JSON.parse(atob(token.split(".")[1])).position : "";
  const showKullanan = userPosition === "admin" || userPosition === "havuz";

  return (
    <form onSubmit={onSubmit} className="p-4 space-y-4">
      <h3 className="font-semibold text-lg text-gray-700 mb-2">İstek Formu</h3>

      <div className="flex flex-wrap gap-6">
        {/* Kullanan */}
        {showKullanan && (
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Kullanan</label>
            <input
              required
              name="kullanan"
              placeholder="Kullanan"
              value={requestForm.kullanan}
              onChange={handleChange}
              className="p-2 border border-red-500 rounded-lg w-40 focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}

        {/* Başlangıç Yeri */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Başlangıç Yeri</label>
          <input
            required
            name="yer"
            placeholder="Başlangıç Yeri"
            value={requestForm.yer}
            onChange={handleChange}
            className="p-2 border border-red-500 rounded-lg w-40 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Gidilecek Yer */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Gidilecek Yer</label>
          <input
            required
            name="gidilecek_yer"
            placeholder="Gidilecek Yer"
            value={requestForm.gidilecek_yer}
            onChange={handleChange}
            className="p-2 border border-red-500 rounded-lg w-40 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Başlangıç Tarihi */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Başlangıç</label>
          <input
            required
            type="datetime-local"
            name="baslangic"
            value={requestForm.baslangic}
            onChange={handleChange}
            className="p-2 border border-red-500 rounded-lg w-52 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Son Tarihi */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Son</label>
          <input
            required
            type="datetime-local"
            name="son"
            value={requestForm.son}
            onChange={handleChange}
            className="p-2 border border-red-500 rounded-lg w-52 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Neden */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Neden</label>
          <input
            name="neden"
            placeholder="Neden"
            value={requestForm.neden}
            onChange={handleChange}
            className="p-2 border border-red-500 rounded-lg w-40 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Aciliyet */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Aciliyet</label>
          <select
            name="aciliyet"
            value={requestForm.aciliyet}
            onChange={handleChange}
            className="p-2 border border-red-500 rounded-lg w-36 focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Aciliyet Seçiniz</option>
            <option value="düşük">Düşük</option>
            <option value="orta">Orta</option>
            <option value="yüksek">Yüksek</option>
          </select>
        </div>
      </div>
    </form>
  );
}
