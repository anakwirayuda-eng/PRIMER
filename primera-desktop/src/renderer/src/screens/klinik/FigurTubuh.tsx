/**
 * FIGUR TUBUH — siluet manusia SVG inline sederhana dengan 10 regio klik
 * (sesuai `RegionFisik` di content/types). Siluet dasar = regio Keadaan Umum;
 * regio non-topografis (kulit, neurologis) diberi penanda bergaris putus
 * (bercak kulit di lengan bawah, lingkar refleks patela di lutut).
 */

import type { RegionFisik } from '@content/types'
import { LABEL_REGION } from './util'

interface Props {
  diperiksa: readonly RegionFisik[]
  onPeriksa: (region: RegionFisik) => void
}

export function FigurTubuh({ diperiksa, onPeriksa }: Props) {
  const kelas = (r: RegionFisik): string =>
    `klinik-figur__hot${diperiksa.includes(r) ? ' klinik-figur__hot--sudah' : ''}`

  const judul = (r: RegionFisik): string =>
    diperiksa.includes(r) ? `${LABEL_REGION[r]} — sudah diperiksa` : `Periksa: ${LABEL_REGION[r]}`

  return (
    <svg
      className="klinik-figur"
      viewBox="0 0 220 360"
      role="img"
      aria-label="Figur tubuh pasien — klik regio untuk memeriksa"
    >
      {/* Siluet dasar (klik = Keadaan Umum) */}
      <g className={kelas('umum')} onClick={() => onPeriksa('umum')}>
        <title>{judul('umum')}</title>
        <circle cx={110} cy={42} r={26} className="klinik-figur__siluet" />
        <rect x={100} y={64} width={20} height={20} rx={6} className="klinik-figur__siluet" />
        <rect x={70} y={80} width={80} height={112} rx={20} className="klinik-figur__siluet" />
        <rect x={42} y={88} width={24} height={96} rx={12} className="klinik-figur__siluet" />
        <rect x={154} y={88} width={24} height={96} rx={12} className="klinik-figur__siluet" />
        <rect x={76} y={190} width={68} height={28} rx={10} className="klinik-figur__siluet" />
        <rect x={78} y={216} width={28} height={122} rx={13} className="klinik-figur__siluet" />
        <rect x={114} y={216} width={28} height={122} rx={13} className="klinik-figur__siluet" />
      </g>

      {/* Ekstremitas: kedua lengan & tungkai */}
      <g className={kelas('ekstremitas')} onClick={() => onPeriksa('ekstremitas')}>
        <title>{judul('ekstremitas')}</title>
        <rect x={42} y={88} width={24} height={96} rx={12} className="klinik-figur__zona" />
        <rect x={154} y={88} width={24} height={96} rx={12} className="klinik-figur__zona" />
        <rect x={78} y={216} width={28} height={122} rx={13} className="klinik-figur__zona" />
        <rect x={114} y={216} width={28} height={122} rx={13} className="klinik-figur__zona" />
      </g>

      {/* Kepala & leher */}
      <g className={kelas('kepala_leher')} onClick={() => onPeriksa('kepala_leher')}>
        <title>{judul('kepala_leher')}</title>
        <circle cx={110} cy={42} r={27} className="klinik-figur__zona" />
        <rect x={99} y={63} width={22} height={22} rx={7} className="klinik-figur__zona" />
      </g>

      {/* Toraks & paru */}
      <g className={kelas('toraks_paru')} onClick={() => onPeriksa('toraks_paru')}>
        <title>{judul('toraks_paru')}</title>
        <rect x={76} y={86} width={68} height={54} rx={14} className="klinik-figur__zona" />
      </g>

      {/* Abdomen */}
      <g className={kelas('abdomen')} onClick={() => onPeriksa('abdomen')}>
        <title>{judul('abdomen')}</title>
        <rect x={76} y={142} width={68} height={48} rx={14} className="klinik-figur__zona" />
      </g>

      {/* Jantung (apeks kiri pasien = kanan pandang) */}
      <g className={kelas('jantung')} onClick={() => onPeriksa('jantung')}>
        <title>{judul('jantung')}</title>
        <circle cx={122} cy={107} r={11} className="klinik-figur__zona" />
      </g>

      {/* Mata */}
      <g className={kelas('mata')} onClick={() => onPeriksa('mata')}>
        <title>{judul('mata')}</title>
        <circle cx={101} cy={37} r={5} className="klinik-figur__zona" />
        <circle cx={119} cy={37} r={5} className="klinik-figur__zona" />
      </g>

      {/* THT & mulut (mulut + kedua telinga) */}
      <g className={kelas('tht_mulut')} onClick={() => onPeriksa('tht_mulut')}>
        <title>{judul('tht_mulut')}</title>
        <ellipse cx={110} cy={54} rx={11} ry={5.5} className="klinik-figur__zona" />
        <circle cx={83} cy={43} r={5} className="klinik-figur__zona" />
        <circle cx={137} cy={43} r={5} className="klinik-figur__zona" />
      </g>

      {/* Kulit: bercak inspeksi di lengan bawah kanan pasien */}
      <g className={kelas('kulit')} onClick={() => onPeriksa('kulit')}>
        <title>{judul('kulit')}</title>
        <ellipse
          cx={166}
          cy={158}
          rx={10}
          ry={14}
          className="klinik-figur__zona klinik-figur__zona--tanda"
        />
      </g>

      {/* Neurologis: lingkar refleks patela di lutut kiri pasien */}
      <g className={kelas('neurologis')} onClick={() => onPeriksa('neurologis')}>
        <title>{judul('neurologis')}</title>
        <circle
          cx={92}
          cy={238}
          r={11}
          className="klinik-figur__zona klinik-figur__zona--tanda"
        />
      </g>
    </svg>
  )
}
