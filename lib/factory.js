/**
 * MIT License
 * 
 * Copyright (c) 2016 - 2017 Kim Ung <k.ung@rduk.fr>
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

var errors = require('rduk-errors');
var configuration = require('rduk-configuration');

module.exports = function(name, base) {
    if (!name || typeof name !== 'string' || name.length === 0) {
        errors.throwArgumentError('name', name);
    }

    if (!base || !(base.prototype instanceof require('./base'))) {
        errors.throwArgumentError('base', base);
    }

    var section, instance;

    var getSection = function() {
        if (!section) {
            section = configuration.load().getSection(name, require('./section'));
        }

        return section;
    };

    var create = function(provider, options) {
        var obj  = Object.create(provider.prototype);
        provider.apply(obj, [options, section]);

        if (!(obj instanceof base)) {
            errors.throwConfigurationError('invalid provider type');
        }

        obj.initialize();

        return obj;
    };

    return {
        getInstance: function() {
            if (!instance) {
                instance = this.get();
            }

            return instance;
        },
        get: function(name) {
            var section = getSection();
            var options = section.get(name);

            return create(options.type, options, section);
        }
    };
};
