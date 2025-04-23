'use client';

import React from 'react';
import { useState } from 'react';
import { MenuItem } from '@/lib/types';

export default function MenuItemCard({ item }: { item: MenuItem }) {
    const [quantity, setQuantity] = useState(1);
    const [specialRequest, setSpecialRequest] = useState('');

    const addToCart = () => {
        // Implement cart context or state management
        console.log('Added to cart:', { item, quantity, specialRequest });
        setQuantity(1);
        setSpecialRequest('');
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
                {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                    <span className="text-gray-500">No image</span>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                <p className="font-bold text-primary mt-2">${item.price.toFixed(2)}</p>

                <div className="mt-3 flex items-center">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 bg-gray-200 rounded-l"
                    >
                        -
                    </button>
                    <span className="px-4 py-1 bg-gray-100">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-1 bg-gray-200 rounded-r"
                    >
                        +
                    </button>
                </div>

                <textarea
                    placeholder="Special requests..."
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    className="w-full mt-2 p-2 border rounded text-sm"
                    rows={2}
                />

                <button
                    onClick={addToCart}
                    className="w-full mt-3 bg-primary text-white py-2 rounded hover:bg-primary-dark transition"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}