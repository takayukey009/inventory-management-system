import { useState, useEffect } from 'react';
import { InventoryCard } from "@/components/InventoryCard";
import { useInventoryStore } from "@/stores/inventory";
import { Moon, Sun, Filter, SortAsc } from 'lucide-react';
import { startOfMonth } from 'date-fns';

export default function InventoryPage() {
  const items = useInventoryStore(state => state.items);
  const resetMonthlyConsumption = useInventoryStore(state => state.resetMonthlyConsumption);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'category'>('name');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const categories = ['all', ...new Set(items.map(item => item.category))];

  const sortedAndFilteredItems = items
    .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stock':
          return (b.currentStock / b.recommendedStock) - (a.currentStock / a.recommendedStock);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

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
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 transition-colors duration-300 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950`}>
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              在庫管理
            </h1>
            <button
              onClick={toggleDarkMode}
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* フィルターとソート */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border-0 bg-gray-100 px-3 py-1.5 text-sm text-gray-900 focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'すべてのカテゴリー' : category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'stock' | 'category')}
                className="rounded-lg border-0 bg-gray-100 px-3 py-1.5 text-sm text-gray-900 focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
              >
                <option value="name">名前順</option>
                <option value="stock">在庫率順</option>
                <option value="category">カテゴリー順</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* 在庫アラート */}
        {sortedAndFilteredItems.some(item => (item.currentStock / item.recommendedStock) < 0.3) && (
          <div className={`mb-6 p-4 rounded-lg border ${
            isDarkMode 
              ? 'bg-rose-500/10 border-rose-800 text-rose-200' 
              : 'bg-rose-50 border-rose-100 text-rose-600'
          }`}>
            <h2 className="font-medium mb-2">⚠️ 在庫アラート</h2>
            <ul className="text-sm space-y-1">
              {sortedAndFilteredItems
                .filter(item => (item.currentStock / item.recommendedStock) < 0.3)
                .map(item => (
                  <li key={item.id}>
                    {item.name}: 残り{item.currentStock}{item.unit}（推奨: {item.recommendedStock}{item.unit}）
                  </li>
                ))}
            </ul>
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedAndFilteredItems.map((item) => (
            <InventoryCard key={item.id} item={item} isDarkMode={isDarkMode} />
          ))}
        </div>
      </main>

      {/* フッター */}
      <footer className={`mt-auto py-6 text-center text-sm ${
        isDarkMode ? 'text-gray-500' : 'text-primary-400'
      }`}>
        &copy; 2025 在庫管理システム
      </footer>
    </div>
  );
}
