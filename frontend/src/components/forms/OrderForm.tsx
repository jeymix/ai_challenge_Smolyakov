import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { citiesService, City } from "../../services/cities.service";

const orderSchema = z
  .object({
    carBrand: z.string().min(1, "Укажите марку автомобиля"),
    carModel: z.string().min(1, "Укажите модель автомобиля"),
    cityFromId: z.string().uuid("Выберите город отправления"),
    cityToId: z.string().uuid("Выберите город назначения"),
    startDate: z
      .string()
      .min(1, "Выберите дату начала перевозки")
      .refine(
        (date) => {
          const selectedDate = new Date(date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return selectedDate >= today;
        },
        {
          message: "Дата не может быть в прошлом",
        }
      ),
  })
  .refine((data) => data.cityFromId !== data.cityToId, {
    message: "Города отправления и назначения должны быть разными",
    path: ["cityToId"],
  });

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  onSubmit: (data: OrderFormData) => void;
  isLoading?: boolean;
}

const OrderForm = ({ onSubmit, isLoading = false }: OrderFormProps) => {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [carBrands] = useState([
    "BMW",
    "Mercedes-Benz",
    "Audi",
    "Lexus",
    "Porsche",
    "Tesla",
    "Jaguar",
    "Land Rover",
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  });

  const cityFromId = watch("cityFromId");
  const cityToId = watch("cityToId");

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await citiesService.getAll();
        setCities(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке городов:", error);
      } finally {
        setIsLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Марка автомобиля */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1 text-sm text-white">
          Марка автомобиля
          <span className="text-accent">*</span>
        </label>
        <input
          type="text"
          list="car-brands"
          {...register("carBrand")}
          placeholder="Начните вводить марку..."
          className="h-[45px] bg-[#0a0e14] border border-[rgba(43,79,125,0.5)] rounded-lg px-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent/50 transition-colors"
        />
        <datalist id="car-brands">
          {carBrands.map((brand) => (
            <option key={brand} value={brand} />
          ))}
        </datalist>
        {errors.carBrand && (
          <p className="text-sm text-red-400">{errors.carBrand.message}</p>
        )}
      </div>

      {/* Модель автомобиля */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1 text-sm text-white">
          Модель автомобиля
          <span className="text-accent">*</span>
        </label>
        <input
          type="text"
          {...register("carModel")}
          placeholder="X5, E-Class, A6 и т.д."
          className="h-[45px] bg-[#0a0e14] border border-[rgba(43,79,125,0.5)] rounded-lg px-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent/50 transition-colors"
        />
        {errors.carModel && (
          <p className="text-sm text-red-400">{errors.carModel.message}</p>
        )}
      </div>

      {/* Город отправления */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1 text-sm text-white">
          Город отправления
          <span className="text-accent">*</span>
        </label>
        <select
          {...register("cityFromId")}
          className="h-[45px] bg-[#0a0e14] border border-[rgba(43,79,125,0.5)] rounded-lg px-3 text-white focus:outline-none focus:border-accent/50 transition-colors"
        >
          <option value="">Выберите город</option>
          {isLoadingCities ? (
            <option disabled>Загрузка...</option>
          ) : (
            cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))
          )}
        </select>
        {errors.cityFromId && (
          <p className="text-sm text-red-400">{errors.cityFromId.message}</p>
        )}
      </div>

      {/* Город назначения */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1 text-sm text-white">
          Город назначения
          <span className="text-accent">*</span>
        </label>
        <select
          {...register("cityToId")}
          className="h-[45px] bg-[#0a0e14] border border-[rgba(43,79,125,0.5)] rounded-lg px-3 text-white focus:outline-none focus:border-accent/50 transition-colors"
        >
          <option value="">Выберите город</option>
          {isLoadingCities ? (
            <option disabled>Загрузка...</option>
          ) : (
            cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))
          )}
        </select>
        {errors.cityToId && (
          <p className="text-sm text-red-400">{errors.cityToId.message}</p>
        )}
      </div>

      {/* Дата начала перевозки */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1 text-sm text-white">
          Дата начала перевозки
          <span className="text-accent">*</span>
        </label>
        <input
          type="date"
          {...register("startDate")}
          min={getMinDate()}
          className="h-[45px] bg-[#0a0e14] border border-[rgba(43,79,125,0.5)] rounded-lg px-3 text-white focus:outline-none focus:border-accent/50 transition-colors"
        />
        {errors.startDate && (
          <p className="text-sm text-red-400">{errors.startDate.message}</p>
        )}
      </div>

      {/* Кнопка отправки */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 bg-accent hover:bg-accent/90 text-[#0a0e14] font-medium py-3 px-5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Расчет..." : "Рассчитать стоимость"}
      </button>
    </form>
  );
};

export default OrderForm;

