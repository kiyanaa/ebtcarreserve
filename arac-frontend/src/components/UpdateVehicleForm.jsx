export default function UpdateVehicleForm({ updateForm, setUpdateForm, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 p-6 bg-white shadow-md rounded-xl border border-red-400">
      <h3 className="font-semibold text-xl text-gray-700 mb-4">🛠️ Araç Güncelle</h3>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Marka</label>
        <input
          placeholder="Marka"
          value={updateForm.marka}
          disabled
          onChange={e => setUpdateForm(s => ({ ...s, marka: e.target.value }))}
          className="w-full p-3 border-2 border-red-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 disabled:bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Model</label>
        <input
          placeholder="Model"
          value={updateForm.model}
          disabled
          onChange={e => setUpdateForm(s => ({ ...s, model: e.target.value }))}
          className="w-full p-3 border-2 border-red-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 disabled:bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Yıl</label>
        <input
          placeholder="Yıl"
          value={updateForm.yil}
          disabled
          onChange={e => setUpdateForm(s => ({ ...s, yil: e.target.value }))}
          className="w-full p-3 border-2 border-red-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 disabled:bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Renk</label>
        <input
          placeholder="Renk"
          value={updateForm.renk}
          disabled
          onChange={e => setUpdateForm(s => ({ ...s, renk: e.target.value }))}
          className="w-full p-3 border-2 border-red-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 disabled:bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Plaka</label>
        <input
          placeholder="Plaka"
          required
          value={updateForm.plaka}
          disabled
          className="w-full p-3 border-2 border-red-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Yer</label>
        <input
          placeholder="Yer"
          value={updateForm.yer}
          onChange={e => setUpdateForm(s => ({ ...s, yer: e.target.value }))}
          className="w-full p-3 border-2 border-red-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Kullanan</label>
        <input
          placeholder="Kullanan"
          value={updateForm.kullanan}
          onChange={e => setUpdateForm(s => ({ ...s, kullanan: e.target.value }))}
          className="w-full p-3 border-2 border-red-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Başlangıç</label>
        <input
          type="datetime-local"
          placeholder="Başlangıç"
          value={updateForm.baslangic}
          onChange={e => setUpdateForm(s => ({ ...s, baslangic: e.target.value }))}
          className="w-full p-3 border-2 border-red-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Bitiş</label>
        <input
          type="datetime-local"
          placeholder="Bitiş"
          value={updateForm.son}
          onChange={e => setUpdateForm(s => ({ ...s, son: e.target.value }))}
          className="w-full p-3 border-2 border-red-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Durum</label>
        <input
          placeholder="Durum"
          value={updateForm.durum}
          onChange={e => setUpdateForm(s => ({ ...s, durum: e.target.value }))}
          className="w-full p-3 border-2 border-red-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Tahsisli mi?</label>
        <input
          type="checkbox"
          checked={updateForm.tahsis}
          onChange={e => setUpdateForm(s => ({ ...s, tahsis: e.target.checked }))}
          className="accent-red-500"
        />
        <input
          placeholder="Tahsisli Kişi"
          value={updateForm.tahsisli}
          onChange={e => setUpdateForm(s => ({ ...s, tahsisli: e.target.value }))}
          className="p-3 border-2 border-red-400 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <button className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors">
        Güncelle
      </button>
    </form>
  );
}
