import React, { useState } from 'react';
import { Product, CategoryId } from '../types';
import { ProductCard } from './ProductCard';

interface TopPicksSectionProps {
  products: Product[];
  cartItemsMap: Record<string, number>;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onQuickOrder: (product: Product) => void;
  onViewAll: () => void;
}

export const TopPicksSection: React.FC<TopPicksSectionProps> = ({
  products,
  cartItemsMap,
  onAddToCart,
  onUpdateQuantity,
  onQuickOrder,
  onViewAll,
}) => {
  const [filter, setFilter] = useState<'all' | 'cakes' | 'vegetables' | 'fruits'>('all');

  const topPicks = products.filter((p) => {
    if (!p.isTopPick) return false;
    if (filter === 'all') return true;
    if (filter === 'cakes') return p.categoryId === 'cakes' || p.categoryId === 'bakery';
    if (filter === 'vegetables') return p.categoryId === 'vegetables' || p.categoryId === 'produce';
    if (filter === 'fruits') return p.categoryId === 'fruits';
    return true;
  });

  return (
    <section className="max-w-[1280px] mx-auto px-4 md:px-6 py-10 md:py-14 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e7eeff] text-[#004c22] text-[12px] font-bold mb-2">
            <span className="material-symbols-outlined text-[16px]">stars</span>
            <span>Customer Favorites & Chef Recommendations</span>
          </div>
          <h2 className="text-[28px] md:text-[34px] font-black text-[#111c2d] tracking-tight">
            Hand-Picked Top Specials
          </h2>
          <p className="text-[14px] text-[#404940] mt-1">
            Indulgent celebration cakes, fresh organic vegetables, and sweet fruits
          </p>
        </div>

        {/* Filter Pills and View All */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white border border-[#bfc9bd]/70 rounded-full p-1 flex items-center shadow-2xs">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#004c22] text-white shadow-xs'
                  : 'text-[#404940] hover:text-[#004c22]'
              }`}
            >
              All Favorites
            </button>
            <button
              type="button"
              onClick={() => setFilter('cakes')}
              className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
                filter === 'cakes'
                  ? 'bg-[#004c22] text-white shadow-xs'
                  : 'text-[#404940] hover:text-[#004c22]'
              }`}
            >
              🎂 Cakes
            </button>
            <button
              type="button"
              onClick={() => setFilter('vegetables')}
              className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
                filter === 'vegetables'
                  ? 'bg-[#004c22] text-white shadow-xs'
                  : 'text-[#404940] hover:text-[#004c22]'
              }`}
            >
              🥦 Veggies
            </button>
            <button
              type="button"
              onClick={() => setFilter('fruits')}
              className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
                filter === 'fruits'
                  ? 'bg-[#004c22] text-white shadow-xs'
                  : 'text-[#404940] hover:text-[#004c22]'
              }`}
            >
              🍎 Fruits
            </button>
          </div>

          <button
            type="button"
            id="view-all-top-picks"
            onClick={onViewAll}
            className="text-[13px] text-[#004c22] hover:underline font-bold px-2 py-1 flex items-center gap-1 group cursor-pointer focus:outline-none ml-1"
          >
            <span>View All ({products.length})</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
        {topPicks.map((product) => (
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
    </section>
  );
};
