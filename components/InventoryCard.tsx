import { useState } from 'react';
import { useInventoryStore } from '@/stores/inventory';
import { formatDistanceToNow, format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Plus, Minus } from 'lucide-react';
import type { InventoryItem } from '@/types/inventory';

interface InventoryCardProps {
  item: InventoryItem;
  isDarkMode: boolean;
}

export function InventoryCard({ item, isDarkMode }: InventoryCardProps) {
  const updateStock = useInventoryStore(state => state.updateStock);
  const [isUpdating, setIsUpdating] = useState(false);

  const stockPercentage = (item.currentStock / item.recommendedStock) * 100;
  const stockStatus = stockPercentage <= 30 ? 'low' : stockPercentage <= 70 ? 'medium' : 'high';

  const handleStockUpdate = (amount: number) => {
    setIsUpdating(true);
    const newStock = Math.max(0, item.currentStock + amount);
    updateStock(item.id, newStock);
    setIsUpdating(false);
  };

  const getStatusColor = (status: string) => {
    if (isDarkMode) {
      switch (status) {
        case 'low':
          return 'bg-rose-500/20 text-rose-300';
        case 'medium':
          return 'bg-accent-500/20 text-accent-300';
        case 'high':
          return 'bg-emerald-500/20 text-emerald-300';
        default:
          return 'bg-gray-500/20 text-gray-300';
      }
    } else {
      switch (status) {
        case 'low':
          return 'bg-rose-50 text-rose-600';
        case 'medium':
          return 'bg-accent-50 text-accent-600';
        case 'high':
          return 'bg-emerald-50 text-emerald-600';
        default:
          return 'bg-gray-50 text-gray-600';
      }
    }
  };

  return (
    <div className={`rounded-xl overflow-hidden transition-all duration-200 ${
      isDarkMode 
        ? 'bg-gray-800 border border-gray-700 shadow-lg shadow-gray-900/20' 
        : 'bg-white border border-primary-100 shadow-lg shadow-primary-900/5'
    }`}>
      {/* カードヘッダー */}
      <div className={`px-4 py-3 border-b transition-colors ${
        isDarkMode ? 'border-gray-700' : 'border-primary-50'
      }`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className={`font-medium ${
              isDarkMode ? 'text-white' : 'text-primary-900'
            }`}>
              {item.name}
            </h3>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-primary-500'
            }`}>
              {item.category}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-lg text-sm ${getStatusColor(stockStatus)}`}>
            {stockPercentage.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* カードボディ */}
      <div className="p-4">
        {/* 在庫バー */}
        <div className="mb-4">
          <div className={`h-2 rounded-full overflow-hidden ${
            isDarkMode ? 'bg-gray-700' : 'bg-primary-100'
          }`}>
            <div
              className={`h-full transition-all duration-200 ${
                stockStatus === 'low' 
                  ? 'bg-rose-500' 
                  : stockStatus === 'medium' 
                    ? 'bg-accent-500' 
                    : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, stockPercentage)}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className={isDarkMode ? 'text-gray-400' : 'text-primary-500'}>
              現在: {item.currentStock}{item.unit}
            </span>
            <span className={isDarkMode ? 'text-gray-400' : 'text-primary-500'}>
              推奨: {item.recommendedStock}{item.unit}
            </span>
          </div>
        </div>

        {/* 操作ボタン */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleStockUpdate(-1)}
            disabled={isUpdating || item.currentStock <= 0}
            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600'
                : 'bg-primary-50 text-primary-600 hover:bg-primary-100 disabled:bg-gray-50 disabled:text-gray-400'
            }`}
          >
            <Minus size={16} /> -1
          </button>
          <button
            onClick={() => handleStockUpdate(1)}
            disabled={isUpdating}
            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600'
                : 'bg-primary-50 text-primary-600 hover:bg-primary-100 disabled:bg-gray-50 disabled:text-gray-400'
            }`}
          >
            <Plus size={16} /> +1
          </button>
          <button
            onClick={() => handleStockUpdate(5)}
            disabled={isUpdating}
            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600'
                : 'bg-primary-50 text-primary-600 hover:bg-primary-100 disabled:bg-gray-50 disabled:text-gray-400'
            }`}
          >
            <Plus size={16} /> +5
          </button>
        </div>

        {/* 月間消費量と最終更新 */}
        <div className="mt-4 space-y-1">
          <p className={`text-xs ${
            isDarkMode ? 'text-gray-500' : 'text-primary-400'
          }`}>
            今月の消費量: {item.monthlyConsumption}{item.unit}
          </p>
          <p className={`text-xs ${
            isDarkMode ? 'text-gray-500' : 'text-primary-400'
          }`}>
            最終更新: {format(new Date(item.lastUpdated), 'yyyy/MM/dd HH:mm', { locale: ja })}
          </p>
        </div>
      </div>
    </div>
  );
}
