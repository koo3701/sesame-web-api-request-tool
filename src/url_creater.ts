import * as readline from 'readline';
import { encrypt } from './crypto';
import { SesameParamType } from './types';
import { Buffer } from 'buffer';

const main = async () => {
  const hostname = await prompt('input your hostname:');

  const apiKey = await prompt('input your API Key:');

  let a = '';
  do {
    a = await prompt('input action (unlock, lock, toggle):');
  } while (a in ['unlock', 'lock', 'toggle']);
  const action: 'unlock' | 'lock' | 'toggle' = a as
    | 'unlock'
    | 'lock'
    | 'toggle';

  const keys: { uuid: string; secret: string }[] = [];
  let continueFlg = false;
  do {
    const uuid = await prompt('uuid:');
    const qr = await prompt('qr code info:');

    const sk = new URL(qr).searchParams.get('sk');
    if (sk === null) throw new Error('can not get secret');
    const skDecoded = Buffer.from(sk, 'base64');
    const secret = skDecoded.slice(1, 17).toString('hex');

    keys.push({
      uuid,
      secret,
    });

    const yn = await prompt('add other key? y/N');
    continueFlg = yn.toUpperCase() in ['Y', 'YES'];
  } while (continueFlg);

  const result: SesameParamType = {
    apiKey,
    action,
    keys,
  };

  console.log(result);

  console.log(`https://${hostname}/?p=${encrypt(JSON.stringify(result)) ?? 'INVALID'}`);
};

const prompt = async (msg: string, promptChar = '> '): Promise<string> => {
  console.log(msg);
  const answer = await question(promptChar);
  return answer.trim();
};

const question = (question: string): Promise<string> => {
  const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    readlineInterface.question(question, (answer) => {
      resolve(answer);
      readlineInterface.close();
    });
  });
};

main().catch((err) => console.log(err));
