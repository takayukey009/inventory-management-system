import { useInventoryStore } from '@/stores/inventory';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ArrowDown, ArrowUp, Minus, Plus } from 'lucide-react';

interface InventoryCardProps {
  item: InventoryItem;
}

export const InventoryCard = ({ item }: InventoryCardProps) => {
  const { updateStock } = useInventoryStore();

  const getStockColor = (percentage: number) => {
    if (percentage <= 30) return 'text-red-500 dark:text-red-400';
    if (percentage <= 50) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-emerald-500 dark:text-emerald-400';
  };

  const stockPercentage = (item.currentStock / item.maxStock) * 100;
  const stockColor = getStockColor(stockPercentage);

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/50 p-6 shadow-xl shadow-black/5 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 dark:bg-gray-900/50 dark:shadow-white/5 dark:hover:shadow-white/10">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-primary/20 dark:to-accent/20" />
      
      {/* ヘッダー */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {item.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {item.category}
          </p>
        </div>
        <div className={`flex items-center gap-2 ${stockColor}`}>
          <span className="text-2xl font-bold">{Math.round(stockPercentage)}%</span>
        </div>
      </div>

      {/* 在庫バー */}
      <div className="mb-6">
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              stockPercentage <= 30
                ? 'bg-red-500'
                : stockPercentage <= 50
                ? 'bg-yellow-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${stockPercentage}%` }}
          />
        </div>
      </div>

      {/* 在庫情報 */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">現在の在庫</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
            {item.currentStock}
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">/ {item.maxStock}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">今月の消費</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
            {item.monthlyConsumption}
          </p>
        </div>
      </div>

      {/* コントロール */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => updateStock(item.id, -5)}
          className="flex items-center justify-center rounded-xl bg-gray-100 px-3 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 active:scale-95 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <ArrowDown className="h-4 w-4" />
          <span className="ml-1">-5</span>
        </button>
        <button
          onClick={() => updateStock(item.id, -1)}
          className="flex items-center justify-center rounded-xl bg-gray-100 px-3 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 active:scale-95 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          onClick={() => updateStock(item.id, 1)}
          className="flex items-center justify-center rounded-xl bg-gray-100 px-3 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 active:scale-95 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          onClick={() => updateStock(item.id, 5)}
          className="flex items-center justify-center rounded-xl bg-gray-100 px-3 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 active:scale-95 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <ArrowUp className="h-4 w-4" />
          <span className="ml-1">+5</span>
        </button>
      </div>

      {/* 最終更新 */}
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        最終更新: {format(new Date(item.lastUpdated), 'M月d日 HH:mm', { locale: ja })}
      </p>
    </div>
  );
};
