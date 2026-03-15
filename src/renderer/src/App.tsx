import { Viewport } from './components/Viewport'
import { Toolbar } from './components/Toolbar'
import { ColorPicker } from './components/ColorPicker'
import { StatusBar } from './components/StatusBar'

export default function App(): JSX.Element {
  return (
    <div className="app">
      <Toolbar />
      <div className="viewport-wrapper">
        <Viewport />
        <ColorPicker />
      </div>
      <StatusBar />
    </div>
  )
}
