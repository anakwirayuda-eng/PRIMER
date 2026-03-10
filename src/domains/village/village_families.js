/**
 * @reflection
 * [IDENTITY]: Village Families Registry
 * [PURPOSE]: Data module for mapping patient IDs to families/households.
 * [STATE]: Production
 */
export const VILLAGE_FAMILIES = [
    // === RT 01 (Rumah 1-5) - Dekat Puskesmas ===
    {
        id: 'kk_01', houseId: 'house_01', rt: '01', rw: '01', surname: 'Santoso', headName: 'Budi Santoso',
        biography: 'Keluarga petani yang sudah turun-temurun tinggal di Desa Sukamaju. Pak Budi dikenal rajin, sementara Bu Siti aktif di pengajian.',
        members: [
            { id: 'v_01_1', role: 'head', firstName: 'Budi', gender: 'L', age: 45, occupation: 'Petani' },
            { id: 'v_01_2', role: 'spouse', firstName: 'Siti', gender: 'P', age: 42, occupation: 'IRT' },
            { id: 'v_01_3', role: 'child', firstName: 'Andi', gender: 'L', age: 18, occupation: 'Pelajar' },
            { id: 'v_01_4', role: 'child', firstName: 'Dewi', gender: 'P', age: 14, occupation: 'Pelajar' },
        ]
    },
    {
        id: 'kk_02', houseId: 'house_02', rt: '01', rw: '01', surname: 'Widodo', headName: 'Joko Widodo',
        biography: 'Keluarga pedagang yang ramah. Mbah Karjo, sang kakek, adalah tetua yang sangat dihormati di RT 01.',
        members: [
            { id: 'v_02_1', role: 'head', firstName: 'Joko', gender: 'L', age: 52, occupation: 'Pedagang' },
            { id: 'v_02_2', role: 'spouse', firstName: 'Sri', gender: 'P', age: 48, occupation: 'IRT' },
            { id: 'v_02_3', role: 'child', firstName: 'Rizky', gender: 'L', age: 22, occupation: 'Buruh' },
            { id: 'v_02_4', role: 'elder', firstName: 'Mbah Karjo', gender: 'L', age: 78, occupation: 'Pensiun' },
        ]
    },
    {
        id: 'kk_03', houseId: 'house_03', rt: '01', rw: '01', surname: 'Kusuma', headName: 'Agus Kusuma',
        biography: 'Keluarga guru yang sangat peduli pendidikan. Bu Rina adalah bidan desa yang juga aktif sebagai kader kesehatan.',
        members: [
            { id: 'v_03_1', role: 'head', firstName: 'Agus', gender: 'L', age: 38, occupation: 'Guru' },
            { id: 'v_03_2', role: 'spouse', firstName: 'Rina', gender: 'P', age: 35, occupation: 'Bidan Sutra' }, // Bidan Desa
            { id: 'v_03_3', role: 'child', firstName: 'Fajar', gender: 'L', age: 8, occupation: 'Pelajar' },
            { id: 'v_03_4', role: 'child', firstName: 'Bunga', gender: 'P', age: 3, occupation: 'Balita' },
        ]
    },
    {
        id: 'kk_04', houseId: 'house_04', rt: '01', rw: '01', surname: 'Hidayat', headName: 'Eko Hidayat',
        biography: 'Pak Eko adalah seorang sopir yang sering ke luar kota. Bu Wulan sedang mengandung anak kedua mereka.',
        members: [
            { id: 'v_04_1', role: 'head', firstName: 'Eko', gender: 'L', age: 31, occupation: 'Sopir' },
            { id: 'v_04_2', role: 'spouse', firstName: 'Wulan', gender: 'P', age: 28, occupation: 'IRT', pregnant: true, trimester: 2 },
            { id: 'v_04_3', role: 'child', firstName: 'Naufal', gender: 'L', age: 4, occupation: 'Balita' },
        ]
    },
    {
        id: 'kk_05', houseId: 'house_05', rt: '01', rw: '01', surname: 'Setiawan', headName: 'Bambang Setiawan',
        biography: 'Pak Bambang adalah Kepala Dusun yang sangat disegani. Rumahnya sering menjadi tempat berkumpul warga.',
        members: [
            { id: 'v_05_1', role: 'head', firstName: 'Bambang', gender: 'L', age: 55, occupation: 'Kepala Dusun' },
            { id: 'v_05_2', role: 'spouse', firstName: 'Yanti', gender: 'P', age: 52, occupation: 'IRT' },
            { id: 'v_05_3', role: 'child', firstName: 'Gilang', gender: 'L', age: 25, occupation: 'Wiraswasta' },
            { id: 'v_05_4', role: 'child', firstName: 'Putri', gender: 'P', age: 20, occupation: 'Mahasiswa' },
        ]
    },

    // === RT 02 (Rumah 6-10) - Dekat Masjid ===
    {
        id: 'kk_06', houseId: 'house_06', rt: '02', rw: '01', surname: 'Hartono', headName: 'Hendra Hartono',
        members: [
            { id: 'v_06_1', role: 'head', firstName: 'Hendra', gender: 'L', age: 42, occupation: 'Bengkel' },
            { id: 'v_06_2', role: 'spouse', firstName: 'Ani', gender: 'P', age: 39, occupation: 'Pedagang' },
            { id: 'v_06_3', role: 'child', firstName: 'Dimas', gender: 'L', age: 16, occupation: 'Pelajar' },
            { id: 'v_06_4', role: 'child', firstName: 'Laras', gender: 'P', age: 12, occupation: 'Pelajar' },
        ]
    },
    {
        id: 'kk_07', houseId: 'house_07', rt: '02', rw: '01', surname: 'Wijaya', headName: 'Iwan Wijaya',
        members: [
            { id: 'v_07_1', role: 'head', firstName: 'Iwan', gender: 'L', age: 48, occupation: 'Petani' },
            { id: 'v_07_2', role: 'spouse', firstName: 'Mega', gender: 'P', age: 45, occupation: 'IRT' },
            { id: 'v_07_3', role: 'child', firstName: 'Oscar', gender: 'L', age: 19, occupation: 'Buruh' },
            { id: 'v_07_4', role: 'child', firstName: 'Citra', gender: 'P', age: 15, occupation: 'Pelajar' },
            { id: 'v_07_5', role: 'elder', firstName: 'Mbah Siti', gender: 'P', age: 72, occupation: 'Pensiun' },
        ]
    },
    {
        id: 'kk_08', houseId: 'house_08', rt: '02', rw: '01', surname: 'Saputra', headName: 'Dedi Saputra',
        members: [
            { id: 'v_08_1', role: 'head', firstName: 'Dedi', gender: 'L', age: 35, occupation: 'Tukang Bangunan' },
            { id: 'v_08_2', role: 'spouse', firstName: 'Fitri', gender: 'P', age: 32, occupation: 'IRT' },
            { id: 'v_08_3', role: 'child', firstName: 'Pandu', gender: 'L', age: 7, occupation: 'Pelajar' },
            { id: 'v_08_4', role: 'child', firstName: 'Bella', gender: 'P', age: 2, occupation: 'Balita' },
        ]
    },
    {
        id: 'kk_09', houseId: 'house_09', rt: '02', rw: '01', surname: 'Rahardjo', headName: 'Wahyu Rahardjo',
        members: [
            { id: 'v_09_1', role: 'head', firstName: 'Wahyu', gender: 'L', age: 29, occupation: 'Kader Posyandu' },
            { id: 'v_09_2', role: 'spouse', firstName: 'Ayu', gender: 'P', age: 27, occupation: 'Kader Jumantik' },
            { id: 'v_09_3', role: 'child', firstName: 'Zahra', gender: 'P', age: 1, occupation: 'Bayi' },
        ]
    },
    {
        id: 'kk_10', houseId: 'house_10', rt: '02', rw: '01', surname: 'Suryadi', headName: 'Sigit Suryadi',
        members: [
            { id: 'v_10_1', role: 'head', firstName: 'Sigit', gender: 'L', age: 62, occupation: 'Pensiun PNS' },
            { id: 'v_10_2', role: 'spouse', firstName: 'Kartika', gender: 'P', age: 58, occupation: 'IRT' },
        ]
    },

    // === RT 03 (Rumah 11-15) - Dekat Sekolah ===
    {
        id: 'kk_11', houseId: 'house_11', rt: '03', rw: '01', surname: 'Permana', headName: 'Taufik Permana',
        members: [
            { id: 'v_11_1', role: 'head', firstName: 'Taufik', gender: 'L', age: 44, occupation: 'Kepala Sekolah' },
            { id: 'v_11_2', role: 'spouse', firstName: 'Dian', gender: 'P', age: 40, occupation: 'Guru' },
            { id: 'v_11_3', role: 'child', firstName: 'Lutfi', gender: 'L', age: 17, occupation: 'Pelajar' },
            { id: 'v_11_4', role: 'child', firstName: 'Nisa', gender: 'P', age: 13, occupation: 'Pelajar' },
        ]
    },
    {
        id: 'kk_12', houseId: 'house_12', rt: '03', rw: '01', surname: 'Gunawan', headName: 'Arif Gunawan',
        members: [
            { id: 'v_12_1', role: 'head', firstName: 'Arif', gender: 'L', age: 40, occupation: 'Petani' },
            { id: 'v_12_2', role: 'spouse', firstName: 'Vera', gender: 'P', age: 36, occupation: 'IRT' },
            { id: 'v_12_3', role: 'child', firstName: 'Bayu', gender: 'L', age: 11, occupation: 'Pelajar' },
            { id: 'v_12_4', role: 'child', firstName: 'Elsa', gender: 'P', age: 6, occupation: 'Pelajar' },
        ]
    },
    {
        id: 'kk_13', houseId: 'house_13', rt: '03', rw: '01', surname: 'Halim', headName: 'Maman Halim',
        members: [
            { id: 'v_13_1', role: 'head', firstName: 'Maman', gender: 'L', age: 50, occupation: 'Tokoh Agama' },
            { id: 'v_13_2', role: 'spouse', firstName: 'Hani', gender: 'P', age: 47, occupation: 'IRT' },
            { id: 'v_13_3', role: 'child', firstName: 'Qori', gender: 'L', age: 21, occupation: 'Santri' },
            { id: 'v_13_4', role: 'child', firstName: 'Julia', gender: 'P', age: 18, occupation: 'Mahasiswa' },
            { id: 'v_13_5', role: 'child', firstName: 'Irfan', gender: 'L', age: 10, occupation: 'Pelajar' },
        ]
    },
    {
        id: 'kk_14', houseId: 'house_14', rt: '03', rw: '01', surname: 'Ismail', headName: 'Hakim Ismail',
        members: [
            { id: 'v_14_1', role: 'head', firstName: 'Hakim', gender: 'L', age: 33, occupation: 'Buruh Pabrik' },
            { id: 'v_14_2', role: 'spouse', firstName: 'Indah', gender: 'P', age: 30, occupation: 'IRT', pregnant: true, trimester: 3 },
            { id: 'v_14_3', role: 'child', firstName: 'Fira', gender: 'P', age: 5, occupation: 'Balita' },
        ]
    },
    {
        id: 'kk_15', houseId: 'house_15', rt: '03', rw: '01', surname: 'Jauhari', headName: 'Rudi Jauhari',
        members: [
            { id: 'v_15_1', role: 'head', firstName: 'Rudi', gender: 'L', age: 58, occupation: 'Petani' },
            { id: 'v_15_2', role: 'spouse', firstName: 'Ratna', gender: 'P', age: 55, occupation: 'IRT' },
            { id: 'v_15_3', role: 'elder', firstName: 'Mbah Painem', gender: 'P', age: 82, occupation: 'Pensiun' },
        ]
    },

    // === RT 04 (Rumah 16-20) - Dekat Pasar ===
    {
        id: 'kk_16', houseId: 'house_16', rt: '04', rw: '01', surname: 'Kurnia', headName: 'Guntur Kurnia',
        members: [
            { id: 'v_16_1', role: 'head', firstName: 'Guntur', gender: 'L', age: 46, occupation: 'Pedagang Pasar' },
            { id: 'v_16_2', role: 'spouse', firstName: 'Sari', gender: 'P', age: 43, occupation: 'Pedagang' },
            { id: 'v_16_3', role: 'child', firstName: 'Danang', gender: 'L', age: 20, occupation: 'Buruh' },
            { id: 'v_16_4', role: 'child', firstName: 'Okta', gender: 'P', age: 16, occupation: 'Pelajar' },
        ]
    },
    {
        id: 'kk_17', houseId: 'house_17', rt: '04', rw: '01', surname: 'Lubis', headName: 'Erwin Lubis',
        members: [
            { id: 'v_17_1', role: 'head', firstName: 'Erwin', gender: 'L', age: 37, occupation: 'Toko Kelontong' },
            { id: 'v_17_2', role: 'spouse', firstName: 'Lina', gender: 'P', age: 34, occupation: 'IRT' },
            { id: 'v_17_3', role: 'child', firstName: 'Cahyo', gender: 'L', age: 9, occupation: 'Pelajar' },
            { id: 'v_17_4', role: 'child', firstName: 'Della', gender: 'P', age: 4, occupation: 'Balita' },
        ]
    },
    {
        id: 'kk_18', houseId: 'house_18', rt: '04', rw: '01', surname: 'Mahendra', headName: 'Feri Mahendra',
        members: [
            { id: 'v_18_1', role: 'head', firstName: 'Feri', gender: 'L', age: 28, occupation: 'Ojek Online' },
            { id: 'v_18_2', role: 'spouse', firstName: 'Tika', gender: 'P', age: 25, occupation: 'IRT' },
            { id: 'v_18_3', role: 'child', firstName: 'Mira', gender: 'P', age: 0, occupation: 'Bayi' },
        ]
    },
    {
        id: 'kk_19', houseId: 'house_19', rt: '04', rw: '01', surname: 'Nasution', headName: 'Kukuh Nasution',
        members: [
            { id: 'v_19_1', role: 'head', firstName: 'Kukuh', gender: 'L', age: 54, occupation: 'Petani' },
            { id: 'v_19_2', role: 'spouse', firstName: 'Ulfa', gender: 'P', age: 50, occupation: 'IRT' },
            { id: 'v_19_3', role: 'child', firstName: 'Vino', gender: 'L', age: 24, occupation: 'Buruh' },
            { id: 'v_19_4', role: 'child', firstName: 'Cindy', gender: 'P', age: 19, occupation: 'Mahasiswa' },
        ]
    },
    {
        id: 'kk_20', houseId: 'house_20', rt: '04', rw: '01', surname: 'Nugroho', headName: 'Wawan Nugroho',
        members: [
            { id: 'v_20_1', role: 'head', firstName: 'Wawan', gender: 'L', age: 41, occupation: 'Warung Makan' },
            { id: 'v_20_2', role: 'spouse', firstName: 'Gita', gender: 'P', age: 38, occupation: 'IRT' },
            { id: 'v_20_3', role: 'child', firstName: 'Yanto', gender: 'L', age: 14, occupation: 'Pelajar' },
            { id: 'v_20_4', role: 'child', firstName: 'Anita', gender: 'P', age: 8, occupation: 'Pelajar' },
        ]
    },

    // === RT 05 (Rumah 21-25) - Pinggiran Desa ===
    {
        id: 'kk_21', houseId: 'house_21', rt: '05', rw: '02', surname: 'Pratama', headName: 'Zainal Pratama',
        members: [
            { id: 'v_21_1', role: 'head', firstName: 'Zainal', gender: 'L', age: 60, occupation: 'Ketua RT' },
            { id: 'v_21_2', role: 'spouse', firstName: 'Eka', gender: 'P', age: 57, occupation: 'IRT' },
            { id: 'v_21_3', role: 'child', firstName: 'Jaya', gender: 'L', age: 28, occupation: 'Petani' },
            { id: 'v_21_4', role: 'child_spouse', firstName: 'Fani', gender: 'P', age: 26, occupation: 'IRT' },
            { id: 'v_21_5', role: 'grandchild', firstName: 'Hasan', gender: 'L', age: 2, occupation: 'Balita' },
        ]
    },
    {
        id: 'kk_22', houseId: 'house_22', rt: '05', rw: '02', surname: 'Lestari', headName: 'Yuni Lestari', isFemaleHead: true,
        members: [
            { id: 'v_22_1', role: 'head', firstName: 'Yuni', gender: 'P', age: 45, occupation: 'Penjahit' },
            { id: 'v_22_2', role: 'child', firstName: 'Wati', gender: 'P', age: 22, occupation: 'Buruh Pabrik' },
            { id: 'v_22_3', role: 'child', firstName: 'Udin', gender: 'L', age: 17, occupation: 'Pelajar' },
        ]
    },
    {
        id: 'kk_23', houseId: 'house_23', rt: '05', rw: '02', surname: 'Putra', headName: 'Hasan Putra',
        members: [
            { id: 'v_23_1', role: 'head', firstName: 'Hasan', gender: 'L', age: 36, occupation: 'Buruh Tani' },
            { id: 'v_23_2', role: 'spouse', firstName: 'Mira', gender: 'P', age: 33, occupation: 'IRT' },
            { id: 'v_23_3', role: 'child', firstName: 'Rudi', gender: 'L', age: 10, occupation: 'Pelajar' },
            { id: 'v_23_4', role: 'child', firstName: 'Laila', gender: 'P', age: 6, occupation: 'Pelajar' },
        ]
    },
    {
        id: 'kk_24', houseId: 'house_24', rt: '05', rw: '02', surname: 'Wibowo', headName: 'Ahmad Wibowo',
        members: [
            { id: 'v_24_1', role: 'head', firstName: 'Ahmad', gender: 'L', age: 70, occupation: 'Pensiun' },
            { id: 'v_24_2', role: 'spouse', firstName: 'Mbah Sarni', gender: 'P', age: 68, occupation: 'IRT' },
        ]
    },
    {
        id: 'kk_25', houseId: 'house_25', rt: '05', rw: '02', surname: 'Wijaya', headName: 'Bpk. Wijaya (Kepala Desa)',
        biography: 'Keluarga Kepala Desa yang menjadi panutan bagi warga lainnya dalam hal kesehatan dan kebersihan.',
        members: [
            { id: 'v_25_1', role: 'head', firstName: 'Wijaya', gender: 'L', age: 45, occupation: 'Kepala Desa' },
            { id: 'v_25_2', role: 'spouse', firstName: 'Ratna', gender: 'P', age: 40, occupation: 'Ketua PKK' },
            { id: 'v_25_3', role: 'child', firstName: 'Putri', gender: 'P', age: 15, occupation: 'Pelajar' },
        ]
    },

    // === RT 06 (Rumah 26-30) - Wilayah Pengembangan Baru ===
    {
        id: 'kk_26', houseId: 'house_26', rt: '06', rw: '02', surname: 'Suryo', headName: 'Bambang Suryo',
        biography: 'Seorang pensiunan guru yang baru pindah kembali ke desa untuk menikmati masa tua bersama istrinya.',
        members: [
            { id: 'v_26_1', role: 'head', firstName: 'Bambang', gender: 'L', age: 65, occupation: 'Pensiunan' },
            { id: 'v_26_2', role: 'spouse', firstName: 'Endang', gender: 'P', age: 62, occupation: 'Pensiunan' },
        ]
    },
    {
        id: 'kk_27', houseId: 'house_27', rt: '06', rw: '02', surname: 'Pratama', headName: 'Arie Pratama',
        biography: 'Pasangan muda yang baru saja pindah ke desa. Memiliki bayi yang sedang dalam masa pertumbuhan.',
        members: [
            { id: 'v_27_1', role: 'head', firstName: 'Arie', gender: 'L', age: 28, occupation: 'Buruh' },
            { id: 'v_27_2', role: 'spouse', firstName: 'Siska', gender: 'P', age: 25, occupation: 'IRT' },
            { id: 'v_27_3', role: 'child', firstName: 'Deni', gender: 'L', age: 1, occupation: 'Bayi' },
        ]
    },
    {
        id: 'kk_28', houseId: 'house_28', rt: '06', rw: '02', surname: 'Kusumo', headName: 'Indra Kusumo',
        biography: 'Keluarga besar yang tinggal dalam satu rumah. Sering mengalami kendala sanitasi karena jumlah anggota yang banyak.',
        members: [
            { id: 'v_28_1', role: 'head', firstName: 'Indra', gender: 'L', age: 40, occupation: 'Tukang' },
            { id: 'v_28_2', role: 'spouse', firstName: 'Maya', gender: 'P', age: 38, occupation: 'IRT' },
            { id: 'v_28_3', role: 'child', firstName: 'Budi', gender: 'L', age: 12, occupation: 'Pelajar' },
            { id: 'v_28_4', role: 'child', firstName: 'Ani', gender: 'P', age: 10, occupation: 'Pelajar' },
            { id: 'v_28_5', role: 'child', firstName: 'Eko', gender: 'L', age: 4, occupation: 'Balita' },
            { id: 'v_28_6', role: 'elder', firstName: 'Mbah Slamet', gender: 'L', age: 75, occupation: 'Pensiun' },
        ]
    },
    {
        id: 'kk_29', houseId: 'house_29', rt: '02', rw: '01', surname: 'Hadi', headName: 'Slamet Hadi',
        biography: 'Seorang duda yang tinggal sendirian. Dikenal sebagai perokok berat dan jarang bersosialisasi dengan tetangga.',
        members: [
            { id: 'v_29_1', role: 'head', firstName: 'Slamet', gender: 'L', age: 58, occupation: 'Buruh Tani' },
        ]
    },
    {
        id: 'kk_30', houseId: 'house_30', rt: '01', rw: '01', surname: 'Wahyudi', headName: 'Dwi Wahyudi',
        biography: 'Pak Dwi sedang dalam masa pemulihan setelah terkena stroke beberapa bulan lalu. Istrinya sangat menjaga pola makannya.',
        members: [
            { id: 'v_30_1', role: 'head', firstName: 'Dwi', gender: 'L', age: 52, occupation: 'Tidak Bekerja' },
            { id: 'v_30_2', role: 'spouse', firstName: 'Marni', gender: 'P', age: 48, occupation: 'Pedagang' },
        ]
    },
];
