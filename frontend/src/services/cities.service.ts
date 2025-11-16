import api from "./api";

export interface City {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const citiesService = {
  getAll: () => api.get<City[]>("/cities"),
};

