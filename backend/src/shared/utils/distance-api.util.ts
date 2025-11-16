import axios from "axios";
import { FIXED_ROUTES } from "../../config/constants";

// Офлайн матрица расстояний для популярных маршрутов
const DISTANCE_MATRIX: Record<string, number> = {
  "Москва-Сочи": 1600,
  "Сочи-Москва": 1600,
  "Бишкек-Москва": 3500,
  "Москва-Бишкек": 3500,
  "Москва-Санкт-Петербург": 700,
  "Санкт-Петербург-Москва": 700,
  "Екатеринбург-Москва": 1800,
  "Москва-Екатеринбург": 1800,
};

export async function getDistanceBetweenCities(
  cityFrom: string,
  cityTo: string
): Promise<number> {
  // Проверяем фиксированные маршруты
  const routeKey = `${cityFrom}-${cityTo}`;
  if (FIXED_ROUTES[routeKey]) {
    // Для фиксированных маршрутов возвращаем примерное расстояние
    return DISTANCE_MATRIX[routeKey] || 1000;
  }

  // Проверяем офлайн матрицу
  if (DISTANCE_MATRIX[routeKey]) {
    return DISTANCE_MATRIX[routeKey];
  }

  // Если есть API ключ, используем OpenRouteService
  const apiKey = process.env.DISTANCE_API_KEY;
  if (apiKey) {
    try {
      const response = await axios.get(
        `${process.env.DISTANCE_API_URL}/directions/driving-car`,
        {
          params: {
            api_key: apiKey,
            start: `${cityFrom}, Россия`,
            end: `${cityTo}, Россия`,
          },
        }
      );

      if (response.data?.features?.[0]?.properties?.segments?.[0]?.distance) {
        const distanceMeters =
          response.data.features[0].properties.segments[0].distance;
        return Math.round(distanceMeters / 1000); // Конвертируем в км
      }
    } catch (error) {
      console.error("Ошибка при получении расстояния из API:", error);
    }
  }

  // Fallback: возвращаем среднее расстояние
  return 1000;
}

