import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import api from "../../services/api";

interface City {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const AdminCitiesPage = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      setIsAuthenticated(true);
      fetchCities();
    } else {
      navigate("/admin");
    }
  }, [navigate]);

  const fetchCities = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await api.get("/admin/cities", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCities(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке городов:", error);
      alert("Ошибка при загрузке городов");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      alert("Введите название города");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      await api.post(
        "/admin/cities",
        { name: formData.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsModalOpen(false);
      setFormData({ name: "" });
      fetchCities();
    } catch (error: any) {
      alert(
        error.response?.data?.message || "Ошибка при создании города"
      );
    }
  };

  const handleUpdate = async () => {
    if (!editingCity || !formData.name.trim()) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      await api.put(
        `/admin/cities/${editingCity.id}`,
        { name: formData.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsModalOpen(false);
      setEditingCity(null);
      setFormData({ name: "" });
      fetchCities();
    } catch (error: any) {
      alert(error.response?.data?.message || "Ошибка при обновлении города");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот город?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      await api.delete(`/admin/cities/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCities();
    } catch (error: any) {
      alert(
        error.response?.data?.message || "Ошибка при удалении города"
      );
    }
  };

  const openCreateModal = () => {
    setEditingCity(null);
    setFormData({ name: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (city: City) => {
    setEditingCity(city);
    setFormData({ name: city.name });
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
              Управление городами
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
                + Добавить город
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-b from-[#1a1f2e] to-[#151b26] border border-[rgba(43,79,125,0.3)] rounded-2xl p-6">
            {cities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Городов пока нет</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-accent/20">
                      <th className="text-left py-3 px-4 text-gray-400">Название</th>
                      <th className="text-left py-3 px-4 text-gray-400">Создан</th>
                      <th className="text-left py-3 px-4 text-gray-400">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cities.map((city) => (
                      <tr
                        key={city.id}
                        className="border-b border-accent/10 hover:bg-[#0a0e14] transition-colors"
                      >
                        <td className="py-3 px-4 text-white">{city.name}</td>
                        <td className="py-3 px-4 text-gray-400 text-sm">
                          {new Date(city.createdAt).toLocaleDateString("ru-RU")}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(city)}
                              className="px-3 py-1 border border-accent/50 rounded text-accent hover:bg-accent/10 transition-colors text-sm"
                            >
                              Редактировать
                            </button>
                            <button
                              onClick={() => handleDelete(city.id)}
                              className="px-3 py-1 border border-red-400/50 rounded text-red-400 hover:bg-red-400/10 transition-colors text-sm"
                            >
                              Удалить
                            </button>
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

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-[#1a1f2e] to-[#151b26] border border-[rgba(43,79,125,0.3)] rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-white">
              {editingCity ? "Редактировать город" : "Добавить город"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white mb-2">Название города</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="w-full h-[45px] bg-[#0a0e14] border border-[rgba(43,79,125,0.5)] rounded-lg px-3 text-white focus:outline-none focus:border-accent/50"
                  placeholder="Москва"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingCity(null);
                    setFormData({ name: "" });
                  }}
                  className="flex-1 px-4 py-2 border border-accent/50 rounded-lg text-accent hover:bg-accent/10 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={editingCity ? handleUpdate : handleCreate}
                  className="flex-1 px-4 py-2 bg-accent hover:bg-accent/90 text-[#0a0e14] font-medium rounded-lg transition-colors"
                >
                  {editingCity ? "Сохранить" : "Создать"}
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

export default AdminCitiesPage;

