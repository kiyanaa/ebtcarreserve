export default function AddVehicleForm({ vehicleForm, setVehicleForm, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <h3 className="font-semibold text-lg text-gray-700">🚗 Araç Ekle</h3>
      <input
        required
        placeholder="Marka"
        value={vehicleForm.marka}
        onChange={e =>
          setVehicleForm(s => ({ ...s, marka: e.target.value }))
        }
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
      />
      <input
        required
        placeholder="Model"
        value={vehicleForm.model}
        onChange={e =>
          setVehicleForm(s => ({ ...s, model: e.target.value }))
        }
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
      />
      <input
        required
        placeholder="Yıl"
        value={vehicleForm.yil}
        onChange={e =>
          setVehicleForm(s => ({ ...s, yil: e.target.value }))
        }
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
      />
      <input
        required
        placeholder="Renk"
        value={vehicleForm.renk}
        onChange={e =>
          setVehicleForm(s => ({ ...s, renk: e.target.value }))
        }
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
      />

      <input
        required
        placeholder="Plaka"
        value={vehicleForm.plaka}
        onChange={e =>
          setVehicleForm(s => ({ ...s, plaka: e.target.value }))
        }
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
      />

      <input
        placeholder="Bulunduğu Yer"
        value={vehicleForm.yer}
        onChange={e =>
          setVehicleForm(s => ({ ...s, yer: e.target.value }))
        }
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
      />

      <input
        placeholder="Kullanan"
        value={vehicleForm.kullanan}
        onChange={e =>
          setVehicleForm(s => ({ ...s, kullanan: e.target.value }))
        }
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
      />

      <input
        placeholder="Başlangıç (tarih/saat)"
        value={vehicleForm.baslangic}
        onChange={e =>
          setVehicleForm(s => ({ ...s, baslangic: e.target.value }))
        }
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
      />

      <input
        placeholder="Son (tarih/saat)"
        value={vehicleForm.son}
        onChange={e =>
          setVehicleForm(s => ({ ...s, son: e.target.value }))
        }
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
      />

      <input
        placeholder="Durum"
        value={vehicleForm.durum}
        onChange={e =>
          setVehicleForm(s => ({ ...s, durum: e.target.value }))
        }
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={vehicleForm.tahsis}
          onChange={e =>
            setVehicleForm(s => ({ ...s, tahsis: e.target.checked }))
          }
        />
        <label className="text-gray-600">Tahsis Edildi mi?</label>
      </div>

      {vehicleForm.tahsis && (
        <input
          placeholder="Tahsisli Kişi"
          value={vehicleForm.tahsisli}
          onChange={e =>
            setVehicleForm(s => ({ ...s, tahsisli: e.target.value }))
          }
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
      )}

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Araç Kaydet
      </button>
    </form>
  );
}
