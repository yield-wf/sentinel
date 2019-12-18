# Sentinel

Typescript validation library

[![Build Status](https://travis-ci.org/yield-workflow/sentinel.svg?branch=master)](https://travis-ci.org/yield-workflow/sentinel) [![GitHub Issues](https://img.shields.io/github/issues/yield-workflow/sentinel.svg)](https://github.com/yield-workflow/sentinel/issues) ![Contributions welcome](https://img.shields.io/badge/contributions-welcome-orange.svg) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

Sentinel provides lots of validations

### Single validation:

```typescript
const isValidNumber: boolean = new Sentinel(36, [Sentinel.isNumber]).isValid()
```

### Multiple validations (all must be valid):

```typescript
const isValidNumberGreaterThan10 = new Sentinel(15, [Sentinel.isNumber, Sentinel.isGreaterThan(10)]).isValid()

// Same results:

const isValidNumberGreaterThan10 = new Sentinel(15, Sentinel.all(Sentinel.isNumber, Sentinel.isGreaterThan(10))).isValid()

// isInvalid()
const isInvalidNumberGreaterThan100 = new Sentinel(15, [Sentinel.isNumber, Sentinel.isGreaterThan(100)]).isInvalid()
```

### Multiple validations (at least one must be valid):

```typescript
const validContact = new Sentinel('john@doe.com', Sentinel.any(Sentinel.isEmail, Sentinel.isBrazilianCellPhone(true))).isValid()
```



## Available validations:

| Method                                                       | Assertation                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| isArray                                                      | Check if passed value is an array                            |
| isNumber                                                     | Check if passed value is a number                            |
| isRequired                                                   | Check if passed value is present                             |
| isPresent                                                    | Alias for isRequired                                         |
| hasValue                                                     | Alias for isRequired                                         |
| hasMinLength(size)                                           | Checks if string value has at least `size` chars             |
| hasMaxLength(size)                                           | Checks if string value has maximum of `size` chars           |
| hasMinMaxLength(min, max)                                    | Checks if string value has between `min` and `max` chars     |
| hasExactLength(size)                                         | Checks if string value has exact `size` chars                |
| isLessThan(num)                                              | Checks if number value is smaller than `num`                 |
| isLessOrEqualThan(num)                                       | Checks if number value is smaller than or equal to `num`     |
| isGreaterThan(num)                                           | Checks if number value is bigger than `num`                  |
| isGreaterOrEqualThan(num)                                    | Checks if number value is bigger than or equal to `num`      |
| isEmail                                                      | Check if passed value is a valid email based on RFC 5322     |
| isDate(format = undefined)                                   | Check if passed value is a valid date                        |
| isDateGreaterThan(referenceDate)                             | Check if date is bigger than `referenceDate`                 |
| isPasswordValid(lowerPresent = true, upperPresent = true, numberPresent = true, specialPresent = true, minimumRules = 3, minChars = 8) | Checks if at least `minimumRules` are valid, considering boolean options: `lowerPresent`, `upperPresent`, `numberPresent`, `specialPresent`. Password must be `minChars` long. |
| isCpfValid                                                   | Validates brazilian CPF                                      |
| isUSZipCodeValid                                             | Validates US zip codes                                       |
| isBRZipCodeValid                                             | Validates brazilian zip vodes                                |
| isZipCodeValid                                               | Validates US and brazilian zip codes                         |
| isBRPhoneValid                                               | Validates brazilian phones                                   |
| isBRCellPhoneValid                                           | Validates brazilian cellphones                               |

## Compositions

| Method       | Assertion                |
| ------------ | ------------------------ |
| Sentinel.all | All checks must be valid |
| Sentinel.any | One check must be valid  |

## Methods

| Method    | Assertion                               |
| --------- | --------------------------------------- |
| isValid   | Return if assertions were validated     |
| isInvalid | Return if assertions were not validated |

## Roadmap

- [ ] Modularize validations
- [ ] Modularize locale based validations

## Contributions

Pull requests are welcome!