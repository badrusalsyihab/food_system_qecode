import React from 'react';
import { Order } from '@/lib/types';

export default function KitchenOrderCard({
    order,
    onStatusUpdate
}: {
    order: Order,
    onStatusUpdate: (orderId: number, newStatus: string) => void
}) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'preparing': return 'bg-blue-100 text-blue-800';
            case 'ready': return 'bg-green-100 text-green-800';
            case 'delivered': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold">Order #{order.id}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                </div>
                <p className="text-sm text-gray-600">Table {order.table_number}</p>
                <p className="text-sm mt-1">
                    {new Date(order.created_at).toLocaleTimeString()}
                </p>
            </div>

            <div className="p-4 border-b">
                <h4 className="font-semibold mb-2">Items:</h4>
                <ul className="space-y-2">
                    {order.items.map((item: any, index: number) => (
                        <li key={index} className="flex justify-between">
                            <span>
                                {item.quantity}x {item.name}
                                {item.special_request && (
                                    <span className="block text-xs text-gray-500">Note: {item.special_request}</span>
                                )}
                            </span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-4">
                <div className="flex justify-between font-bold mb-3">
                    <span>Total:</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                </div>

                {order.special_requests && (
                    <div className="mb-3 p-2 bg-yellow-50 rounded text-sm">
                        <p className="font-semibold">Special Requests:</p>
                        <p>{order.special_requests}</p>
                    </div>
                )}

                <div className="flex space-x-2">
                    {order.status === 'pending' && (
                        <button
                            onClick={() => onStatusUpdate(order.id, 'preparing')}
                            className="flex-1 bg-blue-500 text-white py-1 rounded text-sm"
                        >
                            Start Preparing
                        </button>
                    )}
                    {order.status === 'preparing' && (
                        <button
                            onClick={() => onStatusUpdate(order.id, 'ready')}
                            className="flex-1 bg-green-500 text-white py-1 rounded text-sm"
                        >
                            Mark as Ready
                        </button>
                    )}
                    {order.status === 'ready' && (
                        <button
                            onClick={() => onStatusUpdate(order.id, 'delivered')}
                            className="flex-1 bg-gray-500 text-white py-1 rounded text-sm"
                        >
                            Mark as Delivered
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}