/**
 * MIT License
 * 
 * Copyright (c) 2016 - 2017 RDUK <tech@rduk.fr>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

var _ = require('lodash');
var errors = require('@rduk/errors');
var type = require('@rduk/configuration/lib/sections/field/type');

var ProviderSection = function(section) {
    if (!section) {
        errors.throwArgumentNullError('section');
    }

    if (!section.hasOwnProperty('default')) {
        errors.throwConfigurationError('default property not set.');
    }

    if (!section.hasOwnProperty('providers') || !Array.isArray(section.providers)) {
        errors.throwConfigurationError('invalid providers section.');
    }

    this.section = section;

    var providers = {};

    this.get = function(name) {
        if (!name) {
            name = section.default;
        }

        if (!providers.hasOwnProperty(name)) {
            var provider = _.filter(section.providers, function(provider) { return provider.name === name; })[0];

            if (!provider) {
                errors.throwConfigurationError('provider "' + name + '" not found.');
            }

            provider.type = type.load(provider.type);

            providers[name] = provider;
        }

        return providers[name];
    };
};

module.exports = ProviderSection;
