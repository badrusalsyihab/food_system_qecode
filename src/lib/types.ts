export interface Table {
    id: number;
    table_number: string;
    qr_code: string;
    is_occupied: boolean;
}

export interface MenuCategory {
    id: number;
    name: string;
    display_order: number;
}

export interface MenuItem {
    id: number;
    category_id: number;
    category_name?: string;
    name: string;
    description: string;
    price: number;
    is_available: boolean;
    image_url: string | null;
}

export interface Order {
    id: number;
    table_id: number;
    table_number: string;
    status: 'pending' | 'preparing' | 'ready' | 'delivered';
    total_amount: number;
    special_requests: string;
    created_at: string;
    items: OrderItem[];
}

export interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    special_request: string;
}