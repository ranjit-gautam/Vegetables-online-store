import React, { useState } from 'react';
import { Product, DeliveryInfo, PaymentMethodType, Order } from '../types';
import { EsewaQRCard } from './EsewaQRCard';

interface QuickOrderModalProps {
  product: Product | null;
  deliveryInfo: DeliveryInfo;
  onUpdateDeliveryInfo: (info: DeliveryInfo) => void;
  onClose: () => void;
  onConfirmOrder: (order: Order) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  product,
  deliveryInfo,
  onUpdateDeliveryInfo,
  onClose,
  onConfirmOrder,
  onAddToCart,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('esewa');
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
  const [addressForm, setAddressForm] = useState<DeliveryInfo>(deliveryInfo);
  const [timeSlot, setTimeSlot] = useState<string>('Instant Express (30 - 45 Mins)');
  const [specialNotes, setSpecialNotes] = useState<string>(deliveryInfo.notes || '');
  const [esewaRef, setEsewaRef] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const subtotal = product.price * quantity;
  const deliveryFee = subtotal >= 25 ? 0 : 2.50;
  const total = subtotal + deliveryFee;
  const nprTotal = Math.round(total * 145);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...addressForm,
      notes: specialNotes,
      timeSlot,
    };
    onUpdateDeliveryInfo(updated);
    setIsEditingAddress(false);
  };

  const handleQuickOrderSubmit = () => {
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

      const newOrder: Order = {
        orderId: generatedOrderId,
        items: [{ product, quantity }],
        subtotal,
        deliveryFee,
        discount: 0,
        total,
        nprTotal,
        deliveryInfo: {
          ...deliveryInfo,
          notes: specialNotes,
          timeSlot,
        },
        paymentMethod,
        paymentRef: paymentMethod === 'esewa' ? (esewaRef.trim() || `ESW-${generatedOrderId.replace('FM-', '')}`) : undefined,
        status: 'confirmed',
        date: formattedDate,
        createdAt: `${formattedDate} at ${formattedTime}`,
        estimatedDelivery: '30 - 45 Minutes',
      };

      // Save to localStorage history
      try {
        const existing = JSON.parse(localStorage.getItem('freshmarket_orders') || '[]');
        localStorage.setItem('freshmarket_orders', JSON.stringify([newOrder, ...existing]));
      } catch (err) {
        console.error('Failed to store order in localStorage', err);
      }

      onConfirmOrder(newOrder);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#111c2d]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-[#bfc9bd]/60 z-10 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#bfc9bd]/40">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#004c22] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </span>
            <div>
              <h2 className="text-[20px] font-bold text-[#111c2d]">1-Click Quick Order</h2>
              <p className="text-[12px] text-[#404940]">Order {product.name} directly with official client order slip</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#707a6f] hover:bg-[#e7eeff] hover:text-[#111c2d] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Product & Quantity Stepper Bar */}
        <div className="bg-[#f0f3ff] rounded-xl p-4 border border-[#bfc9bd]/50 flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="w-16 h-16 bg-white rounded-lg p-1 border border-[#bfc9bd]/40 flex-shrink-0 flex items-center justify-center overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#004c22] uppercase tracking-wider">
                {product.category}
              </span>
              <h3 className="text-[16px] font-bold text-[#111c2d] leading-snug">
                {product.name}
              </h3>
              <p className="text-[13px] text-[#404940]">
                €{product.price.toFixed(2)} / {product.unit} {product.weightOrVolume ? `(${product.weightOrVolume})` : ''}
              </p>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div className="flex items-center bg-white border border-[#bfc9bd] rounded-lg p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-md bg-[#f0f3ff] text-[#004c22] font-bold hover:bg-[#004c22] hover:text-white transition-colors cursor-pointer text-[18px] flex items-center justify-center"
              >
                -
              </button>
              <span className="w-10 text-center font-bold text-[15px] text-[#111c2d]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-md bg-[#004c22] text-white font-bold hover:bg-[#166534] transition-colors cursor-pointer text-[18px] flex items-center justify-center"
              >
                +
              </button>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-[#707a6f] block">Item Subtotal</span>
              <span className="text-[18px] font-extrabold text-[#004c22]">
                €{subtotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Delivery & Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          
          {/* Left Column: Delivery & Summary */}
          <div className="space-y-4">
            {/* Delivery Address Box */}
            <div className="bg-white rounded-xl border border-[#bfc9bd]/60 p-4 space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-[#bfc9bd]/30">
                <h4 className="text-[14px] font-bold text-[#111c2d] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#004c22]">location_on</span>
                  Delivery Address
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-[12px] font-bold text-[#004c22] hover:underline cursor-pointer"
                >
                  {isEditingAddress ? 'Done' : 'Change'}
                </button>
              </div>

              {isEditingAddress ? (
                <form onSubmit={handleSaveAddress} className="space-y-2.5 pt-1 text-[13px]">
                  <input
                    type="text"
                    required
                    placeholder="Recipient Full Name"
                    value={addressForm.name}
                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#bfc9bd] rounded-md focus:border-[#004c22] focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number (e.g. 9803161767)"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#bfc9bd] rounded-md focus:border-[#004c22] focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Street Address / House No."
                    value={addressForm.address}
                    onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#bfc9bd] rounded-md focus:border-[#004c22] focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="City & Area"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#bfc9bd] rounded-md focus:border-[#004c22] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-[#004c22] text-white text-[13px] font-semibold rounded-md hover:bg-[#166534] cursor-pointer"
                  >
                    Save Address
                  </button>
                </form>
              ) : (
                <div className="text-[13px] text-[#404940] space-y-1">
                  <p className="font-bold text-[#111c2d]">{deliveryInfo.name} ({deliveryInfo.phone})</p>
                  <p>{deliveryInfo.address}, {deliveryInfo.area}, {deliveryInfo.city}</p>
                </div>
              )}

              {/* Delivery Time Selector */}
              <div className="pt-2">
                <label className="block text-[11px] font-bold uppercase text-[#004c22] mb-1">
                  Delivery Time Window:
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-1.5 text-[12px] bg-[#f0f3ff] border border-[#bfc9bd] rounded-lg font-medium text-[#111c2d] focus:outline-none"
                >
                  <option value="Instant Express (30 - 45 Mins)">⚡ Instant Express (30 - 45 Mins)</option>
                  <option value="Today Evening (5:00 PM - 7:30 PM)">🌇 Today Evening (5:00 PM - 7:30 PM)</option>
                  <option value="Tomorrow Morning (8:00 AM - 10:30 AM)">🌅 Tomorrow Morning (8:00 AM - 10:30 AM)</option>
                </select>
              </div>

              {/* Special Note / Cake Message */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#004c22] mb-1">
                  Special Note / Cake Inscription:
                </label>
                <input
                  type="text"
                  placeholder='e.g., "Happy Birthday!" or doorbell note'
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-[12px] bg-[#f9f9ff] border border-[#bfc9bd] rounded-lg focus:outline-none focus:border-[#004c22]"
                />
              </div>
            </div>

            {/* Price Breakdown Box */}
            <div className="bg-[#f9f9ff] rounded-xl border border-[#bfc9bd]/60 p-4 space-y-1.5 text-[13px]">
              <div className="flex justify-between text-[#404940]">
                <span>Items Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#404940]">
                <span>Delivery Charge</span>
                <span>{deliveryFee === 0 ? <strong className="text-[#004c22]">FREE</strong> : `€${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-[17px] font-black text-[#004c22] pt-2 border-t border-[#bfc9bd]/40">
                <span>Grand Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <div className="text-right text-[11px] text-[#707a6f]">
                Approx. <strong>Rs. {nprTotal.toLocaleString()} NPR</strong>
              </div>
            </div>

            {/* Add to regular cart option */}
            <button
              type="button"
              onClick={() => {
                onAddToCart(product, quantity);
                onClose();
              }}
              className="w-full py-2.5 px-4 bg-[#f0f3ff] text-[#004c22] hover:bg-[#e7eeff] border border-[#004c22]/30 rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              Add to Cart Instead
            </button>
          </div>

          {/* Right Column: Payment Methods & Esewa QR */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-bold text-[#111c2d] flex items-center justify-between">
              <span>Select Payment</span>
              <span className="text-[11px] text-[#007241] bg-[#e7eeff] px-2 py-0.5 rounded-full font-bold">
                eSewa: 9803161767
              </span>
            </h4>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('esewa')}
                className={`py-2 px-2 rounded-lg text-[12px] font-bold text-center border transition-all cursor-pointer ${
                  paymentMethod === 'esewa'
                    ? 'bg-[#004c22] text-white border-[#004c22] shadow-xs'
                    : 'bg-[#f0f3ff] text-[#404940] border-[#bfc9bd]/50 hover:bg-[#e7eeff]'
                }`}
              >
                e-Sewa QR
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`py-2 px-2 rounded-lg text-[12px] font-bold text-center border transition-all cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'bg-[#004c22] text-white border-[#004c22] shadow-xs'
                    : 'bg-[#f0f3ff] text-[#404940] border-[#bfc9bd]/50 hover:bg-[#e7eeff]'
                }`}
              >
                Cash on Del.
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-2 rounded-lg text-[12px] font-bold text-center border transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-[#004c22] text-white border-[#004c22] shadow-xs'
                    : 'bg-[#f0f3ff] text-[#404940] border-[#bfc9bd]/50 hover:bg-[#e7eeff]'
                }`}
              >
                Card
              </button>
            </div>

            {/* Payment Display Container */}
            {paymentMethod === 'esewa' && (
              <div className="space-y-2">
                <EsewaQRCard
                  amount={total}
                  showDownloadOptions={true}
                  className="w-full"
                />
                <input
                  type="text"
                  placeholder="eSewa Txn Ref (Optional)"
                  value={esewaRef}
                  onChange={(e) => setEsewaRef(e.target.value)}
                  className="w-full px-3 py-1.5 text-[12px] bg-[#f0f3ff] border border-[#bfc9bd] rounded-lg focus:outline-none"
                />
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="bg-[#f0f3ff] border border-[#bfc9bd]/60 rounded-xl p-5 text-center space-y-2">
                <span className="material-symbols-outlined text-[36px] text-[#004c22]">
                  local_shipping
                </span>
                <h5 className="text-[15px] font-bold text-[#111c2d]">Cash on Delivery</h5>
                <p className="text-[13px] text-[#404940]">
                  Pay <strong>€{total.toFixed(2)}</strong> (approx. Rs. {nprTotal.toLocaleString()}) directly to our courier when your fresh delivery arrives.
                </p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="bg-[#f0f3ff] border border-[#bfc9bd]/60 rounded-xl p-4 space-y-2.5">
                <span className="text-[13px] font-bold text-[#004c22] block">Card Payment</span>
                <input
                  type="text"
                  placeholder="Card Number (4000 1234 5678 9010)"
                  className="w-full px-3 py-2 text-[13px] bg-white border border-[#bfc9bd] rounded-lg focus:outline-none"
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

            {/* Confirm & Place Quick Order Button */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleQuickOrderSubmit}
              className="w-full bg-[#004c22] hover:bg-[#166534] disabled:opacity-50 text-white font-extrabold text-[15px] py-3.5 rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Slip...
                </>
              ) : (
                <>
                  <span>
                    {paymentMethod === 'esewa'
                      ? 'Confirm & Get Client Order Slip'
                      : 'Place Order & View Slip'}
                  </span>
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
