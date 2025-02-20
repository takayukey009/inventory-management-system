export interface InventoryItem {
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
