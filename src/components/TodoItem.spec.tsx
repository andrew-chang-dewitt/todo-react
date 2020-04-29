import React from 'react'
import { expect } from 'chai'
import 'mocha'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

import { TodoItem } from './TodoItem'

describe('TodoItem', () => {
  it('has the correct header', () => {
    const wrapper = shallow(<TodoItem />)
    const header = <h1>Todo Item</h1>

    expect(wrapper.contains(header)).to.equal(true)
  })
})
