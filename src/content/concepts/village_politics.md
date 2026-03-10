# Concept: Advanced Village Politics (Example)

> [!NOTE]
> Ini adalah contoh bagaimana "Gagasan Liar" baru Anda bisa masuk ke PRIMER tanpa merusak sistem yang sudah ada. Cukup tulis ide di sini, dan sistem vNext akan tahu bahwa ini adalah "Concept" yang belum perlu di-build tapi sudah terdokumentasi.

## Ide Dasar
Saya ingin kepala desa bisa diganti melalui pemilu setiap 1 tahun game.

## Mekanisme
1. **Approval Rating**: Dipengaruhi oleh `activeOutbreaks` dan `iksScore` rata-rata.
2. **Campaign Event**: Event khusus di Balai Desa.
3. **Outcome**:
    - Menang: Dapat grant dana tambahan.
    - Kalah: Game over? Atau ganti character?

## Technical Needs (Antigravity Notes)
- Butuh state baru di `useGameStore` -> `political.approvalRating`.
- Butuh file baru di `src/domains/village/PoliticsSystem.js`.
