const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Ensure the qrcodes directory exists
const qrCodeDir = path.join(__dirname, 'public', 'qrcodes');
if (!fs.existsSync(qrCodeDir)) {
    fs.mkdirSync(qrCodeDir, { recursive: true });
}

// Example table data - replace with your actual tables from database
const tables = [
    { id: 1, table_number: 'T1' },
    { id: 2, table_number: 'T2' },
    { id: 3, table_number: 'T3' },
    { id: 4, table_number: 'T4' },
    // Add more tables as needed
];

// Base URL for your application
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Generate QR codes
async function generateQRCodes() {
    console.log('Generating QR codes...');

    for (const table of tables) {
        const url = `${BASE_URL}/table/${table.id}`;
        const filePath = path.join(qrCodeDir, `table-${table.id}.png`);

        try {
            await QRCode.toFile(filePath, url, {
                color: {
                    dark: '#000000',  // Black dots
                    light: '#ffffff00' // Transparent background
                },
                width: 400,
                margin: 2,
                errorCorrectionLevel: 'H' // High error correction
            });

            console.log(`✅ Generated QR code for Table ${table.table_number} (ID: ${table.id})`);
            console.log(`   URL: ${url}`);
            console.log(`   File: ${filePath}`);
        } catch (err) {
            console.error(`❌ Error generating QR code for Table ${table.table_number}:`, err);
        }
    }

    console.log('QR code generation complete!');
}

// Run the generator
generateQRCodes().catch(console.error);