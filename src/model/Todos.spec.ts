import { expect } from 'chai'
import 'mocha'

import {
  KeyGenerator as ModelKeyGenerator,
  TodoList as ModelTodoList,
  Todo as ModelTodo,
} from './Todos'

/* *
 * Factory methods for generating objects to be tested
 *
 * Used to separate knowledge about creating a specific
 * object instance from the behaviour it has.
 */
export namespace Factories {
  export class KeyGenerator {
    static createEmpty(): ModelKeyGenerator {
      return new ModelKeyGenerator()
    }

    static createWithExistingKeys(
      keys: Array<number>,
      next_key: number
    ): ModelKeyGenerator {
      return new ModelKeyGenerator(keys, next_key)
    }
  }

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
      let arr = [...Array(num).keys()]
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
  describe('KeyGenerator', () => {
    it('should initialize with the correct values', () => {
      const gen = Factories.KeyGenerator.createEmpty()

      expect(gen.keys_used).to.be.empty
      expect(gen.next_key).to.equal(0)
    })

    describe('#generateNewKey()', () => {
      const gen5 = Factories.KeyGenerator.createWithExistingKeys(
        [0, 1, 5, 10, 49],
        55
      )
      const generatorResult = gen5.generateNewKey()

      it('returns a new key', () => {
        expect(generatorResult[1]).to.equal(55)
      })

      it('as well as a new generator', () => {
        expect(generatorResult[0]).to.be.a.instanceof(ModelKeyGenerator)
      })

      it('& the new generator will store the new key as used', () => {
        expect(generatorResult[0].keys_used).to.contain(55)
      })
    })
  })

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
