import React from "react";

interface Order {
  code: string;
  priority: string;
  amount: number;
  destination: string;
  status: string;
}

interface OrderTableProps {
  orders: Order[];
}

const getStatusBadge = (status: string) => {
  const statusClasses: Record<string, string> = {
    Shipped: "bg-blue-400 text-white",
    Delivered: "bg-blue-400 text-white",
    Paid: "bg-red-500 text-white",
    Ready: "bg-blue-400 text-white",
    Cancelled: "bg-gray-400 text-white",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-md ${
        statusClasses[status] || "bg-gray-200 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="text-left text-sm text-gray-700 bg-gray-100">
            <th className="p-3 font-medium">Order Code</th>
            <th className="p-3 font-medium">
              Priority <span className="ml-1 text-xs">▼</span>
            </th>
            <th className="p-3 font-medium">Item</th>
            <th className="p-3 font-medium">Destination</th>
            <th className="p-3 font-medium">
              Status <span className="ml-1 text-xs">▼</span>
            </th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr
              key={index}
              className={`border-t border-gray-200 text-sm ${
                order.priority === "Premium delivery" && index === 2
                  ? "bg-red-100"
                  : ""
              }`}
            >
              <td className="p-3 text-gray-800">{order.code}</td>
              <td className="p-3 text-gray-800">{order.priority}</td>
              <td className="p-3 text-gray-800">{order.amount}</td>
              <td className="p-3 text-gray-800">{order.destination}</td>
              <td className="p-3">{getStatusBadge(order.status)}</td>
              <td className="p-3 text-right">
                <button className="text-gray-400">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
