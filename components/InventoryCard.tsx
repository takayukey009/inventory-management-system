import { useInventoryStore } from '@/stores/inventory';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ArrowDown, ArrowUp, Minus, Plus } from 'lucide-react';

interface InventoryCardProps {
  item: InventoryItem;
}

export const InventoryCard = ({ item }: InventoryCardProps) => {
  const { updateStock } = useInventoryStore();

  const getStockLevel = (percentage: number) => {
    if (percentage <= 30) return 'low';
    if (percentage <= 50) return 'medium';
    return 'high';
  };

  const stockPercentage = (item.currentStock / item.maxStock) * 100;
  const stockLevel = getStockLevel(stockPercentage);

  return (
    <div className="inventory-card">
      {/* ヘッダー */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">
            {item.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {item.category}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`text-2xl font-bold ${
            stockLevel === 'low' 
              ? 'text-red-500 dark:text-red-400'
              : stockLevel === 'medium'
              ? 'text-[--accent]'
              : 'text-[--primary]'
          }`}>
            {Math.round(stockPercentage)}%
          </div>
        </div>
      </div>

      {/* 在庫バー */}
      <div className="mb-8">
        <div className="stock-bar">
          <div
            className={`stock-bar-fill ${stockLevel}`}
            style={{ width: `${stockPercentage}%` }}
          />
        </div>
      </div>

      {/* 在庫情報 */}
      <div className="mb-8 grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            現在の在庫
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {item.currentStock}
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
              / {item.maxStock}
            </span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            今月の消費
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {item.monthlyConsumption}
          </p>
        </div>
      </div>

      {/* コントロール */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => updateStock(item.id, -5)}
          className="control-button"
        >
          <ArrowDown className="h-4 w-4" />
          <span>-5</span>
        </button>
        <button
          onClick={() => updateStock(item.id, -1)}
          className="control-button"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          onClick={() => updateStock(item.id, 1)}
          className="control-button"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          onClick={() => updateStock(item.id, 5)}
          className="control-button"
        >
          <ArrowUp className="h-4 w-4" />
          <span>+5</span>
        </button>
      </div>

      {/* 最終更新 */}
      <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
        最終更新: {format(new Date(item.lastUpdated), 'M月d日 HH:mm', { locale: ja })}
      </p>
    </div>
  );
};
