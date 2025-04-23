'use client';

import React from 'react';
import { useEffect, useState } from 'react';
//import { KitchenOrderCard } from '@/components/KitchenOrderCard';
import KitchenOrderCard from '../components/KitchenOrderCard';
import { getActiveOrders, updateOrderStatus } from '@/lib/data';

export default function KitchenPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const data = await getActiveOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000); // Refresh every 10 seconds
        return () => clearInterval(interval);
    }, []);

    const handleStatusUpdate = async (orderId: number, newStatus: string) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            fetchOrders(); // Refresh orders after update
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    if (isLoading) {
        return <div className="p-4">Loading orders...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-6">Kitchen Orders</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.length === 0 ? (
                    <p className="text-gray-500">No active orders</p>
                ) : (
                    orders.map(order => (
                        <KitchenOrderCard
                            key={order.id}
                            order={order}
                            onStatusUpdate={handleStatusUpdate}
                        />
                    ))
                )}
            </div>
        </div>
    );
}