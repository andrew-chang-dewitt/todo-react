import React from 'react'
import { expect } from 'chai'
import 'mocha'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

import { Factories } from '../model/Todos.spec'

import { TodoList } from './TodoList'
import { TodoItem } from './TodoItem'

describe('TodoList', () => {
  const wrapper = shallow(<TodoList />)

  it('has the correct header', () => {
    const header = <h1>Todo List</h1>

    expect(wrapper.contains(header)).to.equal(true)
  })

  it('default starting state of KeyGenerator is empty', () => {
    const keys: any = wrapper.state('keys')

    expect(keys.keys_used).to.be.empty
  })

  it('default starting state of ModelTodoList is empty', () => {
    const todoList: any = wrapper.state('todoList')

    expect(todoList.todos).to.be.empty
  })

  it('renders a list of TodoItems', () => {
    const fiveTodos = shallow(
      <TodoList todoList={Factories.TodoList.createWithNTodos(5)} />
    )

    expect(fiveTodos.find(TodoItem)).to.have.lengthOf(5)
  })

  describe('adding new todos', () => {
    const noTodos = shallow(
      <TodoList todoList={Factories.TodoList.createEmpty()} />
    )
    const newTodoInput = noTodos.find('input.newTodo')

    it('the field for entering new todos starts out empty', () => {
      expect(newTodoInput.props().value).to.equal('')
    })

    it('allows a user to enter text for a new todo', () => {
      newTodoInput.simulate('change', { currentTarget: { value: 'a todo' } })
      const state: any = noTodos.state('newTodoText')

      expect(state).to.equal('a todo')
    })

    it('can add a new todo', () => {
      noTodos.find('button.newTodo.submit').simulate('click')
      const state: any = noTodos.state('todoList')

      expect(state.todos.length).to.equal(1)
    })

    it('and it will appear on the list', () => {
      expect(noTodos.find(TodoItem)).to.have.lengthOf(1)
    })

    it("and the new Todo input field will still appear, with it's value reset to an empty string", () => {
      expect(noTodos.find('input.newTodo').props().value).to.equal('')
    })
  })

  describe('updating a todo', () => {
    const aTodo = Factories.Todo.create()
    const oneTodo = shallow(
      <TodoList
        todoList={Factories.TodoList.createWithSpecificTodos([aTodo])}
      />
    )

    it('can update a todo', () => {
      const updatedTodo = Factories.Todo.createWithText('updated')
      // call the prop directly on a TodoItem child to avoid this test
      // having to know anything about how a TodoItem is rendered
      oneTodo.find(TodoItem).props().handleTodoItemUpdate(aTodo, updatedTodo)

      expect(oneTodo.find(TodoItem).props().item).to.equal(updatedTodo)
    })
  })

  describe('deleting a todo', () => {
    const aTodo = Factories.Todo.create()
    const oneTodo = shallow(
      <TodoList
        todoList={Factories.TodoList.createWithSpecificTodos([aTodo])}
      />
    )

    it('can update a todo', () => {
      oneTodo.find(TodoItem).props().handleTodoItemDeletion(aTodo)

      expect(oneTodo.find(TodoItem)).to.have.lengthOf(0)
    })
  })
})
