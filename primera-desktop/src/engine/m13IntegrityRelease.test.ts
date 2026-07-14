import { describe, expect, it } from 'vitest'
import {
  CONTENT_RELEASE,
  LEGACY_CONTENT_RELEASE,
  releasePolicyAktif,
  type RuntimeContentPack,
} from '@content/pack'
import type { EncounterArchetype } from '@content/curriculum/types'
import { PACK } from '@content/index'
import { buildInitialState } from './init'
import { deserialize, serialize } from './save'
import { susunAntrianHarian } from './director'
import { Rng } from './core/rng'
import { advance, daftarKasusIgdAktif } from './reducer'
import { REVISI_ENGINE, sidikJariPack, susunDossier, verifikasiDossier } from './verifikasi'
import { susunCohortBuildManifest } from './cohortManifest'
import { EXAM_BLUEPRINT_VERSION } from './examBlueprint'

function denganArchetypes(
  ubah: (archetype: EncounterArchetype) => EncounterArchetype,
): RuntimeContentPack {
  return {
    ...PACK,
    runtimeManifest: {
      ...PACK.runtimeManifest,
      encounterArchetypes: PACK.runtimeManifest.encounterArchetypes.map(ubah),
    },
  }
}

describe('M13-0C - identitas rilis save', () => {
  it('state baru selalu membawa CONTENT_RELEASE aktif', () => {
    const state = buildInitialState('Uji', 13, PACK)
    expect(state.contentRelease).toBe(CONTENT_RELEASE)
    expect(state.contentRelease).toBe(PACK.runtimeManifest.contentRelease)
  })

  it('save pra-0C menjadi legacy-baseline tanpa mencemari tallyTermigrasi', () => {
    const state = buildInitialState('Uji', 13, PACK)
    const envelope = JSON.parse(serialize(state)) as { state: Record<string, unknown> }
    delete envelope.state['contentRelease']
    const migrated = deserialize(JSON.stringify(envelope), PACK)
    expect(migrated?.contentRelease).toBe(LEGACY_CONTENT_RELEASE)
    expect(migrated?.tallyTermigrasi ?? []).not.toContain('contentRelease')
  })

  it('release policy memakai urutan eksplisit dan fail-closed untuk id asing', () => {
    const order = [LEGACY_CONTENT_RELEASE, CONTENT_RELEASE]
    expect(releasePolicyAktif({ introducedIn: LEGACY_CONTENT_RELEASE }, CONTENT_RELEASE, order)).toBe(true)
    expect(
      releasePolicyAktif(
        { introducedIn: LEGACY_CONTENT_RELEASE, retiredAfter: LEGACY_CONTENT_RELEASE },
        CONTENT_RELEASE,
        order,
      ),
    ).toBe(false)
    expect(releasePolicyAktif({ introducedIn: 'future' }, CONTENT_RELEASE, order)).toBe(false)
  })
})

describe('M13-0C - isolasi mode dan determinisme draw', () => {
  it('clinic director tidak pernah memilih archetype yang nonaktif di Ujian', () => {
    const state = buildInitialState('Uji', 21, PACK, { mode: 'ujian', nim: '21' })
    const restricted = denganArchetypes((a) =>
      a.channel === 'clinic' ? { ...a, modePolicy: { ...a.modePolicy, ujian: false } } : a,
    )
    const queue = susunAntrianHarian(state, restricted, new Rng(21, 'mode-isolation'))
    expect(queue).toEqual([])
  })

  it('pool IGD difilter menurut mode lalu diurutkan sebelum rng.pick', () => {
    const state = buildInitialState('Uji', 22, PACK, { mode: 'ujian', nim: '22' })
    const reversed: RuntimeContentPack = {
      ...PACK,
      kasusIgd: Object.fromEntries(Object.entries(PACK.kasusIgd).reverse()),
    }
    expect(daftarKasusIgdAktif(state, reversed).map((k) => k.id)).toEqual(
      Object.keys(PACK.kasusIgd).sort(),
    )

    const inactive = denganArchetypes((a) =>
      a.channel === 'igd' ? { ...a, modePolicy: { ...a.modePolicy, ujian: false } } : a,
    )
    expect(daftarKasusIgdAktif(state, inactive)).toEqual([])
  })

  it('kunjungan UKM nonaktif ditolak reducer, bukan hanya disembunyikan UI', () => {
    const family = Object.values(PACK.keluarga).find((f) => f.arc.kunjungan.length > 0)!
    const visit = family.arc.kunjungan[0]!
    const restricted: RuntimeContentPack = {
      ...PACK,
      runtimeManifest: {
        ...PACK.runtimeManifest,
        ukmScenarios: PACK.runtimeManifest.ukmScenarios.map((scenario) =>
          scenario.contentRef.familyId === family.id && scenario.contentRef.visitId === visit.id
            ? { ...scenario, modePolicy: { ...scenario.modePolicy, ujian: false } }
            : scenario,
        ),
      },
    }
    const awal = buildInitialState('Uji', 23, PACK, { mode: 'ujian', nim: '23' })
    const state = {
      ...awal,
      hari: 3,
      blok: 'siang' as const,
      desa: { ...awal.desa, binaan: [family.id] },
      lapanganTerpakai: false,
    }
    const hasil = advance(state, { type: 'MULAI_KUNJUNGAN', keluargaId: family.id }, restricted)
    expect(hasil.events).toContainEqual(
      expect.objectContaining({ type: 'ERROR_AKSI', pesan: expect.stringMatching(/tidak aktif/i) }),
    )
    expect(hasil.state.kunjungan).toBeUndefined()
  })

  it('tie-break karma stabil walau urutan insersi keluarga dibalik', () => {
    const reversed: RuntimeContentPack = {
      ...PACK,
      keluarga: Object.fromEntries(Object.entries(PACK.keluarga).reverse()),
    }
    const a = buildInitialState('Uji', 24, PACK, { mode: 'ujian', nim: '24' })
    const b = buildInitialState('Uji', 24, reversed, { mode: 'ujian', nim: '24' })
    const ringkas = (state: typeof a) =>
      state.jadwal
        .filter((j) => j.jenis === 'karma_igd')
        .map((j) => ({ id: j.id, hari: j.hari, kasusId: j.kasusId }))
    expect(ringkas(b)).toEqual(ringkas(a))
  })
})

