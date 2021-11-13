import axios from 'axios';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */
const aesCmac = require('node-aes-cmac').aesCmac;
/* eslint-enable @typescript-eslint/no-unsafe-assignment */
/* eslint-enable @typescript-eslint/no-unsafe-member-access */
/* eslint-enable @typescript-eslint/no-var-requires */

export default class Sesame {
  private baseurl = 'https://app.candyhouse.co/api/sesame2';

  apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private command(cmd: number, uuid: string, secret: string): Promise<void> {
    const url = `${this.baseurl}/${uuid}/cmd`;
    const headers = { 'x-api-key': this.apiKey };
    const history = Buffer.from('Web API').toString('base64');
    const sign = this.generateRandomTag(secret);

    return axios.post(
      url,
      {
        cmd,
        history,
        sign,
      },
      {
        headers,
      }
    );
  }

  unlock(uuid: string, secret: string): Promise<void> {
    return this.command(83, uuid, secret);
  }

  lock(uuid: string, secret: string): Promise<void> {
    return this.command(82, uuid, secret);
  }

  toggle(uuid: string, secret: string): Promise<void> {
    return this.command(88, uuid, secret);
  }

  private generateRandomTag(secret: string): string {
    // * key:key-secret_hex to data
    const key = Buffer.from(secret, 'hex');

    // message
    // 1. timestamp  (SECONDS SINCE JAN 01 1970. (UTC))  // 1621854456905
    // 2. timestamp to uint32  (little endian)   //f888ab60
    // 3. remove most-significant byte    //0x88ab60
    const date = Math.floor(Date.now() / 1000);
    const dateDate = Buffer.allocUnsafe(4);
    dateDate.writeUInt32LE(date);
    const message = Buffer.from(dateDate.slice(1, 4));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return aesCmac(key, message) as string;
  }
}
