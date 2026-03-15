import { useRef, useEffect } from 'react'
import { useStore } from '../store/useStore'

const PALETTE = [
  '#E63946', '#F4A261', '#E9C46A', '#2A9D8F',
  '#5B8DD9', '#9B72CF', '#F77F00', '#FCBF49',
  '#EAE2B7', '#D62828', '#023E8A', '#0077B6',
  '#48CAE4', '#80B918', '#FFFFFF', '#1A1A1A'
]

function isValidHex(val: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(val)
}

/**
 * ColorPicker — floating panel with preset palette + live hex input.
 */
export function ColorPicker(): JSX.Element | null {
  const showColorPicker = useStore((s) => s.showColorPicker)
  const activeColor     = useStore((s) => s.activeColor)
  const setActiveColor  = useStore((s) => s.setActiveColor)
  const hexInputRef     = useRef<HTMLInputElement>(null)
  const previewRef      = useRef<HTMLSpanElement>(null)

  // Keep hex input in sync when color changes from outside (e.g. palette click)
  useEffect(() => {
    if (hexInputRef.current) hexInputRef.current.value = activeColor
    if (previewRef.current) previewRef.current.style.background = activeColor
  }, [activeColor])

  if (!showColorPicker) return null

  const handleHexInput = (val: string): void => {
    // Update preview live as the user types
    if (previewRef.current) {
      previewRef.current.style.background = isValidHex(val) ? val : activeColor
    }
  }

  const handleHexCommit = (): void => {
    const val = hexInputRef.current?.value ?? ''
    if (isValidHex(val)) setActiveColor(val)
    else if (hexInputRef.current) hexInputRef.current.value = activeColor
  }

  return (
    <div className="color-picker">
      <div className="palette-grid">
        {PALETTE.map((color) => (
          <button
            key={color}
            className={`palette-swatch ${activeColor === color ? 'selected' : ''}`}
            style={{ background: color }}
            onClick={() => setActiveColor(color)}
            title={color}
          />
        ))}
      </div>

      <div className="hex-input-row">
        <span ref={previewRef} className="hex-preview" style={{ background: activeColor }} />
        <input
          ref={hexInputRef}
          className="hex-input"
          defaultValue={activeColor}
          maxLength={7}
          onChange={(e) => handleHexInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleHexCommit()}
          onBlur={handleHexCommit}
          placeholder="#rrggbb"
          spellCheck={false}
        />
      </div>
    </div>
  )
}
