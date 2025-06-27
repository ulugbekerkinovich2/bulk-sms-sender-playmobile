import axios from 'axios';
import { TokenKind } from '../../../node_modules/@microsoft/tsdoc/lib/parser/Token';
export function getAuthHeader(): string {
    const key = process.env.AUTH_KEY;
    if (!key) {
      throw new Error('AUTH_KEY env o‘rnatilmagan!');
    }
    return `Basic ${key}`;
  }


export async function getAuth(){
  const url = "https://cabinet.smsxabar.uz/lk-api/user/auth";

  const body = {
    password: `${process.env.PASS}`,
    username: `${process.env.LOGIN}`,
  };

  try {
    const response = await axios.post(url, body); // ✅ AWAIT shart!

    // console.log('Yuborilgan body:', JSON.stringify(body, null, 2));
    // console.log('Javob:', JSON.stringify(response.data, null, 2));
    console.log("Status", response.status);
    

    return response.data.token || null; // ✅ endi undefined bo‘lmaydi
  } catch (error) {
    console.error('Xatolik:', error.message);
    throw error;
  }
}
