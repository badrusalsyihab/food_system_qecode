import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { MenuItem } from '@/lib/types';

export async function GET() {
    try {
        const connection = await connectToDatabase();
        const [rows] = await connection.execute(`
      SELECT mi.*, mc.name AS category_name 
      FROM menu_items mi
      JOIN menu_categories mc ON mi.category_id = mc.id
      WHERE mi.is_available = TRUE
      ORDER BY mc.display_order, mi.name
    `);
        connection.end();

        return NextResponse.json(rows as MenuItem[]);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch menu items' },
            { status: 500 }
        );
    }
}