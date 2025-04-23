import React from 'react';
import { getTableByQrCode, getMenuItems } from '@/lib/data';
import MenuItemCard from '../../components/MenuItemCard';
import Cart from '../../components/Cart';

export default async function TablePage({ params }: { params: { qrCode: string } }) {
    const table = await getTableByQrCode(params.qrCode);
    const menuItems = await getMenuItems();

    if (!table) {
        return <div className="p-4 text-center">Invalid table QR code</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm p-4">
                <h1 className="text-2xl font-bold text-center">Welcome to Our Restaurant</h1>
                <p className="text-center text-gray-600">Table {table.table_number}</p>
            </header>

            <div className="container mx-auto p-4 md:flex gap-6">
                <div className="md:w-3/4">
                    <h2 className="text-xl font-semibold mb-4">Our Menu</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {menuItems.map(item => (
                            <MenuItemCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>

                <div className="md:w-1/4 mt-6 md:mt-0">
                    <Cart tableId={table.id} />
                </div>
            </div>
        </div>
    );
}