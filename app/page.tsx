import { useState } from 'react';
import { InventoryCard } from '@/components/InventoryCard';
import { useInventoryStore } from '@/stores/inventory';
import { Moon, Sun, Filter, SortAsc } from 'lucide-react';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const inventory = useInventoryStore(state => state.inventory);
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'category'>('name');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const categories = ['all', ...new Set(inventory.map(item => item.category))];

  const sortedAndFilteredInventory = inventory
    .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stock':
          return (b.currentStock / b.maxStock) - (a.currentStock / a.maxStock);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-[--background]">
      {/* ヘッダー */}
      <header className="header">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              在庫管理
            </h1>
            <button
              onClick={toggleDarkMode}
              className="rounded-full p-2.5 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* フィルターとソート */}
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'すべてのカテゴリー' : category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <SortAsc className="h-4 w-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'stock' | 'category')}
                className="filter-select"
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
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedAndFilteredInventory.map((item) => (
            <InventoryCard key={item.id} item={item} />
          ))}
        </div>
      </main>
    </div>
  );
}
