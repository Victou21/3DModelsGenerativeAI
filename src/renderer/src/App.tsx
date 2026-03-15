import { useRef } from 'react'
import { Viewport, ViewportHandle } from './components/Viewport'
import { Toolbar } from './components/Toolbar'
import { ColorPicker } from './components/ColorPicker'
import { StatusBar } from './components/StatusBar'

export default function App(): JSX.Element {
  const viewportRef = useRef<ViewportHandle>(null)

  return (
    <div className="app">
      <Toolbar
        onUndo={()      => viewportRef.current?.undo()}
        onRedo={()      => viewportRef.current?.redo()}
        onExport={()    => viewportRef.current?.exportGLB()}
      />
      <div className="viewport-wrapper">
        <Viewport ref={viewportRef} />
        <ColorPicker />
      </div>
      <StatusBar />
    </div>
  )
}
