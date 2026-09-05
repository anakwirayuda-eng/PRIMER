import { expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'
import { useGame } from '../store'
import { PetaDesa } from './PetaDesa'

it('roster memilih dan memfokuskan keluarga tertentu dalam RW', async () => {
  const state = buildInitialState('Lab 2', 10, PACK)
  const keluarga = Object.values(PACK.keluarga)[0]!
  useGame.setState({ state: { ...state, desa: { ...state.desa, binaan: [keluarga.id] } }, lastEvents: [], eventTick: 0, petaTargetKeluargaId: null })
  render(<PetaDesa />)
  await userEvent.setup().click(screen.getByRole('button', { name: new RegExp(keluarga.namaKeluarga) }))
  const tujuan = document.getElementById(`peta-keluarga-${keluarga.id}`)
  expect(tujuan).toHaveClass('peta-keluarga--ditautkan')
  expect(tujuan).toHaveFocus()
  await userEvent.setup().click(screen.getByRole('button', { name: /ALBUM KELUARGA/ }))
  await userEvent.setup().click(screen.getByRole('button', { name: 'Buka kartu keluarga →' }))
  expect(tujuan).toHaveFocus()
})
