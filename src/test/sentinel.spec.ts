import assert from 'assert';
import { Sentinel } from '../index';
import { ISentinelValidator } from '../interfaces/sentinel-validator';

describe('Single asserts', () => {
    it('36 is number will pass', () => {
        assert(new Sentinel(36, [Sentinel.isNumber]).isValid())
    })

    it('"36" passed as string is a number will pass', () => {
        it ('"36" is a number will pass', () => {
            assert(new Sentinel('36', [Sentinel.isNumber]).isValid())
        })
    })

    it('"36px" is a number will not pass', () => {
        it ('"36" is a number will pass', () => {
            assert(new Sentinel('36px', [Sentinel.isNumber]).isInvalid())
        })
    })

    it('johndoe@example.com is a number (invalid) will not pass', () => {
        assert(new Sentinel('johndoe@example.com', <ISentinelValidator>Sentinel.isNumber).isInvalid())
    })

    it('+55 (11) 9-8888-7777 is a brazilian cell phone number (valid) will pass', () => {
        assert(new Sentinel("+55 (11) 9-8888-7777", Sentinel.isBRCellPhoneValid()).isValid())
    })
})

describe('Multiple valid asserts (all options must be validated)', () => {
    it('36 is number (valid) and is greater than 30 (valid) will pass', () => {
        assert(new Sentinel(36, [Sentinel.isNumber, Sentinel.isGreaterThan(30)]).isValid())
    })

    it('+55 (11) 9-8888-7777 has at least 5 chars (valid) and is a brazilian cell phone number (valid) will pass', () => {
        assert(new Sentinel("+55 (11) 9-8888-7777", [Sentinel.hasMinLength(5), Sentinel.isBRCellPhoneValid()]).isValid())
    })
})

describe('Multiple invalid asserts (all tests must be valid)', () => {
    it('36 is number (valid) and is greater than 50 (invalid)', () => {
        assert(new Sentinel(36, Sentinel.all(<ISentinelValidator>Sentinel.isNumber, <ISentinelValidator>Sentinel.isGreaterThan(50))).isInvalid())
    })

    it('johndoe@example.com is an email (valid) and has between 10 and 13 chars (invalid) will not pass', () => {
        assert(new Sentinel('johndoe@example.com', Sentinel.all(<ISentinelValidator>Sentinel.isEmail, <ISentinelValidator>Sentinel.hasMinMaxLength(10, 13))).isInvalid())
    })
})

describe('Multiple valid asserts (at least one test must be valid)', () => {
    it('36 is email or is bigger than 30', () => {
        assert(new Sentinel(36, Sentinel.any(<ISentinelValidator>Sentinel.isEmail, <ISentinelValidator>Sentinel.isGreaterThan(30))).isValid())
    })
})