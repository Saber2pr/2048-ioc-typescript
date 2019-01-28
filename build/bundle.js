var process = {
  env: {
    NODE_ENV: 'production'
  }
};
var module = {};
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
	Object.defineProperty(exports, "__esModule", { value: true });
	/*
	 * @Author: AK-12
	 * @Date: 2019-01-24 07:11:58
	 * @Last Modified by: AK-12
	 * @Last Modified time: 2019-01-27 22:10:41
	 */

	/**
	 * # MetaStore
	 * save metadata.
	 */
	var MetaStore = {};
	/**
	 * # META
	 * `meta token`
	 */
	var META = 'saber_meta';
	/**
	 * # MAIN
	 * `main class tag`
	 */
	var MAIN = 'saber_main';
	/**
	 * # CLASSTYPE
	 */
	var CLASSTYPE = {
	    SINGLETON: 'saber_singleton',
	    SINGLETON_LAZY: 'saber_singleton_lazy'
	};
	/**
	 * # MetaKey
	 * return a META key.
	 * @param id
	 */
	var MetaKey = function (id) { return META + ":" + id; };
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
	            Reflect.defineMetadata(MetaKey(id || target.name), target, MetaStore);
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
	    Reflect.defineMetadata(MAIN, undefined, target);
	}
	exports.Bootstrap = Bootstrap;
	/**
	 * ## Singleton
	 * `tag`:`Singleton`
	 *
	 * `provide`:`instance`
	 *
	 * @export
	 * @param {*} target
	 */
	function Singleton(target) {
	    Reflect.defineMetadata(CLASSTYPE.SINGLETON, undefined, target);
	}
	exports.Singleton = Singleton;
	/**
	 * ## SingletonLazy
	 * `tag`:`SingletonLazy`
	 *
	 * `provide`:`getInstance()`
	 *
	 * @export
	 * @param {*} target
	 */
	function SingletonLazy(target) {
	    Reflect.defineMetadata(CLASSTYPE.SINGLETON_LAZY, undefined, target);
	}
	exports.SingletonLazy = SingletonLazy;
	/**
	 * # Class
	 */
	var Class;
	(function (Class) {
	    Class.isSingleton = function (target) {
	        return Reflect.hasMetadata(CLASSTYPE.SINGLETON, target);
	    };
	    Class.isSingletonLazy = function (target) {
	        return Reflect.hasMetadata(CLASSTYPE.SINGLETON_LAZY, target);
	    };
	})(Class || (Class = {}));
	/**
	 * # SaFactory
	 * ## A simple ioc container for classes
	 * 1. ensure `tsconfig.json` : `"emitDecoratorMetadata": true`.
	 * 2. ensure `tsconfig.json` : `"experimentalDecorators": true`.
	 * @exports
	 */
	var SaFactory;
	(function (SaFactory) {
	    /**
	     * create
	     *
	     * @template T
	     * @param {Constructor<T>} constructor
	     * @returns {T}
	     */
	    function create(constructor) {
	        if (Class.isSingleton(constructor)) {
	            if (constructor.instance) {
	                return constructor.instance;
	            }
	            else {
	                throw new Error('constructor should provide `instance`.');
	            }
	        }
	        else if (Class.isSingletonLazy(constructor)) {
	            if (constructor.getInstance) {
	                return constructor.getInstance();
	            }
	            else {
	                throw new Error('constructor should provide `getInstance`.');
	            }
	        }
	        var depKeys = Reflect.getMetadataKeys(constructor).filter(function (key) { return key.indexOf(META) !== -1; });
	        var dependencies = depKeys.map(function (key) { return Reflect.getMetadata(key, MetaStore); });
	        var depInstances = dependencies.map(function (dependence) { return create(dependence); });
	        return new (constructor.bind.apply(constructor, [void 0].concat(depInstances.reverse())))();
	    }
	    function BootStrap(constructor, mainMethod) {
	        var props = Object.keys(constructor.prototype);
	        var main = create(constructor);
	        if (props.some(function (value) { return value === 'main'; })) {
	            main['main']();
	        }
	        else {
	            main[mainMethod || props[0]]();
	        }
	    }
	    SaFactory.BootStrap = BootStrap;
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
	                    return Reflect.hasMetadata(MAIN, constructor);
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
	            return create(this.main);
	        };
	        Container.prototype.run = function (Constructor) {
	            SaFactory.BootStrap(Constructor || this.main);
	        };
	        return Container;
	    }());
	    SaFactory.Container = Container;
	})(SaFactory = exports.SaFactory || (exports.SaFactory = {}));
	});

	unwrapExports(saberIoc);
	var saberIoc_1 = saberIoc.Injectable;
	var saberIoc_2 = saberIoc.Inject;
	var saberIoc_3 = saberIoc.Bootstrap;
	var saberIoc_4 = saberIoc.Singleton;
	var saberIoc_5 = saberIoc.SingletonLazy;
	var saberIoc_6 = saberIoc.SaFactory;

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
	    function Application(Layout, Data, TouchFront) {
	        this.Layout = Layout;
	        this.Data = Data;
	        this.TouchFront = TouchFront;
	    }
	    Application.prototype.main = function () {
	        var _this = this;
	        this.Data.init(4, 2048).addRand(2);
	        this.Layout.draw(this.Data.merge('left'), 'left');
	        this.TouchFront.subscribe(function () { return _this.Layout.draw(_this.Data.merge('left'), 'left'); }, function () { return _this.Layout.draw(_this.Data.merge('right'), 'right'); }, function () { return _this.Layout.draw(_this.Data.merge('up'), 'up'); }, function () { return _this.Layout.draw(_this.Data.merge('down'), 'down'); })
	            .onStop(function () { return _this.Data.addRand(2); })
	            .listen();
	    };
	    Application = __decorate([
	        lib.Bootstrap,
	        __param(0, lib.Inject('Layout')),
	        __param(1, lib.Inject('Data')),
	        __param(2, lib.Inject('TouchFront')),
	        __metadata("design:paramtypes", [Object, Object, Object])
	    ], Application);
	    return Application;
	}());
	exports.Application = Application;
	});

	unwrapExports(Application_1);
	var Application_2 = Application_1.Application;

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
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
	/* global Reflect, Promise */

	var extendStatics = function(d, b) {
	    extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return extendStatics(d, b);
	};

	function __extends(d, b) {
	    extendStatics(d, b);
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}

	var __assign = function() {
	    __assign = Object.assign || function __assign(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};

	function __rest(s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
	            t[p[i]] = s[p[i]];
	    return t;
	}

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
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

	var __assign$1 = function() {
	    __assign$1 = Object.assign || function __assign(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign$1.apply(this, arguments);
	};

	var clamp = function (min, max) { return function (v) {
	    return Math.max(Math.min(v, max), min);
	}; };
	var isFirstChars = function (term) { return function (v) {
	    return typeof v === 'string' && v.indexOf(term) === 0;
	}; };
	var getValueFromFunctionString = function (value) {
	    return value.substring(value.indexOf('(') + 1, value.lastIndexOf(')'));
	};
	var splitCommaDelimited = function (value) {
	    return typeof value === 'string' ? value.split(/,\s*/) : [value];
	};
	var sanitize = function (v) { return (v % 1 ? Number(v.toFixed(5)) : v); };

	var number = {
	    test: function (v) { return typeof v === 'number'; },
	    parse: parseFloat,
	    transform: function (v) { return v; }
	};
	var alpha = __assign$1({}, number, { transform: clamp(0, 1) });
	var scale = __assign$1({}, number, { default: 1 });

	var createUnitType = function (unit) { return ({
	    test: function (v) {
	        return typeof v === 'string' && v.endsWith(unit) && v.split(' ').length === 1;
	    },
	    parse: parseFloat,
	    transform: function (v) { return "" + v + unit; }
	}); };
	var degrees = createUnitType('deg');
	var percent = createUnitType('%');
	var px = createUnitType('px');
	var vh = createUnitType('vh');
	var vw = createUnitType('vw');

	var clampRgbUnit = clamp(0, 255);
	var onlyColorRegex = /^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))$/i;
	var isRgba = function (v) { return v.red !== undefined; };
	var isHsla = function (v) { return v.hue !== undefined; };
	var splitColorValues = function (terms) {
	    var numTerms = terms.length;
	    return function (v) {
	        if (typeof v !== 'string')
	            return v;
	        var values = {};
	        var valuesArray = splitCommaDelimited(getValueFromFunctionString(v));
	        for (var i = 0; i < numTerms; i++) {
	            values[terms[i]] =
	                valuesArray[i] !== undefined ? parseFloat(valuesArray[i]) : 1;
	        }
	        return values;
	    };
	};
	var rgbaTemplate = function (_a) {
	    var red = _a.red, green = _a.green, blue = _a.blue, _b = _a.alpha, alpha$$1 = _b === void 0 ? 1 : _b;
	    return "rgba(" + red + ", " + green + ", " + blue + ", " + alpha$$1 + ")";
	};
	var hslaTemplate = function (_a) {
	    var hue = _a.hue, saturation = _a.saturation, lightness = _a.lightness, _b = _a.alpha, alpha$$1 = _b === void 0 ? 1 : _b;
	    return "hsla(" + hue + ", " + saturation + ", " + lightness + ", " + alpha$$1 + ")";
	};
	var rgbUnit = __assign$1({}, number, { transform: function (v) { return Math.round(clampRgbUnit(v)); } });
	var testRgbaString = isFirstChars('rgb');
	var rgba = {
	    test: function (v) { return (typeof v === 'string' ? testRgbaString(v) : isRgba(v)); },
	    parse: splitColorValues(['red', 'green', 'blue', 'alpha']),
	    transform: function (_a) {
	        var red = _a.red, green = _a.green, blue = _a.blue, alpha$$1 = _a.alpha;
	        return rgbaTemplate({
	            red: rgbUnit.transform(red),
	            green: rgbUnit.transform(green),
	            blue: rgbUnit.transform(blue),
	            alpha: sanitize(alpha$$1)
	        });
	    }
	};
	var testHslaString = isFirstChars('hsl');
	var hsla = {
	    test: function (v) { return (typeof v === 'string' ? testHslaString(v) : isHsla(v)); },
	    parse: splitColorValues(['hue', 'saturation', 'lightness', 'alpha']),
	    transform: function (_a) {
	        var hue = _a.hue, saturation = _a.saturation, lightness = _a.lightness, alpha$$1 = _a.alpha;
	        return hslaTemplate({
	            hue: Math.round(hue),
	            saturation: percent.transform(sanitize(saturation)),
	            lightness: percent.transform(sanitize(lightness)),
	            alpha: sanitize(alpha$$1)
	        });
	    }
	};
	var hex = __assign$1({}, rgba, { test: isFirstChars('#'), parse: function (v) {
	        var r = '';
	        var g = '';
	        var b = '';
	        if (v.length > 4) {
	            r = v.substr(1, 2);
	            g = v.substr(3, 2);
	            b = v.substr(5, 2);
	        }
	        else {
	            r = v.substr(1, 1);
	            g = v.substr(2, 1);
	            b = v.substr(3, 1);
	            r += r;
	            g += g;
	            b += b;
	        }
	        return {
	            red: parseInt(r, 16),
	            green: parseInt(g, 16),
	            blue: parseInt(b, 16),
	            alpha: 1
	        };
	    } });
	var color = {
	    test: function (v) {
	        return (typeof v === 'string' && onlyColorRegex.test(v)) ||
	            rgba.test(v) ||
	            hsla.test(v) ||
	            hex.test(v);
	    },
	    parse: function (v) {
	        if (rgba.test(v)) {
	            return rgba.parse(v);
	        }
	        else if (hsla.test(v)) {
	            return hsla.parse(v);
	        }
	        else if (hex.test(v)) {
	            return hex.parse(v);
	        }
	        return v;
	    },
	    transform: function (v) {
	        if (isRgba(v)) {
	            return rgba.transform(v);
	        }
	        else if (isHsla(v)) {
	            return hsla.transform(v);
	        }
	        return v;
	    }
	};

	var floatRegex = /(-)?(\d[\d\.]*)/g;
	var colorRegex = /(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi;
	var COLOR_TOKEN = '${c}';
	var NUMBER_TOKEN = '${n}';
	var complex = {
	    test: function (v) {
	        if (typeof v !== 'string' || !isNaN(v))
	            return false;
	        var numValues = 0;
	        var foundNumbers = v.match(floatRegex);
	        var foundColors = v.match(colorRegex);
	        if (foundNumbers)
	            numValues += foundNumbers.length;
	        if (foundColors)
	            numValues += foundColors.length;
	        return numValues > 0;
	    },
	    parse: function (v) {
	        var input = v;
	        var parsed = [];
	        var foundColors = input.match(colorRegex);
	        if (foundColors) {
	            input = input.replace(colorRegex, COLOR_TOKEN);
	            parsed.push.apply(parsed, foundColors.map(color.parse));
	        }
	        var foundNumbers = input.match(floatRegex);
	        if (foundNumbers) {
	            parsed.push.apply(parsed, foundNumbers.map(number.parse));
	        }
	        return parsed;
	    },
	    createTransformer: function (prop) {
	        var template = prop;
	        var token = 0;
	        var foundColors = prop.match(colorRegex);
	        var numColors = foundColors ? foundColors.length : 0;
	        if (foundColors) {
	            for (var i = 0; i < numColors; i++) {
	                template = template.replace(foundColors[i], COLOR_TOKEN);
	                token++;
	            }
	        }
	        var foundNumbers = template.match(floatRegex);
	        var numNumbers = foundNumbers ? foundNumbers.length : 0;
	        if (foundNumbers) {
	            for (var i = 0; i < numNumbers; i++) {
	                template = template.replace(foundNumbers[i], NUMBER_TOKEN);
	                token++;
	            }
	        }
	        return function (v) {
	            var output = template;
	            for (var i = 0; i < token; i++) {
	                output = output.replace(i < numColors ? COLOR_TOKEN : NUMBER_TOKEN, i < numColors ? color.transform(v[i]) : sanitize(v[i]));
	            }
	            return output;
	        };
	    }
	};

	var styleValueTypes_es = /*#__PURE__*/Object.freeze({
		number: number,
		scale: scale,
		alpha: alpha,
		degrees: degrees,
		percent: percent,
		px: px,
		vw: vw,
		vh: vh,
		rgba: rgba,
		rgbUnit: rgbUnit,
		hex: hex,
		hsla: hsla,
		color: color,
		complex: complex
	});

	var HEY_LISTEN = 'Hey, listen! ';
	var warning = function () { };
	var invariant = function () { };
	if (process.env.NODE_ENV !== 'production') {
	    warning = function (check, message) {
	        if (!check && typeof console !== 'undefined') {
	            console.warn(HEY_LISTEN + message);
	        }
	    };
	    invariant = function (check, message) {
	        if (!check) {
	            throw new Error(HEY_LISTEN.toUpperCase() + message);
	        }
	    };
	}

	var prevTime = 0;
	var onNextFrame = typeof window !== 'undefined' && window.requestAnimationFrame !== undefined
	    ? function (callback) { return window.requestAnimationFrame(callback); }
	    : function (callback) {
	        var timestamp = Date.now();
	        var timeToCall = Math.max(0, 16.7 - (timestamp - prevTime));
	        prevTime = timestamp + timeToCall;
	        setTimeout(function () { return callback(prevTime); }, timeToCall);
	    };

	var createStep = (function (setRunNextFrame) {
	    var processToRun = [];
	    var processToRunNextFrame = [];
	    var numThisFrame = 0;
	    var isProcessing = false;
	    var i = 0;
	    var cancelled = new WeakSet();
	    var toKeepAlive = new WeakSet();
	    var renderStep = {
	        cancel: function (process) {
	            var indexOfCallback = processToRunNextFrame.indexOf(process);
	            cancelled.add(process);
	            if (indexOfCallback !== -1) {
	                processToRunNextFrame.splice(indexOfCallback, 1);
	            }
	        },
	        process: function (frame) {
	            var _a;
	            isProcessing = true;
	            _a = [
	                processToRunNextFrame,
	                processToRun
	            ], processToRun = _a[0], processToRunNextFrame = _a[1];
	            processToRunNextFrame.length = 0;
	            numThisFrame = processToRun.length;
	            if (numThisFrame) {
	                var process_1;
	                for (i = 0; i < numThisFrame; i++) {
	                    process_1 = processToRun[i];
	                    process_1(frame);
	                    if (toKeepAlive.has(process_1) === true && !cancelled.has(process_1)) {
	                        renderStep.schedule(process_1);
	                        setRunNextFrame(true);
	                    }
	                }
	            }
	            isProcessing = false;
	        },
	        schedule: function (process, keepAlive, immediate) {
	            invariant(typeof process === 'function', 'Argument must be a function');
	            var addToCurrentBuffer = immediate && isProcessing;
	            var buffer = addToCurrentBuffer ? processToRun : processToRunNextFrame;
	            if (keepAlive)
	                toKeepAlive.add(process);
	            if (buffer.indexOf(process) === -1) {
	                buffer.push(process);
	                if (addToCurrentBuffer)
	                    numThisFrame = processToRun.length;
	            }
	        }
	    };
	    return renderStep;
	});

	var StepId;
	(function (StepId) {
	    StepId["Read"] = "read";
	    StepId["Update"] = "update";
	    StepId["Render"] = "render";
	    StepId["PostRender"] = "postRender";
	    StepId["FixedUpdate"] = "fixedUpdate";
	})(StepId || (StepId = {}));

	var maxElapsed = 40;
	var defaultElapsed = (1 / 60) * 1000;
	var useDefaultElapsed = true;
	var willRunNextFrame = false;
	var isProcessing = false;
	var frame = {
	    delta: 0,
	    timestamp: 0
	};
	var stepsOrder = [
	    StepId.Read,
	    StepId.Update,
	    StepId.Render,
	    StepId.PostRender
	];
	var setWillRunNextFrame = function (willRun) { return (willRunNextFrame = willRun); };
	var _a = stepsOrder.reduce(function (acc, key) {
	    var step = createStep(setWillRunNextFrame);
	    acc.sync[key] = function (process, keepAlive, immediate) {
	        if (keepAlive === void 0) { keepAlive = false; }
	        if (immediate === void 0) { immediate = false; }
	        if (!willRunNextFrame)
	            startLoop();
	        step.schedule(process, keepAlive, immediate);
	        return process;
	    };
	    acc.cancelSync[key] = function (process) { return step.cancel(process); };
	    acc.steps[key] = step;
	    return acc;
	}, {
	    steps: {},
	    sync: {},
	    cancelSync: {}
	}), steps = _a.steps, sync = _a.sync, cancelSync = _a.cancelSync;
	var processStep = function (stepId) { return steps[stepId].process(frame); };
	var processFrame = function (timestamp) {
	    willRunNextFrame = false;
	    frame.delta = useDefaultElapsed
	        ? defaultElapsed
	        : Math.max(Math.min(timestamp - frame.timestamp, maxElapsed), 1);
	    if (!useDefaultElapsed)
	        defaultElapsed = frame.delta;
	    frame.timestamp = timestamp;
	    isProcessing = true;
	    stepsOrder.forEach(processStep);
	    isProcessing = false;
	    if (willRunNextFrame) {
	        useDefaultElapsed = false;
	        onNextFrame(processFrame);
	    }
	};
	var startLoop = function () {
	    willRunNextFrame = true;
	    useDefaultElapsed = true;
	    if (!isProcessing)
	        onNextFrame(processFrame);
	};
	var getFrameData = function () { return frame; };

	var DEFAULT_OVERSHOOT_STRENGTH = 1.525;
	var reversed = function (easing) {
	    return function (p) {
	        return 1 - easing(1 - p);
	    };
	};
	var mirrored = function (easing) {
	    return function (p) {
	        return p <= 0.5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;
	    };
	};
	var createReversedEasing = reversed;
	var createMirroredEasing = mirrored;
	var createExpoIn = function (power) {
	    return function (p) {
	        return Math.pow(p, power);
	    };
	};
	var createBackIn = function (power) {
	    return function (p) {
	        return p * p * ((power + 1) * p - power);
	    };
	};
	var createAnticipateEasing = function (power) {
	    var backEasing = createBackIn(power);
	    return function (p) {
	        return (p *= 2) < 1 ? 0.5 * backEasing(p) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
	    };
	};
	var linear = function (p) {
	    return p;
	};
	var easeIn = /*#__PURE__*/createExpoIn(2);
	var easeOut = /*#__PURE__*/reversed(easeIn);
	var easeInOut = /*#__PURE__*/mirrored(easeIn);
	var circIn = function (p) {
	    return 1 - Math.sin(Math.acos(p));
	};
	var circOut = /*#__PURE__*/reversed(circIn);
	var circInOut = /*#__PURE__*/mirrored(circOut);
	var backIn = /*#__PURE__*/createBackIn(DEFAULT_OVERSHOOT_STRENGTH);
	var backOut = /*#__PURE__*/reversed(backIn);
	var backInOut = /*#__PURE__*/mirrored(backIn);
	var anticipate = /*#__PURE__*/createAnticipateEasing(DEFAULT_OVERSHOOT_STRENGTH);
	var NEWTON_ITERATIONS = 8;
	var NEWTON_MIN_SLOPE = 0.001;
	var SUBDIVISION_PRECISION = 0.0000001;
	var SUBDIVISION_MAX_ITERATIONS = 10;
	var K_SPLINE_TABLE_SIZE = 11;
	var K_SAMPLE_STEP_SIZE = 1.0 / (K_SPLINE_TABLE_SIZE - 1.0);
	var FLOAT_32_SUPPORTED = typeof Float32Array !== 'undefined';
	var a = function (a1, a2) {
	    return 1.0 - 3.0 * a2 + 3.0 * a1;
	};
	var b = function (a1, a2) {
	    return 3.0 * a2 - 6.0 * a1;
	};
	var c = function (a1) {
	    return 3.0 * a1;
	};
	var getSlope = function (t, a1, a2) {
	    return 3.0 * a(a1, a2) * t * t + 2.0 * b(a1, a2) * t + c(a1);
	};
	var calcBezier = function (t, a1, a2) {
	    return ((a(a1, a2) * t + b(a1, a2)) * t + c(a1)) * t;
	};
	function cubicBezier(mX1, mY1, mX2, mY2) {
	    var sampleValues = FLOAT_32_SUPPORTED ? new Float32Array(K_SPLINE_TABLE_SIZE) : new Array(K_SPLINE_TABLE_SIZE);
	    var binarySubdivide = function (aX, aA, aB) {
	        var i = 0;
	        var currentX;
	        var currentT;
	        do {
	            currentT = aA + (aB - aA) / 2.0;
	            currentX = calcBezier(currentT, mX1, mX2) - aX;
	            if (currentX > 0.0) {
	                aB = currentT;
	            } else {
	                aA = currentT;
	            }
	        } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
	        return currentT;
	    };
	    var newtonRaphsonIterate = function (aX, aGuessT) {
	        var i = 0;
	        var currentSlope = 0;
	        var currentX;
	        for (; i < NEWTON_ITERATIONS; ++i) {
	            currentSlope = getSlope(aGuessT, mX1, mX2);
	            if (currentSlope === 0.0) {
	                return aGuessT;
	            }
	            currentX = calcBezier(aGuessT, mX1, mX2) - aX;
	            aGuessT -= currentX / currentSlope;
	        }
	        return aGuessT;
	    };
	    var calcSampleValues = function () {
	        for (var i = 0; i < K_SPLINE_TABLE_SIZE; ++i) {
	            sampleValues[i] = calcBezier(i * K_SAMPLE_STEP_SIZE, mX1, mX2);
	        }
	    };
	    var getTForX = function (aX) {
	        var intervalStart = 0.0;
	        var currentSample = 1;
	        var lastSample = K_SPLINE_TABLE_SIZE - 1;
	        var dist = 0.0;
	        var guessForT = 0.0;
	        var initialSlope = 0.0;
	        for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
	            intervalStart += K_SAMPLE_STEP_SIZE;
	        }
	        --currentSample;
	        dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
	        guessForT = intervalStart + dist * K_SAMPLE_STEP_SIZE;
	        initialSlope = getSlope(guessForT, mX1, mX2);
	        if (initialSlope >= NEWTON_MIN_SLOPE) {
	            return newtonRaphsonIterate(aX, guessForT);
	        } else if (initialSlope === 0.0) {
	            return guessForT;
	        } else {
	            return binarySubdivide(aX, intervalStart, intervalStart + K_SAMPLE_STEP_SIZE);
	        }
	    };
	    calcSampleValues();
	    var resolver = function (aX) {
	        var returnValue;
	        if (mX1 === mY1 && mX2 === mY2) {
	            returnValue = aX;
	        } else if (aX === 0) {
	            returnValue = 0;
	        } else if (aX === 1) {
	            returnValue = 1;
	        } else {
	            returnValue = calcBezier(getTForX(aX), mY1, mY2);
	        }
	        return returnValue;
	    };
	    return resolver;
	}

	var easing_es = /*#__PURE__*/Object.freeze({
		reversed: reversed,
		mirrored: mirrored,
		createReversedEasing: createReversedEasing,
		createMirroredEasing: createMirroredEasing,
		createExpoIn: createExpoIn,
		createBackIn: createBackIn,
		createAnticipateEasing: createAnticipateEasing,
		linear: linear,
		easeIn: easeIn,
		easeOut: easeOut,
		easeInOut: easeInOut,
		circIn: circIn,
		circOut: circOut,
		circInOut: circInOut,
		backIn: backIn,
		backOut: backOut,
		backInOut: backInOut,
		anticipate: anticipate,
		cubicBezier: cubicBezier
	});

	var zeroPoint = {
	    x: 0,
	    y: 0,
	    z: 0
	};
	var isNum = function (v) { return typeof v === 'number'; };

	var radiansToDegrees = (function (radians) { return (radians * 180) / Math.PI; });

	var angle = (function (a, b) {
	    if (b === void 0) { b = zeroPoint; }
	    return radiansToDegrees(Math.atan2(b.y - a.y, b.x - a.x));
	});

	var applyOffset = (function (from, to) {
	    var hasReceivedFrom = true;
	    if (to === undefined) {
	        to = from;
	        hasReceivedFrom = false;
	    }
	    return function (v) {
	        if (hasReceivedFrom) {
	            return v - from + to;
	        }
	        else {
	            from = v;
	            hasReceivedFrom = true;
	            return to;
	        }
	    };
	});

	var curryRange = (function (func) { return function (min, max, v) { return (v !== undefined ? func(min, max, v) : function (cv) { return func(min, max, cv); }); }; });

	var clamp$1 = function (min, max, v) {
	    return Math.min(Math.max(v, min), max);
	};
	var clamp$1$1 = curryRange(clamp$1);

	var conditional = (function (check, apply) { return function (v) {
	    return check(v) ? apply(v) : v;
	}; });

	var degreesToRadians = (function (degrees$$1) { return (degrees$$1 * Math.PI) / 180; });

	var isPoint = (function (point) {
	    return point.hasOwnProperty('x') && point.hasOwnProperty('y');
	});

	var isPoint3D = (function (point) {
	    return isPoint(point) && point.hasOwnProperty('z');
	});

	var distance1D = function (a, b) { return Math.abs(a - b); };
	var distance = (function (a, b) {
	    if (b === void 0) { b = zeroPoint; }
	    if (isNum(a) && isNum(b)) {
	        return distance1D(a, b);
	    }
	    else if (isPoint(a) && isPoint(b)) {
	        var xDelta = distance1D(a.x, b.x);
	        var yDelta = distance1D(a.y, b.y);
	        var zDelta = isPoint3D(a) && isPoint3D(b) ? distance1D(a.z, b.z) : 0;
	        return Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2) + Math.pow(zDelta, 2));
	    }
	    return 0;
	});

	var progress = (function (from, to, value) {
	    var toFromDifference = to - from;
	    return toFromDifference === 0 ? 1 : (value - from) / toFromDifference;
	});

	var mix = (function (from, to, progress) {
	    return -progress * from + progress * to + from;
	});

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
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

	var __assign$2 = function() {
	    __assign$2 = Object.assign || function __assign(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign$2.apply(this, arguments);
	};

	var mixLinearColor = function (from, to, v) {
	    var fromExpo = from * from;
	    var toExpo = to * to;
	    return Math.sqrt(v * (toExpo - fromExpo) + fromExpo);
	};
	var colorTypes = [hex, rgba, hsla];
	var getColorType = function (v) {
	    return colorTypes.find(function (type) { return type.test(v); });
	};
	var mixColor = (function (from, to) {
	    var fromColorType = getColorType(from);
	    var toColorType = getColorType(to);
	    invariant(fromColorType.transform === toColorType.transform, 'Both colors must be Hex and/or RGBA, or both must be HSLA');
	    var fromColor = fromColorType.parse(from);
	    var toColor = toColorType.parse(to);
	    var blended = __assign$2({}, fromColor);
	    var mixFunc = fromColorType === hsla ? mix : mixLinearColor;
	    return function (v) {
	        for (var key in blended) {
	            if (key !== 'alpha') {
	                blended[key] = mixFunc(fromColor[key], toColor[key], v);
	            }
	        }
	        blended.alpha = mix(fromColor.alpha, toColor.alpha, v);
	        return fromColorType.transform(blended);
	    };
	});

	var combineFunctions = function (a, b) { return function (v) { return b(a(v)); }; };
	var pipe = (function () {
	    var transformers = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        transformers[_i] = arguments[_i];
	    }
	    return transformers.reduce(combineFunctions);
	});

	var mixArray = function (from, to) {
	    var output = from.slice();
	    var numValues = output.length;
	    var blendValue = from.map(function (fromThis, i) {
	        var toThis = to[i];
	        if (isNum(fromThis)) {
	            return function (v) { return mix(fromThis, toThis, v); };
	        }
	        else if (color.test(fromThis)) {
	            return mixColor(fromThis, toThis);
	        }
	        else {
	            return mixComplex(fromThis, toThis);
	        }
	    });
	    return function (v) {
	        for (var i = 0; i < numValues; i++) {
	            output[i] = blendValue[i](v);
	        }
	        return output;
	    };
	};
	var mixComplex = function (from, to) {
	    var valueTemplate = complex.createTransformer(from);
	    invariant(valueTemplate(from) === complex.createTransformer(to)(from), "Values '" + from + "' and '" + to + "' are of different format, or a value might have changed value type.");
	    return pipe(mixArray(complex.parse(from), complex.parse(to)), valueTemplate);
	};

	var mixNumber = curryRange(mix);
	var getMixer = function (v) {
	    return typeof v === 'number'
	        ? mixNumber
	        : color.test(v)
	            ? mixColor
	            : mixComplex;
	};
	var createMixers = function (output, ease) {
	    return Array(output.length - 1)
	        .fill(getMixer(output[0]))
	        .map(function (factory, i) {
	        var mixer = factory(output[i], output[i + 1]);
	        if (ease) {
	            var easingFunction = Array.isArray(ease) ? ease[i] : ease;
	            return pipe(easingFunction, mixer);
	        }
	        else {
	            return mixer;
	        }
	    });
	};
	var fastInterpolate = function (_a, _b) {
	    var from = _a[0], to = _a[1];
	    var mixer = _b[0];
	    return function (v) { return mixer(progress(from, to, v)); };
	};
	var slowInterpolate = function (input, mixers) {
	    var inputLength = input.length;
	    var lastInputIndex = inputLength - 1;
	    return function (v) {
	        var mixerIndex = 0;
	        var foundMixerIndex = false;
	        if (v <= input[0]) {
	            foundMixerIndex = true;
	        }
	        else if (v >= input[lastInputIndex]) {
	            mixerIndex = lastInputIndex - 1;
	            foundMixerIndex = true;
	        }
	        if (!foundMixerIndex) {
	            var i = 1;
	            for (; i < inputLength; i++) {
	                if (input[i] > v || i === lastInputIndex) {
	                    break;
	                }
	            }
	            mixerIndex = i - 1;
	        }
	        var progressInRange = progress(input[mixerIndex], input[mixerIndex + 1], v);
	        return mixers[mixerIndex](progressInRange);
	    };
	};
	var interpolate = (function (input, output, _a) {
	    var _b = _a === void 0 ? {} : _a, _c = _b.clamp, clamp = _c === void 0 ? true : _c, ease = _b.ease;
	    var inputLength = input.length;
	    invariant(inputLength === output.length, 'Both input and output ranges must be the same length');
	    invariant(!ease || !Array.isArray(ease) || ease.length === input.length - 1, 'Array of easing functions must be of length `input.length - 1`, as it applies to the transitions **between** the defined values.');
	    if (input[0] > input[inputLength - 1]) {
	        input = input.slice();
	        output = output.slice();
	        input.reverse();
	        output.reverse();
	    }
	    var mixers = createMixers(output, ease);
	    var interpolate = inputLength === 2
	        ? fastInterpolate(input, mixers)
	        : slowInterpolate(input, mixers);
	    return clamp
	        ? pipe(clamp$1$1(input[0], input[inputLength - 1]), interpolate)
	        : interpolate;
	});

	var pointFromVector = (function (origin, angle, distance) {
	    angle = degreesToRadians(angle);
	    return {
	        x: distance * Math.cos(angle) + origin.x,
	        y: distance * Math.sin(angle) + origin.y
	    };
	});

	var toDecimal = (function (num, precision) {
	    if (precision === void 0) { precision = 2; }
	    precision = Math.pow(10, precision);
	    return Math.round(num * precision) / precision;
	});

	var smoothFrame = (function (prevValue, nextValue, duration, smoothing) {
	    if (smoothing === void 0) { smoothing = 0; }
	    return toDecimal(prevValue +
	        (duration * (nextValue - prevValue)) / Math.max(smoothing, duration));
	});

	var smooth = (function (strength) {
	    if (strength === void 0) { strength = 50; }
	    var previousValue = 0;
	    var lastUpdated = 0;
	    return function (v) {
	        var currentFramestamp = getFrameData().timestamp;
	        var timeDelta = currentFramestamp !== lastUpdated ? currentFramestamp - lastUpdated : 0;
	        var newValue = timeDelta
	            ? smoothFrame(previousValue, v, timeDelta, strength)
	            : previousValue;
	        lastUpdated = currentFramestamp;
	        previousValue = newValue;
	        return newValue;
	    };
	});

	var snap = (function (points) {
	    if (typeof points === 'number') {
	        return function (v) { return Math.round(v / points) * points; };
	    }
	    else {
	        var i_1 = 0;
	        var numPoints_1 = points.length;
	        return function (v) {
	            var lastDistance = Math.abs(points[0] - v);
	            for (i_1 = 1; i_1 < numPoints_1; i_1++) {
	                var point = points[i_1];
	                var distance = Math.abs(point - v);
	                if (distance === 0)
	                    return point;
	                if (distance > lastDistance)
	                    return points[i_1 - 1];
	                if (i_1 === numPoints_1 - 1)
	                    return point;
	                lastDistance = distance;
	            }
	        };
	    }
	});

	var identity = function (v) { return v; };
	var springForce = function (alterDisplacement) {
	    if (alterDisplacement === void 0) { alterDisplacement = identity; }
	    return curryRange(function (constant, origin, v) {
	        var displacement = origin - v;
	        var springModifiedDisplacement = -(0 - constant + 1) * (0 - alterDisplacement(Math.abs(displacement)));
	        return displacement <= 0
	            ? origin + springModifiedDisplacement
	            : origin - springModifiedDisplacement;
	    });
	};
	var springForceLinear = springForce();
	var springForceExpo = springForce(Math.sqrt);

	var velocityPerFrame = (function (xps, frameDuration) {
	    return isNum(xps) ? xps / (1000 / frameDuration) : 0;
	});

	var velocityPerSecond = (function (velocity, frameDuration) {
	    return frameDuration ? velocity * (1000 / frameDuration) : 0;
	});

	var wrap = function (min, max, v) {
	    var rangeSize = max - min;
	    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
	};
	var wrap$1 = curryRange(wrap);

	var clampProgress = clamp$1$1(0, 1);

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
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

	var __assign$3 = function () {
	    __assign$3 = Object.assign || function __assign(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign$3.apply(this, arguments);
	};

	function __rest$1(s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
	    return t;
	}

	var createStyler = function (_a) {
	    var onRead = _a.onRead,
	        onRender = _a.onRender,
	        _b = _a.uncachedValues,
	        uncachedValues = _b === void 0 ? new Set() : _b,
	        _c = _a.useCache,
	        useCache = _c === void 0 ? true : _c;
	    return function (props) {
	        var state = {};
	        var changedValues = [];
	        var hasChanged = false;
	        var setValue = function (key, value) {
	            var currentValue = state[key];
	            state[key] = value;
	            if (state[key] !== currentValue) {
	                if (changedValues.indexOf(key) === -1) {
	                    changedValues.push(key);
	                }
	                if (!hasChanged) {
	                    hasChanged = true;
	                    sync.render(render);
	                }
	            }
	        };
	        function render(forceRender) {
	            if (forceRender === void 0) {
	                forceRender = false;
	            }
	            if (forceRender === true || hasChanged) {
	                onRender(state, props, changedValues);
	                hasChanged = false;
	                changedValues.length = 0;
	            }
	            return this;
	        }
	        return {
	            get: function (key) {
	                return key ? useCache && !uncachedValues.has(key) && state[key] !== undefined ? state[key] : onRead(key, props) : state;
	            },
	            set: function (values, value) {
	                if (typeof values === 'string') {
	                    if (value !== undefined) {
	                        setValue(values, value);
	                    } else {
	                        return function (v) {
	                            return setValue(values, v);
	                        };
	                    }
	                } else {
	                    for (var key in values) {
	                        if (values.hasOwnProperty(key)) {
	                            setValue(key, values[key]);
	                        }
	                    }
	                }
	                return this;
	            },
	            render: render
	        };
	    };
	};

	var CAMEL_CASE_PATTERN = /([a-z])([A-Z])/g;
	var REPLACE_TEMPLATE = '$1-$2';
	var camelToDash = function (str) {
	    return str.replace(CAMEL_CASE_PATTERN, REPLACE_TEMPLATE).toLowerCase();
	};
	var setDomAttrs = function (element, attrs) {
	    for (var key in attrs) {
	        if (attrs.hasOwnProperty(key)) {
	            element.setAttribute(key, attrs[key]);
	        }
	    }
	};

	var camelCache = /*#__PURE__*/new Map();
	var dashCache = /*#__PURE__*/new Map();
	var prefixes = ['Webkit', 'Moz', 'O', 'ms', ''];
	var numPrefixes = prefixes.length;
	var isBrowser = typeof document !== 'undefined';
	var testElement;
	var setDashPrefix = function (key, prefixed) {
	    return dashCache.set(key, camelToDash(prefixed));
	};
	var testPrefix = function (key) {
	    testElement = testElement || document.createElement('div');
	    for (var i = 0; i < numPrefixes; i++) {
	        var prefix = prefixes[i];
	        var noPrefix = prefix === '';
	        var prefixedPropertyName = noPrefix ? key : prefix + key.charAt(0).toUpperCase() + key.slice(1);
	        if (prefixedPropertyName in testElement.style || noPrefix) {
	            camelCache.set(key, prefixedPropertyName);
	            setDashPrefix(key, "" + (noPrefix ? '' : '-') + camelToDash(prefixedPropertyName));
	        }
	    }
	};
	var setServerProperty = function (key) {
	    return setDashPrefix(key, key);
	};
	var prefixer = function (key, asDashCase) {
	    if (asDashCase === void 0) {
	        asDashCase = false;
	    }
	    var cache = asDashCase ? dashCache : camelCache;
	    if (!cache.has(key)) isBrowser ? testPrefix(key) : setServerProperty(key);
	    return cache.get(key) || key;
	};

	var axes = ['', 'X', 'Y', 'Z'];
	var order = ['scale', 'rotate', 'skew', 'transformPerspective'];
	var transformProps = /*#__PURE__*/order.reduce(function (acc, key) {
	    return axes.reduce(function (axesAcc, axesKey) {
	        axesAcc.push(key + axesKey);
	        return axesAcc;
	    }, acc);
	}, ['x', 'y', 'z']);
	var transformPropDictionary = /*#__PURE__*/transformProps.reduce(function (dict, key) {
	    dict[key] = true;
	    return dict;
	}, {});
	var isTransformProp = function (key) {
	    return transformPropDictionary[key] === true;
	};
	var sortTransformProps = function (a, b) {
	    return transformProps.indexOf(a) - transformProps.indexOf(b);
	};
	var isTransformOriginProp = function (key) {
	    return key === 'originX' || key === 'originY';
	};

	var valueTypes = {
	    color: color,
	    backgroundColor: color,
	    outlineColor: color,
	    fill: color,
	    stroke: color,
	    borderColor: color,
	    borderTopColor: color,
	    borderRightColor: color,
	    borderBottomColor: color,
	    borderLeftColor: color,
	    borderWidth: px,
	    borderTopWidth: px,
	    borderRightWidth: px,
	    borderBottomWidth: px,
	    borderLeftWidth: px,
	    borderRadius: px,
	    borderTopLeftRadius: px,
	    borderTopRightRadius: px,
	    borderBottomRightRadius: px,
	    borderBottomLeftRadius: px,
	    width: px,
	    maxWidth: px,
	    height: px,
	    maxHeight: px,
	    top: px,
	    right: px,
	    bottom: px,
	    left: px,
	    padding: px,
	    paddingTop: px,
	    paddingRight: px,
	    paddingBottom: px,
	    paddingLeft: px,
	    margin: px,
	    marginTop: px,
	    marginRight: px,
	    marginBottom: px,
	    marginLeft: px,
	    rotate: degrees,
	    rotateX: degrees,
	    rotateY: degrees,
	    rotateZ: degrees,
	    scale: scale,
	    scaleX: scale,
	    scaleY: scale,
	    scaleZ: scale,
	    skew: degrees,
	    skewX: degrees,
	    skewY: degrees,
	    distance: px,
	    x: px,
	    y: px,
	    z: px,
	    perspective: px,
	    opacity: alpha,
	    originX: percent,
	    originY: percent,
	    originZ: px
	};
	var getValueType = function (key) {
	    return valueTypes[key];
	};

	var SCROLL_LEFT = 'scrollLeft';
	var SCROLL_TOP = 'scrollTop';
	var scrollKeys = /*#__PURE__*/new Set([SCROLL_LEFT, SCROLL_TOP]);

	var blacklist = /*#__PURE__*/new Set([SCROLL_LEFT, SCROLL_TOP, 'transform']);
	var aliasMap = {
	    x: 'translateX',
	    y: 'translateY',
	    z: 'translateZ'
	};
	var isCustomTemplate = function (v) {
	    return typeof v === 'function';
	};
	var buildStyleProperty = function (state, enableHardwareAcceleration, styles, transform, transformOrigin, transformKeys, isDashCase) {
	    if (enableHardwareAcceleration === void 0) {
	        enableHardwareAcceleration = true;
	    }
	    if (styles === void 0) {
	        styles = {};
	    }
	    if (transform === void 0) {
	        transform = {};
	    }
	    if (transformOrigin === void 0) {
	        transformOrigin = {};
	    }
	    if (transformKeys === void 0) {
	        transformKeys = [];
	    }
	    if (isDashCase === void 0) {
	        isDashCase = false;
	    }
	    var transformIsDefault = true;
	    var hasTransform = false;
	    var hasTransformOrigin = false;
	    for (var key in state) {
	        var value = state[key];
	        var valueType = getValueType(key);
	        var valueAsType = typeof value === 'number' && valueType ? valueType.transform(value) : value;
	        if (isTransformProp(key)) {
	            hasTransform = true;
	            transform[key] = valueAsType;
	            transformKeys.push(key);
	            if (transformIsDefault) {
	                if (valueType.default && value !== valueType.default || !valueType.default && value !== 0) {
	                    transformIsDefault = false;
	                }
	            }
	        } else if (isTransformOriginProp(key)) {
	            transformOrigin[key] = valueAsType;
	            hasTransformOrigin = true;
	        } else if (!blacklist.has(key) || !isCustomTemplate(valueAsType)) {
	            styles[prefixer(key, isDashCase)] = valueAsType;
	        }
	    }
	    if (!transformIsDefault) {
	        var transformString = '';
	        if (isCustomTemplate(state.transform)) {
	            transformString = state.transform(transform);
	        } else {
	            var transformHasZ = false;
	            transformKeys.sort(sortTransformProps);
	            var numTransformKeys = transformKeys.length;
	            for (var i = 0; i < numTransformKeys; i++) {
	                var key = transformKeys[i];
	                transformString += (aliasMap[key] || key) + "(" + transform[key] + ") ";
	                transformHasZ = key === 'z' ? true : transformHasZ;
	            }
	            if (!transformHasZ && enableHardwareAcceleration) {
	                transformString += 'translateZ(0)';
	            } else {
	                transformString = transformString.trim();
	            }
	        }
	        styles.transform = transformString;
	    } else if (hasTransform) {
	        styles.transform = 'none';
	    }
	    if (hasTransformOrigin) {
	        styles.transformOrigin = (transformOrigin.originX || 0) + " " + (transformOrigin.originY || 0) + " " + (transformOrigin.originZ || 0);
	    }
	    return styles;
	};
	var createStyleBuilder = function (enableHardwareAcceleration) {
	    if (enableHardwareAcceleration === void 0) {
	        enableHardwareAcceleration = true;
	    }
	    var styles = {};
	    var transform = {};
	    var transformOrigin = {};
	    var transformKeys = [];
	    return function (state) {
	        transformKeys.length = 0;
	        buildStyleProperty(state, enableHardwareAcceleration, styles, transform, transformOrigin, transformKeys, true);
	        return styles;
	    };
	};

	var cssStyler = /*#__PURE__*/createStyler({
	    onRead: function (key, _a) {
	        var element = _a.element,
	            preparseOutput = _a.preparseOutput;
	        var valueType = getValueType(key);
	        if (isTransformProp(key)) {
	            return valueType ? valueType.default || 0 : 0;
	        } else if (scrollKeys.has(key)) {
	            return element[key];
	        } else {
	            var domValue = window.getComputedStyle(element, null).getPropertyValue(prefixer(key, true)) || 0;
	            return preparseOutput && valueType && valueType.parse ? valueType.parse(domValue) : domValue;
	        }
	    },
	    onRender: function (state, _a, changedValues) {
	        var element = _a.element,
	            buildStyles = _a.buildStyles;
	        Object.assign(element.style, buildStyles(state));
	        if (changedValues.indexOf(SCROLL_LEFT) !== -1) element.scrollLeft = state.scrollLeft;
	        if (changedValues.indexOf(SCROLL_TOP) !== -1) element.scrollTop = state.scrollTop;
	    },
	    uncachedValues: scrollKeys
	});
	var css = function (element, _a) {
	    if (_a === void 0) {
	        _a = {};
	    }
	    var enableHardwareAcceleration = _a.enableHardwareAcceleration,
	        props = __rest$1(_a, ["enableHardwareAcceleration"]);
	    return cssStyler(__assign$3({ element: element, buildStyles: createStyleBuilder(enableHardwareAcceleration), preparseOutput: true }, props));
	};

	var ZERO_NOT_ZERO = 0.0000001;
	var percentToPixels = function (percent$$1, length) {
	    return percent$$1 / 100 * length + 'px';
	};
	var build = function (state, dimensions, isPath, pathLength) {
	    var hasTransform = false;
	    var hasDashArray = false;
	    var props = {};
	    var dashArrayStyles = isPath ? {
	        pathLength: '0',
	        pathSpacing: "" + pathLength
	    } : undefined;
	    var scale$$1 = state.scale !== undefined ? state.scale || ZERO_NOT_ZERO : state.scaleX || 1;
	    var scaleY = state.scaleY !== undefined ? state.scaleY || ZERO_NOT_ZERO : scale$$1 || 1;
	    var transformOriginX = dimensions.width * ((state.originX || 50) / 100) + dimensions.x;
	    var transformOriginY = dimensions.height * ((state.originY || 50) / 100) + dimensions.y;
	    var scaleTransformX = -transformOriginX * (scale$$1 * 1);
	    var scaleTransformY = -transformOriginY * (scaleY * 1);
	    var scaleReplaceX = transformOriginX / scale$$1;
	    var scaleReplaceY = transformOriginY / scaleY;
	    var transform = {
	        translate: "translate(" + state.x + ", " + state.y + ") ",
	        scale: "translate(" + scaleTransformX + ", " + scaleTransformY + ") scale(" + scale$$1 + ", " + scaleY + ") translate(" + scaleReplaceX + ", " + scaleReplaceY + ") ",
	        rotate: "rotate(" + state.rotate + ", " + transformOriginX + ", " + transformOriginY + ") ",
	        skewX: "skewX(" + state.skewX + ") ",
	        skewY: "skewY(" + state.skewY + ") "
	    };
	    for (var key in state) {
	        if (state.hasOwnProperty(key)) {
	            var value = state[key];
	            if (isTransformProp(key)) {
	                hasTransform = true;
	            } else if (isPath && (key === 'pathLength' || key === 'pathSpacing') && typeof value === 'number') {
	                hasDashArray = true;
	                dashArrayStyles[key] = percentToPixels(value, pathLength);
	            } else if (isPath && key === 'pathOffset') {
	                props['stroke-dashoffset'] = percentToPixels(-value, pathLength);
	            } else {
	                props[camelToDash(key)] = value;
	            }
	        }
	    }
	    if (hasDashArray) {
	        props['stroke-dasharray'] = dashArrayStyles.pathLength + ' ' + dashArrayStyles.pathSpacing;
	    }
	    if (hasTransform) {
	        props.transform = '';
	        for (var key in transform) {
	            if (transform.hasOwnProperty(key)) {
	                var defaultValue = key === 'scale' ? '1' : '0';
	                props.transform += transform[key].replace(/undefined/g, defaultValue);
	            }
	        }
	    }
	    return props;
	};

	var valueTypes$1 = {
	    fill: color,
	    stroke: color,
	    scale: scale,
	    scaleX: scale,
	    scaleY: scale,
	    opacity: alpha,
	    fillOpacity: alpha,
	    strokeOpacity: alpha
	};
	var getValueType$1 = function (key) {
	    return valueTypes$1[key];
	};

	var getDimensions = function (element) {
	    return typeof element.getBBox === 'function' ? element.getBBox() : element.getBoundingClientRect();
	};
	var getSVGElementDimensions = function (element) {
	    try {
	        return getDimensions(element);
	    } catch (e) {
	        return { x: 0, y: 0, width: 0, height: 0 };
	    }
	};

	var svgStyler = /*#__PURE__*/createStyler({
	    onRead: function (key, _a) {
	        var element = _a.element;
	        if (!isTransformProp(key)) {
	            return element.getAttribute(key);
	        } else {
	            var valueType = getValueType$1(key);
	            return valueType ? valueType.default : 0;
	        }
	    },
	    onRender: function (state, _a) {
	        var dimensions = _a.dimensions,
	            element = _a.element,
	            isPath = _a.isPath,
	            pathLength = _a.pathLength;
	        setDomAttrs(element, build(state, dimensions, isPath, pathLength));
	    }
	});
	var svg = function (element) {
	    var dimensions = getSVGElementDimensions(element);
	    var props = {
	        element: element,
	        dimensions: dimensions,
	        isPath: false
	    };
	    if (element.tagName === 'path') {
	        props.isPath = true;
	        props.pathLength = element.getTotalLength();
	    }
	    return svgStyler(props);
	};

	var viewport = /*#__PURE__*/createStyler({
	    useCache: false,
	    onRead: function (key) {
	        return key === 'scrollTop' ? window.pageYOffset : window.pageXOffset;
	    },
	    onRender: function (_a) {
	        var _b = _a.scrollTop,
	            scrollTop = _b === void 0 ? 0 : _b,
	            _c = _a.scrollLeft,
	            scrollLeft = _c === void 0 ? 0 : _c;
	        return window.scrollTo(scrollLeft, scrollTop);
	    }
	});

	var cache = /*#__PURE__*/new WeakMap();
	var createDOMStyler = function (node, props) {
	    var styler;
	    if (node instanceof HTMLElement) {
	        styler = css(node, props);
	    } else if (node instanceof SVGElement) {
	        styler = svg(node);
	    } else if (node === window) {
	        styler = viewport(node);
	    }
	    invariant(styler !== undefined, 'No valid node provided. Node must be HTMLElement, SVGElement or window.');
	    cache.set(node, styler);
	    return styler;
	};
	var getStyler = function (node, props) {
	    return cache.has(node) ? cache.get(node) : createDOMStyler(node, props);
	};
	function index$1(nodeOrSelector, props) {
	    var node = typeof nodeOrSelector === 'string' ? document.querySelector(nodeOrSelector) : nodeOrSelector;
	    return getStyler(node, props);
	}

	var Chainable = /*#__PURE__*/function () {
	    function Chainable(props) {
	        if (props === void 0) {
	            props = {};
	        }
	        this.props = props;
	    }
	    Chainable.prototype.applyMiddleware = function (middleware) {
	        return this.create(__assign({}, this.props, { middleware: this.props.middleware ? [middleware].concat(this.props.middleware) : [middleware] }));
	    };
	    Chainable.prototype.pipe = function () {
	        var funcs = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            funcs[_i] = arguments[_i];
	        }
	        var pipedUpdate = funcs.length === 1 ? funcs[0] : pipe.apply(void 0, funcs);
	        return this.applyMiddleware(function (update) {
	            return function (v) {
	                return update(pipedUpdate(v));
	            };
	        });
	    };
	    Chainable.prototype.while = function (predicate) {
	        return this.applyMiddleware(function (update, complete) {
	            return function (v) {
	                return predicate(v) ? update(v) : complete();
	            };
	        });
	    };
	    Chainable.prototype.filter = function (predicate) {
	        return this.applyMiddleware(function (update) {
	            return function (v) {
	                return predicate(v) && update(v);
	            };
	        });
	    };
	    return Chainable;
	}();

	var Observer = /*#__PURE__*/function () {
	    function Observer(_a, observer) {
	        var middleware = _a.middleware,
	            onComplete = _a.onComplete;
	        var _this = this;
	        this.isActive = true;
	        this.update = function (v) {
	            if (_this.observer.update) _this.updateObserver(v);
	        };
	        this.complete = function () {
	            if (_this.observer.complete && _this.isActive) _this.observer.complete();
	            if (_this.onComplete) _this.onComplete();
	            _this.isActive = false;
	        };
	        this.error = function (err) {
	            if (_this.observer.error && _this.isActive) _this.observer.error(err);
	            _this.isActive = false;
	        };
	        this.observer = observer;
	        this.updateObserver = function (v) {
	            return observer.update(v);
	        };
	        this.onComplete = onComplete;
	        if (observer.update && middleware && middleware.length) {
	            middleware.forEach(function (m) {
	                return _this.updateObserver = m(_this.updateObserver, _this.complete);
	            });
	        }
	    }
	    return Observer;
	}();
	var createObserver = function (observerCandidate, _a, onComplete) {
	    var middleware = _a.middleware;
	    if (typeof observerCandidate === 'function') {
	        return new Observer({ middleware: middleware, onComplete: onComplete }, { update: observerCandidate });
	    } else {
	        return new Observer({ middleware: middleware, onComplete: onComplete }, observerCandidate);
	    }
	};

	var Action = /*#__PURE__*/function (_super) {
	    __extends(Action, _super);
	    function Action() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    Action.prototype.create = function (props) {
	        return new Action(props);
	    };
	    Action.prototype.start = function (observerCandidate) {
	        if (observerCandidate === void 0) {
	            observerCandidate = {};
	        }
	        var isComplete = false;
	        var subscription = {
	            stop: function () {
	                return undefined;
	            }
	        };
	        var _a = this.props,
	            init = _a.init,
	            observerProps = __rest(_a, ["init"]);
	        var observer = createObserver(observerCandidate, observerProps, function () {
	            isComplete = true;
	            subscription.stop();
	        });
	        var api = init(observer);
	        subscription = api ? __assign({}, subscription, api) : subscription;
	        if (observerCandidate.registerParent) {
	            observerCandidate.registerParent(subscription);
	        }
	        if (isComplete) subscription.stop();
	        return subscription;
	    };
	    return Action;
	}(Chainable);
	var action = function (init) {
	    return new Action({ init: init });
	};

	var BaseMulticast = /*#__PURE__*/function (_super) {
	    __extends(BaseMulticast, _super);
	    function BaseMulticast() {
	        var _this = _super !== null && _super.apply(this, arguments) || this;
	        _this.subscribers = [];
	        return _this;
	    }
	    BaseMulticast.prototype.complete = function () {
	        this.subscribers.forEach(function (subscriber) {
	            return subscriber.complete();
	        });
	    };
	    BaseMulticast.prototype.error = function (err) {
	        this.subscribers.forEach(function (subscriber) {
	            return subscriber.error(err);
	        });
	    };
	    BaseMulticast.prototype.update = function (v) {
	        for (var i = 0; i < this.subscribers.length; i++) {
	            this.subscribers[i].update(v);
	        }
	    };
	    BaseMulticast.prototype.subscribe = function (observerCandidate) {
	        var _this = this;
	        var observer = createObserver(observerCandidate, this.props);
	        this.subscribers.push(observer);
	        var subscription = {
	            unsubscribe: function () {
	                var index = _this.subscribers.indexOf(observer);
	                if (index !== -1) _this.subscribers.splice(index, 1);
	            }
	        };
	        return subscription;
	    };
	    BaseMulticast.prototype.stop = function () {
	        if (this.parent) this.parent.stop();
	    };
	    BaseMulticast.prototype.registerParent = function (subscription) {
	        this.stop();
	        this.parent = subscription;
	    };
	    return BaseMulticast;
	}(Chainable);

	var Multicast = /*#__PURE__*/function (_super) {
	    __extends(Multicast, _super);
	    function Multicast() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    Multicast.prototype.create = function (props) {
	        return new Multicast(props);
	    };
	    return Multicast;
	}(BaseMulticast);
	var multicast = function () {
	    return new Multicast();
	};

	var stepProgress = function (steps, progress$$1) {
	    var segment = 1 / (steps - 1);
	    var subsegment = 1 / (2 * (steps - 1));
	    var percentProgressOfTarget = Math.min(progress$$1, 1);
	    var subsegmentProgressOfTarget = percentProgressOfTarget / subsegment;
	    var segmentProgressOfTarget = Math.floor((subsegmentProgressOfTarget + 1) / 2);
	    return segmentProgressOfTarget * segment;
	};

	var calc = /*#__PURE__*/Object.freeze({
	    angle: angle,
	    degreesToRadians: degreesToRadians,
	    distance: distance,
	    isPoint3D: isPoint3D,
	    isPoint: isPoint,
	    dilate: mix,
	    getValueFromProgress: mix,
	    pointFromAngleAndDistance: pointFromVector,
	    getProgressFromValue: progress,
	    radiansToDegrees: radiansToDegrees,
	    smooth: smoothFrame,
	    speedPerFrame: velocityPerFrame,
	    speedPerSecond: velocityPerSecond,
	    stepProgress: stepProgress
	});

	var isValueList = function (v) {
	    return Array.isArray(v);
	};
	var isSingleValue = function (v) {
	    var typeOfV = typeof v;
	    return typeOfV === 'string' || typeOfV === 'number';
	};
	var ValueReaction = /*#__PURE__*/function (_super) {
	    __extends(ValueReaction, _super);
	    function ValueReaction(props) {
	        var _this = _super.call(this, props) || this;
	        _this.scheduleVelocityCheck = function () {
	            return sync.postRender(_this.velocityCheck);
	        };
	        _this.velocityCheck = function (_a) {
	            var timestamp = _a.timestamp;
	            if (timestamp !== _this.lastUpdated) {
	                _this.prev = _this.current;
	            }
	        };
	        _this.prev = _this.current = props.value || 0;
	        if (isSingleValue(_this.current)) {
	            _this.updateCurrent = function (v) {
	                return _this.current = v;
	            };
	            _this.getVelocityOfCurrent = function () {
	                return _this.getSingleVelocity(_this.current, _this.prev);
	            };
	        } else if (isValueList(_this.current)) {
	            _this.updateCurrent = function (v) {
	                return _this.current = v.slice();
	            };
	            _this.getVelocityOfCurrent = function () {
	                return _this.getListVelocity();
	            };
	        } else {
	            _this.updateCurrent = function (v) {
	                _this.current = {};
	                for (var key in v) {
	                    if (v.hasOwnProperty(key)) {
	                        _this.current[key] = v[key];
	                    }
	                }
	            };
	            _this.getVelocityOfCurrent = function () {
	                return _this.getMapVelocity();
	            };
	        }
	        if (props.initialSubscription) _this.subscribe(props.initialSubscription);
	        return _this;
	    }
	    ValueReaction.prototype.create = function (props) {
	        return new ValueReaction(props);
	    };
	    ValueReaction.prototype.get = function () {
	        return this.current;
	    };
	    ValueReaction.prototype.getVelocity = function () {
	        return this.getVelocityOfCurrent();
	    };
	    ValueReaction.prototype.update = function (v) {
	        _super.prototype.update.call(this, v);
	        this.prev = this.current;
	        this.updateCurrent(v);
	        var _a = getFrameData(),
	            delta = _a.delta,
	            timestamp = _a.timestamp;
	        this.timeDelta = delta;
	        this.lastUpdated = timestamp;
	        sync.postRender(this.scheduleVelocityCheck);
	    };
	    ValueReaction.prototype.subscribe = function (observerCandidate) {
	        var sub = _super.prototype.subscribe.call(this, observerCandidate);
	        this.subscribers[this.subscribers.length - 1].update(this.current);
	        return sub;
	    };
	    ValueReaction.prototype.getSingleVelocity = function (current, prev) {
	        return typeof current === 'number' && typeof prev === 'number' ? velocityPerSecond(current - prev, this.timeDelta) : velocityPerSecond(parseFloat(current) - parseFloat(prev), this.timeDelta) || 0;
	    };
	    ValueReaction.prototype.getListVelocity = function () {
	        var _this = this;
	        return this.current.map(function (c, i) {
	            return _this.getSingleVelocity(c, _this.prev[i]);
	        });
	    };
	    ValueReaction.prototype.getMapVelocity = function () {
	        var velocity = {};
	        for (var key in this.current) {
	            if (this.current.hasOwnProperty(key)) {
	                velocity[key] = this.getSingleVelocity(this.current[key], this.prev[key]);
	            }
	        }
	        return velocity;
	    };
	    return ValueReaction;
	}(BaseMulticast);
	var value = function (value, initialSubscription) {
	    return new ValueReaction({ value: value, initialSubscription: initialSubscription });
	};

	var multi = function (_a) {
	    var getCount = _a.getCount,
	        getFirst = _a.getFirst,
	        getOutput = _a.getOutput,
	        mapApi = _a.mapApi,
	        setProp = _a.setProp,
	        startActions = _a.startActions;
	    return function (actions) {
	        return action(function (_a) {
	            var update = _a.update,
	                complete = _a.complete,
	                error = _a.error;
	            var numActions = getCount(actions);
	            var output = getOutput();
	            var updateOutput = function () {
	                return update(output);
	            };
	            var numCompletedActions = 0;
	            var subs = startActions(actions, function (a, name) {
	                var hasCompleted = false;
	                return a.start({
	                    complete: function () {
	                        if (!hasCompleted) {
	                            hasCompleted = true;
	                            numCompletedActions++;
	                            if (numCompletedActions === numActions) sync.update(complete);
	                        }
	                    },
	                    error: error,
	                    update: function (v) {
	                        setProp(output, name, v);
	                        sync.update(updateOutput, false, true);
	                    }
	                });
	            });
	            return Object.keys(getFirst(subs)).reduce(function (api, methodName) {
	                api[methodName] = mapApi(subs, methodName);
	                return api;
	            }, {});
	        });
	    };
	};

	var composite = /*#__PURE__*/multi({
	    getOutput: function () {
	        return {};
	    },
	    getCount: function (subs) {
	        return Object.keys(subs).length;
	    },
	    getFirst: function (subs) {
	        return subs[Object.keys(subs)[0]];
	    },
	    mapApi: function (subs, methodName) {
	        return function () {
	            var args = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                args[_i] = arguments[_i];
	            }
	            return Object.keys(subs).reduce(function (output, propKey) {
	                var _a;
	                if (subs[propKey][methodName]) {
	                    args[0] && args[0][propKey] !== undefined ? output[propKey] = subs[propKey][methodName](args[0][propKey]) : output[propKey] = (_a = subs[propKey])[methodName].apply(_a, args);
	                }
	                return output;
	            }, {});
	        };
	    },
	    setProp: function (output, name, v) {
	        return output[name] = v;
	    },
	    startActions: function (actions, starter) {
	        return Object.keys(actions).reduce(function (subs, key) {
	            subs[key] = starter(actions[key], key);
	            return subs;
	        }, {});
	    }
	});

	var parallel = /*#__PURE__*/multi({
	    getOutput: function () {
	        return [];
	    },
	    getCount: function (subs) {
	        return subs.length;
	    },
	    getFirst: function (subs) {
	        return subs[0];
	    },
	    mapApi: function (subs, methodName) {
	        return function () {
	            var args = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                args[_i] = arguments[_i];
	            }
	            return subs.map(function (sub, i) {
	                if (sub[methodName]) {
	                    return Array.isArray(args[0]) ? sub[methodName](args[0][i]) : sub[methodName].apply(sub, args);
	                }
	            });
	        };
	    },
	    setProp: function (output, name, v) {
	        return output[name] = v;
	    },
	    startActions: function (actions, starter) {
	        return actions.map(function (action, i) {
	            return starter(action, i);
	        });
	    }
	});
	var parallel$1 = function () {
	    var actions = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        actions[_i] = arguments[_i];
	    }
	    return parallel(actions);
	};

	var createVectorTests = function (typeTests) {
	    var testNames = Object.keys(typeTests);
	    var isVectorProp = function (prop, key) {
	        return prop !== undefined && !typeTests[key](prop);
	    };
	    var getVectorKeys = function (props) {
	        return testNames.reduce(function (vectorKeys, key) {
	            if (isVectorProp(props[key], key)) vectorKeys.push(key);
	            return vectorKeys;
	        }, []);
	    };
	    var testVectorProps = function (props) {
	        return props && testNames.some(function (key) {
	            return isVectorProp(props[key], key);
	        });
	    };
	    return { getVectorKeys: getVectorKeys, testVectorProps: testVectorProps };
	};
	var unitTypes = [px, percent, degrees, vh, vw];
	var findUnitType = function (prop) {
	    return unitTypes.find(function (type) {
	        return type.test(prop);
	    });
	};
	var isUnitProp = function (prop) {
	    return Boolean(findUnitType(prop));
	};
	var createAction = function (action, props) {
	    return action(props);
	};
	var reduceArrayValue = function (i) {
	    return function (props, key) {
	        props[key] = props[key][i];
	        return props;
	    };
	};
	var createArrayAction = function (action, props, vectorKeys) {
	    var firstVectorKey = vectorKeys[0];
	    var actionList = props[firstVectorKey].map(function (v, i) {
	        var childActionProps = vectorKeys.reduce(reduceArrayValue(i), __assign({}, props));
	        return getActionCreator(v)(action, childActionProps);
	    });
	    return parallel$1.apply(void 0, actionList);
	};
	var reduceObjectValue = function (key) {
	    return function (props, propKey) {
	        props[propKey] = props[propKey][key];
	        return props;
	    };
	};
	var createObjectAction = function (action, props, vectorKeys) {
	    var firstVectorKey = vectorKeys[0];
	    var actionMap = Object.keys(props[firstVectorKey]).reduce(function (map, key) {
	        var childActionProps = vectorKeys.reduce(reduceObjectValue(key), __assign({}, props));
	        map[key] = getActionCreator(props[firstVectorKey][key])(action, childActionProps);
	        return map;
	    }, {});
	    return composite(actionMap);
	};
	var createUnitAction = function (action, _a) {
	    var from = _a.from,
	        to = _a.to,
	        props = __rest(_a, ["from", "to"]);
	    var unitType = findUnitType(from) || findUnitType(to);
	    var transform = unitType.transform,
	        parse = unitType.parse;
	    return action(__assign({}, props, { from: typeof from === 'string' ? parse(from) : from, to: typeof to === 'string' ? parse(to) : to })).pipe(transform);
	};
	var createColorAction = function (action, _a) {
	    var from = _a.from,
	        to = _a.to,
	        props = __rest(_a, ["from", "to"]);
	    return action(__assign({}, props, { from: 0, to: 1 })).pipe(mixColor(from, to), color.transform);
	};
	var createComplexAction = function (action, _a) {
	    var from = _a.from,
	        to = _a.to,
	        props = __rest(_a, ["from", "to"]);
	    var valueTemplate = complex.createTransformer(from);
	    invariant(valueTemplate(from) === complex.createTransformer(to)(from), "Values '" + from + "' and '" + to + "' are of different format, or a value might have changed value type.");
	    return action(__assign({}, props, { from: 0, to: 1 })).pipe(mixArray(complex.parse(from), complex.parse(to)), valueTemplate);
	};
	var createVectorAction = function (action, typeTests) {
	    var _a = createVectorTests(typeTests),
	        testVectorProps = _a.testVectorProps,
	        getVectorKeys = _a.getVectorKeys;
	    var vectorAction = function (props) {
	        var isVector = testVectorProps(props);
	        if (!isVector) return action(props);
	        var vectorKeys = getVectorKeys(props);
	        var testKey = vectorKeys[0];
	        var testProp = props[testKey];
	        return getActionCreator(testProp)(action, props, vectorKeys);
	    };
	    return vectorAction;
	};
	var getActionCreator = function (prop) {
	    var actionCreator = createAction;
	    if (typeof prop === 'number') {
	        actionCreator = createAction;
	    } else if (Array.isArray(prop)) {
	        actionCreator = createArrayAction;
	    } else if (isUnitProp(prop)) {
	        actionCreator = createUnitAction;
	    } else if (color.test(prop)) {
	        actionCreator = createColorAction;
	    } else if (complex.test(prop)) {
	        actionCreator = createComplexAction;
	    } else if (typeof prop === 'object') {
	        actionCreator = createObjectAction;
	    }
	    return actionCreator;
	};

	var decay = function (props) {
	    if (props === void 0) {
	        props = {};
	    }
	    return action(function (_a) {
	        var complete = _a.complete,
	            update = _a.update;
	        var _b = props.velocity,
	            velocity = _b === void 0 ? 0 : _b,
	            _c = props.from,
	            from = _c === void 0 ? 0 : _c,
	            _d = props.power,
	            power = _d === void 0 ? 0.8 : _d,
	            _e = props.timeConstant,
	            timeConstant = _e === void 0 ? 350 : _e,
	            _f = props.restDelta,
	            restDelta = _f === void 0 ? 0.5 : _f,
	            modifyTarget = props.modifyTarget;
	        var elapsed = 0;
	        var amplitude = power * velocity;
	        var idealTarget = Math.round(from + amplitude);
	        var target = typeof modifyTarget === 'undefined' ? idealTarget : modifyTarget(idealTarget);
	        var process = sync.update(function (_a) {
	            var frameDelta = _a.delta;
	            elapsed += frameDelta;
	            var delta = -amplitude * Math.exp(-elapsed / timeConstant);
	            var isMoving = delta > restDelta || delta < -restDelta;
	            var current = isMoving ? target + delta : target;
	            update(current);
	            if (!isMoving) {
	                cancelSync.update(process);
	                complete();
	            }
	        }, true);
	        return {
	            stop: function () {
	                return cancelSync.update(process);
	            }
	        };
	    });
	};
	var vectorDecay = /*#__PURE__*/createVectorAction(decay, {
	    from: number.test,
	    modifyTarget: function (func) {
	        return typeof func === 'function';
	    },
	    velocity: number.test
	});

	var spring = function (props) {
	    if (props === void 0) {
	        props = {};
	    }
	    return action(function (_a) {
	        var update = _a.update,
	            complete = _a.complete;
	        var _b = props.velocity,
	            velocity = _b === void 0 ? 0.0 : _b;
	        var _c = props.from,
	            from = _c === void 0 ? 0.0 : _c,
	            _d = props.to,
	            to = _d === void 0 ? 0.0 : _d,
	            _e = props.stiffness,
	            stiffness = _e === void 0 ? 100 : _e,
	            _f = props.damping,
	            damping = _f === void 0 ? 10 : _f,
	            _g = props.mass,
	            mass = _g === void 0 ? 1.0 : _g,
	            _h = props.restSpeed,
	            restSpeed = _h === void 0 ? 0.01 : _h,
	            _j = props.restDelta,
	            restDelta = _j === void 0 ? 0.01 : _j;
	        var initialVelocity = velocity ? -(velocity / 1000) : 0.0;
	        var t = 0;
	        var delta = to - from;
	        var position = from;
	        var prevPosition = position;
	        var process = sync.update(function (_a) {
	            var timeDelta = _a.delta;
	            t += timeDelta;
	            var dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
	            var angularFreq = Math.sqrt(stiffness / mass) / 1000;
	            prevPosition = position;
	            if (dampingRatio < 1) {
	                var envelope = Math.exp(-dampingRatio * angularFreq * t);
	                var expoDecay = angularFreq * Math.sqrt(1.0 - dampingRatio * dampingRatio);
	                position = to - envelope * ((initialVelocity + dampingRatio * angularFreq * delta) / expoDecay * Math.sin(expoDecay * t) + delta * Math.cos(expoDecay * t));
	            } else {
	                var envelope = Math.exp(-angularFreq * t);
	                position = to - envelope * (delta + (initialVelocity + angularFreq * delta) * t);
	            }
	            velocity = velocityPerSecond(position - prevPosition, timeDelta);
	            var isBelowVelocityThreshold = Math.abs(velocity) <= restSpeed;
	            var isBelowDisplacementThreshold = Math.abs(to - position) <= restDelta;
	            if (isBelowVelocityThreshold && isBelowDisplacementThreshold) {
	                position = to;
	                update(position);
	                cancelSync.update(process);
	                complete();
	            } else {
	                update(position);
	            }
	        }, true);
	        return {
	            stop: function () {
	                return cancelSync.update(process);
	            }
	        };
	    });
	};
	var vectorSpring = /*#__PURE__*/createVectorAction(spring, {
	    from: number.test,
	    to: number.test,
	    stiffness: number.test,
	    damping: number.test,
	    mass: number.test,
	    velocity: number.test
	});

	var inertia = function (_a) {
	    var _b = _a.from,
	        from = _b === void 0 ? 0 : _b,
	        _c = _a.velocity,
	        velocity = _c === void 0 ? 0 : _c,
	        min = _a.min,
	        max = _a.max,
	        _d = _a.power,
	        power = _d === void 0 ? 0.8 : _d,
	        _e = _a.timeConstant,
	        timeConstant = _e === void 0 ? 700 : _e,
	        _f = _a.bounceStiffness,
	        bounceStiffness = _f === void 0 ? 500 : _f,
	        _g = _a.bounceDamping,
	        bounceDamping = _g === void 0 ? 10 : _g,
	        _h = _a.restDelta,
	        restDelta = _h === void 0 ? 1 : _h,
	        modifyTarget = _a.modifyTarget;
	    return action(function (_a) {
	        var update = _a.update,
	            complete = _a.complete;
	        var current = value(from);
	        var activeAnimation;
	        var isSpring = false;
	        var isLessThanMin = function (v) {
	            return min !== undefined && v <= min;
	        };
	        var isMoreThanMax = function (v) {
	            return max !== undefined && v >= max;
	        };
	        var isOutOfBounds = function (v) {
	            return isLessThanMin(v) || isMoreThanMax(v);
	        };
	        var isTravellingAwayFromBounds = function (v, currentVelocity) {
	            return isLessThanMin(v) && currentVelocity < 0 || isMoreThanMax(v) && currentVelocity > 0;
	        };
	        var startAnimation = function (animation, onComplete) {
	            activeAnimation && activeAnimation.stop();
	            activeAnimation = animation.start({
	                update: function (v) {
	                    return current.update(v);
	                },
	                complete: function () {
	                    complete();
	                    onComplete && onComplete();
	                }
	            });
	        };
	        var startSpring = function (props) {
	            isSpring = true;
	            startAnimation(vectorSpring(__assign({}, props, { to: isLessThanMin(props.from) ? min : max, stiffness: bounceStiffness, damping: bounceDamping, restDelta: restDelta })));
	        };
	        current.subscribe(function (v) {
	            update(v);
	            var currentVelocity = current.getVelocity();
	            if (activeAnimation && !isSpring && isTravellingAwayFromBounds(v, currentVelocity)) {
	                startSpring({ from: v, velocity: currentVelocity });
	            }
	        });
	        if (isOutOfBounds(from) && velocity === 0 || isTravellingAwayFromBounds(from, velocity)) {
	            startSpring({ from: from, velocity: velocity });
	        } else {
	            var animation = vectorDecay({
	                from: from,
	                velocity: velocity,
	                timeConstant: timeConstant,
	                power: power,
	                restDelta: isOutOfBounds(from) ? 20 : restDelta,
	                modifyTarget: modifyTarget
	            });
	            startAnimation(animation, function () {
	                var v = current.get();
	                if (isOutOfBounds(v)) {
	                    startSpring({ from: v, velocity: current.getVelocity() });
	                }
	            });
	        }
	        return {
	            stop: function () {
	                return activeAnimation && activeAnimation.stop();
	            }
	        };
	    });
	};
	var index$2 = /*#__PURE__*/createVectorAction(inertia, {
	    from: number.test,
	    velocity: number.test,
	    min: number.test,
	    max: number.test,
	    damping: number.test,
	    stiffness: number.test,
	    modifyTarget: function (func) {
	        return typeof func === 'function';
	    }
	});

	var frame$1 = function () {
	    return action(function (_a) {
	        var update = _a.update;
	        var initialTime = 0;
	        var process = sync.update(function (_a) {
	            var timestamp = _a.timestamp;
	            if (!initialTime) initialTime = timestamp;
	            update(timestamp - initialTime);
	        }, true, true);
	        return {
	            stop: function () {
	                return cancelSync.update(process);
	            }
	        };
	    });
	};

	var scrubber = function (_a) {
	    var _b = _a.from,
	        from = _b === void 0 ? 0 : _b,
	        _c = _a.to,
	        to = _c === void 0 ? 1 : _c,
	        _d = _a.ease,
	        ease = _d === void 0 ? linear : _d;
	    return action(function (_a) {
	        var update = _a.update;
	        return {
	            seek: function (progress$$1) {
	                return update(progress$$1);
	            }
	        };
	    }).pipe(ease, function (v) {
	        return mix(from, to, v);
	    });
	};
	var vectorScrubber = /*#__PURE__*/createVectorAction(scrubber, {
	    ease: function (func) {
	        return typeof func === 'function';
	    },
	    from: number.test,
	    to: number.test
	});

	var clampProgress$1 = /*#__PURE__*/clamp$1$1(0, 1);
	var tween = function (props) {
	    if (props === void 0) {
	        props = {};
	    }
	    return action(function (_a) {
	        var update = _a.update,
	            complete = _a.complete;
	        var _b = props.duration,
	            duration = _b === void 0 ? 300 : _b,
	            _c = props.ease,
	            ease = _c === void 0 ? easeOut : _c,
	            _d = props.flip,
	            flip = _d === void 0 ? 0 : _d,
	            _e = props.loop,
	            loop = _e === void 0 ? 0 : _e,
	            _f = props.yoyo,
	            yoyo = _f === void 0 ? 0 : _f;
	        var _g = props.from,
	            from = _g === void 0 ? 0 : _g,
	            _h = props.to,
	            to = _h === void 0 ? 1 : _h,
	            _j = props.elapsed,
	            elapsed = _j === void 0 ? 0 : _j,
	            _k = props.playDirection,
	            playDirection = _k === void 0 ? 1 : _k,
	            _l = props.flipCount,
	            flipCount = _l === void 0 ? 0 : _l,
	            _m = props.yoyoCount,
	            yoyoCount = _m === void 0 ? 0 : _m,
	            _o = props.loopCount,
	            loopCount = _o === void 0 ? 0 : _o;
	        var playhead = vectorScrubber({ from: from, to: to, ease: ease }).start(update);
	        var currentProgress = 0;
	        var process;
	        var isActive = false;
	        var reverseTween = function () {
	            return playDirection *= -1;
	        };
	        var isTweenComplete = function () {
	            var _a;
	            var isComplete = playDirection === 1 ? isActive && elapsed >= duration : isActive && elapsed <= 0;
	            if (!isComplete) return false;
	            if (isComplete && !loop && !flip && !yoyo) return true;
	            var isStepTaken = false;
	            if (loop && loopCount < loop) {
	                elapsed = 0;
	                loopCount++;
	                isStepTaken = true;
	            } else if (flip && flipCount < flip) {
	                elapsed = duration - elapsed;
	                _a = [to, from], from = _a[0], to = _a[1];
	                playhead = vectorScrubber({ from: from, to: to, ease: ease }).start(update);
	                flipCount++;
	                isStepTaken = true;
	            } else if (yoyo && yoyoCount < yoyo) {
	                reverseTween();
	                yoyoCount++;
	                isStepTaken = true;
	            }
	            return !isStepTaken;
	        };
	        var updateTween = function () {
	            currentProgress = clampProgress$1(progress(0, duration, elapsed));
	            playhead.seek(currentProgress);
	        };
	        var startTimer = function () {
	            isActive = true;
	            process = sync.update(function (_a) {
	                var delta = _a.delta;
	                elapsed += delta * playDirection;
	                updateTween();
	                if (isTweenComplete() && complete) {
	                    cancelSync.update(process);
	                    sync.update(complete, false, true);
	                }
	            }, true);
	        };
	        var stopTimer = function () {
	            isActive = false;
	            if (process) cancelSync.update(process);
	        };
	        startTimer();
	        return {
	            isActive: function () {
	                return isActive;
	            },
	            getElapsed: function () {
	                return clamp$1$1(0, duration, elapsed);
	            },
	            getProgress: function () {
	                return currentProgress;
	            },
	            stop: function () {
	                stopTimer();
	            },
	            pause: function () {
	                stopTimer();
	                return this;
	            },
	            resume: function () {
	                if (!isActive) startTimer();
	                return this;
	            },
	            seek: function (newProgress) {
	                elapsed = mix(0, duration, newProgress);
	                sync.update(updateTween, false, true);
	                return this;
	            },
	            reverse: function () {
	                reverseTween();
	                return this;
	            }
	        };
	    });
	};

	var clampProgress$1$1 = /*#__PURE__*/clamp$1$1(0, 1);
	var defaultEasings = function (values, easing$$1) {
	    return values.map(function () {
	        return easing$$1 || easeOut;
	    }).splice(0, values.length - 1);
	};
	var defaultTimings = function (values) {
	    var numValues = values.length;
	    return values.map(function (value, i) {
	        return i !== 0 ? i / (numValues - 1) : 0;
	    });
	};
	var interpolateScrubbers = function (input, scrubbers, update) {
	    var rangeLength = input.length;
	    var finalInputIndex = rangeLength - 1;
	    var finalScrubberIndex = finalInputIndex - 1;
	    var subs = scrubbers.map(function (scrub) {
	        return scrub.start(update);
	    });
	    return function (v) {
	        if (v <= input[0]) {
	            subs[0].seek(0);
	        }
	        if (v >= input[finalInputIndex]) {
	            subs[finalScrubberIndex].seek(1);
	        }
	        var i = 1;
	        for (; i < rangeLength; i++) {
	            if (input[i] > v || i === finalInputIndex) break;
	        }
	        var progressInRange = progress(input[i - 1], input[i], v);
	        subs[i - 1].seek(clampProgress$1$1(progressInRange));
	    };
	};
	var keyframes = function (_a) {
	    var easings = _a.easings,
	        _b = _a.ease,
	        ease = _b === void 0 ? linear : _b,
	        times = _a.times,
	        values = _a.values,
	        tweenProps = __rest(_a, ["easings", "ease", "times", "values"]);
	    easings = Array.isArray(easings) ? easings : defaultEasings(values, easings);
	    times = times || defaultTimings(values);
	    var scrubbers = easings.map(function (easing$$1, i) {
	        return vectorScrubber({
	            from: values[i],
	            to: values[i + 1],
	            ease: easing$$1
	        });
	    });
	    return tween(__assign({}, tweenProps, { ease: ease })).applyMiddleware(function (update) {
	        return interpolateScrubbers(times, scrubbers, update);
	    });
	};

	var physics = function (props) {
	    if (props === void 0) {
	        props = {};
	    }
	    return action(function (_a) {
	        var complete = _a.complete,
	            update = _a.update;
	        var _b = props.acceleration,
	            acceleration = _b === void 0 ? 0 : _b,
	            _c = props.friction,
	            friction = _c === void 0 ? 0 : _c,
	            _d = props.velocity,
	            velocity = _d === void 0 ? 0 : _d,
	            springStrength = props.springStrength,
	            to = props.to;
	        var _e = props.restSpeed,
	            restSpeed = _e === void 0 ? 0.001 : _e,
	            _f = props.from,
	            from = _f === void 0 ? 0 : _f;
	        var current = from;
	        var process = sync.update(function (_a) {
	            var delta = _a.delta;
	            var elapsed = Math.max(delta, 16);
	            if (acceleration) velocity += velocityPerFrame(acceleration, elapsed);
	            if (friction) velocity *= Math.pow(1 - friction, elapsed / 100);
	            if (springStrength !== undefined && to !== undefined) {
	                var distanceToTarget = to - current;
	                velocity += distanceToTarget * velocityPerFrame(springStrength, elapsed);
	            }
	            current += velocityPerFrame(velocity, elapsed);
	            update(current);
	            var isComplete = restSpeed !== false && (!velocity || Math.abs(velocity) <= restSpeed);
	            if (isComplete) {
	                cancelSync.update(process);
	                complete();
	            }
	        }, true);
	        return {
	            set: function (v) {
	                current = v;
	                return this;
	            },
	            setAcceleration: function (v) {
	                acceleration = v;
	                return this;
	            },
	            setFriction: function (v) {
	                friction = v;
	                return this;
	            },
	            setSpringStrength: function (v) {
	                springStrength = v;
	                return this;
	            },
	            setSpringTarget: function (v) {
	                to = v;
	                return this;
	            },
	            setVelocity: function (v) {
	                velocity = v;
	                return this;
	            },
	            stop: function () {
	                return cancelSync.update(process);
	            }
	        };
	    });
	};
	var vectorPhysics = /*#__PURE__*/createVectorAction(physics, {
	    acceleration: number.test,
	    friction: number.test,
	    velocity: number.test,
	    from: number.test,
	    to: number.test,
	    springStrength: number.test
	});

	var DEFAULT_DURATION = 300;
	var flattenTimings = function (instructions) {
	    var flatInstructions = [];
	    var lastArg = instructions[instructions.length - 1];
	    var isStaggered = typeof lastArg === 'number';
	    var staggerDelay = isStaggered ? lastArg : 0;
	    var segments = isStaggered ? instructions.slice(0, -1) : instructions;
	    var numSegments = segments.length;
	    var offset = 0;
	    segments.forEach(function (item, i) {
	        flatInstructions.push(item);
	        if (i !== numSegments - 1) {
	            var duration = item.duration || DEFAULT_DURATION;
	            offset += staggerDelay;
	            flatInstructions.push("-" + (duration - offset));
	        }
	    });
	    return flatInstructions;
	};
	var flattenArrayInstructions = function (instructions, instruction) {
	    Array.isArray(instruction) ? instructions.push.apply(instructions, flattenTimings(instruction)) : instructions.push(instruction);
	    return instructions;
	};
	var convertDefToProps = function (props, def, i) {
	    var duration = props.duration,
	        easings = props.easings,
	        times = props.times,
	        values = props.values;
	    var numValues = values.length;
	    var prevTimeTo = times[numValues - 1];
	    var timeFrom = def.at === 0 ? 0 : def.at / duration;
	    var timeTo = (def.at + def.duration) / duration;
	    if (i === 0) {
	        values.push(def.from);
	        times.push(timeFrom);
	    } else {
	        if (prevTimeTo !== timeFrom) {
	            if (def.from !== undefined) {
	                values.push(values[numValues - 1]);
	                times.push(timeFrom);
	                easings.push(linear);
	            }
	            var from = def.from !== undefined ? def.from : values[numValues - 1];
	            values.push(from);
	            times.push(timeFrom);
	            easings.push(linear);
	        } else if (def.from !== undefined) {
	            values.push(def.from);
	            times.push(timeFrom);
	            easings.push(linear);
	        }
	    }
	    values.push(def.to);
	    times.push(timeTo);
	    easings.push(def.ease || easeInOut);
	    return props;
	};
	var timeline = function (instructions, _a) {
	    var _b = _a === void 0 ? {} : _a,
	        duration = _b.duration,
	        elapsed = _b.elapsed,
	        ease = _b.ease,
	        loop = _b.loop,
	        flip = _b.flip,
	        yoyo = _b.yoyo;
	    var playhead = 0;
	    var calculatedDuration = 0;
	    var flatInstructions = instructions.reduce(flattenArrayInstructions, []);
	    var animationDefs = [];
	    flatInstructions.forEach(function (instruction) {
	        if (typeof instruction === 'string') {
	            playhead += parseFloat(instruction);
	        } else if (typeof instruction === 'number') {
	            playhead = instruction;
	        } else {
	            var def = __assign({}, instruction, { at: playhead });
	            def.duration = def.duration === undefined ? DEFAULT_DURATION : def.duration;
	            animationDefs.push(def);
	            playhead += def.duration;
	            calculatedDuration = Math.max(calculatedDuration, def.at + def.duration);
	        }
	    });
	    var tracks = {};
	    var numDefs = animationDefs.length;
	    for (var i = 0; i < numDefs; i++) {
	        var def = animationDefs[i];
	        var track = def.track;
	        if (track === undefined) {
	            throw new Error('No track defined');
	        }
	        if (!tracks.hasOwnProperty(track)) tracks[track] = [];
	        tracks[track].push(def);
	    }
	    var trackKeyframes = {};
	    for (var key in tracks) {
	        if (tracks.hasOwnProperty(key)) {
	            var keyframeProps = tracks[key].reduce(convertDefToProps, {
	                duration: calculatedDuration,
	                easings: [],
	                times: [],
	                values: []
	            });
	            trackKeyframes[key] = keyframes(__assign({}, keyframeProps, { duration: duration || calculatedDuration, ease: ease,
	                elapsed: elapsed,
	                loop: loop,
	                yoyo: yoyo,
	                flip: flip }));
	        }
	    }
	    return composite(trackKeyframes);
	};

	var listen = function (element, events, options) {
	    return action(function (_a) {
	        var update = _a.update;
	        var eventNames = events.split(' ').map(function (eventName) {
	            element.addEventListener(eventName, update, options);
	            return eventName;
	        });
	        return {
	            stop: function () {
	                return eventNames.forEach(function (eventName) {
	                    return element.removeEventListener(eventName, update, options);
	                });
	            }
	        };
	    });
	};

	var defaultPointerPos = function () {
	    return {
	        clientX: 0,
	        clientY: 0,
	        pageX: 0,
	        pageY: 0,
	        x: 0,
	        y: 0
	    };
	};
	var eventToPoint = function (e, point) {
	    if (point === void 0) {
	        point = defaultPointerPos();
	    }
	    point.clientX = point.x = e.clientX;
	    point.clientY = point.y = e.clientY;
	    point.pageX = e.pageX;
	    point.pageY = e.pageY;
	    return point;
	};

	var points = [/*#__PURE__*/defaultPointerPos()];
	var isTouchDevice = false;
	if (typeof document !== 'undefined') {
	    var updatePointsLocation = function (_a) {
	        var touches = _a.touches;
	        isTouchDevice = true;
	        var numTouches = touches.length;
	        points.length = 0;
	        for (var i = 0; i < numTouches; i++) {
	            var thisTouch = touches[i];
	            points.push(eventToPoint(thisTouch));
	        }
	    };
	    listen(document, 'touchstart touchmove', {
	        passive: true,
	        capture: true
	    }).start(updatePointsLocation);
	}
	var multitouch = function (_a) {
	    var _b = _a === void 0 ? {} : _a,
	        _c = _b.preventDefault,
	        preventDefault = _c === void 0 ? true : _c,
	        _d = _b.scale,
	        scale$$1 = _d === void 0 ? 1.0 : _d,
	        _e = _b.rotate,
	        rotate = _e === void 0 ? 0.0 : _e;
	    return action(function (_a) {
	        var update = _a.update;
	        var output = {
	            touches: points,
	            scale: scale$$1,
	            rotate: rotate
	        };
	        var initialDistance = 0.0;
	        var initialRotation = 0.0;
	        var isGesture = points.length > 1;
	        if (isGesture) {
	            var firstTouch = points[0],
	                secondTouch = points[1];
	            initialDistance = distance(firstTouch, secondTouch);
	            initialRotation = angle(firstTouch, secondTouch);
	        }
	        var updatePoint = function () {
	            if (isGesture) {
	                var firstTouch = points[0],
	                    secondTouch = points[1];
	                var newDistance = distance(firstTouch, secondTouch);
	                var newRotation = angle(firstTouch, secondTouch);
	                output.scale = scale$$1 * (newDistance / initialDistance);
	                output.rotate = rotate + (newRotation - initialRotation);
	            }
	            update(output);
	        };
	        var onMove = function (e) {
	            if (preventDefault || e.touches.length > 1) e.preventDefault();
	            sync.update(updatePoint);
	        };
	        var updateOnMove = listen(document, 'touchmove', {
	            passive: !preventDefault
	        }).start(onMove);
	        if (isTouchDevice) sync.update(updatePoint);
	        return {
	            stop: function () {
	                cancelSync.update(updatePoint);
	                updateOnMove.stop();
	            }
	        };
	    });
	};
	var getIsTouchDevice = function () {
	    return isTouchDevice;
	};

	var point = /*#__PURE__*/defaultPointerPos();
	var isMouseDevice = false;
	if (typeof document !== 'undefined') {
	    var updatePointLocation = function (e) {
	        isMouseDevice = true;
	        eventToPoint(e, point);
	    };
	    listen(document, 'mousedown mousemove', true).start(updatePointLocation);
	}
	var mouse = function (_a) {
	    var _b = (_a === void 0 ? {} : _a).preventDefault,
	        preventDefault = _b === void 0 ? true : _b;
	    return action(function (_a) {
	        var update = _a.update;
	        var updatePoint = function () {
	            return update(point);
	        };
	        var onMove = function (e) {
	            if (preventDefault) e.preventDefault();
	            sync.update(updatePoint);
	        };
	        var updateOnMove = listen(document, 'mousemove').start(onMove);
	        if (isMouseDevice) sync.update(updatePoint);
	        return {
	            stop: function () {
	                cancelSync.update(updatePoint);
	                updateOnMove.stop();
	            }
	        };
	    });
	};

	var getFirstTouch = function (_a) {
	    var firstTouch = _a[0];
	    return firstTouch;
	};
	var pointer = function (props) {
	    if (props === void 0) {
	        props = {};
	    }
	    return getIsTouchDevice() ? multitouch(props).pipe(function (_a) {
	        var touches = _a.touches;
	        return touches;
	    }, getFirstTouch) : mouse(props);
	};
	var index$1$1 = function (_a) {
	    if (_a === void 0) {
	        _a = {};
	    }
	    var x = _a.x,
	        y = _a.y,
	        props = __rest(_a, ["x", "y"]);
	    if (x !== undefined || y !== undefined) {
	        var applyXOffset_1 = applyOffset(x || 0);
	        var applyYOffset_1 = applyOffset(y || 0);
	        var delta_1 = { x: 0, y: 0 };
	        return pointer(props).pipe(function (point) {
	            delta_1.x = applyXOffset_1(point.x);
	            delta_1.y = applyYOffset_1(point.y);
	            return delta_1;
	        });
	    } else {
	        return pointer(props);
	    }
	};

	var chain = function () {
	    var actions = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        actions[_i] = arguments[_i];
	    }
	    return action(function (_a) {
	        var update = _a.update,
	            complete = _a.complete;
	        var i = 0;
	        var current;
	        var playCurrent = function () {
	            current = actions[i].start({
	                complete: function () {
	                    i++;
	                    i >= actions.length ? complete() : playCurrent();
	                },
	                update: update
	            });
	        };
	        playCurrent();
	        return {
	            stop: function () {
	                return current && current.stop();
	            }
	        };
	    });
	};

	var crossfade = function (a, b) {
	    return action(function (observer) {
	        var balance = 0;
	        var fadable = parallel$1(a, b).start(__assign({}, observer, { update: function (_a) {
	                var va = _a[0],
	                    vb = _a[1];
	                observer.update(mix(va, vb, balance));
	            } }));
	        return {
	            setBalance: function (v) {
	                return balance = v;
	            },
	            stop: function () {
	                return fadable.stop();
	            }
	        };
	    });
	};

	var delay = function (timeToDelay) {
	    return action(function (_a) {
	        var complete = _a.complete;
	        var timeout = setTimeout(complete, timeToDelay);
	        return {
	            stop: function () {
	                return clearTimeout(timeout);
	            }
	        };
	    });
	};

	var merge = function () {
	    var actions = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        actions[_i] = arguments[_i];
	    }
	    return action(function (observer) {
	        var subs = actions.map(function (thisAction) {
	            return thisAction.start(observer);
	        });
	        return {
	            stop: function () {
	                return subs.forEach(function (sub) {
	                    return sub.stop();
	                });
	            }
	        };
	    });
	};

	var schedule = function (scheduler, schedulee) {
	    return action(function (_a) {
	        var update = _a.update,
	            complete = _a.complete;
	        var latest;
	        var schedulerSub = scheduler.start({
	            update: function () {
	                return latest !== undefined && update(latest);
	            },
	            complete: complete
	        });
	        var scheduleeSub = schedulee.start({
	            update: function (v) {
	                return latest = v;
	            },
	            complete: complete
	        });
	        return {
	            stop: function () {
	                schedulerSub.stop();
	                scheduleeSub.stop();
	            }
	        };
	    });
	};

	var stagger = function (actions, interval) {
	    var intervalIsNumber = typeof interval === 'number';
	    var actionsWithDelay = actions.map(function (a, i) {
	        var timeToDelay = intervalIsNumber ? interval * i : interval(i);
	        return chain(delay(timeToDelay), a);
	    });
	    return parallel$1.apply(void 0, actionsWithDelay);
	};

	var appendUnit = function (unit) {
	    return function (v) {
	        return "" + v + unit;
	    };
	};
	var steps$2 = function (st, min, max) {
	    if (min === void 0) {
	        min = 0;
	    }
	    if (max === void 0) {
	        max = 1;
	    }
	    return function (v) {
	        var current = progress(min, max, v);
	        return mix(min, max, stepProgress(st, current));
	    };
	};
	var transformMap = function (childTransformers) {
	    return function (v) {
	        var output = __assign({}, v);
	        for (var key in childTransformers) {
	            if (childTransformers.hasOwnProperty(key)) {
	                var childTransformer = childTransformers[key];
	                output[key] = childTransformer(v[key]);
	            }
	        }
	        return output;
	    };
	};

	var transformers = /*#__PURE__*/Object.freeze({
	    applyOffset: applyOffset,
	    clamp: clamp$1$1,
	    conditional: conditional,
	    interpolate: interpolate,
	    blendArray: mixArray,
	    blendColor: mixColor,
	    pipe: pipe,
	    smooth: smooth,
	    snap: snap,
	    generateStaticSpring: springForce,
	    nonlinearSpring: springForceExpo,
	    linearSpring: springForceLinear,
	    wrap: wrap$1,
	    appendUnit: appendUnit,
	    steps: steps$2,
	    transformMap: transformMap
	});

	var css$1 = function (element, props) {
	    warning(false, 'css() is deprecated, use styler instead');
	    return index$1(element, props);
	};
	var svg$1 = function (element, props) {
	    warning(false, 'svg() is deprecated, use styler instead');
	    return index$1(element, props);
	};

	var popmotion_es = /*#__PURE__*/Object.freeze({
		valueTypes: styleValueTypes_es,
		easing: easing_es,
		action: action,
		multicast: multicast,
		value: value,
		decay: vectorDecay,
		inertia: index$2,
		keyframes: keyframes,
		everyFrame: frame$1,
		physics: vectorPhysics,
		spring: vectorSpring,
		timeline: timeline,
		tween: tween,
		listen: listen,
		pointer: index$1$1,
		mouse: mouse,
		multitouch: multitouch,
		chain: chain,
		composite: composite,
		crossfade: crossfade,
		delay: delay,
		merge: merge,
		parallel: parallel$1,
		schedule: schedule,
		stagger: stagger,
		calc: calc,
		transform: transformers,
		css: css$1,
		svg: svg$1,
		Action: Action,
		ValueReaction: ValueReaction,
		styler: index$1
	});

	var MathVec = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 *矩阵行列互换
	 *
	 * @export
	 * @template Type
	 * @param {Type[][]} arr
	 * @returns {Type[][]}
	 */
	function transformArray(arr) {
	    var newArray = new Array();
	    var raws = arr.length;
	    for (var raw = 0; raw < raws; raw++) {
	        newArray.push([]);
	        var cols = arr[raw].length;
	        for (var col = 0; col < cols; col++) {
	            newArray[raw][col] = arr[col][raw];
	        }
	    }
	    return newArray;
	}
	exports.transformArray = transformArray;
	/**
	 *遍历二维数组元素
	 *
	 * @export
	 * @template Type
	 * @param {Type[][]} arr
	 * @param {(raw: number, col: number) => void} callback
	 */
	function visitArray(arr, callback) {
	    var raws = arr.length;
	    for (var raw = 0; raw < raws; raw++) {
	        var cols = arr[raw].length;
	        for (var col = 0; col < cols; col++) {
	            callback(raw, col);
	        }
	    }
	}
	exports.visitArray = visitArray;
	/**
	 *多次执行回调函数
	 *
	 * @export
	 * @param {Function} callback
	 * @param {number} [times=1] 执行次数
	 */
	function moreFunc(callback, times) {
	    if (times === void 0) { times = 1; }
	    var count = 0;
	    var loop = function () {
	        if (count >= times) {
	            return;
	        }
	        count++;
	        callback();
	        loop();
	    };
	    loop();
	}
	exports.moreFunc = moreFunc;
	/**
	 *转为整型
	 *
	 * @export
	 * @param {*} value
	 * @returns
	 */
	function toInt(value) {
	    return parseInt(String(value));
	}
	exports.toInt = toInt;
	/**
	 *替换二维数组指定位置的值
	 *
	 * @export
	 * @template Type
	 * @param {Type[][]} arr
	 * @param
	 *   { raw: number
	 *     col: number
	 *   } pos
	 * @param {*} value
	 */
	function alterArray(arr, pos) {
	    arr[pos.raw][pos.col] = pos.value;
	}
	exports.alterArray = alterArray;
	/**
	 *PointList得到二维坐标容器
	 *
	 * @export
	 * @returns {Array<Point>}
	 */
	function PointList() {
	    return new Array();
	}
	exports.PointList = PointList;
	/**
	 *得到填充数组
	 *
	 * @export
	 * @template Type
	 * @param {Type} value
	 * @param {number} [length=1]
	 * @returns {Type[]}
	 */
	function fillArray(value, length) {
	    if (length === void 0) { length = 1; }
	    var arr = new Array();
	    for (var i = 0; i < length; i++) {
	        arr.push(value);
	    }
	    return arr;
	}
	exports.fillArray = fillArray;
	/**
	 *得到填充二维数组
	 *
	 * @export
	 * @template Type
	 * @param {Type} value
	 * @param {{ raw: number; col: number }} size
	 * @returns {Type[][]}
	 */
	function fillArraySuper(value, size) {
	    var arr = new Array();
	    for (var raw = 0; raw < size.raw; raw++) {
	        arr.push([]);
	        for (var col = 0; col < size.col; col++) {
	            arr[raw][col] = value;
	        }
	    }
	    return arr;
	}
	exports.fillArraySuper = fillArraySuper;
	/**
	 *检测一维数组是否有相邻相同数字
	 *
	 * @export
	 * @param {number[]} arr
	 * @returns {boolean} 若存在则返回ture
	 */
	function hasTwice(arr) {
	    var len = arr.length;
	    var result = false;
	    for (var i = 0; i < len - 1; i++) {
	        if (arr[i] === arr[i + 1]) {
	            result = true;
	            break;
	        }
	    }
	    return result;
	}
	exports.hasTwice = hasTwice;
	/**
	 *检测二维数组行方向是否有相邻相同数字
	 *
	 * @export
	 * @param {number[][]} map
	 * @returns {boolean} 若存在则返回ture
	 */
	function testRows(map) {
	    var result = false;
	    for (var _i = 0, map_1 = map; _i < map_1.length; _i++) {
	        var raw = map_1[_i];
	        result = hasTwice(raw);
	        if (result) {
	            break;
	        }
	    }
	    return result;
	}
	exports.testRows = testRows;
	/**
	 *检测二维数组是否有相邻相同数字
	 *
	 * @export
	 * @param {number[][]} map
	 * @returns {boolean} 若存在则返回ture
	 */
	function hasTwiceSuper(map) {
	    var resultRaw = false;
	    var resultCol = false;
	    resultRaw = testRows(map);
	    var mapTurn = transformArray(map);
	    resultCol = testRows(mapTurn);
	    return resultRaw || resultCol;
	}
	exports.hasTwiceSuper = hasTwiceSuper;
	});

	unwrapExports(MathVec);
	var MathVec_1 = MathVec.transformArray;
	var MathVec_2 = MathVec.visitArray;
	var MathVec_3 = MathVec.moreFunc;
	var MathVec_4 = MathVec.toInt;
	var MathVec_5 = MathVec.alterArray;
	var MathVec_6 = MathVec.PointList;
	var MathVec_7 = MathVec.fillArray;
	var MathVec_8 = MathVec.fillArraySuper;
	var MathVec_9 = MathVec.hasTwice;
	var MathVec_10 = MathVec.testRows;
	var MathVec_11 = MathVec.hasTwiceSuper;

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

	var lib$1 = createCommonjsModule(function (module, exports) {
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(saberCanvas);
	__export(Rect_1);
	});

	unwrapExports(lib$1);

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
	}(lib$1.Canvas));
	exports.Canvas = Canvas;
	});

	unwrapExports(Canvas_1);
	var Canvas_2 = Canvas_1.Canvas;

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
	    /**
	     * @param {number} from
	     * @param {number} to
	     * @param {{obsNode: Observable<Node> obsLabel: Observable<Label>}} block
	     * @memberof Layout
	     */
	    Layout.prototype.action = function (front, delta, block, onStop) {
	        var _this = this;
	        var props = {};
	        props.duration = 500;
	        var origin = block.pull();
	        switch (front) {
	            case 'left':
	                props.from = origin.x;
	                props.to = origin.x - delta;
	                break;
	            case 'right':
	                props.from = origin.x;
	                props.to = origin.x + delta;
	                break;
	            case 'up':
	                props.from = origin.y;
	                props.to = origin.y + delta;
	                break;
	            case 'down':
	                props.from = origin.y;
	                props.to = origin.y - delta;
	                break;
	        }
	        console.log(props);
	        if (front === 'left' || front === 'right') {
	            popmotion_es.tween(props).start(function (v) {
	                _this.Canvas.clear(origin);
	                block.pipe(function (n) { return n.setPosition(v, n.y); });
	            }).stop = onStop;
	        }
	        else {
	            popmotion_es.tween(props).start(function (v) {
	                _this.Canvas.clear(origin);
	                block.pipe(function (n) { return n.setPosition(n.y, v); });
	            }).stop = onStop;
	        }
	    };
	    /**
	     * @param {{ data: number[][]; delta: number[][] }} value
	     * @param {Front} front
	     * @memberof Layout
	     */
	    Layout.prototype.draw = function (value, front) {
	        this.Canvas.clear();
	        this.frame(value);
	        //  visitArray(value.data, (raw, col)=> {
	        //   const delta = value.delta[raw][col] * 100
	        //   switch (front) {
	        //     case 'left':
	        //       this.action('left', delta, obsNode, this.frame)
	        //       this.action('left', delta, obsLabel, this.frame)
	        //       break
	        //     case 'right':
	        //       this.action('right', delta, obsNode, this.frame)
	        //       this.action('right', delta, obsLabel, this.frame)
	        //       break
	        //     case 'up':
	        //       this.action('up', delta, obsNode, this.frame)
	        //       this.action('up', delta, obsLabel, this.frame)
	        //       break
	        //     case 'down':
	        //       this.action('down', delta, obsNode, this.frame)
	        //       this.action('down', delta, obsLabel, this.frame)
	        //       break
	        //   }
	        //  })
	    };
	    Layout.prototype.frame = function (value) {
	        var _this = this;
	        this.Canvas.clear();
	        MathVec.visitArray(value.data, function (raw, col) {
	            if (value.data[raw][col] === 0) {
	                return;
	            }
	            var obsNode = _this.Factory.getNodeObservable('blue', col * _this.edge.dx, raw * _this.edge.dy);
	            obsNode.subscribe(function (n) { return _this.Canvas.draw(n); });
	            _this.Canvas.draw(obsNode.pull());
	            var obsLabel = _this.Factory.getLabelObservable(value.data[raw][col], col * _this.edge.dx, raw * _this.edge.dy);
	            obsLabel.subscribe(function (l) { return _this.Canvas.draw(l); });
	            _this.Canvas.draw(obsLabel.pull());
	        });
	    };
	    Layout = __decorate([
	        lib.Injectable(),
	        __param(0, lib.Inject('Factory')),
	        __param(1, lib.Inject('Canvas')),
	        __metadata("design:paramtypes", [Object, Canvas_1.Canvas])
	    ], Layout);
	    return Layout;
	}());
	exports.Layout = Layout;
	});

	unwrapExports(Layout_1);
	var Layout_2 = Layout_1.Layout;

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
	 * @Last Modified time: 2018-12-29 20:43:30
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
	            _this.state = state;
	            _this.observers.forEach(function (observer) { return observer(_this.state); });
	        });
	        return this;
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

	var lib$2 = createCommonjsModule(function (module, exports) {
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(Observable_1);
	});

	unwrapExports(lib$2);

	var Factory_1 = createCommonjsModule(function (module, exports) {
	var __decorate = (commonjsGlobal && commonjsGlobal.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	Object.defineProperty(exports, "__esModule", { value: true });



	var Factory = /** @class */ (function () {
	    function Factory() {
	    }
	    Factory.prototype.getNode = function () {
	        return new lib$1.Node(50, 50);
	    };
	    Factory.prototype.getLabel = function (num) {
	        return new lib$1.Label(String(num), 30);
	    };
	    Factory.prototype.getNodeObservable = function (color, x, y) {
	        return new lib$2.Observable(this.getNode()
	            .setColor(color)
	            .setPosition(x, y));
	    };
	    Factory.prototype.getLabelObservable = function (num, x, y) {
	        return new lib$2.Observable(this.getLabel(num).setPosition(x, y));
	    };
	    Factory = __decorate([
	        lib.Injectable()
	    ], Factory);
	    return Factory;
	}());
	exports.Factory = Factory;
	});

	unwrapExports(Factory_1);
	var Factory_2 = Factory_1.Factory;

	var Data_1 = createCommonjsModule(function (module, exports) {
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
	 * @Author: AK-12
	 * @Date: 2018-11-02 17:06:17
	 * @Last Modified by: AK-12
	 * @Last Modified time: 2019-01-28 19:51:21
	 */


	/**
	 *矩阵合并算法
	 *
	 * 单例类
	 * @export
	 * @class Data
	 */
	var Data = /** @class */ (function () {
	    function Data() {
	        var _this = this;
	        /**
	         *反转回调处理矩阵
	         *
	         * @private
	         * @memberof Data
	         */
	        this.mergeSuper = function (arr, callback) {
	            var map = new Array();
	            var delta = new Array();
	            _this.__updateTimes = _this.updateTimes;
	            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
	                var raw = arr_1[_i];
	                var arrAndDelta = callback(raw);
	                map.push(arrAndDelta.arr);
	                delta.push(arrAndDelta.delta);
	            }
	            return {
	                map: map,
	                delta: delta
	            };
	        };
	        /**
	         *向左合并
	         *
	         * @private
	         * @memberof Data
	         */
	        this.mergeLeft = function (arr) {
	            var i, nextI, m;
	            var len = arr.length;
	            var delta = MathVec.fillArray(0, arr.length);
	            for (i = 0; i < len; i++) {
	                nextI = -1;
	                for (m = i + 1; m < len; m++) {
	                    if (arr[m] !== 0) {
	                        nextI = m;
	                        if (arr[i] === arr[m]) {
	                            delta[m] = m - i;
	                        }
	                        else {
	                            if (arr[i] === 0) {
	                                delta[m] = m - i;
	                            }
	                            else {
	                                delta[m] = m - i - 1;
	                            }
	                        }
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
	                        _this.updateTimes =
	                            arr[i] < _this.maxValue
	                                ? _this.updateTimes + arr[i]
	                                : _this.updateTimes + 1;
	                        arr[nextI] = 0;
	                    }
	                }
	            }
	            return {
	                arr: arr,
	                delta: delta
	            };
	        };
	        /**
	         *向右合并
	         *
	         * @private
	         * @memberof Data
	         */
	        this.mergeRight = function (arr) {
	            var arr_re = arr.slice().reverse();
	            var arrAndDelta = _this.mergeLeft(arr_re);
	            return {
	                arr: arrAndDelta.arr.slice().reverse(),
	                delta: arrAndDelta.delta.slice().reverse()
	            };
	        };
	    }
	    Data_1 = Data;
	    Data.getInstance = function () {
	        this.instance = this.instance || new Data_1();
	        return this.instance;
	    };
	    /**
	     *初始化矩阵数据
	     *
	     * @param {number} size 方阵边长
	     * @param {number} [maxValue=2048] 数字最大值
	     * @memberof Data
	     */
	    Data.prototype.init = function (size, maxValue) {
	        if (maxValue === void 0) { maxValue = 2048; }
	        this.updateTimes = 0;
	        this.__updateTimes = 0;
	        this.maxValue = maxValue;
	        this.map = MathVec.fillArraySuper(0, {
	            raw: size,
	            col: size
	        });
	        this.__map = MathVec.fillArraySuper(0, {
	            raw: size,
	            col: size
	        });
	        return this;
	    };
	    Object.defineProperty(Data.prototype, "data", {
	        /**
	         *当前矩阵
	         *
	         * @readonly
	         * @type {number[][]}
	         * @memberof Data
	         */
	        get: function () {
	            return this.map;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Data.prototype, "updateValue", {
	        /**
	         *得到updateTimes增量
	         *
	         * @readonly
	         * @type {number}
	         * @memberof Data
	         */
	        get: function () {
	            return this.updateTimes - this.__updateTimes;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Data.prototype, "score", {
	        /**
	         *分数
	         *
	         * @readonly
	         * @type {number}
	         * @memberof Data
	         */
	        get: function () {
	            return this.updateTimes;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Data.prototype, "MaxValue", {
	        /**
	         *最大值
	         *
	         * @readonly
	         * @type {number}
	         * @memberof Data
	         */
	        get: function () {
	            return this.maxValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Data.prototype, "isChanged", {
	        /**
	         *检测数据是否变动
	         *
	         * @readonly
	         * @type {boolean}
	         * @memberof Data
	         */
	        get: function () {
	            return this.__map.toString() !== this.map.toString();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Data.prototype, "result", {
	        /**
	         *获取updateTimes状态
	         *
	         * @readonly
	         * @type {boolean} 数字超过maxValue则返回true
	         * @memberof Data
	         */
	        get: function () {
	            return Boolean(Math.abs(this.updateTimes) % 2);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     *合并方向, 返回合并偏差二维数组
	     *
	     * @param {string} method
	     * @param {number[][]} [arr=this.map]
	     * @returns {Array<Array<number>>}
	     * @memberof Data
	     */
	    Data.prototype.merge = function (method, arr) {
	        var _this = this;
	        if (arr === void 0) { arr = this.map; }
	        MathVec.visitArray(this.map, function (raw, col) {
	            _this.__map[raw][col] = _this.map[raw][col];
	        });
	        var delta;
	        switch (method) {
	            case 'left':
	                {
	                    var mapAndDelta = this.mergeSuper(arr, this.mergeLeft);
	                    this.map = mapAndDelta.map;
	                    delta = mapAndDelta.delta;
	                }
	                break;
	            case 'right':
	                {
	                    var mapAndDelta = this.mergeSuper(arr, this.mergeRight);
	                    this.map = mapAndDelta.map;
	                    delta = mapAndDelta.delta;
	                }
	                break;
	            case 'up':
	                {
	                    var mapAndDelta = this.mergeSuper(MathVec.transformArray(arr), this.mergeLeft);
	                    delta = MathVec.transformArray(mapAndDelta.delta);
	                    this.map = MathVec.transformArray(mapAndDelta.map);
	                }
	                break;
	            case 'down':
	                {
	                    var mapAndDelta = this.mergeSuper(MathVec.transformArray(arr), this.mergeRight);
	                    delta = MathVec.transformArray(mapAndDelta.delta);
	                    this.map = MathVec.transformArray(mapAndDelta.map);
	                }
	                break;
	            default:
	                throw new Error('Data merge method error');
	        }
	        return {
	            data: this.data,
	            delta: delta
	        };
	    };
	    Object.defineProperty(Data.prototype, "isFull", {
	        /**
	         *检测矩阵数字是否都不为0, 若都不为0则返回true
	         *
	         * @readonly
	         * @type {boolean}
	         * @memberof Data
	         */
	        get: function () {
	            var _this = this;
	            this.hasNext = false;
	            MathVec.visitArray(this.map, function (raw, col) {
	                if (_this.map[raw][col] === 0) {
	                    _this.hasNext = true;
	                }
	            });
	            return !this.hasNext;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Data.prototype, "hasTwice", {
	        /**
	         *检测矩阵是否存在相邻相同数字, 若存在则返回ture
	         *
	         * @readonly
	         * @type {boolean}
	         * @memberof Data
	         */
	        get: function () {
	            return MathVec.hasTwiceSuper(this.map);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     *随机位置添加元素
	     *
	     * @param {number} [times=1]
	     * @returns {boolean} 返回true, 若没有空位则返回false
	     * @memberof Data
	     */
	    Data.prototype.addRand = function (times) {
	        var _this = this;
	        if (times === void 0) { times = 1; }
	        var points = MathVec.PointList();
	        MathVec.moreFunc(function () {
	            MathVec.visitArray(_this.map, function (raw, col) {
	                if (_this.map[raw][col] === 0) {
	                    points.push({ x: raw, y: col });
	                    _this.hasNext = true;
	                }
	            });
	            if (_this.hasNext) {
	                var index = MathVec.toInt(Math.random() * points.length);
	                MathVec.alterArray(_this.map, {
	                    raw: points[index].x,
	                    col: points[index].y,
	                    value: 2
	                });
	            }
	        }, times);
	        return this.hasNext;
	    };
	    var Data_1;
	    Data = Data_1 = __decorate([
	        lib.SingletonLazy,
	        lib.Injectable(),
	        __metadata("design:paramtypes", [])
	    ], Data);
	    return Data;
	}());
	exports.default = Data;
	});

	unwrapExports(Data_1);

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

	/**
	 *触摸方向执行对应回调
	 *
	 * 接口类
	 * @export
	 * @class TouchFront
	 * @implements {ITouchFront}
	 */
	var TouchFront = /** @class */ (function () {
	    /**
	     *Creates an instance of TouchFront.
	     * @param {number} [offset=100] 触摸偏移 ? 100
	     * @param {number} [delta=200] 灵敏度 ? 200
	     * @memberof TouchFront
	     */
	    function TouchFront(offset, delta) {
	        if (offset === void 0) { offset = 100; }
	        if (delta === void 0) { delta = 200; }
	        this.offset = offset;
	        this._lock = 0;
	        this.delta = delta;
	    }
	    /**
	     * subscribe
	     *
	     * @param {Function} [callbackLeft]
	     * @param {Function} [callbackRight]
	     * @param {Function} [callbackUp]
	     * @param {Function} [callbackDown]
	     * @returns {TouchFront}
	     * @memberof TouchFront
	     */
	    TouchFront.prototype.subscribe = function (callbackLeft, callbackRight, callbackUp, callbackDown) {
	        this.callbackLeft = callbackLeft;
	        this.callbackRight = callbackRight;
	        this.callbackUp = callbackUp;
	        this.callbackDown = callbackDown;
	        return this;
	    };
	    /**
	     * onStart
	     * @param {Function} callback
	     * @memberof TouchFront
	     */
	    TouchFront.prototype.onStart = function (callback) {
	        this.callbackStart = callback;
	        return this;
	    };
	    /**
	     * onUpdate
	     *
	     * @param {Function} callback
	     * @memberof TouchFront
	     */
	    TouchFront.prototype.onUpdate = function (callback) {
	        this.callbackUpdate = callback;
	        return this;
	    };
	    /**
	     * onStop
	     *
	     * @param {Function} callback
	     * @memberof TouchFront
	     */
	    TouchFront.prototype.onStop = function (callback) {
	        this.callbackStop = callback;
	        return this;
	    };
	    /**
	     *监听触摸
	     *
	     * @memberof TouchFront
	     */
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
	    /**
	     *检测偏移执行回调
	     *
	     * @private
	     * @memberof TouchFront
	     */
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
	        __metadata("design:paramtypes", [Number, Number])
	    ], TouchFront);
	    return TouchFront;
	}());
	exports.default = TouchFront;
	});

	unwrapExports(TouchFront_1);

	var main = createCommonjsModule(function (module, exports) {
	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });




	var Data_1$$1 = __importDefault(Data_1);
	var TouchFront_1$$1 = __importDefault(TouchFront_1);

	new lib.SaFactory.Container(Layout_1.Layout, Factory_1.Factory, Application_1.Application, Data_1$$1.default, TouchFront_1$$1.default, Canvas_1.Canvas).run();
	});

	var main$1 = unwrapExports(main);

	return main$1;

}());
