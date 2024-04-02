import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  configService.get<string>('google.clientId');
  configService.get<string>('google.clientSecret');
  configService.get<string>('google.callbackUrl');
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
