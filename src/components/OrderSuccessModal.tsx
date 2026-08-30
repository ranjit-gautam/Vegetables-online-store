import React from 'react';
import { Order } from '../types';
import { ClientOrderSlip } from './ClientOrderSlip';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <ClientOrderSlip
      order={order}
      onClose={onClose}
      onContinueShopping={onClose}
      isModal={true}
    />
  );
};

