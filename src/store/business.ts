import { ArticleType } from '@/network/api/api-params-moudle';
import { DataNode } from 'antd/es/tree';
import { create } from 'zustand';

interface Business {
  typeList: (ArticleType | DataNode)[];
  setTypeList: (typeList: (ArticleType | DataNode)[]) => void;
}
export const useBusinessStore = create<Business>((set) => ({
  typeList: [],
  setTypeList: (typeList: (ArticleType | DataNode)[]) => set(() => ({ typeList }))
}));
