/**
 * Bulk NIM Import Script
 * ──────────────────────
 * Creates 50 student accounts in Supabase Auth (invite-only mode).
 * Run ONCE from your laptop, then disable public signups.
 *
 * Usage:
 *   1. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY below
 *   2. Fill NIM_LIST with actual student NIMs from dosen's Excel
 *   3. Run: node scripts/bulk-import-nim.mjs
 *   4. Save the output (NIM + PIN pairs) for distribution
 *   5. In Supabase Dashboard: Authentication → Providers → Disable "Allow new users to sign up"
 *
 * ⚠️ Uses SERVICE_ROLE key — NEVER deploy this to frontend!
 */

import { createClient } from '@supabase/supabase-js';

// ═══ CONFIGURATION ═══
const SUPABASE_URL = 'https://cfabsllhezioylgiwjak.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'YOUR_SERVICE_ROLE_KEY_HERE'; // From Supabase → Settings → API → service_role

// Student NIM list — Replace with actual NIMs from dosen
const NIM_LIST = [
    // '012311133001',
    // '012311133002',
    // ... add all 50 NIMs
];

// ═══ SCRIPT ═══
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

function generatePin() {
    return String(Math.floor(100000 + Math.random() * 900000)); // 6-digit PIN
}

async function createAccount(nim) {
    const email = `${nim}@students.primer-app.com`;
    const pin = generatePin();

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password: pin,
        email_confirm: true, // Skip email confirmation
        user_metadata: { nim, full_name: `Mahasiswa ${nim}`, role: 'mahasiswa' }
    });

    if (error) {
        console.error(`❌ ${nim}: ${error.message}`);
        return { nim, pin: null, error: error.message };
    }

    console.log(`✅ ${nim} → PIN: ${pin}`);
    return { nim, pin, userId: data.user.id };
}

async function main() {
    if (NIM_LIST.length === 0) {
        console.log('⚠️  NIM_LIST kosong! Isi dulu dengan NIM mahasiswa dari Excel dosen.');
        console.log('   Edit file ini, isi array NIM_LIST, lalu jalankan ulang.');
        return;
    }

    console.log(`\n🏥 PRIMER — Bulk NIM Import`);
    console.log(`   Creating ${NIM_LIST.length} accounts...\n`);

    const results = [];
    for (const nim of NIM_LIST) {
        const result = await createAccount(nim);
        results.push(result);
        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 200));
    }

    // Summary
    const success = results.filter(r => r.pin);
    const failed = results.filter(r => !r.pin);

    console.log(`\n═══ SUMMARY ═══`);
    console.log(`✅ Created: ${success.length}`);
    console.log(`❌ Failed:  ${failed.length}`);

    // Print PIN table for dosen
    if (success.length > 0) {
        console.log(`\n═══ DAFTAR NIM & PIN (berikan ke Dosen) ═══`);
        console.log(`NIM\t\t\tPIN`);
        console.log(`───\t\t\t───`);
        success.forEach(r => console.log(`${r.nim}\t\t${r.pin}`));
    }

    console.log(`\n⚠️  LANGKAH SELANJUTNYA:`);
    console.log(`   1. Simpan tabel NIM+PIN di atas`);
    console.log(`   2. Buka Supabase → Authentication → Providers`);
    console.log(`   3. MATIKAN "Allow new users to sign up"`);
    console.log(`   4. Distribusikan PIN ke mahasiswa via dosen`);
}

main().catch(console.error);
