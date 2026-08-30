import React, { useState } from 'react';
import { CategoryId } from '../types';

interface NavbarProps {
  activeView: 'home' | 'groceries' | 'checkout';
  activeCategory: CategoryId;
  onNavigate: (view: 'home' | 'groceries' | 'checkout', category?: CategoryId) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenProfile: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  activeCategory,
  onNavigate,
  cartCount,
  onOpenCart,
  onOpenProfile,
  onOpenAbout,
  onOpenContact,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (category: CategoryId) => {
    onNavigate('groceries', category);
    setMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    onNavigate('home');
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeView !== 'groceries') {
      onNavigate('groceries');
    }
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-[#f9f9ff] border-b border-[#bfc9bd]/60 shadow-xs backdrop-blur-md bg-opacity-95">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 flex items-center justify-between h-20">
        
        {/* Brand & Left Search */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Mobile menu trigger */}
          <button
            type="button"
            id="mobile-menu-button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#111c2d] hover:bg-[#e7eeff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          {/* Logo */}
          <button
            type="button"
            id="brand-logo-button"
            onClick={handleHomeClick}
            className="flex items-center gap-2 cursor-pointer group focus:outline-none"
          >
            <span className="text-[22px] md:text-[24px] font-bold tracking-tight text-[#004c22] group-hover:text-[#166534] transition-colors">
              FreshMarket
            </span>
          </button>

          {/* Search Box on Desktop */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex items-center bg-[#f0f3ff] rounded-lg px-3 py-2 border border-[#bfc9bd]/60 w-56 xl:w-64 text-[#404940] focus-within:border-[#004c22] focus-within:ring-1 focus-within:ring-[#004c22] transition-all"
          >
            <span className="material-symbols-outlined text-[20px] mr-2 text-[#707a6f]">search</span>
            <input
              id="desktop-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search groceries..."
              className="bg-transparent border-none focus:outline-none p-0 text-[13px] leading-[20px] w-full placeholder:text-[#707a6f]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="text-[#707a6f] hover:text-[#111c2d] text-[16px] p-0.5 cursor-pointer"
              >
                ✕
              </button>
            )}
          </form>
        </div>

        {/* Center Navigation Links on Desktop (Home, Groceries, About Us, Contact Us) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            type="button"
            id="nav-home"
            onClick={handleHomeClick}
            className={`text-[14px] lg:text-[15px] font-medium px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeView === 'home'
                ? 'text-[#004c22] font-bold bg-[#e7eeff]'
                : 'text-[#404940] hover:text-[#004c22] hover:bg-[#f0f3ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            <span>Home</span>
          </button>

          <button
            type="button"
            id="nav-groceries"
            onClick={() => onNavigate('groceries', 'all')}
            className={`text-[14px] lg:text-[15px] font-medium px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeView === 'groceries'
                ? 'text-[#004c22] font-bold bg-[#e7eeff]'
                : 'text-[#404940] hover:text-[#004c22] hover:bg-[#f0f3ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span>Shop Groceries</span>
          </button>

          <button
            type="button"
            id="nav-about-us"
            onClick={onOpenAbout}
            className="text-[14px] lg:text-[15px] font-medium px-3 py-2 rounded-lg text-[#404940] hover:text-[#004c22] hover:bg-[#f0f3ff] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">info</span>
            <span>About Us</span>
          </button>

          <button
            type="button"
            id="nav-contact-us"
            onClick={onOpenContact}
            className="text-[14px] lg:text-[15px] font-medium px-3 py-2 rounded-lg text-[#404940] hover:text-[#004c22] hover:bg-[#f0f3ff] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">contact_support</span>
            <span>Contact Us</span>
          </button>
        </nav>

        {/* Trailing Controls (Order Button, Cart & Profile) */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            id="nav-order-button"
            onClick={() => onNavigate('checkout')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#004c22] text-white hover:bg-[#166534] active:scale-95 transition-all text-[13px] font-bold shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">shopping_bag</span>
            <span>Order Now</span>
          </button>

          {/* Add to Cart / View Cart Icon Button */}
          <button
            type="button"
            id="cart-icon-button"
            aria-label="View Cart"
            onClick={onOpenCart}
            className="relative p-2.5 rounded-full text-[#004c22] hover:bg-[#e7eeff] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
            <span className="hidden xl:inline text-[13px] font-bold">Cart</span>
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 xl:static bg-[#004c22] text-white text-[11px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in-75">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            id="profile-icon-button"
            aria-label="User Account"
            onClick={onOpenProfile}
            className="p-2.5 rounded-full text-[#004c22] hover:bg-[#e7eeff] active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">person</span>
          </button>
        </div>
      </div>

      {/* Mobile Search & Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#bfc9bd]/40 px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-[#f0f3ff] rounded-lg px-3 py-2 border border-[#bfc9bd]/60">
            <span className="material-symbols-outlined text-[20px] mr-2 text-[#707a6f]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search groceries..."
              className="bg-transparent border-none focus:outline-none text-[14px] w-full text-[#111c2d]"
            />
            {searchQuery && (
              <button type="button" onClick={() => onSearchChange('')} className="text-[#707a6f]">✕</button>
            )}
          </form>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              id="mobile-nav-home"
              onClick={handleHomeClick}
              className={`p-2.5 rounded-lg text-left text-[14px] font-medium flex items-center gap-2 ${
                activeView === 'home' ? 'bg-[#e7eeff] text-[#004c22] font-semibold' : 'text-[#404940] hover:bg-[#f0f3ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              Home
            </button>

            <button
              type="button"
              id="mobile-nav-groceries"
              onClick={() => { onNavigate('groceries', 'all'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left text-[14px] font-medium flex items-center gap-2 ${
                activeView === 'groceries' && activeCategory === 'all' ? 'bg-[#e7eeff] text-[#004c22] font-semibold' : 'text-[#404940] hover:bg-[#f0f3ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              Shop Groceries
            </button>

            <button
              type="button"
              id="mobile-nav-about"
              onClick={() => { onOpenAbout(); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg text-left text-[14px] font-medium flex items-center gap-2 text-[#404940] hover:bg-[#f0f3ff]"
            >
              <span className="material-symbols-outlined text-[18px]">info</span>
              About Us
            </button>

            <button
              type="button"
              id="mobile-nav-contact"
              onClick={() => { onOpenContact(); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg text-left text-[14px] font-medium flex items-center gap-2 text-[#404940] hover:bg-[#f0f3ff]"
            >
              <span className="material-symbols-outlined text-[18px]">contact_support</span>
              Contact Us
            </button>

            <button
              type="button"
              id="mobile-nav-cart"
              onClick={() => { onOpenCart(); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg text-left text-[14px] font-medium flex items-center gap-2 text-[#004c22] bg-[#f0f3ff]"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
              My Cart ({cartCount})
            </button>

            <button
              type="button"
              id="mobile-nav-order"
              onClick={() => { onNavigate('checkout'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg text-left text-[14px] font-bold flex items-center gap-2 text-white bg-[#004c22] hover:bg-[#166534]"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              Order Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
