import { Injectable } from "@nestjs/common";
import { TariffsService } from "../../tariffs/tariffs.service";
import {
  FIXED_ROUTES,
  DEFAULT_TARIFFS,
  INSURANCE_RATE,
  KM_PER_DAY,
} from "../../../config/constants";
import { getDistanceBetweenCities } from "../../../shared/utils/distance-api.util";

export interface CalculatePriceResult {
  distance: number;
  appliedTariff: number;
  transportPrice: number;
  insurancePrice: number;
  totalPrice: number;
  durationHours: number;
  durationDays: number;
  estimatedArrivalDate: Date;
  isFixedRoute: boolean;
}

@Injectable()
export class PriceCalculatorService {
  constructor(private tariffsService: TariffsService) {}

  async calculate(
    cityFromName: string,
    cityToName: string,
    startDate: Date
  ): Promise<CalculatePriceResult> {
    // Проверка фиксированных маршрутов
    const routeKey = `${cityFromName}-${cityToName}`;
    const fixedPrice = FIXED_ROUTES[routeKey];

    if (fixedPrice) {
      const distance = 1000; // Примерное расстояние для фиксированных маршрутов
      const insurancePrice = fixedPrice * INSURANCE_RATE;
      const totalPrice = fixedPrice + insurancePrice;
      const durationDays = Math.ceil(distance / KM_PER_DAY);
      const durationHours = durationDays * 24;
      const estimatedArrivalDate = new Date(startDate);
      estimatedArrivalDate.setDate(estimatedArrivalDate.getDate() + durationDays);

      return {
        distance,
        appliedTariff: 0,
        transportPrice: fixedPrice,
        insurancePrice,
        totalPrice,
        durationHours,
        durationDays,
        estimatedArrivalDate,
        isFixedRoute: true,
      };
    }

    // Получение расстояния
    const distance = await getDistanceBetweenCities(cityFromName, cityToName);

    // Получение тарифа для месяца
    const month = startDate.getMonth() + 1; // getMonth() возвращает 0-11
    const tariff = await this.tariffsService.findByMonth(month);

    const pricePerKm =
      distance <= 1000
        ? tariff?.pricePerKmUnder1000 || DEFAULT_TARIFFS.pricePerKmUnder1000
        : tariff?.pricePerKmOver1000 || DEFAULT_TARIFFS.pricePerKmOver1000;

    // Расчет стоимости
    const transportPrice = distance * pricePerKm;
    const insurancePrice = transportPrice * INSURANCE_RATE;
    const totalPrice = transportPrice + insurancePrice;

    // Расчет длительности
    const durationHours = Math.ceil((distance / KM_PER_DAY) * 24);
    const durationDays = Math.ceil(durationHours / 24);
    const estimatedArrivalDate = new Date(startDate);
    estimatedArrivalDate.setDate(estimatedArrivalDate.getDate() + durationDays);

    return {
      distance,
      appliedTariff: pricePerKm,
      transportPrice,
      insurancePrice,
      totalPrice,
      durationHours,
      durationDays,
      estimatedArrivalDate,
      isFixedRoute: false,
    };
  }
}

