import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TautanSumber, urlSumberAman } from './TautanSumber'

describe('<TautanSumber />', () => {
  it('membuka setiap URL HTTPS di browser bawaan dengan nama aksesibel', () => {
    render(
      <TautanSumber
        sumber={[
          {
            id: 'kemenkes:uji',
            label: 'Kemenkes · Pedoman Uji',
            url: 'https://example.com/pedoman',
          },
          {
            id: 'who:uji',
            label: 'WHO · Guideline Uji',
            url: 'https://example.org/guideline',
          },
        ]}
      />,
    )

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute('href', 'https://example.com/pedoman')
    expect(links[0]).toHaveAttribute('target', '_blank')
    expect(links[0]).toHaveAttribute('rel', 'noreferrer')
    expect(links[0]).toHaveAccessibleName(/Kemenkes.*buka di browser bawaan/i)
  })

  it('memblokir URL non-HTTPS dan kredensial tersisip', () => {
    expect(urlSumberAman('https://kemkes.go.id/pedoman')).toBe(true)
    expect(urlSumberAman('http://kemkes.go.id/pedoman')).toBe(false)
    expect(urlSumberAman('https://user:secret@kemkes.go.id/pedoman')).toBe(false)
    expect(urlSumberAman('bukan-url')).toBe(false)

    render(
      <TautanSumber
        sumber={[{
          id: 'rusak',
          label: 'Tautan rusak',
          url: 'javascript:alert(1)',
        }]}
      />,
    )
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText('Tautan rusak')).toBeInTheDocument()
  })
})
