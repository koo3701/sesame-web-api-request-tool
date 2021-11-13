import express, { Response } from 'express';

import { decrypt } from './crypto';
import { isSesameParamType } from './types';

import Sesame from './sesame';

const port = 3002;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const ret400 = (res: Response) => {
  console.log('400 BadRequest');
  res.statusCode = 400;
  return res.end();
};

const ret200 = (res: Response) => {
  console.log('200 Success');
  res.statusCode = 200;
  return res.end();
};

const ret500 = (res: Response) => {
  console.log('500 InternalServerError');
  res.statusCode = 500;
  return res.end();
};

app.get('/', (req, res) => {
  const param = req.query.p as string | undefined;
  if (param === undefined) return ret400(res);

  const decrypted = decrypt(param);

  if (decrypted === null) return ret400(res);

  const sesameParam = JSON.parse(decrypted) as unknown;

  if (!isSesameParamType(sesameParam)) return ret400(res);

  const sesame = new Sesame(sesameParam.apiKey);

  Promise.all(
    sesameParam.keys.map((key) =>
      sesame[sesameParam.action](key.uuid, key.secret)
    )
  )
    .then(() => ret200(res))
    .catch((error) => {
      console.log(error);
      return ret500(res);
    });
});

app.listen(port, () => console.log(`listening port on ${port}`));
