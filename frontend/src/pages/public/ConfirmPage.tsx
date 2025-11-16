import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { formatPrice } from "../../utils/formatPrice";
import api from "../../services/api";
import { citiesService, City } from "../../services/cities.service";

interface CalculationData {
  carBrand: string;
  cityFromId: string;
  cityToId: string;
  startDate: string;
  distance: number;
  appliedTariff: number;
  transportPrice: number;
  insurancePrice: number;
  totalPrice: number;
  durationHours: number;
  durationDays: number;
  estimatedArrivalDate: string;
  isFixedRoute: boolean;
}

const ConfirmPage = () => {
  const navigate = useNavigate();
  const [calculation, setCalculation] = useState<CalculationData | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("orderCalculation");
    if (!stored) {
      navigate("/order");
      return;
    }

    const data = JSON.parse(stored);
    setCalculation(data);

    // Загружаем города для отображения названий
    citiesService
      .getAll()
      .then((response) => setCities(response.data))
      .finally(() => setIsLoading(false));
  }, [navigate]);

  const getCityName = (id: string) => {
    return cities.find((c) => c.id === id)?.name || id;
  };

  const handleConfirm = async () => {
    if (!calculation) return;

    try {
      // Получаем пользователя из localStorage или создаем нового
      let userId: string;
      const userData = localStorage.getItem("user");
      
      if (userData) {
        const user = JSON.parse(userData);
        userId = user.id;
      } else {
        // Если пользователь не авторизован, перенаправляем на вход
        alert("Для создания заказа необходимо войти в систему");
        navigate("/login");
        return;
      }

      // Создаем заказ (отправляем только необходимые поля, остальное сервер рассчитает)
      const orderResponse = await api.post("/orders", {
        userId,
        carBrand: calculation.carBrand,
        cityFromId: calculation.cityFromId,
        cityToId: calculation.cityToId,
        startDate: calculation.startDate,
      });

      // Сохраняем ID заказа
      localStorage.setItem("orderId", orderResponse.data.id);
      localStorage.removeItem("orderCalculation");

      // Переходим на страницу оплаты
      navigate(`/payment/${orderResponse.data.id}`);
    } catch (error: any) {
      console.error("Ошибка при создании заказа:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Произошла ошибка при создании заказа. Попробуйте еще раз.";
      
      // Показываем детали ошибки в консоли для отладки
      if (error.response?.data) {
        console.error("Детали ошибки:", error.response.data);
      }
      
      alert(errorMessage);
    }
  };

  if (isLoading || !calculation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <Header />

      <main className="pt-20 pb-20 min-h-screen flex items-center justify-center px-4">
        <div className="relative w-full max-w-2xl">
          <div className="bg-gradient-to-b from-[#1a1f2e] to-[#151b26] border border-[rgba(43,79,125,0.3)] rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-b from-white to-[#e8c968] bg-clip-text text-transparent">
              Подтверждение заказа
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between py-2 border-b border-accent/20">
                <span className="text-gray-400">Автомобиль:</span>
                <span className="text-white font-medium">{calculation.carBrand}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-accent/20">
                <span className="text-gray-400">Маршрут:</span>
                <span className="text-white font-medium">
                  {getCityName(calculation.cityFromId)} →{" "}
                  {getCityName(calculation.cityToId)}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-accent/20">
                <span className="text-gray-400">Дата начала:</span>
                <span className="text-white font-medium">
                  {new Date(calculation.startDate).toLocaleDateString("ru-RU")}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-accent/20">
                <span className="text-gray-400">Расстояние:</span>
                <span className="text-white font-medium">
                  {calculation.distance} км
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-accent/20">
                <span className="text-gray-400">Время в пути:</span>
                <span className="text-white font-medium">
                  {calculation.durationDays} дней ({calculation.durationHours} часов)
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-accent/20">
                <span className="text-gray-400">Дата прибытия:</span>
                <span className="text-white font-medium">
                  {new Date(calculation.estimatedArrivalDate).toLocaleDateString(
                    "ru-RU"
                  )}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-accent/20">
                <span className="text-gray-400">Стоимость перевозки:</span>
                <span className="text-white font-medium">
                  {formatPrice(calculation.transportPrice)} ₽
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-accent/20">
                <span className="text-gray-400">Страховка (10%):</span>
                <span className="text-white font-medium">
                  {formatPrice(calculation.insurancePrice)} ₽
                </span>
              </div>

              <div className="flex justify-between py-4 border-t-2 border-accent/30">
                <span className="text-xl font-semibold text-white">Итого:</span>
                <span className="text-2xl font-bold text-accent">
                  {formatPrice(calculation.totalPrice)} ₽
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/order")}
                className="flex-1 px-6 py-3 border-2 border-accent/50 rounded-xl text-accent hover:bg-accent/10 transition-colors"
              >
                Назад
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-6 py-3 bg-accent hover:bg-accent/90 text-[#0a0e14] font-medium rounded-xl transition-colors"
              >
                Подтвердить и оплатить
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConfirmPage;

