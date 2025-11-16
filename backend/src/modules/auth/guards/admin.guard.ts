import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ADMIN_CREDENTIALS } from "../../../config/constants";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("Требуется авторизация");
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [login, password] = decoded.split(":");

    if (
      login === ADMIN_CREDENTIALS.login &&
      password === ADMIN_CREDENTIALS.password
    ) {
      return true;
    }

    throw new UnauthorizedException("Неверные учетные данные");
  }
}

