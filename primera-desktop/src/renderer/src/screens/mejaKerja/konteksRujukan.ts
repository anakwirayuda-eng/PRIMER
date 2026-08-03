/**
 * Terjemahan state episode → bendera naratif untuk storylet debrief.
 *
 * Dulu logika ini tertanam langsung di MejaKerja.tsx, sehingga tidak pernah
 * ada test yang menyentuhnya: storylet.test.ts menyuapkan bendera secara
 * langsung, jadi seluruh seam "state apa yang PANTAS disebut selesai" tak
 * terjaga. Di seam itulah temuan P1-1 audit CODEX (2026-08-03) bersembunyi.
 *
 * Aturan yang dijaga di sini: bedakan ALUR INFORMASI dari ALUR TINDAKAN.
 * Kabar yang kembali bukan berarti pekerjaan selesai.
 */
import type { CareEpisodeLite } from '@engine/state'

export interface BenderaRujukan {
  /** Berkas terkirim, kabar belum kembali. */
  rujukanMenunggu: boolean
  /** Kabar sudah kembali (termasuk PENOLAKAN), dokter belum menindaklanjuti. */
  rujukanUmpanBalik: boolean
  /** Umpan balik benar-benar diadopsi, atau episode sudah terverifikasi. */
  rujukanTuntas: boolean
}

function masihTerbuka(episode: CareEpisodeLite): boolean {
  return episode.status !== 'terverifikasi' && episode.status !== 'berakhir'
}

export function benderaRujukan(episodes: readonly CareEpisodeLite[]): BenderaRujukan {
  return {
    rujukanMenunggu: episodes.some(
      (e) =>
        Boolean(e.referral) &&
        masihTerbuka(e) &&
        e.referral?.stage !== 'feedback' &&
        e.referral?.stage !== 'acted',
    ),
    // Penolakan RS juga memakai stage 'feedback' (reducer.ts:888/:934). Itu
    // TETAP umpan balik yang kembali — yang tidak boleh diklaim adalah bahwa
    // pelayanannya sudah dilakukan.
    rujukanUmpanBalik: episodes.some(
      (e) => e.referral?.stage === 'feedback' && masihTerbuka(e),
    ),
    rujukanTuntas: episodes.some(
      (e) => Boolean(e.referral) && (e.referral?.stage === 'acted' || e.status === 'terverifikasi'),
    ),
  }
}
