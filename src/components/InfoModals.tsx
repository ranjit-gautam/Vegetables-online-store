import React, { useState } from 'react';

export type InfoModalType = 'about' | 'shipping' | 'returns' | 'privacy' | 'contact' | 'profile' | null;

interface InfoModalsProps {
  modalType: InfoModalType;
  onClose: () => void;
}

export const InfoModals: React.FC<InfoModalsProps> = ({ modalType, onClose }) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  if (!modalType) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#111c2d]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-[#bfc9bd]/60 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Modal Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#707a6f] hover:bg-[#e7eeff] hover:text-[#111c2d] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {modalType === 'about' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-[#004c22]">
              <span className="material-symbols-outlined text-[28px]">eco</span>
              <h3 className="text-[22px] font-bold">About FreshMarket</h3>
            </div>
            <p className="text-[14px] text-[#404940] leading-relaxed">
              FreshMarket was founded by <strong>Ranjit Gautam</strong> with a single mission: to reconnect families with true garden freshness. We partner directly with certified organic regional farmers to harvest produce at dawn and deliver straight to your doorstep before sunset.
            </p>
            <div className="bg-[#f0f3ff] p-4 rounded-xl space-y-2 border border-[#bfc9bd]/40">
              <h4 className="text-[14px] font-bold text-[#004c22]">Store Ownership & Operations:</h4>
              <p className="text-[13px] text-[#111c2d] font-semibold">
                Owner: Ranjit Gautam
              </p>
              <p className="text-[13px] text-[#404940]">
                Contact / eSewa: 9803161767 • Email: gautamranjit99@gmail.com
              </p>
            </div>
            <div className="bg-[#e7eeff] p-4 rounded-xl space-y-2 border border-[#bfc9bd]/40">
              <h4 className="text-[14px] font-bold text-[#004c22]">Our Fresh Promise:</h4>
              <ul className="text-[13px] text-[#404940] space-y-1 list-disc list-inside">
                <li>100% Pesticide-free verified organic farms</li>
                <li>Zero single-use plastics in grocery packaging</li>
                <li>Carbon-neutral electric cold-chain delivery</li>
              </ul>
            </div>
          </div>
        )}

        {modalType === 'shipping' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-[#004c22]">
              <span className="material-symbols-outlined text-[28px]">local_shipping</span>
              <h3 className="text-[22px] font-bold">Shipping & Delivery Policy</h3>
            </div>
            <div className="space-y-3 text-[14px] text-[#404940] leading-relaxed">
              <p>
                <strong>⚡ Express 30-45 Minute Delivery:</strong> All standard local orders are fulfilled from our hyper-local temperature-controlled hubs.
              </p>
              <p>
                <strong>📦 Free Delivery Threshold:</strong> Free delivery on all orders over <strong>€25.00</strong>. Standard flat rate is €2.50 for smaller orders.
              </p>
              <p>
                <strong>❄️ Cold-Chain Freshness:</strong> Dairy, produce, and juices are kept at optimal temperature until placed into your hands.
              </p>
            </div>
          </div>
        )}

        {modalType === 'returns' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-[#004c22]">
              <span className="material-symbols-outlined text-[28px]">assignment_return</span>
              <h3 className="text-[22px] font-bold">100% Freshness Guarantee & Returns</h3>
            </div>
            <p className="text-[14px] text-[#404940] leading-relaxed">
              If any fruit, vegetable, bakery loaf, or dairy item arrives below your freshness expectations, we will issue an instant refund or free replacement without asking you to return the item.
            </p>
            <div className="bg-[#e7eeff] p-3 rounded-lg text-[13px] text-[#004c22]">
              Simply contact our support within 24 hours of delivery.
            </div>
          </div>
        )}

        {modalType === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-[#004c22]">
              <span className="material-symbols-outlined text-[28px]">security</span>
              <h3 className="text-[22px] font-bold">Privacy & Security</h3>
            </div>
            <p className="text-[14px] text-[#404940] leading-relaxed">
              Your personal data, home address, and payment information are encrypted end-to-end with AES-256 standard encryption. We never sell your personal information to third parties.
            </p>
          </div>
        )}

        {modalType === 'contact' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-[#004c22]">
              <span className="material-symbols-outlined text-[28px]">contact_support</span>
              <h3 className="text-[22px] font-bold">Contact FreshMarket Support</h3>
            </div>
            {contactSubmitted ? (
              <div className="p-4 bg-[#e7eeff] rounded-xl text-center space-y-2 text-[#004c22]">
                <span className="material-symbols-outlined text-[32px]">check_circle</span>
                <h4 className="font-bold">Message Received!</h4>
                <p className="text-[13px] text-[#404940]">Our customer care specialist will reach back out in under 15 minutes.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setContactSubmitted(true);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[12px] font-medium text-[#404940] mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-[14px] border border-[#bfc9bd] rounded-lg focus:outline-none focus:border-[#004c22]"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#404940] mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-[14px] border border-[#bfc9bd] rounded-lg focus:outline-none focus:border-[#004c22]"
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#404940] mb-1">Message</label>
                  <textarea
                    rows={3}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-3 py-2 text-[14px] border border-[#bfc9bd] rounded-lg focus:outline-none focus:border-[#004c22]"
                    placeholder="How can we help with your order?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#004c22] text-white font-semibold rounded-lg hover:bg-[#166534] transition-colors text-[14px]"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        )}

        {modalType === 'profile' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#004c22] text-white flex items-center justify-center text-[20px] font-bold">
                RG
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-[#111c2d]">Ranjit Gautam</h3>
                <p className="text-[13px] text-[#404940]">gautamranjit99@gmail.com</p>
              </div>
            </div>

            <div className="bg-[#f0f3ff] p-4 rounded-xl space-y-2 border border-[#bfc9bd]/40 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#404940]">Membership:</span>
                <span className="font-bold text-[#004c22]">FreshMarket Gold Tier</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#404940]">Saved Address:</span>
                <span className="font-medium text-[#111c2d]">123 Fresh Lane, Green District</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#404940]">Payment Connected:</span>
                <span className="font-semibold text-[#007241]">e-Sewa (9803161767)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-[#004c22] text-white font-semibold rounded-lg hover:bg-[#166534] transition-colors text-[14px]"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
