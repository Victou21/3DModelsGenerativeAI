import { useRef } from 'react'
import { Viewport, ViewportHandle } from './components/Viewport'
import { Toolbar } from './components/Toolbar'
import { ColorPicker } from './components/ColorPicker'
import { StatusBar } from './components/StatusBar'
import { ModeToggle } from './components/ModeToggle'
import { SceneHierarchy } from './components/SceneHierarchy'
import { PropertiesPanel } from './components/PropertiesPanel'
import { useStore } from './store/useStore'

export default function App(): JSX.Element {
  const viewportRef = useRef<ViewportHandle>(null)
  const appMode = useStore((s) => s.appMode)

  return (
    <div className={`app ${appMode === 'mesh' ? 'has-sidebar' : ''}`}>
      <div className="toolbar-wrapper">
        <ModeToggle onChange={(m) => viewportRef.current?.setMode(m)} />
        <Toolbar
          onUndo={()          => viewportRef.current?.undo()}
          onRedo={()          => viewportRef.current?.redo()}
          onExport={()        => viewportRef.current?.exportGLB()}
          onAddPrimitive={(t) => viewportRef.current?.addPrimitive(t)}
          onMeshTool={(t)     => viewportRef.current?.setMeshTool(t)}
        />
      </div>

      <div className="viewport-wrapper">
        <Viewport ref={viewportRef} />
        {appMode === 'voxel' && <ColorPicker />}
      </div>

      {appMode === 'mesh' && (
        <div className="sidebar">
          <SceneHierarchy
            onSelect={(id) => viewportRef.current?.selectMeshById(id)}
            onDelete={() => viewportRef.current?.deleteSelectedMesh()}
          />
          <PropertiesPanel
            onColorChange={(hex) => viewportRef.current?.setSelectedMeshColor(hex)}
            onRename={(id, name) => viewportRef.current?.renameMeshObject(id, name)}
          />
        </div>
      )}

      <StatusBar />
    </div>
  )
}
