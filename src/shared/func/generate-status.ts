import { ttStatus, ttStatusResponse } from '../models/ttStatus.model';

const generateStatus = ({
  code = 200,
  status = 'OK',
  type = 'success',
  data = [],
}: ttStatus): ttStatusResponse => {
  const rtStatus: ttStatus = {
    code,
    status,
    type,
    data,
  };
  return { response: { data: data, status: rtStatus } };
};

export default generateStatus;
