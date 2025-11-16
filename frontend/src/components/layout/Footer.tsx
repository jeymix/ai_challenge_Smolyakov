const Footer = () => {
  return (
    <footer className="border-t border-accent/20 bg-gradient-to-b from-[#0a0e14] via-[#151b26] to-[#0a0e14] py-12">
      <div className="container mx-auto px-12">
        <div className="grid grid-cols-3 gap-12 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-5 h-5">
                <div className="absolute inset-0 bg-gradient-to-b from-accent to-[#c09a2a] rounded-lg blur-md opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-b from-accent to-[#c09a2a] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-[#0a0e14]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-normal leading-8 bg-gradient-to-b from-white to-accent bg-clip-text text-transparent">
                  КИБЕРТРАКС
                </h2>
                <p className="text-xs text-accent uppercase tracking-wider">
                  Premium Transport
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-6">
              Перевозка премиальных автомобилей
              <br />
              с гарантией безопасности
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-4">Контакты</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+7 (800) 555-35-35</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@cybertrax.ru</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Москва, Россия</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-4">Навигация</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <a href="/" className="block hover:text-white transition-colors">Главная</a>
              <a href="/order" className="block hover:text-white transition-colors">Заказать перевозку</a>
              <a href="/profile" className="block hover:text-white transition-colors">Личный кабинет</a>
              <a href="/admin" className="block hover:text-white transition-colors">Для сотрудников</a>
            </div>
          </div>
        </div>

        <div className="border-t border-accent/20 pt-4 flex justify-between text-sm text-gray-400">
          <p>© 2025 ООО «КИБЕРТРАКС». Все права защищены.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-white transition-colors">
              Политика конфиденциальности
            </a>
            <a href="/terms" className="hover:text-white transition-colors">
              Условия использования
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

