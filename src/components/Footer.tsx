import React from 'react';

interface FooterProps {
  onOpenInfo: (modalType: 'about' | 'shipping' | 'returns' | 'privacy' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenInfo }) => {
  return (
    <footer className="w-full mt-12 bg-white border-t border-[#bfc9bd]/60">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Brand and Copyright */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-[20px] font-bold text-[#004c22]">
            FreshMarket
          </span>
          <p className="text-[14px] text-[#111c2d] font-semibold">
            Owner: <span className="text-[#004c22]">Ranjit Gautam</span>
          </p>
          <p className="text-[13px] text-[#707a6f] font-normal">
            © 2024 FreshMarket. All rights reserved. • eSewa / Tel: 9803161767
          </p>
        </div>

        {/* Footer Navigation Links */}
        <nav className="flex flex-wrap justify-center md:justify-end gap-5 md:gap-8">
          <button
            type="button"
            onClick={() => onOpenInfo('about')}
            className="text-[14px] text-[#404940] hover:text-[#004c22] transition-colors cursor-pointer"
          >
            About Us
          </button>
          <button
            type="button"
            onClick={() => onOpenInfo('shipping')}
            className="text-[14px] text-[#404940] hover:text-[#004c22] transition-colors cursor-pointer"
          >
            Shipping Policy
          </button>
          <button
            type="button"
            onClick={() => onOpenInfo('returns')}
            className="text-[14px] text-[#404940] hover:text-[#004c22] transition-colors cursor-pointer"
          >
            Returns
          </button>
          <button
            type="button"
            onClick={() => onOpenInfo('privacy')}
            className="text-[14px] text-[#404940] hover:text-[#004c22] transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => onOpenInfo('contact')}
            className="text-[14px] text-[#404940] hover:text-[#004c22] transition-colors cursor-pointer"
          >
            Contact Support
          </button>
        </nav>

      </div>
    </footer>
  );
};
