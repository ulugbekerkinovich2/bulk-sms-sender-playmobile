// Optimal variant
import { IsString } from 'class-validator';
import { Express } from 'express';

export class CreateSenderDto {
//   file: Express.Multer.File;
  text: string;
}

import { IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';



export class FindAllSenderDto {
  @IsOptional()
  @IsString()
  message_direction?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page_number?: number;

  @IsOptional()
  @IsString()
  date_from?: string;

  @IsOptional()
  @IsString()
  date_to?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page_size?: number;
}

