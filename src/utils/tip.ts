import { IRes } from "resFormat";

export class ResFormat {
  private _res: IRes;
  constructor() {
    this._res = {
      code: -1,
      data: "",
      err_level: -1,
      extra: "",
      message: ""
    };
  }

  public succeed(resInfo: IRes = {}): IRes {
    this._res = {
      code: 0,
      data: "",
      err_level: 0,
      extra: "",
      message: "操作成功"
    };
    Object.assign(this._res, resInfo);
    return this._res;
  }
  public failLevel0(resInfo: IRes = {}): IRes {
    this._res = {
      code: 1,
      data: "",
      err_level: 0,
      extra: "",
      message: "操作失败, 错误等级: 0"
    };
    Object.assign(this._res, resInfo);
    return this._res;
  }
}
