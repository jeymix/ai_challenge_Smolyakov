import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, "Укажите ФИО")
    .min(3, "ФИО должно содержать минимум 3 символа"),
  phone: z
    .string()
    .min(1, "Укажите номер телефона")
    .refine(
      (phone) => {
        const numbers = phone.replace(/\D/g, "");
        return numbers.length >= 10 && numbers.length <= 11;
      },
      {
        message: "Некорректный формат телефона",
      }
    ),
});

// Функция для форматирования телефона
const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length === 0) return "";
  if (numbers.length <= 1) return `+${numbers}`;
  if (numbers.length <= 4) return `+${numbers.slice(0, 1)} (${numbers.slice(1)}`;
  if (numbers.length <= 7)
    return `+${numbers.slice(0, 1)} (${numbers.slice(1, 4)}) ${numbers.slice(4)}`;
  return `+${numbers.slice(0, 1)} (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`;
};

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading?: boolean;
  onLoginClick?: () => void;
}

const RegisterForm = ({
  onSubmit,
  isLoading = false,
  onLoginClick,
}: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const phoneValue = watch("phone");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue("phone", formatted, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Поле ФИО */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1 text-sm text-white">
          ФИО
          <span className="text-accent">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5">
            <svg
              className="w-full h-full text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <input
            type="text"
            {...register("fullName")}
            placeholder="Иванов Иван Иванович"
            className="h-[45px] w-full bg-[#0a0e14] border border-[rgba(43,79,125,0.5)] rounded-lg pl-12 pr-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>
        {errors.fullName && (
          <p className="text-sm text-red-400">{errors.fullName.message}</p>
        )}
      </div>

      {/* Поле телефона */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1 text-sm text-white">
          Телефон
          <span className="text-accent">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5">
            <svg
              className="w-full h-full text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <input
            type="tel"
            {...register("phone")}
            onChange={handlePhoneChange}
            value={phoneValue || ""}
            placeholder="+7 (999) 123-45-67"
            className="h-[45px] w-full bg-[#0a0e14] border border-[rgba(43,79,125,0.5)] rounded-lg pl-12 pr-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>
        {errors.phone && (
          <p className="text-sm text-red-400">{errors.phone.message}</p>
        )}
      </div>

      {/* Кнопка регистрации */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 bg-accent hover:bg-accent/90 text-[#0a0e14] font-medium py-3 px-5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Регистрация..." : "Зарегистрироваться"}
      </button>

      {/* Ссылка на вход */}
      {onLoginClick && (
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onLoginClick}
            className="text-sm text-accent hover:text-accent/80 transition-colors"
          >
            Уже есть аккаунт? Войдите
          </button>
        </div>
      )}
    </form>
  );
};

export default RegisterForm;

