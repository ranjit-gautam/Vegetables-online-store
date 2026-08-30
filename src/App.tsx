import React, { useState, useEffect } from 'react';
import { CategoryId, Product, CartItem, DeliveryInfo, PaymentMethodType, Order } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturedCategories } from './components/FeaturedCategories';
import { TopPicksSection } from './components/TopPicksSection';
import { GroceriesView } from './components/GroceriesView';
import { CheckoutView } from './components/CheckoutView';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { QuickOrderModal } from './components/QuickOrderModal';
import { EsewaQRCard } from './components/EsewaQRCard';
import { Footer } from './components/Footer';
import { InfoModals, InfoModalType } from './components/InfoModals';

export default function App() {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activeView, setActiveView] = useState<'home' | 'groceries' | 'checkout'>('home');
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [infoModal, setInfoModal] = useState<InfoModalType>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [quickOrderProduct, setQuickOrderProduct] = useState<Product | null>(null);
  const [isEsewaQRModalOpen, setIsEsewaQRModalOpen] = useState<boolean>(false);

  // Initial cart items
  const [cart, setCart] = useState<CartItem[]>(() => {
    const greenApples = INITIAL_PRODUCTS.find((p) => p.id === 'prod-green-apples') || INITIAL_PRODUCTS[0];
    const sourdough = INITIAL_PRODUCTS.find((p) => p.id === 'prod-sourdough-loaf') || INITIAL_PRODUCTS[3];
    return [
      { product: greenApples, quantity: 2 },
      { product: sourdough, quantity: 1 },
    ];
  });

  // Default delivery address
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    name: 'Ranjit Gautam',
    phone: '9803161767',
    address: 'Kathmandu Valley, Fresh Market Hub',
    area: 'Central District',
    city: 'Kathmandu',
    postalCode: '44600',
  });

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  // Cart item count map for quick lookups
  const cartItemsMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of cart) {
      map[item.product.id] = item.quantity;
    }
    return map;
  }, [cart]);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= 25 || subtotal === 0 ? 0 : 2.50;
  const total = subtotal + deliveryFee;

  // Toast notification trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Add to cart handler
  const handleAddToCart = (product: Product, quantityToAdd: number = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...prevCart, { product, quantity: quantityToAdd }];
    });
    showToast(`Added ${quantityToAdd > 1 ? `${quantityToAdd}x ` : ''}${product.name} to cart`);
  };

  // Update quantity handler
  const handleUpdateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // Remove item handler
  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  // Navigation handler
  const handleNavigate = (view: 'home' | 'groceries' | 'checkout', category?: CategoryId) => {
    setActiveView(view);
    if (category) {
      setActiveCategory(category);
    }
  };

  // Order confirmation handler
  const handleConfirmOrder = (order: Order) => {
    setConfirmedOrder(order);
    setCart([]);
  };

  return (
    <div className="bg-[#f9f9ff] text-[#111c2d] min-h-screen flex flex-col font-sans selection:bg-[#8cf5b2] selection:text-[#004c22]">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeView={activeView}
        activeCategory={activeCategory}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenProfile={() => setInfoModal('profile')}
        onOpenAbout={() => setInfoModal('about')}
        onOpenContact={() => setInfoModal('contact')}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (activeView !== 'groceries' && q.trim()) {
            setActiveView('groceries');
          }
        }}
      />

      {/* Main View Display */}
      <div className="flex-1 flex flex-col">
        {activeView === 'home' && (
          <main className="flex-1 flex flex-col w-full animate-in fade-in-50 duration-300">
            {/* Hero Section */}
            <HeroSection
              onShopNow={() => {
                setActiveView('groceries');
                setActiveCategory('all');
              }}
            />

            {/* Featured Categories Bento Grid */}
            <FeaturedCategories
              onSelectCategory={(cat) => {
                setActiveCategory(cat);
                setActiveView('groceries');
              }}
            />

            {/* Top Picks For You Grid with instant order method */}
            <TopPicksSection
              products={products}
              cartItemsMap={cartItemsMap}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              onQuickOrder={(product) => setQuickOrderProduct(product)}
              onViewAll={() => {
                setActiveView('groceries');
                setActiveCategory('all');
              }}
            />
          </main>
        )}

        {activeView === 'groceries' && (
          <GroceriesView
            products={products}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            cartItemsMap={cartItemsMap}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onQuickOrder={(product) => setQuickOrderProduct(product)}
            onOpenEsewaModal={() => setIsEsewaQRModalOpen(true)}
          />
        )}

        {activeView === 'checkout' && (
          <CheckoutView
            cartItems={cart}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={total}
            deliveryInfo={deliveryInfo}
            onUpdateDeliveryInfo={setDeliveryInfo}
            onBackToShopping={() => setActiveView('groceries')}
            onConfirmOrder={handleConfirmOrder}
          />
        )}
      </div>

      {/* Mobile Floating Cart Summary Button */}
      {totalCartCount > 0 && activeView !== 'checkout' && (
        <div className="md:hidden fixed bottom-5 left-4 right-4 z-40">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#004c22] text-white py-3.5 px-5 rounded-full shadow-xl flex items-center justify-between font-bold text-[15px] active:scale-98 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
              <span>{totalCartCount} item{totalCartCount > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>View Cart • €{total.toFixed(2)}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </div>
          </button>
        </div>
      )}

      {/* Footer */}
      <Footer onOpenInfo={setInfoModal} />

      {/* Cart Drawer Panel */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setActiveView('checkout');
        }}
      />

      {/* Quick Direct Order Modal for any product card */}
      <QuickOrderModal
        product={quickOrderProduct}
        deliveryInfo={deliveryInfo}
        onUpdateDeliveryInfo={setDeliveryInfo}
        onClose={() => setQuickOrderProduct(null)}
        onConfirmOrder={(order) => {
          setQuickOrderProduct(null);
          setConfirmedOrder(order);
        }}
        onAddToCart={(prod, qty) => {
          handleAddToCart(prod, qty);
        }}
      />

      {/* Standalone e-Sewa Store QR Modal */}
      {isEsewaQRModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#111c2d]/50 backdrop-blur-xs"
            onClick={() => setIsEsewaQRModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl z-10 animate-in zoom-in-95 border border-[#bfc9bd]/60">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#bfc9bd]/40">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#60bb46] text-white flex items-center justify-center font-bold text-[14px]">
                  e
                </span>
                <h3 className="text-[18px] font-bold text-[#111c2d]">Official e-Sewa QR</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEsewaQRModalOpen(false)}
                className="p-1 rounded-full text-[#707a6f] hover:bg-[#e7eeff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <EsewaQRCard
              showDownloadOptions={true}
              className="border-none shadow-none p-0"
            />
          </div>
        </div>
      )}

      {/* Order Confirmed Celebration Modal */}
      <OrderSuccessModal
        order={confirmedOrder}
        onClose={() => {
          setConfirmedOrder(null);
          setActiveView('home');
        }}
      />

      {/* Informational Policy & Profile Dialogs */}
      <InfoModals
        modalType={infoModal}
        onClose={() => setInfoModal(null)}
      />

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111c2d] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-[14px] border border-[#bfc9bd]/30 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="material-symbols-outlined text-[#8cf5b2] text-[20px]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
