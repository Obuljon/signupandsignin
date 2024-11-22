import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { User, UserSchema } from "../models/index";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { AuthGuard } from "./middleware/authguard";
import { APP_GUARD } from "@nestjs/core";
import { LoggerMiddleware, TestMiddleware } from "./middleware";
require("dotenv").config();
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: process.env.TOKEN_KEY,
      signOptions: { expiresIn: "10800s" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        { path: "auth/authtest", method: RequestMethod.GET },
        { path: "auth/home", method: RequestMethod.GET }
      );
    consumer
      .apply(TestMiddleware)
      .forRoutes({ path: "auth/about", method: RequestMethod.GET });
  }
}
