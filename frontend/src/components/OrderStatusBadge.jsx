import React from 'react';

const OrderStatusBadge = ({ OrderStatus }) => {
  let OrderStatusClasses;

  switch (OrderStatus) {
    case 'Pending':
      OrderStatusClasses = 'bg-orange-100 text-orange-800 text-xs font-medium me-2 px-3 py-2 rounded-full dark:bg-orange-900 dark:text-orange-300'; 
      break;
    case 'Confirmed':
      OrderStatusClasses = 'bg-green-100 text-green-800 text-xs font-medium me-2 px-3 py-2 rounded-full dark:bg-green-900 dark:text-green-300';
      break;
    case 'Shipped':
      OrderStatusClasses = 'bg-green-100 text-green-800 text-xs font-medium me-2 px-3 py-2 rounded-lg dark:bg-green-900 dark:text-green-300'; 
      break;
    case 'Delivered':
      OrderStatusClasses = 'bg-green-100 text-green-800 text-xs font-medium me-2 px-3 py-2 rounded-lg dark:bg-green-900 dark:text-green-300'; 
      break;
    case 'Cancelled':
      OrderStatusClasses = 'bg-red-100 text-red-800 text-xs font-medium me-2 px-3 py-2 rounded-full dark:bg-red-900 dark:text-red-300'; 
      break;
    default:
      OrderStatusClasses = 'bg-gray-500 text-white'; // Default class
  }

  return (
    <span className={`${OrderStatusClasses}`}>
      {OrderStatus}
    </span>
  );
};

export default OrderStatusBadge;
