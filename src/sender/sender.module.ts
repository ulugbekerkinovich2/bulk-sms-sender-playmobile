// sender.module.ts

import { Module } from '@nestjs/common';
import { SenderService } from './sender.service';
import { SenderController } from './sender.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [SenderController],
  providers: [
    {
      provide: 'PHONE_NUMBER',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get<string>('PHONE_NUMBER'),
    },
    SenderService,
  ],
})
export class SenderModule {}
