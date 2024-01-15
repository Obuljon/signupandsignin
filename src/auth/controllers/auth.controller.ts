import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { hash, compare } from "bcrypt";

import { AuthService } from "../services/auth.service";
import { SignupDTO, SigninDTO } from "src/dto";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "../middleware";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  @Post("signup")
  async signup(@Body() user: SignupDTO) {
    const { name, email, password } = user;
    const isEmail = await this.authService.findOneUserEmail(email);
    if (isEmail) throw new BadRequestException("This email is busy");
    const hashpassword = await hash(password, 10);
    const result = this.authService.addUser({
      name,
      email,
      password: hashpassword,
    });
    throw new HttpException("successful", HttpStatus.CREATED);
  }

  @Post("signin")
  async signin(@Body() user: SigninDTO) {
    const data = await this.authService.findOneUserEmail(user.email);
    if (!data) throw new BadRequestException("login or password error");

    const istrue = await compare(user.password, data["password"]);
    if (istrue) {
      const payload = { sub: data["id"], username: data["name"] };
      const token = {
        access_token: await this.jwtService.signAsync(payload),
      };
      throw new HttpException(token, HttpStatus.OK);
    }

    throw new BadRequestException("login or password error");
  }

  @UseGuards(AuthGuard)
  @Get("/authtest")
  authtest() {
    return true;
  }

  @UseGuards(AuthGuard)
  @Get("/home")
  getHome(@Req() req) {
    return {
      user: req.user,
      data: [
        { name: "reactjs", what: "library" },
        { name: "angular", what: "framework" },
        { name: "vuejs", what: "framework" },
      ],
    };
  }
}
