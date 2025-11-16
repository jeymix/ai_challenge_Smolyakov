import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
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

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading?: boolean;
  onRegisterClick?: () => void;
}

const LoginForm = ({
  onSubmit,
  isLoading = false,
  onRegisterClick,
}: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const phoneValue = watch("phone");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue("phone", formatted, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      {/* Кнопка входа */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 bg-accent hover:bg-accent/90 text-[#0a0e14] font-medium py-3 px-5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Вход..." : "Войти"}
      </button>

      {/* Ссылка на регистрацию */}
      {onRegisterClick && (
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onRegisterClick}
            className="text-sm text-accent hover:text-accent/80 transition-colors"
          >
            Нет аккаунта? Зарегистрируйтесь
          </button>
        </div>
      )}
    </form>
  );
};

export default LoginForm;

