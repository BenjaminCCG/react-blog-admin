export interface getCanvasData {
  startTime: string;
  endTime: string;
  city: string;
}

export interface PageListReq {
  pageNum: number;
  pageSize: number;
}

export interface Article {
  id?: number;
  title?: string;
  content?: string;
  createTime?: string;
  updateTime?: string;
  cover?: string;
  intro?: string;
  typeId?: number;
}

export interface ArticleType {
  id?: number;
  name?: string;
  createTime?: string;
  updateTime?: string;
}
