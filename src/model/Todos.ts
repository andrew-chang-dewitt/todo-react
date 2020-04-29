import { clone } from 'lodash'

export class Todo {
  text: string
  key: number
  completed: boolean

  constructor(text: string, key: number, completed: boolean = false) {
    this.text = text
    this.key = key
    this.completed = completed
  }

  updateText(newText: string): Todo {
    return new Todo(newText, this.key)
  }

  toggleComplete(): Todo {
    return new Todo(this.text, this.key, !this.completed)
  }
}

export class TodoList {
  todos: Array<Todo>

  constructor(todos: Array<Todo> = []) {
    this.todos = todos
  }

  addTodo(todo: Todo): TodoList {
    const newTodoList = clone(this.todos)

    newTodoList.push(todo)

    return new TodoList(newTodoList)
  }

  deleteTodo(todo: Todo): TodoList {
    const newTodoList = clone(this.todos)
    const todoIndex = newTodoList.indexOf(todo)

    newTodoList.splice(todoIndex, 1)

    return new TodoList(newTodoList)
  }

  updateTodo(existing: Todo, updated: Todo): TodoList {
    const updatedTodos = clone(this.todos)
    updatedTodos[updatedTodos.indexOf(existing)] = updated

    return new TodoList(updatedTodos)
  }
}
