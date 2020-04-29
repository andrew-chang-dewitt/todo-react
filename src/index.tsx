import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { TodoList } from './components/TodoList'

ReactDOM.render(
  <TodoList compiler="Typescript" framework="React" />,
  document.getElementById('example')
)
