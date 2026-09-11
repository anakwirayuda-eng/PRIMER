import { useEffect, useState, type ReactNode } from 'react'
import { useGame } from '../../store'
import { muatLaci, simpanLaci } from '../../utils/laciPersist'
import { hashSeed } from '@engine/core/rng'

/** Preferensi bacaan per identitas stase; tidak mengubah save atau skor. */
export function LandasanUkm({ jenis, className, children }: { jenis: string; className?: string; children: ReactNode }) {
  const identitas = useGame((s) => s.state ? `${s.state.namaDokter}|${s.state.nim ?? ''}|${s.state.seed}|${s.state.mode}` : 'tanpa-sesi')
  const kunci = `primer.ukm.landasan.${hashSeed(identitas)}`
  const [buka, setBuka] = useState(() => !muatLaci(kunci).has(jenis))
  useEffect(() => { const dilihat = muatLaci(kunci); dilihat.add(jenis); simpanLaci(kunci, dilihat) }, [jenis, kunci])
  return <details className={`${className ?? ''} lab-details`} open={buka} onToggle={(e) => setBuka(e.currentTarget.open)}>
    <summary>Landasan Resmi · sumber dan penjelasan</summary>{children}
  </details>
}
