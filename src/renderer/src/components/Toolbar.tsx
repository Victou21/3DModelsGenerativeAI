import { MousePointer, Plus, Minus, Paintbrush, Grid3X3, Palette } from 'lucide-react'
import { useStore } from '../store/useStore'
import { ToolName } from '../engine/SceneManager'

interface ToolItem {
  name: ToolName | 'grid' | 'color'
  icon: React.ReactNode
  label: string
}

const tools: ToolItem[] = [
  { name: 'add', icon: <Plus size={18} />, label: 'Add voxel' },
  { name: 'remove', icon: <Minus size={18} />, label: 'Remove voxel' },
  { name: 'paint', icon: <Paintbrush size={18} />, label: 'Paint voxel' },
]

/**
 * Toolbar — vertical icon bar on the left edge.
 * Minimalist, icon-only, Apple-style.
 */
export function Toolbar(): JSX.Element {
  const activeTool = useStore((s) => s.activeTool)
  const showGrid = useStore((s) => s.showGrid)
  const showColorPicker = useStore((s) => s.showColorPicker)
  const activeColor = useStore((s) => s.activeColor)
  const setActiveTool = useStore((s) => s.setActiveTool)
  const setShowGrid = useStore((s) => s.setShowGrid)
  const setShowColorPicker = useStore((s) => s.setShowColorPicker)

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        {tools.map((tool) => (
          <button
            key={tool.name}
            className={`tool-btn ${activeTool === tool.name ? 'active' : ''}`}
            onClick={() => setActiveTool(tool.name as ToolName)}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <button
          className={`tool-btn ${showGrid ? 'active' : ''}`}
          onClick={() => setShowGrid(!showGrid)}
          title="Toggle grid"
        >
          <Grid3X3 size={18} />
        </button>

        <button
          className={`tool-btn color-btn ${showColorPicker ? 'active' : ''}`}
          onClick={() => setShowColorPicker(!showColorPicker)}
          title="Color picker"
          style={{ '--swatch': activeColor } as React.CSSProperties}
        >
          <span className="color-swatch" />
        </button>
      </div>
    </div>
  )
}
