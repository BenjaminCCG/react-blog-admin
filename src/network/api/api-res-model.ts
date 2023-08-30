export interface resBaseInfo<DataModel> {
  rsCode: string;
  rsCause: string;
  data: DataModel;
}

/** 一个示例 表示返回 */
export interface GetCityTotalNumberModel {
  city: string;
  peoplesOfLogin: number;
}

export type GetCityTotal = GetCityTotalNumberModel[];

export interface PageListRes<T> {
  current?: number;
  size?: number;
  total?: number;
  records?: T[];
}


export interface UserInfo {
  id: number;
  username: string;
  password: string;
  avatar: string;
}