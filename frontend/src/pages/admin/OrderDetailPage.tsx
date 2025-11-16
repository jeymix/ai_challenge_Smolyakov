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
  user: { fullName: string; phone: string };
  startDate: string;
  estimatedArrivalDate: string;
  distance: number;
  transportPrice: number;
  insurancePrice: number;
  totalPrice: number;
  paymentStatus: string;
  durationHours: number;
  durationDays: number;
  createdAt: string;
}

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      setIsAuthenticated(true);
      if (id) {
        fetchOrder();
      }
    } else {
      navigate("/admin");
    }
  }, [id, navigate]);

  const fetchOrder = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await api.get(`/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrder(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке заказа:", error);
      alert("Ошибка при загрузке заказа");
      navigate("/admin");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePaymentStatus = async (status: string) => {
    if (!id || !order) return;
    try {
      const token = localStorage.getItem("adminToken");
      await api.patch(
        `/orders/admin/${id}/payment-status`,
        { paymentStatus: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrder();
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error);
      alert("Ошибка при обновлении статуса оплаты");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

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

      <main className="pt-20 pb-20 min-h-screen px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-b from-white to-[#e8c968] bg-clip-text text-transparent">
              Детали заказа #{order.id.slice(0, 8)}
            </h1>
            <button
              onClick={() => navigate("/admin")}
              className="px-5 py-2 border border-accent/50 rounded-lg text-accent hover:bg-accent/10 transition-colors"
            >
              Назад
            </button>
          </div>

          <div className="bg-gradient-to-b from-[#1a1f2e] to-[#151b26] border border-[rgba(43,79,125,0.3)] rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">Информация о клиенте</h2>
              <div className="bg-[#0a0e14] rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">ФИО:</span>
                  <span className="text-white font-medium">{order.user.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Телефон:</span>
                  <span className="text-white font-medium">{order.user.phone}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">Информация о перевозке</h2>
              <div className="bg-[#0a0e14] rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Автомобиль:</span>
                  <span className="text-white font-medium">{order.carBrand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Маршрут:</span>
                  <span className="text-white font-medium">
                    {order.cityFrom.name} → {order.cityTo.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Расстояние:</span>
                  <span className="text-white font-medium">{order.distance} км</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Дата начала:</span>
                  <span className="text-white font-medium">
                    {new Date(order.startDate).toLocaleDateString("ru-RU")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Дата прибытия:</span>
                  <span className="text-white font-medium">
                    {new Date(order.estimatedArrivalDate).toLocaleDateString("ru-RU")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Длительность:</span>
                  <span className="text-white font-medium">
                    {order.durationDays} дн. ({order.durationHours} ч.)
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">Финансовая информация</h2>
              <div className="bg-[#0a0e14] rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Стоимость перевозки:</span>
                  <span className="text-white font-medium">
                    {formatPrice(order.transportPrice)} ₽
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Страховка (10%):</span>
                  <span className="text-white font-medium">
                    {formatPrice(order.insurancePrice)} ₽
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t border-accent/20">
                  <span className="text-white font-semibold">Итого:</span>
                  <span className="text-accent font-bold text-xl">
                    {formatPrice(order.totalPrice)} ₽
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">Статус оплаты</h2>
              <div className="bg-[#0a0e14] rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Текущий статус:</span>
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      order.paymentStatus === "paid"
                        ? "bg-green-400/20 text-green-400"
                        : order.paymentStatus === "unpaid"
                        ? "bg-yellow-400/20 text-yellow-400"
                        : "bg-gray-400/20 text-gray-400"
                    }`}
                  >
                    {order.paymentStatus === "paid"
                      ? "Оплачено"
                      : order.paymentStatus === "unpaid"
                      ? "Не оплачено"
                      : "Ручная обработка"}
                  </span>
                </div>
                <div>
                  <label className="block text-sm text-white mb-2">Изменить статус:</label>
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => updatePaymentStatus(e.target.value)}
                    className="w-full bg-[#0a0e14] border border-accent/50 rounded px-3 py-2 text-white focus:outline-none focus:border-accent"
                  >
                    <option value="unpaid">Не оплачено</option>
                    <option value="paid">Оплачено</option>
                    <option value="manual">Ручная обработка</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">Дополнительная информация</h2>
              <div className="bg-[#0a0e14] rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Дата создания заказа:</span>
                  <span className="text-white font-medium">
                    {new Date(order.createdAt).toLocaleString("ru-RU")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ID заказа:</span>
                  <span className="text-white font-medium text-sm">{order.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetailPage;

