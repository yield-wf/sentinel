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



## Contributions

Pull requests are welcome!