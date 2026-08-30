import React, { useState } from 'react';
import { CartItem, DeliveryInfo, PaymentMethodType, Order } from '../types';
import { EsewaQRCard } from './EsewaQRCard';

interface CheckoutViewProps {
  cartItems: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryInfo: DeliveryInfo;
  onUpdateDeliveryInfo: (info: DeliveryInfo) => void;
  onBackToShopping: () => void;
  onConfirmOrder: (order: Order) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  subtotal,
  deliveryFee: initialDeliveryFee,
  total: initialTotal,
  deliveryInfo,
  onUpdateDeliveryInfo,
  onBackToShopping,
  onConfirmOrder,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType>('esewa');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState<DeliveryInfo>(deliveryInfo);
  const [timeSlot, setTimeSlot] = useState<string>('Instant Express (30 - 45 Mins)');
  const [specialNotes, setSpecialNotes] = useState<string>(deliveryInfo.notes || '');
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [esewaRef, setEsewaRef] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate fees and totals with discount
  const deliveryFee = subtotal >= 25 ? 0 : initialDeliveryFee;
  const grandTotal = Math.max(0, subtotal + deliveryFee - appliedDiscount);
  const nprTotal = Math.round(grandTotal * 145);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'FRESH10') {
      const discount = subtotal * 0.1;
      setAppliedDiscount(discount);
      setPromoMessage({ text: `Code FRESH10 applied! Saved €${discount.toFixed(2)}`, isError: false });
    } else if (code === 'FRESHDEL' || code === 'FREESHIP') {
      setAppliedDiscount(deliveryFee);
      setPromoMessage({ text: 'Free delivery voucher applied!', isError: false });
    } else if (code === 'WELCOME') {
      const discount = 2.00;
      setAppliedDiscount(discount);
      setPromoMessage({ text: 'Welcome voucher applied (-€2.00)!', isError: false });
    } else if (!code) {
      setPromoMessage(null);
      setAppliedDiscount(0);
    } else {
      setPromoMessage({ text: 'Invalid promo code. Try FRESH10 or FRESHDEL', isError: true });
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: DeliveryInfo = {
      ...addressForm,
      notes: specialNotes,
      timeSlot,
    };
    onUpdateDeliveryInfo(updated);
    setIsEditingAddress(false);
  };

  const handleFinalOrderSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedOrderId = `FM-${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const formattedTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const fullOrder: Order = {
        orderId: generatedOrderId,
        items: [...cartItems],
        subtotal,
        deliveryFee,
        discount: appliedDiscount,
        total: grandTotal,
        nprTotal,
        deliveryInfo: {
          ...deliveryInfo,
          notes: specialNotes,
          timeSlot,
        },
        paymentMethod: selectedPayment,
        paymentRef: selectedPayment === 'esewa' ? (esewaRef.trim() || `ESW-${generatedOrderId.replace('FM-', '')}`) : undefined,
        status: 'confirmed',
        date: formattedDate,
        createdAt: `${formattedDate} at ${formattedTime}`,
        estimatedDelivery: '30 - 45 Minutes',
      };

      // Save order to history in localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('freshmarket_orders') || '[]');
        localStorage.setItem('freshmarket_orders', JSON.stringify([fullOrder, ...existing]));
      } catch (err) {
        console.error('Failed to save order to localStorage', err);
      }

      onConfirmOrder(fullOrder);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <main className="flex-grow max-w-[1280px] mx-auto px-4 md:px-6 py-6 md:py-10 w-full animate-in fade-in-50 duration-300">
      
      {/* Top Navigation / Breadcrumb */}
      <div className="mb-6 md:mb-8">
        <button
          type="button"
          id="checkout-back-button"
          onClick={onBackToShopping}
          className="flex items-center text-[#004c22] text-[14px] hover:underline cursor-pointer transition-colors font-medium mb-3"
        >
          <span className="material-symbols-outlined mr-1 text-[20px]">arrow_back</span>
          Back to Groceries & Farm Market
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-[26px] md:text-[32px] font-extrabold text-[#004c22] tracking-tight">
              Checkout & Order Confirmation
            </h1>
            <p className="text-[14px] text-[#404940] mt-0.5">
              Review your fresh items, schedule delivery, and get your official client order slip.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[12px] font-bold text-[#007241] bg-[#e7eeff] px-3.5 py-1.5 rounded-full border border-[#004c22]/20 w-fit">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Store Owner: Ranjit Gautam (9803161767)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
        
        {/* Left Column: Order Items & Delivery Configuration (md:col-span-7) */}
        <div className="md:col-span-7 flex flex-col gap-6">
          
          {/* Order Summary Card */}
          <div className="bg-white rounded-2xl border border-[#bfc9bd]/60 p-5 md:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#bfc9bd]/40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004c22]">shopping_bag</span>
                <h2 className="text-[18px] md:text-[20px] font-bold text-[#111c2d]">
                  Selected Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
                </h2>
              </div>
              <span className="text-[12px] text-[#007241] font-bold bg-[#f0f3ff] px-2.5 py-1 rounded-full">
                Fresh & Inspected
              </span>
            </div>

            {cartItems.length === 0 ? (
              <div className="py-8 text-center text-[#707a6f] space-y-2">
                <span className="material-symbols-outlined text-[36px]">remove_shopping_cart</span>
                <p className="text-[15px] font-medium">Your cart is currently empty.</p>
                <button
                  type="button"
                  onClick={onBackToShopping}
                  className="mt-2 inline-block px-4 py-2 bg-[#004c22] text-white rounded-lg text-[13px] font-bold"
                >
                  Browse Fresh Groceries & Cakes
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-[#bfc9bd]/40 mb-4 max-h-[360px] overflow-y-auto pr-1">
                {cartItems.map(({ product, quantity }) => (
                  <li key={product.id} className="py-3.5 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-14 h-14 bg-[#f0f3ff] rounded-lg overflow-hidden flex-shrink-0 border border-[#bfc9bd]/40 p-1 flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[14px] md:text-[15px] font-bold text-[#111c2d] truncate">
                          {product.name}
                        </h3>
                        <p className="text-[12px] text-[#404940]">
                          {quantity}x • €{product.price.toFixed(2)} / {product.unit} {product.weightOrVolume ? `(${product.weightOrVolume})` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="text-[15px] md:text-[17px] font-extrabold text-[#111c2d] whitespace-nowrap">
                      €{(product.price * quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Calculations Breakdown */}
            <div className="border-t border-[#bfc9bd]/40 pt-4 space-y-2 text-[14px]">
              <div className="flex justify-between text-[#404940]">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#111c2d]">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#404940]">
                <span>Delivery Charge</span>
                <span>
                  {deliveryFee === 0 ? (
                    <strong className="text-[#004c22]">FREE (Orders over €25)</strong>
                  ) : (
                    `€${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-[#007241] font-bold">
                  <span>Voucher Discount</span>
                  <span>-€{appliedDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 mt-2 border-t-2 border-[#004c22] text-[20px] font-black text-[#004c22]">
                <span>Total Amount</span>
                <span>€{grandTotal.toFixed(2)}</span>
              </div>
              <div className="text-right text-[11px] text-[#707a6f] font-semibold">
                Approx. <strong>Rs. {nprTotal.toLocaleString()} NPR</strong>
              </div>
            </div>

            {/* Promo Code Input Box */}
            <form onSubmit={handleApplyPromo} className="mt-4 pt-3 border-t border-[#bfc9bd]/40 flex gap-2">
              <input
                type="text"
                placeholder="Promo code (e.g. FRESH10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-3 py-2 text-[13px] uppercase tracking-wider bg-[#f0f3ff] border border-[#bfc9bd] rounded-lg focus:outline-none focus:border-[#004c22]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#004c22] hover:bg-[#166534] text-white font-bold text-[13px] rounded-lg transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>
            {promoMessage && (
              <p className={`text-[12px] font-semibold mt-1.5 ${promoMessage.isError ? 'text-[#ba1a1a]' : 'text-[#007241]'}`}>
                {promoMessage.text}
              </p>
            )}
          </div>

          {/* Delivery Details & Schedule Card */}
          <div className="bg-white rounded-2xl border border-[#bfc9bd]/60 p-5 md:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#bfc9bd]/40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004c22]">location_on</span>
                <h2 className="text-[18px] md:text-[20px] font-bold text-[#111c2d]">
                  Client Delivery Details
                </h2>
              </div>
              <button
                type="button"
                id="edit-address-button"
                onClick={() => setIsEditingAddress(!isEditingAddress)}
                className="text-[13px] font-bold text-[#004c22] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                {isEditingAddress ? 'Done Editing' : 'Change Address'}
              </button>
            </div>

            {isEditingAddress ? (
              <form onSubmit={handleSaveAddress} className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-[#404940] mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.name}
                      onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-[14px] border border-[#bfc9bd] rounded-lg focus:outline-none focus:border-[#004c22]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#404940] mb-1">
                      Phone Number * (e.g. 9803161767)
                    </label>
                    <input
                      type="tel"
                      required
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="w-full px-3 py-2 text-[14px] border border-[#bfc9bd] rounded-lg focus:outline-none focus:border-[#004c22]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#404940] mb-1">
                    Street Address / House No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.address}
                    onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                    className="w-full px-3 py-2 text-[14px] border border-[#bfc9bd] rounded-lg focus:outline-none focus:border-[#004c22]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-[#404940] mb-1">
                      Area / Neighborhood
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.area}
                      onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })}
                      className="w-full px-3 py-2 text-[14px] border border-[#bfc9bd] rounded-lg focus:outline-none focus:border-[#004c22]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#404940] mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full px-3 py-2 text-[14px] border border-[#bfc9bd] rounded-lg focus:outline-none focus:border-[#004c22]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#004c22] text-white font-bold rounded-lg hover:bg-[#166534] transition-colors text-[14px] cursor-pointer shadow-xs"
                >
                  Save Delivery Address
                </button>
              </form>
            ) : (
              <div className="flex items-start gap-3 bg-[#f9f9ff] p-4 rounded-xl border border-[#bfc9bd]/40">
                <span className="material-symbols-outlined text-[#004c22] text-[24px] mt-0.5">
                  home_pin
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[15px] font-bold text-[#111c2d]">
                      {deliveryInfo.name}
                    </p>
                    <span className="text-[13px] font-bold text-[#004c22]">
                      📞 {deliveryInfo.phone}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#404940] mt-1 leading-relaxed">
                    {deliveryInfo.address}, {deliveryInfo.area}, {deliveryInfo.city}
                  </p>
                </div>
              </div>
            )}

            {/* Delivery Time Slot Selector */}
            <div className="space-y-2">
              <label className="block text-[12px] font-bold uppercase tracking-wider text-[#004c22]">
                Choose Preferred Delivery Time:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { slot: 'Instant Express (30 - 45 Mins)', label: '⚡ Instant (30-45 Mins)' },
                  { slot: 'Today Evening (5:00 PM - 7:30 PM)', label: '🌇 Today 5-7:30 PM' },
                  { slot: 'Tomorrow Morning (8:00 AM - 10:30 AM)', label: '🌅 Tomorrow 8-10:30 AM' },
                ].map((item) => (
                  <button
                    key={item.slot}
                    type="button"
                    onClick={() => setTimeSlot(item.slot)}
                    className={`py-2 px-3 rounded-lg text-[12px] font-bold text-center border transition-all cursor-pointer ${
                      timeSlot === item.slot
                        ? 'bg-[#004c22] text-white border-[#004c22] shadow-xs'
                        : 'bg-[#f0f3ff] text-[#404940] border-[#bfc9bd]/50 hover:bg-[#e7eeff]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Instructions / Cake Message */}
            <div className="space-y-1.5">
              <label className="block text-[12px] font-bold text-[#404940]">
                Special Instructions / Custom Cake Inscription (Optional):
              </label>
              <input
                type="text"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder='e.g., "Happy Birthday Ryan!" on cake, or "Leave at front porch"'
                className="w-full px-3.5 py-2.5 text-[13px] bg-[#f9f9ff] border border-[#bfc9bd] rounded-lg focus:outline-none focus:border-[#004c22]"
              />
            </div>

          </div>

        </div>

        {/* Right Column: Payment Selection & eSewa QR (md:col-span-5) */}
        <div className="md:col-span-5">
          <div className="bg-white rounded-2xl border border-[#bfc9bd]/60 p-5 md:p-6 shadow-xs sticky top-24 flex flex-col space-y-4">
            
            <div>
              <h2 className="text-[18px] md:text-[20px] font-bold text-[#111c2d]">
                Payment Method
              </h2>
              <p className="text-[13px] text-[#404940] mt-0.5">
                Pay seamlessly with official eSewa QR or Cash on Delivery.
              </p>
            </div>

            {/* Payment Method Selector Pills */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedPayment('esewa')}
                className={`py-2.5 px-2 rounded-xl text-[13px] font-extrabold text-center border transition-all cursor-pointer ${
                  selectedPayment === 'esewa'
                    ? 'bg-[#004c22] text-white border-[#004c22] shadow-xs'
                    : 'bg-[#f0f3ff] text-[#404940] border-[#bfc9bd]/50 hover:bg-[#e7eeff]'
                }`}
              >
                e-Sewa QR
              </button>
              <button
                type="button"
                onClick={() => setSelectedPayment('cod')}
                className={`py-2.5 px-2 rounded-xl text-[13px] font-extrabold text-center border transition-all cursor-pointer ${
                  selectedPayment === 'cod'
                    ? 'bg-[#004c22] text-white border-[#004c22] shadow-xs'
                    : 'bg-[#f0f3ff] text-[#404940] border-[#bfc9bd]/50 hover:bg-[#e7eeff]'
                }`}
              >
                Cash on Del.
              </button>
              <button
                type="button"
                onClick={() => setSelectedPayment('card')}
                className={`py-2.5 px-2 rounded-xl text-[13px] font-extrabold text-center border transition-all cursor-pointer ${
                  selectedPayment === 'card'
                    ? 'bg-[#004c22] text-white border-[#004c22] shadow-xs'
                    : 'bg-[#f0f3ff] text-[#404940] border-[#bfc9bd]/50 hover:bg-[#e7eeff]'
                }`}
              >
                Card Pay
              </button>
            </div>

            {/* Payment Container Display */}
            {selectedPayment === 'esewa' && (
              <div className="space-y-3">
                <EsewaQRCard
                  amount={grandTotal}
                  showDownloadOptions={true}
                  className="w-full"
                />

                {/* Optional eSewa Transaction Reference */}
                <div className="bg-[#f0f3ff] p-3 rounded-xl border border-[#bfc9bd]/50 space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase text-[#004c22]">
                    eSewa Transaction Ref ID (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 78492019"
                    value={esewaRef}
                    onChange={(e) => setEsewaRef(e.target.value)}
                    className="w-full px-3 py-1.5 text-[13px] bg-white border border-[#bfc9bd] rounded-lg focus:outline-none focus:border-[#004c22]"
                  />
                  <p className="text-[11px] text-[#707a6f]">
                    Scan QR via eSewa App, send payment to <strong>9803161767</strong>, then click Confirm Order below!
                  </p>
                </div>
              </div>
            )}

            {selectedPayment === 'cod' && (
              <div className="p-5 bg-[#f0f3ff] rounded-xl border border-[#bfc9bd]/60 text-center space-y-2">
                <span className="material-symbols-outlined text-[36px] text-[#004c22]">
                  local_shipping
                </span>
                <h4 className="text-[15px] font-bold text-[#111c2d]">
                  Pay Cash upon Delivery
                </h4>
                <p className="text-[13px] text-[#404940]">
                  Please keep exact cash of <strong>€{grandTotal.toFixed(2)}</strong> (approx. Rs. {nprTotal.toLocaleString()}) ready when our delivery rider arrives.
                </p>
              </div>
            )}

            {selectedPayment === 'card' && (
              <div className="p-4 bg-[#f0f3ff] rounded-xl border border-[#bfc9bd]/60 space-y-3">
                <div className="flex items-center gap-2 text-[#004c22]">
                  <span className="material-symbols-outlined text-[20px]">credit_card</span>
                  <span className="text-[13px] font-bold">Direct Card Payment</span>
                </div>
                <input
                  type="text"
                  placeholder="Card Number (4000 1234 5678 9010)"
                  className="w-full px-3 py-2 text-[13px] bg-white border border-[#bfc9bd] rounded-lg focus:outline-none focus:border-[#004c22]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="px-3 py-2 text-[13px] bg-white border border-[#bfc9bd] rounded-lg focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="px-3 py-2 text-[13px] bg-white border border-[#bfc9bd] rounded-lg focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 bg-[#f9f9ff] p-2 rounded-lg border border-[#bfc9bd]/40 text-[#404940]">
              <span className="material-symbols-outlined text-[#004c22] text-[16px]">lock</span>
              <span className="text-[11px] font-bold tracking-wider uppercase">
                Official Client Order Slip Generated Instantly
              </span>
            </div>

            {/* Confirm Order & Generate Client Order Slip Button */}
            <button
              type="button"
              id="confirm-order-button"
              disabled={cartItems.length === 0 || isSubmitting}
              onClick={handleFinalOrderSubmit}
              className="w-full bg-[#004c22] hover:bg-[#166534] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-[16px] py-4 rounded-full transition-all active:scale-98 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating Order Slip...
                </>
              ) : (
                <>
                  <span>
                    {selectedPayment === 'esewa'
                      ? 'Confirm & Generate Order Slip'
                      : 'Place Order & Get Order Slip'}
                  </span>
                  <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </main>
  );
};
