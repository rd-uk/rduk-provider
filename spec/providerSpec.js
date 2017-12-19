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

(function(require, describe, it, expect) {

    'use strict';

    var errors = require('rduk-errors');

    describe('provider', function() {

        describe('base', function() {
            var BaseProvider = require('../lib/base');

            describe('instantiate without valid config', function() {
                it('should throw an ArgumentError', function() {
                    expect(function() {
                        new BaseProvider();
                    }).toThrowError(errors.ArgumentError);

                    expect(function() {
                        new BaseProvider({});
                    }).toThrowError(errors.ArgumentError);
                });
            });

            describe('.initialize', function() {
                var base = new BaseProvider({name: 'base'});

                it('should throw a NotImplementedError', function() {
                    expect(function() {
                        base.initialize();
                    }).toThrowError(errors.NotImplementedError);
                });
            });
        });

        describe('section', function() {
            var ProviderSection = require('../lib/section');

            describe('instantiate without section arg', function() {
                it ('should throw an ArgumentNullError', function() {
                    expect(function() {
                        new ProviderSection();
                    }).toThrowError(errors.ArgumentNullError);
                });
            });

            describe('instantiate with an invalid section arg', function() {
                it ('should throw an ArgumentNullError', function() {
                    //without default property
                    expect(function() {
                        new ProviderSection({});
                    }).toThrowError(errors.ConfigurationError);

                    //withour providers property
                    expect(function() {
                        new ProviderSection({default: 'fake'});
                    }).toThrowError(errors.ConfigurationError);
                });
            });

            describe('.get with unknown name', function() {
                it('should throw a ConfigurationError', function() {
                    var section = new ProviderSection({
                        default: 'name',
                        providers: []
                    });

                    expect(function() {
                        section.get('unknown');
                    }).toThrowError(errors.ConfigurationError);
                });
            });
        });

        describe('factory:', function() {
            var factory = require('../lib/factory');

            describe('create a provider', function() {
                describe('with an invalid name', function() {
                    it('should throw an ArgumentError', function() {
                        expect(function() {
                            factory();
                        }).toThrowError(errors.ArgumentError);

                        expect(function() {
                            factory({});
                        }).toThrowError(errors.ArgumentError);

                        expect(function() {
                            factory('');
                        }).toThrowError(errors.ArgumentError);
                    });
                });

                describe('with an invalid base', function() {
                    it('should throw an ArgumentError', function() {
                        expect(function() {
                            factory('test');
                        }).toThrowError(errors.ArgumentError);

                        expect(function() {
                            factory('test', {});
                        }).toThrowError(errors.ArgumentError);
                    });
                });
            });
        });

        describe('map:', function() {
            var map = require('./helpers/map');

            describe('.getInstance', function() {
                it('should return the default provider', function() {
                    expect(map.getInstance()).toBeDefined();
                    expect(map.getInstance().name).toBe(map.get('fake').name);

                    var coord = map.getInstance().geocode('test');

                    expect(Array.isArray(coord)).toBe(true);
                });
            });

            describe('get an instance that doesnt inherit the map base provider', function() {
                it('should throw a ConfigurationError', function() {
                    expect(function() {
                        map.get('badFake');
                    }).toThrowError(errors.ConfigurationError);
                });
            });

            describe('base class', function() {
                var Provider = require('./helpers/map/baseProvider');
                
                describe('instantion without connection in config', function() {
                    it('should throw a ConfigurationError', function() {
                        expect(function() {
                            new Provider({name: 'test'});
                        }).toThrowError(errors.ConfigurationError);
                    });
                });

                describe('geocode method calling', function() {
                    it('should throw a NotImplementedError', function() {
                        var base = new Provider({name: 'test', connection: 'map'});

                        expect(function() {
                            base.geocode('test');
                        }).toThrowError(errors.NotImplementedError);
                    });
                });
            });
        });

        describe('default configuration provider loading', function() {
            it('should succeed', function() {
                var logger = require('./helpers/logger').getInstance();
                expect(logger instanceof require('./helpers/logger/defaultProvider')).toBe(true);
                expect(logger.log('test')).toBe('test');
            });
        });

    });

} (require, describe, it, expect));