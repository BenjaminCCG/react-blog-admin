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
