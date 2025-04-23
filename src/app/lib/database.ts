import mysql from 'mysql2/promise';

interface MySQLConfig {
    host: string;
    user: string;
    password: string;
    database: string;
}

const config: MySQLConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'restaurant_ordering'
};

export async function connectToDatabase() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'food_ordering_system'
    });
}


