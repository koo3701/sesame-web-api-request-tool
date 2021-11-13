import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const isBufferEncoding = (str: unknown): str is BufferEncoding =>
  str !== null &&
  typeof str === 'string' &&
  [
    'ascii',
    'utf8',
    'utf-8',
    'utf16le',
    'ucs2',
    'ucs-2',
    'base64',
    'base64url',
    'latin1',
    'binary',
    'hex',
  ].includes(str);

export const encrypt = (raw: string) => {
  if (
    typeof process.env.BUFFER_KEY !== 'string' ||
    typeof process.env.ENCRYPTION_KEY !== 'string' ||
    typeof process.env.BUFFER_KEY !== 'string' ||
    typeof process.env.ENCRYPT_METHOD !== 'string' ||
    !isBufferEncoding(process.env.ENCRYPT_ENCODING)
  )
    return null;
  const iv = Buffer.from(process.env.BUFFER_KEY);
  const cipher = crypto.createCipheriv(
    process.env.ENCRYPT_METHOD,
    Buffer.from(process.env.ENCRYPTION_KEY),
    iv
  );
  const encrypted = Buffer.concat([cipher.update(raw), cipher.final()]);

  return encrypted.toString(process.env.ENCRYPT_ENCODING);
};

export const decrypt = (encrypted: string) => {
  if (
    typeof process.env.BUFFER_KEY !== 'string' ||
    typeof process.env.ENCRYPTION_KEY !== 'string' ||
    typeof process.env.BUFFER_KEY !== 'string' ||
    typeof process.env.ENCRYPT_METHOD !== 'string' ||
    !isBufferEncoding(process.env.ENCRYPT_ENCODING)
  )
    return null;
  const iv = Buffer.from(process.env.BUFFER_KEY);
  const encryptedText = Buffer.from(encrypted, process.env.ENCRYPT_ENCODING);
  const decipher = crypto.createDecipheriv(
    process.env.ENCRYPT_METHOD,
    Buffer.from(process.env.ENCRYPTION_KEY),
    iv
  );
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decrypted.toString();
};
