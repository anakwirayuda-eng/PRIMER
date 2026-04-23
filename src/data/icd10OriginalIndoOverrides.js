export const ICD10_ORIGINAL_INDO_OVERRIDES = {
    'A06.7': 'Amoebiasis kulit',
    'A20.1': 'Wabah selulokutan',
    'A22.0': 'Antraks kulit',
    'A26.0': 'Erisipeloid kulit',
    'A31.1': 'Infeksi mikobakteri kulit',
    'A32.0': 'Listeriosis kulit',
    'A36.3': 'Difteri kulit',
    'A43.1': 'Nokardiosis kulit',
    'A44.1': 'Bartonellosis kulit dan mukokutan',
    'A51.2': 'Sifilis primer pada lokasi lain',
    'A56.8': 'Infeksi klamidia menular seksual pada lokasi lain',
    'A59.8': 'Trikomoniasis pada lokasi lain',
    'A84.9': 'Ensefalitis virus akibat gigitan kutu, tidak spesifik',
    'A94': 'Demam virus bawaan artropoda tidak spesifik',
    'B67.3': 'Infeksi Echinococcus granulosus pada lokasi lain dan multipel',
    'B67.6': 'Infeksi Echinococcus multilocularis pada lokasi lain dan multipel',
    'B69.8': 'Cysticercosis pada lokasi lain',
    'B37.4': 'Kandidiasis pada lokasi urogenital lain',
    'B37.8': 'Kandidiasis pada lokasi lain',
    'B38.3': 'Koksidioidomikosis kulit',
    'B40.3': 'Blastomikosis kulit',
    'B42.1': 'Sporotrikosis limfokutan',
    'B43.0': 'Kromomikosis kulit',
    'B45.2': 'Kriptokokosis kulit',
    'B46.3': 'Mukormikosis kulit',
    'B78.1': 'Strongiloidiasis kulit',
    'B87.0': 'Miasis kulit',
    'B87.8': 'Miasis pada lokasi lain',
    'C38.0': 'Neoplasma ganas jantung',
    'C38.8': 'Neoplasma ganas tumpang tindih pada lokasi jantung, mediastinum, dan pleura',
    'C06.8': 'Neoplasma ganas tumpang tindih pada lokasi mulut lain dan tidak spesifik',
    'C14.8': 'Neoplasma ganas tumpang tindih pada lokasi bibir, rongga mulut, dan faring',
    'C21.8': 'Neoplasma ganas tumpang tindih pada lokasi rektum, anus, dan kanalis anus',
    'C26.9': 'Neoplasma ganas pada lokasi tidak jelas dalam sistem pencernaan',
    'C34.8': 'Neoplasma ganas tumpang tindih pada lokasi bronkus dan paru',
    'F39': 'Gangguan suasana [afektif] tidak spesifik',
    'H81.1': 'Vertigo paroksismal jinak',
    'I84.7': 'Wasir trombosis tidak spesifik',
    'K25.0': 'Ulkus lambung dengan perdarahan akut',
    'K26.0': 'Ulkus duodenum dengan perdarahan akut',
    'L30.2': 'Autosensitisasi kulit',
    'M08.2': 'Artritis juvenil dengan onset sistemik',
    'N84.1': 'Polip serviks uteri',
    'O16': 'Hipertensi ibu tidak spesifik',
    'P52.3': 'Perdarahan intraventrikular (nontraumatik) tidak spesifik pada janin dan bayi baru lahir',
    'Q85.0': 'Neurofibromatosis (tidak ganas)',
    'R09.2': 'Henti napas',
    'R32': 'Inkontinensia urin tidak spesifik',
    'R45.4': 'Lekas marah dan kemarahan',
    'Y97': 'Kondisi terkait polusi lingkungan'
};

