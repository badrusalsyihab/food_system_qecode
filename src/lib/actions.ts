'use server';

import { connectToDatabase } from './database';
import { Order } from './types';

export async function submitOrder(orderData: {
    tableId: number;
    items: {
        id: number;
        quantity: number;
        specialRequest: string;
        price: number;
        name: string;
    }[];
    specialRequests: string;
    totalAmount: number;
}): Promise<{ success: boolean; orderId?: number; error?: string }> {
    try {
        const connection = await connectToDatabase();

        // Start transaction
        await connection.beginTransaction();

        try {
            // Create order
            const [orderResult] = await connection.execute(
                'INSERT INTO orders (table_id, total_amount, special_requests) VALUES (?, ?, ?)',
                [orderData.tableId, orderData.totalAmount, orderData.specialRequests]
            );

            const orderId = (orderResult as any).insertId;

            // Add order items
            for (const item of orderData.items) {
                await connection.execute(
                    'INSERT INTO order_items (order_id, menu_item_id, quantity, special_request) VALUES (?, ?, ?, ?)',
                    [orderId, item.id, item.quantity, item.specialRequest]
                );
            }

            // Mark table as occupied
            await connection.execute(
                'UPDATE tables SET is_occupied = TRUE WHERE id = ?',
                [orderData.tableId]
            );

            await connection.commit();
            connection.end();

            // Clear the cart from localStorage
            // Note: This can't be done directly in server action, will need client-side handling

            return { success: true, orderId };
        } catch (error) {
            await connection.rollback();
            connection.end();
            console.error('Order submission failed:', error);
            return { success: false, error: 'Failed to submit order' };
        }
    } catch (error) {
        console.error('Database connection failed:', error);
        return { success: false, error: 'Database connection failed' };
    }
}

// Additional order-related actions can be added here
export async function getOrderStatus(orderId: number): Promise<Order | null> {
    try {
        const connection = await connectToDatabase();
        const [rows] = await connection.execute(
            `SELECT o.*, t.table_number 
       FROM orders o
       JOIN tables t ON o.table_id = t.id
       WHERE o.id = ?`,
            [orderId]
        );
        connection.end();

        if (!rows || (rows as any).length === 0) {
            return null;
        }

        return rows[0] as Order;
    } catch (error) {
        console.error('Error fetching order status:', error);
        return null;
    }
}