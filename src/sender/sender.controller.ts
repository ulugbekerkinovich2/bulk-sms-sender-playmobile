import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { SenderService } from './sender.service';
import { CreateSenderDto, FindAllSenderDto } from './dto/create-sender.dto';
import { UpdateSenderDto } from './dto/update-sender.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('sender-file')
export class SenderController {
  constructor(private readonly senderService: SenderService) {}
  
  @Post()
  @ApiBody({ type: [FindAllSenderDto] })
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body('text') text: string,
  ) {
    return this.senderService.create(file, text);
  }
  

  @Get('sms-status')
  @ApiOperation({ summary: 'Get all sms statuses' })
  @ApiQuery({ name: 'page_number', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'date_from', required: true, type: String, example: "2025-06-27T00:00:00" })
  @ApiQuery({ name: 'date_to', required: true, type: String, example: "2025-06-27T23:59:00" })
  @ApiQuery({ name: 'page_size', required: true, type: Number, example: 10 })
  findAll(@Query() query: FindAllSenderDto) {
    return this.senderService.findAll(query);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.senderService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSenderDto: UpdateSenderDto) {
  //   return this.senderService.update(+id, updateSenderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.senderService.remove(+id);
  // }
}
