'use client';

import { useState, useEffect } from 'react';
import { InventoryCard } from "@/components/InventoryCard";
import { useInventoryStore } from "@/stores/inventory";
import { SunIcon, MoonIcon, FilterIcon, ArrowUpDown } from 'lucide-react';
import { startOfMonth } from 'date-fns';

export default function InventoryPage() {
  const items = useInventoryStore(state => state.items);
  const resetMonthlyConsumption = useInventoryStore(state => state.resetMonthlyConsumption);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'category'>('name');

  const categories = Array.from(new Set(items.map(item => item.category)));

  const filteredAndSortedItems = items
    .filter(item => !selectedCategory || item.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stock':
          return (a.currentStock / a.recommendedStock) - (b.currentStock / b.recommendedStock);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // 月初めに消費量をリセット
  useEffect(() => {
    if (items.length > 0) {
      const lastReset = new Date(items[0].lastMonthReset);
      const currentMonth = startOfMonth(new Date());
      
      if (lastReset < currentMonth) {
        resetMonthlyConsumption();
      }
    }
  }, [items, resetMonthlyConsumption]);

  return (
    <main className={`min-h-screen transition-colors duration-200 
      ${isDarkMode 
        ? 'dark bg-gray-900' 
        : 'bg-gradient-to-b from-primary-50 to-base'}`}>
      {/* ヘッダー */}
      <header className={`sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-200
        ${isDarkMode 
          ? 'bg-gray-900/80 border-gray-800' 
          : 'bg-white/80 border-primary-100'}`}>
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-primary-700'
            }`}>
              在庫管理
            </h1>
            <div className="flex items-center gap-4">
              {/* フィルターメニュー */}
              <div className="flex items-center gap-2">
                <select
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${isDarkMode 
                      ? 'bg-gray-800 text-gray-200 border-gray-700' 
                      : 'bg-white text-primary-600 border-primary-200'}`}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  value={selectedCategory || ''}
                >
                  <option value="">全てのカテゴリー</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${isDarkMode 
                      ? 'bg-gray-800 text-gray-200 border-gray-700' 
                      : 'bg-white text-primary-600 border-primary-200'}`}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  value={sortBy}
                >
                  <option value="name">名前順</option>
                  <option value="stock">在庫率順</option>
                  <option value="category">カテゴリー順</option>
                </select>
              </div>
              {/* ダークモードトグル */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-colors
                  ${isDarkMode 
                    ? 'bg-gray-800 text-accent-400 hover:bg-gray-700' 
                    : 'bg-primary-50 text-primary-600 hover:bg-primary-100'}`}
              >
                {isDarkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* 在庫アラート */}
        {filteredAndSortedItems.some(item => (item.currentStock / item.recommendedStock) < 0.3) && (
          <div className={`mb-6 p-4 rounded-lg border ${
            isDarkMode 
              ? 'bg-rose-500/10 border-rose-800 text-rose-200' 
              : 'bg-rose-50 border-rose-100 text-rose-600'
          }`}>
            <h2 className="font-medium mb-2">⚠️ 在庫アラート</h2>
            <ul className="text-sm space-y-1">
              {filteredAndSortedItems
                .filter(item => (item.currentStock / item.recommendedStock) < 0.3)
                .map(item => (
                  <li key={item.id}>
                    {item.name}: 残り{item.currentStock}{item.unit}（推奨: {item.recommendedStock}{item.unit}）
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* 在庫カードグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedItems.map((item) => (
            <InventoryCard key={item.id} item={item} isDarkMode={isDarkMode} />
          ))}
        </div>
      </div>

      {/* フッター */}
      <footer className={`mt-auto py-6 text-center text-sm ${
        isDarkMode ? 'text-gray-500' : 'text-primary-400'
      }`}>
        &copy; 2025 在庫管理システム
      </footer>
    </main>
  );
}
