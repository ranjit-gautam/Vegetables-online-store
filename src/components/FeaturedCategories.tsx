import React from 'react';
import { CategoryId } from '../types';

interface FeaturedCategoriesProps {
  onSelectCategory: (category: CategoryId) => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ onSelectCategory }) => {
  const categories: {
    title: string;
    subtitle: string;
    category: CategoryId;
    image: string;
    badge: string;
    itemCount: string;
  }[] = [
    {
      title: 'Fresh Cakes & Bakery',
      subtitle: 'Vanilla, Black Forest, Red Velvet & Sourdough',
      category: 'cakes',
      badge: 'Freshly Baked 🎂',
      itemCount: '12+ Varieties',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Farm Fresh Vegetables',
      subtitle: 'Crisp potatoes, onions, tomatoes, greens & herbs',
      category: 'vegetables',
      badge: 'Harvested Daily 🥦',
      itemCount: '25+ Items',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Juicy Sweet Fruits',
      subtitle: 'Alphonso mangoes, apples, strawberries & melons',
      category: 'fruits',
      badge: 'Sweet & Plump 🍓',
      itemCount: '16+ Fruits',
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Organic Dairy & Farm Eggs',
      subtitle: 'Pure whole milk, Greek yogurt, fresh paneer & eggs',
      category: 'dairy',
      badge: '100% Grass-Fed 🥛',
      itemCount: 'Daily Fresh',
      image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=800&q=80',
    }
  ];

  return (
    <section className="bg-white border-y border-[#bfc9bd]/50 py-12 md:py-16 my-4">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e7eeff] text-[#004c22] text-[12px] font-bold uppercase tracking-wider mb-2">
              <span>★ Curated Collections</span>
            </div>
            <h2 className="text-[28px] md:text-[36px] font-black text-[#111c2d] tracking-tight">
              Explore Our Fresh Aisles
            </h2>
            <p className="text-[15px] text-[#404940] mt-1 max-w-xl">
              From celebration birthday cakes to morning-picked organic greens and sweet seasonal fruits.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="self-start md:self-auto text-[14px] font-bold text-[#004c22] hover:text-[#166534] flex items-center gap-1 group cursor-pointer"
          >
            <span>View All Groceries</span>
            <span className="material-symbols-outlined text-[18px] transform group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>

        {/* Categories 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {categories.map((cat) => (
            <button
              key={cat.category}
              id={`cat-card-${cat.category}`}
              type="button"
              onClick={() => onSelectCategory(cat.category)}
              className="group relative h-72 md:h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-[#bfc9bd]/50 hover:shadow-xl hover:border-[#004c22]/60 transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-[#004c22] flex flex-col justify-between p-5"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-108 transition-transform duration-700 ease-out"
                style={{ backgroundImage: `url('${cat.image}')` }}
                role="img"
                aria-label={cat.title}
              />
              
              {/* Multi-gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111c2d]/95 via-[#111c2d]/40 to-black/20 group-hover:from-[#111c2d]/90 transition-colors" />

              {/* Top Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="bg-white/90 backdrop-blur-md text-[#004c22] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                  {cat.badge}
                </span>
                <span className="bg-black/40 backdrop-blur-md text-white/90 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-white/20">
                  {cat.itemCount}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="relative z-10">
                <h3 className="text-[20px] md:text-[22px] font-bold text-white leading-snug group-hover:text-[#8cf5b2] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-[12px] text-white/80 mt-1 line-clamp-1">
                  {cat.subtitle}
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-[12px] font-bold text-[#8cf5b2] group-hover:text-white transition-colors">
                  <span>Shop Category</span>
                  <span className="material-symbols-outlined text-[16px] transform group-hover:translate-x-1 transition-transform">
                    east
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
