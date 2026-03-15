import { Plus, Minus, Paintbrush, Grid3X3, Download, Undo2, Redo2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { ToolName } from '../engine/SceneManager'

interface ToolItem {
  name: ToolName
  icon: React.ReactNode
  label: string
  shortcut: string
}

const TOOLS: ToolItem[] = [
  { name: 'add',    icon: <Plus size={18} />,       label: 'Add voxel',    shortcut: 'A' },
  { name: 'remove', icon: <Minus size={18} />,      label: 'Remove voxel', shortcut: 'R' },
  { name: 'paint',  icon: <Paintbrush size={18} />, label: 'Paint voxel',  shortcut: 'P' },
]

interface Props {
  onExport: () => void
  onUndo: () => void
  onRedo: () => void
}

/**
 * Toolbar — vertical icon bar on the left edge.
 * Exposes tool selection, grid toggle, color swatch, undo/redo, and export.
 */
export function Toolbar({ onExport, onUndo, onRedo }: Props): JSX.Element {
  const activeTool     = useStore((s) => s.activeTool)
  const showGrid       = useStore((s) => s.showGrid)
  const showColorPicker = useStore((s) => s.showColorPicker)
  const activeColor    = useStore((s) => s.activeColor)
  const canUndo        = useStore((s) => s.canUndo)
  const canRedo        = useStore((s) => s.canRedo)
  const setActiveTool  = useStore((s) => s.setActiveTool)
  const setShowGrid    = useStore((s) => s.setShowGrid)
  const setShowColorPicker = useStore((s) => s.setShowColorPicker)

  return (
    <div className="toolbar">

      {/* Drawing tools */}
      <div className="toolbar-group">
        {TOOLS.map((tool) => (
          <button
            key={tool.name}
            className={`tool-btn ${activeTool === tool.name ? 'active' : ''}`}
            onClick={() => setActiveTool(tool.name)}
            title={`${tool.label} (${tool.shortcut})`}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <div className="toolbar-divider" />

      {/* Color + grid */}
      <div className="toolbar-group">
        <button
          className={`tool-btn color-btn ${showColorPicker ? 'active' : ''}`}
          onClick={() => setShowColorPicker(!showColorPicker)}
          title="Color picker"
          style={{ '--swatch': activeColor } as React.CSSProperties}
        >
          <span className="color-swatch" />
        </button>

        <button
          className={`tool-btn ${showGrid ? 'active' : ''}`}
          onClick={() => setShowGrid(!showGrid)}
          title="Toggle grid (G)"
        >
          <Grid3X3 size={18} />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Undo / Redo */}
      <div className="toolbar-group">
        <button
          className="tool-btn"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (⌘Z)"
        >
          <Undo2 size={18} />
        </button>

        <button
          className="tool-btn"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (⌘⇧Z)"
        >
          <Redo2 size={18} />
        </button>
      </div>

      <div className="toolbar-spacer" />

      {/* Export — pinned to bottom */}
      <div className="toolbar-group">
        <button
          className="tool-btn export-btn"
          onClick={onExport}
          title="Export GLB (⌘E)"
        >
          <Download size={18} />
        </button>
      </div>

    </div>
  )
}
