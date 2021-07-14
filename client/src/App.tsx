import { h } from 'preact';

import Login from './Login';
import Todos from './Todos';

function App() {
  return (
    <div>
      <h1>Hello World!</h1>
      <Login />
      <Todos />
    </div>
  )
}

export default App;
