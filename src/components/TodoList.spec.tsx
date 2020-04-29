import React from 'react'
import { expect } from 'chai'
import 'mocha'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

import { TodoList } from './TodoList'

describe('TodoList', () => {
  it('has the correct header', () => {
    const wrapper = shallow(<TodoList />)
    const header = <h1>Todo List</h1>

    expect(wrapper.contains(header)).to.equal(true)
  })
})
