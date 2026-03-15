import { MousePointer, Move, RotateCw, Maximize2, Box, Circle, Cylinder, Square, Triangle, Donut } from 'lucide-react'
import { useStore } from '../store/useStore'
import { MeshToolName } from '../engine/SceneManager'
import { PrimitiveType } from '../engine/mesh/MeshObject'

const MESH_TOOLS: { name: MeshToolName; icon: React.ReactNode; label: string }[] = [
  { name: 'select', icon: <MousePointer size={18} />, label: 'Select (S)' },
  { name: 'move',   icon: <Move size={18} />,         label: 'Move (G)'   },
  { name: 'rotate', icon: <RotateCw size={18} />,     label: 'Rotate (R)' },
  { name: 'scale',  icon: <Maximize2 size={18} />,    label: 'Scale (E)'  },
]

const PRIMITIVES: { type: PrimitiveType; icon: React.ReactNode; label: string }[] = [
  { type: 'box',      icon: <Box size={16} />,      label: 'Box'      },
  { type: 'sphere',   icon: <Circle size={16} />,   label: 'Sphere'   },
  { type: 'cylinder', icon: <Cylinder size={16} />, label: 'Cylinder' },
  { type: 'plane',    icon: <Square size={16} />,   label: 'Plane'    },
  { type: 'cone',     icon: <Triangle size={16} />, label: 'Cone'     },
  { type: 'torus',    icon: <Donut size={16} />,    label: 'Torus'    },
]

interface Props {
  onAddPrimitive: (type: PrimitiveType) => void
  onMeshTool: (tool: MeshToolName) => void
}

export function MeshToolbar({ onAddPrimitive, onMeshTool }: Props): JSX.Element {
  const activeMeshTool = useStore((s) => s.activeMeshTool)
  const setActiveMeshTool = useStore((s) => s.setActiveMeshTool)

  const selectTool = (name: MeshToolName) => {
    setActiveMeshTool(name)
    onMeshTool(name)
  }

  return (
    <>
      <div className="toolbar-group">
        {MESH_TOOLS.map((t) => (
          <button
            key={t.name}
            className={`tool-btn ${activeMeshTool === t.name ? 'active' : ''}`}
            onClick={() => selectTool(t.name)}
            title={t.label}
          >
            {t.icon}
          </button>
        ))}
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-label">Add</div>

      <div className="toolbar-group">
        {PRIMITIVES.map((p) => (
          <button
            key={p.type}
            className="tool-btn"
            onClick={() => onAddPrimitive(p.type)}
            title={`Add ${p.label}`}
          >
            {p.icon}
          </button>
        ))}
      </div>
    </>
  )
}
