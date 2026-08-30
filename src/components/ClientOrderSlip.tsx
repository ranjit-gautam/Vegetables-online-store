import React, { useState } from 'react';
import { Order } from '../types';

interface ClientOrderSlipProps {
  order: Order;
  onClose?: () => void;
  onContinueShopping?: () => void;
  isModal?: boolean;
}

export const ClientOrderSlip: React.FC<ClientOrderSlipProps> = ({
  order,
  onClose,
  onContinueShopping,
  isModal = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  // Conversion rate for convenience (1 EUR ~ 145 NPR)
  const nprRate = 145;
  const nprTotal = Math.round(order.total * nprRate);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySlip = () => {
    const slipText = `
========================================
       FRESHMARKET - CLIENT ORDER SLIP
========================================
Order Reference: ${order.orderId}
Date & Time: ${order.createdAt || order.date}
Status: ${order.status?.toUpperCase() || 'CONFIRMED'}
Estimated Delivery: ${order.estimatedDelivery || '30 - 45 Minutes'}
Delivery Slot: ${order.deliveryInfo.timeSlot || 'Instant ASAP'}

CUSTOMER DETAILS:
Name: ${order.deliveryInfo.name}
Phone: ${order.deliveryInfo.phone}
Address: ${order.deliveryInfo.address}, ${order.deliveryInfo.area}
City: ${order.deliveryInfo.city} ${order.deliveryInfo.postalCode ? `(${order.deliveryInfo.postalCode})` : ''}
${order.deliveryInfo.notes ? `Special Notes / Cake Message: ${order.deliveryInfo.notes}` : ''}

STORE & MERCHANT:
FreshMarket Kathmandu Hub
Merchant: Ranjit Gautam (Phone/eSewa: 9803161767)
Email: gautamranjit99@gmail.com

ORDERED ITEMS:
${order.items.map((item, idx) => `${idx + 1}. ${item.product.name} - ${item.quantity}x €${item.product.price.toFixed(2)} = €${(item.product.price * item.quantity).toFixed(2)}`).join('\n')}

FINANCIAL BREAKDOWN:
Items Subtotal: €${order.subtotal.toFixed(2)}
Delivery Charge: ${order.deliveryFee === 0 ? 'FREE (€0.00)' : `€${order.deliveryFee.toFixed(2)}`}
${order.discount ? `Discount: -€${order.discount.toFixed(2)}` : ''}
----------------------------------------
GRAND TOTAL: €${order.total.toFixed(2)} (NPR ~Rs. ${nprTotal.toLocaleString()})
Payment Method: ${order.paymentMethod === 'esewa' ? 'eSewa QR Pay' : order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Card Pay'}
Payment Status: ${order.paymentMethod === 'esewa' ? `PAID (Ref: ${order.paymentRef || 'ESW-VERIFIED'})` : order.paymentMethod === 'cod' ? 'PAYMENT DUE ON ARRIVAL' : 'PAID VIA CARD'}
========================================
Thank you for shopping fresh at FreshMarket!
========================================
    `.trim();

    navigator.clipboard.writeText(slipText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadSlip = () => {
    const slipText = `FRESHMARKET CLIENT ORDER SLIP\nOrder ID: ${order.orderId}\nCustomer: ${order.deliveryInfo.name} (${order.deliveryInfo.phone})\nAddress: ${order.deliveryInfo.address}, ${order.deliveryInfo.city}\nDate: ${order.createdAt || order.date}\n\nITEMS:\n${order.items.map((i) => `* ${i.quantity}x ${i.product.name} - €${(i.product.price * i.quantity).toFixed(2)}`).join('\n')}\n\nSubtotal: €${order.subtotal.toFixed(2)}\nDelivery Fee: €${order.deliveryFee.toFixed(2)}\nTotal: €${order.total.toFixed(2)} (NPR Rs. ${nprTotal.toLocaleString()})\nPayment: ${order.paymentMethod.toUpperCase()} (${order.paymentMethod === 'esewa' ? 'PAID' : 'COD'})\n\nMerchant: Ranjit Gautam (9803161767)\nThank you!`;
    const element = document.createElement('a');
    const file = new Blob([slipText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `FreshMarket_OrderSlip_${order.orderId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSendWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hello Ranjit Gautam (FreshMarket), here is my new order slip:\n\n*Order ID:* ${order.orderId}\n*Customer:* ${order.deliveryInfo.name} (${order.deliveryInfo.phone})\n*Address:* ${order.deliveryInfo.address}, ${order.deliveryInfo.city}\n*Total:* €${order.total.toFixed(2)} (~Rs. ${nprTotal})\n*Payment:* ${order.paymentMethod === 'esewa' ? 'eSewa Paid' : 'Cash on Delivery'}\n*Items:*\n${order.items.map((i) => `• ${i.quantity}x ${i.product.name}`).join('\n')}\n${order.deliveryInfo.notes ? `*Notes:* ${order.deliveryInfo.notes}` : ''}`
    );
    window.open(`https://wa.me/9779803161767?text=${msg}`, '_blank');
  };

  const content = (
    <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border border-[#bfc9bd]/70 z-10 flex flex-col text-[#111c2d]">
      
      {/* Top Action Bar (Print / Share / Download / Close) - hidden in physical print */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#bfc9bd]/50 gap-2 print:hidden flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[#004c22] text-white flex items-center justify-center font-bold text-[14px]">
            ✓
          </span>
          <div>
            <h2 className="text-[17px] sm:text-[19px] font-black text-[#004c22] leading-tight">
              Official Client Order Slip
            </h2>
            <p className="text-[12px] text-[#707a6f]">Real-time verified grocery & bakery invoice</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={handlePrint}
            title="Print Client Order Slip"
            className="px-3 py-1.5 rounded-lg bg-[#f0f3ff] hover:bg-[#e7eeff] text-[#004c22] text-[12px] font-bold flex items-center gap-1 border border-[#004c22]/30 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadSlip}
            title="Download Slip File"
            className="px-3 py-1.5 rounded-lg bg-[#f0f3ff] hover:bg-[#e7eeff] text-[#004c22] text-[12px] font-bold flex items-center gap-1 border border-[#004c22]/30 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Save</span>
          </button>

          <button
            type="button"
            onClick={handleCopySlip}
            title="Copy Slip Text"
            className="px-3 py-1.5 rounded-lg bg-[#f0f3ff] hover:bg-[#e7eeff] text-[#004c22] text-[12px] font-bold flex items-center gap-1 border border-[#004c22]/30 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-[#707a6f] hover:bg-[#e7eeff] hover:text-[#111c2d] transition-colors cursor-pointer ml-1"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Interactive Delivery Progress Tracking Stepper */}
      <div className="mb-6 bg-[#f0f3ff] p-4 rounded-xl border border-[#004c22]/20 print:hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#007241] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#004c22]"></span>
            </span>
            <span className="text-[13px] font-extrabold text-[#004c22] uppercase tracking-wide">
              Live Order Status: {activeStep === 1 ? 'Order Received & Verified' : activeStep === 2 ? 'Fresh Packing & Baking' : activeStep === 3 ? 'Courier Out for Delivery' : 'Delivered to Doorstep'}
            </span>
          </div>
          <span className="text-[12px] text-[#707a6f] font-semibold">
            ETA: <strong>30 - 45 Mins</strong>
          </span>
        </div>

        {/* 4 Step Progress Bar */}
        <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-semibold">
          {[
            { step: 1, label: 'Confirmed', icon: 'check_circle' },
            { step: 2, label: 'Preparing', icon: 'skillet' },
            { step: 3, label: 'On The Way', icon: 'local_shipping' },
            { step: 4, label: 'Delivered', icon: 'home' },
          ].map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(s.step)}
              className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeStep >= s.step
                  ? 'bg-[#004c22] text-white shadow-xs font-bold'
                  : 'bg-white text-[#707a6f] border border-[#bfc9bd]/40'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{s.icon}</span>
              <span className="leading-tight">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          PRINTABLE OFFICIAL SLIP CONTAINER
      ======================================================== */}
      <div id="printable-order-slip" className="bg-[#fafcfa] border-2 border-[#bfc9bd]/70 rounded-xl p-5 sm:p-6 space-y-5 text-[13px] relative shadow-xs">
        
        {/* Watermark Seal */}
        <div className="absolute top-4 right-4 opacity-15 pointer-events-none select-none">
          <span className="material-symbols-outlined text-[110px] text-[#004c22]">verified</span>
        </div>

        {/* Slip Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b-2 border-dashed border-[#bfc9bd]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[20px] sm:text-[22px] font-black text-[#004c22] tracking-tight">
                FreshMarket
              </span>
              <span className="bg-[#004c22] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                Official Slip
              </span>
            </div>
            <p className="text-[12px] text-[#404940] mt-0.5">
              Organic Groceries, Daily Fresh Produce & Artisan Cakes
            </p>
            <p className="text-[11px] text-[#707a6f] mt-0.5">
              Hub: Kathmandu Valley • Managed by <strong>Ranjit Gautam</strong>
            </p>
            <p className="text-[11px] text-[#707a6f]">
              Contact / eSewa: <strong>9803161767</strong> • gautamranjit99@gmail.com
            </p>
          </div>

          <div className="sm:text-right bg-white p-3 rounded-lg border border-[#bfc9bd]/60 shadow-2xs">
            <div className="text-[11px] font-bold uppercase text-[#707a6f] tracking-wider">
              Order Reference
            </div>
            <div className="text-[16px] font-black font-mono text-[#111c2d] tracking-wide">
              {order.orderId}
            </div>
            <div className="text-[11px] text-[#404940] mt-0.5">
              {order.createdAt || order.date}
            </div>
            {/* Barcode representation */}
            <div className="mt-1.5 py-1 px-2 bg-[#f0f3ff] rounded flex items-center justify-center font-mono text-[9px] text-[#404940] tracking-widest border border-[#bfc9bd]/30">
              ||| |||| | ||||| || |||| |||
            </div>
          </div>
        </div>

        {/* Client & Delivery Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 border-b border-[#bfc9bd]/50">
          <div>
            <h4 className="text-[11px] font-bold uppercase text-[#004c22] tracking-wider mb-1">
              Delivered To (Client)
            </h4>
            <p className="text-[14px] font-bold text-[#111c2d] leading-snug">
              {order.deliveryInfo.name}
            </p>
            <p className="text-[13px] text-[#404940] font-medium mt-0.5">
              📞 {order.deliveryInfo.phone}
            </p>
            <p className="text-[12px] text-[#404940] mt-0.5 leading-relaxed">
              📍 {order.deliveryInfo.address}, {order.deliveryInfo.area}
              <br />
              {order.deliveryInfo.city} {order.deliveryInfo.postalCode ? `- ${order.deliveryInfo.postalCode}` : ''}
            </p>
          </div>

          <div className="sm:text-right flex flex-col justify-between">
            <div>
              <h4 className="text-[11px] font-bold uppercase text-[#004c22] tracking-wider mb-1">
                Delivery Schedule
              </h4>
              <p className="text-[13px] font-bold text-[#111c2d]">
                {order.deliveryInfo.timeSlot || 'Instant Courier (30-45 Mins)'}
              </p>
              <p className="text-[12px] text-[#004c22] font-semibold mt-0.5">
                ⚡ Express Cold-Chain Delivery
              </p>
            </div>

            {order.deliveryInfo.notes && (
              <div className="mt-2 bg-[#e7eeff] p-2 rounded-md text-left sm:text-right border border-[#bfc9bd]/40">
                <span className="text-[10px] font-bold uppercase text-[#004c22] block">
                  Special Note / Cake Message:
                </span>
                <span className="text-[12px] text-[#111c2d] italic">
                  "{order.deliveryInfo.notes}"
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Itemized Product List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px] sm:text-[13px]">
            <thead>
              <tr className="border-b border-[#bfc9bd] text-[#004c22] uppercase text-[11px] font-extrabold">
                <th className="pb-2 pl-1">Item</th>
                <th className="pb-2">Weight / Unit</th>
                <th className="pb-2 text-center">Qty</th>
                <th className="pb-2 text-right">Price</th>
                <th className="pb-2 text-right pr-1">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bfc9bd]/40">
              {order.items.map((item, idx) => (
                <tr key={item.product.id || idx} className="py-2.5">
                  <td className="py-2 pl-1 font-semibold text-[#111c2d] flex items-center gap-2">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-7 h-7 rounded object-cover border border-[#bfc9bd]/50 print:hidden flex-shrink-0"
                    />
                    <span>{item.product.name}</span>
                  </td>
                  <td className="py-2 text-[#707a6f]">
                    {item.product.weightOrVolume || item.product.unit}
                  </td>
                  <td className="py-2 text-center font-bold text-[#111c2d]">
                    {item.quantity}
                  </td>
                  <td className="py-2 text-right text-[#404940]">
                    €{item.product.price.toFixed(2)}
                  </td>
                  <td className="py-2 text-right pr-1 font-bold text-[#111c2d]">
                    €{(item.product.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Calculation & Payment Status Box */}
        <div className="pt-3 border-t-2 border-dashed border-[#bfc9bd] flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-end">
          
          {/* Payment Method Badge */}
          <div className="bg-white p-3 rounded-xl border border-[#bfc9bd]/60 w-full sm:w-auto shadow-2xs space-y-1">
            <div className="text-[10px] font-extrabold uppercase text-[#707a6f] tracking-wider">
              Payment Verification
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#60bb46] text-white flex items-center justify-center text-[10px] font-bold">
                e
              </span>
              <span className="text-[13px] font-extrabold text-[#004c22]">
                {order.paymentMethod === 'esewa'
                  ? 'eSewa QR Pay (Verified)'
                  : order.paymentMethod === 'cod'
                  ? 'Cash On Delivery (COD)'
                  : 'Card Payment'}
              </span>
            </div>
            <p className="text-[11px] text-[#404940]">
              {order.paymentMethod === 'esewa'
                ? `Merchant: Ranjit Gautam (9803161767) • Ref: ${order.paymentRef || `ESW-${order.orderId.replace('FM-', '')}`}`
                : order.paymentMethod === 'cod'
                ? `Exact cash of €${order.total.toFixed(2)} due upon delivery`
                : 'Transaction authorized'}
            </p>
          </div>

          {/* Totals Table */}
          <div className="w-full sm:w-64 space-y-1.5 text-[13px]">
            <div className="flex justify-between text-[#404940]">
              <span>Items Subtotal:</span>
              <span className="font-semibold">€{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#404940]">
              <span>Delivery Charge:</span>
              <span>
                {order.deliveryFee === 0 ? (
                  <strong className="text-[#004c22]">FREE (€0.00)</strong>
                ) : (
                  `€${order.deliveryFee.toFixed(2)}`
                )}
              </span>
            </div>
            {order.discount ? (
              <div className="flex justify-between text-[#004c22]">
                <span>Discount / Promo:</span>
                <span className="font-bold">-€{order.discount.toFixed(2)}</span>
              </div>
            ) : null}

            <div className="flex justify-between pt-2 border-t-2 border-[#004c22] text-[17px] font-black text-[#004c22]">
              <span>Grand Total:</span>
              <span>€{order.total.toFixed(2)}</span>
            </div>
            <div className="text-right text-[11px] text-[#707a6f] font-semibold">
              Approx. <strong>Rs. {nprTotal.toLocaleString()} NPR</strong> (1€ ≈ 145 NPR)
            </div>
          </div>

        </div>

        {/* Footer Note on Slip */}
        <div className="pt-2 text-center text-[11px] text-[#707a6f] border-t border-[#bfc9bd]/40">
          <p>
            🌱 100% Quality Guaranteed • For queries or modifications call Ranjit Gautam at <strong>9803161767</strong>
          </p>
        </div>

      </div>

      {/* Bottom CTA Actions - Print / WhatsApp / Continue Shopping */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 print:hidden">
        <button
          type="button"
          onClick={handleSendWhatsApp}
          className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl text-[14px] flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98"
        >
          <span className="material-symbols-outlined text-[18px]">chat</span>
          <span>Send Slip on WhatsApp (9803161767)</span>
        </button>

        <button
          type="button"
          onClick={onContinueShopping || onClose}
          className="flex-1 py-3 px-4 bg-[#004c22] hover:bg-[#166534] text-white font-bold rounded-xl text-[14px] flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98"
        >
          <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
          <span>Continue Shopping</span>
        </button>
      </div>

    </div>
  );

  if (!isModal) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#111c2d]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative z-10 w-full flex justify-center max-h-[94vh] overflow-y-auto py-4">
        {content}
      </div>
    </div>
  );
};
