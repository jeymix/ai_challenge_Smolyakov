import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AdminLoginDto } from "./dto/admin-login.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("admin/login")
  @ApiOperation({ summary: "Вход в админ-панель" })
  async adminLogin(@Body() adminLoginDto: AdminLoginDto) {
    return this.authService.login(adminLoginDto.login, adminLoginDto.password);
  }
}

