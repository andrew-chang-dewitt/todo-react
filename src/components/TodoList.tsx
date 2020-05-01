import * as React from 'react'

import {
  KeyGenerator,
  TodoList as ModelTodoList,
  Todo as ModelTodo,
} from '../model/Todos'

import { TodoItem } from './TodoItem'

export interface TodoListProps {
  keys: KeyGenerator
  todoList: ModelTodoList
}

export interface TodoListState {
  keys: KeyGenerator
  todoList: ModelTodoList
  newTodoText: string
}

export class TodoList extends React.Component<TodoListProps, TodoListState> {
  constructor(props: TodoListProps) {
    super(props)
    this.state = {
      keys: props.keys,
      todoList: props.todoList,
      newTodoText: '',
    }
  }

  static defaultProps = {
    keys: new KeyGenerator(),
    todoList: new ModelTodoList(),
  }

  handleNewTodoChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ newTodoText: e.currentTarget.value })
  }

  handleNewTodoSubmit = (): void => {
    // add new todo with new key
    const [newKeyGen, newKey] = this.state.keys.generateNewKey()
    const newTodoList = this.state.todoList.addTodo(
      new ModelTodo(this.state.newTodoText, newKey)
    )

    // update state with new KeyGenerator & ModelTodoList
    this.setState({ keys: newKeyGen })
    this.setState({ todoList: newTodoList })

    // reset newTodoText
    this.setState({ newTodoText: '' })
  }

  handleTodoItemUpdate = (oldTodo: ModelTodo, updatedTodo: ModelTodo): void => {
    const updatedTodoList = this.state.todoList.updateTodo(oldTodo, updatedTodo)
    this.setState({ todoList: updatedTodoList })
  }

  handleTodoItemDeletion = (todo: ModelTodo): void => {
    const updatedTodoList = this.state.todoList.deleteTodo(todo)
    this.setState({ todoList: updatedTodoList })
  }

  render() {
    const todoItems = this.state.todoList.todos.map((item: ModelTodo) => (
      <TodoItem
        key={item.key.toString()}
        item={item}
        handleTodoItemUpdate={this.handleTodoItemUpdate}
        handleTodoItemDeletion={this.handleTodoItemDeletion}
      />
    ))

    return (
      <div id="TodoList">
        <h1>Todo List</h1>
        <ul>
          {todoItems}
          <li>
            <input
              className="newTodo"
              value={this.state.newTodoText}
              onChange={this.handleNewTodoChange}
            />
            <button
              className="newTodo submit"
              onClick={this.handleNewTodoSubmit}
            >
              Add todo
            </button>
          </li>
        </ul>
      </div>
    )
  }
}
