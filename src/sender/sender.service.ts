import { Inject, Injectable } from '@nestjs/common';
import { CreateSenderDto, FindAllSenderDto } from './dto/create-sender.dto';
import { UpdateSenderDto } from './dto/update-sender.dto';
import axios, { AxiosInstance } from 'axios';
import { getAuth, getAuthHeader } from 'src/common/utils/auth-header';
import * as XLSX from 'xlsx';

@Injectable()
export class SenderService {
  private readonly axiosInstance: AxiosInstance;

  constructor(
    @Inject('PHONE_NUMBER') private readonly phoneNumber: string,
  ) {
    this.axiosInstance = axios.create({
      baseURL: 'https://send.smsxabar.uz/broker-api/send',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader(),
      },
    });
  }

  generateMessageId(): string {
    return Math.floor(100000000 + Math.random() * 900000000).toString();
  }

  async sendMessage(recipient: string, text: string) {
    const body = {
      messages: [
        {
          recipient: recipient,
          'message-id': this.generateMessageId(),
          sms: {
            originator: '3700',
            content: {
              "text": text,
            },
          },
        },
      ],
    };
    console.log(JSON.stringify(body, null, 2));

    

    try {
      const response = await this.axiosInstance.post('', body);
      console.log(`SMS sent to ${recipient}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error sending to ${recipient}:`, error.message);
      return null;
    }
  }

  async create(file: Express.Multer.File, text: string) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);
    console.log(rows);
    
    const sent: { number: string }[] = [];

    const skipped: { number: string; reason: string }[] = [];

    for (const row of rows) {
      const number = row['phone']?.toString().trim() || ' ';
      console.log(number);
      

      if (!/^998([5796]\d)\d{7}$/.test(number)) {
        skipped.push({ number, reason: 'Invalid format' });
        continue;
      }
      // let text = 'test'
      const res = await this.sendMessage(number, text);
      if (res) {
        sent.push(number);
      } else {
        skipped.push({ number, reason: 'Send error' });
      }
    }

    return {
      sentCount: sent.length,
      skippedCount: skipped.length,
      sent,
      skipped,
    };
  }



  async findAll(query: FindAllSenderDto) { 
    const url = 'https://cabinet.smsxabar.uz/stats-api/detail/sms';
    const dynamicParams = { ...query };
    const finalParams = {
      ...dynamicParams,
      message_direction: 'mt',
      order_by: 'create_date',
      order_direction: 'desc'
    };
    console.log(110, finalParams);
    const token = await getAuth();
    console.log('token keldi', token);
    console.log('finalParams', finalParams);
    
    try {
      const response = await this.axiosInstance.get(url, {
        timeout: 5000,
        params: finalParams,
        headers: {
          Authorization: token,
        },
      });
    
      // To‘liq log
      // console.log(
      //   '🟢 Javob status:',
      //   response.status
      // );
      // console.log(
      //   '🟢 Javob headers:',
      //   JSON.stringify(response.headers, null, 2)
      // );
      // console.log(
      //   '🟢 Javob data:',
      //   JSON.stringify(response.data, null, 2)
      // );
      
      return response.data;
    } catch (error) {
      // console.error('🔴 GET xato:', error);
    
      // Agar error javob ham bo‘lsa, to‘liq chiqarsin:
      if (error.response) {
        // console.error(
        //   '🔴 Xatolik body:',
        //   JSON.stringify(error.response.data, null, 2)
        // );
      }
    
      throw error;
    }
    
  }
  

  findOne(id: number) {
    return `This action returns a #${id} sender`;
  }

  update(id: number, updateSenderDto: UpdateSenderDto) {
    return `This action updates a #${id} sender`;
  }

  remove(id: number) {
    return `This action removes a #${id} sender`;
  }
}
