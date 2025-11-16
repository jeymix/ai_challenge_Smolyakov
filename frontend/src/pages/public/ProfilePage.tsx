import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import api from "../../services/api";
import { formatPrice } from "../../utils/formatPrice";

interface Order {
  id: string;
  carBrand: string;
  cityFrom?: { name: string } | null;
  cityTo?: { name: string } | null;
  cityFromId?: string;
  cityToId?: string;
  startDate: string;
  estimatedArrivalDate: string;
  totalPrice: number;
  paymentStatus: string;
  createdAt: string;
}

interface User {
  id: string;
  fullName: string;
  phone: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Загружаем заказы пользователя
    const fetchOrders = async () => {
      try {
        // Получаем все заказы и фильтруем по userId на клиенте
        // В реальном приложении должен быть endpoint /users/:id/orders
        const response = await api.get(`/users/${parsedUser.id}`);
        if (response.data.orders) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error("Ошибка при загрузке заказов:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return { text: "Оплачено", color: "text-green-400" };
      case "unpaid":
        return { text: "Не оплачено", color: "text-yellow-400" };
      case "manual":
        return { text: "Ручная обработка", color: "text-gray-400" };
      default:
        return { text: status, color: "text-gray-400" };
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

  if (!user) {
    return null;
  }

  return (
    <div className="relative min-h-screen">
      <Header />

      <main className="pt-20 pb-20 min-h-screen px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-b from-white to-[#e8c968] bg-clip-text text-transparent">
            Личный кабинет
          </h1>

          {/* Информация о пользователе */}
          <div className="bg-gradient-to-b from-[#1a1f2e] to-[#151b26] border border-[rgba(43,79,125,0.3)] rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Мои данные</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">ФИО:</span>
                <span className="text-white">{user.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Телефон:</span>
                <span className="text-white">{user.phone}</span>
              </div>
            </div>
          </div>

          {/* Список заказов */}
          <div className="bg-gradient-to-b from-[#1a1f2e] to-[#151b26] border border-[rgba(43,79,125,0.3)] rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6 text-white">Мои заказы</h2>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">У вас пока нет заказов</p>
                <button
                  onClick={() => navigate("/order")}
                  className="px-6 py-3 bg-accent hover:bg-accent/90 text-[#0a0e14] font-medium rounded-xl transition-colors"
                >
                  Создать заказ
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const status = getStatusText(order.paymentStatus);
                  return (
                    <div
                      key={order.id}
                      className="bg-[#0a0e14] border border-[rgba(43,79,125,0.3)] rounded-xl p-6 hover:border-accent/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            Заказ #{order.id.slice(0, 8)}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {order.carBrand} • {order.cityFrom?.name || order.cityFromId || "Город отправления"} → {order.cityTo?.name || order.cityToId || "Город назначения"}
                          </p>
                        </div>
                        <span className={`font-medium ${status.color}`}>
                          {status.text}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-400">Дата начала:</span>
                          <p className="text-white">
                            {new Date(order.startDate).toLocaleDateString("ru-RU")}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">Дата прибытия:</span>
                          <p className="text-white">
                            {new Date(order.estimatedArrivalDate).toLocaleDateString("ru-RU")}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">Создан:</span>
                          <p className="text-white">
                            {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">Стоимость:</span>
                          <p className="text-white font-semibold">
                            {formatPrice(order.totalPrice)} ₽
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        {order.paymentStatus === "unpaid" && (
                          <button
                            onClick={() => navigate(`/payment/${order.id}`)}
                            className="px-4 py-2 bg-accent hover:bg-accent/90 text-[#0a0e14] font-medium rounded-lg transition-colors"
                          >
                            Оплатить
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/payment/${order.id}`)}
                          className="px-4 py-2 border border-accent/50 rounded-lg text-accent hover:bg-accent/10 transition-colors"
                        >
                          Подробнее
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;

