import React from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 25;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const deliveryFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 2.50;
  const total = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#111c2d]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#bfc9bd]/60 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-[#bfc9bd]/40 flex items-center justify-between bg-[#f9f9ff]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#004c22]">shopping_cart</span>
              <h2 className="text-[18px] font-bold text-[#111c2d]">
                Your Fresh Cart ({cartItems.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-[#707a6f] hover:bg-[#e7eeff] hover:text-[#111c2d] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Free delivery bar */}
          <div className="bg-[#f0f3ff] px-5 py-3 border-b border-[#bfc9bd]/40">
            <div className="flex justify-between text-[12px] text-[#404940] mb-1 font-medium">
              <span>
                {amountToFreeShipping > 0
                  ? `Add €${amountToFreeShipping.toFixed(2)} more for FREE delivery`
                  : '🎉 You unlocked FREE Delivery!'}
              </span>
              <span className="font-bold text-[#004c22]">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full bg-[#bfc9bd]/40 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#004c22] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#bfc9bd]/40">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-[#f0f3ff] flex items-center justify-center text-[#707a6f]">
                  <span className="material-symbols-outlined text-[32px]">shopping_cart</span>
                </div>
                <h3 className="text-[18px] font-semibold text-[#111c2d]">Your cart is empty</h3>
                <p className="text-[14px] text-[#404940] max-w-xs">
                  Discover fresh organic vegetables, fruit, dairy, and freshly baked sourdough!
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#004c22] text-white rounded-lg text-[14px] font-semibold hover:bg-[#166534] transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="py-4 flex gap-4 items-center">
                  <div className="w-16 h-16 bg-[#f0f3ff] rounded-lg overflow-hidden border border-[#bfc9bd]/40 p-1 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-semibold text-[#111c2d] truncate">
                      {product.name}
                    </h4>
                    <p className="text-[12px] text-[#404940]">
                      €{product.price.toFixed(2)} / {product.unit}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity selector */}
                      <div className="flex items-center border border-[#bfc9bd] rounded-md bg-white">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                          className="px-2 py-0.5 text-[#004c22] hover:bg-[#f0f3ff] font-bold text-[14px]"
                        >
                          -
                        </button>
                        <span className="px-2 text-[12px] font-semibold text-[#111c2d]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="px-2 py-0.5 text-[#004c22] hover:bg-[#f0f3ff] font-bold text-[14px]"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-[15px] font-bold text-[#111c2d]">
                        €{(product.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label={`Remove ${product.name} from cart`}
                    onClick={() => onRemoveItem(product.id)}
                    className="text-[#707a6f] hover:text-[#ba1a1a] p-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Bar */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-[#f9f9ff] border-t border-[#bfc9bd]/60 space-y-3">
              <div className="space-y-1.5 text-[14px]">
                <div className="flex justify-between text-[#404940]">
                  <span>Subtotal</span>
                  <span className="font-semibold">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#404940]">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? <strong className="text-[#004c22]">FREE</strong> : `€${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-[18px] font-bold text-[#111c2d] pt-2 border-t border-[#bfc9bd]/40">
                  <span>Estimated Total</span>
                  <span className="text-[#004c22]">€{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                id="cart-drawer-checkout-button"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full bg-[#004c22] hover:bg-[#166534] text-white font-bold text-[16px] py-3.5 rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
