import React, { useState, useMemo } from 'react';
import { Product, CategoryId } from '../types';
import { ProductCard } from './ProductCard';

interface GroceriesViewProps {
  products: Product[];
  activeCategory: CategoryId;
  onCategoryChange: (cat: CategoryId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartItemsMap: Record<string, number>;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onQuickOrder: (product: Product) => void;
  onOpenEsewaModal: () => void;
}

export const GroceriesView: React.FC<GroceriesViewProps> = ({
  products,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  cartItemsMap,
  onAddToCart,
  onUpdateQuantity,
  onQuickOrder,
  onOpenEsewaModal,
}) => {
  const [maxPrice, setMaxPrice] = useState<number>(30);
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [topPicksOnly, setTopPicksOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const categories: { id: CategoryId; label: string; icon: string }[] = [
    { id: 'all', label: 'All Items', icon: 'apps' },
    { id: 'cakes', label: 'Cakes & Bakery', icon: 'cake' },
    { id: 'vegetables', label: 'Fresh Vegetables', icon: 'nutrition' },
    { id: 'fruits', label: 'Sweet Fruits', icon: 'restaurant' },
    { id: 'dairy', label: 'Dairy & Eggs', icon: 'water_drop' },
    { id: 'beverages', label: 'Beverages', icon: 'local_cafe' },
  ];

  // Filter products based on category, price, organic status, top picks and search query
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (activeCategory !== 'all') {
        if (activeCategory === 'cakes' && p.categoryId !== 'cakes' && p.categoryId !== 'bakery') {
          return false;
        }
        if (activeCategory === 'vegetables' && p.categoryId !== 'vegetables' && p.categoryId !== 'produce') {
          return false;
        }
        if (activeCategory === 'produce' && p.categoryId !== 'vegetables' && p.categoryId !== 'produce' && p.categoryId !== 'fruits') {
          return false;
        }
        if (activeCategory === 'bakery' && p.categoryId !== 'cakes' && p.categoryId !== 'bakery') {
          return false;
        }
        if (activeCategory !== 'cakes' && activeCategory !== 'vegetables' && activeCategory !== 'produce' && activeCategory !== 'bakery' && p.categoryId !== activeCategory) {
          return false;
        }
      }
      
      // Top picks quick toggle
      if (topPicksOnly && !p.isTopPick) {
        return false;
      }

      // Price filter
      if (p.price > maxPrice) {
        return false;
      }
      // Organic filter
      if (organicOnly && !p.organic) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesCat = p.category.toLowerCase().includes(query);
        const matchesDesc = p.description ? p.description.toLowerCase().includes(query) : false;
        const matchesBadge = p.badge ? p.badge.toLowerCase().includes(query) : false;
        return matchesName || matchesCat || matchesDesc || matchesBadge;
      }
      return true;
    });
  }, [products, activeCategory, maxPrice, organicOnly, topPicksOnly, searchQuery]);

  return (
    <div className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-6 py-6 md:py-10">
      
      {/* Top Banner: eSewa QR Pay Banner */}
      <div className="mb-6 bg-[#f0f3ff] border border-[#004c22]/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#004c22] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[26px]">qr_code_scanner</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-[#111c2d]">Direct e-Sewa QR Payment & Rapid Home Delivery</span>
              <span className="bg-[#60bb46] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                Verified Store
              </span>
            </div>
            <p className="text-[13px] text-[#404940] mt-0.5">
              Order fresh cakes, vegetables & fruits instantly. Pay securely via eSewa (<strong>Ranjit Gautam</strong> • 9803161767) or Cash on Delivery.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenEsewaModal}
          className="px-4 py-2.5 bg-[#004c22] hover:bg-[#166534] active:scale-95 text-white text-[13px] font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
          <span>View e-Sewa QR</span>
        </button>
      </div>

      {/* Category Pills Quick Strip for High Usability & Attractiveness */}
      <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id || 
            (cat.id === 'cakes' && (activeCategory === 'cakes' || activeCategory === 'bakery')) ||
            (cat.id === 'vegetables' && (activeCategory === 'vegetables' || activeCategory === 'produce'));
          return (
            <button
              key={cat.id}
              type="button"
              id={`quick-cat-pill-${cat.id}`}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] sm:text-[14px] font-bold whitespace-nowrap transition-all cursor-pointer shadow-2xs border ${
                isActive
                  ? 'bg-[#004c22] text-white border-[#004c22] shadow-sm scale-102'
                  : 'bg-white text-[#404940] border-[#bfc9bd]/70 hover:bg-[#f0f3ff] hover:text-[#004c22]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* View Header & Mobile Filter Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#bfc9bd]/40">
        <div>
          <h1 className="text-[26px] md:text-[32px] font-black text-[#111c2d] tracking-tight">
            {activeCategory === 'all'
              ? 'All Groceries, Cakes & Farm Produce'
              : categories.find((c) => c.id === activeCategory)?.label || 'Groceries'}
          </h1>
          <p className="text-[14px] text-[#404940] mt-0.5">
            Showing <strong className="text-[#004c22]">{filteredProducts.length}</strong> delicious & fresh item{filteredProducts.length === 1 ? '' : 's'} ready for instant delivery
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Top Picks filter chip */}
          <button
            type="button"
            onClick={() => setTopPicksOnly(!topPicksOnly)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-bold transition-all border cursor-pointer ${
              topPicksOnly
                ? 'bg-[#004c22] text-white border-[#004c22]'
                : 'bg-white text-[#004c22] border-[#004c22]/40 hover:bg-[#e7eeff]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">stars</span>
            <span>Featured Best Sellers</span>
          </button>

          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-4 py-2 bg-white border border-[#bfc9bd] rounded-lg text-[14px] font-medium text-[#111c2d] shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            Filters {activeCategory !== 'all' || maxPrice < 30 || organicOnly ? '•' : ''}
          </button>

          {/* Active search pill if any */}
          {searchQuery && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#e7eeff] text-[#004c22] text-[13px] font-medium border border-[#bfc9bd]/50">
              <span>Searching: "{searchQuery}"</span>
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="hover:text-[#111c2d] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        
        {/* Sidebar Filters (Desktop & Collapsible Mobile) */}
        <aside
          className={`w-full md:w-64 flex-shrink-0 flex flex-col gap-6 ${
            mobileFilterOpen ? 'block' : 'hidden md:flex'
          }`}
        >
          {/* Categories Filter Box */}
          <div className="bg-white border border-[#bfc9bd]/60 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#bfc9bd]/40">
              <h2 className="text-[17px] font-bold text-[#111c2d]">
                Categories
              </h2>
              {activeCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => onCategoryChange('all')}
                  className="text-[12px] text-[#004c22] hover:underline font-bold"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {categories.map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <label
                    key={cat.id}
                    className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#f0f3ff] text-[#004c22] font-bold' : 'text-[#404940] hover:bg-[#f9f9ff]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="category-filter"
                      checked={isSelected}
                      onChange={() => {
                        onCategoryChange(cat.id);
                        setMobileFilterOpen(false);
                      }}
                      className="accent-[#004c22] w-4 h-4"
                    />
                    <span className="text-[14px] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] opacity-75">{cat.icon}</span>
                      {cat.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Quick Dietary & Highlights Box */}
          <div className="bg-white border border-[#bfc9bd]/60 rounded-xl p-5 shadow-xs space-y-3">
            <h2 className="text-[17px] font-bold text-[#111c2d] pb-2 border-b border-[#bfc9bd]/40">
              Preferences
            </h2>
            <label className="flex items-center gap-3 cursor-pointer text-[#404940] hover:text-[#004c22]">
              <input
                type="checkbox"
                checked={topPicksOnly}
                onChange={(e) => setTopPicksOnly(e.target.checked)}
                className="accent-[#004c22] w-4 h-4 rounded"
              />
              <span className="text-[13px] font-semibold">Top Rated & Best Sellers</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer text-[#404940] hover:text-[#004c22]">
              <input
                type="checkbox"
                checked={organicOnly}
                onChange={(e) => setOrganicOnly(e.target.checked)}
                className="accent-[#004c22] w-4 h-4 rounded"
              />
              <span className="text-[13px] font-semibold">100% Organic Farm Items</span>
            </label>
          </div>

          {/* Price Filter Box */}
          <div className="bg-white border border-[#bfc9bd]/60 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#bfc9bd]/40">
              <h2 className="text-[17px] font-bold text-[#111c2d]">
                Max Price
              </h2>
              <span className="text-[13px] font-bold text-[#004c22]">
                Up to €{maxPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <input
                type="range"
                min="0.5"
                max="30"
                step="0.5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                className="w-full accent-[#004c22] cursor-pointer"
              />

              <div className="flex justify-between items-center text-[13px]">
                <div className="border border-[#bfc9bd]/60 rounded-md px-3 py-1.5 text-center text-[#404940] bg-[#f0f3ff] font-medium">
                  €0.50
                </div>
                <span className="text-[#707a6f]">-</span>
                <div className="border border-[#bfc9bd]/60 rounded-md px-3 py-1.5 text-center text-[#004c22] bg-[#e7eeff] font-bold">
                  €{maxPrice.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Reset All Filters */}
          {(activeCategory !== 'all' || maxPrice < 30 || organicOnly || topPicksOnly || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                onCategoryChange('all');
                setMaxPrice(30);
                setOrganicOnly(false);
                setTopPicksOnly(false);
                onSearchChange('');
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-[#f0f3ff] text-[#004c22] hover:bg-[#e7eeff] text-[14px] font-bold transition-colors border border-[#bfc9bd]/50 cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </aside>

        {/* Product Catalog Grid */}
        <section className="flex-1 w-full">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-[#bfc9bd]/60 rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#f0f3ff] flex items-center justify-center text-[#004c22]">
                <span className="material-symbols-outlined text-[36px]">search_off</span>
              </div>
              <h3 className="text-[20px] font-bold text-[#111c2d]">
                No grocery items match your search
              </h3>
              <p className="text-[14px] text-[#404940] max-w-sm">
                Try searching for cakes, vanilla, black forest, potatoes, apples, or clear filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  onCategoryChange('all');
                  setMaxPrice(30);
                  setOrganicOnly(false);
                  setTopPicksOnly(false);
                  onSearchChange('');
                }}
                className="px-6 py-2.5 rounded-xl bg-[#004c22] text-white text-[14px] font-bold hover:bg-[#166534] transition-colors cursor-pointer shadow-xs"
              >
                Reset Filters & View All
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 items-start">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantityInCart={cartItemsMap[product.id] || 0}
                  onAddToCart={onAddToCart}
                  onUpdateQuantity={onUpdateQuantity}
                  onQuickOrder={onQuickOrder}
                />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};
