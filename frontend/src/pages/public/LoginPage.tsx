import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import LoginForm from "../../components/forms/LoginForm";
import api from "../../services/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: { phone: string }) => {
    setIsLoading(true);
    try {
      // Убираем форматирование из телефона для отправки на сервер
      const phoneNumbers = data.phone.replace(/\D/g, "");
      const phoneForServer = phoneNumbers.startsWith("7")
        ? `+${phoneNumbers}`
        : `+7${phoneNumbers}`;

      // Ищем пользователя по телефону или создаем нового
      let user;
      try {
        const response = await api.get(
          `/users/by-phone?phone=${encodeURIComponent(phoneForServer)}`
        );
        user = response.data;
      } catch (error: any) {
        // Если пользователь не найден, создаем нового
        const createResponse = await api.post("/users", {
          fullName: "Пользователь",
          phone: phoneForServer,
        });
        user = createResponse.data;
      }

      // Сохраняем информацию о пользователе
      localStorage.setItem("user", JSON.stringify(user));
      
      // Отправляем событие для обновления Header
      window.dispatchEvent(new Event("authChange"));

      // Переходим в личный кабинет или на главную
      navigate("/");
    } catch (error) {
      console.error("Ошибка при входе:", error);
      alert("Произошла ошибка при входе. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="relative min-h-screen">
      <Header />

      <main className="pt-20 pb-20 min-h-screen flex items-center justify-center px-4">
        <div className="relative w-full max-w-[466px]">
          {/* Карточка формы */}
          <div className="relative bg-gradient-to-b from-[#1a1f2e] to-[#151b26] border border-[rgba(43,79,125,0.3)] rounded-2xl p-8">
            {/* Заголовок */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-b from-white to-[#e8c968] bg-clip-text text-transparent">
                Вход
              </h1>
              <div className="w-24 h-1 bg-gradient-to-b from-transparent via-accent to-transparent mx-auto mb-4" />
              <p className="text-gray-400 text-base">
                Войдите в личный кабинет
              </p>
            </div>

            {/* Форма */}
            <LoginForm
              onSubmit={handleLogin}
              isLoading={isLoading}
              onRegisterClick={handleRegisterClick}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;

