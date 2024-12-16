export interface ttStatus {
  code?: number | string;
  status?: any;
  type?: string;
  data?: any;
}

export interface ttStatusResponse {
  response?: ttStatus;
}

export interface ttStatusResponseModed {
  userKey: string;
  genStatus: ttStatusResponse;
}
