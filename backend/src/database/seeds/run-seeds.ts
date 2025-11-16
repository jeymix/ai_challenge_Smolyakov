import { DataSource } from "typeorm";
import { dataSourceOptions } from "../../config/data-source";
import { City } from "../../modules/cities/entities/city.entity";
import { Tariff } from "../../modules/tariffs/entities/tariff.entity";

async function seed() {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  try {
    console.log("🌱 Начало заполнения начальных данных...");

    // Создаем города
    const cityRepository = dataSource.getRepository(City);
    const cities = [
      { name: "Москва" },
      { name: "Сочи" },
      { name: "Бишкек" },
      { name: "Санкт-Петербург" },
      { name: "Екатеринбург" },
      { name: "Новосибирск" },
      { name: "Казань" },
      { name: "Краснодар" },
    ];

    for (const cityData of cities) {
      const existingCity = await cityRepository.findOne({
        where: { name: cityData.name },
      });
      if (!existingCity) {
        const city = cityRepository.create(cityData);
        await cityRepository.save(city);
        console.log(`✅ Создан город: ${cityData.name}`);
      } else {
        console.log(`⏭️  Город уже существует: ${cityData.name}`);
      }
    }

    // Создаем тарифы для всех месяцев
    const tariffRepository = dataSource.getRepository(Tariff);
    const defaultTariffs = {
      pricePerKmUnder1000: 150,
      pricePerKmOver1000: 100,
    };

    for (let month = 1; month <= 12; month++) {
      const existingTariff = await tariffRepository.findOne({
        where: { month },
      });
      if (!existingTariff) {
        const tariff = tariffRepository.create({
          month,
          ...defaultTariffs,
        });
        await tariffRepository.save(tariff);
        console.log(`✅ Создан тариф для месяца: ${month}`);
      } else {
        console.log(`⏭️  Тариф для месяца ${month} уже существует`);
      }
    }

    console.log("✅ Заполнение начальных данных завершено!");
  } catch (error) {
    console.error("❌ Ошибка при заполнении данных:", error);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

seed();

