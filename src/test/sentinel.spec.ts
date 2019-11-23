import assert from 'assert';
import { Sentinel } from '../sentinel';
import { ISentinelValidator } from '../interfaces/sentinel-validator';

describe('Validate a number', () => {
    it('36 is number', () => {
        assert(new Sentinel(36, [Sentinel.isNumber]).isValid())
    })

    it('36 passed as string is a number', () => {
        it ('"36" is a number', () => {
            assert(new Sentinel('36', [Sentinel.isNumber]).isValid())
        })
    })

    it('johndoe@example.com is a number is invalid', () => {
        assert(new Sentinel('johndoe@example.com', <ISentinelValidator>Sentinel.isNumber).isInvalid())
    })
})

describe('Multiple valid asserts (all options must be validated)', () => {
    it('36 is number and is bigger than 30', () => {
        assert(new Sentinel(36, [Sentinel.isNumber, Sentinel.isGreaterThan(30)]).isValid())
    })
})

describe('Multiple invalid asserts (all tests must be valid)', () => {
    it('INVALID: 36 is number and is bigger than 50', () => {
        assert(new Sentinel(36, Sentinel.all(<ISentinelValidator>Sentinel.isNumber, <ISentinelValidator>Sentinel.isGreaterThan(50))).isInvalid())
    })

    it('johndoe@example.com is an email and has between 10 and 13 chars', () => {
        assert(new Sentinel('johndoe@example.com', Sentinel.all(<ISentinelValidator>Sentinel.isEmail, <ISentinelValidator>Sentinel.hasMinMaxLength(10, 13))).isInvalid())
    })
})

describe('Multiple valid asserts (at least one test must be valid)', () => {
    it('36 is email or is bigger than 30', () => {
        assert(new Sentinel(36, Sentinel.any(<ISentinelValidator>Sentinel.isEmail, <ISentinelValidator>Sentinel.isGreaterThan(30))).isValid())
    })
})