import { useRef } from 'react'
import { useStore } from '../store/useStore'

const PALETTE = [
  '#E63946', '#F4A261', '#E9C46A', '#2A9D8F',
  '#5B8DD9', '#9B72CF', '#F77F00', '#FCBF49',
  '#EAE2B7', '#D62828', '#023E8A', '#0077B6',
  '#48CAE4', '#80B918', '#FFFFFF', '#1A1A1A'
]

/**
 * ColorPicker — floating panel with a preset palette + hex input.
 * Appears when the color button in the Toolbar is active.
 */
export function ColorPicker(): JSX.Element | null {
  const showColorPicker = useStore((s) => s.showColorPicker)
  const activeColor = useStore((s) => s.activeColor)
  const setActiveColor = useStore((s) => s.setActiveColor)
  const hexInputRef = useRef<HTMLInputElement>(null)

  if (!showColorPicker) return null

  const handleHexCommit = (): void => {
    const val = hexInputRef.current?.value ?? ''
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) setActiveColor(val)
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
        <span className="hex-preview" style={{ background: activeColor }} />
        <input
          ref={hexInputRef}
          className="hex-input"
          defaultValue={activeColor}
          maxLength={7}
          onKeyDown={(e) => e.key === 'Enter' && handleHexCommit()}
          onBlur={handleHexCommit}
          placeholder="#rrggbb"
        />
      </div>
    </div>
  )
}
