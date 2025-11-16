import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import OrderForm from "../../components/forms/OrderForm";
import api from "../../services/api";

interface OrderFormData {
  carBrand: string;
  carModel: string;
  cityFromId: string;
  cityToId: string;
  startDate: string;
}

const OrderPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: OrderFormData) => {
    setIsLoading(true);
    try {
      // Объединяем марку и модель
      const carBrand = `${data.carBrand} ${data.carModel}`;

      // Рассчитываем стоимость
      const calculationResponse = await api.post("/orders/calculate", {
        carBrand,
        cityFromId: data.cityFromId,
        cityToId: data.cityToId,
        startDate: data.startDate,
      });

      // Сохраняем данные расчета в localStorage для следующего шага
      localStorage.setItem(
        "orderCalculation",
        JSON.stringify({
          ...calculationResponse.data,
          carBrand,
          cityFromId: data.cityFromId,
          cityToId: data.cityToId,
          startDate: data.startDate,
        })
      );

      // Переходим на страницу подтверждения
      navigate("/confirm");
    } catch (error) {
      console.error("Ошибка при расчете стоимости:", error);
      alert("Произошла ошибка при расчете стоимости. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <Header />

      <main className="pt-20 pb-20 min-h-screen flex items-center justify-center px-4">
        <div className="relative w-full max-w-[709px]">
          {/* Декоративный элемент */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[rgba(43,79,125,0.1)] blur-3xl rounded-full" />

          {/* Карточка формы */}
          <div className="relative bg-gradient-to-b from-[#1a1f2e] to-[#151b26] border border-[rgba(43,79,125,0.3)] rounded-2xl p-8">
            {/* Заголовок */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-b from-white to-[#e8c968] bg-clip-text text-transparent">
                Форма заказа перевозки
              </h1>
              <div className="w-24 h-1 bg-gradient-to-b from-transparent via-accent to-transparent mx-auto mb-4" />
              <p className="text-gray-400 text-base">
                Заполните форму для расчета стоимости перевозки
              </p>
            </div>

            {/* Форма */}
            <OrderForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderPage;
