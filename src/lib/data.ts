import { Table, MenuItem, Order } from './types';
import { connectToDatabase } from './database';


export async function getTableByQrCode(qrCode: string): Promise<Table | null> {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute(
        'SELECT * FROM tables WHERE qr_code = ?',
        [qrCode]
    );
    connection.end();
    return (rows as any[])[0] || null;
}

export async function getMenuItems(): Promise<MenuItem[]> {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute(`
    SELECT mi.*, mc.name AS category_name 
    FROM menu_items mi
    JOIN menu_categories mc ON mi.category_id = mc.id
    WHERE mi.is_available = TRUE
    ORDER BY mc.display_order, mi.name
  `);
    connection.end();
    return rows as MenuItem[];
}

export async function getActiveOrders(): Promise<Order[]> {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute(`
    SELECT 
      o.id, 
      o.status, 
      o.total_amount, 
      o.special_requests, 
      o.created_at,
      t.table_number,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', oi.id,
          'name', mi.name,
          'price', mi.price,
          'quantity', oi.quantity,
          'special_request', oi.special_request
        )
      ) AS items
    FROM orders o
    JOIN tables t ON o.table_id = t.id
    JOIN order_items oi ON o.id = oi.order_id
    JOIN menu_items mi ON oi.menu_item_id = mi.id
    WHERE o.status != 'delivered'
    GROUP BY o.id
    ORDER BY 
      CASE o.status
        WHEN 'pending' THEN 1
        WHEN 'preparing' THEN 2
        WHEN 'ready' THEN 3
        ELSE 4
      END,
      o.created_at
  `);
    connection.end();

    // Parse the JSON items array
    return (rows as any[]).map(row => ({
        ...row,
        items: JSON.parse(row.items)
    }));
}

export async function updateOrderStatus(orderId: number, status: string): Promise<void> {
    const connection = await connectToDatabase();
    await connection.execute(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, orderId]
    );
    connection.end();
}