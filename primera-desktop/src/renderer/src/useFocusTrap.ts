/**
 * useFocusTrap (M10.a ronde-4, CODEX 2026-07-06, dossier §44) — modal/overlay
 * visual sudah dijaga (§38/§39/§42: z-index, pointer-events, tinggi/overflow),
 * TAPI klik/fokus KEYBOARD tak pernah dicegah menembus ke konten di belakang:
 * tombol HUD (navigasi layar, mute, gigi Pengaturan) tetap `focusable` &
 * ter-`click()` walau tertutup total secara visual oleh overlay modal —
 * dibuktikan empiris (Tab ke tombol Klinik HUD saat Onboarding terbuka lalu
 * aktivasi via Enter/Space memindahkan `state.layar` diam-diam di belakang).
 *
 * Jebak fokus dalam kontainer modal selama `aktif`: Tab/Shift+Tab dibungkus
 * ke elemen focusable PERTAMA/TERAKHIR di dalam kontainer (bukan `inert` —
 * beberapa modal, mis. Pengaturan, hidup NESTED di dalam pohon HUD/bukan
 * portal ke root, jadi menandai leluhur `inert` akan ikut mematikan modal
 * itu sendiri). Escape opsional (modal yang memang wajib-diselesaikan, mis.
 * Rekap/Lokmin MejaKerja, TIDAK diberi `onEscape` — hormati desain "harus
 * diselesaikan", jangan tambah jalan keluar yang penulis sengaja tiadakan).
 */
import { useEffect, useRef } from 'react'

const SELECTOR_FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useFocusTrap<T extends HTMLElement>(
  aktif: boolean,
  onEscape?: () => void,
  opsi?: { fokusKontainer?: boolean },
) {
  const ref = useRef<T>(null)
  const fokusSebelumnya = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!aktif) return
    const kontainer = ref.current
    fokusSebelumnya.current = document.activeElement as HTMLElement | null

    const fokusable = () => Array.from(kontainer?.querySelectorAll<HTMLElement>(SELECTOR_FOCUSABLE) ?? [])
    // Fokus awal: elemen focusable pertama di dalam modal (bukan kontainer
    // itu sendiri — kontainer biasanya bukan interaktif).
    // CODEX audit UI/UX 2026-07-10 (#19): tanpa preventScroll, .focus() bisa
    // men-scroll modal yang overflow-y:auto ke posisi elemen focusable pertama
    // — kalau itu tombol di bagian BAWAH kartu (mis. Onboarding: "Lewati"
    // terletak setelah ikon/judul/isi), modal langsung ter-scroll ke bawah
    // saat dibuka, menyembunyikan isi dari pandangan.
    // CODEX M14 #14b: opsi `fokusKontainer` — modal yang elemen focusable
    // PERTAMA-nya destruktif (mis. PanelHasil "Tutup") memfokuskan KONTAINER
    // (role=dialog + aria-label, kontainer wajib tabIndex=-1) alih-alih tombol,
    // agar Enter saat modal baru terbuka tak sengaja menutup debrief.
    const daftarAwal = fokusable()
    if (opsi?.fokusKontainer) kontainer?.focus({ preventScroll: true })
    else (daftarAwal[0] ?? kontainer)?.focus({ preventScroll: true })

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        onEscape()
        return
      }
      if (e.key !== 'Tab' || !kontainer) return
      const daftar = fokusable()
      if (daftar.length === 0) {
        e.preventDefault()
        return
      }
      const pertama = daftar[0]!
      const terakhir = daftar[daftar.length - 1]!
      const aktifSaatIni = document.activeElement as HTMLElement | null
      // Fokus keluar dari kontainer (mis. via .focus() paksa dari luar, atau
      // wrap alami) — tarik kembali ke ujung yang sesuai, bukan biarkan lolos
      // ke konten latar di belakang overlay.
      if (!kontainer.contains(aktifSaatIni)) {
        e.preventDefault()
        ;(e.shiftKey ? terakhir : pertama).focus({ preventScroll: true })
        return
      }
      if (e.shiftKey && aktifSaatIni === pertama) {
        e.preventDefault()
        terakhir.focus({ preventScroll: true })
      } else if (!e.shiftKey && aktifSaatIni === terakhir) {
        e.preventDefault()
        pertama.focus({ preventScroll: true })
      }
    }
    // Capture phase: tangkap Tab SEBELUM browser memindahkan fokus secara
    // native ke elemen latar (yg tak pernah kita cegah jadi focusable).
    document.addEventListener('keydown', handleKeydown, true)
    return () => {
      document.removeEventListener('keydown', handleKeydown, true)
      fokusSebelumnya.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aktif])

  return ref
}
