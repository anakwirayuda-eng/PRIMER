/**
 * TENTANG & KREDIT (M7 butir 35) — modal identitas resmi + HKI + disclaimer
 * medis + kredit aset. Sumber: content/metadata.ts (satu sumber kebenaran).
 * CATATAN musik: kredit + peringatan lisensi (lihat public/bgm/CATATAN_LISENSI).
 */

import { METADATA } from '@content/metadata'
import { useFocusTrap } from '../useFocusTrap'
import './TentangModal.css'

export function TentangModal({ onTutup }: { onTutup: () => void }) {
  const h = METADATA.haki
  // CODEX M10.a ronde-4 (dossier §44): topmost saat terbuka (di atas modal
  // Pengaturan yg menahan trap-nya sendiri selama ini aktif — lihat Pengaturan.tsx).
  const ref = useFocusTrap<HTMLDivElement>(true, onTutup)
  return (
    <div className="set-overlay" onClick={onTutup}>
      <div ref={ref} className="tentang-modal kertas" role="dialog" aria-modal="true" aria-label="Tentang PRIMERA" onClick={(e) => e.stopPropagation()}>
        <div className="baris baris--antara">
          <h2 className="judul-seksi">Tentang &amp; Kredit</h2>
          <button className="tombol tombol--senyap" onClick={onTutup} aria-label="Tutup">✕</button>
        </div>

        <div className="tentang-isi">
          <p className="tentang-judul">{METADATA.judul}</p>
          <p className="teks-kecil teks-lembut">{METADATA.judulTerdaftar} · v{METADATA.versi}</p>

          <div className="tentang-blok">
            <p className="tentang-label mono">PENCIPTA</p>
            <p className="teks-kecil">{METADATA.pencipta}</p>
            <p className="teks-kecil teks-lembut">{METADATA.organisasi}</p>
          </div>

          <div className="tentang-blok">
            <p className="tentang-label mono">HAK CIPTA TERDAFTAR</p>
            <p className="teks-kecil">
              Surat Pencatatan Ciptaan Kemenkumham RI No. <strong>{h.nomorRegistrasi}</strong> ({h.tanggalRegistrasi}),
              Nomor Pencatatan {h.nomorPencatatan}.
            </p>
            <p className="teks-xs teks-lembut">
              {h.jenis} · Pemegang: {h.pemegang} · {h.dasarHukum}. {h.masaPerlindungan}.
            </p>
          </div>

          <div className="tentang-blok tentang-disclaimer">
            <p className="tentang-label mono">DISKLAIMER MEDIS</p>
            <p className="teks-xs">{METADATA.disklaimerMedis}</p>
          </div>

          <div className="tentang-blok">
            <p className="tentang-label mono">KREDIT ASET</p>
            <p className="teks-xs teks-lembut">
              Efek suara &amp; sebagian nada: sintesis prosedural (WebAudio, tanpa aset).
              Ilustrasi &amp; ikon: prosedural/SVG in-house.
            </p>
            <p className="teks-xs tentang-peringatan">
              ⚠️ Musik latar saat ini memakai koleksi pribadi pengembang untuk playtest
              internal dan <strong>wajib diganti musik berlisensi sebelum distribusi</strong>.
            </p>
          </div>

          <p className="teks-xs teks-lembut tentang-copyright">{METADATA.copyright}</p>
        </div>
      </div>
    </div>
  )
}
