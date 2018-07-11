/**
 * MIT License
 *
 * Copyright (c) 2016 - 2018 RDUK <tech@rduk.fr>
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

'use strict'

const errors = require('@rduk/errors')
const configuration = require('@rduk/configuration')
const Section = require('./section')

class ProviderCreator {
  constructor (name, Base, defaultConfig) {
    this.name = name
    this.Base = Base
    this.defaultConfig = defaultConfig
  }
  getSection () {
    if (!this._section) {
      this._section = configuration.load().getSection(this.name, Section, !!this.defaultConfig)
    }

    if (!this._section && !!this.defaultConfig) {
      this._section = new Section(this.defaultConfig)
    }

    return this._section
  }
  create (Provider, options, section) {
    let obj = new Provider(...[options, section])

    if (!(obj instanceof this.Base)) {
      errors.throwConfigurationError('invalid provider type')
    }

    obj.initialize()

    return obj
  }
}

const factory = creator => {
  let instance

  return {
    getInstance: function () {
      if (!instance) {
        instance = this.get()
      }

      return instance
    },
    get: function (name) {
      let section = creator.getSection()
      let options = section.get(name)

      return creator.create(options.type, options, section)
    }
  }
}

module.exports = (name, base, defaultConfig) => {
  if (!name) {
    errors.throwArgumentError('name', name)
  }

  if (typeof name !== 'string') {
    errors.throwArgumentError('name', name)
  }

  if (!base || !(base.prototype instanceof require('./base'))) {
    errors.throwArgumentError('base', base)
  }

  return factory(new ProviderCreator(name, base, defaultConfig))
}
