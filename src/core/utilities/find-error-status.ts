import { HttpError } from '../models/http-error';

const httpErrors: HttpError[] = [
  { status: 400, message: 'Se ha presentado un error' },
  { status: 500, message: 'Estamos presentando problemas. Intente más tarde' },
];

export const findErrorByStatus = (status: number): string => {
  const httpError = httpErrors.find((http) => http.status === status);
  const defaultStatusCode = 400;
  if (!!httpError) return httpError.message;
  else httpErrors.find((http) => http.status === defaultStatusCode).message;
};
