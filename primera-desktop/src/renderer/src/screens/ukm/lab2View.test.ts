import { describe, expect, it } from 'vitest'
import { catatanPenyelidikan, episodePrioritas, labelJanji } from './lab2View'
import type { CareEpisodeLite } from '@engine/state'

const episode = (id: string, dueDay: number | undefined, status: CareEpisodeLite['status'] = 'menunggu'): CareEpisodeLite => ({
  id, dueDay, status, subjectId: id, subjectName: id, source: 'keluarga', problemId: 'uji', problemLabel: 'Uji', owner: 'dokter', openedDay: 1, updatedDay: 2, nextAction: 'Kontrol', receipt: { signal: 'Tercatat', next: 'Kontrol' }, history: [],
})
describe('Lab 2 — ringkasan hanya memakai fakta tercatat', () => {
  it('kunjungan ulang tidak dihitung sebagai orang baru; catatan lama tanpa nama tidak digabung', () => {
    const data = catatanPenyelidikan([
      { hari: 10, rw: 1, kasusId: 'dbd', pasienNama: 'A' },
      { hari: 12, rw: 1, kasusId: 'dbd', pasienNama: 'A' },
      { hari: 9, rw: 2, kasusId: 'dbd', pasienNama: 'A' },
      { hari: 12, rw: 1, kasusId: 'dbd' }, { hari: 13, rw: 1, kasusId: 'dbd' },
      { hari: 1, rw: 1, kasusId: 'dbd', pasienNama: 'Lama' },
      { hari: 14, rw: 1, kasusId: 'ispa', pasienNama: 'B' },
    ], 15, 'dbd')
    expect(data).toHaveLength(4)
    expect(data.find((o) => o.nama === 'A' && o.rw === 1)?.hari).toEqual([10, 12])
    expect(data.filter((o) => o.nama === 'Identitas belum tercatat')).toHaveLength(2)
  })
  it('episode lewat tempo tampil dahulu; hasil buruk tidak disamakan dengan pemulihan', () => {
    const semua = [episode('nanti', 10), episode('lewat', 2), episode('belum', undefined), episode('baik', 1, 'terverifikasi'), episode('buruk', 1, 'berakhir')]
    expect(episodePrioritas(semua).map((e) => e.id)).toEqual(['lewat', 'nanti', 'belum'])
    expect(labelJanji(semua[1]!, 4)).toBe('Lewat 2 hari')
    expect(labelJanji(semua[4]!, 4)).toBe('Berakhir tanpa pemulihan')
    expect(semua[0]?.id).toBe('nanti')
  })
})
