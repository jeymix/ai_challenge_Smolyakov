import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  totalPrice: number;
  paymentStatus: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [filters, setFilters] = useState({
    paymentStatus: "",
    dateFrom: "",
    dateTo: "",
    search: "",
  });

  useEffect(() => {
    // Проверяем, есть ли токен админа
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const applyFilters = useCallback(
    (ordersList: Order[]) => {
      let filtered = [...ordersList];

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          (order) =>
            order.user.fullName.toLowerCase().includes(searchLower) ||
            order.user.phone.includes(searchLower) ||
            order.carBrand.toLowerCase().includes(searchLower) ||
            order.cityFrom.name.toLowerCase().includes(searchLower) ||
            order.cityTo.name.toLowerCase().includes(searchLower)
        );
      }

      setFilteredOrders(filtered);
    },
    [filters.search]
  );

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const params: any = {};
      if (filters.paymentStatus) {
        params.paymentStatus = filters.paymentStatus;
      }
      if (filters.dateFrom) {
        params.startDate = filters.dateFrom;
      }
      if (filters.dateTo) {
        params.endDate = filters.dateTo;
      }

      const response = await api.get("/orders/admin/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });
      const ordersData = response.data.orders || [];
      setOrders(ordersData);
    } catch (error) {
      console.error("Ошибка при загрузке заказов:", error);
      alert("Ошибка при загрузке заказов");
    } finally {
      setIsLoading(false);
    }
  }, [filters.paymentStatus, filters.dateFrom, filters.dateTo]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  useEffect(() => {
    if (orders.length > 0) {
      applyFilters(orders);
    }
  }, [orders, applyFilters]);

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/admin/login", {
        login,
        password,
      });

      // Сохраняем токен из ответа API
      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        setIsAuthenticated(true);
        fetchOrders();
      }
    } catch (error: any) {
      alert(
        error.response?.data?.message || "Неверные учетные данные администратора"
      );
    }
  };

  const updatePaymentStatus = async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      await api.patch(
        `/orders/admin/${orderId}/payment-status`,
        { paymentStatus: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrders();
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error);
      alert("Ошибка при обновлении статуса оплаты");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    navigate("/");
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      paymentStatus: "",
      dateFrom: "",
      dateTo: "",
      search: "",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen">
        <Header />
        <main className="pt-20 pb-20 min-h-screen flex items-center justify-center px-4">
          <div className="relative w-full max-w-md">
            <div className="bg-gradient-to-b from-[#1a1f2e] to-[#151b26] border border-[rgba(43,79,125,0.3)] rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-b from-white to-[#e8c968] bg-clip-text text-transparent">
                Вход для сотрудников
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white mb-2">Логин</label>
                  <input
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    className="w-full h-[45px] bg-[#0a0e14] border border-[rgba(43,79,125,0.5)] rounded-lg px-3 text-white focus:outline-none focus:border-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white mb-2">Пароль</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-[45px] bg-[#0a0e14] border border-[rgba(43,79,125,0.5)] rounded-lg px-3 text-white focus:outline-none focus:border-accent/50"
                  />
                </div>
                <button
                  onClick={handleLogin}
                  className="w-full bg-accent hover:bg-accent/90 text-[#0a0e14] font-medium py-3 px-5 rounded-xl transition-colors"
                >
                  Войти
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
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

  return (
    <div className="relative min-h-screen">
      <Header />

      <main className="pt-20 pb-20 min-h-screen px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-b from-white to-[#e8c968] bg-clip-text text-transparent">
              Панель администратора
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/admin/cities")}
                className="px-5 py-2 border border-accent/50 rounded-lg text-accent hover:bg-accent/10 transition-colors"
              >
                Управление городами
              </button>
              <button
                onClick={() => navigate("/admin/tariffs")}
                className="px-5 py-2 border border-accent/50 rounded-lg text-accent hover:bg-accent/10 transition-colors"
              >
                Управление тарифами
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2 border border-accent/50 rounded-lg text-accent hover:bg-accent/10 transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-b from-[#1a1f2e] to-[#151b26] border border-[rgba(43,79,125,0.3)] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">
                Реестр заказов ({filteredOrders.length} / {orders.length})
              </h2>
            </div>

            {/* Фильтры */}
            <div className="bg-[#0a0e14] rounded-lg p-4 mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Поиск</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    placeholder="Поиск по клиенту, телефону, авто..."
                    className="w-full h-[40px] bg-[#0a0e14] border border-[rgba(43,79,125,0.5)] rounded-lg px-3 text-white text-sm focus:outline-none focus:border-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Статус оплаты</label>
                  <select
                    value={filters.paymentStatus}
                    onChange={(e) => handleFilterChange("paymentStatus", e.target.value)}
                    className="w-full h-[40px] bg-[#0a0e14] border border-[rgba(43,79,125,0.5)] rounded-lg px-3 text-white text-sm focus:outline-none focus:border-accent/50"
                  >
                    <option value="">Все</option>
                    <option value="unpaid">Не оплачено</option>
                    <option value="paid">Оплачено</option>
                    <option value="manual">Ручная обработка</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Дата от</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                    className="w-full h-[40px] bg-[#0a0e14] border border-[rgba(43,79,125,0.5)] rounded-lg px-3 text-white text-sm focus:outline-none focus:border-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Дата до</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                    className="w-full h-[40px] bg-[#0a0e14] border border-[rgba(43,79,125,0.5)] rounded-lg px-3 text-white text-sm focus:outline-none focus:border-accent/50"
                  />
                </div>
              </div>
              {(filters.search || filters.paymentStatus || filters.dateFrom || filters.dateTo) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-accent/50 rounded-lg text-accent hover:bg-accent/10 transition-colors text-sm"
                >
                  Сбросить фильтры
                </button>
              )}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Заказов пока нет</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-accent/20">
                      <th className="text-left py-3 px-4 text-gray-400">ID</th>
                      <th className="text-left py-3 px-4 text-gray-400">Клиент</th>
                      <th className="text-left py-3 px-4 text-gray-400">Автомобиль</th>
                      <th className="text-left py-3 px-4 text-gray-400">Маршрут</th>
                      <th className="text-left py-3 px-4 text-gray-400">Дата</th>
                      <th className="text-left py-3 px-4 text-gray-400">Стоимость</th>
                      <th className="text-left py-3 px-4 text-gray-400">Статус</th>
                      <th className="text-left py-3 px-4 text-gray-400">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-accent/10 hover:bg-[#0a0e14] transition-colors"
                      >
                        <td className="py-3 px-4 text-white text-sm">
                          #{order.id.slice(0, 8)}
                        </td>
                        <td className="py-3 px-4 text-white">
                          <div>
                            <div>{order.user.fullName}</div>
                            <div className="text-sm text-gray-400">{order.user.phone}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white">{order.carBrand}</td>
                        <td className="py-3 px-4 text-white text-sm">
                          {order.cityFrom.name} → {order.cityTo.name}
                        </td>
                        <td className="py-3 px-4 text-white text-sm">
                          {new Date(order.startDate).toLocaleDateString("ru-RU")}
                        </td>
                        <td className="py-3 px-4 text-white font-semibold">
                          {formatPrice(order.totalPrice)} ₽
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
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
                              : "Ручная"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/admin/orders/${order.id}`)}
                              className="px-3 py-1 border border-accent/50 rounded text-accent hover:bg-accent/10 transition-colors text-sm"
                            >
                              Подробнее
                            </button>
                            <select
                              value={order.paymentStatus}
                              onChange={(e) =>
                                updatePaymentStatus(order.id, e.target.value)
                              }
                              className="bg-[#0a0e14] border border-accent/50 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-accent"
                            >
                              <option value="unpaid">Не оплачено</option>
                              <option value="paid">Оплачено</option>
                              <option value="manual">Ручная обработка</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;