describe('M13-0C - dossier dan fingerprint runtime', () => {
  it('release mismatch netral dan diperiksa sebelum replay jejak kosong', async () => {
    const state = {
      ...buildInitialState('Uji', 31, PACK),
      contentRelease: LEGACY_CONTENT_RELEASE,
      jejak: [],
    }
    const dossier = await susunDossier(state, PACK, { versiApp: 'test' })
    const hasil = await verifikasiDossier(JSON.stringify(dossier), PACK, 'test')
    expect(hasil.status).toBe('tidak_dapat_diverifikasi')
    expect(hasil.alasan.join(' ')).toMatch(/rilis konten berbeda/i)
    expect(hasil.alasan.join(' ')).not.toMatch(/jejak aksi kosong/i)
  })

  it('contentRelease tercakup HMAC; edit sesudah ekspor menjadi tidak sah', async () => {
    const state = buildInitialState('Uji', 32, PACK)
    const dossier = await susunDossier(state, PACK, { versiApp: 'test' })
    const tampered = {
      ...dossier,
      lingkungan: { ...dossier.lingkungan, contentRelease: LEGACY_CONTENT_RELEASE },
    }
    const hasil = await verifikasiDossier(JSON.stringify(tampered), PACK, 'test')
    expect(hasil.status).toBe('tidak_sah')
    expect(hasil.alasan.join(' ')).toMatch(/tanda tangan/i)
  })

  it('fingerprint sensitif pada semua field keputusan archetype M13-0C', () => {
    const base = sidikJariPack(PACK)
    const clinic = PACK.runtimeManifest.encounterArchetypes.filter((a) => a.channel === 'clinic')
    const first = clinic[0]!
    const second = clinic[1]!
    const variants: EncounterArchetype[] = [
      { ...first, contentRef: second.contentRef },
      { ...first, channel: 'igd' },
      { ...first, targetFktp: first.targetFktp === 'refer' ? 'manage_at_fktp' : 'refer' },
      { ...first, prevalensi: first.prevalensi === 'tinggi' ? 'rendah' : 'tinggi' },
      { ...first, modePolicy: { ...first.modePolicy, ujian: !first.modePolicy.ujian } },
      { ...first, releasePolicy: { ...first.releasePolicy, retiredAfter: LEGACY_CONTENT_RELEASE } },
      { ...first, credits: [...first.credits, 'synthetic:credit'] },
    ]
    for (const variant of variants) {
      const changed = denganArchetypes((a) => (a.id === first.id ? variant : a))
      expect(sidikJariPack(changed)).not.toBe(base)
    }
  })

  it('CONTENT_RELEASE tetap mekanisme terpisah dari sidikJariPack', () => {
    const changed: RuntimeContentPack = {
      ...PACK,
      runtimeManifest: { ...PACK.runtimeManifest, contentRelease: 'synthetic-release' },
    }
    expect(sidikJariPack(changed)).toBe(sidikJariPack(PACK))
  })
})

describe('M13-0C - manifest kohort', () => {
  it('mewajibkan tanggal, fingerprint, dan SHA-256 installer yang valid', () => {
    const manifest = susunCohortBuildManifest({
      cohortId: 'cohort-uji',
      cohortStart: '2026-09-01',
      cohortEnd: '2026-09-30',
      commitSha: '428fba9',
      appVersion: '1.0.0',
      engineRevision: REVISI_ENGINE,
      contentRelease: CONTENT_RELEASE,
      examBlueprintVersion: EXAM_BLUEPRINT_VERSION,
      sidikJariPack: sidikJariPack(PACK),
      installer: { file: 'primera.exe', bytes: 123, sha256: 'a'.repeat(64) },
      generatedAt: '2026-07-14T00:00:00.000Z',
    })
    expect(manifest.schemaVersion).toBe(2)
    expect(() => susunCohortBuildManifest({ ...manifest, cohortStart: '2026-10-01' })).toThrow(
      /setelah cohortEnd/,
    )
    expect(() => susunCohortBuildManifest({ ...manifest, cohortId: '../keluar' })).toThrow(/slug aman/)
    expect(() => susunCohortBuildManifest({ ...manifest, examBlueprintVersion: ' ' })).toThrow(
      /examBlueprintVersion/,
    )
    expect(() => susunCohortBuildManifest({ ...manifest, cohortStart: '2026-02-31' })).toThrow(
      /YYYY-MM-DD/,
    )
  })
})
