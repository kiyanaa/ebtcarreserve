export default function AddVehicleForm({ vehicleForm, setVehicleForm, onSubmit }) {
  const inputStyle = {
    border: "4px solid red",
    borderRadius: "0.5rem",
    padding: "0.75rem",
    backgroundColor: "white",
    width: "100%",
    outline: "none",
  };

  const focusStyle = {
    boxShadow: "0 0 0 4px rgba(255,0,0,0.5)",
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      <h3 style={{ fontWeight: 600, fontSize: "1.25rem", color: "#374151" }}>
        🚗 Araç Ekle
      </h3>

      {[
        { label: "Marka", key: "marka", placeholder: "Toyota" },
        { label: "Model", key: "model", placeholder: "Corolla" },
        { label: "Yıl", key: "yil", placeholder: "2025", type: "number" },
        { label: "Renk", key: "renk", placeholder: "Beyaz" },
        { label: "Plaka", key: "plaka", placeholder: "34ABC123" },
        { label: "Bulunduğu Yer", key: "yer", placeholder: "İstanbul Depo" },
        { label: "Kullanan", key: "kullanan", placeholder: "Ali Veli" },
        { label: "Başlangıç", key: "baslangic", type: "datetime-local" },
        { label: "Son", key: "son", type: "datetime-local" },
      ].map((field) => (
        <div key={field.key} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: 500, color: "#374151" }}>{field.label}</label>
          <input
            required
            type={field.type || "text"}
            placeholder={field.placeholder || ""}
            value={vehicleForm[field.key]}
            onChange={(e) =>
              setVehicleForm((s) => ({ ...s, [field.key]: e.target.value }))
            }
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
          />
        </div>
      ))}

      {/* Durum */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={{ fontWeight: 500, color: "#374151" }}>Durum</label>
        <select
          value={vehicleForm.durum}
          onChange={(e) =>
            setVehicleForm((s) => ({ ...s, durum: e.target.value }))
          }
          style={inputStyle}
        >
          <option value="">Seçiniz</option>
          <option value="Tahsisli">Tahsisli</option>
          <option value="Uygun">Uygun</option>
          <option value="Kullanımda">Kullanımda</option>
        </select>
      </div>

      {/* Tahsis */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input
          type="checkbox"
          checked={vehicleForm.tahsis}
          onChange={(e) =>
            setVehicleForm((s) => ({ ...s, tahsis: e.target.checked }))
          }
        />
        <label style={{ color: "#4B5563" }}>Tahsis Edildi mi?</label>
      </div>

      {vehicleForm.tahsis && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: 500, color: "#374151" }}>Tahsisli Kişi</label>
          <input
            placeholder="Tahsisli Kişi Adı"
            value={vehicleForm.tahsisli}
            onChange={(e) =>
              setVehicleForm((s) => ({ ...s, tahsisli: e.target.value }))
            }
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
          />
        </div>
      )}

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "0.75rem",
          backgroundColor: "#2563EB",
          color: "white",
          borderRadius: "0.5rem",
          fontWeight: 500,
          cursor: "pointer",
          border: "none",
        }}
      >
        Araç Kaydet
      </button>
    </form>
  );
}
