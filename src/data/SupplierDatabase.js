/**
 * @reflection
 * [IDENTITY]: SupplierDatabase
 * [PURPOSE]: SUPPLIER DATABASE Database supplier obat dan alat kesehatan untuk sistem pengadaan Puskesmas
 * [STATE]: Experimental
 * [ANCHOR]: SUPPLIER_DATABASE
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

/**
 * SUPPLIER DATABASE
 * Database supplier obat dan alat kesehatan untuk sistem pengadaan Puskesmas
 */

export const SUPPLIER_DATABASE = [
    {
        id: 'dinkes',
        name: 'Dinas Kesehatan Kabupaten',
        type: 'government',
        leadTime: 7, // hari
        reliability: 0.95, // 95% pesanan tepat waktu
        discountRate: 0, // No discount for government procurement
        paymentTerms: 'kapitasi_deduction', // Dipotong langsung dari dana kapitasi
        description: 'Supplier utama untuk obat-obatan Fornas dan alkes standar',
        minOrderValue: 0, // Tidak ada minimum order
        maxOrderValue: 50000000, // Max Rp 50 juta per order
        availableCategories: [
            'Analgesik/Antipiretik',
            'Antibiotik',
            'Antihipertensi',
            'Antidiabetes',
            'Sistem Respirasi',
            'Saluran Cerna',
            'Dermatologi',
            'Vitamin/Suplemen'
        ]
    },
    {
        id: 'vendor_swasta',
        name: 'PT Kimia Farma Trading',
        type: 'private',
        leadTime: 5, // Lebih cepat dari Dinkes
        reliability: 0.98, // Lebih reliable
        discountRate: 0.05, // 5% discount untuk pembelian > 10 juta
        paymentTerms: 'cash_upfront', // Bayar di muka
        description: 'Vendor swasta untuk alkes habis pakai dan reagensia lab',
        minOrderValue: 1000000, // Min order Rp 1 juta
        maxOrderValue: 100000000, // Max Rp 100 juta per order
        availableCategories: [
            'Alat Kesehatan Habis Pakai',
            'Reagensia Laboratorium'
        ],
        expressFee: 500000 // Biaya tambahan untuk express delivery (3 hari)
    },
    {
        id: 'apotek_lokal',
        name: 'Apotek Sehat Sejahtera',
        type: 'pharmacy',
        leadTime: 1, // Same day delivery untuk emergency
        reliability: 0.90,
        discountRate: 0, // Harga retail
        paymentTerms: 'cash_upfront',
        description: 'Apotek lokal untuk kebutuhan mendesak (harga lebih mahal)',
        minOrderValue: 0,
        maxOrderValue: 5000000, // Max Rp 5 juta
        availableCategories: [
            'Analgesik/Antipiretik',
            'Antibiotik',
            'Sistem Respirasi',
            'Saluran Cerna',
            'Vitamin/Suplemen',
            'Alat Kesehatan Habis Pakai'
        ],
        priceMarkup: 1.3 // 30% lebih mahal dari harga normal
    }
];

// Helper functions
export function getSupplierById(id) {
    return SUPPLIER_DATABASE.find(supplier => supplier.id === id);
}

export function getSuppliersForCategory(category) {
    return SUPPLIER_DATABASE.filter(supplier =>
        supplier.availableCategories.includes(category)
    );
}

export function calculateOrderCost(supplierId, items) {
    const supplier = getSupplierById(supplierId);
    if (!supplier) return { error: 'Supplier not found' };

    let subtotal = items.reduce((sum, item) => {
        const basePrice = item.unitPrice * item.quantity;
        // Apply markup if pharmacy
        const price = supplier.priceMarkup ? basePrice * supplier.priceMarkup : basePrice;
        return sum + price;
    }, 0);

    // Apply discount if applicable
    const discount = subtotal >= 10000000 ? subtotal * supplier.discountRate : 0;
    const total = subtotal - discount;

    // Check min/max order value
    if (total < supplier.minOrderValue) {
        return {
            error: `Minimum order value: Rp ${supplier.minOrderValue.toLocaleString('id-ID')}`,
            subtotal,
            discount,
            total
        };
    }

    if (total > supplier.maxOrderValue) {
        return {
            error: `Maximum order value: Rp ${supplier.maxOrderValue.toLocaleString('id-ID')}`,
            subtotal,
            discount,
            total
        };
    }

    return {
        supplierId,
        supplierName: supplier.name,
        subtotal,
        discount,
        total,
        leadTime: supplier.leadTime,
        paymentTerms: supplier.paymentTerms
    };
}

export function estimateDeliveryDate(supplierId, currentDay, express = false) {
    const supplier = getSupplierById(supplierId);
    if (!supplier) return null;

    let deliveryDays = supplier.leadTime;

    // Express delivery option for vendor_swasta
    if (express && supplierId === 'vendor_swasta') {
        deliveryDays = 3;
    }

    return currentDay + deliveryDays;
}
