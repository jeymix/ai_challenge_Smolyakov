import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { formatPrice } from "../../utils/formatPrice";

const HomePage = () => {
  const advantages = [
    {
      icon: "🛡️",
      title: "Закрытые автовозы",
      description: "Полная защита автомобиля от погодных условий и дорожной пыли",
    },
    {
      icon: "🔒",
      title: "Безопасность",
      description: "Страхование каждого автомобиля на полную стоимость",
    },
    {
      icon: "⏰",
      title: "Точность",
      description: "Доставка строго в согласованные сроки",
    },
    {
      icon: "✅",
      title: "Качество",
      description: "Профессиональные водители с многолетним опытом",
    },
  ];

  const popularRoutes = [
    { from: "Бишкек", to: "Москва", price: 350000, days: "5-7" },
    { from: "Москва", to: "Сочи", price: 200000, days: "2-3" },
    { from: "Москва", to: "Санкт-Петербург", price: 150000, days: "1-2" },
    { from: "Екатеринбург", to: "Москва", price: 180000, days: "3-4" },
  ];

  return (
    <div className="relative min-h-screen">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 px-12">
          <div className="container mx-auto max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/30 rounded-full mb-6">
              <span className="text-accent text-sm">⭐</span>
              <span className="text-accent text-sm">Премиум сервис перевозки</span>
            </div>

            <h1 className="text-5xl font-bold leading-tight mb-6 bg-gradient-to-b from-white to-accent bg-clip-text text-transparent">
              Перевозка премиальных автомобилей
            </h1>

            <p className="text-gray-400 text-lg mb-8 max-w-2xl">
              Доверьте транспортировку вашего автомобиля профессионалам. Безопасность,
              надежность и комфорт на каждом километре пути.
            </p>

            <div className="flex gap-5">
              <Link
                to="/order"
                className="px-5 py-2 bg-gradient-to-b from-[#e8c968] to-accent rounded-lg text-[#0a0e14] font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Заказать перевозку
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="#routes"
                className="px-5 py-2 border-2 border-accent/50 rounded-lg text-white hover:bg-accent/10 transition-colors"
              >
                Популярные маршруты
              </Link>
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="py-16 px-12">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-2 bg-gradient-to-b from-white to-[#e8c968] bg-clip-text text-transparent">
                Наши преимущества
              </h2>
              <div className="w-24 h-1 bg-gradient-to-b from-transparent via-accent to-transparent mx-auto" />
            </div>

            <div className="grid grid-cols-4 gap-6">
              {advantages.map((advantage, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-b from-[#1a1f2e] to-[#151b26] border border-[rgba(43,79,125,0.3)] rounded-2xl p-6"
                >
                  <div className="w-12 h-12 bg-gradient-to-b from-accent to-[#c09a2a] rounded-lg flex items-center justify-center mb-4 text-2xl">
                    {advantage.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    {advantage.title}
                  </h3>
                  <p className="text-gray-400 leading-6">{advantage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Routes Section */}
        <section id="routes" className="py-16 px-12">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-2 bg-gradient-to-b from-white to-[#e8c968] bg-clip-text text-transparent">
                Популярные маршруты
              </h2>
              <div className="w-24 h-1 bg-gradient-to-b from-transparent via-accent to-transparent mx-auto" />
            </div>

            <div className="grid grid-cols-4 gap-6 mb-8">
              {popularRoutes.map((route, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-b from-[#1a1f2e] to-[#151b26] border border-[rgba(43,79,125,0.3)] rounded-2xl p-6"
                >
                  <div className="mb-4">
                    <p className="text-accent text-base mb-2">{route.from}</p>
                    <div className="flex items-center gap-2 my-2">
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-accent to-transparent" />
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <div className="flex-1 h-0.5 bg-gradient-to-l from-accent to-transparent" />
                    </div>
                    <p className="text-accent text-base">{route.to}</p>
                  </div>

                  <div className="border-t border-accent/20 pt-4">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl text-white font-normal">
                        {formatPrice(route.price)}
                      </span>
                      <span className="text-gray-400 text-sm">₽</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{route.days} дней</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/order"
                className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-b from-accent to-[#c09a2a] rounded-lg text-[#0a0e14] font-medium hover:opacity-90 transition-opacity"
              >
                Рассчитать свой маршрут
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;

