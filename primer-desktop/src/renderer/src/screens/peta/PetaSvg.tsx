/**
 * PETA SVG — desa Sukamaju stilasi kartu pos: sungai berkelok, petak sawah,
 * jalan kampung, dan 8 petak RW organik yang bisa diklik. Warna petak =
 * gradasi Daun→Kunyit→Merah dari IKS agregat; abu-abu bila belum tersurvei
 * ("setiap angka diperoleh, atau ia tidak ada").
 */

import type { RwState } from '@engine/state'
import { jalurOrganik, LABEL_JARAK, mendungPetak, PETAK_RW, warnaPetak } from './petaUtil'

interface Props {
  daftarRw: RwState[]
  terpilih: number | null
  /** Nomor RW yang punya keluarga ber-karma aktif (perlu perhatian). */
  karmaRw: ReadonlySet<number>
  onPilih: (nomor: number) => void
}

/** Kelompok pohon dekoratif (posisi tetap, di sela petak). */
const POHON: { x: number; y: number; r: number }[] = [
  { x: 272, y: 172, r: 10 },
  { x: 292, y: 180, r: 8 },
  { x: 498, y: 228, r: 11 },
  { x: 515, y: 238, r: 8 },
  { x: 706, y: 546, r: 9 },
  { x: 688, y: 552, r: 7 },
  { x: 60, y: 200, r: 8 },
]

