import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface EsewaQRCardProps {
  amount?: number;
  orderId?: string;
  className?: string;
  showDownloadOptions?: boolean;
}

export const EsewaQRCard: React.FC<EsewaQRCardProps> = ({
  amount,
  orderId,
  className = '',
  showDownloadOptions = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Exact details from the user's uploaded QR
  const recipientName = 'Ranjit Gautam';
  const recipientPhone = '9803161767';

  // Standard eSewa payment string payload
  const qrPayload = amount && amount > 0
    ? `esewa://pay?account=${recipientPhone}&name=${encodeURIComponent(recipientName)}&amount=${amount.toFixed(2)}${orderId ? `&ref=${orderId}` : ''}`
    : `esewa://pay?account=${recipientPhone}&name=${encodeURIComponent(recipientName)}`;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        qrPayload,
        {
          width: 220,
          margin: 1.5,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        },
        (error) => {
          if (error) console.error('QR Generation error', error);
        }
      );
    }
  }, [qrPayload]);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(recipientPhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `esewa-qr-${recipientPhone}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleShareQR = async () => {
    if (navigator.share && canvasRef.current) {
      try {
        canvasRef.current.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], `esewa-qr-${recipientPhone}.png`, { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: `eSewa Payment - ${recipientName}`,
                text: `Scan or Pay via eSewa to ${recipientName} (${recipientPhone})${amount ? ` for €${amount.toFixed(2)}` : ''}`,
                files: [file],
              });
              setShareSuccess(true);
              setTimeout(() => setShareSuccess(false), 2500);
              return;
            }
          }
          await navigator.share({
            title: `eSewa Payment - ${recipientName}`,
            text: `eSewa ID: ${recipientPhone} (${recipientName})${amount ? ` - Amount: €${amount.toFixed(2)}` : ''}`,
          });
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), 2500);
        });
      } catch (err) {
        console.log('Share canceled or not supported', err);
        handleCopyPhone();
      }
    } else {
      handleCopyPhone();
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-[#bfc9bd]/70 shadow-sm overflow-hidden flex flex-col items-center text-center ${className}`}
    >
      {/* Top App Header mimicking exact eSewa QR UI */}
      <div className="w-full bg-[#f9f9ff] px-4 py-3 border-b border-[#bfc9bd]/40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative pb-1">
            <span className="text-[14px] font-bold text-[#007241]">My QR</span>
            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#007241] rounded-full" />
          </div>
          <span className="text-[14px] font-medium text-[#707a6f]">Favorite QR</span>
        </div>

        <div className="w-6 h-6 rounded-full bg-[#007241] flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-[16px]">check</span>
        </div>
      </div>

      {/* Main QR Display */}
      <div className="p-5 flex flex-col items-center w-full">
        {/* QR Code Canvas Frame */}
        <div className="relative p-2.5 bg-white rounded-xl border-2 border-[#bfc9bd]/50 shadow-xs mb-3 flex items-center justify-center">
          <canvas ref={canvasRef} className="w-[190px] h-[190px] sm:w-[210px] sm:h-[210px] rounded-lg" />
        </div>

        {/* eSewa Brand Banner */}
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <span className="w-6 h-6 rounded-full bg-[#60bb46] text-white flex items-center justify-center font-bold text-[13px] shadow-xs">
            e
          </span>
          <span className="text-[20px] font-extrabold text-[#111c2d] tracking-tight">
            <span className="text-[#60bb46]">e</span>Sewa
          </span>
        </div>

        {/* Recipient Identity */}
        <h3 className="text-[19px] sm:text-[21px] font-bold text-[#111c2d] mt-1">
          {recipientName}
        </h3>

        {/* Phone ID with quick copy */}
        <div className="flex items-center gap-2 mt-1 mb-2">
          <span className="text-[17px] sm:text-[18px] font-mono font-bold text-[#404940] tracking-wide">
            {recipientPhone}
          </span>
          <button
            type="button"
            onClick={handleCopyPhone}
            aria-label="Copy eSewa ID"
            className="p-1 rounded-md text-[#007241] hover:bg-[#e7eeff] transition-colors cursor-pointer"
            title="Copy eSewa ID"
          >
            <span className="material-symbols-outlined text-[18px]">
              {copied ? 'check' : 'content_copy'}
            </span>
          </button>
        </div>

        {/* Amount to pay badge if provided */}
        {amount !== undefined && amount > 0 && (
          <div className="bg-[#e7eeff] border border-[#004c22]/20 px-3.5 py-1.5 rounded-full mb-3 text-[13px] font-bold text-[#004c22]">
            Amount to Pay: €{amount.toFixed(2)}
          </div>
        )}

        {/* Helper Instructions */}
        <p className="text-[13px] text-[#707a6f] mb-4">
          Scan QR code to receive money / pay instant order
        </p>

        {/* Action Buttons matching the screenshot (Download QR & SHARE QR) */}
        {showDownloadOptions && (
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            <button
              type="button"
              onClick={handleDownloadQR}
              className="py-2 px-3 border border-[#60bb46] text-[#007241] hover:bg-[#e7eeff] rounded-lg text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Download QR</span>
            </button>

            <button
              type="button"
              onClick={handleShareQR}
              className="py-2 px-3 border border-[#60bb46] text-[#007241] hover:bg-[#e7eeff] rounded-lg text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
              <span>{shareSuccess ? 'Shared!' : 'SHARE QR'}</span>
            </button>
          </div>
        )}

        {copied && (
          <div className="mt-2 text-[12px] font-semibold text-[#007241] animate-in fade-in">
            ✓ Phone ID copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
};
