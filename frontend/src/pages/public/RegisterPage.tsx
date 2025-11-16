import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import RegisterForm from "../../components/forms/RegisterForm";
import api from "../../services/api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data: { fullName: string; phone: string }) => {
    setIsLoading(true);
    try {
      // Убираем форматирование из телефона для отправки на сервер
      const phoneNumbers = data.phone.replace(/\D/g, "");
      const phoneForServer = phoneNumbers.startsWith("7")
        ? `+${phoneNumbers}`
        : `+7${phoneNumbers}`;

      // Создаем пользователя
      const response = await api.post("/users", {
        fullName: data.fullName,
        phone: phoneForServer,
      });

      // Сохраняем информацию о пользователе
      localStorage.setItem("user", JSON.stringify(response.data));
      
      // Отправляем событие для обновления Header
      window.dispatchEvent(new Event("authChange"));

      // Переходим на главную или в личный кабинет
      navigate("/");
    } catch (error: any) {
      console.error("Ошибка при регистрации:", error);
      if (error.response?.status === 409) {
        alert("Пользователь с таким телефоном уже зарегистрирован. Войдите в систему.");
        navigate("/login");
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "Произошла ошибка при регистрации. Попробуйте еще раз.";
        alert(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
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
                Регистрация
              </h1>
              <div className="w-24 h-1 bg-gradient-to-b from-transparent via-accent to-transparent mx-auto mb-4" />
              <p className="text-gray-400 text-base">
                Создайте новый аккаунт
              </p>
            </div>

            {/* Форма */}
            <RegisterForm
              onSubmit={handleRegister}
              isLoading={isLoading}
              onLoginClick={handleLoginClick}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;