export function PetaSvg({ daftarRw, terpilih, karmaRw, onPilih }: Props) {
  return (
    <svg className="peta-svg" viewBox="0 0 760 560" role="img" aria-label="Peta Desa Sukamaju">
      <defs>
        <pattern id="peta-sawah" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(6)">
          <rect width="14" height="14" fill="var(--daun-100)" />
          <path d="M 0 7 H 14" stroke="var(--daun-500)" strokeWidth="1.4" opacity="0.55" />
        </pattern>
      </defs>

      {/* Dasar kartu pos */}
      <rect x="4" y="4" width="752" height="552" rx="18" fill="var(--daun-50)" stroke="var(--border-tegas)" />
      <rect x="14" y="14" width="732" height="532" rx="12" fill="none" stroke="var(--border-halus)" strokeDasharray="6 8" />

      {/* Petak sawah (pola garis tanam) */}
      <polygon points="24,340 130,370 175,470 130,542 24,542" fill="url(#peta-sawah)" stroke="var(--daun-500)" strokeWidth="1" opacity="0.9" />
      <polygon points="664,20 740,20 740,88 678,72" fill="url(#peta-sawah)" stroke="var(--daun-500)" strokeWidth="1" opacity="0.9" />

      {/* Sungai — tiga lapis goresan */}
      <path
        d="M 622 -8 C 596 70, 540 110, 505 170 C 470 230, 420 260, 372 310 C 330 355, 300 380, 258 430 C 215 480, 150 500, 96 568"
        fill="none" stroke="var(--tinta-biru)" strokeWidth="30" strokeLinecap="round" opacity="0.28"
      />
      <path
        d="M 622 -8 C 596 70, 540 110, 505 170 C 470 230, 420 260, 372 310 C 330 355, 300 380, 258 430 C 215 480, 150 500, 96 568"
        fill="none" stroke="var(--tinta-biru)" strokeWidth="16" strokeLinecap="round" opacity="0.24"
      />
      <path
        d="M 622 -8 C 596 70, 540 110, 505 170 C 470 230, 420 260, 372 310 C 330 355, 300 380, 258 430 C 215 480, 150 500, 96 568"
        fill="none" stroke="var(--kertas-050)" strokeWidth="2" strokeDasharray="10 14" strokeLinecap="round" opacity="0.7"
      />

      {/* Jalan kampung + cabang */}
      <path d="M -5 352 C 120 342, 220 356, 320 348 C 420 340, 560 354, 765 342" fill="none" stroke="var(--kertas-400)" strokeWidth="18" strokeLinecap="round" />
      <path d="M -5 352 C 120 342, 220 356, 320 348 C 420 340, 560 354, 765 342" fill="none" stroke="var(--kertas-200)" strokeWidth="13" strokeLinecap="round" />
      <path d="M 330 348 C 336 300, 342 220, 344 168" fill="none" stroke="var(--kertas-400)" strokeWidth="10" strokeLinecap="round" />
      <path d="M 330 348 C 336 300, 342 220, 344 168" fill="none" stroke="var(--kertas-200)" strokeWidth="6" strokeLinecap="round" />
      <path d="M 470 349 C 480 390, 500 420, 540 448" fill="none" stroke="var(--kertas-400)" strokeWidth="10" strokeLinecap="round" />
      <path d="M 470 349 C 480 390, 500 420, 540 448" fill="none" stroke="var(--kertas-200)" strokeWidth="6" strokeLinecap="round" />
      <path d="M -5 352 C 120 342, 220 356, 320 348 C 420 340, 560 354, 765 342" fill="none" stroke="var(--tinta-pudar)" strokeWidth="1.4" strokeDasharray="9 8" opacity="0.6" />

      {/* Jembatan di perlintasan sungai–jalan */}
      <rect x="314" y="331" width="32" height="28" rx="4" fill="var(--kunyit-700)" opacity="0.55" />
      <path d="M 314 336 H 346 M 314 354 H 346" stroke="var(--kertas-100)" strokeWidth="2" opacity="0.7" />

      {/* Petak RW organik (klik untuk membuka panel keluarga) */}
      {daftarRw.map((rw) => {
        const bentuk = PETAK_RW[rw.nomor]
        if (!bentuk) return null
        const aktif = terpilih === rw.nomor
        return (
          <g
            key={rw.nomor}
            className={`peta-petak ${aktif ? 'peta-petak--aktif' : ''}`}
            onClick={() => onPilih(rw.nomor)}
          >
            <title>
              {`RW ${rw.nomor} — ${rw.nama} (jarak ${LABEL_JARAK[rw.jarak]}). ` +
                (rw.kkTersurvei > 0
                  ? `IKS agregat ${(rw.iks * 100).toFixed(0)}.`
                  : 'Belum tersurvei kader — datanya masih abu-abu.')}
            </title>
            <path
              className="peta-petak__bidang"
              d={jalurOrganik(bentuk)}
              fill={warnaPetak(rw)}
              fillOpacity={rw.kkTersurvei > 0 ? 0.82 : 0.55}
              stroke={aktif ? 'var(--tinta)' : 'var(--border-tinta)'}
              strokeWidth={aktif ? 3 : 1.5}
            />
            <text x={bentuk.cx} y={bentuk.cy - 4} textAnchor="middle" className="peta-label">
              {`RW ${rw.nomor} · ${rw.nama}`}
            </text>
            <text x={bentuk.cx} y={bentuk.cy + 13} textAnchor="middle" className="peta-label peta-label--sub">
              {`KK tersurvei ${rw.kkTersurvei}/${rw.totalKk}`}
            </text>
            {karmaRw.has(rw.nomor) && (
              <g className="peta-karma">
                <circle cx={bentuk.cx + 44} cy={bentuk.cy - 40} r="10" fill="var(--tinta-merah)" />
                <text x={bentuk.cx + 44} y={bentuk.cy - 35} textAnchor="middle" className="peta-karma__seru">
                  !
                </text>
                <title>Ada keluarga yang perlu perhatian segera di RW ini.</title>
              </g>
            )}
            {/* Mendung (DeepThink "game juice"): IKS Tidak Sehat dpt metafora
                visual cuaca, bukan cuma warna — lebih terasa sekilas mata. */}
            {mendungPetak(rw) && (
              <g className="peta-mendung" aria-hidden="true">
                <ellipse cx={bentuk.cx - 18} cy={bentuk.cy - 26} rx="26" ry="11" />
                <ellipse cx={bentuk.cx + 14} cy={bentuk.cy - 30} rx="22" ry="10" />
                <ellipse cx={bentuk.cx - 2} cy={bentuk.cy - 34} rx="20" ry="9" />
              </g>
            )}
          </g>
        )
      })}

      {/* Puskesmas — rumah kecil bersalib hijau di dekat jembatan */}
      <g className="peta-puskesmas">
        <title>Puskesmas Sukamaju — titik berangkatmu setiap pagi.</title>
        <rect x="374" y="296" width="40" height="26" rx="2" fill="var(--kertas-050)" stroke="var(--tinta)" strokeWidth="1.5" />
        <polygon points="370,297 394,282 418,297" fill="var(--daun-700)" />
        <rect x="390" y="300" width="8" height="3" fill="var(--daun-700)" />
        <rect x="392.5" y="297.5" width="3" height="8" fill="var(--daun-700)" />
        <rect x="386" y="310" width="8" height="12" fill="var(--kertas-400)" />
        <text x="394" y="338" textAnchor="middle" className="peta-label peta-label--sub">
          PUSKESMAS
        </text>
      </g>

      {/* Pohon dekoratif */}
      {POHON.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="var(--daun-600)" opacity="0.5" />
      ))}

      {/* Cartouche kartu pos + matahari pagi */}
      <g>
        <circle cx="708" cy="132" r="16" fill="var(--kunyit-600)" opacity="0.75" />
        <g stroke="var(--kunyit-600)" strokeWidth="2" strokeLinecap="round" opacity="0.6">
          <path d="M 708 106 V 98" />
          <path d="M 708 158 V 166" />
          <path d="M 682 132 H 674" />
          <path d="M 742 132 H 734" />
          <path d="M 690 114 L 684 108" />
          <path d="M 726 114 L 732 108" />
          <path d="M 690 150 L 684 156" />
          <path d="M 726 150 L 732 156" />
        </g>
      </g>
      <g>
        <rect x="26" y="24" width="196" height="30" rx="6" fill="var(--kertas-050)" stroke="var(--border-tegas)" opacity="0.92" />
        <text x="124" y="43" textAnchor="middle" className="peta-cartouche">
          DESA SUKAMAJU · 8 RW
        </text>
      </g>
    </svg>
  )
}
