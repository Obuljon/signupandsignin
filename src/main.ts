require("dotenv").config()
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { Logger, ValidationPipe } from "@nestjs/common"
async function bootstrap() {
    const PORT = process.env.PORT
    const logger: Logger = new Logger("Server")

    const app = await NestFactory.create(AppModule)
    app.enableCors({
        origin: process.env.CLENT_URL,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    })
    app.useGlobalPipes(new ValidationPipe())
    await app.listen(PORT, () =>
        logger.log(`Running on port:${PORT}`),
    )
}
bootstrap()
