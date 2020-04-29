import { expect } from 'chai'
import 'mocha'

import { TodoList as ModelTodoList, Todo as ModelTodo } from './Todos'

/* *
 * Factory methods for generating objects to be tested
 *
 * Used to separate knowledge about creating a specific
 * object instance from the behaviour it has.
 */
export namespace Factories {
  export class Todo {
    static create(): ModelTodo {
      return new ModelTodo('a todo', 1)
    }

    static createWithText(text: string): ModelTodo {
      return new ModelTodo(text, 1)
    }

    static createWithKey(key: number): ModelTodo {
      return new ModelTodo('a todo', key)
    }

    static createIncomplete(): ModelTodo {
      return new ModelTodo('a todo', 1, false)
    }

    static createComplete(): ModelTodo {
      return new ModelTodo('a todo', 1, true)
    }
  }

  export class TodoList {
    static createEmpty(): ModelTodoList {
      return new ModelTodoList()
    }

    static createWithNTodos(num: number): ModelTodoList {
      let todos: Array<ModelTodo> = []
      let arr = [...Array(num - 1).keys()]
      arr.forEach((num) => todos.push(Todo.createWithKey(num)))

      return new ModelTodoList(todos)
    }

    static createWithSpecificTodos(arr: Array<ModelTodo>): ModelTodoList {
      return new ModelTodoList(arr)
    }
  }
}

/*
 * Tests
 */
describe('Model', () => {
  describe('Todo', () => {
    it('should initialize with the correct values', () => {
      const todo = Factories.Todo.createWithText('some text')

      expect(todo.text).to.equal('some text')
      expect(todo.completed).to.equal(false)
      expect(todo.key).to.be.a('number')
    })

    describe('#updateText()', () => {
      const todo = Factories.Todo.createWithText('old text')
      const updated = todo.updateText('a new text value')

      it('should return a Todo with the updated text', () => {
        expect(updated.text).to.equal('a new text value')
      })

      it('but the key & completed status should remain the same', () => {
        expect(updated.key).to.equal(todo.key)
        expect(updated.completed).to.equal(todo.completed)
      })

      it("won't change the original todo instance", () => {
        expect(todo.text).to.equal('old text')
      })
    })

    describe('#toggleComplete()', () => {
      const incomplete = Factories.Todo.createIncomplete()
      const completed = Factories.Todo.createComplete()

      it('can mark an incomplete todo as completed', () => {
        expect(incomplete.toggleComplete().completed).to.equal(true)
      })

      it('can mark a completed todo as incomplete', () => {
        expect(completed.toggleComplete().completed).to.equal(false)
      })

      it("won't change the original todo instance", () => {
        expect(incomplete.completed).to.equal(false)
        expect(completed.completed).to.equal(true)
      })
    })
  })

  describe('TodoList', () => {
    it('should initialize with an empty todo list', () => {
      const todolist = Factories.TodoList.createEmpty()

      expect(todolist.todos).to.be.empty
    })

    describe('#addTodo()', () => {
      const emptyList = Factories.TodoList.createEmpty()
      const oneTodoList = emptyList.addTodo(Factories.Todo.create())

      it('can add new todos to the list', () => {
        expect(oneTodoList.todos.length).to.equal(1)
      })

      it("but it won't change the original todo list", () => {
        expect(emptyList.todos).to.be.empty
      })
    })

    describe('#deleteTodo()', () => {
      const deleteTodo = Factories.Todo.createWithText('delete me')
      const twoTodoList = Factories.TodoList.createWithSpecificTodos([
        Factories.Todo.create(),
        deleteTodo,
      ])
      const oneDeleted = twoTodoList.deleteTodo(deleteTodo)

      it('can delete a specified Todo', () => {
        expect(oneDeleted.todos.length).to.equal(1)
        expect(oneDeleted.todos).to.not.contains(deleteTodo)
      })

      it("but it won't change the original todo list", () => {
        expect(twoTodoList.todos.length).to.equal(2)
      })
    })

    describe('#updateTodo()', () => {
      const updateTodo = Factories.Todo.createWithText('update me')
      const newTodo = Factories.Todo.createWithText('a new text value')
      const twoTodoList = Factories.TodoList.createWithSpecificTodos([
        Factories.Todo.create(),
        updateTodo,
      ])
      const updatedTodoList = twoTodoList.updateTodo(updateTodo, newTodo)

      it("can update a specific Todo's information", () => {
        expect(updatedTodoList.todos[1]).to.equal(newTodo)
      })

      it('without changing the original TodoList instance', () => {
        expect(twoTodoList.todos[1]).to.equal(updateTodo)
      })
    })
  })
})
