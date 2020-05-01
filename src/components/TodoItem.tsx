import * as React from 'react'

import { Todo } from '../model/Todos'

export interface TodoItemProps {
  item: Todo
  handleTodoItemUpdate: (oldTodo: Todo, updatedTodo: Todo) => void
  handleTodoItemDeletion: (todo: Todo) => void
}

export interface TodoItemState {
  newText: string
  updatingText: boolean
}

export class TodoItem extends React.Component<TodoItemProps, TodoItemState> {
  constructor(props: TodoItemProps) {
    super(props)

    this.state = {
      newText: '',
      updatingText: false,
    }
  }

  handleToggleComplete = (): void => {
    const newTodo = this.props.item.toggleComplete()

    this.props.handleTodoItemUpdate(this.props.item, newTodo)
  }

  handleUpdateTextStart = (): void => {
    this.setState({ updatingText: true })
  }

  handleUpdateTextChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ newText: e.currentTarget.value })
  }

  handleUpdateTextSubmit = (): void => {
    const newTodo = this.props.item.updateText(this.state.newText)

    this.props.handleTodoItemUpdate(this.props.item, newTodo)
    this.setState({ updatingText: false })
  }

  handleTodoItemDeletion = (): void => {
    this.props.handleTodoItemDeletion(this.props.item)
  }

  render() {
    if (this.state.updatingText) {
      return (
        <li>
          <input
            className="updateText"
            value={this.state.newText}
            onChange={this.handleUpdateTextChange}
          />
          <button
            className="updateText submit"
            onClick={this.handleUpdateTextSubmit}
          >
            Update todo
          </button>
        </li>
      )
    } else {
      return (
        <li>
          <span>{this.props.item.text}</span>
          <button
            className="toggleComplete"
            onClick={this.handleToggleComplete}
          >
            {this.props.item.completed ? 'mark incomplete' : 'mark complete'}
          </button>
          <button className="updateText" onClick={this.handleUpdateTextStart}>
            Update todo
          </button>
          <button className="deleteTodo" onClick={this.handleTodoItemDeletion}>
            Delete todo
          </button>
        </li>
      )
    }
  }
}
