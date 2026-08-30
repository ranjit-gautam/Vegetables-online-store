import React from 'react';

interface HeroSectionProps {
  onShopNow: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onShopNow }) => {
  return (
    <section className="max-w-[1280px] mx-auto px-4 md:px-6 py-8 md:py-14 w-full">
      <div className="bg-gradient-to-br from-[#eaf6ee] via-[#f4f9f5] to-[#e8f1fb] rounded-3xl border border-[#bfc9bd]/60 p-6 sm:p-8 md:p-12 relative overflow-hidden shadow-sm flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        
        {/* Background ambient aesthetic blurs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#8cf5b2]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#60bb46]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Left Column: Text & CTA */}
        <div className="flex-1 flex flex-col items-start space-y-5 z-10 relative">
          <h1 className="text-[34px] sm:text-[44px] md:text-[52px] font-black text-[#111c2d] leading-[1.12] tracking-tight">
            Garden Fresh Produce & <br className="hidden sm:inline" />
            <span className="text-[#004c22] underline decoration-[#8cf5b2] decoration-4 underline-offset-4">
              Delicious Cakes
            </span>
          </h1>
          
          {/* Quick Highlight Feature Pills */}
          <div className="grid grid-cols-2 gap-2.5 w-full pt-1 max-w-md">
            <div className="bg-white/80 backdrop-blur-xs border border-[#bfc9bd]/50 rounded-xl p-2.5 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#e7eeff] text-[#004c22] flex items-center justify-center font-bold text-[15px]">🥦</span>
              <div>
                <p className="text-[12px] font-bold text-[#111c2d] leading-tight">Fresh Veggies</p>
                <p className="text-[10px] text-[#707a6f]">Daily Organic</p>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-xs border border-[#bfc9bd]/50 rounded-xl p-2.5 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#e7eeff] text-[#004c22] flex items-center justify-center font-bold text-[15px]">🎂</span>
              <div>
                <p className="text-[12px] font-bold text-[#111c2d] leading-tight">Fresh Cakes</p>
                <p className="text-[10px] text-[#707a6f]">Vanilla & Forest</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              id="hero-shop-now-button"
              onClick={onShopNow}
              className="bg-[#004c22] hover:bg-[#166534] active:scale-95 text-white font-bold text-[15px] px-7 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Explore All Groceries & Cakes</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Right Column: Hero Visual Image with Floating Card Overlay */}
        <div className="flex-1 w-full relative">
          <div className="h-[280px] sm:h-[360px] md:h-[420px] rounded-2xl overflow-hidden shadow-lg border border-white/60 relative group">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
              alt="Vibrant fresh grocery market with fresh vegetables, fruits and gourmet bakery items"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            
            {/* Floating Top Seller Cake Badge Card */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3.5 border border-white/80 shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=150&q=80"
                  alt="Black Forest Cake"
                  className="w-12 h-12 rounded-lg object-cover border border-[#bfc9bd]/50"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-[#111c2d]">Black Forest Gateau</span>
                    <span className="bg-[#e7eeff] text-[#004c22] text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                      HOT
                    </span>
                  </div>
                  <p className="text-[11px] text-[#707a6f]">Fresh Cherries & Belgian Cream</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onShopNow}
                className="bg-[#004c22] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#166534] transition-colors cursor-pointer"
              >
                Order
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