function replaceTermPreservingSentenceCase(text, pattern, replacement) {
    return text.replace(pattern, (match) => {
        if (/^[A-Z]/.test(match)) {
            return replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        return replacement;
    });
}

const CONDITIONAL_TERM_FIXES = [
    { englishPattern: /\bsites?\b/i, indoPattern: /\bsitus\b/gi, replacement: 'lokasi' },
    { englishPattern: /\bappendix\b/i, indoPattern: /\blampiran\b/gi, replacement: 'apendiks' },
    { englishPattern: /\bgait\b/i, indoPattern: /\bkiprah\b/gi, replacement: 'gaya jalan' },
    { englishPattern: /\bsequelae\b/i, indoPattern: /\bsequelae\b/gi, replacement: 'gejala sisa' },
    { englishPattern: /\bnontraumatic\b/i, indoPattern: /\bnontraumatic\b/gi, replacement: 'nontraumatik' },
    { englishPattern: /\bfrostbite\b/i, indoPattern: /\bfrostbite\b/gi, replacement: 'radang dingin' },
    { englishPattern: /\bpediculosis\b/i, indoPattern: /\bpediculosis\b/gi, replacement: 'pedikulosis' },
    { englishPattern: /\bintraventricular\b/i, indoPattern: /\bintraventricular\b/gi, replacement: 'intraventrikular' },
    { englishPattern: /\bintracerebral\b/i, indoPattern: /\bintracerebral\b/gi, replacement: 'intraserebral' },
    { englishPattern: /\bintrathoracic\b/i, indoPattern: /\bintrathoracic\b/gi, replacement: 'intratorakal' },
    { englishPattern: /\bculture\b/i, indoPattern: /\bcultur\b/gi, replacement: 'kultur' },
    { englishPattern: /\bpolyarthritis\b/i, indoPattern: /\bpolyarthritis\b/gi, replacement: 'poliartritis' },
    { englishPattern: /\barthritis\b/i, indoPattern: /\barthritis\b/gi, replacement: 'artritis' },
    { englishPattern: /\bjuvenile\b/i, indoPattern: /\bjuvenile\b/gi, replacement: 'juvenil' },
    { englishPattern: /\bidiopathic\b/i, indoPattern: /\bidiopathic\b/gi, replacement: 'idiopatik' },
    { englishPattern: /\binterstitial\b/i, indoPattern: /\binterstitial\b/gi, replacement: 'interstisial' },
    { englishPattern: /\bpostprocedural\b/i, indoPattern: /\bpostprocedural\b/gi, replacement: 'pascaprosedural' },
    { englishPattern: /\bsepticaemia\b/i, indoPattern: /\bsepticaemia\b/gi, replacement: 'septikemia' },
    { englishPattern: /\bdisc\b/i, indoPattern: /\bdisc\b/gi, replacement: 'disk' },
    { englishPattern: /\bmyelopathy\b/i, indoPattern: /\bmyelopathy\b/gi, replacement: 'mielopati' },
    { englishPattern: /\bcardiomyopathy\b/i, indoPattern: /\bcardiomyopathy\b/gi, replacement: 'kardiomiopati' },
    { englishPattern: /\bmyiasis\b/i, indoPattern: /\bmyiasis\b/gi, replacement: 'miasis' },
    { englishPattern: /\barthrosis\b/i, indoPattern: /\barthrosis\b/gi, replacement: 'artrosis' },
    { englishPattern: /\barthropathies\b/i, indoPattern: /\barthropathies\b/gi, replacement: 'artropati' },
    { englishPattern: /\barthropathy\b/i, indoPattern: /\barthropathy\b/gi, replacement: 'artropati' },
    { englishPattern: /\brheumatoid\b/i, indoPattern: /\brheumatoid\b/gi, replacement: 'reumatoid' },
    { englishPattern: /\bnonrheumatic\b/i, indoPattern: /\bnonrheumatic\b/gi, replacement: 'nonreumatik' },
    { englishPattern: /\bimmunodeficiency\b/i, indoPattern: /\bimmunodeficiency\b/gi, replacement: 'imunodefisiensi' },
    { englishPattern: /\bciliary\b/i, indoPattern: /\bciliary\b/gi, replacement: 'siliaris' },
    { englishPattern: /\bnontraffic\b/i, indoPattern: /\bnontraffic\b/gi, replacement: 'non-lalu lintas' },
    { englishPattern: /\bnonmotor\b/i, indoPattern: /\bnonmotor\b/gi, replacement: 'tidak bermotor' },
    { englishPattern: /\bnoncollision\b/i, indoPattern: /\bnoncollision\b/gi, replacement: 'tanpa tabrakan' },
    { englishPattern: /\bthoracoabdominal\b/i, indoPattern: /\bthoracoabdominal\b/gi, replacement: 'torakoabdominal' },
    { englishPattern: /\bthrombosed\b/i, indoPattern: /\bthrombosed\b/gi, replacement: 'trombosis' },
    { englishPattern: /\bpedestrian\b/i, indoPattern: /\bpedestrian\b/gi, replacement: 'pejalan kaki' },
    { englishPattern: /\bdriver\b/i, indoPattern: /\bdriver\b/gi, replacement: 'pengemudi' },
    { englishPattern: /\bpedal cyclist\b/i, indoPattern: /\bpedal sepeda\b/gi, replacement: 'pengendara sepeda' },
    { englishPattern: /\bpedal cycle\b/i, indoPattern: /\bsiklus pedal\b/gi, replacement: 'sepeda' }
];

export function normalizeIcd10OriginalIndo({ code, english, indo }) {
    const override = ICD10_ORIGINAL_INDO_OVERRIDES[code];
    if (override) return override;

    let normalized = (indo || '').replace(/\s+/g, ' ').trim();
    const englishLower = String(english || '').toLowerCase();

    if (englishLower.includes('unspecified whether traffic or nontraffic accident')
        && /tidak spesifik apakah lalu lintas atau kecelakaan nontraffic/i.test(normalized)) {
        normalized = replaceTermPreservingSentenceCase(
            normalized,
            /tidak spesifik apakah lalu lintas atau kecelakaan nontraffic/gi,
            'tidak spesifik apakah kecelakaan lalu lintas atau non-lalu lintas'
        );
    }
    if (englishLower.includes('unspecified nontraffic accident')
        && /\bkecelakaan nontraffic spesifik\b/i.test(normalized)) {
        normalized = replaceTermPreservingSentenceCase(
            normalized,
            /\bkecelakaan nontraffic spesifik\b/gi,
            'kecelakaan non-lalu lintas yang tidak spesifik'
        );
    }

    CONDITIONAL_TERM_FIXES.forEach(({ englishPattern, indoPattern, replacement }) => {
        if (englishPattern.test(englishLower) && indoPattern.test(normalized)) {
            normalized = replaceTermPreservingSentenceCase(normalized, indoPattern, replacement);
        }
    });

    return normalized;
}
