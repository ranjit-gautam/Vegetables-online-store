import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity?: (productId: string, newQty: number) => void;
  onQuickOrder: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  onQuickOrder,
}) => {
  return (
    <article className="bg-white rounded-2xl border border-[#bfc9bd]/60 overflow-hidden flex flex-col relative group hover:shadow-xl hover:border-[#004c22]/50 transition-all duration-300 transform hover:-translate-y-1">
      
      {/* Product Image Container */}
      <div className="h-48 sm:h-52 w-full bg-[#f9fbf8] relative overflow-hidden border-b border-[#bfc9bd]/30">
        <img
          src={product.image}
          alt={product.imageAlt || product.name}
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient scrim at top for badges */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent pointer-events-none" />

        {/* Badges on Top Left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge ? (
            <span className="bg-[#111c2d]/85 text-white backdrop-blur-md text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs border border-white/20">
              {product.badge}
            </span>
          ) : product.organic ? (
            <span className="bg-[#004c22]/90 text-white backdrop-blur-md text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              100% Organic
            </span>
          ) : null}
        </div>

        {/* Quick Order icon badge on Top Right */}
        <button
          type="button"
          onClick={() => onQuickOrder(product)}
          title="Quick Order"
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md text-[#007241] border border-white hover:bg-[#004c22] hover:text-white flex items-center justify-center transition-all shadow-sm cursor-pointer z-10 hover:scale-110 active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">bolt</span>
        </button>
      </div>

      {/* Product Details Container */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 bg-[#ffffff]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-extrabold tracking-wider text-[#004c22] uppercase bg-[#e7eeff] px-2 py-0.5 rounded-md">
            {product.category}
          </span>
          {product.weightOrVolume && (
            <span className="text-[11px] text-[#707a6f] font-medium bg-[#f0f3ff] px-2 py-0.5 rounded-md">
              {product.weightOrVolume}
            </span>
          )}
        </div>

        <h3 className="text-[15px] sm:text-[16px] font-bold text-[#111c2d] mb-1 line-clamp-2 leading-snug group-hover:text-[#004c22] transition-colors">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-[12px] text-[#707a6f] line-clamp-2 mb-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Price & Unit */}
        <div className="flex items-baseline mb-3 mt-auto">
          <span className="text-[20px] sm:text-[22px] font-black text-[#111c2d]">
            €{product.price.toFixed(2)}
          </span>
          <span className="text-[12px] text-[#707a6f] font-medium ml-1">
            / {product.unit}
          </span>
        </div>

        {/* Action Controls: Dual Method (Instant Order + Add to Cart) */}
        <div className="space-y-2 pt-1 border-t border-[#bfc9bd]/30">
          
          {/* Primary Quick Order Button */}
          <button
            type="button"
            id={`quick-order-btn-${product.id}`}
            onClick={() => onQuickOrder(product)}
            className="w-full py-2 px-3 bg-[#004c22] hover:bg-[#166534] active:scale-97 text-white font-bold text-[13px] rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>Order Now</span>
          </button>

          {/* Secondary Cart Stepper or Add Button */}
          <div className="flex items-center justify-between gap-2">
            {quantityInCart > 0 && onUpdateQuantity ? (
              <div className="w-full flex items-center justify-between bg-[#f0f3ff] border border-[#004c22]/30 rounded-xl p-1 shadow-2xs">
                <button
                  type="button"
                  aria-label={`Decrease ${product.name} quantity`}
                  onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
                  className="w-7 h-7 rounded-lg bg-white text-[#004c22] flex items-center justify-center hover:bg-[#004c22] hover:text-white transition-colors cursor-pointer text-[16px] font-bold shadow-2xs"
                >
                  -
                </button>
                <span className="px-2 text-[13px] font-bold text-[#004c22]">
                  {quantityInCart} in Cart
                </span>
                <button
                  type="button"
                  aria-label={`Increase ${product.name} quantity`}
                  onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
                  className="w-7 h-7 rounded-lg bg-[#004c22] text-white flex items-center justify-center hover:bg-[#166534] transition-colors cursor-pointer text-[16px] font-bold shadow-2xs"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                type="button"
                id={`add-btn-${product.id}`}
                aria-label={`Add ${product.name} to cart`}
                onClick={() => onAddToCart(product)}
                className="w-full py-1.5 px-3 bg-[#f0f3ff] hover:bg-[#e7eeff] text-[#004c22] border border-[#bfc9bd]/60 font-semibold text-[12px] rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer hover:border-[#004c22]/40"
              >
                <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                <span>Add to Cart</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </article>
  );
};
