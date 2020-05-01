import React from 'react'
import { expect } from 'chai'
import 'mocha'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

import { Todo } from '../model/Todos'
import { Factories } from '../model/Todos.spec'

import { TodoItem } from './TodoItem'

describe('TodoItem', () => {
  it('renders the correct text', () => {
    const todoitem = shallow(
      <TodoItem
        item={Factories.Todo.createWithText('a todo item')}
        // uses a placeholder for the update hange handler as
        // it isn't needed for this test
        handleTodoItemUpdate={(x: Todo, _: Todo): void =>
          console.log(x + 'updated')
        }
        handleTodoItemDeletion={(_: Todo) => {
          console.log('deleted')
        }}
      />
    )

    expect(todoitem.find('span').text()).to.equal('a todo item')
  })

  it('can be marked as completed', () => {
    let completed = false
    // updates to the individual todo item's state are lifted up to
    // it's parent component, defining a handler here allows testing to ensure
    // that the handler is called, but does not guarantee that the actual
    // handler in the parent works as intended
    const handleTodoItemUpdate = (_: Todo, newTodo: Todo) => {
      completed = newTodo.completed
    }
    const todoitem = shallow(
      <TodoItem
        item={Factories.Todo.createWithText('a todo item')}
        handleTodoItemUpdate={handleTodoItemUpdate}
        handleTodoItemDeletion={(_: Todo) => {
          console.log('deleted')
        }}
      />
    )

    todoitem.find('button.toggleComplete').simulate('click')

    expect(completed).to.equal(true)
  })

  it("can have it's text value updated", () => {
    let text = 'a todo item'
    const handleTodoItemUpdate = (_: Todo, newTodo: Todo) => {
      text = newTodo.text
    }
    const todoitem = shallow(
      <TodoItem
        item={Factories.Todo.createWithText(text)}
        handleTodoItemUpdate={handleTodoItemUpdate}
        handleTodoItemDeletion={(_: Todo) => {
          console.log('deleted')
        }}
      />
    )

    todoitem.find('button.updateText').simulate('click')
    todoitem
      .find('input.updateText')
      .simulate('change', { currentTarget: { value: 'updated' } })
    todoitem.find('button.updateText.submit').simulate('click')

    expect(text).to.equal('updated')
  })

  it('and it can be deleted', () => {
    let deleted = false
    const handleTodoItemDeletion = (_: Todo) => {
      deleted = true
    }
    const todoitem = shallow(
      <TodoItem
        item={Factories.Todo.createWithText('a todo')}
        // placeholder update handler
        handleTodoItemUpdate={(x: Todo, _: Todo): void =>
          console.log(x + 'updated')
        }
        handleTodoItemDeletion={handleTodoItemDeletion}
      />
    )

    todoitem.find('button.deleteTodo').simulate('click')

    expect(deleted).to.equal(true)
  })
})
