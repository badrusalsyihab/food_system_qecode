import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';

export async function POST(request: Request) {
    try {
        const { tableId, items, specialRequests, totalAmount } = await request.json();
        const connection = await connectToDatabase();

        // Start transaction
        await connection.beginTransaction();

        try {
            // Create order
            const [orderResult] = await connection.execute(
                'INSERT INTO orders (table_id, total_amount, special_requests) VALUES (?, ?, ?)',
                [tableId, totalAmount, specialRequests]
            );

            const orderId = (orderResult as any).insertId;

            // Add order items
            for (const item of items) {
                await connection.execute(
                    'INSERT INTO order_items (order_id, menu_item_id, quantity, special_request) VALUES (?, ?, ?, ?)',
                    [orderId, item.id, item.quantity, item.specialRequest]
                );
            }

            // Mark table as occupied
            await connection.execute(
                'UPDATE tables SET is_occupied = TRUE WHERE id = ?',
                [tableId]
            );

            await connection.commit();
            connection.end();

            return NextResponse.json({ success: true, orderId });
        } catch (error) {
            await connection.rollback();
            connection.end();
            throw error;
        }
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}