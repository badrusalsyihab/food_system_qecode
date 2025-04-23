import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { Table } from '@/lib/types';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const connection = await connectToDatabase();
        const [rows] = await connection.execute(
            'SELECT * FROM tables WHERE id = ?',
            [params.id]
        );
        connection.end();

        if (!rows || (rows as any).length === 0) {
            return NextResponse.json({ error: 'Table not found' }, { status: 404 });
        }

        return NextResponse.json(rows[0] as Table);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch table' },
            { status: 500 }
        );
    }
}