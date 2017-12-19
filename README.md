# RDUK - provider

[![Build Status](https://travis-ci.org/rd-uk/rduk-provider.svg?branch=master)](https://travis-ci.org/rd-uk/rduk-provider)
[![Coverage Status](https://coveralls.io/repos/github/rd-uk/rduk-provider/badge.svg?branch=master)](https://coveralls.io/github/rd-uk/rduk-provider?branch=master)

Easily add providers to your Node.js app

## Installation

```
npm install @rduk/provider --save --save-exact
```

## Provider creation

Firstly, you must create an abstract base provider

```js
// In this example, we create a simple abstract map provider

// file: map/base.js

var Base = require('@rduk/provider/lib/base');
var configuration = require('@rduk/configuration');
var errors = require('@rduk/errors');

/**
 * ctor
 */
var MapBaseProvider = function MapBaseProvider(config) {
    MapBaseProvider.super_.call(this, config);
};

require('util').inherits(MapBaseProvider, Base);

/**
 * we must override the base initialize method, otherwise a
 * NotImplementedError should be thrown.
 */
MapBaseProvider.prototype.initialize = function() {
    if (!this.config.hasOwnProperty('connection')) {
        errors.throwConfigurationError('connection property not found.');
    }

    this.token = configuration.load().connections.get(this.config.connection).token;
};

/**
 * geocode method contract
 * should be implemented by children
 *
 * Get Latitude and longitude from an address
 *
 * @param {string} address
 * @return {Promise(Coordinates)}
 */
MapBaseProvider.prototype.geocode = function(address) {
    errors.throwNotImplementedError('geocode');
};

module.exports = MapBaseProvider;
```

secondly, you must create your provider entry point.

```js
// file: map/index.js

'use strict';

var providerFactory = require('@rduk/provider/lib/factory');
var map = providerFactory('map', require('./base'), {
    'default': 'mapbox',
    providers: [
        {
            name: 'mapbox',
            type: '~/map/mapbox'
        }
    ]
});

module.exports = map;
```

the provider factory take 3 parameters:

`function` providerFactory(`String` name, `Function` abstractBaseProvider[, `Object` defaultConfiguration])

- `name`: name of your provider.
- `abstractBaseProvider`: abstract base class of your provider.
- `defaultConfiguration`: loaded if no config file found. (optional)

Thirdly, you must create an implementation of your abstract base class

```js
// map/mapbox.js

var MapboxProvider = function MapboxProvider(config) {
    MapboxProvider.super_.call(this, config);
};

require('util').inherits(MapboxProvider, require('./base'));

MapboxProvider.prototype.geocode = function(address) {
    return Promise.resolve([1, 1]);
};

module.exports = FakeMapProvider;
```

## Usage

```yml
# config.yml
---
map:
    default: mapbox
    providers:
        -
            name: mapbox
            type: 'path/to/mapboxProvider'
```
for more detail about [configuration](https://github.com/rd-uk/rduk-configuration#readme)

```js
var map = require('./map');
map.getInstance().geocode('my address') // get instance according to the configuration
    .then(function(coords) {
        console.log(coords.latitude, coords.longitude)
    });
```

## License and copyright

See [LICENSE](./LICENSE)
