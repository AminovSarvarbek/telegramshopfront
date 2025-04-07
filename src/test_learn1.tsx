import { useEffect, useState } from "react";

const BASE_URL = "https://matthew-hostels-drainage-appeals.trycloudflare.com";

interface User {
  id: number;
  first_name: string;
  username?: string;
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    tg?.ready(); // WebApp yuklanganini Telegram'ga bildirish
    tg?.expand(); // WebApp'ni to‘liq ekran qilish

    const initUser = tg?.initDataUnsafe?.user;
    if (initUser) {
      setUser(initUser);
    }
  }, []);

  const sendData = async () => {
    if (!user) return;

    try {
      tg?.HapticFeedback?.impactOccurred("medium"); // Tugma bosilganda tebranish effekti

      const response = await fetch(`${BASE_URL}/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Xatolik: ${errorText}`);
      }

      console.log("✅ Ma'lumot yuborildi!");
      tg?.close(); // WebApp'ni yopish
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-2xl font-bold">Telegram WebApp</h1>
      {user ? (
        <p className="mt-2">Salom, {user.first_name}!</p>
      ) : (
        <p>Foydalanuvchi yuklanmoqda...</p>
      )}
      <button
        onClick={sendData}
        className="mt-4 bg-blue-500 px-4 py-2 rounded"
      >
        Ma'lumot yuborish
      </button>
    </div>
  );
};

export default App;
