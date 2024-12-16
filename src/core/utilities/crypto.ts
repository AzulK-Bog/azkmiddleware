import * as crypto from 'crypto-js';

const KEY = "=|g`]W'RoVcT*hN%)S#e`sL9bSZy@L";

export const encrypt = (data: string): string => {
  return crypto.AES.encrypt(crypto.enc.Utf8.parse(data), KEY).toString();
};

export const decrypt = (encrypt: string): string => {
  return crypto.AES.decrypt(encrypt, KEY).toString(crypto.enc.Utf8);
};
