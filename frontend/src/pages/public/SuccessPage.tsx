import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import api from "../../services/api";
import { formatPrice } from "../../utils/formatPrice";

interface Order {
  id: string;
  carBrand: string;
  cityFrom: { name: string };
  cityTo: { name: string };
  startDate: string;
  estimatedArrivalDate: string;
  totalPrice: number;
  paymentStatus: string;
}

const SuccessPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке заказа:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  if (isLoading) {
    return (
      <div className="relative min-h-screen">
        <Header />
        <main className="pt-20 pb-20 min-h-screen flex items-center justify-center">
          <div className="text-white">Загрузка...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="relative min-h-screen">
      <Header />

      <main className="pt-20 pb-20 min-h-screen flex items-center justify-center px-4">
        <div className="relative w-full max-w-2xl">
          <div className="bg-gradient-to-b from-[#1a1f2e] to-[#151b26] border border-[rgba(43,79,125,0.3)] rounded-2xl p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-b from-white to-[#e8c968] bg-clip-text text-transparent">
                Оплата успешно выполнена!
              </h2>
              <p className="text-gray-400">
                Ваш заказ #{order.id.slice(0, 8)} успешно оплачен
              </p>
            </div>

            <div className="space-y-4 mb-8 text-left bg-[#0a0e14] rounded-lg p-6">
              <div className="flex justify-between py-2 border-b border-accent/20">
                <span className="text-gray-400">Автомобиль:</span>
                <span className="text-white font-medium">{order.carBrand}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-accent/20">
                <span className="text-gray-400">Маршрут:</span>
                <span className="text-white font-medium">
                  {order.cityFrom.name} → {order.cityTo.name}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-accent/20">
                <span className="text-gray-400">Дата начала:</span>
                <span className="text-white font-medium">
                  {new Date(order.startDate).toLocaleDateString("ru-RU")}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-accent/20">
                <span className="text-gray-400">Дата прибытия:</span>
                <span className="text-white font-medium">
                  {new Date(order.estimatedArrivalDate).toLocaleDateString("ru-RU")}
                </span>
              </div>

              <div className="flex justify-between py-4 border-t-2 border-accent/30">
                <span className="text-xl font-semibold text-white">Сумма оплаты:</span>
                <span className="text-2xl font-bold text-accent">
                  {formatPrice(order.totalPrice)} ₽
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/profile")}
                className="flex-1 px-6 py-3 bg-accent hover:bg-accent/90 text-[#0a0e14] font-medium rounded-xl transition-colors"
              >
                Перейти в личный кабинет
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 px-6 py-3 border-2 border-accent/50 rounded-xl text-accent hover:bg-accent/10 transition-colors"
              >
                На главную
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SuccessPage;

