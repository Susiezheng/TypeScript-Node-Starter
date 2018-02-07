declare module "resFormat" {
  export interface IRes {
    code?: number;
    data?: any;
    err_level?: number;
    extra?: any;
    message?: string;
    runEnv?: string;
  }
}
