import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ADMIN_CREDENTIALS } from "../../config/constants";

@Injectable()
export class AuthService {
  async validateAdmin(login: string, password: string): Promise<boolean> {
    const isValidLogin = login === ADMIN_CREDENTIALS.login;
    const isValidPassword = password === ADMIN_CREDENTIALS.password;

    return isValidLogin && isValidPassword;
  }

  async login(login: string, password: string): Promise<{ token: string }> {
    const isValid = await this.validateAdmin(login, password);
    if (!isValid) {
      throw new UnauthorizedException("Неверный логин или пароль");
    }

    // Простой токен (в продакшене использовать JWT)
    const token = Buffer.from(`${login}:${password}`).toString("base64");
    return { token };
  }
}

