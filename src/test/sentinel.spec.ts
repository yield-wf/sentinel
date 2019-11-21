import assert from 'assert';
import Sentinel from '../index'

describe('Validate a number', () => {
    it ('36 is number', () => {
        assert(new Sentinel(36, [Sentinel.isNumber]))
    })
})