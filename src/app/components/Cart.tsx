'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { submitOrder } from '../../lib/actions';

export default function Cart({ tableId }: { tableId: number }) {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [specialRequests, setSpecialRequests] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem(`table_${tableId}_cart`);
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, [tableId]);

    // Save cart to localStorage
    useEffect(() => {
        if (cartItems.length > 0) {
            localStorage.setItem(`table_${tableId}_cart`, JSON.stringify(cartItems));
        }
    }, [cartItems, tableId]);

    const removeItem = (index: number) => {
        const newItems = [...cartItems];
        newItems.splice(index, 1);
        setCartItems(newItems);
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // const handleSubmitOrder = async () => {
    //     setIsSubmitting(true);
    //     try {
    //         await submitOrder({
    //             tableId,
    //             items: cartItems,
    //             specialRequests,
    //             totalAmount: calculateTotal()
    //         });
    //         setCartItems([]);
    //         setSpecialRequests('');
    //         alert('Order submitted successfully!');
    //     } catch (error) {
    //         console.error('Error submitting order:', error);
    //         alert('Failed to submit order');
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };

    const handleSubmitOrder = async () => {
        setIsSubmitting(true);
        try {
            const result = await submitOrder({
                tableId,
                items: cartItems,
                specialRequests,
                totalAmount: calculateTotal()
            });

            if (result.success) {
                setCartItems([]);
                setSpecialRequests('');
                localStorage.removeItem(`table_${tableId}_cart`);
                alert('Order submitted successfully!');
            } else {
                alert(result.error || 'Failed to submit order');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Failed to submit order');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="bg-white p-4 rounded-lg shadow-md sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Your Order</h2>

            {cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty</p>
            ) : (
                <>
                    <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                        {cartItems.map((item, index) => (
                            <div key={index} className="border-b pb-2">
                                <div className="flex justify-between">
                                    <span className="font-medium">
                                        {item.quantity}x {item.name}
                                    </span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                                {item.specialRequest && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Note: {item.specialRequest}
                                    </p>
                                )}
                                <button
                                    onClick={() => removeItem(index)}
                                    className="text-red-500 text-xs mt-1"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mb-4">
                        <textarea
                            placeholder="Any special requests for the entire order?"
                            value={specialRequests}
                            onChange={(e) => setSpecialRequests(e.target.value)}
                            className="w-full p-2 border rounded text-sm"
                            rows={3}
                        />
                    </div>

                    <div className="font-bold text-lg mb-4">
                        Total: ${calculateTotal().toFixed(2)}
                    </div>

                    <button
                        onClick={handleSubmitOrder}
                        disabled={isSubmitting || cartItems.length === 0}
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:bg-gray-300"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Order'}
                    </button>
                </>
            )}
        </div>
    );
}