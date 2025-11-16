import { useState, useEffect } from "react";
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
  totalPrice: number;
  paymentStatus: string;
  estimatedArrivalDate: string;
}

const PaymentPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

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
        alert("Заказ не найден");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  const handlePayment = async () => {
    if (!orderId) return;

    setIsProcessing(true);
    try {
      const response = await api.post("/payment/process", {
        orderId,
      });

      if (response.data.success) {
        navigate(`/success/${orderId}`);
      }
    } catch (error) {
      console.error("Ошибка при оплате:", error);
      alert("Произошла ошибка при обработке оплаты. Попробуйте еще раз.");
    } finally {
      setIsProcessing(false);
    }
  };

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
          <div className="bg-gradient-to-b from-[#1a1f2e] to-[#151b26] border border-[rgba(43,79,125,0.3)] rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-b from-white to-[#e8c968] bg-clip-text text-transparent">
              Оплата заказа
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between py-2 border-b border-accent/20">
                <span className="text-gray-400">Номер заказа:</span>
                <span className="text-white font-medium">#{order.id.slice(0, 8)}</span>
              </div>

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

              <div className="flex justify-between py-2 border-b border-accent/20">
                <span className="text-gray-400">Статус оплаты:</span>
                <span
                  className={`font-medium ${
                    order.paymentStatus === "paid"
                      ? "text-green-400"
                      : order.paymentStatus === "unpaid"
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                >
                  {order.paymentStatus === "paid"
                    ? "Оплачено"
                    : order.paymentStatus === "unpaid"
                    ? "Не оплачено"
                    : "Ручная обработка"}
                </span>
              </div>

              <div className="flex justify-between py-4 border-t-2 border-accent/30">
                <span className="text-xl font-semibold text-white">К оплате:</span>
                <span className="text-2xl font-bold text-accent">
                  {formatPrice(order.totalPrice)} ₽
                </span>
              </div>
            </div>

            {order.paymentStatus === "unpaid" ? (
              <div className="space-y-4">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-accent hover:bg-accent/90 text-[#0a0e14] font-medium py-3 px-5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Обработка оплаты..." : "Оплатить"}
                </button>
                <p className="text-sm text-gray-400 text-center">
                  Это симулятор оплаты. В реальном приложении здесь будет форма оплаты.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-green-400 mb-4">Заказ уже оплачен</p>
                <button
                  onClick={() => navigate("/profile")}
                  className="px-6 py-3 border-2 border-accent/50 rounded-xl text-accent hover:bg-accent/10 transition-colors"
                >
                  Перейти в личный кабинет
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentPage;

