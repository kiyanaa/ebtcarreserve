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
    <form onSubmit={onSubmit} className="p-2">
      <h3 className="font-semibold text-lg text-gray-700 mb-2">İstek Formu</h3>

      <div className="flex flex-wrap gap-4">
        {showKullanan && (
          <input
            required
            name="kullanan"
            placeholder="Kullanan"
            value={requestForm.kullanan}
            onChange={handleChange}
            className="p-2 border rounded-lg w-40 focus:ring-2 focus:ring-blue-400"
          />
        )}
        <input
          required
          name="yer"
          placeholder="Başlangıç Yeri"
          value={requestForm.yer}
          onChange={handleChange}
          className="p-2 border rounded-lg w-40 focus:ring-2 focus:ring-blue-400"
        />

        <input
          required
          name="gidilecek_yer"
          placeholder="Gidilecek Yer"
          value={requestForm.gidilecek_yer}
          onChange={handleChange}
          className="p-2 border rounded-lg w-40 focus:ring-2 focus:ring-blue-400"
        />

        <input
          required
          type="datetime-local"
          name="baslangic"
          placeholder="Başlangıç"
          value={requestForm.baslangic}
          onChange={handleChange}
          className="p-2 border rounded-lg w-52 focus:ring-2 focus:ring-blue-400"
        />

        <input
          required
          type="datetime-local"
          name="son"
          placeholder="Son"
          value={requestForm.son}
          onChange={handleChange}
          className="p-2 border rounded-lg w-52 focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="neden"
          placeholder="Neden"
          value={requestForm.neden}
          onChange={handleChange}
          className="p-2 border rounded-lg w-40 focus:ring-2 focus:ring-blue-400"
        />

        <select
          name="aciliyet"
          value={requestForm.aciliyet}
          onChange={handleChange}
          className="p-2 border rounded-lg w-36 focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Aciliyet Seçiniz</option>
          <option value="düşük">Düşük</option>
          <option value="orta">Orta</option>
          <option value="yüksek">Yüksek</option>
        </select>
      </div>

      
    </form>
  );
}
