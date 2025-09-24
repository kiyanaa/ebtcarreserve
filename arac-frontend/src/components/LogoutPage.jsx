import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Token'ı temizle
    localStorage.removeItem("token");

    // Login sayfasına yönlendir
    navigate("/", { replace: true }); // replace ile geçmişe eklemeden yönlendir
  }, [navigate]);

  // Render edilecek basit bir mesaj
  return <div className="text-center mt-10 text-gray-500">Çıkış yapılıyor...</div>;
}
