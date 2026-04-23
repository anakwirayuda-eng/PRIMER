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
    'B87.8': 'Myiasis pada lokasi lain',
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

export function normalizeIcd10OriginalIndo({ code, english, indo }) {
    const override = ICD10_ORIGINAL_INDO_OVERRIDES[code];
    if (override) return override;

    let normalized = (indo || '').replace(/\s+/g, ' ').trim();
    const englishLower = String(english || '').toLowerCase();

    if (englishLower.includes('sites') && /\bsitus\b/i.test(normalized)) {
        normalized = normalized.replace(/\bsitus\b/gi, 'lokasi');
    }
    if (englishLower.includes('appendix') && /\blampiran\b/i.test(normalized)) {
        normalized = normalized.replace(/\blampiran\b/gi, 'apendiks');
    }
    if (englishLower.includes('gait') && /\bkiprah\b/i.test(normalized)) {
        normalized = normalized.replace(/\bkiprah\b/gi, 'gaya jalan');
    }

    return normalized;
}
