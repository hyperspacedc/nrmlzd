import { assert } from 'chai'
import Normalized from '../src/index'

describe('Normalized test', () => {
  it('should test func', () => {
    const i = Normalized.create()
    assert.equal(i.ids.length, 0)
    assert.equal(Object.keys(i.data).length, 0)
  })
})
