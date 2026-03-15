import { Plus, Minus, Paintbrush, Grid3X3, Download, Undo2, Redo2, RotateCcw } from 'lucide-react'
import { useStore } from '../store/useStore'
import { ToolName, MeshToolName } from '../engine/SceneManager'
import { PrimitiveType } from '../engine/mesh/MeshObject'
import { MeshToolbar } from './MeshToolbar'

const VOXEL_TOOLS: { name: ToolName; icon: React.ReactNode; label: string }[] = [
  { name: 'navigate', icon: <RotateCcw size={18} />,  label: 'Rotate view (N)' },
  { name: 'add',      icon: <Plus size={18} />,        label: 'Add voxel (A)'   },
  { name: 'remove',   icon: <Minus size={18} />,       label: 'Remove voxel (R)'},
  { name: 'paint',    icon: <Paintbrush size={18} />,  label: 'Paint voxel (P)' },
]

interface Props {
  onExport: () => void
  onUndo: () => void
  onRedo: () => void
  onAddPrimitive: (type: PrimitiveType) => void
  onMeshTool: (tool: MeshToolName) => void
}

export function Toolbar({ onExport, onUndo, onRedo, onAddPrimitive, onMeshTool }: Props): JSX.Element {
  const appMode        = useStore((s) => s.appMode)
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

      {/* Voxel tools */}
      {appMode === 'voxel' && (
        <>
          <div className="toolbar-group">
            {VOXEL_TOOLS.map((t) => (
              <button
                key={t.name}
                className={`tool-btn ${activeTool === t.name ? 'active' : ''}`}
                onClick={() => setActiveTool(t.name)}
                title={t.label}
              >
                {t.icon}
              </button>
            ))}
          </div>

          <div className="toolbar-divider" />

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
              title="Toggle grid"
            >
              <Grid3X3 size={18} />
            </button>
          </div>

          <div className="toolbar-divider" />

          <div className="toolbar-group">
            <button className="tool-btn" onClick={onUndo} disabled={!canUndo} title="Undo (⌘Z)">
              <Undo2 size={18} />
            </button>
            <button className="tool-btn" onClick={onRedo} disabled={!canRedo} title="Redo (⌘⇧Z)">
              <Redo2 size={18} />
            </button>
          </div>
        </>
      )}

      {/* Mesh tools */}
      {appMode === 'mesh' && (
        <MeshToolbar onAddPrimitive={onAddPrimitive} onMeshTool={onMeshTool} />
      )}

      <div className="toolbar-spacer" />

      <div className="toolbar-group">
        <button className="tool-btn export-btn" onClick={onExport} title="Export GLB (⌘E)">
          <Download size={18} />
        </button>
      </div>
    </div>
  )
}
