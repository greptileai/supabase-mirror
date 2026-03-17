import { describe, expect, it } from 'vitest'

import { resolveColumnsForWidth } from './index'

describe('resolveColumnsForWidth', () => {
  it('caps the visible count by max rows', () => {
    expect(resolveColumnsForWidth({ width: 1600, maxRows: 4, minWidth: 280, gap: 16 })).toBe(4)
  })

  it('reduces visible items as the container narrows', () => {
    expect(resolveColumnsForWidth({ width: 1200, maxRows: 4, minWidth: 280, gap: 16 })).toBe(4)
    expect(resolveColumnsForWidth({ width: 900, maxRows: 4, minWidth: 280, gap: 16 })).toBe(3)
    expect(resolveColumnsForWidth({ width: 700, maxRows: 4, minWidth: 280, gap: 16 })).toBe(2)
    expect(resolveColumnsForWidth({ width: 500, maxRows: 4, minWidth: 280, gap: 16 })).toBe(1)
  })

  it('keeps the full slot count even when there are fewer items', () => {
    expect(resolveColumnsForWidth({ width: 1600, maxRows: 4, minWidth: 280, gap: 16 })).toBe(4)
  })

  it('always returns at least one visible slot', () => {
    expect(resolveColumnsForWidth({ width: 0, maxRows: 4, minWidth: 280, gap: 16 })).toBe(1)
  })
})
