import { expect } from 'chai'
import { Client } from '../src/App'

describe('App', () => {
  before(() => {
    process.env.SHUVI_LAZY_INITIALISE = true
  })

  it('Client should not automatically initialized.', () => {
    expect(typeof Client).to.equal('Object')
  })
})
