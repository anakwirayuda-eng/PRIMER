/**
 * RUMAH ILUSTRASI — interior rumah warga desa, SVG statis bergaya siluet hangat.
 * Cukup generik untuk semua keluarga: dinding papan, jendela bercahaya pagi,
 * perabot siluet lembut, pintu belakang menghadap kebun. Hotspot ditumpangkan
 * layar Kunjungan di atasnya (persen 0-100), maka preserveAspectRatio="none".
 */

export function RumahIlustrasi() {
  return (
    <svg
      className="kunjungan-rumah"
      viewBox="0 0 1000 620"
      preserveAspectRatio="none"
      role="img"
      aria-label="Ruang tamu rumah warga"
    >
      {/* Dinding & lantai */}
      <rect x="0" y="0" width="1000" height="460" fill="var(--kertas-200)" />
      <rect x="0" y="380" width="1000" height="80" fill="var(--kertas-300)" />
      <rect x="0" y="460" width="1000" height="160" fill="var(--kertas-300)" />
      {/* Papan lantai */}
      <g stroke="var(--border-halus)" strokeWidth="2">
        <path d="M 0 505 H 1000" />
        <path d="M 0 550 H 1000" />
        <path d="M 0 592 H 1000" />
        <path d="M 180 460 L 140 620" />
        <path d="M 430 460 L 415 620" />
        <path d="M 690 460 L 715 620" />
      </g>
      {/* Garis papan dinding */}
      <g stroke="var(--border-halus)" strokeWidth="1.5" opacity="0.7">
        <path d="M 0 90 H 1000" />
        <path d="M 0 200 H 1000" />
        <path d="M 0 310 H 1000" />
      </g>
      {/* Bayang plafon */}
      <rect x="0" y="0" width="1000" height="42" fill="var(--malam-800)" opacity="0.06" />

      {/* Jendela kiri + cahaya pagi */}
      <g>
        <rect x="108" y="106" width="176" height="196" rx="4" fill="var(--kertas-050)" stroke="var(--border-tegas)" strokeWidth="4" />
        <rect x="118" y="116" width="156" height="176" fill="var(--kunyit-100)" />
        <path d="M 196 116 V 292 M 118 204 H 274" stroke="var(--border-tegas)" strokeWidth="4" />
        {/* Tirai */}
        <path d="M 108 106 Q 132 190 112 302 L 108 302 Z" fill="var(--kunyit-600)" opacity="0.3" />
        <path d="M 284 106 Q 260 190 280 302 L 284 302 Z" fill="var(--kunyit-600)" opacity="0.3" />
        {/* Berkas cahaya jatuh ke lantai */}
        <polygon points="122,296 272,296 462,564 208,564" fill="var(--kunyit-100)" opacity="0.5" />
      </g>

      {/* Pintu belakang terbuka — kebun hijau */}
      <g>
        <rect x="822" y="158" width="132" height="302" rx="3" fill="var(--kertas-050)" stroke="var(--border-tegas)" strokeWidth="4" />
        <rect x="834" y="170" width="108" height="290" fill="var(--daun-100)" />
        <rect x="834" y="404" width="108" height="56" fill="var(--daun-600)" opacity="0.4" />
        <circle cx="868" cy="380" r="26" fill="var(--daun-500)" opacity="0.75" />
        <circle cx="912" cy="362" r="34" fill="var(--daun-600)" opacity="0.6" />
        <circle cx="890" cy="398" r="18" fill="var(--daun-700)" opacity="0.5" />
        {/* Daun pintu terbuka ke dalam */}
        <polygon points="822,158 776,180 776,470 822,460" fill="var(--kunyit-700)" opacity="0.45" />
        <circle cx="784" cy="322" r="4" fill="var(--malam-600)" opacity="0.5" />
      </g>

      {/* Siluet perabot — hangat, lembut */}
      <g fill="var(--malam-600)" fillOpacity="0.28">
        {/* Lemari kayu */}
        <rect x="322" y="176" width="116" height="266" rx="4" />
        <rect x="316" y="168" width="128" height="12" rx="3" />
        {/* Meja tamu */}
        <rect x="486" y="360" width="190" height="14" rx="4" />
        <rect x="498" y="374" width="12" height="76" />
        <rect x="652" y="374" width="12" height="76" />
        {/* Teko & cangkir di meja */}
        <path d="M 556 336 q -4 -22 14 -24 q 20 -2 18 22 q 12 2 10 12 h -42 Z" />
        <rect x="606" y="348" width="16" height="12" rx="3" />
        {/* Kursi kiri & kanan */}
        <rect x="436" y="312" width="14" height="94" rx="3" />
        <rect x="424" y="396" width="58" height="12" rx="3" />
        <rect x="428" y="408" width="10" height="42" />
        <rect x="470" y="408" width="10" height="42" />
        <rect x="712" y="312" width="14" height="94" rx="3" />
        <rect x="702" y="396" width="58" height="12" rx="3" />
        <rect x="706" y="408" width="10" height="42" />
        <rect x="748" y="408" width="10" height="42" />
        {/* Rak dapur pojok kiri */}
        <rect x="18" y="330" width="72" height="10" rx="2" />
        <rect x="26" y="300" width="14" height="30" rx="3" />
        <rect x="48" y="292" width="18" height="38" rx="4" />
        <rect x="18" y="352" width="72" height="98" rx="4" />
      </g>

      {/* Hiasan dinding (garis, bukan siluet penuh) */}
      <g>
        {/* Bingkai foto keluarga */}
        <rect x="530" y="112" width="64" height="50" fill="var(--kertas-050)" stroke="var(--malam-600)" strokeOpacity="0.4" strokeWidth="4" />
        <circle cx="552" cy="132" r="7" fill="var(--malam-600)" opacity="0.3" />
        <circle cx="574" cy="134" r="6" fill="var(--malam-600)" opacity="0.3" />
        <rect x="612" y="120" width="42" height="58" fill="var(--kertas-050)" stroke="var(--malam-600)" strokeOpacity="0.4" strokeWidth="4" />
        <circle cx="633" cy="142" r="8" fill="var(--malam-600)" opacity="0.3" />
        {/* Jam dinding */}
        <circle cx="742" cy="118" r="24" fill="var(--kertas-050)" stroke="var(--malam-600)" strokeOpacity="0.45" strokeWidth="4" />
        <path d="M 742 118 V 103 M 742 118 L 752 124" stroke="var(--malam-600)" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
        {/* Kalender/kartu di dekat pintu */}
        <rect x="762" y="106" width="46" height="62" fill="var(--kertas-050)" stroke="var(--malam-600)" strokeOpacity="0.35" strokeWidth="3" />
        <path d="M 768 122 H 802 M 768 134 H 802 M 768 146 H 794" stroke="var(--malam-600)" strokeOpacity="0.3" strokeWidth="2.5" />
      </g>

      {/* Tikar pandan di lantai */}
      <g>
        <ellipse cx="566" cy="540" rx="188" ry="36" fill="var(--kunyit-700)" opacity="0.22" />
        <ellipse cx="566" cy="540" rx="150" ry="26" fill="none" stroke="var(--kunyit-700)" strokeWidth="2" opacity="0.3" />
      </g>
    </svg>
  )
}
