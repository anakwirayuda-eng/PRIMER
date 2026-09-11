import { expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { buildInitialState } from '@engine/init'
import type { CareEpisodeLite } from '@engine/state'
import { PACK } from '@content/index'
import { useGame } from '../../store'
import { KabarSukamaju } from './KabarSukamaju'

it('kabar yang selesai tetap terbaca tanpa memberi kesan semua pulih atau masih lewat tempo', () => {
  const episode: CareEpisodeLite = { id: 'tuntas', subjectId: 'uji', subjectName: 'Keluarga Uji', source: 'keluarga', problemId: 'uji', problemLabel: 'Masalah tercatat', status: 'berakhir', owner: 'dokter', openedDay: 1, updatedDay: 6, dueDay: 3, nextAction: 'Kunjungi lagi', receipt: { signal: 'Sinyal', next: 'Kontrol', feedback: 'Berakhir setelah kesempatan tindak lanjut terlewat.' }, history: [] }
  const state = { ...buildInitialState('Kabar', 131, PACK), hari: 10, careEpisodes: [episode] }
  useGame.setState({ state })
  const view = render(<KabarSukamaju />)
  expect(screen.getByRole('heading', { name: 'Kabar setelah tindak lanjut' })).toBeInTheDocument()
  expect(screen.getByText('Berakhir tanpa pemulihan')).toBeInTheDocument()
  expect(view.container.querySelector('.lab-story--lewat')).toBeNull()
  view.unmount()
  useGame.setState({ state: { ...state, careEpisodes: [episode, { ...episode, id: 'aktif', subjectName: 'Keluarga Aktif', status: 'menunggu' }] } })
  render(<KabarSukamaju />)
  expect(screen.getByRole('heading', { name: 'Cerita yang belum selesai' })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Selesai (1)' }))
  expect(screen.getByRole('heading', { name: 'Kabar setelah tindak lanjut' })).toBeInTheDocument()
})
