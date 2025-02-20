import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface InventoryStore {
  items: InventoryItem[];
  updateStock: (id: string, newStock: number) => void;
  resetMonthlyConsumption: () => void;
}

const initialItems: InventoryItem[] = [
  {
    id: '1',
    name: 'キャノーラ油',
    category: '調味料',
    currentStock: 8,
    recommendedStock: 10,
    unit: 'L',
    lastUpdated: new Date(),
    monthlyConsumption: 0,
    lastMonthReset: new Date(),
  },
  {
    id: '2',
    name: 'えのき',
    category: '野菜',
    currentStock: 15,
    recommendedStock: 20,
    unit: 'パック',
    lastUpdated: new Date(),
    monthlyConsumption: 0,
    lastMonthReset: new Date(),
  },
  {
    id: '3',
    name: '卵（10個入り）',
    category: '食材',
    currentStock: 12,
    recommendedStock: 15,
    unit: 'パック',
    lastUpdated: new Date(),
    monthlyConsumption: 0,
    lastMonthReset: new Date(),
  },
];

export const useInventoryStore = create(
  persist<InventoryStore>(
    (set) => ({
      items: initialItems,
      updateStock: (id, newStock) => 
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              const consumption = Math.max(0, item.currentStock - newStock);
              return {
                ...item,
                currentStock: newStock,
                lastUpdated: new Date(),
                monthlyConsumption: item.monthlyConsumption + consumption,
              };
            }
            return item;
          }),
        })),
      resetMonthlyConsumption: () =>
        set((state) => ({
          items: state.items.map((item) => ({
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
