import { request } from '@/network/axios';
import { getCanvasData, Article, PageListReq, ArticleType } from './api-params-moudle';
import { GetCityTotal, PageListRes } from './api-res-model';

/** 这里枚举定义所有接口 */
enum APIS {
  GET_CITY_TOTAL_NUMBER = '/xxxx/xxxx/xxxxx',
  QUERY_ARTICLE_PAGE = '/article/page'
}

/** 一个示例 */
export const getCityTotalNumber = (params: getCanvasData) =>
  request.get<GetCityTotal>(APIS.GET_CITY_TOTAL_NUMBER, params);

export const queryArticlePage = (data: Article & PageListReq) =>
  request.post<PageListRes<Article>>('/article/page', data);

export const saveArticle = (data: Article) => request.post('/article/save', data);

export const deleteArticle = (id: number) => request.post(`/article/delete/${id}`);

export const updateArticle = (data: Article) => request.post('/article/update', data);

export const fileUpload = (data: FormData) => request.post('/file/upload', data);

export const queryTypeList = (data: ArticleType) => request.post<ArticleType[]>('/articleType/list', data);

export const saveType = (data: ArticleType) => request.post('/articleType/save', data);

export const deleteType = (id: number) => request.post(`/articleType/delete/${id}`);

export const updateType = (data: ArticleType) => request.post('/articleType/update', data);

export const queryLifePage = (data: Article & PageListReq) => request.post<PageListRes<Article>>('/life/page', data);

export const saveLife = (data: Article) => request.post('/life/save', data);

export const deleteLife = (id: number) => request.post(`/life/delete/${id}`);

export const updateLife = (data: Article) => request.post('/life/update', data);
