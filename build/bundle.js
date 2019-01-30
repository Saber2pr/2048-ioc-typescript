var test = (function () {
	'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	/*! *****************************************************************************
	Copyright (C) Microsoft. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */
	var Reflect$1;
	(function (Reflect) {
	    // Metadata Proposal
	    // https://rbuckton.github.io/reflect-metadata/
	    (function (factory) {
	        var root = typeof commonjsGlobal === "object" ? commonjsGlobal :
	            typeof self === "object" ? self :
	                typeof this === "object" ? this :
	                    Function("return this;")();
	        var exporter = makeExporter(Reflect);
	        if (typeof root.Reflect === "undefined") {
	            root.Reflect = Reflect;
	        }
	        else {
	            exporter = makeExporter(root.Reflect, exporter);
	        }
	        factory(exporter);
	        function makeExporter(target, previous) {
	            return function (key, value) {
	                if (typeof target[key] !== "function") {
	                    Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
	                }
	                if (previous)
	                    previous(key, value);
	            };
	        }
	    })(function (exporter) {
	        var hasOwn = Object.prototype.hasOwnProperty;
	        // feature test for Symbol support
	        var supportsSymbol = typeof Symbol === "function";
	        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
	        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
	        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
	        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
	        var downLevel = !supportsCreate && !supportsProto;
	        var HashMap = {
	            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
	            create: supportsCreate
	                ? function () { return MakeDictionary(Object.create(null)); }
	                : supportsProto
	                    ? function () { return MakeDictionary({ __proto__: null }); }
	                    : function () { return MakeDictionary({}); },
	            has: downLevel
	                ? function (map, key) { return hasOwn.call(map, key); }
	                : function (map, key) { return key in map; },
	            get: downLevel
	                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
	                : function (map, key) { return map[key]; },
	        };
	        // Load global or shim versions of Map, Set, and WeakMap
	        var functionPrototype = Object.getPrototypeOf(Function);
	        var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
	        var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
	        var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
	        var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
	        // [[Metadata]] internal slot
	        // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
	        var Metadata = new _WeakMap();
	        /**
	         * Applies a set of decorators to a property of a target object.
	         * @param decorators An array of decorators.
	         * @param target The target object.
	         * @param propertyKey (Optional) The property key to decorate.
	         * @param attributes (Optional) The property descriptor for the target key.
	         * @remarks Decorators are applied in reverse order.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     Example = Reflect.decorate(decoratorsArray, Example);
	         *
	         *     // property (on constructor)
	         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     Object.defineProperty(Example, "staticMethod",
	         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
	         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
	         *
	         *     // method (on prototype)
	         *     Object.defineProperty(Example.prototype, "method",
	         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
	         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
	         *
	         */
	        function decorate(decorators, target, propertyKey, attributes) {
	            if (!IsUndefined(propertyKey)) {
	                if (!IsArray(decorators))
	                    throw new TypeError();
	                if (!IsObject(target))
	                    throw new TypeError();
	                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
	                    throw new TypeError();
	                if (IsNull(attributes))
	                    attributes = undefined;
	                propertyKey = ToPropertyKey(propertyKey);
	                return DecorateProperty(decorators, target, propertyKey, attributes);
	            }
	            else {
	                if (!IsArray(decorators))
	                    throw new TypeError();
	                if (!IsConstructor(target))
	                    throw new TypeError();
	                return DecorateConstructor(decorators, target);
	            }
	        }
	        exporter("decorate", decorate);
	        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
	        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
	        /**
	         * A default metadata decorator factory that can be used on a class, class member, or parameter.
	         * @param metadataKey The key for the metadata entry.
	         * @param metadataValue The value for the metadata entry.
	         * @returns A decorator function.
	         * @remarks
	         * If `metadataKey` is already defined for the target and target key, the
	         * metadataValue for that key will be overwritten.
	         * @example
	         *
	         *     // constructor
	         *     @Reflect.metadata(key, value)
	         *     class Example {
	         *     }
	         *
	         *     // property (on constructor, TypeScript only)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         static staticProperty;
	         *     }
	         *
	         *     // property (on prototype, TypeScript only)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         property;
	         *     }
	         *
	         *     // method (on constructor)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         static staticMethod() { }
	         *     }
	         *
	         *     // method (on prototype)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         method() { }
	         *     }
	         *
	         */
	        function metadata(metadataKey, metadataValue) {
	            function decorator(target, propertyKey) {
	                if (!IsObject(target))
	                    throw new TypeError();
	                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
	                    throw new TypeError();
	                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
	            }
	            return decorator;
	        }
	        exporter("metadata", metadata);
	        /**
	         * Define a unique metadata entry on the target.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param metadataValue A value that contains attached metadata.
	         * @param target The target object on which to define metadata.
	         * @param propertyKey (Optional) The property key for the target.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     Reflect.defineMetadata("custom:annotation", options, Example);
	         *
	         *     // property (on constructor)
	         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
	         *
	         *     // decorator factory as metadata-producing annotation.
	         *     function MyAnnotation(options): Decorator {
	         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
	         *     }
	         *
	         */
	        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
	        }
	        exporter("defineMetadata", defineMetadata);
	        /**
	         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.hasMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function hasMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("hasMetadata", hasMetadata);
	        /**
	         * Gets a value indicating whether the target object has the provided metadata key defined.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function hasOwnMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("hasOwnMetadata", hasOwnMetadata);
	        /**
	         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function getMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("getMetadata", getMetadata);
	        /**
	         * Gets the metadata value for the provided metadata key on the target object.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function getOwnMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("getOwnMetadata", getOwnMetadata);
	        /**
	         * Gets the metadata keys defined on the target object or its prototype chain.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns An array of unique metadata keys.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getMetadataKeys(Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
	         *
	         */
	        function getMetadataKeys(target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryMetadataKeys(target, propertyKey);
	        }
	        exporter("getMetadataKeys", getMetadataKeys);
	        /**
	         * Gets the unique metadata keys defined on the target object.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns An array of unique metadata keys.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getOwnMetadataKeys(Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
	         *
	         */
	        function getOwnMetadataKeys(target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryOwnMetadataKeys(target, propertyKey);
	        }
	        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
	        /**
	         * Deletes the metadata entry from the target object with the provided key.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.deleteMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function deleteMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
	            if (IsUndefined(metadataMap))
	                return false;
	            if (!metadataMap.delete(metadataKey))
	                return false;
	            if (metadataMap.size > 0)
	                return true;
	            var targetMetadata = Metadata.get(target);
	            targetMetadata.delete(propertyKey);
	            if (targetMetadata.size > 0)
	                return true;
	            Metadata.delete(target);
	            return true;
	        }
	        exporter("deleteMetadata", deleteMetadata);
	        function DecorateConstructor(decorators, target) {
	            for (var i = decorators.length - 1; i >= 0; --i) {
	                var decorator = decorators[i];
	                var decorated = decorator(target);
	                if (!IsUndefined(decorated) && !IsNull(decorated)) {
	                    if (!IsConstructor(decorated))
	                        throw new TypeError();
	                    target = decorated;
	                }
	            }
	            return target;
	        }
	        function DecorateProperty(decorators, target, propertyKey, descriptor) {
	            for (var i = decorators.length - 1; i >= 0; --i) {
	                var decorator = decorators[i];
	                var decorated = decorator(target, propertyKey, descriptor);
	                if (!IsUndefined(decorated) && !IsNull(decorated)) {
	                    if (!IsObject(decorated))
	                        throw new TypeError();
	                    descriptor = decorated;
	                }
	            }
	            return descriptor;
	        }
	        function GetOrCreateMetadataMap(O, P, Create) {
	            var targetMetadata = Metadata.get(O);
	            if (IsUndefined(targetMetadata)) {
	                if (!Create)
	                    return undefined;
	                targetMetadata = new _Map();
	                Metadata.set(O, targetMetadata);
	            }
	            var metadataMap = targetMetadata.get(P);
	            if (IsUndefined(metadataMap)) {
	                if (!Create)
	                    return undefined;
	                metadataMap = new _Map();
	                targetMetadata.set(P, metadataMap);
	            }
	            return metadataMap;
	        }
	        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
	        function OrdinaryHasMetadata(MetadataKey, O, P) {
	            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
	            if (hasOwn)
	                return true;
	            var parent = OrdinaryGetPrototypeOf(O);
	            if (!IsNull(parent))
	                return OrdinaryHasMetadata(MetadataKey, parent, P);
	            return false;
	        }
	        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
	        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
	            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
	            if (IsUndefined(metadataMap))
	                return false;
	            return ToBoolean(metadataMap.has(MetadataKey));
	        }
	        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
	        function OrdinaryGetMetadata(MetadataKey, O, P) {
	            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
	            if (hasOwn)
	                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
	            var parent = OrdinaryGetPrototypeOf(O);
	            if (!IsNull(parent))
	                return OrdinaryGetMetadata(MetadataKey, parent, P);
	            return undefined;
	        }
	        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
	        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
	            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
	            if (IsUndefined(metadataMap))
	                return undefined;
	            return metadataMap.get(MetadataKey);
	        }
	        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
	        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
	            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
	            metadataMap.set(MetadataKey, MetadataValue);
	        }
	        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
	        function OrdinaryMetadataKeys(O, P) {
	            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
	            var parent = OrdinaryGetPrototypeOf(O);
	            if (parent === null)
	                return ownKeys;
	            var parentKeys = OrdinaryMetadataKeys(parent, P);
	            if (parentKeys.length <= 0)
	                return ownKeys;
	            if (ownKeys.length <= 0)
	                return parentKeys;
	            var set = new _Set();
	            var keys = [];
	            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
	                var key = ownKeys_1[_i];
	                var hasKey = set.has(key);
	                if (!hasKey) {
	                    set.add(key);
	                    keys.push(key);
	                }
	            }
	            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
	                var key = parentKeys_1[_a];
	                var hasKey = set.has(key);
	                if (!hasKey) {
	                    set.add(key);
	                    keys.push(key);
	                }
	            }
	            return keys;
	        }
	        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
	        function OrdinaryOwnMetadataKeys(O, P) {
	            var keys = [];
	            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
	            if (IsUndefined(metadataMap))
	                return keys;
	            var keysObj = metadataMap.keys();
	            var iterator = GetIterator(keysObj);
	            var k = 0;
	            while (true) {
	                var next = IteratorStep(iterator);
	                if (!next) {
	                    keys.length = k;
	                    return keys;
	                }
	                var nextValue = IteratorValue(next);
	                try {
	                    keys[k] = nextValue;
	                }
	                catch (e) {
	                    try {
	                        IteratorClose(iterator);
	                    }
	                    finally {
	                        throw e;
	                    }
	                }
	                k++;
	            }
	        }
	        // 6 ECMAScript Data Typ0es and Values
	        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
	        function Type(x) {
	            if (x === null)
	                return 1 /* Null */;
	            switch (typeof x) {
	                case "undefined": return 0 /* Undefined */;
	                case "boolean": return 2 /* Boolean */;
	                case "string": return 3 /* String */;
	                case "symbol": return 4 /* Symbol */;
	                case "number": return 5 /* Number */;
	                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
	                default: return 6 /* Object */;
	            }
	        }
	        // 6.1.1 The Undefined Type
	        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
	        function IsUndefined(x) {
	            return x === undefined;
	        }
	        // 6.1.2 The Null Type
	        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
	        function IsNull(x) {
	            return x === null;
	        }
	        // 6.1.5 The Symbol Type
	        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
	        function IsSymbol(x) {
	            return typeof x === "symbol";
	        }
	        // 6.1.7 The Object Type
	        // https://tc39.github.io/ecma262/#sec-object-type
	        function IsObject(x) {
	            return typeof x === "object" ? x !== null : typeof x === "function";
	        }
	        // 7.1 Type Conversion
	        // https://tc39.github.io/ecma262/#sec-type-conversion
	        // 7.1.1 ToPrimitive(input [, PreferredType])
	        // https://tc39.github.io/ecma262/#sec-toprimitive
	        function ToPrimitive(input, PreferredType) {
	            switch (Type(input)) {
	                case 0 /* Undefined */: return input;
	                case 1 /* Null */: return input;
	                case 2 /* Boolean */: return input;
	                case 3 /* String */: return input;
	                case 4 /* Symbol */: return input;
	                case 5 /* Number */: return input;
	            }
	            var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
	            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
	            if (exoticToPrim !== undefined) {
	                var result = exoticToPrim.call(input, hint);
	                if (IsObject(result))
	                    throw new TypeError();
	                return result;
	            }
	            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
	        }
	        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
	        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
	        function OrdinaryToPrimitive(O, hint) {
	            if (hint === "string") {
	                var toString_1 = O.toString;
	                if (IsCallable(toString_1)) {
	                    var result = toString_1.call(O);
	                    if (!IsObject(result))
	                        return result;
	                }
	                var valueOf = O.valueOf;
	                if (IsCallable(valueOf)) {
	                    var result = valueOf.call(O);
	                    if (!IsObject(result))
	                        return result;
	                }
	            }
	            else {
	                var valueOf = O.valueOf;
	                if (IsCallable(valueOf)) {
	                    var result = valueOf.call(O);
	                    if (!IsObject(result))
	                        return result;
	                }
	                var toString_2 = O.toString;
	                if (IsCallable(toString_2)) {
	                    var result = toString_2.call(O);
	                    if (!IsObject(result))
	                        return result;
	                }
	            }
	            throw new TypeError();
	        }
	        // 7.1.2 ToBoolean(argument)
	        // https://tc39.github.io/ecma262/2016/#sec-toboolean
	        function ToBoolean(argument) {
	            return !!argument;
	        }
	        // 7.1.12 ToString(argument)
	        // https://tc39.github.io/ecma262/#sec-tostring
	        function ToString(argument) {
	            return "" + argument;
	        }
	        // 7.1.14 ToPropertyKey(argument)
	        // https://tc39.github.io/ecma262/#sec-topropertykey
	        function ToPropertyKey(argument) {
	            var key = ToPrimitive(argument, 3 /* String */);
	            if (IsSymbol(key))
	                return key;
	            return ToString(key);
	        }
	        // 7.2 Testing and Comparison Operations
	        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
	        // 7.2.2 IsArray(argument)
	        // https://tc39.github.io/ecma262/#sec-isarray
	        function IsArray(argument) {
	            return Array.isArray
	                ? Array.isArray(argument)
	                : argument instanceof Object
	                    ? argument instanceof Array
	                    : Object.prototype.toString.call(argument) === "[object Array]";
	        }
	        // 7.2.3 IsCallable(argument)
	        // https://tc39.github.io/ecma262/#sec-iscallable
	        function IsCallable(argument) {
	            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
	            return typeof argument === "function";
	        }
	        // 7.2.4 IsConstructor(argument)
	        // https://tc39.github.io/ecma262/#sec-isconstructor
	        function IsConstructor(argument) {
	            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
	            return typeof argument === "function";
	        }
	        // 7.2.7 IsPropertyKey(argument)
	        // https://tc39.github.io/ecma262/#sec-ispropertykey
	        function IsPropertyKey(argument) {
	            switch (Type(argument)) {
	                case 3 /* String */: return true;
	                case 4 /* Symbol */: return true;
	                default: return false;
	            }
	        }
	        // 7.3 Operations on Objects
	        // https://tc39.github.io/ecma262/#sec-operations-on-objects
	        // 7.3.9 GetMethod(V, P)
	        // https://tc39.github.io/ecma262/#sec-getmethod
	        function GetMethod(V, P) {
	            var func = V[P];
	            if (func === undefined || func === null)
	                return undefined;
	            if (!IsCallable(func))
	                throw new TypeError();
	            return func;
	        }
	        // 7.4 Operations on Iterator Objects
	        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
	        function GetIterator(obj) {
	            var method = GetMethod(obj, iteratorSymbol);
	            if (!IsCallable(method))
	                throw new TypeError(); // from Call
	            var iterator = method.call(obj);
	            if (!IsObject(iterator))
	                throw new TypeError();
	            return iterator;
	        }
	        // 7.4.4 IteratorValue(iterResult)
	        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
	        function IteratorValue(iterResult) {
	            return iterResult.value;
	        }
	        // 7.4.5 IteratorStep(iterator)
	        // https://tc39.github.io/ecma262/#sec-iteratorstep
	        function IteratorStep(iterator) {
	            var result = iterator.next();
	            return result.done ? false : result;
	        }
	        // 7.4.6 IteratorClose(iterator, completion)
	        // https://tc39.github.io/ecma262/#sec-iteratorclose
	        function IteratorClose(iterator) {
	            var f = iterator["return"];
	            if (f)
	                f.call(iterator);
	        }
	        // 9.1 Ordinary Object Internal Methods and Internal Slots
	        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
	        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
	        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
	        function OrdinaryGetPrototypeOf(O) {
	            var proto = Object.getPrototypeOf(O);
	            if (typeof O !== "function" || O === functionPrototype)
	                return proto;
	            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
	            // Try to determine the superclass constructor. Compatible implementations
	            // must either set __proto__ on a subclass constructor to the superclass constructor,
	            // or ensure each class has a valid `constructor` property on its prototype that
	            // points back to the constructor.
	            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
	            // This is the case when in ES6 or when using __proto__ in a compatible browser.
	            if (proto !== functionPrototype)
	                return proto;
	            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
	            var prototype = O.prototype;
	            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
	            if (prototypeProto == null || prototypeProto === Object.prototype)
	                return proto;
	            // If the constructor was not a function, then we cannot determine the heritage.
	            var constructor = prototypeProto.constructor;
	            if (typeof constructor !== "function")
	                return proto;
	            // If we have some kind of self-reference, then we cannot determine the heritage.
	            if (constructor === O)
	                return proto;
	            // we have a pretty good guess at the heritage.
	            return constructor;
	        }
	        // naive Map shim
	        function CreateMapPolyfill() {
	            var cacheSentinel = {};
	            var arraySentinel = [];
	            var MapIterator = /** @class */ (function () {
	                function MapIterator(keys, values, selector) {
	                    this._index = 0;
	                    this._keys = keys;
	                    this._values = values;
	                    this._selector = selector;
	                }
	                MapIterator.prototype["@@iterator"] = function () { return this; };
	                MapIterator.prototype[iteratorSymbol] = function () { return this; };
	                MapIterator.prototype.next = function () {
	                    var index = this._index;
	                    if (index >= 0 && index < this._keys.length) {
	                        var result = this._selector(this._keys[index], this._values[index]);
	                        if (index + 1 >= this._keys.length) {
	                            this._index = -1;
	                            this._keys = arraySentinel;
	                            this._values = arraySentinel;
	                        }
	                        else {
	                            this._index++;
	                        }
	                        return { value: result, done: false };
	                    }
	                    return { value: undefined, done: true };
	                };
	                MapIterator.prototype.throw = function (error) {
	                    if (this._index >= 0) {
	                        this._index = -1;
	                        this._keys = arraySentinel;
	                        this._values = arraySentinel;
	                    }
	                    throw error;
	                };
	                MapIterator.prototype.return = function (value) {
	                    if (this._index >= 0) {
	                        this._index = -1;
	                        this._keys = arraySentinel;
	                        this._values = arraySentinel;
	                    }
	                    return { value: value, done: true };
	                };
	                return MapIterator;
	            }());
	            return /** @class */ (function () {
	                function Map() {
	                    this._keys = [];
	                    this._values = [];
	                    this._cacheKey = cacheSentinel;
	                    this._cacheIndex = -2;
	                }
	                Object.defineProperty(Map.prototype, "size", {
	                    get: function () { return this._keys.length; },
	                    enumerable: true,
	                    configurable: true
	                });
	                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
	                Map.prototype.get = function (key) {
	                    var index = this._find(key, /*insert*/ false);
	                    return index >= 0 ? this._values[index] : undefined;
	                };
	                Map.prototype.set = function (key, value) {
	                    var index = this._find(key, /*insert*/ true);
	                    this._values[index] = value;
	                    return this;
	                };
	                Map.prototype.delete = function (key) {
	                    var index = this._find(key, /*insert*/ false);
	                    if (index >= 0) {
	                        var size = this._keys.length;
	                        for (var i = index + 1; i < size; i++) {
	                            this._keys[i - 1] = this._keys[i];
	                            this._values[i - 1] = this._values[i];
	                        }
	                        this._keys.length--;
	                        this._values.length--;
	                        if (key === this._cacheKey) {
	                            this._cacheKey = cacheSentinel;
	                            this._cacheIndex = -2;
	                        }
	                        return true;
	                    }
	                    return false;
	                };
	                Map.prototype.clear = function () {
	                    this._keys.length = 0;
	                    this._values.length = 0;
	                    this._cacheKey = cacheSentinel;
	                    this._cacheIndex = -2;
	                };
	                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
	                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
	                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
	                Map.prototype["@@iterator"] = function () { return this.entries(); };
	                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
	                Map.prototype._find = function (key, insert) {
	                    if (this._cacheKey !== key) {
	                        this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
	                    }
	                    if (this._cacheIndex < 0 && insert) {
	                        this._cacheIndex = this._keys.length;
	                        this._keys.push(key);
	                        this._values.push(undefined);
	                    }
	                    return this._cacheIndex;
	                };
	                return Map;
	            }());
	            function getKey(key, _) {
	                return key;
	            }
	            function getValue(_, value) {
	                return value;
	            }
	            function getEntry(key, value) {
	                return [key, value];
	            }
	        }
	        // naive Set shim
	        function CreateSetPolyfill() {
	            return /** @class */ (function () {
	                function Set() {
	                    this._map = new _Map();
	                }
	                Object.defineProperty(Set.prototype, "size", {
	                    get: function () { return this._map.size; },
	                    enumerable: true,
	                    configurable: true
	                });
	                Set.prototype.has = function (value) { return this._map.has(value); };
	                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
	                Set.prototype.delete = function (value) { return this._map.delete(value); };
	                Set.prototype.clear = function () { this._map.clear(); };
	                Set.prototype.keys = function () { return this._map.keys(); };
	                Set.prototype.values = function () { return this._map.values(); };
	                Set.prototype.entries = function () { return this._map.entries(); };
	                Set.prototype["@@iterator"] = function () { return this.keys(); };
	                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
	                return Set;
	            }());
	        }
	        // naive WeakMap shim
	        function CreateWeakMapPolyfill() {
	            var UUID_SIZE = 16;
	            var keys = HashMap.create();
	            var rootKey = CreateUniqueKey();
	            return /** @class */ (function () {
	                function WeakMap() {
	                    this._key = CreateUniqueKey();
	                }
	                WeakMap.prototype.has = function (target) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
	                    return table !== undefined ? HashMap.has(table, this._key) : false;
	                };
	                WeakMap.prototype.get = function (target) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
	                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
	                };
	                WeakMap.prototype.set = function (target, value) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
	                    table[this._key] = value;
	                    return this;
	                };
	                WeakMap.prototype.delete = function (target) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
	                    return table !== undefined ? delete table[this._key] : false;
	                };
	                WeakMap.prototype.clear = function () {
	                    // NOTE: not a real clear, just makes the previous data unreachable
	                    this._key = CreateUniqueKey();
	                };
	                return WeakMap;
	            }());
	            function CreateUniqueKey() {
	                var key;
	                do
	                    key = "@@WeakMap@@" + CreateUUID();
	                while (HashMap.has(keys, key));
	                keys[key] = true;
	                return key;
	            }
	            function GetOrCreateWeakMapTable(target, create) {
	                if (!hasOwn.call(target, rootKey)) {
	                    if (!create)
	                        return undefined;
	                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
	                }
	                return target[rootKey];
	            }
	            function FillRandomBytes(buffer, size) {
	                for (var i = 0; i < size; ++i)
	                    buffer[i] = Math.random() * 0xff | 0;
	                return buffer;
	            }
	            function GenRandomBytes(size) {
	                if (typeof Uint8Array === "function") {
	                    if (typeof crypto !== "undefined")
	                        return crypto.getRandomValues(new Uint8Array(size));
	                    if (typeof msCrypto !== "undefined")
	                        return msCrypto.getRandomValues(new Uint8Array(size));
	                    return FillRandomBytes(new Uint8Array(size), size);
	                }
	                return FillRandomBytes(new Array(size), size);
	            }
	            function CreateUUID() {
	                var data = GenRandomBytes(UUID_SIZE);
	                // mark as random - RFC 4122 § 4.4
	                data[6] = data[6] & 0x4f | 0x40;
	                data[8] = data[8] & 0xbf | 0x80;
	                var result = "";
	                for (var offset = 0; offset < UUID_SIZE; ++offset) {
	                    var byte = data[offset];
	                    if (offset === 4 || offset === 6 || offset === 8)
	                        result += "-";
	                    if (byte < 16)
	                        result += "0";
	                    result += byte.toString(16).toLowerCase();
	                }
	                return result;
	            }
	        }
	        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
	        function MakeDictionary(obj) {
	            obj.__ = undefined;
	            delete obj.__;
	            return obj;
	        }
	    });
	})(Reflect$1 || (Reflect$1 = {}));

	var saberIoc = createCommonjsModule(function (module, exports) {
	var __decorate = (commonjsGlobal && commonjsGlobal.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (commonjsGlobal && commonjsGlobal.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	/*
	 * @Author: saber2pr
	 * @Date: 2019-01-24 07:11:58
	 * @Last Modified by: saber2pr
	 * @Last Modified time: 2019-01-29 21:08:45
	 */

	/**
	 * # MetaStore
	 * save metadata.
	 */
	var MetaStore = {};
	/**
	 * # BASETYPE
	 */
	var BASETYPE = ["Number" /* NUMBER */, "String" /* SRTING */, "Boolean" /* BOOLEAN */, "undefined" /* VOID */, "Array" /* ARRAY */];
	/**
	 * # MetaKey
	 * return a META key.
	 * @param id
	 */
	var MetaKey = function (id) { return "saber_meta" /* META */ + ":" + id; };
	/**
	 * # Injectable
	 * register the target to metaStore by id.
	 * @export
	 * @param {string} [id]
	 * @returns {ClassDecorator}
	 */
	function Injectable(id) {
	    return function (target) {
	        if (Reflect.hasMetadata(MetaKey(id), MetaStore)) {
	            throw new Error("id:[" + id + "] is existed!");
	        }
	        else {
	            Reflect.defineMetadata(MetaKey(id || Reflect.get(target, 'name')), target, MetaStore);
	        }
	    };
	}
	exports.Injectable = Injectable;
	/**
	 * # Inject
	 * set a metadata tag needed to target.
	 * @export
	 * @param {string} id
	 * @returns {ParameterDecorator}
	 */
	function Inject(id) {
	    return function (target) { return Reflect.defineMetadata(MetaKey(id), undefined, target); };
	}
	exports.Inject = Inject;
	/**
	 * ## Bootstrap
	 * `tag`:`main class`
	 *
	 * `provide`:`main()`
	 *
	 * @export
	 * @template T
	 * @param {Constructor<T>} target
	 */
	function Bootstrap(target) {
	    Reflect.defineMetadata("saber_main" /* MAIN */, undefined, target);
	}
	exports.Bootstrap = Bootstrap;
	/**
	 * ## Singleton
	 * `tag`:`Singleton`
	 *
	 * @export
	 * @param {*} target
	 */
	function Singleton(target) {
	    Reflect.defineMetadata("saber_singleton" /* STATIC */, undefined, target);
	}
	exports.Singleton = Singleton;
	/**
	 * ## Static
	 * `tag`:`Static`
	 *
	 * @export
	 * @param {*} target
	 */
	function Static(target) {
	    Reflect.defineMetadata("saber_singleton" /* STATIC */, undefined, target);
	}
	exports.Static = Static;
	/**
	 * # Class
	 */
	var Class;
	(function (Class) {
	    Class.isStatic = function (target) {
	        return Reflect.hasMetadata("saber_singleton" /* STATIC */, target);
	    };
	})(Class || (Class = {}));
	/**
	 * ParamCheck
	 *
	 * @param {Constructor} constructor
	 * @param {string} methodName
	 * @returns
	 */
	function ParamCheck(constructor, methodName) {
	    var origin = Reflect.get(constructor, methodName);
	    Reflect.set(constructor, methodName, function () {
	        var params = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            params[_i] = arguments[_i];
	        }
	        var constructor$ = params[0];
	        if (BASETYPE.some(function (TYPE) { return TYPE === Reflect.get(constructor$, 'name'); })) {
	            throw new Error("the param of class[" + Reflect.getMetadata("saber_visited" /* VISITED */, MetaStore) + "]'s constructor has invalid type: " + constructor$.name);
	        }
	        else {
	            Reflect.defineMetadata("saber_visited" /* VISITED */, constructor$.name, MetaStore);
	        }
	        return origin.apply(constructor, params);
	    });
	    return origin;
	}
	/**
	 * # SaIOC
	 * ## A simple ioc container for classes
	 * 1. ensure `tsconfig.json` : `"emitDecoratorMetadata": true`.
	 * 2. ensure `tsconfig.json` : `"experimentalDecorators": true`.
	 * @exports
	 */
	var SaIOC;
	(function (SaIOC) {
	    /**
	     * # Factory
	     */
	    var Factory = /** @class */ (function () {
	        function Factory() {
	        }
	        /**
	         * create
	         *
	         * @template T
	         * @param {Constructor<T>} constructor
	         * @returns {T}
	         */
	        Factory.create = function (constructor) {
	            var _this = this;
	            if (Class.isStatic(constructor)) {
	                return constructor;
	            }
	            var depKeys = Reflect.getMetadataKeys(constructor)
	                .filter(function (key) { return key.indexOf("saber_meta" /* META */) !== -1; })
	                .reverse();
	            var dependenciesMeta = depKeys.map(function (key) {
	                if (Reflect.hasMetadata(key, MetaStore)) {
	                    return Reflect.getMetadata(key, MetaStore);
	                }
	                else {
	                    throw new Error("cannot found " + key.replace("saber_meta" /* META */, 'dependence') + " in container.");
	                }
	            });
	            if (Reflect.hasMetadata("design:paramtypes" /* PARAMTYPES */, constructor)) {
	                (Reflect.getMetadata("design:paramtypes" /* PARAMTYPES */, constructor)).forEach(function (value, index) {
	                    if (Reflect.get(value, 'name') !== 'Object') {
	                        dependenciesMeta.splice(index, 0, value);
	                    }
	                });
	            }
	            var depInstances = dependenciesMeta.map(function (dependence) {
	                return _this.create(dependence);
	            });
	            return new (constructor.bind.apply(constructor, [void 0].concat(depInstances)))();
	        };
	        var _a;
	        __decorate([
	            ParamCheck,
	            __metadata("design:type", Function),
	            __metadata("design:paramtypes", [Object]),
	            __metadata("design:returntype", typeof (_a = typeof T !== "undefined" && T) === "function" ? _a : Object)
	        ], Factory, "create", null);
	        return Factory;
	    }());
	    SaIOC.Factory = Factory;
	    function BootStrap(constructor, mainMethod) {
	        var main = Factory.create(constructor);
	        if (Reflect.has(constructor.prototype, "main" /* BOOT */)) {
	            Reflect.get(constructor.prototype, "main" /* BOOT */).apply(main);
	        }
	        else {
	            (Reflect.get(constructor.prototype, mainMethod || Reflect.ownKeys(constructor.prototype)[1])).apply(main);
	        }
	    }
	    SaIOC.BootStrap = BootStrap;
	    /**
	     * @export
	     * @class Container
	     */
	    var Container = /** @class */ (function () {
	        /**
	         * # Container
	         * `create an ioc container.`
	         * @param {...Constructor[]} Constructors
	         * @memberof Container
	         */
	        function Container() {
	            var Constructors = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                Constructors[_i] = arguments[_i];
	            }
	            this.main =
	                Constructors.find(function (constructor) {
	                    return Reflect.hasMetadata("saber_main" /* MAIN */, constructor);
	                }) || Constructors[0];
	        }
	        /**
	         * pull
	         * `get the main class instance`
	         *
	         * @template T
	         * @returns {T}
	         * @memberof Container
	         */
	        Container.prototype.pull = function () {
	            return Factory.create(this.main);
	        };
	        Container.prototype.run = function (Constructor) {
	            BootStrap(Constructor || this.main);
	        };
	        return Container;
	    }());
	    SaIOC.Container = Container;
	})(SaIOC = exports.SaIOC || (exports.SaIOC = {}));
	});

	unwrapExports(saberIoc);
	var saberIoc_1 = saberIoc.Injectable;
	var saberIoc_2 = saberIoc.Inject;
	var saberIoc_3 = saberIoc.Bootstrap;
	var saberIoc_4 = saberIoc.Singleton;
	var saberIoc_5 = saberIoc.Static;
	var saberIoc_6 = saberIoc.SaIOC;

	var lib = createCommonjsModule(function (module, exports) {
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(saberIoc);
	});

	unwrapExports(lib);

	var Application_1 = createCommonjsModule(function (module, exports) {
	var __decorate = (commonjsGlobal && commonjsGlobal.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (commonjsGlobal && commonjsGlobal.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var __param = (commonjsGlobal && commonjsGlobal.__param) || function (paramIndex, decorator) {
	    return function (target, key) { decorator(target, key, paramIndex); }
	};
	Object.defineProperty(exports, "__esModule", { value: true });

	var Application = /** @class */ (function () {
	    function Application(Layout, Matrix, TouchFront) {
	        this.Layout = Layout;
	        this.Matrix = Matrix;
	        this.TouchFront = TouchFront;
	    }
	    Application.prototype.main = function () {
	        var _this = this;
	        this.Matrix.getInstance()
	            .init(4)
	            .addRand(2);
	        this.Layout.draw(this.Matrix.getInstance().merge('left'));
	        this.TouchFront.subscribe(function () { return _this.Layout.draw(_this.Matrix.getInstance().merge('left')); }, function () { return _this.Layout.draw(_this.Matrix.getInstance().merge('right')); }, function () { return _this.Layout.draw(_this.Matrix.getInstance().merge('up')); }, function () { return _this.Layout.draw(_this.Matrix.getInstance().merge('down')); })
	            .onStop(function () { return _this.Matrix.getInstance().addRand(2); })
	            .listen();
	    };
	    Application = __decorate([
	        lib.Bootstrap,
	        __param(0, lib.Inject('Layout')),
	        __param(1, lib.Inject('Matrix')),
	        __param(2, lib.Inject('TouchFront')),
	        __metadata("design:paramtypes", [Object, Object, Object])
	    ], Application);
	    return Application;
	}());
	exports.Application = Application;
	});

	unwrapExports(Application_1);
	var Application_2 = Application_1.Application;

	var Mat_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	/*
	 * @Author: AK-12
	 * @Date: 2018-12-29 18:41:28
	 * @Last Modified by: AK-12
	 * @Last Modified time: 2019-01-06 22:38:26
	 */
	/**
	 * MatTransform
	 * @param mat
	 */
	exports.MatTransform = function (mat) {
	    return mat[0].map(function (col, i) { return mat.map(function (row) { return row[i]; }); });
	};
	/**
	 * MatFill
	 * @param value
	 * @param x
	 * @param y
	 */
	exports.MatFill = function (value, x, y) {
	    if (y === void 0) { y = x; }
	    return Array(y)
	        .fill(0)
	        .map(function () { return Array(x).fill(value); });
	};
	/**
	 * MatClone
	 * @param mat
	 */
	exports.MatClone = function (mat) { return mat.map(function (raw) { return raw.slice(); }); };
	/**
	 * MatFlat
	 * @param mat
	 */
	exports.MatFlat = function (mat) {
	    return Array.prototype.concat.apply([], mat);
	};
	/**
	 * visitMat
	 * @param mat
	 * @param callback
	 */
	exports.Mat_foreach = function (mat, callback) {
	    return mat.forEach(function (raws, index_r) {
	        return raws.forEach(function (col, index_c) { return callback(col, index_r, index_c); });
	    });
	};
	/**
	 * MatSet
	 * @param mat
	 * @param value
	 * @param raw
	 * @param col
	 */
	exports.MatSet = function (mat, value, vec) {
	    mat[vec.raw][vec.col] = value;
	    return mat;
	};
	/**
	 * @export
	 * @class Mat
	 * @template T
	 */
	var Mat = /** @class */ (function () {
	    function Mat(value, cols, rows) {
	        if (Array.isArray(value)) {
	            this.state = exports.MatClone(value);
	            return this;
	        }
	        else if (typeof cols === 'number') {
	            this.state = exports.MatFill(value, cols, cols);
	            return this;
	        }
	        this.state = exports.MatFill(value, cols, rows);
	        return this;
	    }
	    Object.defineProperty(Mat.prototype, "raws", {
	        /**
	         * raws
	         *
	         * @readonly
	         * @type {number}
	         * @memberof Mat
	         */
	        get: function () {
	            return this.state.length;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Mat.prototype, "cols", {
	        /**
	         * cols
	         *
	         * @readonly
	         * @type {number}
	         * @memberof Mat
	         */
	        get: function () {
	            return this.state[0].length;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Mat.prototype.at = function (raw, col) {
	        if (typeof col !== 'undefined') {
	            return this.state[raw][col];
	        }
	        return this.state[raw][raw];
	    };
	    /**
	     * @param {T} value
	     * @param {{ raw: number col: number }} vec
	     * @memberof Mat
	     */
	    Mat.prototype.set = function (value, vec) {
	        this.state = exports.MatSet(this.state, value, vec);
	        return this;
	    };
	    /**
	     * @param {(value: T, raw: number, col: number) => void} callback
	     * @returns
	     * @memberof Mat
	     */
	    Mat.prototype.each = function (callback) {
	        exports.Mat_foreach(this.state, callback);
	        return this;
	    };
	    /**
	     * @memberof Mat
	     */
	    Mat.prototype.transform = function () {
	        this.state = exports.MatTransform(this.state);
	        return this;
	    };
	    /**
	     * @returns {T[][]}
	     * @memberof Mat
	     */
	    Mat.prototype.clone = function () {
	        return exports.MatClone(this.state);
	    };
	    return Mat;
	}());
	exports.Mat = Mat;
	});

	unwrapExports(Mat_1);
	var Mat_2 = Mat_1.MatTransform;
	var Mat_3 = Mat_1.MatFill;
	var Mat_4 = Mat_1.MatClone;
	var Mat_5 = Mat_1.MatFlat;
	var Mat_6 = Mat_1.Mat_foreach;
	var Mat_7 = Mat_1.MatSet;
	var Mat_8 = Mat_1.Mat;

	var lib$1 = createCommonjsModule(function (module, exports) {
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(Mat_1);
	});

	unwrapExports(lib$1);

	var Layout_1 = createCommonjsModule(function (module, exports) {
	var __decorate = (commonjsGlobal && commonjsGlobal.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (commonjsGlobal && commonjsGlobal.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var __param = (commonjsGlobal && commonjsGlobal.__param) || function (paramIndex, decorator) {
	    return function (target, key) { decorator(target, key, paramIndex); }
	};
	Object.defineProperty(exports, "__esModule", { value: true });


	var Layout = /** @class */ (function () {
	    function Layout(Factory, Canvas) {
	        this.Factory = Factory;
	        this.Canvas = Canvas;
	        this.edge = {
	            dx: 100,
	            dy: 100
	        };
	    }
	    Layout.prototype.draw = function (mat) {
	        var _this = this;
	        this.Canvas.instance.clear();
	        lib$1.Mat_foreach(mat, function (value, raw, col) {
	            return value
	                ? _this.Canvas.instance
	                    .draw(_this.Factory.getNode().setPosition(col * _this.edge.dx, raw * _this.edge.dy))
	                    .draw(_this.Factory.getLabel(value).setPosition(col * _this.edge.dx, raw * _this.edge.dy))
	                : null;
	        });
	    };
	    Layout = __decorate([
	        lib.Injectable(),
	        __param(0, lib.Inject('Factory')),
	        __param(1, lib.Inject('Canvas')),
	        __metadata("design:paramtypes", [Object, Object])
	    ], Layout);
	    return Layout;
	}());
	exports.Layout = Layout;
	});

	unwrapExports(Layout_1);
	var Layout_2 = Layout_1.Layout;

	var saberCanvas = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * Rules
	 */
	var Rules;
	(function (Rules) {
	    /**
	     * @param obj
	     */
	    Rules.isLabel = function (obj) {
	        return obj['type'] === 'Label';
	    };
	    /**
	     * @param obj
	     */
	    Rules.isLabelPropsArray = function (obj) {
	        return Rules.isLabel(obj[0]);
	    };
	    /**
	     * @param obj
	     */
	    Rules.isNode = function (obj) {
	        return obj['type'] === 'Node';
	    };
	    /**
	     * @param obj
	     */
	    Rules.isNodePropsArray = function (obj) {
	        return Rules.isNode(obj[0]);
	    };
	    /**
	     * @param obj
	     */
	    Rules.isSprite = function (obj) {
	        return obj['type'] === 'Sprite';
	    };
	    /**
	     * @param obj
	     */
	    Rules.isSpritePropsArray = function (obj) {
	        return Rules.isSprite(obj[0]);
	    };
	    /**
	     * @param obj
	     */
	    Rules.isCanvas = function (obj) {
	        return typeof obj['getContext'] !== 'undefined';
	    };
	    /**
	     * @param obj
	     */
	    Rules.isCtx = function (obj) {
	        return typeof obj['canvas'] !== 'undefined';
	    };
	})(Rules = exports.Rules || (exports.Rules = {}));
	/**
	 * @export
	 * @class Canvas
	 * @extends {Node}
	 * @implements {ICanvas}
	 */
	var Canvas = /** @class */ (function () {
	    /**
	     *Creates an instance of Canvas.
	     * @param {string} elementId
	     * @param {number} MaxWidth
	     * @param {number} MaxHeight
	     * @memberof Canvas
	     */
	    function Canvas(elementId, MaxWidth, MaxHeight) {
	        var canvas = document.getElementById(elementId);
	        if (canvas) {
	            if (Rules.isCanvas(canvas)) {
	                canvas.width = MaxWidth;
	                canvas.height = MaxHeight;
	                var ctx = canvas.getContext('2d');
	                if (Rules.isCtx(ctx)) {
	                    this.ctx = ctx;
	                }
	            }
	        }
	        else {
	            throw 'cannot get canvas element by id: ' + elementId;
	        }
	    }
	    Canvas.prototype.clear = function (rect) {
	        if (rect) {
	            var x = rect.x, y = rect.y, w = rect.w, h = rect.h;
	            this.ctx.clearRect(x, y, w, h);
	            return this;
	        }
	        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	        return this;
	    };
	    /**
	     * @private
	     * @param {INodeProps} props
	     * @memberof Canvas
	     */
	    Canvas.prototype.fillNode = function (props) {
	        var x = props.x, y = props.y, w = props.w, h = props.h, color = props.color;
	        this.ctx.fillStyle = color;
	        this.ctx.fillRect(x, y, w, h);
	    };
	    /**
	     * @private
	     * @param {ILabelProps} props
	     * @memberof Canvas
	     */
	    Canvas.prototype.fillLabel = function (props) {
	        var x = props.x, y = props.y, h = props.h, color = props.color, fontSize = props.fontSize, fontStyle = props.fontStyle, text = props.text;
	        this.ctx.font = String(fontSize) + 'px' + ' ' + fontStyle;
	        this.ctx.strokeStyle = color;
	        this.ctx.strokeText(text, x, y + h);
	    };
	    /**
	     * @private
	     * @param {ISpriteProps} props
	     * @returns
	     * @memberof Canvas
	     */
	    Canvas.prototype.fillImage = function (props) {
	        var _this = this;
	        var x = props.x, y = props.y, w = props.w, h = props.h, img = props.img;
	        img.onloadend = function () { return _this.ctx.drawImage(img, x, y, w, h); };
	    };
	    /**
	     * @param {number} sx
	     * @param {number} sy
	     * @param {number} sw
	     * @param {number} sh
	     * @returns
	     * @memberof Canvas
	     */
	    Canvas.prototype.getImageData = function (sx, sy, sw, sh) {
	        return this.ctx.getImageData(sx, sy, sw, sh);
	    };
	    Canvas.prototype.draw = function () {
	        var _this = this;
	        var node = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            node[_i] = arguments[_i];
	        }
	        if (node.length > 0) {
	            if (Rules.isLabelPropsArray(node)) {
	                node.forEach(function (l) { return _this.fillLabel(l); });
	            }
	            else if (Rules.isNodePropsArray(node)) {
	                node.forEach(function (n) { return _this.fillNode(n); });
	            }
	            else if (Rules.isSpritePropsArray(node)) {
	                node.forEach(function (s) { return _this.fillImage(s); });
	            }
	        }
	        return this;
	    };
	    return Canvas;
	}());
	exports.Canvas = Canvas;
	});

	unwrapExports(saberCanvas);
	var saberCanvas_1 = saberCanvas.Rules;
	var saberCanvas_2 = saberCanvas.Canvas;

	var Rect_1 = createCommonjsModule(function (module, exports) {
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * @export
	 * @class Rect
	 * @implements {IRect}
	 */
	var Rect = /** @class */ (function () {
	    /**
	     *Creates an instance of Rect.
	     * @param {number} w
	     * @param {number} h
	     * @memberof Rect
	     */
	    function Rect(w, h) {
	        this.x = 0;
	        this.y = 0;
	        this.w = w;
	        this.h = h;
	        this.type = 'Rect';
	    }
	    /**
	     * @param {number} x
	     * @param {number} y
	     * @returns
	     * @memberof Rect
	     */
	    Rect.prototype.setPosition = function (x, y) {
	        this.x = x;
	        this.y = y;
	        return this;
	    };
	    /**
	     * @param {number} w
	     * @param {number} h
	     * @returns
	     * @memberof Rect
	     */
	    Rect.prototype.setSize = function (w, h) {
	        this.w = w;
	        this.h = h;
	        return this;
	    };
	    return Rect;
	}());
	exports.Rect = Rect;
	/**
	 * @export
	 * @class Node
	 * @extends {Rect}
	 * @implements {INode}
	 */
	var Node = /** @class */ (function (_super) {
	    __extends(Node, _super);
	    /**
	     *Creates an instance of Node.
	     * @param {number} w
	     * @param {number} h
	     * @memberof Node
	     */
	    function Node(w, h) {
	        var _this = _super.call(this, w, h) || this;
	        _this.color = '#3a32af';
	        _this.type = 'Node';
	        return _this;
	    }
	    /**
	     * @param {string} color
	     * @returns
	     * @memberof Node
	     */
	    Node.prototype.setColor = function (color) {
	        this.color = color;
	        return this;
	    };
	    return Node;
	}(Rect));
	exports.Node = Node;
	/**
	 * @export
	 * @class Label
	 * @extends {Node}
	 * @implements {ILabel}
	 */
	var Label = /** @class */ (function (_super) {
	    __extends(Label, _super);
	    /**
	     *Creates an instance of Label.
	     * @param {string} text
	     * @param {number} [fontSize=23]
	     * @memberof Label
	     */
	    function Label(text, fontSize) {
	        if (fontSize === void 0) { fontSize = 23; }
	        var _this = _super.call(this, text.length * fontSize, fontSize) || this;
	        _this.fontStyle = 'serif';
	        _this.color = '563a6d';
	        _this.text = text;
	        _this.fontSize = fontSize;
	        _this.type = 'Label';
	        return _this;
	    }
	    /**
	     * @param {number} fontSize
	     * @returns
	     * @memberof Label
	     */
	    Label.prototype.setFontSize = function (fontSize) {
	        this.fontSize = fontSize;
	        this.setSize(this.text.length * fontSize, fontSize);
	        return this;
	    };
	    /**
	     * @param {string} fontStyle
	     * @returns
	     * @memberof Label
	     */
	    Label.prototype.setFontStyle = function (fontStyle) {
	        this.fontStyle = fontStyle;
	        return this;
	    };
	    /**
	     * @param {string} text
	     * @returns
	     * @memberof Label
	     */
	    Label.prototype.setText = function (text) {
	        this.text = text;
	        return this;
	    };
	    return Label;
	}(Node));
	exports.Label = Label;
	/**
	 * @export
	 * @class Sprite
	 * @extends {Rect}
	 */
	var Sprite = /** @class */ (function (_super) {
	    __extends(Sprite, _super);
	    /**
	     *Creates an instance of Sprite.
	     * @param {string} src
	     * @memberof Sprite
	     */
	    function Sprite(url) {
	        var _this = _super.call(this, 0, 0) || this;
	        _this.type = 'Sprite';
	        _this.img = new Image();
	        _this.img.src = url;
	        _this.setSize(_this.img.width, _this.img.height);
	        return _this;
	    }
	    Sprite.prototype.setSrc = function (url) {
	        this.img.src = url;
	        return this;
	    };
	    return Sprite;
	}(Rect));
	exports.Sprite = Sprite;
	});

	unwrapExports(Rect_1);
	var Rect_2 = Rect_1.Rect;
	var Rect_3 = Rect_1.Node;
	var Rect_4 = Rect_1.Label;
	var Rect_5 = Rect_1.Sprite;

	var lib$2 = createCommonjsModule(function (module, exports) {
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(saberCanvas);
	__export(Rect_1);
	});

	unwrapExports(lib$2);

	var Observable_1 = createCommonjsModule(function (module, exports) {
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	/*
	 * @Author: AK-12
	 * @Date: 2018-12-29 18:55:04
	 * @Last Modified by: AK-12
	 * @Last Modified time: 2019-01-29 14:17:19
	 */
	/**
	 * compose
	 *
	 * @export
	 * @template argType
	 * @param {...Array<(...args: argType[]) => argType>} funcs
	 * @returns
	 */
	function compose() {
	    var funcs = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        funcs[_i] = arguments[_i];
	    }
	    if (funcs.length === 0) {
	        return function (arg) { return arg; };
	    }
	    if (funcs.length === 1) {
	        return funcs[0];
	    }
	    return funcs.reduce(function (a, b) { return function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        return a(b.apply(void 0, args));
	    }; });
	}
	exports.compose = compose;
	/**
	 * clone
	 *
	 * @export
	 * @template T
	 * @param {T} value
	 * @returns {T}
	 */
	function clone(value) {
	    return JSON.parse(JSON.stringify(value));
	}
	exports.clone = clone;
	/**
	 * Observable
	 *
	 * @export
	 * @class Observable
	 * @template T
	 */
	var Observable = /** @class */ (function () {
	    /**
	     *Creates an instance of Observable.
	     * @param {T} state
	     * @memberof Observable
	     */
	    function Observable(state) {
	        this.state = state;
	        this.observers = new Array();
	    }
	    /**
	     * subscribe
	     *
	     * @param {Observer<T>} observer
	     * @returns {UnSubscribe<T>}
	     * @memberof Observable
	     */
	    Observable.prototype.subscribe = function (observer) {
	        var _this = this;
	        this.observers.push(observer);
	        return function () {
	            return (_this.observers = _this.observers.filter(function (obser) { return obser !== observer; }));
	        };
	    };
	    /**
	     * pipe
	     *
	     * @param {...Array<(...args: T[]) => T>} funcs
	     * @memberof Observable
	     */
	    Observable.prototype.pipe = function () {
	        var _this = this;
	        var funcs = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            funcs[_i] = arguments[_i];
	        }
	        !(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
	            return [2 /*return*/, compose.apply(void 0, funcs.reverse())(this.state)];
	        }); }); })().then(function (state) {
	            _this.observers.forEach(function (observer) { return observer(state, _this.state); });
	            _this.state = state;
	        });
	        return this;
	    };
	    /**
	     * getState
	     *
	     * @returns {T}
	     * @memberof Observable
	     */
	    Observable.prototype.getState = function () {
	        return this.state;
	    };
	    /**
	     * push
	     *
	     * @param {T} state
	     * @memberof Observable
	     */
	    Observable.prototype.push = function (state) {
	        return this.pipe(function () { return clone(state); });
	    };
	    /**
	     * pull
	     *
	     * @returns {T}
	     * @memberof Observable
	     */
	    Observable.prototype.pull = function () {
	        return clone(this.state);
	    };
	    return Observable;
	}());
	exports.Observable = Observable;
	});

	unwrapExports(Observable_1);
	var Observable_2 = Observable_1.compose;
	var Observable_3 = Observable_1.clone;
	var Observable_4 = Observable_1.Observable;

	var lib$3 = createCommonjsModule(function (module, exports) {
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(Observable_1);
	});

	unwrapExports(lib$3);

	var Factory_1 = createCommonjsModule(function (module, exports) {
	var __decorate = (commonjsGlobal && commonjsGlobal.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (commonjsGlobal && commonjsGlobal.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var __param = (commonjsGlobal && commonjsGlobal.__param) || function (paramIndex, decorator) {
	    return function (target, key) { decorator(target, key, paramIndex); }
	};
	Object.defineProperty(exports, "__esModule", { value: true });



	var Factory = /** @class */ (function () {
	    function Factory(Block) {
	        this.Block = Block;
	    }
	    Factory.prototype.getNode = function () {
	        return new lib$2.Node(50, 50);
	    };
	    Factory.prototype.getLabel = function (num) {
	        return new lib$2.Label(String(num), 30);
	    };
	    Factory.prototype.getBlock = function (num, x, y) {
	        return this.Block.create().set(num, x, y);
	    };
	    Factory.prototype.getBlockObservable = function (num, x, y) {
	        return new lib$3.Observable(this.getBlock(num, x, y));
	    };
	    Factory = __decorate([
	        lib.Injectable(),
	        __param(0, lib.Inject('Block')),
	        __metadata("design:paramtypes", [Object])
	    ], Factory);
	    return Factory;
	}());
	exports.Factory = Factory;
	});

	unwrapExports(Factory_1);
	var Factory_2 = Factory_1.Factory;

	var saberInterval = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	/*
	 * @Author: AK-12
	 * @Date: 2018-12-28 20:09:54
	 * @Last Modified by: AK-12
	 * @Last Modified time: 2019-01-10 13:21:22
	 */
	/**
	 * call function more times.
	 * @example
	 * ```ts
	call(() => console.log('call func 5 times!'), 5)
	 * ```
	 * @param func
	 * @param times
	 */
	function call(func, times) {
	    if (times === void 0) { times = 1; }
	    var count = 0;
	    var result;
	    var loop = function () {
	        if (count >= times) {
	            return result;
	        }
	        count++;
	        result = func(count);
	        loop();
	        return result;
	    };
	    return loop();
	}
	exports.call = call;
	function schedule(update, frameProps) {
	    var before = Date.now();
	    var delta = {
	        value: frameProps ? frameProps.delta : 17
	    };
	    var cancel = {
	        value: frameProps ? frameProps.cancel : false
	    };
	    var delayCancel = {
	        value: frameProps ? frameProps.delayCancel : -1
	    };
	    var frames = {
	        value: frameProps ? frameProps.frames : -1
	    };
	    var counter = 0;
	    var frame = function () {
	        if (Date.now() - before > delta.value) {
	            if (cancel.value) {
	                return;
	            }
	            if (frames.value > 0) {
	                if (counter >= frames.value) {
	                    return;
	                }
	            }
	            before = Date.now();
	            update(delta.value);
	            counter++;
	        }
	        requestAnimationFrame(frame);
	    };
	    requestAnimationFrame(frame);
	    if (delayCancel.value > 0) {
	        setTimeout(function () { return (cancel.value = true); }, delayCancel.value);
	    }
	    return function () { return (cancel.value = true); };
	}
	exports.schedule = schedule;
	/**
	 * scheduleOnce
	 * @example
	 * ```ts
	// setTimeout 2000
	scheduleOnce(dt => console.log('setTimeout!', dt), 2000)
	 * ```
	 *
	 * @param update
	 * @param delay
	 */
	exports.scheduleOnce = function (update, delay) {
	    return schedule(update, { delta: delay, frames: 1 });
	};
	});

	unwrapExports(saberInterval);
	var saberInterval_1 = saberInterval.call;
	var saberInterval_2 = saberInterval.schedule;
	var saberInterval_3 = saberInterval.scheduleOnce;

	var lib$4 = createCommonjsModule(function (module, exports) {
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(saberInterval);
	});

	unwrapExports(lib$4);

	var Matrix_1 = createCommonjsModule(function (module, exports) {
	var __decorate = (commonjsGlobal && commonjsGlobal.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (commonjsGlobal && commonjsGlobal.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	Object.defineProperty(exports, "__esModule", { value: true });



	var Matrix = /** @class */ (function () {
	    function Matrix() {
	        var _this = this;
	        this.mergeLeft = function (arr) {
	            var i, nextI, m;
	            var len = arr.length;
	            for (i = 0; i < len; i++) {
	                nextI = -1;
	                for (m = i + 1; m < len; m++) {
	                    if (arr[m] !== 0) {
	                        nextI = m;
	                        break;
	                    }
	                }
	                if (nextI !== -1) {
	                    if (arr[i] === 0) {
	                        arr[i] = arr[nextI];
	                        arr[nextI] = 0;
	                        i -= 1;
	                    }
	                    else if (arr[i] === arr[nextI]) {
	                        arr[i] = arr[i] * 2;
	                        arr[nextI] = 0;
	                    }
	                }
	            }
	            return arr;
	        };
	        this.mergeRight = function (arr) {
	            return _this.mergeLeft(arr.slice().reverse()).reverse();
	        };
	    }
	    Matrix_1 = Matrix;
	    Matrix.getInstance = function () {
	        this.instance = this.instance || new Matrix_1();
	        return this.instance;
	    };
	    Matrix.prototype.init = function (size) {
	        this.mat = lib$1.MatFill(0, size);
	        return this;
	    };
	    Matrix.prototype.merge = function (method) {
	        var _this = this;
	        switch (method) {
	            case 'left':
	                this.mat = this.mat.map(function (raw) { return _this.mergeLeft(raw); });
	                break;
	            case 'right':
	                this.mat = this.mat.map(function (raw) { return _this.mergeRight(raw); });
	                break;
	            case 'up':
	                this.mat = lib$1.MatTransform(lib$1.MatTransform(this.mat).map(function (raw) { return _this.mergeLeft(raw); }));
	                break;
	            case 'down':
	                this.mat = lib$1.MatTransform(lib$1.MatTransform(this.mat).map(function (raw) { return _this.mergeRight(raw); }));
	                break;
	        }
	        return this.mat;
	    };
	    Matrix.prototype.addRand = function (times) {
	        var _this = this;
	        if (times === void 0) { times = 1; }
	        var points = [];
	        lib$4.call(function () {
	            lib$1.Mat_foreach(_this.mat, function (value, raw, col) {
	                if (value === 0) {
	                    points.push({ x: raw, y: col });
	                    _this.hasNext = true;
	                }
	            });
	            if (_this.hasNext) {
	                var index = parseInt(String(Math.random() * points.length));
	                lib$1.MatSet(_this.mat, 2, {
	                    raw: points[index].x,
	                    col: points[index].y
	                });
	            }
	        }, times);
	        return this.hasNext;
	    };
	    var Matrix_1;
	    Matrix = Matrix_1 = __decorate([
	        lib.Singleton,
	        lib.Injectable(),
	        __metadata("design:paramtypes", [])
	    ], Matrix);
	    return Matrix;
	}());
	exports.Matrix = Matrix;
	});

	unwrapExports(Matrix_1);
	var Matrix_2 = Matrix_1.Matrix;

	var TouchFront_1 = createCommonjsModule(function (module, exports) {
	var __decorate = (commonjsGlobal && commonjsGlobal.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (commonjsGlobal && commonjsGlobal.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	Object.defineProperty(exports, "__esModule", { value: true });

	var TouchFront = /** @class */ (function () {
	    function TouchFront(offset, delta) {
	        if (offset === void 0) { offset = 100; }
	        if (delta === void 0) { delta = 200; }
	        this.offset = offset;
	        this.delta = delta;
	        this._lock = 0;
	    }
	    TouchFront.prototype.subscribe = function (callbackLeft, callbackRight, callbackUp, callbackDown) {
	        this.callbackLeft = callbackLeft;
	        this.callbackRight = callbackRight;
	        this.callbackUp = callbackUp;
	        this.callbackDown = callbackDown;
	        return this;
	    };
	    TouchFront.prototype.onStart = function (callback) {
	        this.callbackStart = callback;
	        return this;
	    };
	    TouchFront.prototype.onUpdate = function (callback) {
	        this.callbackUpdate = callback;
	        return this;
	    };
	    TouchFront.prototype.onStop = function (callback) {
	        this.callbackStop = callback;
	        return this;
	    };
	    TouchFront.prototype.listen = function () {
	        var _this = this;
	        var originPos;
	        document.addEventListener('mousedown', function (event) {
	            originPos = event;
	            !!_this.callbackStart ? _this.callbackStart() : null;
	        });
	        document.addEventListener('mousemove', function () {
	            _this._lock++;
	            if (originPos) {
	                !!_this.callbackUpdate ? _this.callbackUpdate() : null;
	            }
	        });
	        document.addEventListener('mouseup', function (event) {
	            _this._lock < _this.delta ? _this.testPos(originPos, event) : null;
	            _this._lock = 0;
	            !!_this.callbackStop ? _this.callbackStop() : null;
	            originPos = null;
	        });
	    };
	    TouchFront.prototype.testPos = function (originPos, touchPos) {
	        if (Math.abs(touchPos.x - originPos.x) < this.offset &&
	            Math.abs(touchPos.y - originPos.y) < this.offset) {
	            return;
	        }
	        if (Math.abs(touchPos.x - originPos.x) > Math.abs(touchPos.y - originPos.y)) {
	            if (touchPos.x - originPos.x > this.offset) {
	                !!this.callbackRight ? this.callbackRight() : null;
	            }
	            else if (touchPos.x - originPos.x < -this.offset) {
	                !!this.callbackLeft ? this.callbackLeft() : null;
	            }
	        }
	        else {
	            if (touchPos.y - originPos.y > this.offset) {
	                !!this.callbackDown ? this.callbackDown() : null;
	            }
	            else if (touchPos.y - originPos.y < -this.offset) {
	                !!this.callbackUp ? this.callbackUp() : null;
	            }
	        }
	    };
	    TouchFront = __decorate([
	        lib.Injectable(),
	        __metadata("design:paramtypes", [Object, Object])
	    ], TouchFront);
	    return TouchFront;
	}());
	exports.TouchFront = TouchFront;
	});

	unwrapExports(TouchFront_1);
	var TouchFront_2 = TouchFront_1.TouchFront;

	var Canvas_1 = createCommonjsModule(function (module, exports) {
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __decorate = (commonjsGlobal && commonjsGlobal.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (commonjsGlobal && commonjsGlobal.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	Object.defineProperty(exports, "__esModule", { value: true });


	var Canvas = /** @class */ (function (_super) {
	    __extends(Canvas, _super);
	    function Canvas() {
	        return _super.call(this, 'canvas', 400, 400) || this;
	    }
	    Canvas_1 = Canvas;
	    var Canvas_1;
	    Canvas.instance = new Canvas_1();
	    Canvas = Canvas_1 = __decorate([
	        lib.Singleton,
	        lib.Injectable(),
	        __metadata("design:paramtypes", [])
	    ], Canvas);
	    return Canvas;
	}(lib$2.Canvas));
	exports.Canvas = Canvas;
	});

	unwrapExports(Canvas_1);
	var Canvas_2 = Canvas_1.Canvas;

	var Block_1 = createCommonjsModule(function (module, exports) {
	var __decorate = (commonjsGlobal && commonjsGlobal.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (commonjsGlobal && commonjsGlobal.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	Object.defineProperty(exports, "__esModule", { value: true });


	var Block = /** @class */ (function () {
	    function Block() {
	        this.node = new lib$2.Node(0, 0);
	        this.label = new lib$2.Label('2', 30);
	    }
	    Block_1 = Block;
	    Block.prototype.set = function (num, x, y) {
	        this.label.setText(String(num)).setPosition(x, y);
	        this.node.setPosition(x, y);
	        return this;
	    };
	    Block.prototype.create = function () {
	        return new Block_1();
	    };
	    var Block_1;
	    Block = Block_1 = __decorate([
	        lib.Injectable(),
	        __metadata("design:paramtypes", [])
	    ], Block);
	    return Block;
	}());
	exports.Block = Block;
	});

	unwrapExports(Block_1);
	var Block_2 = Block_1.Block;

	var main = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });








	new lib.SaIOC.Container(Layout_1.Layout, Factory_1.Factory, Application_1.Application, Matrix_1.Matrix, TouchFront_1.TouchFront, Canvas_1.Canvas, Block_1.Block).run();
	});

	var main$1 = unwrapExports(main);

	return main$1;

}());
