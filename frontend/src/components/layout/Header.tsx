import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);
  };

  useEffect(() => {
    // Проверяем наличие пользователя в localStorage при монтировании
    checkAuth();

    // Обработчик для событий storage (из других вкладок)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        checkAuth();
      }
    };

    // Обработчик для кастомного события (из той же вкладки)
    const handleAuthChange = () => {
      checkAuth();
    };

    // Слушаем изменения localStorage (для обновления из других вкладок)
    window.addEventListener("storage", handleStorageChange);
    
    // Слушаем кастомное событие для обновления из той же вкладки
    window.addEventListener("authChange", handleAuthChange);

    // Также проверяем при изменении маршрута
    checkAuth();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    // Отправляем событие для обновления Header
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  return (
    <header className="absolute top-0 left-0 w-full h-20 border-t border-b border-accent/20 bg-gradient-to-b from-[#0a0e14] via-[#151b26] to-[#0a0e14]">
      <div className="container mx-auto px-12 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 bg-gradient-to-b from-accent to-[#c09a2a] rounded-lg blur-md opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-b from-accent to-[#c09a2a] rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-[#0a0e14]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-normal leading-8 bg-gradient-to-b from-white to-accent bg-clip-text text-transparent">
              КИБЕРТРАКС
            </h1>
            <p className="text-xs text-accent uppercase tracking-wider">
              Premium Transport
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-8">
          <Link
            to="/"
            className="text-base text-gray-400 hover:text-white transition-colors"
          >
            Главная
          </Link>
          <Link
            to="/order"
            className="text-base text-gray-400 hover:text-white transition-colors"
          >
            Заказать
          </Link>
          {isAuthenticated && (
            <Link
              to="/profile"
              className="text-base text-gray-400 hover:text-white transition-colors"
            >
              Личный кабинет
            </Link>
          )}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-5 py-1 border border-accent/50 rounded-lg text-accent hover:bg-accent/10 transition-colors"
            >
              Выйти
            </button>
          ) : (
            <Link
              to="/login"
              className="px-5 py-1 border border-accent/50 rounded-lg text-accent hover:bg-accent/10 transition-colors"
            >
              Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

