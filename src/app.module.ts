// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SenderModule } from './sender/sender.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // har joyda ishlatish uchun
    }),
    SenderModule,
  ],
})
export class AppModule {}
