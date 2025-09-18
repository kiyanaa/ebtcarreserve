export default function ReleaseVehicleForm({ releaseForm, setReleaseForm, onSubmit }) {
  if (!releaseForm) return null;

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <h3 className="font-semibold text-lg text-gray-700">🚗 Araç İade</h3>
      <input
        required
        placeholder="Marka"
        value={releaseForm?.marka || ""}
        readOnly
        className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
      />
      <input
        required
        placeholder="Model"
        value={releaseForm?.model || ""}
        readOnly
        className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
      />
      <input
        required
        placeholder="Yıl"
        value={releaseForm?.yil || ""}
        readOnly
        className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
      />
      <input
        required
        placeholder="Renk"
        value={releaseForm?.renk || ""}
        readOnly
        className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
      />
      {/* Plaka sadece okunabilir */}
      <input
        required
        placeholder="Plaka"
        value={releaseForm?.plaka || ""}
        readOnly
        className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
      />

      {/* Bulunduğu yer */}
      <input
        required
        placeholder="Bulunduğu yer"
        value={releaseForm?.yer || ""}
        onChange={e => setReleaseForm(s => ({ ...s, yer: e.target.value }))}
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-400"
      />

      {/* İade zamanı */}
      <input
        type="text" // artık local time yok
        placeholder="İade zamanı (örn: 2025-09-17T14:00)"
        value={releaseForm?.son || ""}
        onChange={e => setReleaseForm(s => ({ ...s, son: e.target.value }))}
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-400"
      />

      {/* İade nedeni */}
      <input
        placeholder="İade nedeni"
        value={releaseForm?.neden || ""}
        onChange={e => setReleaseForm(s => ({ ...s, neden: e.target.value }))}
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-400"
      />

      <button
        type="submit"
        className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Araç İade Et
      </button>
    </form>
  );
}
