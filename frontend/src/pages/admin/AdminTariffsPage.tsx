import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import api from "../../services/api";

interface Tariff {
  id: string;
  month: number;
  pricePerKmUnder1000: number;
  pricePerKmOver1000: number;
  createdAt: string;
  updatedAt: string;
}

const monthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const AdminTariffsPage = () => {
  const navigate = useNavigate();
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTariff, setEditingTariff] = useState<Tariff | null>(null);
  const [formData, setFormData] = useState({
    month: 1,
    pricePerKmUnder1000: 150,
    pricePerKmOver1000: 100,
  });

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      setIsAuthenticated(true);
      fetchTariffs();
    } else {
      navigate("/admin");
    }
  }, [navigate]);

  const fetchTariffs = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await api.get("/admin/tariffs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTariffs(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке тарифов:", error);
      alert("Ошибка при загрузке тарифов");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await api.post(
        "/admin/tariffs",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsModalOpen(false);
      setFormData({ month: 1, pricePerKmUnder1000: 150, pricePerKmOver1000: 100 });
      fetchTariffs();
    } catch (error: any) {
      alert(
        error.response?.data?.message || "Ошибка при создании тарифа"
      );
    }
  };

  const handleUpdate = async () => {
    if (!editingTariff) return;

    try {
      const token = localStorage.getItem("adminToken");
      await api.put(
        `/admin/tariffs/${editingTariff.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsModalOpen(false);
      setEditingTariff(null);
      setFormData({ month: 1, pricePerKmUnder1000: 150, pricePerKmOver1000: 100 });
      fetchTariffs();
    } catch (error: any) {
      alert(error.response?.data?.message || "Ошибка при обновлении тарифа");
    }
  };

  const openCreateModal = () => {
    setEditingTariff(null);
    setFormData({ month: 1, pricePerKmUnder1000: 150, pricePerKmOver1000: 100 });
    setIsModalOpen(true);
  };

  const openEditModal = (tariff: Tariff) => {
    setEditingTariff(tariff);
    setFormData({
      month: tariff.month,
      pricePerKmUnder1000: tariff.pricePerKmUnder1000,
      pricePerKmOver1000: tariff.pricePerKmOver1000,
    });
    setIsModalOpen(true);
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

  return (
    <div className="relative min-h-screen">
      <Header />

      <main className="pt-20 pb-20 min-h-screen px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-b from-white to-[#e8c968] bg-clip-text text-transparent">
              Управление тарифами
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/admin")}
                className="px-5 py-2 border border-accent/50 rounded-lg text-accent hover:bg-accent/10 transition-colors"
              >
                Назад
              </button>
              <button
                onClick={openCreateModal}
                className="px-5 py-2 bg-accent hover:bg-accent/90 text-[#0a0e14] font-medium rounded-lg transition-colors"
              >
                + Добавить тариф
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-b from-[#1a1f2e] to-[#151b26] border border-[rgba(43,79,125,0.3)] rounded-2xl p-6">
            {tariffs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Тарифов пока нет</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-accent/20">
                      <th className="text-left py-3 px-4 text-gray-400">Месяц</th>
                      <th className="text-left py-3 px-4 text-gray-400">Цена за км (≤1000 км)</th>
                        <th className="text-left py-3 px-4 text-gray-400">Цена за км (&gt;1000 км)</th>
                      <th className="text-left py-3 px-4 text-gray-400">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tariffs
                      .sort((a, b) => a.month - b.month)
                      .map((tariff) => (
                        <tr
                          key={tariff.id}
                          className="border-b border-accent/10 hover:bg-[#0a0e14] transition-colors"
                        >
                          <td className="py-3 px-4 text-white">
                            {monthNames[tariff.month - 1]} ({tariff.month})
                          </td>
                          <td className="py-3 px-4 text-white">
                            {tariff.pricePerKmUnder1000} ₽/км
                          </td>
                          <td className="py-3 px-4 text-white">
                            {tariff.pricePerKmOver1000} ₽/км
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => openEditModal(tariff)}
                              className="px-3 py-1 border border-accent/50 rounded text-accent hover:bg-accent/10 transition-colors text-sm"
                            >
                              Редактировать
                            </button>
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

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-[#1a1f2e] to-[#151b26] border border-[rgba(43,79,125,0.3)] rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-white">
              {editingTariff ? "Редактировать тариф" : "Добавить тариф"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white mb-2">Месяц</label>
                <select
                  value={formData.month}
                  onChange={(e) =>
                    setFormData({ ...formData, month: Number(e.target.value) })
                  }
                  className="w-full h-[45px] bg-[#0a0e14] border border-[rgba(43,79,125,0.5)] rounded-lg px-3 text-white focus:outline-none focus:border-accent/50"
                  disabled={!!editingTariff}
                >
                  {monthNames.map((name, index) => (
                    <option key={index + 1} value={index + 1}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white mb-2">
                  Цена за км (расстояние ≤1000 км)
                </label>
                <input
                  type="number"
                  value={formData.pricePerKmUnder1000}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pricePerKmUnder1000: Number(e.target.value),
                    })
                  }
                  className="w-full h-[45px] bg-[#0a0e14] border border-[rgba(43,79,125,0.5)] rounded-lg px-3 text-white focus:outline-none focus:border-accent/50"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                  <label className="block text-sm text-white mb-2">
                    Цена за км (расстояние &gt;1000 км)
                  </label>
                <input
                  type="number"
                  value={formData.pricePerKmOver1000}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pricePerKmOver1000: Number(e.target.value),
                    })
                  }
                  className="w-full h-[45px] bg-[#0a0e14] border border-[rgba(43,79,125,0.5)] rounded-lg px-3 text-white focus:outline-none focus:border-accent/50"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingTariff(null);
                    setFormData({
                      month: 1,
                      pricePerKmUnder1000: 150,
                      pricePerKmOver1000: 100,
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-accent/50 rounded-lg text-accent hover:bg-accent/10 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={editingTariff ? handleUpdate : handleCreate}
                  className="flex-1 px-4 py-2 bg-accent hover:bg-accent/90 text-[#0a0e14] font-medium rounded-lg transition-colors"
                >
                  {editingTariff ? "Сохранить" : "Создать"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminTariffsPage;

