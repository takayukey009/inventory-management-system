export interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  recommendedStock: number;
  unit: '個' | '本' | '袋' | 'パック';
  category: '調味料' | '野菜' | '卵・乳製品';
  lastUpdated: string;  // ISO文字列形式で保存
}

export type StockUpdateType = -1 | 1 | 5;
