import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
require("dotenv").config();
const MONGODB = process.env.MONGODB;
@Module({
  imports: [MongooseModule.forRoot(MONGODB), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
