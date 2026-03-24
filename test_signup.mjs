// Direct Supabase signup test — bypass the app completely
const SUPABASE_URL = 'https://cfabsllhezioylgiwjak.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmYWJzbGxoZXppb3lsZ2l3amFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NzM3OTUsImV4cCI6MjA4OTU0OTc5NX0.bL0YTOy2l4efYh08TizfV7EPVE8ErNjEfVbb2mnmtQs';

const testEmail = '1990202511061@students.primer-app.com';
const testPassword = 'test123456';

console.log('Testing Supabase signup with:', testEmail);

try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
            email: testEmail,
            password: testPassword,
            data: { nim: '1990202511061', nama: 'Test Dosen', role: 'student' },
        }),
    });

    console.log('HTTP Status:', res.status);    
    const body = await res.json();
    console.log('Response:', JSON.stringify(body, null, 2));
} catch (err) {
    console.error('Network error:', err.message);
}
