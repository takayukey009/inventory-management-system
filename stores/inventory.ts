import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InventoryItem, StockUpdateType } from '@/types/inventory';

interface InventoryState {
  items: InventoryItem[];
  updateStock: (id: string, change: StockUpdateType) => void;
  setRecommendedStock: (id: string, amount: number) => void;
  resetMonthlyConsumption: () => void;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  recommendedStock: number;
  unit: string;
  lastUpdated: Date;
  monthlyConsumption: number;
  lastMonthReset: Date;
}

const initialItems: InventoryItem[] = [
  {
    id: "1",
    name: "キャノーラ油",
    category: "調味料",
    currentStock: 2,
    recommendedStock: 5,
    unit: "本",
    lastUpdated: new Date(),
    monthlyConsumption: 0,
    lastMonthReset: new Date(),
  },
  {
    id: "2",
    name: "えのき",
    category: "野菜",
    currentStock: 3,
    recommendedStock: 5,
    unit: "袋",
    lastUpdated: new Date(),
    monthlyConsumption: 0,
    lastMonthReset: new Date(),
  },
  {
    id: "3",
    name: "卵（10個入り）",
    category: "卵・乳製品",
    currentStock: 4,
    recommendedStock: 6,
    unit: "パック",
    lastUpdated: new Date(),
    monthlyConsumption: 0,
    lastMonthReset: new Date(),
  },
];

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set) => ({
      items: initialItems,
      
      updateStock: (id, change) => 
        set((state) => ({
          items: state.items.map(item =>
            item.id === id 
              ? { 
                  ...item, 
                  currentStock: Math.max(0, item.currentStock + change),
                  lastUpdated: new Date(),
                  monthlyConsumption: change < 0 ? item.monthlyConsumption - change : item.monthlyConsumption,
                }
              : item
          )
        })),

      setRecommendedStock: (id, amount) =>
        set((state) => ({
          items: state.items.map(item =>
            item.id === id 
              ? { ...item, recommendedStock: amount }
              : item
          )
        })),

      resetMonthlyConsumption: () =>
        set((state) => ({
          items: state.items.map(item => ({
            ...item,
            monthlyConsumption: 0,
            lastMonthReset: new Date(),
          })),
        })),
    }),
    {
      name: 'inventory-storage',
    }
  )
);
