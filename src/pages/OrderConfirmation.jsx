// src/pages/OrderConfirmation.jsx
import React from 'react';

const OrderConfirmation = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order Confirmation</h1>
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        <p className="font-bold">Order Placed Successfully!</p>
        <p>Your order has been confirmed. You will receive an email with order details shortly.</p>
      </div>
      {/* Add more order details as needed */}
    </div>
  );
};

export default OrderConfirmation;