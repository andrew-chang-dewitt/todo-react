import { clone } from 'lodash'

export class KeyGenerator {
  keys_used: Array<number>
  next_key: number

  constructor(keys_used: Array<number> = [], next_key: number = 0) {
    // sort and assign so that the array is always
    // sorted with the largest number first
    this.keys_used = keys_used.sort((a, b) => b - a)
    this.next_key = next_key
  }

  generateNewKey(): [KeyGenerator, number] {
    const new_keys_used = clone(this.keys_used)
    const new_next_key = this.next_key + 1
    new_keys_used.push(this.next_key)

    return [new KeyGenerator(new_keys_used, new_next_key), this.next_key]
  }
}

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
