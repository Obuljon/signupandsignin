import { IsString } from "class-validator";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
require("dotenv").config();
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { access_token } = request.headers;
    if (!access_token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verify(
        request.headers.access_token,
        {
          secret: process.env.TOKEN_KEY,
        },
      );
      request["user"] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
