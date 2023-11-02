(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/.pnpm/chance@1.1.11/node_modules/chance/chance.js
  var require_chance = __commonJS({
    "node_modules/.pnpm/chance@1.1.11/node_modules/chance/chance.js"(exports, module) {
      (function() {
        var MAX_INT = 9007199254740992;
        var MIN_INT = -MAX_INT;
        var NUMBERS = "0123456789";
        var CHARS_LOWER = "abcdefghijklmnopqrstuvwxyz";
        var CHARS_UPPER = CHARS_LOWER.toUpperCase();
        var HEX_POOL = NUMBERS + "abcdef";
        function UnsupportedError(message) {
          this.name = "UnsupportedError";
          this.message = message || "This feature is not supported on this platform";
        }
        UnsupportedError.prototype = new Error();
        UnsupportedError.prototype.constructor = UnsupportedError;
        var slice = Array.prototype.slice;
        function Chance2(seed) {
          if (!(this instanceof Chance2)) {
            if (!seed) {
              seed = null;
            }
            return seed === null ? new Chance2() : new Chance2(seed);
          }
          if (typeof seed === "function") {
            this.random = seed;
            return this;
          }
          if (arguments.length) {
            this.seed = 0;
          }
          for (var i = 0; i < arguments.length; i++) {
            var seedling = 0;
            if (Object.prototype.toString.call(arguments[i]) === "[object String]") {
              for (var j = 0; j < arguments[i].length; j++) {
                var hash = 0;
                for (var k = 0; k < arguments[i].length; k++) {
                  hash = arguments[i].charCodeAt(k) + (hash << 6) + (hash << 16) - hash;
                }
                seedling += hash;
              }
            } else {
              seedling = arguments[i];
            }
            this.seed += (arguments.length - i) * seedling;
          }
          this.mt = this.mersenne_twister(this.seed);
          this.bimd5 = this.blueimp_md5();
          this.random = function() {
            return this.mt.random(this.seed);
          };
          return this;
        }
        Chance2.prototype.VERSION = "1.1.11";
        function initOptions(options, defaults) {
          options = options || {};
          if (defaults) {
            for (var i in defaults) {
              if (typeof options[i] === "undefined") {
                options[i] = defaults[i];
              }
            }
          }
          return options;
        }
        function range(size) {
          return Array.apply(null, Array(size)).map(function(_, i) {
            return i;
          });
        }
        function testRange(test, errorMessage) {
          if (test) {
            throw new RangeError(errorMessage);
          }
        }
        var base64 = function() {
          throw new Error("No Base64 encoder available.");
        };
        (function determineBase64Encoder() {
          if (typeof btoa === "function") {
            base64 = btoa;
          } else if (typeof Buffer === "function") {
            base64 = function(input) {
              return new Buffer(input).toString("base64");
            };
          }
        })();
        Chance2.prototype.bool = function(options) {
          options = initOptions(options, { likelihood: 50 });
          testRange(
            options.likelihood < 0 || options.likelihood > 100,
            "Chance: Likelihood accepts values from 0 to 100."
          );
          return this.random() * 100 < options.likelihood;
        };
        Chance2.prototype.falsy = function(options) {
          options = initOptions(options, { pool: [false, null, 0, NaN, "", void 0] });
          var pool = options.pool, index = this.integer({ min: 0, max: pool.length - 1 }), value = pool[index];
          return value;
        };
        Chance2.prototype.animal = function(options) {
          options = initOptions(options);
          if (typeof options.type !== "undefined") {
            testRange(
              !this.get("animals")[options.type.toLowerCase()],
              "Please pick from desert, ocean, grassland, forest, zoo, pets, farm."
            );
            return this.pick(this.get("animals")[options.type.toLowerCase()]);
          }
          var animalTypeArray = ["desert", "forest", "ocean", "zoo", "farm", "pet", "grassland"];
          return this.pick(this.get("animals")[this.pick(animalTypeArray)]);
        };
        Chance2.prototype.character = function(options) {
          options = initOptions(options);
          var symbols = "!@#$%^&*()[]", letters, pool;
          if (options.casing === "lower") {
            letters = CHARS_LOWER;
          } else if (options.casing === "upper") {
            letters = CHARS_UPPER;
          } else {
            letters = CHARS_LOWER + CHARS_UPPER;
          }
          if (options.pool) {
            pool = options.pool;
          } else {
            pool = "";
            if (options.alpha) {
              pool += letters;
            }
            if (options.numeric) {
              pool += NUMBERS;
            }
            if (options.symbols) {
              pool += symbols;
            }
            if (!pool) {
              pool = letters + NUMBERS + symbols;
            }
          }
          return pool.charAt(this.natural({ max: pool.length - 1 }));
        };
        Chance2.prototype.floating = function(options) {
          options = initOptions(options, { fixed: 4 });
          testRange(
            options.fixed && options.precision,
            "Chance: Cannot specify both fixed and precision."
          );
          var num;
          var fixed = Math.pow(10, options.fixed);
          var max = MAX_INT / fixed;
          var min = -max;
          testRange(
            options.min && options.fixed && options.min < min,
            "Chance: Min specified is out of range with fixed. Min should be, at least, " + min
          );
          testRange(
            options.max && options.fixed && options.max > max,
            "Chance: Max specified is out of range with fixed. Max should be, at most, " + max
          );
          options = initOptions(options, { min, max });
          num = this.integer({ min: options.min * fixed, max: options.max * fixed });
          var num_fixed = (num / fixed).toFixed(options.fixed);
          return parseFloat(num_fixed);
        };
        Chance2.prototype.integer = function(options) {
          options = initOptions(options, { min: MIN_INT, max: MAX_INT });
          testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");
          return Math.floor(this.random() * (options.max - options.min + 1) + options.min);
        };
        Chance2.prototype.natural = function(options) {
          options = initOptions(options, { min: 0, max: MAX_INT });
          if (typeof options.numerals === "number") {
            testRange(options.numerals < 1, "Chance: Numerals cannot be less than one.");
            options.min = Math.pow(10, options.numerals - 1);
            options.max = Math.pow(10, options.numerals) - 1;
          }
          testRange(options.min < 0, "Chance: Min cannot be less than zero.");
          if (options.exclude) {
            testRange(!Array.isArray(options.exclude), "Chance: exclude must be an array.");
            for (var exclusionIndex in options.exclude) {
              testRange(!Number.isInteger(options.exclude[exclusionIndex]), "Chance: exclude must be numbers.");
            }
            var random = options.min + this.natural({ max: options.max - options.min - options.exclude.length });
            var sortedExclusions = options.exclude.sort();
            for (var sortedExclusionIndex in sortedExclusions) {
              if (random < sortedExclusions[sortedExclusionIndex]) {
                break;
              }
              random++;
            }
            return random;
          }
          return this.integer(options);
        };
        Chance2.prototype.prime = function(options) {
          options = initOptions(options, { min: 0, max: 1e4 });
          testRange(options.min < 0, "Chance: Min cannot be less than zero.");
          testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");
          var lastPrime = data.primes[data.primes.length - 1];
          if (options.max > lastPrime) {
            for (var i = lastPrime + 2; i <= options.max; ++i) {
              if (this.is_prime(i)) {
                data.primes.push(i);
              }
            }
          }
          var targetPrimes = data.primes.filter(function(prime) {
            return prime >= options.min && prime <= options.max;
          });
          return this.pick(targetPrimes);
        };
        Chance2.prototype.is_prime = function(n) {
          if (n % 1 || n < 2) {
            return false;
          }
          if (n % 2 === 0) {
            return n === 2;
          }
          if (n % 3 === 0) {
            return n === 3;
          }
          var m = Math.sqrt(n);
          for (var i = 5; i <= m; i += 6) {
            if (n % i === 0 || n % (i + 2) === 0) {
              return false;
            }
          }
          return true;
        };
        Chance2.prototype.hex = function(options) {
          options = initOptions(options, { min: 0, max: MAX_INT, casing: "lower" });
          testRange(options.min < 0, "Chance: Min cannot be less than zero.");
          var integer = this.natural({ min: options.min, max: options.max });
          if (options.casing === "upper") {
            return integer.toString(16).toUpperCase();
          }
          return integer.toString(16);
        };
        Chance2.prototype.letter = function(options) {
          options = initOptions(options, { casing: "lower" });
          var pool = "abcdefghijklmnopqrstuvwxyz";
          var letter = this.character({ pool });
          if (options.casing === "upper") {
            letter = letter.toUpperCase();
          }
          return letter;
        };
        Chance2.prototype.string = function(options) {
          options = initOptions(options, { min: 5, max: 20 });
          if (options.length !== 0 && !options.length) {
            options.length = this.natural({ min: options.min, max: options.max });
          }
          testRange(options.length < 0, "Chance: Length cannot be less than zero.");
          var length = options.length, text = this.n(this.character, length, options);
          return text.join("");
        };
        function CopyToken(c) {
          this.c = c;
        }
        CopyToken.prototype = {
          substitute: function() {
            return this.c;
          }
        };
        function EscapeToken(c) {
          this.c = c;
        }
        EscapeToken.prototype = {
          substitute: function() {
            if (!/[{}\\]/.test(this.c)) {
              throw new Error('Invalid escape sequence: "\\' + this.c + '".');
            }
            return this.c;
          }
        };
        function ReplaceToken(c) {
          this.c = c;
        }
        ReplaceToken.prototype = {
          replacers: {
            "#": function(chance2) {
              return chance2.character({ pool: NUMBERS });
            },
            "A": function(chance2) {
              return chance2.character({ pool: CHARS_UPPER });
            },
            "a": function(chance2) {
              return chance2.character({ pool: CHARS_LOWER });
            }
          },
          substitute: function(chance2) {
            var replacer = this.replacers[this.c];
            if (!replacer) {
              throw new Error('Invalid replacement character: "' + this.c + '".');
            }
            return replacer(chance2);
          }
        };
        function parseTemplate(template) {
          var tokens = [];
          var mode = "identity";
          for (var i = 0; i < template.length; i++) {
            var c = template[i];
            switch (mode) {
              case "escape":
                tokens.push(new EscapeToken(c));
                mode = "identity";
                break;
              case "identity":
                if (c === "{") {
                  mode = "replace";
                } else if (c === "\\") {
                  mode = "escape";
                } else {
                  tokens.push(new CopyToken(c));
                }
                break;
              case "replace":
                if (c === "}") {
                  mode = "identity";
                } else {
                  tokens.push(new ReplaceToken(c));
                }
                break;
            }
          }
          return tokens;
        }
        Chance2.prototype.template = function(template) {
          if (!template) {
            throw new Error("Template string is required");
          }
          var self2 = this;
          return parseTemplate(template).map(function(token) {
            return token.substitute(self2);
          }).join("");
        };
        Chance2.prototype.buffer = function(options) {
          if (typeof Buffer === "undefined") {
            throw new UnsupportedError("Sorry, the buffer() function is not supported on your platform");
          }
          options = initOptions(options, { length: this.natural({ min: 5, max: 20 }) });
          testRange(options.length < 0, "Chance: Length cannot be less than zero.");
          var length = options.length;
          var content = this.n(this.character, length, options);
          return Buffer.from(content);
        };
        Chance2.prototype.capitalize = function(word) {
          return word.charAt(0).toUpperCase() + word.substr(1);
        };
        Chance2.prototype.mixin = function(obj) {
          for (var func_name in obj) {
            this[func_name] = obj[func_name];
          }
          return this;
        };
        Chance2.prototype.unique = function(fn, num, options) {
          testRange(
            typeof fn !== "function",
            "Chance: The first argument must be a function."
          );
          var comparator = function(arr2, val) {
            return arr2.indexOf(val) !== -1;
          };
          if (options) {
            comparator = options.comparator || comparator;
          }
          var arr = [], count = 0, result, MAX_DUPLICATES = num * 50, params = slice.call(arguments, 2);
          while (arr.length < num) {
            var clonedParams = JSON.parse(JSON.stringify(params));
            result = fn.apply(this, clonedParams);
            if (!comparator(arr, result)) {
              arr.push(result);
              count = 0;
            }
            if (++count > MAX_DUPLICATES) {
              throw new RangeError("Chance: num is likely too large for sample set");
            }
          }
          return arr;
        };
        Chance2.prototype.n = function(fn, n) {
          testRange(
            typeof fn !== "function",
            "Chance: The first argument must be a function."
          );
          if (typeof n === "undefined") {
            n = 1;
          }
          var i = n, arr = [], params = slice.call(arguments, 2);
          i = Math.max(0, i);
          for (null; i--; null) {
            arr.push(fn.apply(this, params));
          }
          return arr;
        };
        Chance2.prototype.pad = function(number, width, pad) {
          pad = pad || "0";
          number = number + "";
          return number.length >= width ? number : new Array(width - number.length + 1).join(pad) + number;
        };
        Chance2.prototype.pick = function(arr, count) {
          if (arr.length === 0) {
            throw new RangeError("Chance: Cannot pick() from an empty array");
          }
          if (!count || count === 1) {
            return arr[this.natural({ max: arr.length - 1 })];
          } else {
            return this.shuffle(arr).slice(0, count);
          }
        };
        Chance2.prototype.pickone = function(arr) {
          if (arr.length === 0) {
            throw new RangeError("Chance: Cannot pickone() from an empty array");
          }
          return arr[this.natural({ max: arr.length - 1 })];
        };
        Chance2.prototype.pickset = function(arr, count) {
          if (count === 0) {
            return [];
          }
          if (arr.length === 0) {
            throw new RangeError("Chance: Cannot pickset() from an empty array");
          }
          if (count < 0) {
            throw new RangeError("Chance: Count must be a positive number");
          }
          if (!count || count === 1) {
            return [this.pickone(arr)];
          } else {
            var array = arr.slice(0);
            var end = array.length;
            return this.n(function() {
              var index = this.natural({ max: --end });
              var value = array[index];
              array[index] = array[end];
              return value;
            }, Math.min(end, count));
          }
        };
        Chance2.prototype.shuffle = function(arr) {
          var new_array = [], j = 0, length = Number(arr.length), source_indexes = range(length), last_source_index = length - 1, selected_source_index;
          for (var i = 0; i < length; i++) {
            selected_source_index = this.natural({ max: last_source_index });
            j = source_indexes[selected_source_index];
            new_array[i] = arr[j];
            source_indexes[selected_source_index] = source_indexes[last_source_index];
            last_source_index -= 1;
          }
          return new_array;
        };
        Chance2.prototype.weighted = function(arr, weights, trim) {
          if (arr.length !== weights.length) {
            throw new RangeError("Chance: Length of array and weights must match");
          }
          var sum = 0;
          var val;
          for (var weightIndex = 0; weightIndex < weights.length; ++weightIndex) {
            val = weights[weightIndex];
            if (isNaN(val)) {
              throw new RangeError("Chance: All weights must be numbers");
            }
            if (val > 0) {
              sum += val;
            }
          }
          if (sum === 0) {
            throw new RangeError("Chance: No valid entries in array weights");
          }
          var selected = this.random() * sum;
          var total = 0;
          var lastGoodIdx = -1;
          var chosenIdx;
          for (weightIndex = 0; weightIndex < weights.length; ++weightIndex) {
            val = weights[weightIndex];
            total += val;
            if (val > 0) {
              if (selected <= total) {
                chosenIdx = weightIndex;
                break;
              }
              lastGoodIdx = weightIndex;
            }
            if (weightIndex === weights.length - 1) {
              chosenIdx = lastGoodIdx;
            }
          }
          var chosen = arr[chosenIdx];
          trim = typeof trim === "undefined" ? false : trim;
          if (trim) {
            arr.splice(chosenIdx, 1);
            weights.splice(chosenIdx, 1);
          }
          return chosen;
        };
        Chance2.prototype.paragraph = function(options) {
          options = initOptions(options);
          var sentences = options.sentences || this.natural({ min: 3, max: 7 }), sentence_array = this.n(this.sentence, sentences), separator = options.linebreak === true ? "\n" : " ";
          return sentence_array.join(separator);
        };
        Chance2.prototype.sentence = function(options) {
          options = initOptions(options);
          var words = options.words || this.natural({ min: 12, max: 18 }), punctuation = options.punctuation, text, word_array = this.n(this.word, words);
          text = word_array.join(" ");
          text = this.capitalize(text);
          if (punctuation !== false && !/^[.?;!:]$/.test(punctuation)) {
            punctuation = ".";
          }
          if (punctuation) {
            text += punctuation;
          }
          return text;
        };
        Chance2.prototype.syllable = function(options) {
          options = initOptions(options);
          var length = options.length || this.natural({ min: 2, max: 3 }), consonants = "bcdfghjklmnprstvwz", vowels = "aeiou", all = consonants + vowels, text = "", chr;
          for (var i = 0; i < length; i++) {
            if (i === 0) {
              chr = this.character({ pool: all });
            } else if (consonants.indexOf(chr) === -1) {
              chr = this.character({ pool: consonants });
            } else {
              chr = this.character({ pool: vowels });
            }
            text += chr;
          }
          if (options.capitalize) {
            text = this.capitalize(text);
          }
          return text;
        };
        Chance2.prototype.word = function(options) {
          options = initOptions(options);
          testRange(
            options.syllables && options.length,
            "Chance: Cannot specify both syllables AND length."
          );
          var syllables = options.syllables || this.natural({ min: 1, max: 3 }), text = "";
          if (options.length) {
            do {
              text += this.syllable();
            } while (text.length < options.length);
            text = text.substring(0, options.length);
          } else {
            for (var i = 0; i < syllables; i++) {
              text += this.syllable();
            }
          }
          if (options.capitalize) {
            text = this.capitalize(text);
          }
          return text;
        };
        Chance2.prototype.age = function(options) {
          options = initOptions(options);
          var ageRange;
          switch (options.type) {
            case "child":
              ageRange = { min: 0, max: 12 };
              break;
            case "teen":
              ageRange = { min: 13, max: 19 };
              break;
            case "adult":
              ageRange = { min: 18, max: 65 };
              break;
            case "senior":
              ageRange = { min: 65, max: 100 };
              break;
            case "all":
              ageRange = { min: 0, max: 100 };
              break;
            default:
              ageRange = { min: 18, max: 65 };
              break;
          }
          return this.natural(ageRange);
        };
        Chance2.prototype.birthday = function(options) {
          var age = this.age(options);
          var now = /* @__PURE__ */ new Date();
          var currentYear = now.getFullYear();
          if (options && options.type) {
            var min = /* @__PURE__ */ new Date();
            var max = /* @__PURE__ */ new Date();
            min.setFullYear(currentYear - age - 1);
            max.setFullYear(currentYear - age);
            options = initOptions(options, {
              min,
              max
            });
          } else if (options && (options.minAge !== void 0 || options.maxAge !== void 0)) {
            testRange(options.minAge < 0, "Chance: MinAge cannot be less than zero.");
            testRange(options.minAge > options.maxAge, "Chance: MinAge cannot be greater than MaxAge.");
            var minAge = options.minAge !== void 0 ? options.minAge : 0;
            var maxAge = options.maxAge !== void 0 ? options.maxAge : 100;
            var minDate = new Date(currentYear - maxAge - 1, now.getMonth(), now.getDate());
            var maxDate = new Date(currentYear - minAge, now.getMonth(), now.getDate());
            minDate.setDate(minDate.getDate() + 1);
            maxDate.setDate(maxDate.getDate() + 1);
            maxDate.setMilliseconds(maxDate.getMilliseconds() - 1);
            options = initOptions(options, {
              min: minDate,
              max: maxDate
            });
          } else {
            options = initOptions(options, {
              year: currentYear - age
            });
          }
          return this.date(options);
        };
        Chance2.prototype.cpf = function(options) {
          options = initOptions(options, {
            formatted: true
          });
          var n = this.n(this.natural, 9, { max: 9 });
          var d1 = n[8] * 2 + n[7] * 3 + n[6] * 4 + n[5] * 5 + n[4] * 6 + n[3] * 7 + n[2] * 8 + n[1] * 9 + n[0] * 10;
          d1 = 11 - d1 % 11;
          if (d1 >= 10) {
            d1 = 0;
          }
          var d2 = d1 * 2 + n[8] * 3 + n[7] * 4 + n[6] * 5 + n[5] * 6 + n[4] * 7 + n[3] * 8 + n[2] * 9 + n[1] * 10 + n[0] * 11;
          d2 = 11 - d2 % 11;
          if (d2 >= 10) {
            d2 = 0;
          }
          var cpf = "" + n[0] + n[1] + n[2] + "." + n[3] + n[4] + n[5] + "." + n[6] + n[7] + n[8] + "-" + d1 + d2;
          return options.formatted ? cpf : cpf.replace(/\D/g, "");
        };
        Chance2.prototype.cnpj = function(options) {
          options = initOptions(options, {
            formatted: true
          });
          var n = this.n(this.natural, 12, { max: 12 });
          var d1 = n[11] * 2 + n[10] * 3 + n[9] * 4 + n[8] * 5 + n[7] * 6 + n[6] * 7 + n[5] * 8 + n[4] * 9 + n[3] * 2 + n[2] * 3 + n[1] * 4 + n[0] * 5;
          d1 = 11 - d1 % 11;
          if (d1 < 2) {
            d1 = 0;
          }
          var d2 = d1 * 2 + n[11] * 3 + n[10] * 4 + n[9] * 5 + n[8] * 6 + n[7] * 7 + n[6] * 8 + n[5] * 9 + n[4] * 2 + n[3] * 3 + n[2] * 4 + n[1] * 5 + n[0] * 6;
          d2 = 11 - d2 % 11;
          if (d2 < 2) {
            d2 = 0;
          }
          var cnpj = "" + n[0] + n[1] + "." + n[2] + n[3] + n[4] + "." + n[5] + n[6] + n[7] + "/" + n[8] + n[9] + n[10] + n[11] + "-" + d1 + d2;
          return options.formatted ? cnpj : cnpj.replace(/\D/g, "");
        };
        Chance2.prototype.first = function(options) {
          options = initOptions(options, { gender: this.gender(), nationality: "en" });
          return this.pick(this.get("firstNames")[options.gender.toLowerCase()][options.nationality.toLowerCase()]);
        };
        Chance2.prototype.profession = function(options) {
          options = initOptions(options);
          if (options.rank) {
            return this.pick(["Apprentice ", "Junior ", "Senior ", "Lead "]) + this.pick(this.get("profession"));
          } else {
            return this.pick(this.get("profession"));
          }
        };
        Chance2.prototype.company = function() {
          return this.pick(this.get("company"));
        };
        Chance2.prototype.gender = function(options) {
          options = initOptions(options, { extraGenders: [] });
          return this.pick(["Male", "Female"].concat(options.extraGenders));
        };
        Chance2.prototype.last = function(options) {
          options = initOptions(options, { nationality: "*" });
          if (options.nationality === "*") {
            var allLastNames = [];
            var lastNames = this.get("lastNames");
            Object.keys(lastNames).forEach(function(key) {
              allLastNames = allLastNames.concat(lastNames[key]);
            });
            return this.pick(allLastNames);
          } else {
            return this.pick(this.get("lastNames")[options.nationality.toLowerCase()]);
          }
        };
        Chance2.prototype.israelId = function() {
          var x = this.string({ pool: "0123456789", length: 8 });
          var y = 0;
          for (var i = 0; i < x.length; i++) {
            var thisDigit = x[i] * (i / 2 === parseInt(i / 2) ? 1 : 2);
            thisDigit = this.pad(thisDigit, 2).toString();
            thisDigit = parseInt(thisDigit[0]) + parseInt(thisDigit[1]);
            y = y + thisDigit;
          }
          x = x + (10 - parseInt(y.toString().slice(-1))).toString().slice(-1);
          return x;
        };
        Chance2.prototype.mrz = function(options) {
          var checkDigit = function(input) {
            var alpha = "<ABCDEFGHIJKLMNOPQRSTUVWXYXZ".split(""), multipliers = [7, 3, 1], runningTotal = 0;
            if (typeof input !== "string") {
              input = input.toString();
            }
            input.split("").forEach(function(character, idx) {
              var pos = alpha.indexOf(character);
              if (pos !== -1) {
                character = pos === 0 ? 0 : pos + 9;
              } else {
                character = parseInt(character, 10);
              }
              character *= multipliers[idx % multipliers.length];
              runningTotal += character;
            });
            return runningTotal % 10;
          };
          var generate = function(opts) {
            var pad = function(length) {
              return new Array(length + 1).join("<");
            };
            var number = [
              "P<",
              opts.issuer,
              opts.last.toUpperCase(),
              "<<",
              opts.first.toUpperCase(),
              pad(39 - (opts.last.length + opts.first.length + 2)),
              opts.passportNumber,
              checkDigit(opts.passportNumber),
              opts.nationality,
              opts.dob,
              checkDigit(opts.dob),
              opts.gender,
              opts.expiry,
              checkDigit(opts.expiry),
              pad(14),
              checkDigit(pad(14))
            ].join("");
            return number + checkDigit(number.substr(44, 10) + number.substr(57, 7) + number.substr(65, 7));
          };
          var that = this;
          options = initOptions(options, {
            first: this.first(),
            last: this.last(),
            passportNumber: this.integer({ min: 1e8, max: 999999999 }),
            dob: function() {
              var date = that.birthday({ type: "adult" });
              return [
                date.getFullYear().toString().substr(2),
                that.pad(date.getMonth() + 1, 2),
                that.pad(date.getDate(), 2)
              ].join("");
            }(),
            expiry: function() {
              var date = /* @__PURE__ */ new Date();
              return [
                (date.getFullYear() + 5).toString().substr(2),
                that.pad(date.getMonth() + 1, 2),
                that.pad(date.getDate(), 2)
              ].join("");
            }(),
            gender: this.gender() === "Female" ? "F" : "M",
            issuer: "GBR",
            nationality: "GBR"
          });
          return generate(options);
        };
        Chance2.prototype.name = function(options) {
          options = initOptions(options);
          var first = this.first(options), last = this.last(options), name;
          if (options.middle) {
            name = first + " " + this.first(options) + " " + last;
          } else if (options.middle_initial) {
            name = first + " " + this.character({ alpha: true, casing: "upper" }) + ". " + last;
          } else {
            name = first + " " + last;
          }
          if (options.prefix) {
            name = this.prefix(options) + " " + name;
          }
          if (options.suffix) {
            name = name + " " + this.suffix(options);
          }
          return name;
        };
        Chance2.prototype.name_prefixes = function(gender) {
          gender = gender || "all";
          gender = gender.toLowerCase();
          var prefixes = [
            { name: "Doctor", abbreviation: "Dr." }
          ];
          if (gender === "male" || gender === "all") {
            prefixes.push({ name: "Mister", abbreviation: "Mr." });
          }
          if (gender === "female" || gender === "all") {
            prefixes.push({ name: "Miss", abbreviation: "Miss" });
            prefixes.push({ name: "Misses", abbreviation: "Mrs." });
          }
          return prefixes;
        };
        Chance2.prototype.prefix = function(options) {
          return this.name_prefix(options);
        };
        Chance2.prototype.name_prefix = function(options) {
          options = initOptions(options, { gender: "all" });
          return options.full ? this.pick(this.name_prefixes(options.gender)).name : this.pick(this.name_prefixes(options.gender)).abbreviation;
        };
        Chance2.prototype.HIDN = function() {
          var idn_pool = "0123456789";
          var idn_chrs = "ABCDEFGHIJKLMNOPQRSTUVWXYXZ";
          var idn = "";
          idn += this.string({ pool: idn_pool, length: 6 });
          idn += this.string({ pool: idn_chrs, length: 2 });
          return idn;
        };
        Chance2.prototype.ssn = function(options) {
          options = initOptions(options, { ssnFour: false, dashes: true });
          var ssn_pool = "1234567890", ssn, dash = options.dashes ? "-" : "";
          if (!options.ssnFour) {
            ssn = this.string({ pool: ssn_pool, length: 3 }) + dash + this.string({ pool: ssn_pool, length: 2 }) + dash + this.string({ pool: ssn_pool, length: 4 });
          } else {
            ssn = this.string({ pool: ssn_pool, length: 4 });
          }
          return ssn;
        };
        Chance2.prototype.aadhar = function(options) {
          options = initOptions(options, { onlyLastFour: false, separatedByWhiteSpace: true });
          var aadhar_pool = "1234567890", aadhar, whiteSpace = options.separatedByWhiteSpace ? " " : "";
          if (!options.onlyLastFour) {
            aadhar = this.string({ pool: aadhar_pool, length: 4 }) + whiteSpace + this.string({ pool: aadhar_pool, length: 4 }) + whiteSpace + this.string({ pool: aadhar_pool, length: 4 });
          } else {
            aadhar = this.string({ pool: aadhar_pool, length: 4 });
          }
          return aadhar;
        };
        Chance2.prototype.name_suffixes = function() {
          var suffixes = [
            { name: "Doctor of Osteopathic Medicine", abbreviation: "D.O." },
            { name: "Doctor of Philosophy", abbreviation: "Ph.D." },
            { name: "Esquire", abbreviation: "Esq." },
            { name: "Junior", abbreviation: "Jr." },
            { name: "Juris Doctor", abbreviation: "J.D." },
            { name: "Master of Arts", abbreviation: "M.A." },
            { name: "Master of Business Administration", abbreviation: "M.B.A." },
            { name: "Master of Science", abbreviation: "M.S." },
            { name: "Medical Doctor", abbreviation: "M.D." },
            { name: "Senior", abbreviation: "Sr." },
            { name: "The Third", abbreviation: "III" },
            { name: "The Fourth", abbreviation: "IV" },
            { name: "Bachelor of Engineering", abbreviation: "B.E" },
            { name: "Bachelor of Technology", abbreviation: "B.TECH" }
          ];
          return suffixes;
        };
        Chance2.prototype.suffix = function(options) {
          return this.name_suffix(options);
        };
        Chance2.prototype.name_suffix = function(options) {
          options = initOptions(options);
          return options.full ? this.pick(this.name_suffixes()).name : this.pick(this.name_suffixes()).abbreviation;
        };
        Chance2.prototype.nationalities = function() {
          return this.get("nationalities");
        };
        Chance2.prototype.nationality = function() {
          var nationality = this.pick(this.nationalities());
          return nationality.name;
        };
        Chance2.prototype.zodiac = function() {
          const zodiacSymbols = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
          return this.pickone(zodiacSymbols);
        };
        Chance2.prototype.android_id = function() {
          return "APA91" + this.string({ pool: "0123456789abcefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_", length: 178 });
        };
        Chance2.prototype.apple_token = function() {
          return this.string({ pool: "abcdef1234567890", length: 64 });
        };
        Chance2.prototype.wp8_anid2 = function() {
          return base64(this.hash({ length: 32 }));
        };
        Chance2.prototype.wp7_anid = function() {
          return "A=" + this.guid().replace(/-/g, "").toUpperCase() + "&E=" + this.hash({ length: 3 }) + "&W=" + this.integer({ min: 0, max: 9 });
        };
        Chance2.prototype.bb_pin = function() {
          return this.hash({ length: 8 });
        };
        Chance2.prototype.avatar = function(options) {
          var url = null;
          var URL_BASE = "//www.gravatar.com/avatar/";
          var PROTOCOLS = {
            http: "http",
            https: "https"
          };
          var FILE_TYPES = {
            bmp: "bmp",
            gif: "gif",
            jpg: "jpg",
            png: "png"
          };
          var FALLBACKS = {
            "404": "404",
            // Return 404 if not found
            mm: "mm",
            // Mystery man
            identicon: "identicon",
            // Geometric pattern based on hash
            monsterid: "monsterid",
            // A generated monster icon
            wavatar: "wavatar",
            // A generated face
            retro: "retro",
            // 8-bit icon
            blank: "blank"
            // A transparent png
          };
          var RATINGS = {
            g: "g",
            pg: "pg",
            r: "r",
            x: "x"
          };
          var opts = {
            protocol: null,
            email: null,
            fileExtension: null,
            size: null,
            fallback: null,
            rating: null
          };
          if (!options) {
            opts.email = this.email();
            options = {};
          } else if (typeof options === "string") {
            opts.email = options;
            options = {};
          } else if (typeof options !== "object") {
            return null;
          } else if (options.constructor === "Array") {
            return null;
          }
          opts = initOptions(options, opts);
          if (!opts.email) {
            opts.email = this.email();
          }
          opts.protocol = PROTOCOLS[opts.protocol] ? opts.protocol + ":" : "";
          opts.size = parseInt(opts.size, 0) ? opts.size : "";
          opts.rating = RATINGS[opts.rating] ? opts.rating : "";
          opts.fallback = FALLBACKS[opts.fallback] ? opts.fallback : "";
          opts.fileExtension = FILE_TYPES[opts.fileExtension] ? opts.fileExtension : "";
          url = opts.protocol + URL_BASE + this.bimd5.md5(opts.email) + (opts.fileExtension ? "." + opts.fileExtension : "") + (opts.size || opts.rating || opts.fallback ? "?" : "") + (opts.size ? "&s=" + opts.size.toString() : "") + (opts.rating ? "&r=" + opts.rating : "") + (opts.fallback ? "&d=" + opts.fallback : "");
          return url;
        };
        Chance2.prototype.color = function(options) {
          function gray(value, delimiter) {
            return [value, value, value].join(delimiter || "");
          }
          function rgb(hasAlpha) {
            var rgbValue = hasAlpha ? "rgba" : "rgb";
            var alphaChannel = hasAlpha ? "," + this.floating({ min: min_alpha, max: max_alpha }) : "";
            var colorValue2 = isGrayscale ? gray(this.natural({ min: min_rgb, max: max_rgb }), ",") : this.natural({ min: min_green, max: max_green }) + "," + this.natural({ min: min_blue, max: max_blue }) + "," + this.natural({ max: 255 });
            return rgbValue + "(" + colorValue2 + alphaChannel + ")";
          }
          function hex(start, end, withHash) {
            var symbol = withHash ? "#" : "";
            var hexstring = "";
            if (isGrayscale) {
              hexstring = gray(this.pad(this.hex({ min: min_rgb, max: max_rgb }), 2));
              if (options.format === "shorthex") {
                hexstring = gray(this.hex({ min: 0, max: 15 }));
              }
            } else {
              if (options.format === "shorthex") {
                hexstring = this.pad(this.hex({ min: Math.floor(min_red / 16), max: Math.floor(max_red / 16) }), 1) + this.pad(this.hex({ min: Math.floor(min_green / 16), max: Math.floor(max_green / 16) }), 1) + this.pad(this.hex({ min: Math.floor(min_blue / 16), max: Math.floor(max_blue / 16) }), 1);
              } else if (min_red !== void 0 || max_red !== void 0 || min_green !== void 0 || max_green !== void 0 || min_blue !== void 0 || max_blue !== void 0) {
                hexstring = this.pad(this.hex({ min: min_red, max: max_red }), 2) + this.pad(this.hex({ min: min_green, max: max_green }), 2) + this.pad(this.hex({ min: min_blue, max: max_blue }), 2);
              } else {
                hexstring = this.pad(this.hex({ min: min_rgb, max: max_rgb }), 2) + this.pad(this.hex({ min: min_rgb, max: max_rgb }), 2) + this.pad(this.hex({ min: min_rgb, max: max_rgb }), 2);
              }
            }
            return symbol + hexstring;
          }
          options = initOptions(options, {
            format: this.pick(["hex", "shorthex", "rgb", "rgba", "0x", "name"]),
            grayscale: false,
            casing: "lower",
            min: 0,
            max: 255,
            min_red: void 0,
            max_red: void 0,
            min_green: void 0,
            max_green: void 0,
            min_blue: void 0,
            max_blue: void 0,
            min_alpha: 0,
            max_alpha: 1
          });
          var isGrayscale = options.grayscale;
          var min_rgb = options.min;
          var max_rgb = options.max;
          var min_red = options.min_red;
          var max_red = options.max_red;
          var min_green = options.min_green;
          var max_green = options.max_green;
          var min_blue = options.min_blue;
          var max_blue = options.max_blue;
          var min_alpha = options.min_alpha;
          var max_alpha = options.max_alpha;
          if (options.min_red === void 0) {
            min_red = min_rgb;
          }
          if (options.max_red === void 0) {
            max_red = max_rgb;
          }
          if (options.min_green === void 0) {
            min_green = min_rgb;
          }
          if (options.max_green === void 0) {
            max_green = max_rgb;
          }
          if (options.min_blue === void 0) {
            min_blue = min_rgb;
          }
          if (options.max_blue === void 0) {
            max_blue = max_rgb;
          }
          if (options.min_alpha === void 0) {
            min_alpha = 0;
          }
          if (options.max_alpha === void 0) {
            max_alpha = 1;
          }
          if (isGrayscale && min_rgb === 0 && max_rgb === 255 && min_red !== void 0 && max_red !== void 0) {
            min_rgb = (min_red + min_green + min_blue) / 3;
            max_rgb = (max_red + max_green + max_blue) / 3;
          }
          var colorValue;
          if (options.format === "hex") {
            colorValue = hex.call(this, 2, 6, true);
          } else if (options.format === "shorthex") {
            colorValue = hex.call(this, 1, 3, true);
          } else if (options.format === "rgb") {
            colorValue = rgb.call(this, false);
          } else if (options.format === "rgba") {
            colorValue = rgb.call(this, true);
          } else if (options.format === "0x") {
            colorValue = "0x" + hex.call(this, 2, 6);
          } else if (options.format === "name") {
            return this.pick(this.get("colorNames"));
          } else {
            throw new RangeError('Invalid format provided. Please provide one of "hex", "shorthex", "rgb", "rgba", "0x" or "name".');
          }
          if (options.casing === "upper") {
            colorValue = colorValue.toUpperCase();
          }
          return colorValue;
        };
        Chance2.prototype.domain = function(options) {
          options = initOptions(options);
          return this.word() + "." + (options.tld || this.tld());
        };
        Chance2.prototype.email = function(options) {
          options = initOptions(options);
          return this.word({ length: options.length }) + "@" + (options.domain || this.domain());
        };
        Chance2.prototype.fbid = function() {
          return "10000" + this.string({ pool: "1234567890", length: 11 });
        };
        Chance2.prototype.google_analytics = function() {
          var account = this.pad(this.natural({ max: 999999 }), 6);
          var property = this.pad(this.natural({ max: 99 }), 2);
          return "UA-" + account + "-" + property;
        };
        Chance2.prototype.hashtag = function() {
          return "#" + this.word();
        };
        Chance2.prototype.ip = function() {
          return this.natural({ min: 1, max: 254 }) + "." + this.natural({ max: 255 }) + "." + this.natural({ max: 255 }) + "." + this.natural({ min: 1, max: 254 });
        };
        Chance2.prototype.ipv6 = function() {
          var ip_addr = this.n(this.hash, 8, { length: 4 });
          return ip_addr.join(":");
        };
        Chance2.prototype.klout = function() {
          return this.natural({ min: 1, max: 99 });
        };
        Chance2.prototype.mac = function(options) {
          options = initOptions(options, { delimiter: ":" });
          return this.pad(this.natural({ max: 255 }).toString(16), 2) + options.delimiter + this.pad(this.natural({ max: 255 }).toString(16), 2) + options.delimiter + this.pad(this.natural({ max: 255 }).toString(16), 2) + options.delimiter + this.pad(this.natural({ max: 255 }).toString(16), 2) + options.delimiter + this.pad(this.natural({ max: 255 }).toString(16), 2) + options.delimiter + this.pad(this.natural({ max: 255 }).toString(16), 2);
        };
        Chance2.prototype.semver = function(options) {
          options = initOptions(options, { include_prerelease: true });
          var range2 = this.pickone(["^", "~", "<", ">", "<=", ">=", "="]);
          if (options.range) {
            range2 = options.range;
          }
          var prerelease = "";
          if (options.include_prerelease) {
            prerelease = this.weighted(["", "-dev", "-beta", "-alpha"], [50, 10, 5, 1]);
          }
          return range2 + this.rpg("3d10").join(".") + prerelease;
        };
        Chance2.prototype.tlds = function() {
          return ["com", "org", "edu", "gov", "co.uk", "net", "io", "ac", "ad", "ae", "af", "ag", "ai", "al", "am", "ao", "aq", "ar", "as", "at", "au", "aw", "ax", "az", "ba", "bb", "bd", "be", "bf", "bg", "bh", "bi", "bj", "bm", "bn", "bo", "br", "bs", "bt", "bv", "bw", "by", "bz", "ca", "cc", "cd", "cf", "cg", "ch", "ci", "ck", "cl", "cm", "cn", "co", "cr", "cu", "cv", "cw", "cx", "cy", "cz", "de", "dj", "dk", "dm", "do", "dz", "ec", "ee", "eg", "eh", "er", "es", "et", "eu", "fi", "fj", "fk", "fm", "fo", "fr", "ga", "gb", "gd", "ge", "gf", "gg", "gh", "gi", "gl", "gm", "gn", "gp", "gq", "gr", "gs", "gt", "gu", "gw", "gy", "hk", "hm", "hn", "hr", "ht", "hu", "id", "ie", "il", "im", "in", "io", "iq", "ir", "is", "it", "je", "jm", "jo", "jp", "ke", "kg", "kh", "ki", "km", "kn", "kp", "kr", "kw", "ky", "kz", "la", "lb", "lc", "li", "lk", "lr", "ls", "lt", "lu", "lv", "ly", "ma", "mc", "md", "me", "mg", "mh", "mk", "ml", "mm", "mn", "mo", "mp", "mq", "mr", "ms", "mt", "mu", "mv", "mw", "mx", "my", "mz", "na", "nc", "ne", "nf", "ng", "ni", "nl", "no", "np", "nr", "nu", "nz", "om", "pa", "pe", "pf", "pg", "ph", "pk", "pl", "pm", "pn", "pr", "ps", "pt", "pw", "py", "qa", "re", "ro", "rs", "ru", "rw", "sa", "sb", "sc", "sd", "se", "sg", "sh", "si", "sj", "sk", "sl", "sm", "sn", "so", "sr", "ss", "st", "su", "sv", "sx", "sy", "sz", "tc", "td", "tf", "tg", "th", "tj", "tk", "tl", "tm", "tn", "to", "tp", "tr", "tt", "tv", "tw", "tz", "ua", "ug", "uk", "us", "uy", "uz", "va", "vc", "ve", "vg", "vi", "vn", "vu", "wf", "ws", "ye", "yt", "za", "zm", "zw"];
        };
        Chance2.prototype.tld = function() {
          return this.pick(this.tlds());
        };
        Chance2.prototype.twitter = function() {
          return "@" + this.word();
        };
        Chance2.prototype.url = function(options) {
          options = initOptions(options, { protocol: "http", domain: this.domain(options), domain_prefix: "", path: this.word(), extensions: [] });
          var extension = options.extensions.length > 0 ? "." + this.pick(options.extensions) : "";
          var domain = options.domain_prefix ? options.domain_prefix + "." + options.domain : options.domain;
          return options.protocol + "://" + domain + "/" + options.path + extension;
        };
        Chance2.prototype.port = function() {
          return this.integer({ min: 0, max: 65535 });
        };
        Chance2.prototype.locale = function(options) {
          options = initOptions(options);
          if (options.region) {
            return this.pick(this.get("locale_regions"));
          } else {
            return this.pick(this.get("locale_languages"));
          }
        };
        Chance2.prototype.locales = function(options) {
          options = initOptions(options);
          if (options.region) {
            return this.get("locale_regions");
          } else {
            return this.get("locale_languages");
          }
        };
        Chance2.prototype.loremPicsum = function(options) {
          options = initOptions(options, { width: 500, height: 500, greyscale: false, blurred: false });
          var greyscale = options.greyscale ? "g/" : "";
          var query = options.blurred ? "/?blur" : "/?random";
          return "https://picsum.photos/" + greyscale + options.width + "/" + options.height + query;
        };
        Chance2.prototype.address = function(options) {
          options = initOptions(options);
          return this.natural({ min: 5, max: 2e3 }) + " " + this.street(options);
        };
        Chance2.prototype.altitude = function(options) {
          options = initOptions(options, { fixed: 5, min: 0, max: 8848 });
          return this.floating({
            min: options.min,
            max: options.max,
            fixed: options.fixed
          });
        };
        Chance2.prototype.areacode = function(options) {
          options = initOptions(options, { parens: true });
          var areacode = options.exampleNumber ? "555" : this.natural({ min: 2, max: 9 }).toString() + this.natural({ min: 0, max: 8 }).toString() + this.natural({ min: 0, max: 9 }).toString();
          return options.parens ? "(" + areacode + ")" : areacode;
        };
        Chance2.prototype.city = function() {
          return this.capitalize(this.word({ syllables: 3 }));
        };
        Chance2.prototype.coordinates = function(options) {
          return this.latitude(options) + ", " + this.longitude(options);
        };
        Chance2.prototype.countries = function() {
          return this.get("countries");
        };
        Chance2.prototype.country = function(options) {
          options = initOptions(options);
          var country = this.pick(this.countries());
          return options.raw ? country : options.full ? country.name : country.abbreviation;
        };
        Chance2.prototype.depth = function(options) {
          options = initOptions(options, { fixed: 5, min: -10994, max: 0 });
          return this.floating({
            min: options.min,
            max: options.max,
            fixed: options.fixed
          });
        };
        Chance2.prototype.geohash = function(options) {
          options = initOptions(options, { length: 7 });
          return this.string({ length: options.length, pool: "0123456789bcdefghjkmnpqrstuvwxyz" });
        };
        Chance2.prototype.geojson = function(options) {
          return this.latitude(options) + ", " + this.longitude(options) + ", " + this.altitude(options);
        };
        Chance2.prototype.latitude = function(options) {
          var [DDM, DMS, DD] = ["ddm", "dms", "dd"];
          options = initOptions(
            options,
            options && options.format && [DDM, DMS].includes(options.format.toLowerCase()) ? { min: 0, max: 89, fixed: 4 } : { fixed: 5, min: -90, max: 90, format: DD }
          );
          var format = options.format.toLowerCase();
          if (format === DDM || format === DMS) {
            testRange(options.min < 0 || options.min > 89, "Chance: Min specified is out of range. Should be between 0 - 89");
            testRange(options.max < 0 || options.max > 89, "Chance: Max specified is out of range. Should be between 0 - 89");
            testRange(options.fixed > 4, "Chance: Fixed specified should be below or equal to 4");
          }
          switch (format) {
            case DDM: {
              return this.integer({ min: options.min, max: options.max }) + "\xB0" + this.floating({ min: 0, max: 59, fixed: options.fixed });
            }
            case DMS: {
              return this.integer({ min: options.min, max: options.max }) + "\xB0" + this.integer({ min: 0, max: 59 }) + "\u2019" + this.floating({ min: 0, max: 59, fixed: options.fixed }) + "\u201D";
            }
            case DD:
            default: {
              return this.floating({ min: options.min, max: options.max, fixed: options.fixed });
            }
          }
        };
        Chance2.prototype.longitude = function(options) {
          var [DDM, DMS, DD] = ["ddm", "dms", "dd"];
          options = initOptions(
            options,
            options && options.format && [DDM, DMS].includes(options.format.toLowerCase()) ? { min: 0, max: 179, fixed: 4 } : { fixed: 5, min: -180, max: 180, format: DD }
          );
          var format = options.format.toLowerCase();
          if (format === DDM || format === DMS) {
            testRange(options.min < 0 || options.min > 179, "Chance: Min specified is out of range. Should be between 0 - 179");
            testRange(options.max < 0 || options.max > 179, "Chance: Max specified is out of range. Should be between 0 - 179");
            testRange(options.fixed > 4, "Chance: Fixed specified should be below or equal to 4");
          }
          switch (format) {
            case DDM: {
              return this.integer({ min: options.min, max: options.max }) + "\xB0" + this.floating({ min: 0, max: 59.9999, fixed: options.fixed });
            }
            case DMS: {
              return this.integer({ min: options.min, max: options.max }) + "\xB0" + this.integer({ min: 0, max: 59 }) + "\u2019" + this.floating({ min: 0, max: 59.9999, fixed: options.fixed }) + "\u201D";
            }
            case DD:
            default: {
              return this.floating({ min: options.min, max: options.max, fixed: options.fixed });
            }
          }
        };
        Chance2.prototype.phone = function(options) {
          var self2 = this, numPick, ukNum = function(parts) {
            var section = [];
            parts.sections.forEach(function(n) {
              section.push(self2.string({ pool: "0123456789", length: n }));
            });
            return parts.area + section.join(" ");
          };
          options = initOptions(options, {
            formatted: true,
            country: "us",
            mobile: false,
            exampleNumber: false
          });
          if (!options.formatted) {
            options.parens = false;
          }
          var phone;
          switch (options.country) {
            case "fr":
              if (!options.mobile) {
                numPick = this.pick([
                  // Valid zone and département codes.
                  "01" + this.pick(["30", "34", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "53", "55", "56", "58", "60", "64", "69", "70", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83"]) + self2.string({ pool: "0123456789", length: 6 }),
                  "02" + this.pick(["14", "18", "22", "23", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "40", "41", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "56", "57", "61", "62", "69", "72", "76", "77", "78", "85", "90", "96", "97", "98", "99"]) + self2.string({ pool: "0123456789", length: 6 }),
                  "03" + this.pick(["10", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "39", "44", "45", "51", "52", "54", "55", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90"]) + self2.string({ pool: "0123456789", length: 6 }),
                  "04" + this.pick(["11", "13", "15", "20", "22", "26", "27", "30", "32", "34", "37", "42", "43", "44", "50", "56", "57", "63", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "88", "89", "90", "91", "92", "93", "94", "95", "97", "98"]) + self2.string({ pool: "0123456789", length: 6 }),
                  "05" + this.pick(["08", "16", "17", "19", "24", "31", "32", "33", "34", "35", "40", "45", "46", "47", "49", "53", "55", "56", "57", "58", "59", "61", "62", "63", "64", "65", "67", "79", "81", "82", "86", "87", "90", "94"]) + self2.string({ pool: "0123456789", length: 6 }),
                  "09" + self2.string({ pool: "0123456789", length: 8 })
                ]);
                phone = options.formatted ? numPick.match(/../g).join(" ") : numPick;
              } else {
                numPick = this.pick(["06", "07"]) + self2.string({ pool: "0123456789", length: 8 });
                phone = options.formatted ? numPick.match(/../g).join(" ") : numPick;
              }
              break;
            case "uk":
              if (!options.mobile) {
                numPick = this.pick([
                  //valid area codes of major cities/counties followed by random numbers in required format.
                  { area: "01" + this.character({ pool: "234569" }) + "1 ", sections: [3, 4] },
                  { area: "020 " + this.character({ pool: "378" }), sections: [3, 4] },
                  { area: "023 " + this.character({ pool: "89" }), sections: [3, 4] },
                  { area: "024 7", sections: [3, 4] },
                  { area: "028 " + this.pick(["25", "28", "37", "71", "82", "90", "92", "95"]), sections: [2, 4] },
                  { area: "012" + this.pick(["04", "08", "54", "76", "97", "98"]) + " ", sections: [6] },
                  { area: "013" + this.pick(["63", "64", "84", "86"]) + " ", sections: [6] },
                  { area: "014" + this.pick(["04", "20", "60", "61", "80", "88"]) + " ", sections: [6] },
                  { area: "015" + this.pick(["24", "27", "62", "66"]) + " ", sections: [6] },
                  { area: "016" + this.pick(["06", "29", "35", "47", "59", "95"]) + " ", sections: [6] },
                  { area: "017" + this.pick(["26", "44", "50", "68"]) + " ", sections: [6] },
                  { area: "018" + this.pick(["27", "37", "84", "97"]) + " ", sections: [6] },
                  { area: "019" + this.pick(["00", "05", "35", "46", "49", "63", "95"]) + " ", sections: [6] }
                ]);
                phone = options.formatted ? ukNum(numPick) : ukNum(numPick).replace(" ", "", "g");
              } else {
                numPick = this.pick([
                  { area: "07" + this.pick(["4", "5", "7", "8", "9"]), sections: [2, 6] },
                  { area: "07624 ", sections: [6] }
                ]);
                phone = options.formatted ? ukNum(numPick) : ukNum(numPick).replace(" ", "");
              }
              break;
            case "za":
              if (!options.mobile) {
                numPick = this.pick([
                  "01" + this.pick(["0", "1", "2", "3", "4", "5", "6", "7", "8"]) + self2.string({ pool: "0123456789", length: 7 }),
                  "02" + this.pick(["1", "2", "3", "4", "7", "8"]) + self2.string({ pool: "0123456789", length: 7 }),
                  "03" + this.pick(["1", "2", "3", "5", "6", "9"]) + self2.string({ pool: "0123456789", length: 7 }),
                  "04" + this.pick(["1", "2", "3", "4", "5", "6", "7", "8", "9"]) + self2.string({ pool: "0123456789", length: 7 }),
                  "05" + this.pick(["1", "3", "4", "6", "7", "8"]) + self2.string({ pool: "0123456789", length: 7 })
                ]);
                phone = options.formatted || numPick;
              } else {
                numPick = this.pick([
                  "060" + this.pick(["3", "4", "5", "6", "7", "8", "9"]) + self2.string({ pool: "0123456789", length: 6 }),
                  "061" + this.pick(["0", "1", "2", "3", "4", "5", "8"]) + self2.string({ pool: "0123456789", length: 6 }),
                  "06" + self2.string({ pool: "0123456789", length: 7 }),
                  "071" + this.pick(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) + self2.string({ pool: "0123456789", length: 6 }),
                  "07" + this.pick(["2", "3", "4", "6", "7", "8", "9"]) + self2.string({ pool: "0123456789", length: 7 }),
                  "08" + this.pick(["0", "1", "2", "3", "4", "5"]) + self2.string({ pool: "0123456789", length: 7 })
                ]);
                phone = options.formatted || numPick;
              }
              break;
            case "us":
              var areacode = this.areacode(options).toString();
              var exchange = this.natural({ min: 2, max: 9 }).toString() + this.natural({ min: 0, max: 9 }).toString() + this.natural({ min: 0, max: 9 }).toString();
              var subscriber = this.natural({ min: 1e3, max: 9999 }).toString();
              phone = options.formatted ? areacode + " " + exchange + "-" + subscriber : areacode + exchange + subscriber;
              break;
            case "br":
              var areaCode = this.pick(["11", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "24", "27", "28", "31", "32", "33", "34", "35", "37", "38", "41", "42", "43", "44", "45", "46", "47", "48", "49", "51", "53", "54", "55", "61", "62", "63", "64", "65", "66", "67", "68", "69", "71", "73", "74", "75", "77", "79", "81", "82", "83", "84", "85", "86", "87", "88", "89", "91", "92", "93", "94", "95", "96", "97", "98", "99"]);
              var prefix;
              if (options.mobile) {
                prefix = "9" + self2.string({ pool: "0123456789", length: 4 });
              } else {
                prefix = this.natural({ min: 2e3, max: 5999 }).toString();
              }
              var mcdu = self2.string({ pool: "0123456789", length: 4 });
              phone = options.formatted ? "(" + areaCode + ") " + prefix + "-" + mcdu : areaCode + prefix + mcdu;
              break;
          }
          return phone;
        };
        Chance2.prototype.postal = function() {
          var pd = this.character({ pool: "XVTSRPNKLMHJGECBA" });
          var fsa = pd + this.natural({ max: 9 }) + this.character({ alpha: true, casing: "upper" });
          var ldu = this.natural({ max: 9 }) + this.character({ alpha: true, casing: "upper" }) + this.natural({ max: 9 });
          return fsa + " " + ldu;
        };
        Chance2.prototype.postcode = function() {
          var area = this.pick(this.get("postcodeAreas")).code;
          var district = this.natural({ max: 9 });
          var subDistrict = this.bool() ? this.character({ alpha: true, casing: "upper" }) : "";
          var outward = area + district + subDistrict;
          var sector = this.natural({ max: 9 });
          var unit = this.character({ alpha: true, casing: "upper" }) + this.character({ alpha: true, casing: "upper" });
          var inward = sector + unit;
          return outward + " " + inward;
        };
        Chance2.prototype.counties = function(options) {
          options = initOptions(options, { country: "uk" });
          return this.get("counties")[options.country.toLowerCase()];
        };
        Chance2.prototype.county = function(options) {
          return this.pick(this.counties(options)).name;
        };
        Chance2.prototype.provinces = function(options) {
          options = initOptions(options, { country: "ca" });
          return this.get("provinces")[options.country.toLowerCase()];
        };
        Chance2.prototype.province = function(options) {
          return options && options.full ? this.pick(this.provinces(options)).name : this.pick(this.provinces(options)).abbreviation;
        };
        Chance2.prototype.state = function(options) {
          return options && options.full ? this.pick(this.states(options)).name : this.pick(this.states(options)).abbreviation;
        };
        Chance2.prototype.states = function(options) {
          options = initOptions(options, { country: "us", us_states_and_dc: true });
          var states;
          switch (options.country.toLowerCase()) {
            case "us":
              var us_states_and_dc = this.get("us_states_and_dc"), territories = this.get("territories"), armed_forces = this.get("armed_forces");
              states = [];
              if (options.us_states_and_dc) {
                states = states.concat(us_states_and_dc);
              }
              if (options.territories) {
                states = states.concat(territories);
              }
              if (options.armed_forces) {
                states = states.concat(armed_forces);
              }
              break;
            case "it":
            case "mx":
              states = this.get("country_regions")[options.country.toLowerCase()];
              break;
            case "uk":
              states = this.get("counties")[options.country.toLowerCase()];
              break;
          }
          return states;
        };
        Chance2.prototype.street = function(options) {
          options = initOptions(options, { country: "us", syllables: 2 });
          var street;
          switch (options.country.toLowerCase()) {
            case "us":
              street = this.word({ syllables: options.syllables });
              street = this.capitalize(street);
              street += " ";
              street += options.short_suffix ? this.street_suffix(options).abbreviation : this.street_suffix(options).name;
              break;
            case "it":
              street = this.word({ syllables: options.syllables });
              street = this.capitalize(street);
              street = (options.short_suffix ? this.street_suffix(options).abbreviation : this.street_suffix(options).name) + " " + street;
              break;
          }
          return street;
        };
        Chance2.prototype.street_suffix = function(options) {
          options = initOptions(options, { country: "us" });
          return this.pick(this.street_suffixes(options));
        };
        Chance2.prototype.street_suffixes = function(options) {
          options = initOptions(options, { country: "us" });
          return this.get("street_suffixes")[options.country.toLowerCase()];
        };
        Chance2.prototype.zip = function(options) {
          var zip = this.n(this.natural, 5, { max: 9 });
          if (options && options.plusfour === true) {
            zip.push("-");
            zip = zip.concat(this.n(this.natural, 4, { max: 9 }));
          }
          return zip.join("");
        };
        Chance2.prototype.ampm = function() {
          return this.bool() ? "am" : "pm";
        };
        Chance2.prototype.date = function(options) {
          var date_string, date;
          if (options && (options.min || options.max)) {
            options = initOptions(options, {
              american: true,
              string: false
            });
            var min = typeof options.min !== "undefined" ? options.min.getTime() : 1;
            var max = typeof options.max !== "undefined" ? options.max.getTime() : 864e13;
            date = new Date(this.integer({ min, max }));
          } else {
            var m = this.month({ raw: true });
            var daysInMonth = m.days;
            if (options && options.month) {
              daysInMonth = this.get("months")[(options.month % 12 + 12) % 12].days;
            }
            options = initOptions(options, {
              year: parseInt(this.year(), 10),
              // Necessary to subtract 1 because Date() 0-indexes month but not day or year
              // for some reason.
              month: m.numeric - 1,
              day: this.natural({ min: 1, max: daysInMonth }),
              hour: this.hour({ twentyfour: true }),
              minute: this.minute(),
              second: this.second(),
              millisecond: this.millisecond(),
              american: true,
              string: false
            });
            date = new Date(options.year, options.month, options.day, options.hour, options.minute, options.second, options.millisecond);
          }
          if (options.american) {
            date_string = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
          } else {
            date_string = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
          }
          return options.string ? date_string : date;
        };
        Chance2.prototype.hammertime = function(options) {
          return this.date(options).getTime();
        };
        Chance2.prototype.hour = function(options) {
          options = initOptions(options, {
            min: options && options.twentyfour ? 0 : 1,
            max: options && options.twentyfour ? 23 : 12
          });
          testRange(options.min < 0, "Chance: Min cannot be less than 0.");
          testRange(options.twentyfour && options.max > 23, "Chance: Max cannot be greater than 23 for twentyfour option.");
          testRange(!options.twentyfour && options.max > 12, "Chance: Max cannot be greater than 12.");
          testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");
          return this.natural({ min: options.min, max: options.max });
        };
        Chance2.prototype.millisecond = function() {
          return this.natural({ max: 999 });
        };
        Chance2.prototype.minute = Chance2.prototype.second = function(options) {
          options = initOptions(options, { min: 0, max: 59 });
          testRange(options.min < 0, "Chance: Min cannot be less than 0.");
          testRange(options.max > 59, "Chance: Max cannot be greater than 59.");
          testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");
          return this.natural({ min: options.min, max: options.max });
        };
        Chance2.prototype.month = function(options) {
          options = initOptions(options, { min: 1, max: 12 });
          testRange(options.min < 1, "Chance: Min cannot be less than 1.");
          testRange(options.max > 12, "Chance: Max cannot be greater than 12.");
          testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");
          var month = this.pick(this.months().slice(options.min - 1, options.max));
          return options.raw ? month : month.name;
        };
        Chance2.prototype.months = function() {
          return this.get("months");
        };
        Chance2.prototype.second = function() {
          return this.natural({ max: 59 });
        };
        Chance2.prototype.timestamp = function() {
          return this.natural({ min: 1, max: parseInt((/* @__PURE__ */ new Date()).getTime() / 1e3, 10) });
        };
        Chance2.prototype.weekday = function(options) {
          options = initOptions(options, { weekday_only: false });
          var weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
          if (!options.weekday_only) {
            weekdays.push("Saturday");
            weekdays.push("Sunday");
          }
          return this.pickone(weekdays);
        };
        Chance2.prototype.year = function(options) {
          options = initOptions(options, { min: (/* @__PURE__ */ new Date()).getFullYear() });
          options.max = typeof options.max !== "undefined" ? options.max : options.min + 100;
          return this.natural(options).toString();
        };
        Chance2.prototype.cc = function(options) {
          options = initOptions(options);
          var type, number, to_generate;
          type = options.type ? this.cc_type({ name: options.type, raw: true }) : this.cc_type({ raw: true });
          number = type.prefix.split("");
          to_generate = type.length - type.prefix.length - 1;
          number = number.concat(this.n(this.integer, to_generate, { min: 0, max: 9 }));
          number.push(this.luhn_calculate(number.join("")));
          return number.join("");
        };
        Chance2.prototype.cc_types = function() {
          return this.get("cc_types");
        };
        Chance2.prototype.cc_type = function(options) {
          options = initOptions(options);
          var types = this.cc_types(), type = null;
          if (options.name) {
            for (var i = 0; i < types.length; i++) {
              if (types[i].name === options.name || types[i].short_name === options.name) {
                type = types[i];
                break;
              }
            }
            if (type === null) {
              throw new RangeError("Chance: Credit card type '" + options.name + "' is not supported");
            }
          } else {
            type = this.pick(types);
          }
          return options.raw ? type : type.name;
        };
        Chance2.prototype.currency_types = function() {
          return this.get("currency_types");
        };
        Chance2.prototype.currency = function() {
          return this.pick(this.currency_types());
        };
        Chance2.prototype.timezones = function() {
          return this.get("timezones");
        };
        Chance2.prototype.timezone = function() {
          return this.pick(this.timezones());
        };
        Chance2.prototype.currency_pair = function(returnAsString) {
          var currencies = this.unique(this.currency, 2, {
            comparator: function(arr, val) {
              return arr.reduce(function(acc, item) {
                return acc || item.code === val.code;
              }, false);
            }
          });
          if (returnAsString) {
            return currencies[0].code + "/" + currencies[1].code;
          } else {
            return currencies;
          }
        };
        Chance2.prototype.dollar = function(options) {
          options = initOptions(options, { max: 1e4, min: 0 });
          var dollar = this.floating({ min: options.min, max: options.max, fixed: 2 }).toString(), cents = dollar.split(".")[1];
          if (cents === void 0) {
            dollar += ".00";
          } else if (cents.length < 2) {
            dollar = dollar + "0";
          }
          if (dollar < 0) {
            return "-$" + dollar.replace("-", "");
          } else {
            return "$" + dollar;
          }
        };
        Chance2.prototype.euro = function(options) {
          return Number(this.dollar(options).replace("$", "")).toLocaleString() + "\u20AC";
        };
        Chance2.prototype.exp = function(options) {
          options = initOptions(options);
          var exp = {};
          exp.year = this.exp_year();
          if (exp.year === (/* @__PURE__ */ new Date()).getFullYear().toString()) {
            exp.month = this.exp_month({ future: true });
          } else {
            exp.month = this.exp_month();
          }
          return options.raw ? exp : exp.month + "/" + exp.year;
        };
        Chance2.prototype.exp_month = function(options) {
          options = initOptions(options);
          var month, month_int, curMonth = (/* @__PURE__ */ new Date()).getMonth() + 1;
          if (options.future && curMonth !== 12) {
            do {
              month = this.month({ raw: true }).numeric;
              month_int = parseInt(month, 10);
            } while (month_int <= curMonth);
          } else {
            month = this.month({ raw: true }).numeric;
          }
          return month;
        };
        Chance2.prototype.exp_year = function() {
          var curMonth = (/* @__PURE__ */ new Date()).getMonth() + 1, curYear = (/* @__PURE__ */ new Date()).getFullYear();
          return this.year({ min: curMonth === 12 ? curYear + 1 : curYear, max: curYear + 10 });
        };
        Chance2.prototype.vat = function(options) {
          options = initOptions(options, { country: "it" });
          switch (options.country.toLowerCase()) {
            case "it":
              return this.it_vat();
          }
        };
        Chance2.prototype.iban = function() {
          var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          var alphanum = alpha + "0123456789";
          var iban = this.string({ length: 2, pool: alpha }) + this.pad(this.integer({ min: 0, max: 99 }), 2) + this.string({ length: 4, pool: alphanum }) + this.pad(this.natural(), this.natural({ min: 6, max: 26 }));
          return iban;
        };
        Chance2.prototype.it_vat = function() {
          var it_vat = this.natural({ min: 1, max: 18e5 });
          it_vat = this.pad(it_vat, 7) + this.pad(this.pick(this.provinces({ country: "it" })).code, 3);
          return it_vat + this.luhn_calculate(it_vat);
        };
        Chance2.prototype.cf = function(options) {
          options = options || {};
          var gender = !!options.gender ? options.gender : this.gender(), first = !!options.first ? options.first : this.first({ gender, nationality: "it" }), last = !!options.last ? options.last : this.last({ nationality: "it" }), birthday = !!options.birthday ? options.birthday : this.birthday(), city = !!options.city ? options.city : this.pickone(["A", "B", "C", "D", "E", "F", "G", "H", "I", "L", "M", "Z"]) + this.pad(this.natural({ max: 999 }), 3), cf = [], name_generator = function(name, isLast) {
            var temp, return_value = [];
            if (name.length < 3) {
              return_value = name.split("").concat("XXX".split("")).splice(0, 3);
            } else {
              temp = name.toUpperCase().split("").map(function(c) {
                return "BCDFGHJKLMNPRSTVWZ".indexOf(c) !== -1 ? c : void 0;
              }).join("");
              if (temp.length > 3) {
                if (isLast) {
                  temp = temp.substr(0, 3);
                } else {
                  temp = temp[0] + temp.substr(2, 2);
                }
              }
              if (temp.length < 3) {
                return_value = temp;
                temp = name.toUpperCase().split("").map(function(c) {
                  return "AEIOU".indexOf(c) !== -1 ? c : void 0;
                }).join("").substr(0, 3 - return_value.length);
              }
              return_value = return_value + temp;
            }
            return return_value;
          }, date_generator = function(birthday2, gender2, that) {
            var lettermonths = ["A", "B", "C", "D", "E", "H", "L", "M", "P", "R", "S", "T"];
            return birthday2.getFullYear().toString().substr(2) + lettermonths[birthday2.getMonth()] + that.pad(birthday2.getDate() + (gender2.toLowerCase() === "female" ? 40 : 0), 2);
          }, checkdigit_generator = function(cf2) {
            var range1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", range2 = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ", evens = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", odds = "BAKPLCQDREVOSFTGUHMINJWZYX", digit = 0;
            for (var i = 0; i < 15; i++) {
              if (i % 2 !== 0) {
                digit += evens.indexOf(range2[range1.indexOf(cf2[i])]);
              } else {
                digit += odds.indexOf(range2[range1.indexOf(cf2[i])]);
              }
            }
            return evens[digit % 26];
          };
          cf = cf.concat(name_generator(last, true), name_generator(first), date_generator(birthday, gender, this), city.toUpperCase().split("")).join("");
          cf += checkdigit_generator(cf.toUpperCase(), this);
          return cf.toUpperCase();
        };
        Chance2.prototype.pl_pesel = function() {
          var number = this.natural({ min: 1, max: 9999999999 });
          var arr = this.pad(number, 10).split("");
          for (var i = 0; i < arr.length; i++) {
            arr[i] = parseInt(arr[i]);
          }
          var controlNumber = (1 * arr[0] + 3 * arr[1] + 7 * arr[2] + 9 * arr[3] + 1 * arr[4] + 3 * arr[5] + 7 * arr[6] + 9 * arr[7] + 1 * arr[8] + 3 * arr[9]) % 10;
          if (controlNumber !== 0) {
            controlNumber = 10 - controlNumber;
          }
          return arr.join("") + controlNumber;
        };
        Chance2.prototype.pl_nip = function() {
          var number = this.natural({ min: 1, max: 999999999 });
          var arr = this.pad(number, 9).split("");
          for (var i = 0; i < arr.length; i++) {
            arr[i] = parseInt(arr[i]);
          }
          var controlNumber = (6 * arr[0] + 5 * arr[1] + 7 * arr[2] + 2 * arr[3] + 3 * arr[4] + 4 * arr[5] + 5 * arr[6] + 6 * arr[7] + 7 * arr[8]) % 11;
          if (controlNumber === 10) {
            return this.pl_nip();
          }
          return arr.join("") + controlNumber;
        };
        Chance2.prototype.pl_regon = function() {
          var number = this.natural({ min: 1, max: 99999999 });
          var arr = this.pad(number, 8).split("");
          for (var i = 0; i < arr.length; i++) {
            arr[i] = parseInt(arr[i]);
          }
          var controlNumber = (8 * arr[0] + 9 * arr[1] + 2 * arr[2] + 3 * arr[3] + 4 * arr[4] + 5 * arr[5] + 6 * arr[6] + 7 * arr[7]) % 11;
          if (controlNumber === 10) {
            controlNumber = 0;
          }
          return arr.join("") + controlNumber;
        };
        Chance2.prototype.note = function(options) {
          options = initOptions(options, { notes: "flatKey" });
          var scales = {
            naturals: ["C", "D", "E", "F", "G", "A", "B"],
            flats: ["D\u266D", "E\u266D", "G\u266D", "A\u266D", "B\u266D"],
            sharps: ["C\u266F", "D\u266F", "F\u266F", "G\u266F", "A\u266F"]
          };
          scales.all = scales.naturals.concat(scales.flats.concat(scales.sharps));
          scales.flatKey = scales.naturals.concat(scales.flats);
          scales.sharpKey = scales.naturals.concat(scales.sharps);
          return this.pickone(scales[options.notes]);
        };
        Chance2.prototype.midi_note = function(options) {
          var min = 0;
          var max = 127;
          options = initOptions(options, { min, max });
          return this.integer({ min: options.min, max: options.max });
        };
        Chance2.prototype.chord_quality = function(options) {
          options = initOptions(options, { jazz: true });
          var chord_qualities = ["maj", "min", "aug", "dim"];
          if (options.jazz) {
            chord_qualities = [
              "maj7",
              "min7",
              "7",
              "sus",
              "dim",
              "\xF8"
            ];
          }
          return this.pickone(chord_qualities);
        };
        Chance2.prototype.chord = function(options) {
          options = initOptions(options);
          return this.note(options) + this.chord_quality(options);
        };
        Chance2.prototype.tempo = function(options) {
          var min = 40;
          var max = 320;
          options = initOptions(options, { min, max });
          return this.integer({ min: options.min, max: options.max });
        };
        Chance2.prototype.coin = function() {
          return this.bool() ? "heads" : "tails";
        };
        function diceFn(range2) {
          return function() {
            return this.natural(range2);
          };
        }
        Chance2.prototype.d4 = diceFn({ min: 1, max: 4 });
        Chance2.prototype.d6 = diceFn({ min: 1, max: 6 });
        Chance2.prototype.d8 = diceFn({ min: 1, max: 8 });
        Chance2.prototype.d10 = diceFn({ min: 1, max: 10 });
        Chance2.prototype.d12 = diceFn({ min: 1, max: 12 });
        Chance2.prototype.d20 = diceFn({ min: 1, max: 20 });
        Chance2.prototype.d30 = diceFn({ min: 1, max: 30 });
        Chance2.prototype.d100 = diceFn({ min: 1, max: 100 });
        Chance2.prototype.rpg = function(thrown, options) {
          options = initOptions(options);
          if (!thrown) {
            throw new RangeError("Chance: A type of die roll must be included");
          } else {
            var bits = thrown.toLowerCase().split("d"), rolls = [];
            if (bits.length !== 2 || !parseInt(bits[0], 10) || !parseInt(bits[1], 10)) {
              throw new Error("Chance: Invalid format provided. Please provide #d# where the first # is the number of dice to roll, the second # is the max of each die");
            }
            for (var i = bits[0]; i > 0; i--) {
              rolls[i - 1] = this.natural({ min: 1, max: bits[1] });
            }
            return typeof options.sum !== "undefined" && options.sum ? rolls.reduce(function(p, c) {
              return p + c;
            }) : rolls;
          }
        };
        Chance2.prototype.guid = function(options) {
          options = initOptions(options, { version: 5 });
          var guid_pool = "abcdef1234567890", variant_pool = "ab89", guid = this.string({ pool: guid_pool, length: 8 }) + "-" + this.string({ pool: guid_pool, length: 4 }) + "-" + // The Version
          options.version + this.string({ pool: guid_pool, length: 3 }) + "-" + // The Variant
          this.string({ pool: variant_pool, length: 1 }) + this.string({ pool: guid_pool, length: 3 }) + "-" + this.string({ pool: guid_pool, length: 12 });
          return guid;
        };
        Chance2.prototype.hash = function(options) {
          options = initOptions(options, { length: 40, casing: "lower" });
          var pool = options.casing === "upper" ? HEX_POOL.toUpperCase() : HEX_POOL;
          return this.string({ pool, length: options.length });
        };
        Chance2.prototype.luhn_check = function(num) {
          var str = num.toString();
          var checkDigit = +str.substring(str.length - 1);
          return checkDigit === this.luhn_calculate(+str.substring(0, str.length - 1));
        };
        Chance2.prototype.luhn_calculate = function(num) {
          var digits = num.toString().split("").reverse();
          var sum = 0;
          var digit;
          for (var i = 0, l = digits.length; l > i; ++i) {
            digit = +digits[i];
            if (i % 2 === 0) {
              digit *= 2;
              if (digit > 9) {
                digit -= 9;
              }
            }
            sum += digit;
          }
          return sum * 9 % 10;
        };
        Chance2.prototype.md5 = function(options) {
          var opts = { str: "", key: null, raw: false };
          if (!options) {
            opts.str = this.string();
            options = {};
          } else if (typeof options === "string") {
            opts.str = options;
            options = {};
          } else if (typeof options !== "object") {
            return null;
          } else if (options.constructor === "Array") {
            return null;
          }
          opts = initOptions(options, opts);
          if (!opts.str) {
            throw new Error("A parameter is required to return an md5 hash.");
          }
          return this.bimd5.md5(opts.str, opts.key, opts.raw);
        };
        Chance2.prototype.file = function(options) {
          var fileOptions = options || {};
          var poolCollectionKey = "fileExtension";
          var typeRange = Object.keys(this.get("fileExtension"));
          var fileName;
          var fileExtension;
          fileName = this.word({ length: fileOptions.length });
          if (fileOptions.extension) {
            fileExtension = fileOptions.extension;
            return fileName + "." + fileExtension;
          }
          if (fileOptions.extensions) {
            if (Array.isArray(fileOptions.extensions)) {
              fileExtension = this.pickone(fileOptions.extensions);
              return fileName + "." + fileExtension;
            } else if (fileOptions.extensions.constructor === Object) {
              var extensionObjectCollection = fileOptions.extensions;
              var keys = Object.keys(extensionObjectCollection);
              fileExtension = this.pickone(extensionObjectCollection[this.pickone(keys)]);
              return fileName + "." + fileExtension;
            }
            throw new Error("Chance: Extensions must be an Array or Object");
          }
          if (fileOptions.fileType) {
            var fileType = fileOptions.fileType;
            if (typeRange.indexOf(fileType) !== -1) {
              fileExtension = this.pickone(this.get(poolCollectionKey)[fileType]);
              return fileName + "." + fileExtension;
            }
            throw new RangeError("Chance: Expect file type value to be 'raster', 'vector', '3d' or 'document'");
          }
          fileExtension = this.pickone(this.get(poolCollectionKey)[this.pickone(typeRange)]);
          return fileName + "." + fileExtension;
        };
        Chance2.prototype.fileWithContent = function(options) {
          var fileOptions = options || {};
          var fileName = "fileName" in fileOptions ? fileOptions.fileName : this.file().split(".")[0];
          fileName += "." + ("fileExtension" in fileOptions ? fileOptions.fileExtension : this.file().split(".")[1]);
          if (typeof fileOptions.fileSize !== "number") {
            throw new Error("File size must be an integer");
          }
          var file = {
            fileData: this.buffer({ length: fileOptions.fileSize }),
            fileName
          };
          return file;
        };
        var data = {
          firstNames: {
            "male": {
              "en": ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Charles", "Thomas", "Christopher", "Daniel", "Matthew", "George", "Donald", "Anthony", "Paul", "Mark", "Edward", "Steven", "Kenneth", "Andrew", "Brian", "Joshua", "Kevin", "Ronald", "Timothy", "Jason", "Jeffrey", "Frank", "Gary", "Ryan", "Nicholas", "Eric", "Stephen", "Jacob", "Larry", "Jonathan", "Scott", "Raymond", "Justin", "Brandon", "Gregory", "Samuel", "Benjamin", "Patrick", "Jack", "Henry", "Walter", "Dennis", "Jerry", "Alexander", "Peter", "Tyler", "Douglas", "Harold", "Aaron", "Jose", "Adam", "Arthur", "Zachary", "Carl", "Nathan", "Albert", "Kyle", "Lawrence", "Joe", "Willie", "Gerald", "Roger", "Keith", "Jeremy", "Terry", "Harry", "Ralph", "Sean", "Jesse", "Roy", "Louis", "Billy", "Austin", "Bruce", "Eugene", "Christian", "Bryan", "Wayne", "Russell", "Howard", "Fred", "Ethan", "Jordan", "Philip", "Alan", "Juan", "Randy", "Vincent", "Bobby", "Dylan", "Johnny", "Phillip", "Victor", "Clarence", "Ernest", "Martin", "Craig", "Stanley", "Shawn", "Travis", "Bradley", "Leonard", "Earl", "Gabriel", "Jimmy", "Francis", "Todd", "Noah", "Danny", "Dale", "Cody", "Carlos", "Allen", "Frederick", "Logan", "Curtis", "Alex", "Joel", "Luis", "Norman", "Marvin", "Glenn", "Tony", "Nathaniel", "Rodney", "Melvin", "Alfred", "Steve", "Cameron", "Chad", "Edwin", "Caleb", "Evan", "Antonio", "Lee", "Herbert", "Jeffery", "Isaac", "Derek", "Ricky", "Marcus", "Theodore", "Elijah", "Luke", "Jesus", "Eddie", "Troy", "Mike", "Dustin", "Ray", "Adrian", "Bernard", "Leroy", "Angel", "Randall", "Wesley", "Ian", "Jared", "Mason", "Hunter", "Calvin", "Oscar", "Clifford", "Jay", "Shane", "Ronnie", "Barry", "Lucas", "Corey", "Manuel", "Leo", "Tommy", "Warren", "Jackson", "Isaiah", "Connor", "Don", "Dean", "Jon", "Julian", "Miguel", "Bill", "Lloyd", "Charlie", "Mitchell", "Leon", "Jerome", "Darrell", "Jeremiah", "Alvin", "Brett", "Seth", "Floyd", "Jim", "Blake", "Micheal", "Gordon", "Trevor", "Lewis", "Erik", "Edgar", "Vernon", "Devin", "Gavin", "Jayden", "Chris", "Clyde", "Tom", "Derrick", "Mario", "Brent", "Marc", "Herman", "Chase", "Dominic", "Ricardo", "Franklin", "Maurice", "Max", "Aiden", "Owen", "Lester", "Gilbert", "Elmer", "Gene", "Francisco", "Glen", "Cory", "Garrett", "Clayton", "Sam", "Jorge", "Chester", "Alejandro", "Jeff", "Harvey", "Milton", "Cole", "Ivan", "Andre", "Duane", "Landon"],
              // Data taken from http://www.dati.gov.it/dataset/comune-di-firenze_0163
              "it": ["Adolfo", "Alberto", "Aldo", "Alessandro", "Alessio", "Alfredo", "Alvaro", "Andrea", "Angelo", "Angiolo", "Antonino", "Antonio", "Attilio", "Benito", "Bernardo", "Bruno", "Carlo", "Cesare", "Christian", "Claudio", "Corrado", "Cosimo", "Cristian", "Cristiano", "Daniele", "Dario", "David", "Davide", "Diego", "Dino", "Domenico", "Duccio", "Edoardo", "Elia", "Elio", "Emanuele", "Emiliano", "Emilio", "Enrico", "Enzo", "Ettore", "Fabio", "Fabrizio", "Federico", "Ferdinando", "Fernando", "Filippo", "Francesco", "Franco", "Gabriele", "Giacomo", "Giampaolo", "Giampiero", "Giancarlo", "Gianfranco", "Gianluca", "Gianmarco", "Gianni", "Gino", "Giorgio", "Giovanni", "Giuliano", "Giulio", "Giuseppe", "Graziano", "Gregorio", "Guido", "Iacopo", "Jacopo", "Lapo", "Leonardo", "Lorenzo", "Luca", "Luciano", "Luigi", "Manuel", "Marcello", "Marco", "Marino", "Mario", "Massimiliano", "Massimo", "Matteo", "Mattia", "Maurizio", "Mauro", "Michele", "Mirko", "Mohamed", "Nello", "Neri", "Niccol\xF2", "Nicola", "Osvaldo", "Otello", "Paolo", "Pier Luigi", "Piero", "Pietro", "Raffaele", "Remo", "Renato", "Renzo", "Riccardo", "Roberto", "Rolando", "Romano", "Salvatore", "Samuele", "Sandro", "Sergio", "Silvano", "Simone", "Stefano", "Thomas", "Tommaso", "Ubaldo", "Ugo", "Umberto", "Valerio", "Valter", "Vasco", "Vincenzo", "Vittorio"],
              // Data taken from http://www.svbkindernamen.nl/int/nl/kindernamen/index.html
              "nl": ["Aaron", "Abel", "Adam", "Adriaan", "Albert", "Alexander", "Ali", "Arjen", "Arno", "Bart", "Bas", "Bastiaan", "Benjamin", "Bob", "Boris", "Bram", "Brent", "Cas", "Casper", "Chris", "Christiaan", "Cornelis", "Daan", "Daley", "Damian", "Dani", "Daniel", "Dani\xEBl", "David", "Dean", "Dirk", "Dylan", "Egbert", "Elijah", "Erik", "Erwin", "Evert", "Ezra", "Fabian", "Fedde", "Finn", "Florian", "Floris", "Frank", "Frans", "Frederik", "Freek", "Geert", "Gerard", "Gerben", "Gerrit", "Gijs", "Guus", "Hans", "Hendrik", "Henk", "Herman", "Hidde", "Hugo", "Jaap", "Jan Jaap", "Jan-Willem", "Jack", "Jacob", "Jan", "Jason", "Jasper", "Jayden", "Jelle", "Jelte", "Jens", "Jeroen", "Jesse", "Jim", "Job", "Joep", "Johannes", "John", "Jonathan", "Joris", "Joshua", "Jo\xEBl", "Julian", "Kees", "Kevin", "Koen", "Lars", "Laurens", "Leendert", "Lennard", "Lodewijk", "Luc", "Luca", "Lucas", "Lukas", "Luuk", "Maarten", "Marcus", "Martijn", "Martin", "Matthijs", "Maurits", "Max", "Mees", "Melle", "Mick", "Mika", "Milan", "Mohamed", "Mohammed", "Morris", "Muhammed", "Nathan", "Nick", "Nico", "Niek", "Niels", "Noah", "Noud", "Olivier", "Oscar", "Owen", "Paul", "Pepijn", "Peter", "Pieter", "Pim", "Quinten", "Reinier", "Rens", "Robin", "Ruben", "Sam", "Samuel", "Sander", "Sebastiaan", "Sem", "Sep", "Sepp", "Siem", "Simon", "Stan", "Stef", "Steven", "Stijn", "Sven", "Teun", "Thijmen", "Thijs", "Thomas", "Tijn", "Tim", "Timo", "Tobias", "Tom", "Victor", "Vince", "Willem", "Wim", "Wouter", "Yusuf"],
              // Data taken from https://fr.wikipedia.org/wiki/Liste_de_pr%C3%A9noms_fran%C3%A7ais_et_de_la_francophonie
              "fr": ["Aaron", "Abdon", "Abel", "Ab\xE9lard", "Abelin", "Abondance", "Abraham", "Absalon", "Acace", "Achaire", "Achille", "Adalard", "Adalbald", "Adalb\xE9ron", "Adalbert", "Adalric", "Adam", "Adegrin", "Adel", "Adelin", "Andelin", "Adelphe", "Adam", "Ad\xE9odat", "Adh\xE9mar", "Adjutor", "Adolphe", "Adonis", "Adon", "Adrien", "Agapet", "Agathange", "Agathon", "Agilbert", "Ag\xE9nor", "Agnan", "Aignan", "Agrippin", "Aimable", "Aim\xE9", "Alain", "Alban", "Albin", "Aubin", "Alb\xE9ric", "Albert", "Albertet", "Alcibiade", "Alcide", "Alc\xE9e", "Alcime", "Aldonce", "Aldric", "Ald\xE9ric", "Aleaume", "Alexandre", "Alexis", "Alix", "Alliaume", "Aleaume", "Almine", "Almire", "Alo\xEFs", "Alph\xE9e", "Alphonse", "Alpinien", "Alver\xE8de", "Amalric", "Amaury", "Amandin", "Amant", "Ambroise", "Am\xE9d\xE9e", "Am\xE9lien", "Amiel", "Amour", "Ana\xEBl", "Anastase", "Anatole", "Ancelin", "And\xE9ol", "Andoche", "Andr\xE9", "Andoche", "Ange", "Angelin", "Angilbe", "Anglebert", "Angoustan", "Anicet", "Anne", "Annibal", "Ansbert", "Anselme", "Anthelme", "Antheaume", "Anthime", "Antide", "Antoine", "Antonius", "Antonin", "Apollinaire", "Apollon", "Aquilin", "Arcade", "Archambaud", "Archambeau", "Archange", "Archibald", "Arian", "Ariel", "Ariste", "Aristide", "Armand", "Armel", "Armin", "Arnould", "Arnaud", "Arolde", "Ars\xE8ne", "Arsino\xE9", "Arthaud", "Arth\xE8me", "Arthur", "Ascelin", "Athanase", "Aubry", "Audebert", "Audouin", "Audran", "Audric", "Auguste", "Augustin", "Aur\xE8le", "Aur\xE9lien", "Aurian", "Auxence", "Axel", "Aymard", "Aymeric", "Aymon", "Aymond", "Balthazar", "Baptiste", "Barnab\xE9", "Barth\xE9lemy", "Bartim\xE9e", "Basile", "Bastien", "Baudouin", "B\xE9nigne", "Benjamin", "Beno\xEEt", "B\xE9renger", "B\xE9rard", "Bernard", "Bertrand", "Blaise", "Bon", "Boniface", "Bouchard", "Brice", "Brieuc", "Bruno", "Brunon", "Calixte", "Calliste", "Cam\xE9lien", "Camille", "Camillien", "Candide", "Caribert", "Carloman", "Cassandre", "Cassien", "C\xE9dric", "C\xE9leste", "C\xE9lestin", "C\xE9lien", "C\xE9saire", "C\xE9sar", "Charles", "Charlemagne", "Childebert", "Chilp\xE9ric", "Chr\xE9tien", "Christian", "Christodule", "Christophe", "Chrysostome", "Clarence", "Claude", "Claudien", "Cl\xE9andre", "Cl\xE9ment", "Clotaire", "C\xF4me", "Constance", "Constant", "Constantin", "Corentin", "Cyprien", "Cyriaque", "Cyrille", "Cyril", "Damien", "Daniel", "David", "Delphin", "Denis", "D\xE9sir\xE9", "Didier", "Dieudonn\xE9", "Dimitri", "Dominique", "Dorian", "Doroth\xE9e", "Edgard", "Edmond", "\xC9douard", "\xC9leuth\xE8re", "\xC9lie", "\xC9lis\xE9e", "\xC9meric", "\xC9mile", "\xC9milien", "Emmanuel", "Enguerrand", "\xC9piphane", "\xC9ric", "Esprit", "Ernest", "\xC9tienne", "Eubert", "Eudes", "Eudoxe", "Eug\xE8ne", "Eus\xE8be", "Eustache", "\xC9variste", "\xC9vrard", "Fabien", "Fabrice", "Falba", "F\xE9licit\xE9", "F\xE9lix", "Ferdinand", "Fiacre", "Fid\xE8le", "Firmin", "Flavien", "Flodoard", "Florent", "Florentin", "Florestan", "Florian", "Fortun\xE9", "Foulques", "Francisque", "Fran\xE7ois", "Fran\xE7ais", "Franciscus", "Francs", "Fr\xE9d\xE9ric", "Fulbert", "Fulcran", "Fulgence", "Gabin", "Gabriel", "Ga\xEBl", "Garnier", "Gaston", "Gaspard", "Gatien", "Gaud", "Gautier", "G\xE9d\xE9on", "Geoffroy", "Georges", "G\xE9raud", "G\xE9rard", "Gerbert", "Germain", "Gervais", "Ghislain", "Gilbert", "Gilles", "Girart", "Gislebert", "Gondebaud", "Gonthier", "Gontran", "Gonzague", "Gr\xE9goire", "Gu\xE9rin", "Gui", "Guillaume", "Gustave", "Guy", "Guyot", "Hardouin", "Hector", "H\xE9delin", "H\xE9lier", "Henri", "Herbert", "Herluin", "Herv\xE9", "Hilaire", "Hildebert", "Hincmar", "Hippolyte", "Honor\xE9", "Hubert", "Hugues", "Innocent", "Isabeau", "Isidore", "Jacques", "Japhet", "Jason", "Jean", "Jeannel", "Jeannot", "J\xE9r\xE9mie", "J\xE9r\xF4me", "Joachim", "Joanny", "Job", "Jocelyn", "Jo\xEBl", "Johan", "Jonas", "Jonathan", "Joseph", "Josse", "Josselin", "Jourdain", "Jude", "Judica\xEBl", "Jules", "Julien", "Juste", "Justin", "Lambert", "Landry", "Laurent", "Lazare", "L\xE9andre", "L\xE9on", "L\xE9onard", "L\xE9opold", "Leu", "Loup", "Leufroy", "Lib\xE8re", "Li\xE9tald", "Lionel", "Lo\xEFc", "Longin", "Lorrain", "Lorraine", "Lothaire", "Louis", "Loup", "Luc", "Lucas", "Lucien", "Ludolphe", "Ludovic", "Macaire", "Malo", "Mamert", "Manass\xE9", "Marc", "Marceau", "Marcel", "Marcelin", "Marius", "Marseille", "Martial", "Martin", "Mathurin", "Matthias", "Mathias", "Matthieu", "Maugis", "Maurice", "Mauricet", "Maxence", "Maxime", "Maximilien", "Mayeul", "M\xE9d\xE9ric", "Melchior", "Mence", "Merlin", "M\xE9rov\xE9e", "Micha\xEBl", "Michel", "Mo\xEFse", "Morgan", "Nathan", "Nathana\xEBl", "Narcisse", "N\xE9h\xE9mie", "Nestor", "Nestor", "Nic\xE9phore", "Nicolas", "No\xE9", "No\xEBl", "Norbert", "Normand", "Normands", "Octave", "Odilon", "Odon", "Oger", "Olivier", "Oury", "Pac\xF4me", "Pal\xE9mon", "Parfait", "Pascal", "Paterne", "Patrice", "Paul", "P\xE9pin", "Perceval", "Phil\xE9mon", "Philibert", "Philippe", "Philoth\xE9e", "Pie", "Pierre", "Pierrick", "Prosper", "Quentin", "Raoul", "Rapha\xEBl", "Raymond", "R\xE9gis", "R\xE9jean", "R\xE9mi", "Renaud", "Ren\xE9", "Reybaud", "Richard", "Robert", "Roch", "Rodolphe", "Rodrigue", "Roger", "Roland", "Romain", "Romuald", "Rom\xE9o", "Rome", "Ronan", "Roselin", "Salomon", "Samuel", "Savin", "Savinien", "Scholastique", "S\xE9bastien", "S\xE9raphin", "Serge", "S\xE9verin", "Sidoine", "Sigebert", "Sigismond", "Silv\xE8re", "Simon", "Sim\xE9on", "Sixte", "Stanislas", "St\xE9phane", "Stephan", "Sylvain", "Sylvestre", "Tancr\xE8de", "Tanguy", "Taurin", "Th\xE9odore", "Th\xE9odose", "Th\xE9ophile", "Th\xE9ophraste", "Thibault", "Thibert", "Thierry", "Thomas", "Timol\xE9on", "Timoth\xE9e", "Titien", "Tonnin", "Toussaint", "Trajan", "Tristan", "Turold", "Tim", "Ulysse", "Urbain", "Valentin", "Val\xE8re", "Val\xE9ry", "Venance", "Venant", "Venceslas", "Vianney", "Victor", "Victorien", "Victorin", "Vigile", "Vincent", "Vital", "Vitalien", "Vivien", "Waleran", "Wandrille", "Xavier", "X\xE9nophon", "Yves", "Zacharie", "Zach\xE9", "Z\xE9phirin"]
            },
            "female": {
              "en": ["Mary", "Emma", "Elizabeth", "Minnie", "Margaret", "Ida", "Alice", "Bertha", "Sarah", "Annie", "Clara", "Ella", "Florence", "Cora", "Martha", "Laura", "Nellie", "Grace", "Carrie", "Maude", "Mabel", "Bessie", "Jennie", "Gertrude", "Julia", "Hattie", "Edith", "Mattie", "Rose", "Catherine", "Lillian", "Ada", "Lillie", "Helen", "Jessie", "Louise", "Ethel", "Lula", "Myrtle", "Eva", "Frances", "Lena", "Lucy", "Edna", "Maggie", "Pearl", "Daisy", "Fannie", "Josephine", "Dora", "Rosa", "Katherine", "Agnes", "Marie", "Nora", "May", "Mamie", "Blanche", "Stella", "Ellen", "Nancy", "Effie", "Sallie", "Nettie", "Della", "Lizzie", "Flora", "Susie", "Maud", "Mae", "Etta", "Harriet", "Sadie", "Caroline", "Katie", "Lydia", "Elsie", "Kate", "Susan", "Mollie", "Alma", "Addie", "Georgia", "Eliza", "Lulu", "Nannie", "Lottie", "Amanda", "Belle", "Charlotte", "Rebecca", "Ruth", "Viola", "Olive", "Amelia", "Hannah", "Jane", "Virginia", "Emily", "Matilda", "Irene", "Kathryn", "Esther", "Willie", "Henrietta", "Ollie", "Amy", "Rachel", "Sara", "Estella", "Theresa", "Augusta", "Ora", "Pauline", "Josie", "Lola", "Sophia", "Leona", "Anne", "Mildred", "Ann", "Beulah", "Callie", "Lou", "Delia", "Eleanor", "Barbara", "Iva", "Louisa", "Maria", "Mayme", "Evelyn", "Estelle", "Nina", "Betty", "Marion", "Bettie", "Dorothy", "Luella", "Inez", "Lela", "Rosie", "Allie", "Millie", "Janie", "Cornelia", "Victoria", "Ruby", "Winifred", "Alta", "Celia", "Christine", "Beatrice", "Birdie", "Harriett", "Mable", "Myra", "Sophie", "Tillie", "Isabel", "Sylvia", "Carolyn", "Isabelle", "Leila", "Sally", "Ina", "Essie", "Bertie", "Nell", "Alberta", "Katharine", "Lora", "Rena", "Mina", "Rhoda", "Mathilda", "Abbie", "Eula", "Dollie", "Hettie", "Eunice", "Fanny", "Ola", "Lenora", "Adelaide", "Christina", "Lelia", "Nelle", "Sue", "Johanna", "Lilly", "Lucinda", "Minerva", "Lettie", "Roxie", "Cynthia", "Helena", "Hilda", "Hulda", "Bernice", "Genevieve", "Jean", "Cordelia", "Marian", "Francis", "Jeanette", "Adeline", "Gussie", "Leah", "Lois", "Lura", "Mittie", "Hallie", "Isabella", "Olga", "Phoebe", "Teresa", "Hester", "Lida", "Lina", "Winnie", "Claudia", "Marguerite", "Vera", "Cecelia", "Bess", "Emilie", "Rosetta", "Verna", "Myrtie", "Cecilia", "Elva", "Olivia", "Ophelia", "Georgie", "Elnora", "Violet", "Adele", "Lily", "Linnie", "Loretta", "Madge", "Polly", "Virgie", "Eugenia", "Lucile", "Lucille", "Mabelle", "Rosalie"],
              // Data taken from http://www.dati.gov.it/dataset/comune-di-firenze_0162
              "it": ["Ada", "Adriana", "Alessandra", "Alessia", "Alice", "Angela", "Anna", "Anna Maria", "Annalisa", "Annita", "Annunziata", "Antonella", "Arianna", "Asia", "Assunta", "Aurora", "Barbara", "Beatrice", "Benedetta", "Bianca", "Bruna", "Camilla", "Carla", "Carlotta", "Carmela", "Carolina", "Caterina", "Catia", "Cecilia", "Chiara", "Cinzia", "Clara", "Claudia", "Costanza", "Cristina", "Daniela", "Debora", "Diletta", "Dina", "Donatella", "Elena", "Eleonora", "Elisa", "Elisabetta", "Emanuela", "Emma", "Eva", "Federica", "Fernanda", "Fiorella", "Fiorenza", "Flora", "Franca", "Francesca", "Gabriella", "Gaia", "Gemma", "Giada", "Gianna", "Gina", "Ginevra", "Giorgia", "Giovanna", "Giulia", "Giuliana", "Giuseppa", "Giuseppina", "Grazia", "Graziella", "Greta", "Ida", "Ilaria", "Ines", "Iolanda", "Irene", "Irma", "Isabella", "Jessica", "Laura", "Lea", "Letizia", "Licia", "Lidia", "Liliana", "Lina", "Linda", "Lisa", "Livia", "Loretta", "Luana", "Lucia", "Luciana", "Lucrezia", "Luisa", "Manuela", "Mara", "Marcella", "Margherita", "Maria", "Maria Cristina", "Maria Grazia", "Maria Luisa", "Maria Pia", "Maria Teresa", "Marina", "Marisa", "Marta", "Martina", "Marzia", "Matilde", "Melissa", "Michela", "Milena", "Mirella", "Monica", "Natalina", "Nella", "Nicoletta", "Noemi", "Olga", "Paola", "Patrizia", "Piera", "Pierina", "Raffaella", "Rebecca", "Renata", "Rina", "Rita", "Roberta", "Rosa", "Rosanna", "Rossana", "Rossella", "Sabrina", "Sandra", "Sara", "Serena", "Silvana", "Silvia", "Simona", "Simonetta", "Sofia", "Sonia", "Stefania", "Susanna", "Teresa", "Tina", "Tiziana", "Tosca", "Valentina", "Valeria", "Vanda", "Vanessa", "Vanna", "Vera", "Veronica", "Vilma", "Viola", "Virginia", "Vittoria"],
              // Data taken from http://www.svbkindernamen.nl/int/nl/kindernamen/index.html
              "nl": ["Ada", "Arianne", "Afke", "Amanda", "Amber", "Amy", "Aniek", "Anita", "Anja", "Anna", "Anne", "Annelies", "Annemarie", "Annette", "Anouk", "Astrid", "Aukje", "Barbara", "Bianca", "Carla", "Carlijn", "Carolien", "Chantal", "Charlotte", "Claudia", "Dani\xEBlle", "Debora", "Diane", "Dora", "Eline", "Elise", "Ella", "Ellen", "Emma", "Esmee", "Evelien", "Esther", "Erica", "Eva", "Femke", "Fleur", "Floor", "Froukje", "Gea", "Gerda", "Hanna", "Hanneke", "Heleen", "Hilde", "Ilona", "Ina", "Inge", "Ingrid", "Iris", "Isabel", "Isabelle", "Janneke", "Jasmijn", "Jeanine", "Jennifer", "Jessica", "Johanna", "Joke", "Julia", "Julie", "Karen", "Karin", "Katja", "Kim", "Lara", "Laura", "Lena", "Lianne", "Lieke", "Lilian", "Linda", "Lisa", "Lisanne", "Lotte", "Louise", "Maaike", "Manon", "Marga", "Maria", "Marissa", "Marit", "Marjolein", "Martine", "Marleen", "Melissa", "Merel", "Miranda", "Michelle", "Mirjam", "Mirthe", "Naomi", "Natalie", "Nienke", "Nina", "Noortje", "Olivia", "Patricia", "Paula", "Paulien", "Ramona", "Ria", "Rianne", "Roos", "Rosanne", "Ruth", "Sabrina", "Sandra", "Sanne", "Sara", "Saskia", "Silvia", "Sofia", "Sophie", "Sonja", "Suzanne", "Tamara", "Tess", "Tessa", "Tineke", "Valerie", "Vanessa", "Veerle", "Vera", "Victoria", "Wendy", "Willeke", "Yvonne", "Zo\xEB"],
              // Data taken from https://fr.wikipedia.org/wiki/Liste_de_pr%C3%A9noms_fran%C3%A7ais_et_de_la_francophonie
              "fr": ["Abdon", "Abel", "Abiga\xEBlle", "Abiga\xEFl", "Acacius", "Acanthe", "Adalbert", "Adalsinde", "Adegrine", "Ad\xE9la\xEFde", "Ad\xE8le", "Ad\xE9lie", "Adeline", "Adeltrude", "Adolphe", "Adonis", "Adrast\xE9e", "Adrehilde", "Adrienne", "Agathe", "Agilbert", "Agla\xE9", "Aignan", "Agnefl\xE8te", "Agn\xE8s", "Agrippine", "Aim\xE9", "Alaine", "Ala\xEFs", "Albane", "Alb\xE9rade", "Alberte", "Alcide", "Alcine", "Alcyone", "Aldegonde", "Aleth", "Alexandrine", "Alexine", "Alice", "Ali\xE9nor", "Aliette", "Aline", "Alix", "Aliz\xE9", "Alo\xEFse", "Aloyse", "Alphonsine", "Alth\xE9e", "Amaliane", "Amalth\xE9e", "Amande", "Amandine", "Amant", "Amarande", "Amaranthe", "Amaryllis", "Ambre", "Ambroisie", "Am\xE9lie", "Am\xE9thyste", "Aminte", "Ana\xEBl", "Ana\xEFs", "Anastasie", "Anatole", "Ancelin", "Andr\xE9e", "An\xE9mone", "Angadr\xEAme", "Ang\xE8le", "Angeline", "Ang\xE9lique", "Angilbert", "Anicet", "Annabelle", "Anne", "Annette", "Annick", "Annie", "Annonciade", "Ansbert", "Anstrudie", "Anthelme", "Antigone", "Antoinette", "Antonine", "Aph\xE9lie", "Apolline", "Apollonie", "Aquiline", "Arabelle", "Arcadie", "Archange", "Argine", "Ariane", "Aricie", "Ariel", "Arielle", "Arlette", "Armance", "Armande", "Armandine", "Armelle", "Armide", "Armelle", "Armin", "Arnaud", "Ars\xE8ne", "Arsino\xE9", "Art\xE9mis", "Arthur", "Ascelin", "Ascension", "Assomption", "Astart\xE9", "Ast\xE9rie", "Astr\xE9e", "Astrid", "Athalie", "Athanasie", "Athina", "Aube", "Albert", "Aude", "Audrey", "Augustine", "Aure", "Aur\xE9lie", "Aur\xE9lien", "Aur\xE8le", "Aurore", "Auxence", "Aveline", "Abiga\xEBlle", "Avoye", "Axelle", "Aymard", "Azal\xE9e", "Ad\xE8le", "Adeline", "Barbe", "Basilisse", "Bathilde", "B\xE9atrice", "B\xE9atrix", "B\xE9n\xE9dicte", "B\xE9reng\xE8re", "Bernadette", "Berthe", "Bertille", "Beuve", "Blanche", "Blanc", "Blandine", "Brigitte", "Brune", "Brunehilde", "Callista", "Camille", "Capucine", "Carine", "Caroline", "Cassandre", "Catherine", "C\xE9cile", "C\xE9leste", "C\xE9lestine", "C\xE9line", "Chantal", "Charl\xE8ne", "Charline", "Charlotte", "Chlo\xE9", "Christelle", "Christiane", "Christine", "Claire", "Clara", "Claude", "Claudine", "Clarisse", "Cl\xE9mence", "Cl\xE9mentine", "Cl\xE9o", "Clio", "Clotilde", "Coline", "Conception", "Constance", "Coralie", "Coraline", "Corentine", "Corinne", "Cyrielle", "Daniel", "Daniel", "Daphn\xE9", "D\xE9bora", "Delphine", "Denise", "Diane", "Dieudonn\xE9", "Dominique", "Doriane", "Doroth\xE9e", "Douce", "\xC9dith", "Edm\xE9e", "\xC9l\xE9onore", "\xC9liane", "\xC9lia", "\xC9liette", "\xC9lisabeth", "\xC9lise", "Ella", "\xC9lodie", "\xC9lo\xEFse", "Elsa", "\xC9meline", "\xC9m\xE9rance", "\xC9m\xE9rentienne", "\xC9m\xE9rencie", "\xC9milie", "Emma", "Emmanuelle", "Emmelie", "Ernestine", "Esther", "Estelle", "Eudoxie", "Eug\xE9nie", "Eulalie", "Euphrasie", "Eus\xE9bie", "\xC9vang\xE9line", "Eva", "\xC8ve", "\xC9velyne", "Fanny", "Fantine", "Faustine", "F\xE9licie", "Fernande", "Flavie", "Fleur", "Flore", "Florence", "Florie", "Fortun\xE9", "France", "Francia", "Fran\xE7oise", "Francine", "Gabrielle", "Ga\xEBlle", "Garance", "Genevi\xE8ve", "Georgette", "Gerberge", "Germaine", "Gertrude", "Gis\xE8le", "Gueni\xE8vre", "Guilhemine", "Guillemette", "Gustave", "Gwenael", "H\xE9l\xE8ne", "H\xE9lo\xEFse", "Henriette", "Hermine", "Hermione", "Hippolyte", "Honorine", "Hortense", "Huguette", "Ines", "Ir\xE8ne", "Irina", "Iris", "Isabeau", "Isabelle", "Iseult", "Isolde", "Ism\xE9rie", "Jacinthe", "Jacqueline", "Jade", "Janine", "Jeanne", "Jocelyne", "Jo\xEBlle", "Jos\xE9phine", "Judith", "Julia", "Julie", "Jules", "Juliette", "Justine", "Katy", "Kathy", "Katie", "Laura", "Laure", "Laureline", "Laurence", "Laurene", "Lauriane", "Laurianne", "Laurine", "L\xE9a", "L\xE9na", "L\xE9onie", "L\xE9on", "L\xE9ontine", "Lorraine", "Lucie", "Lucienne", "Lucille", "Ludivine", "Lydie", "Lydie", "Megane", "Madeleine", "Magali", "Maguelone", "Mallaury", "Manon", "Marceline", "Margot", "Marguerite", "Marianne", "Marie", "Myriam", "Marie", "Marine", "Marion", "Marl\xE8ne", "Marthe", "Martine", "Mathilde", "Maud", "Maureen", "Mauricette", "Maxime", "M\xE9lanie", "Melissa", "M\xE9lissandre", "M\xE9lisande", "M\xE9lodie", "Michel", "Micheline", "Mireille", "Miriam", "Mo\xEFse", "Monique", "Morgane", "Muriel", "Myl\xE8ne", "Nad\xE8ge", "Nadine", "Nathalie", "Nicole", "Nicolette", "Nine", "No\xEBl", "No\xE9mie", "Oc\xE9ane", "Odette", "Odile", "Olive", "Olivia", "Olympe", "Ombline", "Ombeline", "Oph\xE9lie", "Oriande", "Oriane", "Ozanne", "Pascale", "Pascaline", "Paule", "Paulette", "Pauline", "Priscille", "Prisca", "Prisque", "P\xE9cine", "P\xE9lagie", "P\xE9n\xE9lope", "Perrine", "P\xE9tronille", "Philippine", "Philom\xE8ne", "Philoth\xE9e", "Primerose", "Prudence", "Pulch\xE9rie", "Quentine", "Qui\xE9ta", "Quintia", "Quintilla", "Rachel", "Rapha\xEBlle", "Raymonde", "Rebecca", "R\xE9gine", "R\xE9jeanne", "Ren\xE9", "Rita", "Rita", "Rolande", "Romane", "Rosalie", "Rose", "Roseline", "Sabine", "Salom\xE9", "Sandra", "Sandrine", "Sarah", "S\xE9gol\xE8ne", "S\xE9verine", "Sibylle", "Simone", "Sixt", "Solange", "Soline", "Sol\xE8ne", "Sophie", "St\xE9phanie", "Suzanne", "Sylvain", "Sylvie", "Tatiana", "Tha\xEFs", "Th\xE9odora", "Th\xE9r\xE8se", "Tiphaine", "Ursule", "Valentine", "Val\xE9rie", "V\xE9ronique", "Victoire", "Victorine", "Vinciane", "Violette", "Virginie", "Viviane", "Xavi\xE8re", "Yolande", "Ysaline", "Yvette", "Yvonne", "Z\xE9lie", "Zita", "Zo\xE9"]
            }
          },
          lastNames: {
            "en": ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Rivera", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez", "James", "Watson", "Brooks", "Kelly", "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross", "Henderson", "Coleman", "Jenkins", "Perry", "Powell", "Long", "Patterson", "Hughes", "Flores", "Washington", "Butler", "Simmons", "Foster", "Gonzales", "Bryant", "Alexander", "Russell", "Griffin", "Diaz", "Hayes", "Myers", "Ford", "Hamilton", "Graham", "Sullivan", "Wallace", "Woods", "Cole", "West", "Jordan", "Owens", "Reynolds", "Fisher", "Ellis", "Harrison", "Gibson", "McDonald", "Cruz", "Marshall", "Ortiz", "Gomez", "Murray", "Freeman", "Wells", "Webb", "Simpson", "Stevens", "Tucker", "Porter", "Hunter", "Hicks", "Crawford", "Henry", "Boyd", "Mason", "Morales", "Kennedy", "Warren", "Dixon", "Ramos", "Reyes", "Burns", "Gordon", "Shaw", "Holmes", "Rice", "Robertson", "Hunt", "Black", "Daniels", "Palmer", "Mills", "Nichols", "Grant", "Knight", "Ferguson", "Rose", "Stone", "Hawkins", "Dunn", "Perkins", "Hudson", "Spencer", "Gardner", "Stephens", "Payne", "Pierce", "Berry", "Matthews", "Arnold", "Wagner", "Willis", "Ray", "Watkins", "Olson", "Carroll", "Duncan", "Snyder", "Hart", "Cunningham", "Bradley", "Lane", "Andrews", "Ruiz", "Harper", "Fox", "Riley", "Armstrong", "Carpenter", "Weaver", "Greene", "Lawrence", "Elliott", "Chavez", "Sims", "Austin", "Peters", "Kelley", "Franklin", "Lawson", "Fields", "Gutierrez", "Ryan", "Schmidt", "Carr", "Vasquez", "Castillo", "Wheeler", "Chapman", "Oliver", "Montgomery", "Richards", "Williamson", "Johnston", "Banks", "Meyer", "Bishop", "McCoy", "Howell", "Alvarez", "Morrison", "Hansen", "Fernandez", "Garza", "Harvey", "Little", "Burton", "Stanley", "Nguyen", "George", "Jacobs", "Reid", "Kim", "Fuller", "Lynch", "Dean", "Gilbert", "Garrett", "Romero", "Welch", "Larson", "Frazier", "Burke", "Hanson", "Day", "Mendoza", "Moreno", "Bowman", "Medina", "Fowler", "Brewer", "Hoffman", "Carlson", "Silva", "Pearson", "Holland", "Douglas", "Fleming", "Jensen", "Vargas", "Byrd", "Davidson", "Hopkins", "May", "Terry", "Herrera", "Wade", "Soto", "Walters", "Curtis", "Neal", "Caldwell", "Lowe", "Jennings", "Barnett", "Graves", "Jimenez", "Horton", "Shelton", "Barrett", "Obrien", "Castro", "Sutton", "Gregory", "McKinney", "Lucas", "Miles", "Craig", "Rodriquez", "Chambers", "Holt", "Lambert", "Fletcher", "Watts", "Bates", "Hale", "Rhodes", "Pena", "Beck", "Newman", "Haynes", "McDaniel", "Mendez", "Bush", "Vaughn", "Parks", "Dawson", "Santiago", "Norris", "Hardy", "Love", "Steele", "Curry", "Powers", "Schultz", "Barker", "Guzman", "Page", "Munoz", "Ball", "Keller", "Chandler", "Weber", "Leonard", "Walsh", "Lyons", "Ramsey", "Wolfe", "Schneider", "Mullins", "Benson", "Sharp", "Bowen", "Daniel", "Barber", "Cummings", "Hines", "Baldwin", "Griffith", "Valdez", "Hubbard", "Salazar", "Reeves", "Warner", "Stevenson", "Burgess", "Santos", "Tate", "Cross", "Garner", "Mann", "Mack", "Moss", "Thornton", "Dennis", "McGee", "Farmer", "Delgado", "Aguilar", "Vega", "Glover", "Manning", "Cohen", "Harmon", "Rodgers", "Robbins", "Newton", "Todd", "Blair", "Higgins", "Ingram", "Reese", "Cannon", "Strickland", "Townsend", "Potter", "Goodwin", "Walton", "Rowe", "Hampton", "Ortega", "Patton", "Swanson", "Joseph", "Francis", "Goodman", "Maldonado", "Yates", "Becker", "Erickson", "Hodges", "Rios", "Conner", "Adkins", "Webster", "Norman", "Malone", "Hammond", "Flowers", "Cobb", "Moody", "Quinn", "Blake", "Maxwell", "Pope", "Floyd", "Osborne", "Paul", "McCarthy", "Guerrero", "Lindsey", "Estrada", "Sandoval", "Gibbs", "Tyler", "Gross", "Fitzgerald", "Stokes", "Doyle", "Sherman", "Saunders", "Wise", "Colon", "Gill", "Alvarado", "Greer", "Padilla", "Simon", "Waters", "Nunez", "Ballard", "Schwartz", "McBride", "Houston", "Christensen", "Klein", "Pratt", "Briggs", "Parsons", "McLaughlin", "Zimmerman", "French", "Buchanan", "Moran", "Copeland", "Roy", "Pittman", "Brady", "McCormick", "Holloway", "Brock", "Poole", "Frank", "Logan", "Owen", "Bass", "Marsh", "Drake", "Wong", "Jefferson", "Park", "Morton", "Abbott", "Sparks", "Patrick", "Norton", "Huff", "Clayton", "Massey", "Lloyd", "Figueroa", "Carson", "Bowers", "Roberson", "Barton", "Tran", "Lamb", "Harrington", "Casey", "Boone", "Cortez", "Clarke", "Mathis", "Singleton", "Wilkins", "Cain", "Bryan", "Underwood", "Hogan", "McKenzie", "Collier", "Luna", "Phelps", "McGuire", "Allison", "Bridges", "Wilkerson", "Nash", "Summers", "Atkins"],
            // Data taken from http://www.dati.gov.it/dataset/comune-di-firenze_0164 (first 1000)
            "it": ["Acciai", "Aglietti", "Agostini", "Agresti", "Ahmed", "Aiazzi", "Albanese", "Alberti", "Alessi", "Alfani", "Alinari", "Alterini", "Amato", "Ammannati", "Ancillotti", "Andrei", "Andreini", "Andreoni", "Angeli", "Anichini", "Antonelli", "Antonini", "Arena", "Ariani", "Arnetoli", "Arrighi", "Baccani", "Baccetti", "Bacci", "Bacherini", "Badii", "Baggiani", "Baglioni", "Bagni", "Bagnoli", "Baldassini", "Baldi", "Baldini", "Ballerini", "Balli", "Ballini", "Balloni", "Bambi", "Banchi", "Bandinelli", "Bandini", "Bani", "Barbetti", "Barbieri", "Barchielli", "Bardazzi", "Bardelli", "Bardi", "Barducci", "Bargellini", "Bargiacchi", "Barni", "Baroncelli", "Baroncini", "Barone", "Baroni", "Baronti", "Bartalesi", "Bartoletti", "Bartoli", "Bartolini", "Bartoloni", "Bartolozzi", "Basagni", "Basile", "Bassi", "Batacchi", "Battaglia", "Battaglini", "Bausi", "Becagli", "Becattini", "Becchi", "Becucci", "Bellandi", "Bellesi", "Belli", "Bellini", "Bellucci", "Bencini", "Benedetti", "Benelli", "Beni", "Benini", "Bensi", "Benucci", "Benvenuti", "Berlincioni", "Bernacchioni", "Bernardi", "Bernardini", "Berni", "Bernini", "Bertelli", "Berti", "Bertini", "Bessi", "Betti", "Bettini", "Biagi", "Biagini", "Biagioni", "Biagiotti", "Biancalani", "Bianchi", "Bianchini", "Bianco", "Biffoli", "Bigazzi", "Bigi", "Biliotti", "Billi", "Binazzi", "Bindi", "Bini", "Biondi", "Bizzarri", "Bocci", "Bogani", "Bolognesi", "Bonaiuti", "Bonanni", "Bonciani", "Boncinelli", "Bondi", "Bonechi", "Bongini", "Boni", "Bonini", "Borchi", "Boretti", "Borghi", "Borghini", "Borgioli", "Borri", "Borselli", "Boschi", "Bottai", "Bracci", "Braccini", "Brandi", "Braschi", "Bravi", "Brazzini", "Breschi", "Brilli", "Brizzi", "Brogelli", "Brogi", "Brogioni", "Brunelli", "Brunetti", "Bruni", "Bruno", "Brunori", "Bruschi", "Bucci", "Bucciarelli", "Buccioni", "Bucelli", "Bulli", "Burberi", "Burchi", "Burgassi", "Burroni", "Bussotti", "Buti", "Caciolli", "Caiani", "Calabrese", "Calamai", "Calamandrei", "Caldini", "Calo'", "Calonaci", "Calosi", "Calvelli", "Cambi", "Camiciottoli", "Cammelli", "Cammilli", "Campolmi", "Cantini", "Capanni", "Capecchi", "Caponi", "Cappelletti", "Cappelli", "Cappellini", "Cappugi", "Capretti", "Caputo", "Carbone", "Carboni", "Cardini", "Carlesi", "Carletti", "Carli", "Caroti", "Carotti", "Carrai", "Carraresi", "Carta", "Caruso", "Casalini", "Casati", "Caselli", "Casini", "Castagnoli", "Castellani", "Castelli", "Castellucci", "Catalano", "Catarzi", "Catelani", "Cavaciocchi", "Cavallaro", "Cavallini", "Cavicchi", "Cavini", "Ceccarelli", "Ceccatelli", "Ceccherelli", "Ceccherini", "Cecchi", "Cecchini", "Cecconi", "Cei", "Cellai", "Celli", "Cellini", "Cencetti", "Ceni", "Cenni", "Cerbai", "Cesari", "Ceseri", "Checcacci", "Checchi", "Checcucci", "Cheli", "Chellini", "Chen", "Cheng", "Cherici", "Cherubini", "Chiaramonti", "Chiarantini", "Chiarelli", "Chiari", "Chiarini", "Chiarugi", "Chiavacci", "Chiesi", "Chimenti", "Chini", "Chirici", "Chiti", "Ciabatti", "Ciampi", "Cianchi", "Cianfanelli", "Cianferoni", "Ciani", "Ciapetti", "Ciappi", "Ciardi", "Ciatti", "Cicali", "Ciccone", "Cinelli", "Cini", "Ciobanu", "Ciolli", "Cioni", "Cipriani", "Cirillo", "Cirri", "Ciucchi", "Ciuffi", "Ciulli", "Ciullini", "Clemente", "Cocchi", "Cognome", "Coli", "Collini", "Colombo", "Colzi", "Comparini", "Conforti", "Consigli", "Conte", "Conti", "Contini", "Coppini", "Coppola", "Corsi", "Corsini", "Corti", "Cortini", "Cosi", "Costa", "Costantini", "Costantino", "Cozzi", "Cresci", "Crescioli", "Cresti", "Crini", "Curradi", "D'Agostino", "D'Alessandro", "D'Amico", "D'Angelo", "Daddi", "Dainelli", "Dallai", "Danti", "Davitti", "De Angelis", "De Luca", "De Marco", "De Rosa", "De Santis", "De Simone", "De Vita", "Degl'Innocenti", "Degli Innocenti", "Dei", "Del Lungo", "Del Re", "Di Marco", "Di Stefano", "Dini", "Diop", "Dobre", "Dolfi", "Donati", "Dondoli", "Dong", "Donnini", "Ducci", "Dumitru", "Ermini", "Esposito", "Evangelisti", "Fabbri", "Fabbrini", "Fabbrizzi", "Fabbroni", "Fabbrucci", "Fabiani", "Facchini", "Faggi", "Fagioli", "Failli", "Faini", "Falciani", "Falcini", "Falcone", "Fallani", "Falorni", "Falsini", "Falugiani", "Fancelli", "Fanelli", "Fanetti", "Fanfani", "Fani", "Fantappie'", "Fantechi", "Fanti", "Fantini", "Fantoni", "Farina", "Fattori", "Favilli", "Fedi", "Fei", "Ferrante", "Ferrara", "Ferrari", "Ferraro", "Ferretti", "Ferri", "Ferrini", "Ferroni", "Fiaschi", "Fibbi", "Fiesoli", "Filippi", "Filippini", "Fini", "Fioravanti", "Fiore", "Fiorentini", "Fiorini", "Fissi", "Focardi", "Foggi", "Fontana", "Fontanelli", "Fontani", "Forconi", "Formigli", "Forte", "Forti", "Fortini", "Fossati", "Fossi", "Francalanci", "Franceschi", "Franceschini", "Franchi", "Franchini", "Franci", "Francini", "Francioni", "Franco", "Frassineti", "Frati", "Fratini", "Frilli", "Frizzi", "Frosali", "Frosini", "Frullini", "Fusco", "Fusi", "Gabbrielli", "Gabellini", "Gagliardi", "Galanti", "Galardi", "Galeotti", "Galletti", "Galli", "Gallo", "Gallori", "Gambacciani", "Gargani", "Garofalo", "Garuglieri", "Gashi", "Gasperini", "Gatti", "Gelli", "Gensini", "Gentile", "Gentili", "Geri", "Gerini", "Gheri", "Ghini", "Giachetti", "Giachi", "Giacomelli", "Gianassi", "Giani", "Giannelli", "Giannetti", "Gianni", "Giannini", "Giannoni", "Giannotti", "Giannozzi", "Gigli", "Giordano", "Giorgetti", "Giorgi", "Giovacchini", "Giovannelli", "Giovannetti", "Giovannini", "Giovannoni", "Giuliani", "Giunti", "Giuntini", "Giusti", "Gonnelli", "Goretti", "Gori", "Gradi", "Gramigni", "Grassi", "Grasso", "Graziani", "Grazzini", "Greco", "Grifoni", "Grillo", "Grimaldi", "Grossi", "Gualtieri", "Guarducci", "Guarino", "Guarnieri", "Guasti", "Guerra", "Guerri", "Guerrini", "Guidi", "Guidotti", "He", "Hoxha", "Hu", "Huang", "Iandelli", "Ignesti", "Innocenti", "Jin", "La Rosa", "Lai", "Landi", "Landini", "Lanini", "Lapi", "Lapini", "Lari", "Lascialfari", "Lastrucci", "Latini", "Lazzeri", "Lazzerini", "Lelli", "Lenzi", "Leonardi", "Leoncini", "Leone", "Leoni", "Lepri", "Li", "Liao", "Lin", "Linari", "Lippi", "Lisi", "Livi", "Lombardi", "Lombardini", "Lombardo", "Longo", "Lopez", "Lorenzi", "Lorenzini", "Lorini", "Lotti", "Lu", "Lucchesi", "Lucherini", "Lunghi", "Lupi", "Madiai", "Maestrini", "Maffei", "Maggi", "Maggini", "Magherini", "Magini", "Magnani", "Magnelli", "Magni", "Magnolfi", "Magrini", "Malavolti", "Malevolti", "Manca", "Mancini", "Manetti", "Manfredi", "Mangani", "Mannelli", "Manni", "Mannini", "Mannucci", "Manuelli", "Manzini", "Marcelli", "Marchese", "Marchetti", "Marchi", "Marchiani", "Marchionni", "Marconi", "Marcucci", "Margheri", "Mari", "Mariani", "Marilli", "Marinai", "Marinari", "Marinelli", "Marini", "Marino", "Mariotti", "Marsili", "Martelli", "Martinelli", "Martini", "Martino", "Marzi", "Masi", "Masini", "Masoni", "Massai", "Materassi", "Mattei", "Matteini", "Matteucci", "Matteuzzi", "Mattioli", "Mattolini", "Matucci", "Mauro", "Mazzanti", "Mazzei", "Mazzetti", "Mazzi", "Mazzini", "Mazzocchi", "Mazzoli", "Mazzoni", "Mazzuoli", "Meacci", "Mecocci", "Meini", "Melani", "Mele", "Meli", "Mengoni", "Menichetti", "Meoni", "Merlini", "Messeri", "Messina", "Meucci", "Miccinesi", "Miceli", "Micheli", "Michelini", "Michelozzi", "Migliori", "Migliorini", "Milani", "Miniati", "Misuri", "Monaco", "Montagnani", "Montagni", "Montanari", "Montelatici", "Monti", "Montigiani", "Montini", "Morandi", "Morandini", "Morelli", "Moretti", "Morganti", "Mori", "Morini", "Moroni", "Morozzi", "Mugnai", "Mugnaini", "Mustafa", "Naldi", "Naldini", "Nannelli", "Nanni", "Nannini", "Nannucci", "Nardi", "Nardini", "Nardoni", "Natali", "Ndiaye", "Nencetti", "Nencini", "Nencioni", "Neri", "Nesi", "Nesti", "Niccolai", "Niccoli", "Niccolini", "Nigi", "Nistri", "Nocentini", "Noferini", "Novelli", "Nucci", "Nuti", "Nutini", "Oliva", "Olivieri", "Olmi", "Orlandi", "Orlandini", "Orlando", "Orsini", "Ortolani", "Ottanelli", "Pacciani", "Pace", "Paci", "Pacini", "Pagani", "Pagano", "Paggetti", "Pagliai", "Pagni", "Pagnini", "Paladini", "Palagi", "Palchetti", "Palloni", "Palmieri", "Palumbo", "Pampaloni", "Pancani", "Pandolfi", "Pandolfini", "Panerai", "Panichi", "Paoletti", "Paoli", "Paolini", "Papi", "Papini", "Papucci", "Parenti", "Parigi", "Parisi", "Parri", "Parrini", "Pasquini", "Passeri", "Pecchioli", "Pecorini", "Pellegrini", "Pepi", "Perini", "Perrone", "Peruzzi", "Pesci", "Pestelli", "Petri", "Petrini", "Petrucci", "Pettini", "Pezzati", "Pezzatini", "Piani", "Piazza", "Piazzesi", "Piazzini", "Piccardi", "Picchi", "Piccini", "Piccioli", "Pieraccini", "Pieraccioni", "Pieralli", "Pierattini", "Pieri", "Pierini", "Pieroni", "Pietrini", "Pini", "Pinna", "Pinto", "Pinzani", "Pinzauti", "Piras", "Pisani", "Pistolesi", "Poggesi", "Poggi", "Poggiali", "Poggiolini", "Poli", "Pollastri", "Porciani", "Pozzi", "Pratellesi", "Pratesi", "Prosperi", "Pruneti", "Pucci", "Puccini", "Puccioni", "Pugi", "Pugliese", "Puliti", "Querci", "Quercioli", "Raddi", "Radu", "Raffaelli", "Ragazzini", "Ranfagni", "Ranieri", "Rastrelli", "Raugei", "Raveggi", "Renai", "Renzi", "Rettori", "Ricci", "Ricciardi", "Ridi", "Ridolfi", "Rigacci", "Righi", "Righini", "Rinaldi", "Risaliti", "Ristori", "Rizzo", "Rocchi", "Rocchini", "Rogai", "Romagnoli", "Romanelli", "Romani", "Romano", "Romei", "Romeo", "Romiti", "Romoli", "Romolini", "Rontini", "Rosati", "Roselli", "Rosi", "Rossetti", "Rossi", "Rossini", "Rovai", "Ruggeri", "Ruggiero", "Russo", "Sabatini", "Saccardi", "Sacchetti", "Sacchi", "Sacco", "Salerno", "Salimbeni", "Salucci", "Salvadori", "Salvestrini", "Salvi", "Salvini", "Sanesi", "Sani", "Sanna", "Santi", "Santini", "Santoni", "Santoro", "Santucci", "Sardi", "Sarri", "Sarti", "Sassi", "Sbolci", "Scali", "Scarpelli", "Scarselli", "Scopetani", "Secci", "Selvi", "Senatori", "Senesi", "Serafini", "Sereni", "Serra", "Sestini", "Sguanci", "Sieni", "Signorini", "Silvestri", "Simoncini", "Simonetti", "Simoni", "Singh", "Sodi", "Soldi", "Somigli", "Sorbi", "Sorelli", "Sorrentino", "Sottili", "Spina", "Spinelli", "Staccioli", "Staderini", "Stefanelli", "Stefani", "Stefanini", "Stella", "Susini", "Tacchi", "Tacconi", "Taddei", "Tagliaferri", "Tamburini", "Tanganelli", "Tani", "Tanini", "Tapinassi", "Tarchi", "Tarchiani", "Targioni", "Tassi", "Tassini", "Tempesti", "Terzani", "Tesi", "Testa", "Testi", "Tilli", "Tinti", "Tirinnanzi", "Toccafondi", "Tofanari", "Tofani", "Tognaccini", "Tonelli", "Tonini", "Torelli", "Torrini", "Tosi", "Toti", "Tozzi", "Trambusti", "Trapani", "Tucci", "Turchi", "Ugolini", "Ulivi", "Valente", "Valenti", "Valentini", "Vangelisti", "Vanni", "Vannini", "Vannoni", "Vannozzi", "Vannucchi", "Vannucci", "Ventura", "Venturi", "Venturini", "Vestri", "Vettori", "Vichi", "Viciani", "Vieri", "Vigiani", "Vignoli", "Vignolini", "Vignozzi", "Villani", "Vinci", "Visani", "Vitale", "Vitali", "Viti", "Viviani", "Vivoli", "Volpe", "Volpi", "Wang", "Wu", "Xu", "Yang", "Ye", "Zagli", "Zani", "Zanieri", "Zanobini", "Zecchi", "Zetti", "Zhang", "Zheng", "Zhou", "Zhu", "Zingoni", "Zini", "Zoppi"],
            // http://www.voornamelijk.nl/meest-voorkomende-achternamen-in-nederland-en-amsterdam/
            "nl": ["Albers", "Alblas", "Appelman", "Baars", "Baas", "Bakker", "Blank", "Bleeker", "Blok", "Blom", "Boer", "Boers", "Boldewijn", "Boon", "Boot", "Bos", "Bosch", "Bosma", "Bosman", "Bouma", "Bouman", "Bouwman", "Brands", "Brouwer", "Burger", "Buijs", "Buitenhuis", "Ceder", "Cohen", "Dekker", "Dekkers", "Dijkman", "Dijkstra", "Driessen", "Drost", "Engel", "Evers", "Faber", "Franke", "Gerritsen", "Goedhart", "Goossens", "Groen", "Groenenberg", "Groot", "Haan", "Hart", "Heemskerk", "Hendriks", "Hermans", "Hoekstra", "Hofman", "Hopman", "Huisman", "Jacobs", "Jansen", "Janssen", "Jonker", "Jaspers", "Keijzer", "Klaassen", "Klein", "Koek", "Koenders", "Kok", "Kool", "Koopman", "Koopmans", "Koning", "Koster", "Kramer", "Kroon", "Kuijpers", "Kuiper", "Kuipers", "Kurt", "Koster", "Kwakman", "Los", "Lubbers", "Maas", "Markus", "Martens", "Meijer", "Mol", "Molenaar", "Mulder", "Nieuwenhuis", "Peeters", "Peters", "Pengel", "Pieters", "Pool", "Post", "Postma", "Prins", "Pronk", "Reijnders", "Rietveld", "Roest", "Roos", "Sanders", "Schaap", "Scheffer", "Schenk", "Schilder", "Schipper", "Schmidt", "Scholten", "Schouten", "Schut", "Schutte", "Schuurman", "Simons", "Smeets", "Smit", "Smits", "Snel", "Swinkels", "Tas", "Terpstra", "Timmermans", "Tol", "Tromp", "Troost", "Valk", "Veenstra", "Veldkamp", "Verbeek", "Verheul", "Verhoeven", "Vermeer", "Vermeulen", "Verweij", "Vink", "Visser", "Voorn", "Vos", "Wagenaar", "Wiersema", "Willems", "Willemsen", "Witteveen", "Wolff", "Wolters", "Zijlstra", "Zwart", "de Beer", "de Boer", "de Bruijn", "de Bruin", "de Graaf", "de Groot", "de Haan", "de Haas", "de Jager", "de Jong", "de Jonge", "de Koning", "de Lange", "de Leeuw", "de Ridder", "de Rooij", "de Ruiter", "de Vos", "de Vries", "de Waal", "de Wit", "de Zwart", "van Beek", "van Boven", "van Dam", "van Dijk", "van Dongen", "van Doorn", "van Egmond", "van Eijk", "van Es", "van Gelder", "van Gelderen", "van Houten", "van Hulst", "van Kempen", "van Kesteren", "van Leeuwen", "van Loon", "van Mill", "van Noord", "van Ommen", "van Ommeren", "van Oosten", "van Oostveen", "van Rijn", "van Schaik", "van Veen", "van Vliet", "van Wijk", "van Wijngaarden", "van den Poel", "van de Pol", "van den Ploeg", "van de Ven", "van den Berg", "van den Bosch", "van den Brink", "van den Broek", "van den Heuvel", "van der Heijden", "van der Horst", "van der Hulst", "van der Kroon", "van der Laan", "van der Linden", "van der Meer", "van der Meij", "van der Meulen", "van der Molen", "van der Sluis", "van der Spek", "van der Veen", "van der Velde", "van der Velden", "van der Vliet", "van der Wal"],
            // https://surnames.behindthename.com/top/lists/england-wales/1991
            "uk": ["Smith", "Jones", "Williams", "Taylor", "Brown", "Davies", "Evans", "Wilson", "Thomas", "Johnson", "Roberts", "Robinson", "Thompson", "Wright", "Walker", "White", "Edwards", "Hughes", "Green", "Hall", "Lewis", "Harris", "Clarke", "Patel", "Jackson", "Wood", "Turner", "Martin", "Cooper", "Hill", "Ward", "Morris", "Moore", "Clark", "Lee", "King", "Baker", "Harrison", "Morgan", "Allen", "James", "Scott", "Phillips", "Watson", "Davis", "Parker", "Price", "Bennett", "Young", "Griffiths", "Mitchell", "Kelly", "Cook", "Carter", "Richardson", "Bailey", "Collins", "Bell", "Shaw", "Murphy", "Miller", "Cox", "Richards", "Khan", "Marshall", "Anderson", "Simpson", "Ellis", "Adams", "Singh", "Begum", "Wilkinson", "Foster", "Chapman", "Powell", "Webb", "Rogers", "Gray", "Mason", "Ali", "Hunt", "Hussain", "Campbell", "Matthews", "Owen", "Palmer", "Holmes", "Mills", "Barnes", "Knight", "Lloyd", "Butler", "Russell", "Barker", "Fisher", "Stevens", "Jenkins", "Murray", "Dixon", "Harvey", "Graham", "Pearson", "Ahmed", "Fletcher", "Walsh", "Kaur", "Gibson", "Howard", "Andrews", "Stewart", "Elliott", "Reynolds", "Saunders", "Payne", "Fox", "Ford", "Pearce", "Day", "Brooks", "West", "Lawrence", "Cole", "Atkinson", "Bradley", "Spencer", "Gill", "Dawson", "Ball", "Burton", "O'brien", "Watts", "Rose", "Booth", "Perry", "Ryan", "Grant", "Wells", "Armstrong", "Francis", "Rees", "Hayes", "Hart", "Hudson", "Newman", "Barrett", "Webster", "Hunter", "Gregory", "Carr", "Lowe", "Page", "Marsh", "Riley", "Dunn", "Woods", "Parsons", "Berry", "Stone", "Reid", "Holland", "Hawkins", "Harding", "Porter", "Robertson", "Newton", "Oliver", "Reed", "Kennedy", "Williamson", "Bird", "Gardner", "Shah", "Dean", "Lane", "Cooke", "Bates", "Henderson", "Parry", "Burgess", "Bishop", "Walton", "Burns", "Nicholson", "Shepherd", "Ross", "Cross", "Long", "Freeman", "Warren", "Nicholls", "Hamilton", "Byrne", "Sutton", "Mcdonald", "Yates", "Hodgson", "Robson", "Curtis", "Hopkins", "O'connor", "Harper", "Coleman", "Watkins", "Moss", "Mccarthy", "Chambers", "O'neill", "Griffin", "Sharp", "Hardy", "Wheeler", "Potter", "Osborne", "Johnston", "Gordon", "Doyle", "Wallace", "George", "Jordan", "Hutchinson", "Rowe", "Burke", "May", "Pritchard", "Gilbert", "Willis", "Higgins", "Read", "Miles", "Stevenson", "Stephenson", "Hammond", "Arnold", "Buckley", "Walters", "Hewitt", "Barber", "Nelson", "Slater", "Austin", "Sullivan", "Whitehead", "Mann", "Frost", "Lambert", "Stephens", "Blake", "Akhtar", "Lynch", "Goodwin", "Barton", "Woodward", "Thomson", "Cunningham", "Quinn", "Barnett", "Baxter", "Bibi", "Clayton", "Nash", "Greenwood", "Jennings", "Holt", "Kemp", "Poole", "Gallagher", "Bond", "Stokes", "Tucker", "Davidson", "Fowler", "Heath", "Norman", "Middleton", "Lawson", "Banks", "French", "Stanley", "Jarvis", "Gibbs", "Ferguson", "Hayward", "Carroll", "Douglas", "Dickinson", "Todd", "Barlow", "Peters", "Lucas", "Knowles", "Hartley", "Miah", "Simmons", "Morton", "Alexander", "Field", "Morrison", "Norris", "Townsend", "Preston", "Hancock", "Thornton", "Baldwin", "Burrows", "Briggs", "Parkinson", "Reeves", "Macdonald", "Lamb", "Black", "Abbott", "Sanders", "Thorpe", "Holden", "Tomlinson", "Perkins", "Ashton", "Rhodes", "Fuller", "Howe", "Bryant", "Vaughan", "Dale", "Davey", "Weston", "Bartlett", "Whittaker", "Davison", "Kent", "Skinner", "Birch", "Morley", "Daniels", "Glover", "Howell", "Cartwright", "Pugh", "Humphreys", "Goddard", "Brennan", "Wall", "Kirby", "Bowen", "Savage", "Bull", "Wong", "Dobson", "Smart", "Wilkins", "Kirk", "Fraser", "Duffy", "Hicks", "Patterson", "Bradshaw", "Little", "Archer", "Warner", "Waters", "O'sullivan", "Farrell", "Brookes", "Atkins", "Kay", "Dodd", "Bentley", "Flynn", "John", "Schofield", "Short", "Haynes", "Wade", "Butcher", "Henry", "Sanderson", "Crawford", "Sheppard", "Bolton", "Coates", "Giles", "Gould", "Houghton", "Gibbons", "Pratt", "Manning", "Law", "Hooper", "Noble", "Dyer", "Rahman", "Clements", "Moran", "Sykes", "Chan", "Doherty", "Connolly", "Joyce", "Franklin", "Hobbs", "Coles", "Herbert", "Steele", "Kerr", "Leach", "Winter", "Owens", "Duncan", "Naylor", "Fleming", "Horton", "Finch", "Fitzgerald", "Randall", "Carpenter", "Marsden", "Browne", "Garner", "Pickering", "Hale", "Dennis", "Vincent", "Chadwick", "Chandler", "Sharpe", "Nolan", "Lyons", "Hurst", "Collier", "Peacock", "Howarth", "Faulkner", "Rice", "Pollard", "Welch", "Norton", "Gough", "Sinclair", "Blackburn", "Bryan", "Conway", "Power", "Cameron", "Daly", "Allan", "Hanson", "Gardiner", "Boyle", "Myers", "Turnbull", "Wallis", "Mahmood", "Sims", "Swift", "Iqbal", "Pope", "Brady", "Chamberlain", "Rowley", "Tyler", "Farmer", "Metcalfe", "Hilton", "Godfrey", "Holloway", "Parkin", "Bray", "Talbot", "Donnelly", "Nixon", "Charlton", "Benson", "Whitehouse", "Barry", "Hope", "Lord", "North", "Storey", "Connor", "Potts", "Bevan", "Hargreaves", "Mclean", "Mistry", "Bruce", "Howells", "Hyde", "Parkes", "Wyatt", "Fry", "Lees", "O'donnell", "Craig", "Forster", "Mckenzie", "Humphries", "Mellor", "Carey", "Ingram", "Summers", "Leonard"],
            // https://surnames.behindthename.com/top/lists/germany/2017
            "de": ["M\xFCller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner", "Becker", "Schulz", "Hoffmann", "Sch\xE4fer", "Koch", "Bauer", "Richter", "Klein", "Wolf", "Schr\xF6der", "Neumann", "Schwarz", "Zimmermann", "Braun", "Kr\xFCger", "Hofmann", "Hartmann", "Lange", "Schmitt", "Werner", "Schmitz", "Krause", "Meier", "Lehmann", "Schmid", "Schulze", "Maier", "K\xF6hler", "Herrmann", "K\xF6nig", "Walter", "Mayer", "Huber", "Kaiser", "Fuchs", "Peters", "Lang", "Scholz", "M\xF6ller", "Wei\xDF", "Jung", "Hahn", "Schubert", "Vogel", "Friedrich", "Keller", "G\xFCnther", "Frank", "Berger", "Winkler", "Roth", "Beck", "Lorenz", "Baumann", "Franke", "Albrecht", "Schuster", "Simon", "Ludwig", "B\xF6hm", "Winter", "Kraus", "Martin", "Schumacher", "Kr\xE4mer", "Vogt", "Stein", "J\xE4ger", "Otto", "Sommer", "Gro\xDF", "Seidel", "Heinrich", "Brandt", "Haas", "Schreiber", "Graf", "Schulte", "Dietrich", "Ziegler", "Kuhn", "K\xFChn", "Pohl", "Engel", "Horn", "Busch", "Bergmann", "Thomas", "Voigt", "Sauer", "Arnold", "Wolff", "Pfeiffer"],
            // http://www.japantimes.co.jp/life/2009/10/11/lifestyle/japans-top-100-most-common-family-names/
            "jp": ["Sato", "Suzuki", "Takahashi", "Tanaka", "Watanabe", "Ito", "Yamamoto", "Nakamura", "Kobayashi", "Kato", "Yoshida", "Yamada", "Sasaki", "Yamaguchi", "Saito", "Matsumoto", "Inoue", "Kimura", "Hayashi", "Shimizu", "Yamazaki", "Mori", "Abe", "Ikeda", "Hashimoto", "Yamashita", "Ishikawa", "Nakajima", "Maeda", "Fujita", "Ogawa", "Goto", "Okada", "Hasegawa", "Murakami", "Kondo", "Ishii", "Saito", "Sakamoto", "Endo", "Aoki", "Fujii", "Nishimura", "Fukuda", "Ota", "Miura", "Fujiwara", "Okamoto", "Matsuda", "Nakagawa", "Nakano", "Harada", "Ono", "Tamura", "Takeuchi", "Kaneko", "Wada", "Nakayama", "Ishida", "Ueda", "Morita", "Hara", "Shibata", "Sakai", "Kudo", "Yokoyama", "Miyazaki", "Miyamoto", "Uchida", "Takagi", "Ando", "Taniguchi", "Ohno", "Maruyama", "Imai", "Takada", "Fujimoto", "Takeda", "Murata", "Ueno", "Sugiyama", "Masuda", "Sugawara", "Hirano", "Kojima", "Otsuka", "Chiba", "Kubo", "Matsui", "Iwasaki", "Sakurai", "Kinoshita", "Noguchi", "Matsuo", "Nomura", "Kikuchi", "Sano", "Onishi", "Sugimoto", "Arai"],
            // http://www.lowchensaustralia.com/names/popular-spanish-names.htm
            "es": ["Garcia", "Fernandez", "Lopez", "Martinez", "Gonzalez", "Rodriguez", "Sanchez", "Perez", "Martin", "Gomez", "Ruiz", "Diaz", "Hernandez", "Alvarez", "Jimenez", "Moreno", "Munoz", "Alonso", "Romero", "Navarro", "Gutierrez", "Torres", "Dominguez", "Gil", "Vazquez", "Blanco", "Serrano", "Ramos", "Castro", "Suarez", "Sanz", "Rubio", "Ortega", "Molina", "Delgado", "Ortiz", "Morales", "Ramirez", "Marin", "Iglesias", "Santos", "Castillo", "Garrido", "Calvo", "Pena", "Cruz", "Cano", "Nunez", "Prieto", "Diez", "Lozano", "Vidal", "Pascual", "Ferrer", "Medina", "Vega", "Leon", "Herrero", "Vicente", "Mendez", "Guerrero", "Fuentes", "Campos", "Nieto", "Cortes", "Caballero", "Ibanez", "Lorenzo", "Pastor", "Gimenez", "Saez", "Soler", "Marquez", "Carrasco", "Herrera", "Montero", "Arias", "Crespo", "Flores", "Andres", "Aguilar", "Hidalgo", "Cabrera", "Mora", "Duran", "Velasco", "Rey", "Pardo", "Roman", "Vila", "Bravo", "Merino", "Moya", "Soto", "Izquierdo", "Reyes", "Redondo", "Marcos", "Carmona", "Menendez"],
            // Data taken from https://fr.wikipedia.org/wiki/Liste_des_noms_de_famille_les_plus_courants_en_France
            "fr": ["Martin", "Bernard", "Thomas", "Petit", "Robert", "Richard", "Durand", "Dubois", "Moreau", "Laurent", "Simon", "Michel", "Lef\xE8vre", "Leroy", "Roux", "David", "Bertrand", "Morel", "Fournier", "Girard", "Bonnet", "Dupont", "Lambert", "Fontaine", "Rousseau", "Vincent", "M\xFCller", "Lef\xE8vre", "Faure", "Andr\xE9", "Mercier", "Blanc", "Gu\xE9rin", "Boyer", "Garnier", "Chevalier", "Fran\xE7ois", "Legrand", "Gauthier", "Garcia", "Perrin", "Robin", "Cl\xE9ment", "Morin", "Nicolas", "Henry", "Roussel", "Matthieu", "Gautier", "Masson", "Marchand", "Duval", "Denis", "Dumont", "Marie", "Lemaire", "No\xEBl", "Meyer", "Dufour", "Meunier", "Brun", "Blanchard", "Giraud", "Joly", "Rivi\xE8re", "Lucas", "Brunet", "Gaillard", "Barbier", "Arnaud", "Mart\xEDnez", "G\xE9rard", "Roche", "Renard", "Schmitt", "Roy", "Leroux", "Colin", "Vidal", "Caron", "Picard", "Roger", "Fabre", "Aubert", "Lemoine", "Renaud", "Dumas", "Lacroix", "Olivier", "Philippe", "Bourgeois", "Pierre", "Beno\xEEt", "Rey", "Leclerc", "Payet", "Rolland", "Leclercq", "Guillaume", "Lecomte", "L\xF3pez", "Jean", "Dupuy", "Guillot", "Hubert", "Berger", "Carpentier", "S\xE1nchez", "Dupuis", "Moulin", "Louis", "Deschamps", "Huet", "Vasseur", "Perez", "Boucher", "Fleury", "Royer", "Klein", "Jacquet", "Adam", "Paris", "Poirier", "Marty", "Aubry", "Guyot", "Carr\xE9", "Charles", "Renault", "Charpentier", "M\xE9nard", "Maillard", "Baron", "Bertin", "Bailly", "Herv\xE9", "Schneider", "Fern\xE1ndez", "Le GallGall", "Collet", "L\xE9ger", "Bouvier", "Julien", "Pr\xE9vost", "Millet", "Perrot", "Daniel", "Le RouxRoux", "Cousin", "Germain", "Breton", "Besson", "Langlois", "R\xE9mi", "Le GoffGoff", "Pelletier", "L\xE9v\xEAque", "Perrier", "Leblanc", "Barr\xE9", "Lebrun", "Marchal", "Weber", "Mallet", "Hamon", "Boulanger", "Jacob", "Monnier", "Michaud", "Rodr\xEDguez", "Guichard", "Gillet", "\xC9tienne", "Grondin", "Poulain", "Tessier", "Chevallier", "Collin", "Chauvin", "Da SilvaSilva", "Bouchet", "Gay", "Lema\xEEtre", "B\xE9nard", "Mar\xE9chal", "Humbert", "Reynaud", "Antoine", "Hoarau", "Perret", "Barth\xE9lemy", "Cordier", "Pichon", "Lejeune", "Gilbert", "Lamy", "Delaunay", "Pasquier", "Carlier", "LaporteLaporte"]
          },
          // Data taken from http://geoportal.statistics.gov.uk/datasets/ons-postcode-directory-latest-centroids
          postcodeAreas: [{ code: "AB" }, { code: "AL" }, { code: "B" }, { code: "BA" }, { code: "BB" }, { code: "BD" }, { code: "BH" }, { code: "BL" }, { code: "BN" }, { code: "BR" }, { code: "BS" }, { code: "BT" }, { code: "CA" }, { code: "CB" }, { code: "CF" }, { code: "CH" }, { code: "CM" }, { code: "CO" }, { code: "CR" }, { code: "CT" }, { code: "CV" }, { code: "CW" }, { code: "DA" }, { code: "DD" }, { code: "DE" }, { code: "DG" }, { code: "DH" }, { code: "DL" }, { code: "DN" }, { code: "DT" }, { code: "DY" }, { code: "E" }, { code: "EC" }, { code: "EH" }, { code: "EN" }, { code: "EX" }, { code: "FK" }, { code: "FY" }, { code: "G" }, { code: "GL" }, { code: "GU" }, { code: "GY" }, { code: "HA" }, { code: "HD" }, { code: "HG" }, { code: "HP" }, { code: "HR" }, { code: "HS" }, { code: "HU" }, { code: "HX" }, { code: "IG" }, { code: "IM" }, { code: "IP" }, { code: "IV" }, { code: "JE" }, { code: "KA" }, { code: "KT" }, { code: "KW" }, { code: "KY" }, { code: "L" }, { code: "LA" }, { code: "LD" }, { code: "LE" }, { code: "LL" }, { code: "LN" }, { code: "LS" }, { code: "LU" }, { code: "M" }, { code: "ME" }, { code: "MK" }, { code: "ML" }, { code: "N" }, { code: "NE" }, { code: "NG" }, { code: "NN" }, { code: "NP" }, { code: "NR" }, { code: "NW" }, { code: "OL" }, { code: "OX" }, { code: "PA" }, { code: "PE" }, { code: "PH" }, { code: "PL" }, { code: "PO" }, { code: "PR" }, { code: "RG" }, { code: "RH" }, { code: "RM" }, { code: "S" }, { code: "SA" }, { code: "SE" }, { code: "SG" }, { code: "SK" }, { code: "SL" }, { code: "SM" }, { code: "SN" }, { code: "SO" }, { code: "SP" }, { code: "SR" }, { code: "SS" }, { code: "ST" }, { code: "SW" }, { code: "SY" }, { code: "TA" }, { code: "TD" }, { code: "TF" }, { code: "TN" }, { code: "TQ" }, { code: "TR" }, { code: "TS" }, { code: "TW" }, { code: "UB" }, { code: "W" }, { code: "WA" }, { code: "WC" }, { code: "WD" }, { code: "WF" }, { code: "WN" }, { code: "WR" }, { code: "WS" }, { code: "WV" }, { code: "YO" }, { code: "ZE" }],
          // Data taken from https://github.com/umpirsky/country-list/blob/master/data/en_US/country.json
          countries: [{ "name": "Afghanistan", "abbreviation": "AF" }, { "name": "\xC5land Islands", "abbreviation": "AX" }, { "name": "Albania", "abbreviation": "AL" }, { "name": "Algeria", "abbreviation": "DZ" }, { "name": "American Samoa", "abbreviation": "AS" }, { "name": "Andorra", "abbreviation": "AD" }, { "name": "Angola", "abbreviation": "AO" }, { "name": "Anguilla", "abbreviation": "AI" }, { "name": "Antarctica", "abbreviation": "AQ" }, { "name": "Antigua & Barbuda", "abbreviation": "AG" }, { "name": "Argentina", "abbreviation": "AR" }, { "name": "Armenia", "abbreviation": "AM" }, { "name": "Aruba", "abbreviation": "AW" }, { "name": "Ascension Island", "abbreviation": "AC" }, { "name": "Australia", "abbreviation": "AU" }, { "name": "Austria", "abbreviation": "AT" }, { "name": "Azerbaijan", "abbreviation": "AZ" }, { "name": "Bahamas", "abbreviation": "BS" }, { "name": "Bahrain", "abbreviation": "BH" }, { "name": "Bangladesh", "abbreviation": "BD" }, { "name": "Barbados", "abbreviation": "BB" }, { "name": "Belarus", "abbreviation": "BY" }, { "name": "Belgium", "abbreviation": "BE" }, { "name": "Belize", "abbreviation": "BZ" }, { "name": "Benin", "abbreviation": "BJ" }, { "name": "Bermuda", "abbreviation": "BM" }, { "name": "Bhutan", "abbreviation": "BT" }, { "name": "Bolivia", "abbreviation": "BO" }, { "name": "Bosnia & Herzegovina", "abbreviation": "BA" }, { "name": "Botswana", "abbreviation": "BW" }, { "name": "Brazil", "abbreviation": "BR" }, { "name": "British Indian Ocean Territory", "abbreviation": "IO" }, { "name": "British Virgin Islands", "abbreviation": "VG" }, { "name": "Brunei", "abbreviation": "BN" }, { "name": "Bulgaria", "abbreviation": "BG" }, { "name": "Burkina Faso", "abbreviation": "BF" }, { "name": "Burundi", "abbreviation": "BI" }, { "name": "Cambodia", "abbreviation": "KH" }, { "name": "Cameroon", "abbreviation": "CM" }, { "name": "Canada", "abbreviation": "CA" }, { "name": "Canary Islands", "abbreviation": "IC" }, { "name": "Cape Verde", "abbreviation": "CV" }, { "name": "Caribbean Netherlands", "abbreviation": "BQ" }, { "name": "Cayman Islands", "abbreviation": "KY" }, { "name": "Central African Republic", "abbreviation": "CF" }, { "name": "Ceuta & Melilla", "abbreviation": "EA" }, { "name": "Chad", "abbreviation": "TD" }, { "name": "Chile", "abbreviation": "CL" }, { "name": "China", "abbreviation": "CN" }, { "name": "Christmas Island", "abbreviation": "CX" }, { "name": "Cocos (Keeling) Islands", "abbreviation": "CC" }, { "name": "Colombia", "abbreviation": "CO" }, { "name": "Comoros", "abbreviation": "KM" }, { "name": "Congo - Brazzaville", "abbreviation": "CG" }, { "name": "Congo - Kinshasa", "abbreviation": "CD" }, { "name": "Cook Islands", "abbreviation": "CK" }, { "name": "Costa Rica", "abbreviation": "CR" }, { "name": "C\xF4te d'Ivoire", "abbreviation": "CI" }, { "name": "Croatia", "abbreviation": "HR" }, { "name": "Cuba", "abbreviation": "CU" }, { "name": "Cura\xE7ao", "abbreviation": "CW" }, { "name": "Cyprus", "abbreviation": "CY" }, { "name": "Czech Republic", "abbreviation": "CZ" }, { "name": "Denmark", "abbreviation": "DK" }, { "name": "Diego Garcia", "abbreviation": "DG" }, { "name": "Djibouti", "abbreviation": "DJ" }, { "name": "Dominica", "abbreviation": "DM" }, { "name": "Dominican Republic", "abbreviation": "DO" }, { "name": "Ecuador", "abbreviation": "EC" }, { "name": "Egypt", "abbreviation": "EG" }, { "name": "El Salvador", "abbreviation": "SV" }, { "name": "Equatorial Guinea", "abbreviation": "GQ" }, { "name": "Eritrea", "abbreviation": "ER" }, { "name": "Estonia", "abbreviation": "EE" }, { "name": "Ethiopia", "abbreviation": "ET" }, { "name": "Falkland Islands", "abbreviation": "FK" }, { "name": "Faroe Islands", "abbreviation": "FO" }, { "name": "Fiji", "abbreviation": "FJ" }, { "name": "Finland", "abbreviation": "FI" }, { "name": "France", "abbreviation": "FR" }, { "name": "French Guiana", "abbreviation": "GF" }, { "name": "French Polynesia", "abbreviation": "PF" }, { "name": "French Southern Territories", "abbreviation": "TF" }, { "name": "Gabon", "abbreviation": "GA" }, { "name": "Gambia", "abbreviation": "GM" }, { "name": "Georgia", "abbreviation": "GE" }, { "name": "Germany", "abbreviation": "DE" }, { "name": "Ghana", "abbreviation": "GH" }, { "name": "Gibraltar", "abbreviation": "GI" }, { "name": "Greece", "abbreviation": "GR" }, { "name": "Greenland", "abbreviation": "GL" }, { "name": "Grenada", "abbreviation": "GD" }, { "name": "Guadeloupe", "abbreviation": "GP" }, { "name": "Guam", "abbreviation": "GU" }, { "name": "Guatemala", "abbreviation": "GT" }, { "name": "Guernsey", "abbreviation": "GG" }, { "name": "Guinea", "abbreviation": "GN" }, { "name": "Guinea-Bissau", "abbreviation": "GW" }, { "name": "Guyana", "abbreviation": "GY" }, { "name": "Haiti", "abbreviation": "HT" }, { "name": "Honduras", "abbreviation": "HN" }, { "name": "Hong Kong SAR China", "abbreviation": "HK" }, { "name": "Hungary", "abbreviation": "HU" }, { "name": "Iceland", "abbreviation": "IS" }, { "name": "India", "abbreviation": "IN" }, { "name": "Indonesia", "abbreviation": "ID" }, { "name": "Iran", "abbreviation": "IR" }, { "name": "Iraq", "abbreviation": "IQ" }, { "name": "Ireland", "abbreviation": "IE" }, { "name": "Isle of Man", "abbreviation": "IM" }, { "name": "Israel", "abbreviation": "IL" }, { "name": "Italy", "abbreviation": "IT" }, { "name": "Jamaica", "abbreviation": "JM" }, { "name": "Japan", "abbreviation": "JP" }, { "name": "Jersey", "abbreviation": "JE" }, { "name": "Jordan", "abbreviation": "JO" }, { "name": "Kazakhstan", "abbreviation": "KZ" }, { "name": "Kenya", "abbreviation": "KE" }, { "name": "Kiribati", "abbreviation": "KI" }, { "name": "Kosovo", "abbreviation": "XK" }, { "name": "Kuwait", "abbreviation": "KW" }, { "name": "Kyrgyzstan", "abbreviation": "KG" }, { "name": "Laos", "abbreviation": "LA" }, { "name": "Latvia", "abbreviation": "LV" }, { "name": "Lebanon", "abbreviation": "LB" }, { "name": "Lesotho", "abbreviation": "LS" }, { "name": "Liberia", "abbreviation": "LR" }, { "name": "Libya", "abbreviation": "LY" }, { "name": "Liechtenstein", "abbreviation": "LI" }, { "name": "Lithuania", "abbreviation": "LT" }, { "name": "Luxembourg", "abbreviation": "LU" }, { "name": "Macau SAR China", "abbreviation": "MO" }, { "name": "Macedonia", "abbreviation": "MK" }, { "name": "Madagascar", "abbreviation": "MG" }, { "name": "Malawi", "abbreviation": "MW" }, { "name": "Malaysia", "abbreviation": "MY" }, { "name": "Maldives", "abbreviation": "MV" }, { "name": "Mali", "abbreviation": "ML" }, { "name": "Malta", "abbreviation": "MT" }, { "name": "Marshall Islands", "abbreviation": "MH" }, { "name": "Martinique", "abbreviation": "MQ" }, { "name": "Mauritania", "abbreviation": "MR" }, { "name": "Mauritius", "abbreviation": "MU" }, { "name": "Mayotte", "abbreviation": "YT" }, { "name": "Mexico", "abbreviation": "MX" }, { "name": "Micronesia", "abbreviation": "FM" }, { "name": "Moldova", "abbreviation": "MD" }, { "name": "Monaco", "abbreviation": "MC" }, { "name": "Mongolia", "abbreviation": "MN" }, { "name": "Montenegro", "abbreviation": "ME" }, { "name": "Montserrat", "abbreviation": "MS" }, { "name": "Morocco", "abbreviation": "MA" }, { "name": "Mozambique", "abbreviation": "MZ" }, { "name": "Myanmar (Burma)", "abbreviation": "MM" }, { "name": "Namibia", "abbreviation": "NA" }, { "name": "Nauru", "abbreviation": "NR" }, { "name": "Nepal", "abbreviation": "NP" }, { "name": "Netherlands", "abbreviation": "NL" }, { "name": "New Caledonia", "abbreviation": "NC" }, { "name": "New Zealand", "abbreviation": "NZ" }, { "name": "Nicaragua", "abbreviation": "NI" }, { "name": "Niger", "abbreviation": "NE" }, { "name": "Nigeria", "abbreviation": "NG" }, { "name": "Niue", "abbreviation": "NU" }, { "name": "Norfolk Island", "abbreviation": "NF" }, { "name": "North Korea", "abbreviation": "KP" }, { "name": "Northern Mariana Islands", "abbreviation": "MP" }, { "name": "Norway", "abbreviation": "NO" }, { "name": "Oman", "abbreviation": "OM" }, { "name": "Pakistan", "abbreviation": "PK" }, { "name": "Palau", "abbreviation": "PW" }, { "name": "Palestinian Territories", "abbreviation": "PS" }, { "name": "Panama", "abbreviation": "PA" }, { "name": "Papua New Guinea", "abbreviation": "PG" }, { "name": "Paraguay", "abbreviation": "PY" }, { "name": "Peru", "abbreviation": "PE" }, { "name": "Philippines", "abbreviation": "PH" }, { "name": "Pitcairn Islands", "abbreviation": "PN" }, { "name": "Poland", "abbreviation": "PL" }, { "name": "Portugal", "abbreviation": "PT" }, { "name": "Puerto Rico", "abbreviation": "PR" }, { "name": "Qatar", "abbreviation": "QA" }, { "name": "R\xE9union", "abbreviation": "RE" }, { "name": "Romania", "abbreviation": "RO" }, { "name": "Russia", "abbreviation": "RU" }, { "name": "Rwanda", "abbreviation": "RW" }, { "name": "Samoa", "abbreviation": "WS" }, { "name": "San Marino", "abbreviation": "SM" }, { "name": "S\xE3o Tom\xE9 and Pr\xEDncipe", "abbreviation": "ST" }, { "name": "Saudi Arabia", "abbreviation": "SA" }, { "name": "Senegal", "abbreviation": "SN" }, { "name": "Serbia", "abbreviation": "RS" }, { "name": "Seychelles", "abbreviation": "SC" }, { "name": "Sierra Leone", "abbreviation": "SL" }, { "name": "Singapore", "abbreviation": "SG" }, { "name": "Sint Maarten", "abbreviation": "SX" }, { "name": "Slovakia", "abbreviation": "SK" }, { "name": "Slovenia", "abbreviation": "SI" }, { "name": "Solomon Islands", "abbreviation": "SB" }, { "name": "Somalia", "abbreviation": "SO" }, { "name": "South Africa", "abbreviation": "ZA" }, { "name": "South Georgia & South Sandwich Islands", "abbreviation": "GS" }, { "name": "South Korea", "abbreviation": "KR" }, { "name": "South Sudan", "abbreviation": "SS" }, { "name": "Spain", "abbreviation": "ES" }, { "name": "Sri Lanka", "abbreviation": "LK" }, { "name": "St. Barth\xE9lemy", "abbreviation": "BL" }, { "name": "St. Helena", "abbreviation": "SH" }, { "name": "St. Kitts & Nevis", "abbreviation": "KN" }, { "name": "St. Lucia", "abbreviation": "LC" }, { "name": "St. Martin", "abbreviation": "MF" }, { "name": "St. Pierre & Miquelon", "abbreviation": "PM" }, { "name": "St. Vincent & Grenadines", "abbreviation": "VC" }, { "name": "Sudan", "abbreviation": "SD" }, { "name": "Suriname", "abbreviation": "SR" }, { "name": "Svalbard & Jan Mayen", "abbreviation": "SJ" }, { "name": "Swaziland", "abbreviation": "SZ" }, { "name": "Sweden", "abbreviation": "SE" }, { "name": "Switzerland", "abbreviation": "CH" }, { "name": "Syria", "abbreviation": "SY" }, { "name": "Taiwan", "abbreviation": "TW" }, { "name": "Tajikistan", "abbreviation": "TJ" }, { "name": "Tanzania", "abbreviation": "TZ" }, { "name": "Thailand", "abbreviation": "TH" }, { "name": "Timor-Leste", "abbreviation": "TL" }, { "name": "Togo", "abbreviation": "TG" }, { "name": "Tokelau", "abbreviation": "TK" }, { "name": "Tonga", "abbreviation": "TO" }, { "name": "Trinidad & Tobago", "abbreviation": "TT" }, { "name": "Tristan da Cunha", "abbreviation": "TA" }, { "name": "Tunisia", "abbreviation": "TN" }, { "name": "Turkey", "abbreviation": "TR" }, { "name": "Turkmenistan", "abbreviation": "TM" }, { "name": "Turks & Caicos Islands", "abbreviation": "TC" }, { "name": "Tuvalu", "abbreviation": "TV" }, { "name": "U.S. Outlying Islands", "abbreviation": "UM" }, { "name": "U.S. Virgin Islands", "abbreviation": "VI" }, { "name": "Uganda", "abbreviation": "UG" }, { "name": "Ukraine", "abbreviation": "UA" }, { "name": "United Arab Emirates", "abbreviation": "AE" }, { "name": "United Kingdom", "abbreviation": "GB" }, { "name": "United States", "abbreviation": "US" }, { "name": "Uruguay", "abbreviation": "UY" }, { "name": "Uzbekistan", "abbreviation": "UZ" }, { "name": "Vanuatu", "abbreviation": "VU" }, { "name": "Vatican City", "abbreviation": "VA" }, { "name": "Venezuela", "abbreviation": "VE" }, { "name": "Vietnam", "abbreviation": "VN" }, { "name": "Wallis & Futuna", "abbreviation": "WF" }, { "name": "Western Sahara", "abbreviation": "EH" }, { "name": "Yemen", "abbreviation": "YE" }, { "name": "Zambia", "abbreviation": "ZM" }, { "name": "Zimbabwe", "abbreviation": "ZW" }],
          counties: {
            // Data taken from http://www.downloadexcelfiles.com/gb_en/download-excel-file-list-counties-uk
            "uk": [
              { name: "Bath and North East Somerset" },
              { name: "Aberdeenshire" },
              { name: "Anglesey" },
              { name: "Angus" },
              { name: "Bedford" },
              { name: "Blackburn with Darwen" },
              { name: "Blackpool" },
              { name: "Bournemouth" },
              { name: "Bracknell Forest" },
              { name: "Brighton & Hove" },
              { name: "Bristol" },
              { name: "Buckinghamshire" },
              { name: "Cambridgeshire" },
              { name: "Carmarthenshire" },
              { name: "Central Bedfordshire" },
              { name: "Ceredigion" },
              { name: "Cheshire East" },
              { name: "Cheshire West and Chester" },
              { name: "Clackmannanshire" },
              { name: "Conwy" },
              { name: "Cornwall" },
              { name: "County Antrim" },
              { name: "County Armagh" },
              { name: "County Down" },
              { name: "County Durham" },
              { name: "County Fermanagh" },
              { name: "County Londonderry" },
              { name: "County Tyrone" },
              { name: "Cumbria" },
              { name: "Darlington" },
              { name: "Denbighshire" },
              { name: "Derby" },
              { name: "Derbyshire" },
              { name: "Devon" },
              { name: "Dorset" },
              { name: "Dumfries and Galloway" },
              { name: "Dundee" },
              { name: "East Lothian" },
              { name: "East Riding of Yorkshire" },
              { name: "East Sussex" },
              { name: "Edinburgh?" },
              { name: "Essex" },
              { name: "Falkirk" },
              { name: "Fife" },
              { name: "Flintshire" },
              { name: "Gloucestershire" },
              { name: "Greater London" },
              { name: "Greater Manchester" },
              { name: "Gwent" },
              { name: "Gwynedd" },
              { name: "Halton" },
              { name: "Hampshire" },
              { name: "Hartlepool" },
              { name: "Herefordshire" },
              { name: "Hertfordshire" },
              { name: "Highlands" },
              { name: "Hull" },
              { name: "Isle of Wight" },
              { name: "Isles of Scilly" },
              { name: "Kent" },
              { name: "Lancashire" },
              { name: "Leicester" },
              { name: "Leicestershire" },
              { name: "Lincolnshire" },
              { name: "Lothian" },
              { name: "Luton" },
              { name: "Medway" },
              { name: "Merseyside" },
              { name: "Mid Glamorgan" },
              { name: "Middlesbrough" },
              { name: "Milton Keynes" },
              { name: "Monmouthshire" },
              { name: "Moray" },
              { name: "Norfolk" },
              { name: "North East Lincolnshire" },
              { name: "North Lincolnshire" },
              { name: "North Somerset" },
              { name: "North Yorkshire" },
              { name: "Northamptonshire" },
              { name: "Northumberland" },
              { name: "Nottingham" },
              { name: "Nottinghamshire" },
              { name: "Oxfordshire" },
              { name: "Pembrokeshire" },
              { name: "Perth and Kinross" },
              { name: "Peterborough" },
              { name: "Plymouth" },
              { name: "Poole" },
              { name: "Portsmouth" },
              { name: "Powys" },
              { name: "Reading" },
              { name: "Redcar and Cleveland" },
              { name: "Rutland" },
              { name: "Scottish Borders" },
              { name: "Shropshire" },
              { name: "Slough" },
              { name: "Somerset" },
              { name: "South Glamorgan" },
              { name: "South Gloucestershire" },
              { name: "South Yorkshire" },
              { name: "Southampton" },
              { name: "Southend-on-Sea" },
              { name: "Staffordshire" },
              { name: "Stirlingshire" },
              { name: "Stockton-on-Tees" },
              { name: "Stoke-on-Trent" },
              { name: "Strathclyde" },
              { name: "Suffolk" },
              { name: "Surrey" },
              { name: "Swindon" },
              { name: "Telford and Wrekin" },
              { name: "Thurrock" },
              { name: "Torbay" },
              { name: "Tyne and Wear" },
              { name: "Warrington" },
              { name: "Warwickshire" },
              { name: "West Berkshire" },
              { name: "West Glamorgan" },
              { name: "West Lothian" },
              { name: "West Midlands" },
              { name: "West Sussex" },
              { name: "West Yorkshire" },
              { name: "Western Isles" },
              { name: "Wiltshire" },
              { name: "Windsor and Maidenhead" },
              { name: "Wokingham" },
              { name: "Worcestershire" },
              { name: "Wrexham" },
              { name: "York" }
            ]
          },
          provinces: {
            "ca": [
              { name: "Alberta", abbreviation: "AB" },
              { name: "British Columbia", abbreviation: "BC" },
              { name: "Manitoba", abbreviation: "MB" },
              { name: "New Brunswick", abbreviation: "NB" },
              { name: "Newfoundland and Labrador", abbreviation: "NL" },
              { name: "Nova Scotia", abbreviation: "NS" },
              { name: "Ontario", abbreviation: "ON" },
              { name: "Prince Edward Island", abbreviation: "PE" },
              { name: "Quebec", abbreviation: "QC" },
              { name: "Saskatchewan", abbreviation: "SK" },
              // The case could be made that the following are not actually provinces
              // since they are technically considered "territories" however they all
              // look the same on an envelope!
              { name: "Northwest Territories", abbreviation: "NT" },
              { name: "Nunavut", abbreviation: "NU" },
              { name: "Yukon", abbreviation: "YT" }
            ],
            "it": [
              { name: "Agrigento", abbreviation: "AG", code: 84 },
              { name: "Alessandria", abbreviation: "AL", code: 6 },
              { name: "Ancona", abbreviation: "AN", code: 42 },
              { name: "Aosta", abbreviation: "AO", code: 7 },
              { name: "L'Aquila", abbreviation: "AQ", code: 66 },
              { name: "Arezzo", abbreviation: "AR", code: 51 },
              { name: "Ascoli-Piceno", abbreviation: "AP", code: 44 },
              { name: "Asti", abbreviation: "AT", code: 5 },
              { name: "Avellino", abbreviation: "AV", code: 64 },
              { name: "Bari", abbreviation: "BA", code: 72 },
              { name: "Barletta-Andria-Trani", abbreviation: "BT", code: 72 },
              { name: "Belluno", abbreviation: "BL", code: 25 },
              { name: "Benevento", abbreviation: "BN", code: 62 },
              { name: "Bergamo", abbreviation: "BG", code: 16 },
              { name: "Biella", abbreviation: "BI", code: 96 },
              { name: "Bologna", abbreviation: "BO", code: 37 },
              { name: "Bolzano", abbreviation: "BZ", code: 21 },
              { name: "Brescia", abbreviation: "BS", code: 17 },
              { name: "Brindisi", abbreviation: "BR", code: 74 },
              { name: "Cagliari", abbreviation: "CA", code: 92 },
              { name: "Caltanissetta", abbreviation: "CL", code: 85 },
              { name: "Campobasso", abbreviation: "CB", code: 70 },
              { name: "Carbonia Iglesias", abbreviation: "CI", code: 70 },
              { name: "Caserta", abbreviation: "CE", code: 61 },
              { name: "Catania", abbreviation: "CT", code: 87 },
              { name: "Catanzaro", abbreviation: "CZ", code: 79 },
              { name: "Chieti", abbreviation: "CH", code: 69 },
              { name: "Como", abbreviation: "CO", code: 13 },
              { name: "Cosenza", abbreviation: "CS", code: 78 },
              { name: "Cremona", abbreviation: "CR", code: 19 },
              { name: "Crotone", abbreviation: "KR", code: 101 },
              { name: "Cuneo", abbreviation: "CN", code: 4 },
              { name: "Enna", abbreviation: "EN", code: 86 },
              { name: "Fermo", abbreviation: "FM", code: 86 },
              { name: "Ferrara", abbreviation: "FE", code: 38 },
              { name: "Firenze", abbreviation: "FI", code: 48 },
              { name: "Foggia", abbreviation: "FG", code: 71 },
              { name: "Forli-Cesena", abbreviation: "FC", code: 71 },
              { name: "Frosinone", abbreviation: "FR", code: 60 },
              { name: "Genova", abbreviation: "GE", code: 10 },
              { name: "Gorizia", abbreviation: "GO", code: 31 },
              { name: "Grosseto", abbreviation: "GR", code: 53 },
              { name: "Imperia", abbreviation: "IM", code: 8 },
              { name: "Isernia", abbreviation: "IS", code: 94 },
              { name: "La-Spezia", abbreviation: "SP", code: 66 },
              { name: "Latina", abbreviation: "LT", code: 59 },
              { name: "Lecce", abbreviation: "LE", code: 75 },
              { name: "Lecco", abbreviation: "LC", code: 97 },
              { name: "Livorno", abbreviation: "LI", code: 49 },
              { name: "Lodi", abbreviation: "LO", code: 98 },
              { name: "Lucca", abbreviation: "LU", code: 46 },
              { name: "Macerata", abbreviation: "MC", code: 43 },
              { name: "Mantova", abbreviation: "MN", code: 20 },
              { name: "Massa-Carrara", abbreviation: "MS", code: 45 },
              { name: "Matera", abbreviation: "MT", code: 77 },
              { name: "Medio Campidano", abbreviation: "VS", code: 77 },
              { name: "Messina", abbreviation: "ME", code: 83 },
              { name: "Milano", abbreviation: "MI", code: 15 },
              { name: "Modena", abbreviation: "MO", code: 36 },
              { name: "Monza-Brianza", abbreviation: "MB", code: 36 },
              { name: "Napoli", abbreviation: "NA", code: 63 },
              { name: "Novara", abbreviation: "NO", code: 3 },
              { name: "Nuoro", abbreviation: "NU", code: 91 },
              { name: "Ogliastra", abbreviation: "OG", code: 91 },
              { name: "Olbia Tempio", abbreviation: "OT", code: 91 },
              { name: "Oristano", abbreviation: "OR", code: 95 },
              { name: "Padova", abbreviation: "PD", code: 28 },
              { name: "Palermo", abbreviation: "PA", code: 82 },
              { name: "Parma", abbreviation: "PR", code: 34 },
              { name: "Pavia", abbreviation: "PV", code: 18 },
              { name: "Perugia", abbreviation: "PG", code: 54 },
              { name: "Pesaro-Urbino", abbreviation: "PU", code: 41 },
              { name: "Pescara", abbreviation: "PE", code: 68 },
              { name: "Piacenza", abbreviation: "PC", code: 33 },
              { name: "Pisa", abbreviation: "PI", code: 50 },
              { name: "Pistoia", abbreviation: "PT", code: 47 },
              { name: "Pordenone", abbreviation: "PN", code: 93 },
              { name: "Potenza", abbreviation: "PZ", code: 76 },
              { name: "Prato", abbreviation: "PO", code: 100 },
              { name: "Ragusa", abbreviation: "RG", code: 88 },
              { name: "Ravenna", abbreviation: "RA", code: 39 },
              { name: "Reggio-Calabria", abbreviation: "RC", code: 35 },
              { name: "Reggio-Emilia", abbreviation: "RE", code: 35 },
              { name: "Rieti", abbreviation: "RI", code: 57 },
              { name: "Rimini", abbreviation: "RN", code: 99 },
              { name: "Roma", abbreviation: "Roma", code: 58 },
              { name: "Rovigo", abbreviation: "RO", code: 29 },
              { name: "Salerno", abbreviation: "SA", code: 65 },
              { name: "Sassari", abbreviation: "SS", code: 90 },
              { name: "Savona", abbreviation: "SV", code: 9 },
              { name: "Siena", abbreviation: "SI", code: 52 },
              { name: "Siracusa", abbreviation: "SR", code: 89 },
              { name: "Sondrio", abbreviation: "SO", code: 14 },
              { name: "Taranto", abbreviation: "TA", code: 73 },
              { name: "Teramo", abbreviation: "TE", code: 67 },
              { name: "Terni", abbreviation: "TR", code: 55 },
              { name: "Torino", abbreviation: "TO", code: 1 },
              { name: "Trapani", abbreviation: "TP", code: 81 },
              { name: "Trento", abbreviation: "TN", code: 22 },
              { name: "Treviso", abbreviation: "TV", code: 26 },
              { name: "Trieste", abbreviation: "TS", code: 32 },
              { name: "Udine", abbreviation: "UD", code: 30 },
              { name: "Varese", abbreviation: "VA", code: 12 },
              { name: "Venezia", abbreviation: "VE", code: 27 },
              { name: "Verbania", abbreviation: "VB", code: 27 },
              { name: "Vercelli", abbreviation: "VC", code: 2 },
              { name: "Verona", abbreviation: "VR", code: 23 },
              { name: "Vibo-Valentia", abbreviation: "VV", code: 102 },
              { name: "Vicenza", abbreviation: "VI", code: 24 },
              { name: "Viterbo", abbreviation: "VT", code: 56 }
            ]
          },
          // from: https://github.com/samsargent/Useful-Autocomplete-Data/blob/master/data/nationalities.json
          nationalities: [
            { name: "Afghan" },
            { name: "Albanian" },
            { name: "Algerian" },
            { name: "American" },
            { name: "Andorran" },
            { name: "Angolan" },
            { name: "Antiguans" },
            { name: "Argentinean" },
            { name: "Armenian" },
            { name: "Australian" },
            { name: "Austrian" },
            { name: "Azerbaijani" },
            { name: "Bahami" },
            { name: "Bahraini" },
            { name: "Bangladeshi" },
            { name: "Barbadian" },
            { name: "Barbudans" },
            { name: "Batswana" },
            { name: "Belarusian" },
            { name: "Belgian" },
            { name: "Belizean" },
            { name: "Beninese" },
            { name: "Bhutanese" },
            { name: "Bolivian" },
            { name: "Bosnian" },
            { name: "Brazilian" },
            { name: "British" },
            { name: "Bruneian" },
            { name: "Bulgarian" },
            { name: "Burkinabe" },
            { name: "Burmese" },
            { name: "Burundian" },
            { name: "Cambodian" },
            { name: "Cameroonian" },
            { name: "Canadian" },
            { name: "Cape Verdean" },
            { name: "Central African" },
            { name: "Chadian" },
            { name: "Chilean" },
            { name: "Chinese" },
            { name: "Colombian" },
            { name: "Comoran" },
            { name: "Congolese" },
            { name: "Costa Rican" },
            { name: "Croatian" },
            { name: "Cuban" },
            { name: "Cypriot" },
            { name: "Czech" },
            { name: "Danish" },
            { name: "Djibouti" },
            { name: "Dominican" },
            { name: "Dutch" },
            { name: "East Timorese" },
            { name: "Ecuadorean" },
            { name: "Egyptian" },
            { name: "Emirian" },
            { name: "Equatorial Guinean" },
            { name: "Eritrean" },
            { name: "Estonian" },
            { name: "Ethiopian" },
            { name: "Fijian" },
            { name: "Filipino" },
            { name: "Finnish" },
            { name: "French" },
            { name: "Gabonese" },
            { name: "Gambian" },
            { name: "Georgian" },
            { name: "German" },
            { name: "Ghanaian" },
            { name: "Greek" },
            { name: "Grenadian" },
            { name: "Guatemalan" },
            { name: "Guinea-Bissauan" },
            { name: "Guinean" },
            { name: "Guyanese" },
            { name: "Haitian" },
            { name: "Herzegovinian" },
            { name: "Honduran" },
            { name: "Hungarian" },
            { name: "I-Kiribati" },
            { name: "Icelander" },
            { name: "Indian" },
            { name: "Indonesian" },
            { name: "Iranian" },
            { name: "Iraqi" },
            { name: "Irish" },
            { name: "Israeli" },
            { name: "Italian" },
            { name: "Ivorian" },
            { name: "Jamaican" },
            { name: "Japanese" },
            { name: "Jordanian" },
            { name: "Kazakhstani" },
            { name: "Kenyan" },
            { name: "Kittian and Nevisian" },
            { name: "Kuwaiti" },
            { name: "Kyrgyz" },
            { name: "Laotian" },
            { name: "Latvian" },
            { name: "Lebanese" },
            { name: "Liberian" },
            { name: "Libyan" },
            { name: "Liechtensteiner" },
            { name: "Lithuanian" },
            { name: "Luxembourger" },
            { name: "Macedonian" },
            { name: "Malagasy" },
            { name: "Malawian" },
            { name: "Malaysian" },
            { name: "Maldivan" },
            { name: "Malian" },
            { name: "Maltese" },
            { name: "Marshallese" },
            { name: "Mauritanian" },
            { name: "Mauritian" },
            { name: "Mexican" },
            { name: "Micronesian" },
            { name: "Moldovan" },
            { name: "Monacan" },
            { name: "Mongolian" },
            { name: "Moroccan" },
            { name: "Mosotho" },
            { name: "Motswana" },
            { name: "Mozambican" },
            { name: "Namibian" },
            { name: "Nauruan" },
            { name: "Nepalese" },
            { name: "New Zealander" },
            { name: "Nicaraguan" },
            { name: "Nigerian" },
            { name: "Nigerien" },
            { name: "North Korean" },
            { name: "Northern Irish" },
            { name: "Norwegian" },
            { name: "Omani" },
            { name: "Pakistani" },
            { name: "Palauan" },
            { name: "Panamanian" },
            { name: "Papua New Guinean" },
            { name: "Paraguayan" },
            { name: "Peruvian" },
            { name: "Polish" },
            { name: "Portuguese" },
            { name: "Qatari" },
            { name: "Romani" },
            { name: "Russian" },
            { name: "Rwandan" },
            { name: "Saint Lucian" },
            { name: "Salvadoran" },
            { name: "Samoan" },
            { name: "San Marinese" },
            { name: "Sao Tomean" },
            { name: "Saudi" },
            { name: "Scottish" },
            { name: "Senegalese" },
            { name: "Serbian" },
            { name: "Seychellois" },
            { name: "Sierra Leonean" },
            { name: "Singaporean" },
            { name: "Slovakian" },
            { name: "Slovenian" },
            { name: "Solomon Islander" },
            { name: "Somali" },
            { name: "South African" },
            { name: "South Korean" },
            { name: "Spanish" },
            { name: "Sri Lankan" },
            { name: "Sudanese" },
            { name: "Surinamer" },
            { name: "Swazi" },
            { name: "Swedish" },
            { name: "Swiss" },
            { name: "Syrian" },
            { name: "Taiwanese" },
            { name: "Tajik" },
            { name: "Tanzanian" },
            { name: "Thai" },
            { name: "Togolese" },
            { name: "Tongan" },
            { name: "Trinidadian or Tobagonian" },
            { name: "Tunisian" },
            { name: "Turkish" },
            { name: "Tuvaluan" },
            { name: "Ugandan" },
            { name: "Ukrainian" },
            { name: "Uruguaya" },
            { name: "Uzbekistani" },
            { name: "Venezuela" },
            { name: "Vietnamese" },
            { name: "Wels" },
            { name: "Yemenit" },
            { name: "Zambia" },
            { name: "Zimbabwe" }
          ],
          // http://www.loc.gov/standards/iso639-2/php/code_list.php (ISO-639-1 codes)
          locale_languages: [
            "aa",
            "ab",
            "ae",
            "af",
            "ak",
            "am",
            "an",
            "ar",
            "as",
            "av",
            "ay",
            "az",
            "ba",
            "be",
            "bg",
            "bh",
            "bi",
            "bm",
            "bn",
            "bo",
            "br",
            "bs",
            "ca",
            "ce",
            "ch",
            "co",
            "cr",
            "cs",
            "cu",
            "cv",
            "cy",
            "da",
            "de",
            "dv",
            "dz",
            "ee",
            "el",
            "en",
            "eo",
            "es",
            "et",
            "eu",
            "fa",
            "ff",
            "fi",
            "fj",
            "fo",
            "fr",
            "fy",
            "ga",
            "gd",
            "gl",
            "gn",
            "gu",
            "gv",
            "ha",
            "he",
            "hi",
            "ho",
            "hr",
            "ht",
            "hu",
            "hy",
            "hz",
            "ia",
            "id",
            "ie",
            "ig",
            "ii",
            "ik",
            "io",
            "is",
            "it",
            "iu",
            "ja",
            "jv",
            "ka",
            "kg",
            "ki",
            "kj",
            "kk",
            "kl",
            "km",
            "kn",
            "ko",
            "kr",
            "ks",
            "ku",
            "kv",
            "kw",
            "ky",
            "la",
            "lb",
            "lg",
            "li",
            "ln",
            "lo",
            "lt",
            "lu",
            "lv",
            "mg",
            "mh",
            "mi",
            "mk",
            "ml",
            "mn",
            "mr",
            "ms",
            "mt",
            "my",
            "na",
            "nb",
            "nd",
            "ne",
            "ng",
            "nl",
            "nn",
            "no",
            "nr",
            "nv",
            "ny",
            "oc",
            "oj",
            "om",
            "or",
            "os",
            "pa",
            "pi",
            "pl",
            "ps",
            "pt",
            "qu",
            "rm",
            "rn",
            "ro",
            "ru",
            "rw",
            "sa",
            "sc",
            "sd",
            "se",
            "sg",
            "si",
            "sk",
            "sl",
            "sm",
            "sn",
            "so",
            "sq",
            "sr",
            "ss",
            "st",
            "su",
            "sv",
            "sw",
            "ta",
            "te",
            "tg",
            "th",
            "ti",
            "tk",
            "tl",
            "tn",
            "to",
            "tr",
            "ts",
            "tt",
            "tw",
            "ty",
            "ug",
            "uk",
            "ur",
            "uz",
            "ve",
            "vi",
            "vo",
            "wa",
            "wo",
            "xh",
            "yi",
            "yo",
            "za",
            "zh",
            "zu"
          ],
          // From http://data.okfn.org/data/core/language-codes#resource-language-codes-full (IETF language tags)
          locale_regions: [
            "agq-CM",
            "asa-TZ",
            "ast-ES",
            "bas-CM",
            "bem-ZM",
            "bez-TZ",
            "brx-IN",
            "cgg-UG",
            "chr-US",
            "dav-KE",
            "dje-NE",
            "dsb-DE",
            "dua-CM",
            "dyo-SN",
            "ebu-KE",
            "ewo-CM",
            "fil-PH",
            "fur-IT",
            "gsw-CH",
            "gsw-FR",
            "gsw-LI",
            "guz-KE",
            "haw-US",
            "hsb-DE",
            "jgo-CM",
            "jmc-TZ",
            "kab-DZ",
            "kam-KE",
            "kde-TZ",
            "kea-CV",
            "khq-ML",
            "kkj-CM",
            "kln-KE",
            "kok-IN",
            "ksb-TZ",
            "ksf-CM",
            "ksh-DE",
            "lag-TZ",
            "lkt-US",
            "luo-KE",
            "luy-KE",
            "mas-KE",
            "mas-TZ",
            "mer-KE",
            "mfe-MU",
            "mgh-MZ",
            "mgo-CM",
            "mua-CM",
            "naq-NA",
            "nmg-CM",
            "nnh-CM",
            "nus-SD",
            "nyn-UG",
            "rof-TZ",
            "rwk-TZ",
            "sah-RU",
            "saq-KE",
            "sbp-TZ",
            "seh-MZ",
            "ses-ML",
            "shi-Latn",
            "shi-Latn-MA",
            "shi-Tfng",
            "shi-Tfng-MA",
            "smn-FI",
            "teo-KE",
            "teo-UG",
            "twq-NE",
            "tzm-Latn",
            "tzm-Latn-MA",
            "vai-Latn",
            "vai-Latn-LR",
            "vai-Vaii",
            "vai-Vaii-LR",
            "vun-TZ",
            "wae-CH",
            "xog-UG",
            "yav-CM",
            "zgh-MA",
            "af-NA",
            "af-ZA",
            "ak-GH",
            "am-ET",
            "ar-001",
            "ar-AE",
            "ar-BH",
            "ar-DJ",
            "ar-DZ",
            "ar-EG",
            "ar-EH",
            "ar-ER",
            "ar-IL",
            "ar-IQ",
            "ar-JO",
            "ar-KM",
            "ar-KW",
            "ar-LB",
            "ar-LY",
            "ar-MA",
            "ar-MR",
            "ar-OM",
            "ar-PS",
            "ar-QA",
            "ar-SA",
            "ar-SD",
            "ar-SO",
            "ar-SS",
            "ar-SY",
            "ar-TD",
            "ar-TN",
            "ar-YE",
            "as-IN",
            "az-Cyrl",
            "az-Cyrl-AZ",
            "az-Latn",
            "az-Latn-AZ",
            "be-BY",
            "bg-BG",
            "bm-Latn",
            "bm-Latn-ML",
            "bn-BD",
            "bn-IN",
            "bo-CN",
            "bo-IN",
            "br-FR",
            "bs-Cyrl",
            "bs-Cyrl-BA",
            "bs-Latn",
            "bs-Latn-BA",
            "ca-AD",
            "ca-ES",
            "ca-ES-VALENCIA",
            "ca-FR",
            "ca-IT",
            "cs-CZ",
            "cy-GB",
            "da-DK",
            "da-GL",
            "de-AT",
            "de-BE",
            "de-CH",
            "de-DE",
            "de-LI",
            "de-LU",
            "dz-BT",
            "ee-GH",
            "ee-TG",
            "el-CY",
            "el-GR",
            "en-001",
            "en-150",
            "en-AG",
            "en-AI",
            "en-AS",
            "en-AU",
            "en-BB",
            "en-BE",
            "en-BM",
            "en-BS",
            "en-BW",
            "en-BZ",
            "en-CA",
            "en-CC",
            "en-CK",
            "en-CM",
            "en-CX",
            "en-DG",
            "en-DM",
            "en-ER",
            "en-FJ",
            "en-FK",
            "en-FM",
            "en-GB",
            "en-GD",
            "en-GG",
            "en-GH",
            "en-GI",
            "en-GM",
            "en-GU",
            "en-GY",
            "en-HK",
            "en-IE",
            "en-IM",
            "en-IN",
            "en-IO",
            "en-JE",
            "en-JM",
            "en-KE",
            "en-KI",
            "en-KN",
            "en-KY",
            "en-LC",
            "en-LR",
            "en-LS",
            "en-MG",
            "en-MH",
            "en-MO",
            "en-MP",
            "en-MS",
            "en-MT",
            "en-MU",
            "en-MW",
            "en-MY",
            "en-NA",
            "en-NF",
            "en-NG",
            "en-NR",
            "en-NU",
            "en-NZ",
            "en-PG",
            "en-PH",
            "en-PK",
            "en-PN",
            "en-PR",
            "en-PW",
            "en-RW",
            "en-SB",
            "en-SC",
            "en-SD",
            "en-SG",
            "en-SH",
            "en-SL",
            "en-SS",
            "en-SX",
            "en-SZ",
            "en-TC",
            "en-TK",
            "en-TO",
            "en-TT",
            "en-TV",
            "en-TZ",
            "en-UG",
            "en-UM",
            "en-US",
            "en-US-POSIX",
            "en-VC",
            "en-VG",
            "en-VI",
            "en-VU",
            "en-WS",
            "en-ZA",
            "en-ZM",
            "en-ZW",
            "eo-001",
            "es-419",
            "es-AR",
            "es-BO",
            "es-CL",
            "es-CO",
            "es-CR",
            "es-CU",
            "es-DO",
            "es-EA",
            "es-EC",
            "es-ES",
            "es-GQ",
            "es-GT",
            "es-HN",
            "es-IC",
            "es-MX",
            "es-NI",
            "es-PA",
            "es-PE",
            "es-PH",
            "es-PR",
            "es-PY",
            "es-SV",
            "es-US",
            "es-UY",
            "es-VE",
            "et-EE",
            "eu-ES",
            "fa-AF",
            "fa-IR",
            "ff-CM",
            "ff-GN",
            "ff-MR",
            "ff-SN",
            "fi-FI",
            "fo-FO",
            "fr-BE",
            "fr-BF",
            "fr-BI",
            "fr-BJ",
            "fr-BL",
            "fr-CA",
            "fr-CD",
            "fr-CF",
            "fr-CG",
            "fr-CH",
            "fr-CI",
            "fr-CM",
            "fr-DJ",
            "fr-DZ",
            "fr-FR",
            "fr-GA",
            "fr-GF",
            "fr-GN",
            "fr-GP",
            "fr-GQ",
            "fr-HT",
            "fr-KM",
            "fr-LU",
            "fr-MA",
            "fr-MC",
            "fr-MF",
            "fr-MG",
            "fr-ML",
            "fr-MQ",
            "fr-MR",
            "fr-MU",
            "fr-NC",
            "fr-NE",
            "fr-PF",
            "fr-PM",
            "fr-RE",
            "fr-RW",
            "fr-SC",
            "fr-SN",
            "fr-SY",
            "fr-TD",
            "fr-TG",
            "fr-TN",
            "fr-VU",
            "fr-WF",
            "fr-YT",
            "fy-NL",
            "ga-IE",
            "gd-GB",
            "gl-ES",
            "gu-IN",
            "gv-IM",
            "ha-Latn",
            "ha-Latn-GH",
            "ha-Latn-NE",
            "ha-Latn-NG",
            "he-IL",
            "hi-IN",
            "hr-BA",
            "hr-HR",
            "hu-HU",
            "hy-AM",
            "id-ID",
            "ig-NG",
            "ii-CN",
            "is-IS",
            "it-CH",
            "it-IT",
            "it-SM",
            "ja-JP",
            "ka-GE",
            "ki-KE",
            "kk-Cyrl",
            "kk-Cyrl-KZ",
            "kl-GL",
            "km-KH",
            "kn-IN",
            "ko-KP",
            "ko-KR",
            "ks-Arab",
            "ks-Arab-IN",
            "kw-GB",
            "ky-Cyrl",
            "ky-Cyrl-KG",
            "lb-LU",
            "lg-UG",
            "ln-AO",
            "ln-CD",
            "ln-CF",
            "ln-CG",
            "lo-LA",
            "lt-LT",
            "lu-CD",
            "lv-LV",
            "mg-MG",
            "mk-MK",
            "ml-IN",
            "mn-Cyrl",
            "mn-Cyrl-MN",
            "mr-IN",
            "ms-Latn",
            "ms-Latn-BN",
            "ms-Latn-MY",
            "ms-Latn-SG",
            "mt-MT",
            "my-MM",
            "nb-NO",
            "nb-SJ",
            "nd-ZW",
            "ne-IN",
            "ne-NP",
            "nl-AW",
            "nl-BE",
            "nl-BQ",
            "nl-CW",
            "nl-NL",
            "nl-SR",
            "nl-SX",
            "nn-NO",
            "om-ET",
            "om-KE",
            "or-IN",
            "os-GE",
            "os-RU",
            "pa-Arab",
            "pa-Arab-PK",
            "pa-Guru",
            "pa-Guru-IN",
            "pl-PL",
            "ps-AF",
            "pt-AO",
            "pt-BR",
            "pt-CV",
            "pt-GW",
            "pt-MO",
            "pt-MZ",
            "pt-PT",
            "pt-ST",
            "pt-TL",
            "qu-BO",
            "qu-EC",
            "qu-PE",
            "rm-CH",
            "rn-BI",
            "ro-MD",
            "ro-RO",
            "ru-BY",
            "ru-KG",
            "ru-KZ",
            "ru-MD",
            "ru-RU",
            "ru-UA",
            "rw-RW",
            "se-FI",
            "se-NO",
            "se-SE",
            "sg-CF",
            "si-LK",
            "sk-SK",
            "sl-SI",
            "sn-ZW",
            "so-DJ",
            "so-ET",
            "so-KE",
            "so-SO",
            "sq-AL",
            "sq-MK",
            "sq-XK",
            "sr-Cyrl",
            "sr-Cyrl-BA",
            "sr-Cyrl-ME",
            "sr-Cyrl-RS",
            "sr-Cyrl-XK",
            "sr-Latn",
            "sr-Latn-BA",
            "sr-Latn-ME",
            "sr-Latn-RS",
            "sr-Latn-XK",
            "sv-AX",
            "sv-FI",
            "sv-SE",
            "sw-CD",
            "sw-KE",
            "sw-TZ",
            "sw-UG",
            "ta-IN",
            "ta-LK",
            "ta-MY",
            "ta-SG",
            "te-IN",
            "th-TH",
            "ti-ER",
            "ti-ET",
            "to-TO",
            "tr-CY",
            "tr-TR",
            "ug-Arab",
            "ug-Arab-CN",
            "uk-UA",
            "ur-IN",
            "ur-PK",
            "uz-Arab",
            "uz-Arab-AF",
            "uz-Cyrl",
            "uz-Cyrl-UZ",
            "uz-Latn",
            "uz-Latn-UZ",
            "vi-VN",
            "yi-001",
            "yo-BJ",
            "yo-NG",
            "zh-Hans",
            "zh-Hans-CN",
            "zh-Hans-HK",
            "zh-Hans-MO",
            "zh-Hans-SG",
            "zh-Hant",
            "zh-Hant-HK",
            "zh-Hant-MO",
            "zh-Hant-TW",
            "zu-ZA"
          ],
          us_states_and_dc: [
            { name: "Alabama", abbreviation: "AL" },
            { name: "Alaska", abbreviation: "AK" },
            { name: "Arizona", abbreviation: "AZ" },
            { name: "Arkansas", abbreviation: "AR" },
            { name: "California", abbreviation: "CA" },
            { name: "Colorado", abbreviation: "CO" },
            { name: "Connecticut", abbreviation: "CT" },
            { name: "Delaware", abbreviation: "DE" },
            { name: "District of Columbia", abbreviation: "DC" },
            { name: "Florida", abbreviation: "FL" },
            { name: "Georgia", abbreviation: "GA" },
            { name: "Hawaii", abbreviation: "HI" },
            { name: "Idaho", abbreviation: "ID" },
            { name: "Illinois", abbreviation: "IL" },
            { name: "Indiana", abbreviation: "IN" },
            { name: "Iowa", abbreviation: "IA" },
            { name: "Kansas", abbreviation: "KS" },
            { name: "Kentucky", abbreviation: "KY" },
            { name: "Louisiana", abbreviation: "LA" },
            { name: "Maine", abbreviation: "ME" },
            { name: "Maryland", abbreviation: "MD" },
            { name: "Massachusetts", abbreviation: "MA" },
            { name: "Michigan", abbreviation: "MI" },
            { name: "Minnesota", abbreviation: "MN" },
            { name: "Mississippi", abbreviation: "MS" },
            { name: "Missouri", abbreviation: "MO" },
            { name: "Montana", abbreviation: "MT" },
            { name: "Nebraska", abbreviation: "NE" },
            { name: "Nevada", abbreviation: "NV" },
            { name: "New Hampshire", abbreviation: "NH" },
            { name: "New Jersey", abbreviation: "NJ" },
            { name: "New Mexico", abbreviation: "NM" },
            { name: "New York", abbreviation: "NY" },
            { name: "North Carolina", abbreviation: "NC" },
            { name: "North Dakota", abbreviation: "ND" },
            { name: "Ohio", abbreviation: "OH" },
            { name: "Oklahoma", abbreviation: "OK" },
            { name: "Oregon", abbreviation: "OR" },
            { name: "Pennsylvania", abbreviation: "PA" },
            { name: "Rhode Island", abbreviation: "RI" },
            { name: "South Carolina", abbreviation: "SC" },
            { name: "South Dakota", abbreviation: "SD" },
            { name: "Tennessee", abbreviation: "TN" },
            { name: "Texas", abbreviation: "TX" },
            { name: "Utah", abbreviation: "UT" },
            { name: "Vermont", abbreviation: "VT" },
            { name: "Virginia", abbreviation: "VA" },
            { name: "Washington", abbreviation: "WA" },
            { name: "West Virginia", abbreviation: "WV" },
            { name: "Wisconsin", abbreviation: "WI" },
            { name: "Wyoming", abbreviation: "WY" }
          ],
          territories: [
            { name: "American Samoa", abbreviation: "AS" },
            { name: "Federated States of Micronesia", abbreviation: "FM" },
            { name: "Guam", abbreviation: "GU" },
            { name: "Marshall Islands", abbreviation: "MH" },
            { name: "Northern Mariana Islands", abbreviation: "MP" },
            { name: "Puerto Rico", abbreviation: "PR" },
            { name: "Virgin Islands, U.S.", abbreviation: "VI" }
          ],
          armed_forces: [
            { name: "Armed Forces Europe", abbreviation: "AE" },
            { name: "Armed Forces Pacific", abbreviation: "AP" },
            { name: "Armed Forces the Americas", abbreviation: "AA" }
          ],
          country_regions: {
            it: [
              { name: "Valle d'Aosta", abbreviation: "VDA" },
              { name: "Piemonte", abbreviation: "PIE" },
              { name: "Lombardia", abbreviation: "LOM" },
              { name: "Veneto", abbreviation: "VEN" },
              { name: "Trentino Alto Adige", abbreviation: "TAA" },
              { name: "Friuli Venezia Giulia", abbreviation: "FVG" },
              { name: "Liguria", abbreviation: "LIG" },
              { name: "Emilia Romagna", abbreviation: "EMR" },
              { name: "Toscana", abbreviation: "TOS" },
              { name: "Umbria", abbreviation: "UMB" },
              { name: "Marche", abbreviation: "MAR" },
              { name: "Abruzzo", abbreviation: "ABR" },
              { name: "Lazio", abbreviation: "LAZ" },
              { name: "Campania", abbreviation: "CAM" },
              { name: "Puglia", abbreviation: "PUG" },
              { name: "Basilicata", abbreviation: "BAS" },
              { name: "Molise", abbreviation: "MOL" },
              { name: "Calabria", abbreviation: "CAL" },
              { name: "Sicilia", abbreviation: "SIC" },
              { name: "Sardegna", abbreviation: "SAR" }
            ],
            mx: [
              { name: "Aguascalientes", abbreviation: "AGU" },
              { name: "Baja California", abbreviation: "BCN" },
              { name: "Baja California Sur", abbreviation: "BCS" },
              { name: "Campeche", abbreviation: "CAM" },
              { name: "Chiapas", abbreviation: "CHP" },
              { name: "Chihuahua", abbreviation: "CHH" },
              { name: "Ciudad de M\xE9xico", abbreviation: "DIF" },
              { name: "Coahuila", abbreviation: "COA" },
              { name: "Colima", abbreviation: "COL" },
              { name: "Durango", abbreviation: "DUR" },
              { name: "Guanajuato", abbreviation: "GUA" },
              { name: "Guerrero", abbreviation: "GRO" },
              { name: "Hidalgo", abbreviation: "HID" },
              { name: "Jalisco", abbreviation: "JAL" },
              { name: "M\xE9xico", abbreviation: "MEX" },
              { name: "Michoac\xE1n", abbreviation: "MIC" },
              { name: "Morelos", abbreviation: "MOR" },
              { name: "Nayarit", abbreviation: "NAY" },
              { name: "Nuevo Le\xF3n", abbreviation: "NLE" },
              { name: "Oaxaca", abbreviation: "OAX" },
              { name: "Puebla", abbreviation: "PUE" },
              { name: "Quer\xE9taro", abbreviation: "QUE" },
              { name: "Quintana Roo", abbreviation: "ROO" },
              { name: "San Luis Potos\xED", abbreviation: "SLP" },
              { name: "Sinaloa", abbreviation: "SIN" },
              { name: "Sonora", abbreviation: "SON" },
              { name: "Tabasco", abbreviation: "TAB" },
              { name: "Tamaulipas", abbreviation: "TAM" },
              { name: "Tlaxcala", abbreviation: "TLA" },
              { name: "Veracruz", abbreviation: "VER" },
              { name: "Yucat\xE1n", abbreviation: "YUC" },
              { name: "Zacatecas", abbreviation: "ZAC" }
            ]
          },
          street_suffixes: {
            "us": [
              { name: "Avenue", abbreviation: "Ave" },
              { name: "Boulevard", abbreviation: "Blvd" },
              { name: "Center", abbreviation: "Ctr" },
              { name: "Circle", abbreviation: "Cir" },
              { name: "Court", abbreviation: "Ct" },
              { name: "Drive", abbreviation: "Dr" },
              { name: "Extension", abbreviation: "Ext" },
              { name: "Glen", abbreviation: "Gln" },
              { name: "Grove", abbreviation: "Grv" },
              { name: "Heights", abbreviation: "Hts" },
              { name: "Highway", abbreviation: "Hwy" },
              { name: "Junction", abbreviation: "Jct" },
              { name: "Key", abbreviation: "Key" },
              { name: "Lane", abbreviation: "Ln" },
              { name: "Loop", abbreviation: "Loop" },
              { name: "Manor", abbreviation: "Mnr" },
              { name: "Mill", abbreviation: "Mill" },
              { name: "Park", abbreviation: "Park" },
              { name: "Parkway", abbreviation: "Pkwy" },
              { name: "Pass", abbreviation: "Pass" },
              { name: "Path", abbreviation: "Path" },
              { name: "Pike", abbreviation: "Pike" },
              { name: "Place", abbreviation: "Pl" },
              { name: "Plaza", abbreviation: "Plz" },
              { name: "Point", abbreviation: "Pt" },
              { name: "Ridge", abbreviation: "Rdg" },
              { name: "River", abbreviation: "Riv" },
              { name: "Road", abbreviation: "Rd" },
              { name: "Square", abbreviation: "Sq" },
              { name: "Street", abbreviation: "St" },
              { name: "Terrace", abbreviation: "Ter" },
              { name: "Trail", abbreviation: "Trl" },
              { name: "Turnpike", abbreviation: "Tpke" },
              { name: "View", abbreviation: "Vw" },
              { name: "Way", abbreviation: "Way" }
            ],
            "it": [
              { name: "Accesso", abbreviation: "Acc." },
              { name: "Alzaia", abbreviation: "Alz." },
              { name: "Arco", abbreviation: "Arco" },
              { name: "Archivolto", abbreviation: "Acv." },
              { name: "Arena", abbreviation: "Arena" },
              { name: "Argine", abbreviation: "Argine" },
              { name: "Bacino", abbreviation: "Bacino" },
              { name: "Banchi", abbreviation: "Banchi" },
              { name: "Banchina", abbreviation: "Ban." },
              { name: "Bastioni", abbreviation: "Bas." },
              { name: "Belvedere", abbreviation: "Belv." },
              { name: "Borgata", abbreviation: "B.ta" },
              { name: "Borgo", abbreviation: "B.go" },
              { name: "Calata", abbreviation: "Cal." },
              { name: "Calle", abbreviation: "Calle" },
              { name: "Campiello", abbreviation: "Cam." },
              { name: "Campo", abbreviation: "Cam." },
              { name: "Canale", abbreviation: "Can." },
              { name: "Carraia", abbreviation: "Carr." },
              { name: "Cascina", abbreviation: "Cascina" },
              { name: "Case sparse", abbreviation: "c.s." },
              { name: "Cavalcavia", abbreviation: "Cv." },
              { name: "Circonvallazione", abbreviation: "Cv." },
              { name: "Complanare", abbreviation: "C.re" },
              { name: "Contrada", abbreviation: "C.da" },
              { name: "Corso", abbreviation: "C.so" },
              { name: "Corte", abbreviation: "C.te" },
              { name: "Cortile", abbreviation: "C.le" },
              { name: "Diramazione", abbreviation: "Dir." },
              { name: "Fondaco", abbreviation: "F.co" },
              { name: "Fondamenta", abbreviation: "F.ta" },
              { name: "Fondo", abbreviation: "F.do" },
              { name: "Frazione", abbreviation: "Fr." },
              { name: "Isola", abbreviation: "Is." },
              { name: "Largo", abbreviation: "L.go" },
              { name: "Litoranea", abbreviation: "Lit." },
              { name: "Lungolago", abbreviation: "L.go lago" },
              { name: "Lungo Po", abbreviation: "l.go Po" },
              { name: "Molo", abbreviation: "Molo" },
              { name: "Mura", abbreviation: "Mura" },
              { name: "Passaggio privato", abbreviation: "pass. priv." },
              { name: "Passeggiata", abbreviation: "Pass." },
              { name: "Piazza", abbreviation: "P.zza" },
              { name: "Piazzale", abbreviation: "P.le" },
              { name: "Ponte", abbreviation: "P.te" },
              { name: "Portico", abbreviation: "P.co" },
              { name: "Rampa", abbreviation: "Rampa" },
              { name: "Regione", abbreviation: "Reg." },
              { name: "Rione", abbreviation: "R.ne" },
              { name: "Rio", abbreviation: "Rio" },
              { name: "Ripa", abbreviation: "Ripa" },
              { name: "Riva", abbreviation: "Riva" },
              { name: "Rond\xF2", abbreviation: "Rond\xF2" },
              { name: "Rotonda", abbreviation: "Rot." },
              { name: "Sagrato", abbreviation: "Sagr." },
              { name: "Salita", abbreviation: "Sal." },
              { name: "Scalinata", abbreviation: "Scal." },
              { name: "Scalone", abbreviation: "Scal." },
              { name: "Slargo", abbreviation: "Sl." },
              { name: "Sottoportico", abbreviation: "Sott." },
              { name: "Strada", abbreviation: "Str." },
              { name: "Stradale", abbreviation: "Str.le" },
              { name: "Strettoia", abbreviation: "Strett." },
              { name: "Traversa", abbreviation: "Trav." },
              { name: "Via", abbreviation: "V." },
              { name: "Viale", abbreviation: "V.le" },
              { name: "Vicinale", abbreviation: "Vic.le" },
              { name: "Vicolo", abbreviation: "Vic." }
            ],
            "uk": [
              { name: "Avenue", abbreviation: "Ave" },
              { name: "Close", abbreviation: "Cl" },
              { name: "Court", abbreviation: "Ct" },
              { name: "Crescent", abbreviation: "Cr" },
              { name: "Drive", abbreviation: "Dr" },
              { name: "Garden", abbreviation: "Gdn" },
              { name: "Gardens", abbreviation: "Gdns" },
              { name: "Green", abbreviation: "Gn" },
              { name: "Grove", abbreviation: "Gr" },
              { name: "Lane", abbreviation: "Ln" },
              { name: "Mount", abbreviation: "Mt" },
              { name: "Place", abbreviation: "Pl" },
              { name: "Park", abbreviation: "Pk" },
              { name: "Ridge", abbreviation: "Rdg" },
              { name: "Road", abbreviation: "Rd" },
              { name: "Square", abbreviation: "Sq" },
              { name: "Street", abbreviation: "St" },
              { name: "Terrace", abbreviation: "Ter" },
              { name: "Valley", abbreviation: "Val" }
            ]
          },
          months: [
            { name: "January", short_name: "Jan", numeric: "01", days: 31 },
            // Not messing with leap years...
            { name: "February", short_name: "Feb", numeric: "02", days: 28 },
            { name: "March", short_name: "Mar", numeric: "03", days: 31 },
            { name: "April", short_name: "Apr", numeric: "04", days: 30 },
            { name: "May", short_name: "May", numeric: "05", days: 31 },
            { name: "June", short_name: "Jun", numeric: "06", days: 30 },
            { name: "July", short_name: "Jul", numeric: "07", days: 31 },
            { name: "August", short_name: "Aug", numeric: "08", days: 31 },
            { name: "September", short_name: "Sep", numeric: "09", days: 30 },
            { name: "October", short_name: "Oct", numeric: "10", days: 31 },
            { name: "November", short_name: "Nov", numeric: "11", days: 30 },
            { name: "December", short_name: "Dec", numeric: "12", days: 31 }
          ],
          // http://en.wikipedia.org/wiki/Bank_card_number#Issuer_identification_number_.28IIN.29
          cc_types: [
            { name: "American Express", short_name: "amex", prefix: "34", length: 15 },
            { name: "Bankcard", short_name: "bankcard", prefix: "5610", length: 16 },
            { name: "China UnionPay", short_name: "chinaunion", prefix: "62", length: 16 },
            { name: "Diners Club Carte Blanche", short_name: "dccarte", prefix: "300", length: 14 },
            { name: "Diners Club enRoute", short_name: "dcenroute", prefix: "2014", length: 15 },
            { name: "Diners Club International", short_name: "dcintl", prefix: "36", length: 14 },
            { name: "Diners Club United States & Canada", short_name: "dcusc", prefix: "54", length: 16 },
            { name: "Discover Card", short_name: "discover", prefix: "6011", length: 16 },
            { name: "InstaPayment", short_name: "instapay", prefix: "637", length: 16 },
            { name: "JCB", short_name: "jcb", prefix: "3528", length: 16 },
            { name: "Laser", short_name: "laser", prefix: "6304", length: 16 },
            { name: "Maestro", short_name: "maestro", prefix: "5018", length: 16 },
            { name: "Mastercard", short_name: "mc", prefix: "51", length: 16 },
            { name: "Solo", short_name: "solo", prefix: "6334", length: 16 },
            { name: "Switch", short_name: "switch", prefix: "4903", length: 16 },
            { name: "Visa", short_name: "visa", prefix: "4", length: 16 },
            { name: "Visa Electron", short_name: "electron", prefix: "4026", length: 16 }
          ],
          //return all world currency by ISO 4217
          currency_types: [
            { "code": "AED", "name": "United Arab Emirates Dirham" },
            { "code": "AFN", "name": "Afghanistan Afghani" },
            { "code": "ALL", "name": "Albania Lek" },
            { "code": "AMD", "name": "Armenia Dram" },
            { "code": "ANG", "name": "Netherlands Antilles Guilder" },
            { "code": "AOA", "name": "Angola Kwanza" },
            { "code": "ARS", "name": "Argentina Peso" },
            { "code": "AUD", "name": "Australia Dollar" },
            { "code": "AWG", "name": "Aruba Guilder" },
            { "code": "AZN", "name": "Azerbaijan New Manat" },
            { "code": "BAM", "name": "Bosnia and Herzegovina Convertible Marka" },
            { "code": "BBD", "name": "Barbados Dollar" },
            { "code": "BDT", "name": "Bangladesh Taka" },
            { "code": "BGN", "name": "Bulgaria Lev" },
            { "code": "BHD", "name": "Bahrain Dinar" },
            { "code": "BIF", "name": "Burundi Franc" },
            { "code": "BMD", "name": "Bermuda Dollar" },
            { "code": "BND", "name": "Brunei Darussalam Dollar" },
            { "code": "BOB", "name": "Bolivia Boliviano" },
            { "code": "BRL", "name": "Brazil Real" },
            { "code": "BSD", "name": "Bahamas Dollar" },
            { "code": "BTN", "name": "Bhutan Ngultrum" },
            { "code": "BWP", "name": "Botswana Pula" },
            { "code": "BYR", "name": "Belarus Ruble" },
            { "code": "BZD", "name": "Belize Dollar" },
            { "code": "CAD", "name": "Canada Dollar" },
            { "code": "CDF", "name": "Congo/Kinshasa Franc" },
            { "code": "CHF", "name": "Switzerland Franc" },
            { "code": "CLP", "name": "Chile Peso" },
            { "code": "CNY", "name": "China Yuan Renminbi" },
            { "code": "COP", "name": "Colombia Peso" },
            { "code": "CRC", "name": "Costa Rica Colon" },
            { "code": "CUC", "name": "Cuba Convertible Peso" },
            { "code": "CUP", "name": "Cuba Peso" },
            { "code": "CVE", "name": "Cape Verde Escudo" },
            { "code": "CZK", "name": "Czech Republic Koruna" },
            { "code": "DJF", "name": "Djibouti Franc" },
            { "code": "DKK", "name": "Denmark Krone" },
            { "code": "DOP", "name": "Dominican Republic Peso" },
            { "code": "DZD", "name": "Algeria Dinar" },
            { "code": "EGP", "name": "Egypt Pound" },
            { "code": "ERN", "name": "Eritrea Nakfa" },
            { "code": "ETB", "name": "Ethiopia Birr" },
            { "code": "EUR", "name": "Euro Member Countries" },
            { "code": "FJD", "name": "Fiji Dollar" },
            { "code": "FKP", "name": "Falkland Islands (Malvinas) Pound" },
            { "code": "GBP", "name": "United Kingdom Pound" },
            { "code": "GEL", "name": "Georgia Lari" },
            { "code": "GGP", "name": "Guernsey Pound" },
            { "code": "GHS", "name": "Ghana Cedi" },
            { "code": "GIP", "name": "Gibraltar Pound" },
            { "code": "GMD", "name": "Gambia Dalasi" },
            { "code": "GNF", "name": "Guinea Franc" },
            { "code": "GTQ", "name": "Guatemala Quetzal" },
            { "code": "GYD", "name": "Guyana Dollar" },
            { "code": "HKD", "name": "Hong Kong Dollar" },
            { "code": "HNL", "name": "Honduras Lempira" },
            { "code": "HRK", "name": "Croatia Kuna" },
            { "code": "HTG", "name": "Haiti Gourde" },
            { "code": "HUF", "name": "Hungary Forint" },
            { "code": "IDR", "name": "Indonesia Rupiah" },
            { "code": "ILS", "name": "Israel Shekel" },
            { "code": "IMP", "name": "Isle of Man Pound" },
            { "code": "INR", "name": "India Rupee" },
            { "code": "IQD", "name": "Iraq Dinar" },
            { "code": "IRR", "name": "Iran Rial" },
            { "code": "ISK", "name": "Iceland Krona" },
            { "code": "JEP", "name": "Jersey Pound" },
            { "code": "JMD", "name": "Jamaica Dollar" },
            { "code": "JOD", "name": "Jordan Dinar" },
            { "code": "JPY", "name": "Japan Yen" },
            { "code": "KES", "name": "Kenya Shilling" },
            { "code": "KGS", "name": "Kyrgyzstan Som" },
            { "code": "KHR", "name": "Cambodia Riel" },
            { "code": "KMF", "name": "Comoros Franc" },
            { "code": "KPW", "name": "Korea (North) Won" },
            { "code": "KRW", "name": "Korea (South) Won" },
            { "code": "KWD", "name": "Kuwait Dinar" },
            { "code": "KYD", "name": "Cayman Islands Dollar" },
            { "code": "KZT", "name": "Kazakhstan Tenge" },
            { "code": "LAK", "name": "Laos Kip" },
            { "code": "LBP", "name": "Lebanon Pound" },
            { "code": "LKR", "name": "Sri Lanka Rupee" },
            { "code": "LRD", "name": "Liberia Dollar" },
            { "code": "LSL", "name": "Lesotho Loti" },
            { "code": "LTL", "name": "Lithuania Litas" },
            { "code": "LYD", "name": "Libya Dinar" },
            { "code": "MAD", "name": "Morocco Dirham" },
            { "code": "MDL", "name": "Moldova Leu" },
            { "code": "MGA", "name": "Madagascar Ariary" },
            { "code": "MKD", "name": "Macedonia Denar" },
            { "code": "MMK", "name": "Myanmar (Burma) Kyat" },
            { "code": "MNT", "name": "Mongolia Tughrik" },
            { "code": "MOP", "name": "Macau Pataca" },
            { "code": "MRO", "name": "Mauritania Ouguiya" },
            { "code": "MUR", "name": "Mauritius Rupee" },
            { "code": "MVR", "name": "Maldives (Maldive Islands) Rufiyaa" },
            { "code": "MWK", "name": "Malawi Kwacha" },
            { "code": "MXN", "name": "Mexico Peso" },
            { "code": "MYR", "name": "Malaysia Ringgit" },
            { "code": "MZN", "name": "Mozambique Metical" },
            { "code": "NAD", "name": "Namibia Dollar" },
            { "code": "NGN", "name": "Nigeria Naira" },
            { "code": "NIO", "name": "Nicaragua Cordoba" },
            { "code": "NOK", "name": "Norway Krone" },
            { "code": "NPR", "name": "Nepal Rupee" },
            { "code": "NZD", "name": "New Zealand Dollar" },
            { "code": "OMR", "name": "Oman Rial" },
            { "code": "PAB", "name": "Panama Balboa" },
            { "code": "PEN", "name": "Peru Nuevo Sol" },
            { "code": "PGK", "name": "Papua New Guinea Kina" },
            { "code": "PHP", "name": "Philippines Peso" },
            { "code": "PKR", "name": "Pakistan Rupee" },
            { "code": "PLN", "name": "Poland Zloty" },
            { "code": "PYG", "name": "Paraguay Guarani" },
            { "code": "QAR", "name": "Qatar Riyal" },
            { "code": "RON", "name": "Romania New Leu" },
            { "code": "RSD", "name": "Serbia Dinar" },
            { "code": "RUB", "name": "Russia Ruble" },
            { "code": "RWF", "name": "Rwanda Franc" },
            { "code": "SAR", "name": "Saudi Arabia Riyal" },
            { "code": "SBD", "name": "Solomon Islands Dollar" },
            { "code": "SCR", "name": "Seychelles Rupee" },
            { "code": "SDG", "name": "Sudan Pound" },
            { "code": "SEK", "name": "Sweden Krona" },
            { "code": "SGD", "name": "Singapore Dollar" },
            { "code": "SHP", "name": "Saint Helena Pound" },
            { "code": "SLL", "name": "Sierra Leone Leone" },
            { "code": "SOS", "name": "Somalia Shilling" },
            { "code": "SPL", "name": "Seborga Luigino" },
            { "code": "SRD", "name": "Suriname Dollar" },
            { "code": "STD", "name": "S\xE3o Tom\xE9 and Pr\xEDncipe Dobra" },
            { "code": "SVC", "name": "El Salvador Colon" },
            { "code": "SYP", "name": "Syria Pound" },
            { "code": "SZL", "name": "Swaziland Lilangeni" },
            { "code": "THB", "name": "Thailand Baht" },
            { "code": "TJS", "name": "Tajikistan Somoni" },
            { "code": "TMT", "name": "Turkmenistan Manat" },
            { "code": "TND", "name": "Tunisia Dinar" },
            { "code": "TOP", "name": "Tonga Pa'anga" },
            { "code": "TRY", "name": "Turkey Lira" },
            { "code": "TTD", "name": "Trinidad and Tobago Dollar" },
            { "code": "TVD", "name": "Tuvalu Dollar" },
            { "code": "TWD", "name": "Taiwan New Dollar" },
            { "code": "TZS", "name": "Tanzania Shilling" },
            { "code": "UAH", "name": "Ukraine Hryvnia" },
            { "code": "UGX", "name": "Uganda Shilling" },
            { "code": "USD", "name": "United States Dollar" },
            { "code": "UYU", "name": "Uruguay Peso" },
            { "code": "UZS", "name": "Uzbekistan Som" },
            { "code": "VEF", "name": "Venezuela Bolivar" },
            { "code": "VND", "name": "Viet Nam Dong" },
            { "code": "VUV", "name": "Vanuatu Vatu" },
            { "code": "WST", "name": "Samoa Tala" },
            { "code": "XAF", "name": "Communaut\xE9 Financi\xE8re Africaine (BEAC) CFA Franc BEAC" },
            { "code": "XCD", "name": "East Caribbean Dollar" },
            { "code": "XDR", "name": "International Monetary Fund (IMF) Special Drawing Rights" },
            { "code": "XOF", "name": "Communaut\xE9 Financi\xE8re Africaine (BCEAO) Franc" },
            { "code": "XPF", "name": "Comptoirs Fran\xE7ais du Pacifique (CFP) Franc" },
            { "code": "YER", "name": "Yemen Rial" },
            { "code": "ZAR", "name": "South Africa Rand" },
            { "code": "ZMW", "name": "Zambia Kwacha" },
            { "code": "ZWD", "name": "Zimbabwe Dollar" }
          ],
          // return the names of all valide colors
          colorNames: [
            "AliceBlue",
            "Black",
            "Navy",
            "DarkBlue",
            "MediumBlue",
            "Blue",
            "DarkGreen",
            "Green",
            "Teal",
            "DarkCyan",
            "DeepSkyBlue",
            "DarkTurquoise",
            "MediumSpringGreen",
            "Lime",
            "SpringGreen",
            "Aqua",
            "Cyan",
            "MidnightBlue",
            "DodgerBlue",
            "LightSeaGreen",
            "ForestGreen",
            "SeaGreen",
            "DarkSlateGray",
            "LimeGreen",
            "MediumSeaGreen",
            "Turquoise",
            "RoyalBlue",
            "SteelBlue",
            "DarkSlateBlue",
            "MediumTurquoise",
            "Indigo",
            "DarkOliveGreen",
            "CadetBlue",
            "CornflowerBlue",
            "RebeccaPurple",
            "MediumAquaMarine",
            "DimGray",
            "SlateBlue",
            "OliveDrab",
            "SlateGray",
            "LightSlateGray",
            "MediumSlateBlue",
            "LawnGreen",
            "Chartreuse",
            "Aquamarine",
            "Maroon",
            "Purple",
            "Olive",
            "Gray",
            "SkyBlue",
            "LightSkyBlue",
            "BlueViolet",
            "DarkRed",
            "DarkMagenta",
            "SaddleBrown",
            "Ivory",
            "White",
            "DarkSeaGreen",
            "LightGreen",
            "MediumPurple",
            "DarkViolet",
            "PaleGreen",
            "DarkOrchid",
            "YellowGreen",
            "Sienna",
            "Brown",
            "DarkGray",
            "LightBlue",
            "GreenYellow",
            "PaleTurquoise",
            "LightSteelBlue",
            "PowderBlue",
            "FireBrick",
            "DarkGoldenRod",
            "MediumOrchid",
            "RosyBrown",
            "DarkKhaki",
            "Silver",
            "MediumVioletRed",
            "IndianRed",
            "Peru",
            "Chocolate",
            "Tan",
            "LightGray",
            "Thistle",
            "Orchid",
            "GoldenRod",
            "PaleVioletRed",
            "Crimson",
            "Gainsboro",
            "Plum",
            "BurlyWood",
            "LightCyan",
            "Lavender",
            "DarkSalmon",
            "Violet",
            "PaleGoldenRod",
            "LightCoral",
            "Khaki",
            "AliceBlue",
            "HoneyDew",
            "Azure",
            "SandyBrown",
            "Wheat",
            "Beige",
            "WhiteSmoke",
            "MintCream",
            "GhostWhite",
            "Salmon",
            "AntiqueWhite",
            "Linen",
            "LightGoldenRodYellow",
            "OldLace",
            "Red",
            "Fuchsia",
            "Magenta",
            "DeepPink",
            "OrangeRed",
            "Tomato",
            "HotPink",
            "Coral",
            "DarkOrange",
            "LightSalmon",
            "Orange",
            "LightPink",
            "Pink",
            "Gold",
            "PeachPuff",
            "NavajoWhite",
            "Moccasin",
            "Bisque",
            "MistyRose",
            "BlanchedAlmond",
            "PapayaWhip",
            "LavenderBlush",
            "SeaShell",
            "Cornsilk",
            "LemonChiffon",
            "FloralWhite",
            "Snow",
            "Yellow",
            "LightYellow"
          ],
          // Data taken from https://www.sec.gov/rules/other/4-460list.htm
          company: [
            "3Com Corp",
            "3M Company",
            "A.G. Edwards Inc.",
            "Abbott Laboratories",
            "Abercrombie & Fitch Co.",
            "ABM Industries Incorporated",
            "Ace Hardware Corporation",
            "ACT Manufacturing Inc.",
            "Acterna Corp.",
            "Adams Resources & Energy, Inc.",
            "ADC Telecommunications, Inc.",
            "Adelphia Communications Corporation",
            "Administaff, Inc.",
            "Adobe Systems Incorporated",
            "Adolph Coors Company",
            "Advance Auto Parts, Inc.",
            "Advanced Micro Devices, Inc.",
            "AdvancePCS, Inc.",
            "Advantica Restaurant Group, Inc.",
            "The AES Corporation",
            "Aetna Inc.",
            "Affiliated Computer Services, Inc.",
            "AFLAC Incorporated",
            "AGCO Corporation",
            "Agilent Technologies, Inc.",
            "Agway Inc.",
            "Apartment Investment and Management Company",
            "Air Products and Chemicals, Inc.",
            "Airborne, Inc.",
            "Airgas, Inc.",
            "AK Steel Holding Corporation",
            "Alaska Air Group, Inc.",
            "Alberto-Culver Company",
            "Albertson's, Inc.",
            "Alcoa Inc.",
            "Alleghany Corporation",
            "Allegheny Energy, Inc.",
            "Allegheny Technologies Incorporated",
            "Allergan, Inc.",
            "ALLETE, Inc.",
            "Alliant Energy Corporation",
            "Allied Waste Industries, Inc.",
            "Allmerica Financial Corporation",
            "The Allstate Corporation",
            "ALLTEL Corporation",
            "The Alpine Group, Inc.",
            "Amazon.com, Inc.",
            "AMC Entertainment Inc.",
            "American Power Conversion Corporation",
            "Amerada Hess Corporation",
            "AMERCO",
            "Ameren Corporation",
            "America West Holdings Corporation",
            "American Axle & Manufacturing Holdings, Inc.",
            "American Eagle Outfitters, Inc.",
            "American Electric Power Company, Inc.",
            "American Express Company",
            "American Financial Group, Inc.",
            "American Greetings Corporation",
            "American International Group, Inc.",
            "American Standard Companies Inc.",
            "American Water Works Company, Inc.",
            "AmerisourceBergen Corporation",
            "Ames Department Stores, Inc.",
            "Amgen Inc.",
            "Amkor Technology, Inc.",
            "AMR Corporation",
            "AmSouth Bancorp.",
            "Amtran, Inc.",
            "Anadarko Petroleum Corporation",
            "Analog Devices, Inc.",
            "Anheuser-Busch Companies, Inc.",
            "Anixter International Inc.",
            "AnnTaylor Inc.",
            "Anthem, Inc.",
            "AOL Time Warner Inc.",
            "Aon Corporation",
            "Apache Corporation",
            "Apple Computer, Inc.",
            "Applera Corporation",
            "Applied Industrial Technologies, Inc.",
            "Applied Materials, Inc.",
            "Aquila, Inc.",
            "ARAMARK Corporation",
            "Arch Coal, Inc.",
            "Archer Daniels Midland Company",
            "Arkansas Best Corporation",
            "Armstrong Holdings, Inc.",
            "Arrow Electronics, Inc.",
            "ArvinMeritor, Inc.",
            "Ashland Inc.",
            "Astoria Financial Corporation",
            "AT&T Corp.",
            "Atmel Corporation",
            "Atmos Energy Corporation",
            "Audiovox Corporation",
            "Autoliv, Inc.",
            "Automatic Data Processing, Inc.",
            "AutoNation, Inc.",
            "AutoZone, Inc.",
            "Avaya Inc.",
            "Avery Dennison Corporation",
            "Avista Corporation",
            "Avnet, Inc.",
            "Avon Products, Inc.",
            "Baker Hughes Incorporated",
            "Ball Corporation",
            "Bank of America Corporation",
            "The Bank of New York Company, Inc.",
            "Bank One Corporation",
            "Banknorth Group, Inc.",
            "Banta Corporation",
            "Barnes & Noble, Inc.",
            "Bausch & Lomb Incorporated",
            "Baxter International Inc.",
            "BB&T Corporation",
            "The Bear Stearns Companies Inc.",
            "Beazer Homes USA, Inc.",
            "Beckman Coulter, Inc.",
            "Becton, Dickinson and Company",
            "Bed Bath & Beyond Inc.",
            "Belk, Inc.",
            "Bell Microproducts Inc.",
            "BellSouth Corporation",
            "Belo Corp.",
            "Bemis Company, Inc.",
            "Benchmark Electronics, Inc.",
            "Berkshire Hathaway Inc.",
            "Best Buy Co., Inc.",
            "Bethlehem Steel Corporation",
            "Beverly Enterprises, Inc.",
            "Big Lots, Inc.",
            "BJ Services Company",
            "BJ's Wholesale Club, Inc.",
            "The Black & Decker Corporation",
            "Black Hills Corporation",
            "BMC Software, Inc.",
            "The Boeing Company",
            "Boise Cascade Corporation",
            "Borders Group, Inc.",
            "BorgWarner Inc.",
            "Boston Scientific Corporation",
            "Bowater Incorporated",
            "Briggs & Stratton Corporation",
            "Brightpoint, Inc.",
            "Brinker International, Inc.",
            "Bristol-Myers Squibb Company",
            "Broadwing, Inc.",
            "Brown Shoe Company, Inc.",
            "Brown-Forman Corporation",
            "Brunswick Corporation",
            "Budget Group, Inc.",
            "Burlington Coat Factory Warehouse Corporation",
            "Burlington Industries, Inc.",
            "Burlington Northern Santa Fe Corporation",
            "Burlington Resources Inc.",
            "C. H. Robinson Worldwide Inc.",
            "Cablevision Systems Corp",
            "Cabot Corp",
            "Cadence Design Systems, Inc.",
            "Calpine Corp.",
            "Campbell Soup Co.",
            "Capital One Financial Corp.",
            "Cardinal Health Inc.",
            "Caremark Rx Inc.",
            "Carlisle Cos. Inc.",
            "Carpenter Technology Corp.",
            "Casey's General Stores Inc.",
            "Caterpillar Inc.",
            "CBRL Group Inc.",
            "CDI Corp.",
            "CDW Computer Centers Inc.",
            "CellStar Corp.",
            "Cendant Corp",
            "Cenex Harvest States Cooperatives",
            "Centex Corp.",
            "CenturyTel Inc.",
            "Ceridian Corp.",
            "CH2M Hill Cos. Ltd.",
            "Champion Enterprises Inc.",
            "Charles Schwab Corp.",
            "Charming Shoppes Inc.",
            "Charter Communications Inc.",
            "Charter One Financial Inc.",
            "ChevronTexaco Corp.",
            "Chiquita Brands International Inc.",
            "Chubb Corp",
            "Ciena Corp.",
            "Cigna Corp",
            "Cincinnati Financial Corp.",
            "Cinergy Corp.",
            "Cintas Corp.",
            "Circuit City Stores Inc.",
            "Cisco Systems Inc.",
            "Citigroup, Inc",
            "Citizens Communications Co.",
            "CKE Restaurants Inc.",
            "Clear Channel Communications Inc.",
            "The Clorox Co.",
            "CMGI Inc.",
            "CMS Energy Corp.",
            "CNF Inc.",
            "Coca-Cola Co.",
            "Coca-Cola Enterprises Inc.",
            "Colgate-Palmolive Co.",
            "Collins & Aikman Corp.",
            "Comcast Corp.",
            "Comdisco Inc.",
            "Comerica Inc.",
            "Comfort Systems USA Inc.",
            "Commercial Metals Co.",
            "Community Health Systems Inc.",
            "Compass Bancshares Inc",
            "Computer Associates International Inc.",
            "Computer Sciences Corp.",
            "Compuware Corp.",
            "Comverse Technology Inc.",
            "ConAgra Foods Inc.",
            "Concord EFS Inc.",
            "Conectiv, Inc",
            "Conoco Inc",
            "Conseco Inc.",
            "Consolidated Freightways Corp.",
            "Consolidated Edison Inc.",
            "Constellation Brands Inc.",
            "Constellation Emergy Group Inc.",
            "Continental Airlines Inc.",
            "Convergys Corp.",
            "Cooper Cameron Corp.",
            "Cooper Industries Ltd.",
            "Cooper Tire & Rubber Co.",
            "Corn Products International Inc.",
            "Corning Inc.",
            "Costco Wholesale Corp.",
            "Countrywide Credit Industries Inc.",
            "Coventry Health Care Inc.",
            "Cox Communications Inc.",
            "Crane Co.",
            "Crompton Corp.",
            "Crown Cork & Seal Co. Inc.",
            "CSK Auto Corp.",
            "CSX Corp.",
            "Cummins Inc.",
            "CVS Corp.",
            "Cytec Industries Inc.",
            "D&K Healthcare Resources, Inc.",
            "D.R. Horton Inc.",
            "Dana Corporation",
            "Danaher Corporation",
            "Darden Restaurants Inc.",
            "DaVita Inc.",
            "Dean Foods Company",
            "Deere & Company",
            "Del Monte Foods Co",
            "Dell Computer Corporation",
            "Delphi Corp.",
            "Delta Air Lines Inc.",
            "Deluxe Corporation",
            "Devon Energy Corporation",
            "Di Giorgio Corporation",
            "Dial Corporation",
            "Diebold Incorporated",
            "Dillard's Inc.",
            "DIMON Incorporated",
            "Dole Food Company, Inc.",
            "Dollar General Corporation",
            "Dollar Tree Stores, Inc.",
            "Dominion Resources, Inc.",
            "Domino's Pizza LLC",
            "Dover Corporation, Inc.",
            "Dow Chemical Company",
            "Dow Jones & Company, Inc.",
            "DPL Inc.",
            "DQE Inc.",
            "Dreyer's Grand Ice Cream, Inc.",
            "DST Systems, Inc.",
            "DTE Energy Co.",
            "E.I. Du Pont de Nemours and Company",
            "Duke Energy Corp",
            "Dun & Bradstreet Inc.",
            "DURA Automotive Systems Inc.",
            "DynCorp",
            "Dynegy Inc.",
            "E*Trade Group, Inc.",
            "E.W. Scripps Company",
            "Earthlink, Inc.",
            "Eastman Chemical Company",
            "Eastman Kodak Company",
            "Eaton Corporation",
            "Echostar Communications Corporation",
            "Ecolab Inc.",
            "Edison International",
            "EGL Inc.",
            "El Paso Corporation",
            "Electronic Arts Inc.",
            "Electronic Data Systems Corp.",
            "Eli Lilly and Company",
            "EMC Corporation",
            "Emcor Group Inc.",
            "Emerson Electric Co.",
            "Encompass Services Corporation",
            "Energizer Holdings Inc.",
            "Energy East Corporation",
            "Engelhard Corporation",
            "Enron Corp.",
            "Entergy Corporation",
            "Enterprise Products Partners L.P.",
            "EOG Resources, Inc.",
            "Equifax Inc.",
            "Equitable Resources Inc.",
            "Equity Office Properties Trust",
            "Equity Residential Properties Trust",
            "Estee Lauder Companies Inc.",
            "Exelon Corporation",
            "Exide Technologies",
            "Expeditors International of Washington Inc.",
            "Express Scripts Inc.",
            "ExxonMobil Corporation",
            "Fairchild Semiconductor International Inc.",
            "Family Dollar Stores Inc.",
            "Farmland Industries Inc.",
            "Federal Mogul Corp.",
            "Federated Department Stores Inc.",
            "Federal Express Corp.",
            "Felcor Lodging Trust Inc.",
            "Ferro Corp.",
            "Fidelity National Financial Inc.",
            "Fifth Third Bancorp",
            "First American Financial Corp.",
            "First Data Corp.",
            "First National of Nebraska Inc.",
            "First Tennessee National Corp.",
            "FirstEnergy Corp.",
            "Fiserv Inc.",
            "Fisher Scientific International Inc.",
            "FleetBoston Financial Co.",
            "Fleetwood Enterprises Inc.",
            "Fleming Companies Inc.",
            "Flowers Foods Inc.",
            "Flowserv Corp",
            "Fluor Corp",
            "FMC Corp",
            "Foamex International Inc",
            "Foot Locker Inc",
            "Footstar Inc.",
            "Ford Motor Co",
            "Forest Laboratories Inc.",
            "Fortune Brands Inc.",
            "Foster Wheeler Ltd.",
            "FPL Group Inc.",
            "Franklin Resources Inc.",
            "Freeport McMoran Copper & Gold Inc.",
            "Frontier Oil Corp",
            "Furniture Brands International Inc.",
            "Gannett Co., Inc.",
            "Gap Inc.",
            "Gateway Inc.",
            "GATX Corporation",
            "Gemstar-TV Guide International Inc.",
            "GenCorp Inc.",
            "General Cable Corporation",
            "General Dynamics Corporation",
            "General Electric Company",
            "General Mills Inc",
            "General Motors Corporation",
            "Genesis Health Ventures Inc.",
            "Gentek Inc.",
            "Gentiva Health Services Inc.",
            "Genuine Parts Company",
            "Genuity Inc.",
            "Genzyme Corporation",
            "Georgia Gulf Corporation",
            "Georgia-Pacific Corporation",
            "Gillette Company",
            "Gold Kist Inc.",
            "Golden State Bancorp Inc.",
            "Golden West Financial Corporation",
            "Goldman Sachs Group Inc.",
            "Goodrich Corporation",
            "The Goodyear Tire & Rubber Company",
            "Granite Construction Incorporated",
            "Graybar Electric Company Inc.",
            "Great Lakes Chemical Corporation",
            "Great Plains Energy Inc.",
            "GreenPoint Financial Corp.",
            "Greif Bros. Corporation",
            "Grey Global Group Inc.",
            "Group 1 Automotive Inc.",
            "Guidant Corporation",
            "H&R Block Inc.",
            "H.B. Fuller Company",
            "H.J. Heinz Company",
            "Halliburton Co.",
            "Harley-Davidson Inc.",
            "Harman International Industries Inc.",
            "Harrah's Entertainment Inc.",
            "Harris Corp.",
            "Harsco Corp.",
            "Hartford Financial Services Group Inc.",
            "Hasbro Inc.",
            "Hawaiian Electric Industries Inc.",
            "HCA Inc.",
            "Health Management Associates Inc.",
            "Health Net Inc.",
            "Healthsouth Corp",
            "Henry Schein Inc.",
            "Hercules Inc.",
            "Herman Miller Inc.",
            "Hershey Foods Corp.",
            "Hewlett-Packard Company",
            "Hibernia Corp.",
            "Hillenbrand Industries Inc.",
            "Hilton Hotels Corp.",
            "Hollywood Entertainment Corp.",
            "Home Depot Inc.",
            "Hon Industries Inc.",
            "Honeywell International Inc.",
            "Hormel Foods Corp.",
            "Host Marriott Corp.",
            "Household International Corp.",
            "Hovnanian Enterprises Inc.",
            "Hub Group Inc.",
            "Hubbell Inc.",
            "Hughes Supply Inc.",
            "Humana Inc.",
            "Huntington Bancshares Inc.",
            "Idacorp Inc.",
            "IDT Corporation",
            "IKON Office Solutions Inc.",
            "Illinois Tool Works Inc.",
            "IMC Global Inc.",
            "Imperial Sugar Company",
            "IMS Health Inc.",
            "Ingles Market Inc",
            "Ingram Micro Inc.",
            "Insight Enterprises Inc.",
            "Integrated Electrical Services Inc.",
            "Intel Corporation",
            "International Paper Co.",
            "Interpublic Group of Companies Inc.",
            "Interstate Bakeries Corporation",
            "International Business Machines Corp.",
            "International Flavors & Fragrances Inc.",
            "International Multifoods Corporation",
            "Intuit Inc.",
            "IT Group Inc.",
            "ITT Industries Inc.",
            "Ivax Corp.",
            "J.B. Hunt Transport Services Inc.",
            "J.C. Penny Co.",
            "J.P. Morgan Chase & Co.",
            "Jabil Circuit Inc.",
            "Jack In The Box Inc.",
            "Jacobs Engineering Group Inc.",
            "JDS Uniphase Corp.",
            "Jefferson-Pilot Co.",
            "John Hancock Financial Services Inc.",
            "Johnson & Johnson",
            "Johnson Controls Inc.",
            "Jones Apparel Group Inc.",
            "KB Home",
            "Kellogg Company",
            "Kellwood Company",
            "Kelly Services Inc.",
            "Kemet Corp.",
            "Kennametal Inc.",
            "Kerr-McGee Corporation",
            "KeyCorp",
            "KeySpan Corp.",
            "Kimball International Inc.",
            "Kimberly-Clark Corporation",
            "Kindred Healthcare Inc.",
            "KLA-Tencor Corporation",
            "K-Mart Corp.",
            "Knight-Ridder Inc.",
            "Kohl's Corp.",
            "KPMG Consulting Inc.",
            "Kroger Co.",
            "L-3 Communications Holdings Inc.",
            "Laboratory Corporation of America Holdings",
            "Lam Research Corporation",
            "LandAmerica Financial Group Inc.",
            "Lands' End Inc.",
            "Landstar System Inc.",
            "La-Z-Boy Inc.",
            "Lear Corporation",
            "Legg Mason Inc.",
            "Leggett & Platt Inc.",
            "Lehman Brothers Holdings Inc.",
            "Lennar Corporation",
            "Lennox International Inc.",
            "Level 3 Communications Inc.",
            "Levi Strauss & Co.",
            "Lexmark International Inc.",
            "Limited Inc.",
            "Lincoln National Corporation",
            "Linens 'n Things Inc.",
            "Lithia Motors Inc.",
            "Liz Claiborne Inc.",
            "Lockheed Martin Corporation",
            "Loews Corporation",
            "Longs Drug Stores Corporation",
            "Louisiana-Pacific Corporation",
            "Lowe's Companies Inc.",
            "LSI Logic Corporation",
            "The LTV Corporation",
            "The Lubrizol Corporation",
            "Lucent Technologies Inc.",
            "Lyondell Chemical Company",
            "M & T Bank Corporation",
            "Magellan Health Services Inc.",
            "Mail-Well Inc.",
            "Mandalay Resort Group",
            "Manor Care Inc.",
            "Manpower Inc.",
            "Marathon Oil Corporation",
            "Mariner Health Care Inc.",
            "Markel Corporation",
            "Marriott International Inc.",
            "Marsh & McLennan Companies Inc.",
            "Marsh Supermarkets Inc.",
            "Marshall & Ilsley Corporation",
            "Martin Marietta Materials Inc.",
            "Masco Corporation",
            "Massey Energy Company",
            "MasTec Inc.",
            "Mattel Inc.",
            "Maxim Integrated Products Inc.",
            "Maxtor Corporation",
            "Maxxam Inc.",
            "The May Department Stores Company",
            "Maytag Corporation",
            "MBNA Corporation",
            "McCormick & Company Incorporated",
            "McDonald's Corporation",
            "The McGraw-Hill Companies Inc.",
            "McKesson Corporation",
            "McLeodUSA Incorporated",
            "M.D.C. Holdings Inc.",
            "MDU Resources Group Inc.",
            "MeadWestvaco Corporation",
            "Medtronic Inc.",
            "Mellon Financial Corporation",
            "The Men's Wearhouse Inc.",
            "Merck & Co., Inc.",
            "Mercury General Corporation",
            "Merrill Lynch & Co. Inc.",
            "Metaldyne Corporation",
            "Metals USA Inc.",
            "MetLife Inc.",
            "Metris Companies Inc",
            "MGIC Investment Corporation",
            "MGM Mirage",
            "Michaels Stores Inc.",
            "Micron Technology Inc.",
            "Microsoft Corporation",
            "Milacron Inc.",
            "Millennium Chemicals Inc.",
            "Mirant Corporation",
            "Mohawk Industries Inc.",
            "Molex Incorporated",
            "The MONY Group Inc.",
            "Morgan Stanley Dean Witter & Co.",
            "Motorola Inc.",
            "MPS Group Inc.",
            "Murphy Oil Corporation",
            "Nabors Industries Inc",
            "Nacco Industries Inc",
            "Nash Finch Company",
            "National City Corp.",
            "National Commerce Financial Corporation",
            "National Fuel Gas Company",
            "National Oilwell Inc",
            "National Rural Utilities Cooperative Finance Corporation",
            "National Semiconductor Corporation",
            "National Service Industries Inc",
            "Navistar International Corporation",
            "NCR Corporation",
            "The Neiman Marcus Group Inc.",
            "New Jersey Resources Corporation",
            "New York Times Company",
            "Newell Rubbermaid Inc",
            "Newmont Mining Corporation",
            "Nextel Communications Inc",
            "Nicor Inc",
            "Nike Inc",
            "NiSource Inc",
            "Noble Energy Inc",
            "Nordstrom Inc",
            "Norfolk Southern Corporation",
            "Nortek Inc",
            "North Fork Bancorporation Inc",
            "Northeast Utilities System",
            "Northern Trust Corporation",
            "Northrop Grumman Corporation",
            "NorthWestern Corporation",
            "Novellus Systems Inc",
            "NSTAR",
            "NTL Incorporated",
            "Nucor Corp",
            "Nvidia Corp",
            "NVR Inc",
            "Northwest Airlines Corp",
            "Occidental Petroleum Corp",
            "Ocean Energy Inc",
            "Office Depot Inc.",
            "OfficeMax Inc",
            "OGE Energy Corp",
            "Oglethorpe Power Corp.",
            "Ohio Casualty Corp.",
            "Old Republic International Corp.",
            "Olin Corp.",
            "OM Group Inc",
            "Omnicare Inc",
            "Omnicom Group",
            "On Semiconductor Corp",
            "ONEOK Inc",
            "Oracle Corp",
            "Oshkosh Truck Corp",
            "Outback Steakhouse Inc.",
            "Owens & Minor Inc.",
            "Owens Corning",
            "Owens-Illinois Inc",
            "Oxford Health Plans Inc",
            "Paccar Inc",
            "PacifiCare Health Systems Inc",
            "Packaging Corp. of America",
            "Pactiv Corp",
            "Pall Corp",
            "Pantry Inc",
            "Park Place Entertainment Corp",
            "Parker Hannifin Corp.",
            "Pathmark Stores Inc.",
            "Paychex Inc",
            "Payless Shoesource Inc",
            "Penn Traffic Co.",
            "Pennzoil-Quaker State Company",
            "Pentair Inc",
            "Peoples Energy Corp.",
            "PeopleSoft Inc",
            "Pep Boys Manny, Moe & Jack",
            "Potomac Electric Power Co.",
            "Pepsi Bottling Group Inc.",
            "PepsiAmericas Inc.",
            "PepsiCo Inc.",
            "Performance Food Group Co.",
            "Perini Corp",
            "PerkinElmer Inc",
            "Perot Systems Corp",
            "Petco Animal Supplies Inc.",
            "Peter Kiewit Sons', Inc.",
            "PETsMART Inc",
            "Pfizer Inc",
            "Pacific Gas & Electric Corp.",
            "Pharmacia Corp",
            "Phar Mor Inc.",
            "Phelps Dodge Corp.",
            "Philip Morris Companies Inc.",
            "Phillips Petroleum Co",
            "Phillips Van Heusen Corp.",
            "Phoenix Companies Inc",
            "Pier 1 Imports Inc.",
            "Pilgrim's Pride Corporation",
            "Pinnacle West Capital Corp",
            "Pioneer-Standard Electronics Inc.",
            "Pitney Bowes Inc.",
            "Pittston Brinks Group",
            "Plains All American Pipeline LP",
            "PNC Financial Services Group Inc.",
            "PNM Resources Inc",
            "Polaris Industries Inc.",
            "Polo Ralph Lauren Corp",
            "PolyOne Corp",
            "Popular Inc",
            "Potlatch Corp",
            "PPG Industries Inc",
            "PPL Corp",
            "Praxair Inc",
            "Precision Castparts Corp",
            "Premcor Inc.",
            "Pride International Inc",
            "Primedia Inc",
            "Principal Financial Group Inc.",
            "Procter & Gamble Co.",
            "Pro-Fac Cooperative Inc.",
            "Progress Energy Inc",
            "Progressive Corporation",
            "Protective Life Corp",
            "Provident Financial Group",
            "Providian Financial Corp.",
            "Prudential Financial Inc.",
            "PSS World Medical Inc",
            "Public Service Enterprise Group Inc.",
            "Publix Super Markets Inc.",
            "Puget Energy Inc.",
            "Pulte Homes Inc",
            "Qualcomm Inc",
            "Quanta Services Inc.",
            "Quantum Corp",
            "Quest Diagnostics Inc.",
            "Questar Corp",
            "Quintiles Transnational",
            "Qwest Communications Intl Inc",
            "R.J. Reynolds Tobacco Company",
            "R.R. Donnelley & Sons Company",
            "Radio Shack Corporation",
            "Raymond James Financial Inc.",
            "Raytheon Company",
            "Reader's Digest Association Inc.",
            "Reebok International Ltd.",
            "Regions Financial Corp.",
            "Regis Corporation",
            "Reliance Steel & Aluminum Co.",
            "Reliant Energy Inc.",
            "Rent A Center Inc",
            "Republic Services Inc",
            "Revlon Inc",
            "RGS Energy Group Inc",
            "Rite Aid Corp",
            "Riverwood Holding Inc.",
            "RoadwayCorp",
            "Robert Half International Inc.",
            "Rock-Tenn Co",
            "Rockwell Automation Inc",
            "Rockwell Collins Inc",
            "Rohm & Haas Co.",
            "Ross Stores Inc",
            "RPM Inc.",
            "Ruddick Corp",
            "Ryder System Inc",
            "Ryerson Tull Inc",
            "Ryland Group Inc.",
            "Sabre Holdings Corp",
            "Safeco Corp",
            "Safeguard Scientifics Inc.",
            "Safeway Inc",
            "Saks Inc",
            "Sanmina-SCI Inc",
            "Sara Lee Corp",
            "SBC Communications Inc",
            "Scana Corp.",
            "Schering-Plough Corp",
            "Scholastic Corp",
            "SCI Systems Onc.",
            "Science Applications Intl. Inc.",
            "Scientific-Atlanta Inc",
            "Scotts Company",
            "Seaboard Corp",
            "Sealed Air Corp",
            "Sears Roebuck & Co",
            "Sempra Energy",
            "Sequa Corp",
            "Service Corp. International",
            "ServiceMaster Co",
            "Shaw Group Inc",
            "Sherwin-Williams Company",
            "Shopko Stores Inc",
            "Siebel Systems Inc",
            "Sierra Health Services Inc",
            "Sierra Pacific Resources",
            "Silgan Holdings Inc.",
            "Silicon Graphics Inc",
            "Simon Property Group Inc",
            "SLM Corporation",
            "Smith International Inc",
            "Smithfield Foods Inc",
            "Smurfit-Stone Container Corp",
            "Snap-On Inc",
            "Solectron Corp",
            "Solutia Inc",
            "Sonic Automotive Inc.",
            "Sonoco Products Co.",
            "Southern Company",
            "Southern Union Company",
            "SouthTrust Corp.",
            "Southwest Airlines Co",
            "Southwest Gas Corp",
            "Sovereign Bancorp Inc.",
            "Spartan Stores Inc",
            "Spherion Corp",
            "Sports Authority Inc",
            "Sprint Corp.",
            "SPX Corp",
            "St. Jude Medical Inc",
            "St. Paul Cos.",
            "Staff Leasing Inc.",
            "StanCorp Financial Group Inc",
            "Standard Pacific Corp.",
            "Stanley Works",
            "Staples Inc",
            "Starbucks Corp",
            "Starwood Hotels & Resorts Worldwide Inc",
            "State Street Corp.",
            "Stater Bros. Holdings Inc.",
            "Steelcase Inc",
            "Stein Mart Inc",
            "Stewart & Stevenson Services Inc",
            "Stewart Information Services Corp",
            "Stilwell Financial Inc",
            "Storage Technology Corporation",
            "Stryker Corp",
            "Sun Healthcare Group Inc.",
            "Sun Microsystems Inc.",
            "SunGard Data Systems Inc.",
            "Sunoco Inc.",
            "SunTrust Banks Inc",
            "Supervalu Inc",
            "Swift Transportation, Co., Inc",
            "Symbol Technologies Inc",
            "Synovus Financial Corp.",
            "Sysco Corp",
            "Systemax Inc.",
            "Target Corp.",
            "Tech Data Corporation",
            "TECO Energy Inc",
            "Tecumseh Products Company",
            "Tektronix Inc",
            "Teleflex Incorporated",
            "Telephone & Data Systems Inc",
            "Tellabs Inc.",
            "Temple-Inland Inc",
            "Tenet Healthcare Corporation",
            "Tenneco Automotive Inc.",
            "Teradyne Inc",
            "Terex Corp",
            "Tesoro Petroleum Corp.",
            "Texas Industries Inc.",
            "Texas Instruments Incorporated",
            "Textron Inc",
            "Thermo Electron Corporation",
            "Thomas & Betts Corporation",
            "Tiffany & Co",
            "Timken Company",
            "TJX Companies Inc",
            "TMP Worldwide Inc",
            "Toll Brothers Inc",
            "Torchmark Corporation",
            "Toro Company",
            "Tower Automotive Inc.",
            "Toys 'R' Us Inc",
            "Trans World Entertainment Corp.",
            "TransMontaigne Inc",
            "Transocean Inc",
            "TravelCenters of America Inc.",
            "Triad Hospitals Inc",
            "Tribune Company",
            "Trigon Healthcare Inc.",
            "Trinity Industries Inc",
            "Trump Hotels & Casino Resorts Inc.",
            "TruServ Corporation",
            "TRW Inc",
            "TXU Corp",
            "Tyson Foods Inc",
            "U.S. Bancorp",
            "U.S. Industries Inc.",
            "UAL Corporation",
            "UGI Corporation",
            "Unified Western Grocers Inc",
            "Union Pacific Corporation",
            "Union Planters Corp",
            "Unisource Energy Corp",
            "Unisys Corporation",
            "United Auto Group Inc",
            "United Defense Industries Inc.",
            "United Parcel Service Inc",
            "United Rentals Inc",
            "United Stationers Inc",
            "United Technologies Corporation",
            "UnitedHealth Group Incorporated",
            "Unitrin Inc",
            "Universal Corporation",
            "Universal Forest Products Inc",
            "Universal Health Services Inc",
            "Unocal Corporation",
            "Unova Inc",
            "UnumProvident Corporation",
            "URS Corporation",
            "US Airways Group Inc",
            "US Oncology Inc",
            "USA Interactive",
            "USFreighways Corporation",
            "USG Corporation",
            "UST Inc",
            "Valero Energy Corporation",
            "Valspar Corporation",
            "Value City Department Stores Inc",
            "Varco International Inc",
            "Vectren Corporation",
            "Veritas Software Corporation",
            "Verizon Communications Inc",
            "VF Corporation",
            "Viacom Inc",
            "Viad Corp",
            "Viasystems Group Inc",
            "Vishay Intertechnology Inc",
            "Visteon Corporation",
            "Volt Information Sciences Inc",
            "Vulcan Materials Company",
            "W.R. Berkley Corporation",
            "W.R. Grace & Co",
            "W.W. Grainger Inc",
            "Wachovia Corporation",
            "Wakenhut Corporation",
            "Walgreen Co",
            "Wallace Computer Services Inc",
            "Wal-Mart Stores Inc",
            "Walt Disney Co",
            "Walter Industries Inc",
            "Washington Mutual Inc",
            "Washington Post Co.",
            "Waste Management Inc",
            "Watsco Inc",
            "Weatherford International Inc",
            "Weis Markets Inc.",
            "Wellpoint Health Networks Inc",
            "Wells Fargo & Company",
            "Wendy's International Inc",
            "Werner Enterprises Inc",
            "WESCO International Inc",
            "Western Digital Inc",
            "Western Gas Resources Inc",
            "WestPoint Stevens Inc",
            "Weyerhauser Company",
            "WGL Holdings Inc",
            "Whirlpool Corporation",
            "Whole Foods Market Inc",
            "Willamette Industries Inc.",
            "Williams Companies Inc",
            "Williams Sonoma Inc",
            "Winn Dixie Stores Inc",
            "Wisconsin Energy Corporation",
            "Wm Wrigley Jr Company",
            "World Fuel Services Corporation",
            "WorldCom Inc",
            "Worthington Industries Inc",
            "WPS Resources Corporation",
            "Wyeth",
            "Wyndham International Inc",
            "Xcel Energy Inc",
            "Xerox Corp",
            "Xilinx Inc",
            "XO Communications Inc",
            "Yellow Corporation",
            "York International Corp",
            "Yum Brands Inc.",
            "Zale Corporation",
            "Zions Bancorporation"
          ],
          fileExtension: {
            "raster": ["bmp", "gif", "gpl", "ico", "jpeg", "psd", "png", "psp", "raw", "tiff"],
            "vector": ["3dv", "amf", "awg", "ai", "cgm", "cdr", "cmx", "dxf", "e2d", "egt", "eps", "fs", "odg", "svg", "xar"],
            "3d": ["3dmf", "3dm", "3mf", "3ds", "an8", "aoi", "blend", "cal3d", "cob", "ctm", "iob", "jas", "max", "mb", "mdx", "obj", "x", "x3d"],
            "document": ["doc", "docx", "dot", "html", "xml", "odt", "odm", "ott", "csv", "rtf", "tex", "xhtml", "xps"]
          },
          // Data taken from https://github.com/dmfilipenko/timezones.json/blob/master/timezones.json
          timezones: [
            {
              "name": "Dateline Standard Time",
              "abbr": "DST",
              "offset": -12,
              "isdst": false,
              "text": "(UTC-12:00) International Date Line West",
              "utc": [
                "Etc/GMT+12"
              ]
            },
            {
              "name": "UTC-11",
              "abbr": "U",
              "offset": -11,
              "isdst": false,
              "text": "(UTC-11:00) Coordinated Universal Time-11",
              "utc": [
                "Etc/GMT+11",
                "Pacific/Midway",
                "Pacific/Niue",
                "Pacific/Pago_Pago"
              ]
            },
            {
              "name": "Hawaiian Standard Time",
              "abbr": "HST",
              "offset": -10,
              "isdst": false,
              "text": "(UTC-10:00) Hawaii",
              "utc": [
                "Etc/GMT+10",
                "Pacific/Honolulu",
                "Pacific/Johnston",
                "Pacific/Rarotonga",
                "Pacific/Tahiti"
              ]
            },
            {
              "name": "Alaskan Standard Time",
              "abbr": "AKDT",
              "offset": -8,
              "isdst": true,
              "text": "(UTC-09:00) Alaska",
              "utc": [
                "America/Anchorage",
                "America/Juneau",
                "America/Nome",
                "America/Sitka",
                "America/Yakutat"
              ]
            },
            {
              "name": "Pacific Standard Time (Mexico)",
              "abbr": "PDT",
              "offset": -7,
              "isdst": true,
              "text": "(UTC-08:00) Baja California",
              "utc": [
                "America/Santa_Isabel"
              ]
            },
            {
              "name": "Pacific Daylight Time",
              "abbr": "PDT",
              "offset": -7,
              "isdst": true,
              "text": "(UTC-07:00) Pacific Time (US & Canada)",
              "utc": [
                "America/Dawson",
                "America/Los_Angeles",
                "America/Tijuana",
                "America/Vancouver",
                "America/Whitehorse"
              ]
            },
            {
              "name": "Pacific Standard Time",
              "abbr": "PST",
              "offset": -8,
              "isdst": false,
              "text": "(UTC-08:00) Pacific Time (US & Canada)",
              "utc": [
                "America/Dawson",
                "America/Los_Angeles",
                "America/Tijuana",
                "America/Vancouver",
                "America/Whitehorse",
                "PST8PDT"
              ]
            },
            {
              "name": "US Mountain Standard Time",
              "abbr": "UMST",
              "offset": -7,
              "isdst": false,
              "text": "(UTC-07:00) Arizona",
              "utc": [
                "America/Creston",
                "America/Dawson_Creek",
                "America/Hermosillo",
                "America/Phoenix",
                "Etc/GMT+7"
              ]
            },
            {
              "name": "Mountain Standard Time (Mexico)",
              "abbr": "MDT",
              "offset": -6,
              "isdst": true,
              "text": "(UTC-07:00) Chihuahua, La Paz, Mazatlan",
              "utc": [
                "America/Chihuahua",
                "America/Mazatlan"
              ]
            },
            {
              "name": "Mountain Standard Time",
              "abbr": "MDT",
              "offset": -6,
              "isdst": true,
              "text": "(UTC-07:00) Mountain Time (US & Canada)",
              "utc": [
                "America/Boise",
                "America/Cambridge_Bay",
                "America/Denver",
                "America/Edmonton",
                "America/Inuvik",
                "America/Ojinaga",
                "America/Yellowknife",
                "MST7MDT"
              ]
            },
            {
              "name": "Central America Standard Time",
              "abbr": "CAST",
              "offset": -6,
              "isdst": false,
              "text": "(UTC-06:00) Central America",
              "utc": [
                "America/Belize",
                "America/Costa_Rica",
                "America/El_Salvador",
                "America/Guatemala",
                "America/Managua",
                "America/Tegucigalpa",
                "Etc/GMT+6",
                "Pacific/Galapagos"
              ]
            },
            {
              "name": "Central Standard Time",
              "abbr": "CDT",
              "offset": -5,
              "isdst": true,
              "text": "(UTC-06:00) Central Time (US & Canada)",
              "utc": [
                "America/Chicago",
                "America/Indiana/Knox",
                "America/Indiana/Tell_City",
                "America/Matamoros",
                "America/Menominee",
                "America/North_Dakota/Beulah",
                "America/North_Dakota/Center",
                "America/North_Dakota/New_Salem",
                "America/Rainy_River",
                "America/Rankin_Inlet",
                "America/Resolute",
                "America/Winnipeg",
                "CST6CDT"
              ]
            },
            {
              "name": "Central Standard Time (Mexico)",
              "abbr": "CDT",
              "offset": -5,
              "isdst": true,
              "text": "(UTC-06:00) Guadalajara, Mexico City, Monterrey",
              "utc": [
                "America/Bahia_Banderas",
                "America/Cancun",
                "America/Merida",
                "America/Mexico_City",
                "America/Monterrey"
              ]
            },
            {
              "name": "Canada Central Standard Time",
              "abbr": "CCST",
              "offset": -6,
              "isdst": false,
              "text": "(UTC-06:00) Saskatchewan",
              "utc": [
                "America/Regina",
                "America/Swift_Current"
              ]
            },
            {
              "name": "SA Pacific Standard Time",
              "abbr": "SPST",
              "offset": -5,
              "isdst": false,
              "text": "(UTC-05:00) Bogota, Lima, Quito",
              "utc": [
                "America/Bogota",
                "America/Cayman",
                "America/Coral_Harbour",
                "America/Eirunepe",
                "America/Guayaquil",
                "America/Jamaica",
                "America/Lima",
                "America/Panama",
                "America/Rio_Branco",
                "Etc/GMT+5"
              ]
            },
            {
              "name": "Eastern Standard Time",
              "abbr": "EDT",
              "offset": -4,
              "isdst": true,
              "text": "(UTC-05:00) Eastern Time (US & Canada)",
              "utc": [
                "America/Detroit",
                "America/Havana",
                "America/Indiana/Petersburg",
                "America/Indiana/Vincennes",
                "America/Indiana/Winamac",
                "America/Iqaluit",
                "America/Kentucky/Monticello",
                "America/Louisville",
                "America/Montreal",
                "America/Nassau",
                "America/New_York",
                "America/Nipigon",
                "America/Pangnirtung",
                "America/Port-au-Prince",
                "America/Thunder_Bay",
                "America/Toronto",
                "EST5EDT"
              ]
            },
            {
              "name": "US Eastern Standard Time",
              "abbr": "UEDT",
              "offset": -4,
              "isdst": true,
              "text": "(UTC-05:00) Indiana (East)",
              "utc": [
                "America/Indiana/Marengo",
                "America/Indiana/Vevay",
                "America/Indianapolis"
              ]
            },
            {
              "name": "Venezuela Standard Time",
              "abbr": "VST",
              "offset": -4.5,
              "isdst": false,
              "text": "(UTC-04:30) Caracas",
              "utc": [
                "America/Caracas"
              ]
            },
            {
              "name": "Paraguay Standard Time",
              "abbr": "PYT",
              "offset": -4,
              "isdst": false,
              "text": "(UTC-04:00) Asuncion",
              "utc": [
                "America/Asuncion"
              ]
            },
            {
              "name": "Atlantic Standard Time",
              "abbr": "ADT",
              "offset": -3,
              "isdst": true,
              "text": "(UTC-04:00) Atlantic Time (Canada)",
              "utc": [
                "America/Glace_Bay",
                "America/Goose_Bay",
                "America/Halifax",
                "America/Moncton",
                "America/Thule",
                "Atlantic/Bermuda"
              ]
            },
            {
              "name": "Central Brazilian Standard Time",
              "abbr": "CBST",
              "offset": -4,
              "isdst": false,
              "text": "(UTC-04:00) Cuiaba",
              "utc": [
                "America/Campo_Grande",
                "America/Cuiaba"
              ]
            },
            {
              "name": "SA Western Standard Time",
              "abbr": "SWST",
              "offset": -4,
              "isdst": false,
              "text": "(UTC-04:00) Georgetown, La Paz, Manaus, San Juan",
              "utc": [
                "America/Anguilla",
                "America/Antigua",
                "America/Aruba",
                "America/Barbados",
                "America/Blanc-Sablon",
                "America/Boa_Vista",
                "America/Curacao",
                "America/Dominica",
                "America/Grand_Turk",
                "America/Grenada",
                "America/Guadeloupe",
                "America/Guyana",
                "America/Kralendijk",
                "America/La_Paz",
                "America/Lower_Princes",
                "America/Manaus",
                "America/Marigot",
                "America/Martinique",
                "America/Montserrat",
                "America/Port_of_Spain",
                "America/Porto_Velho",
                "America/Puerto_Rico",
                "America/Santo_Domingo",
                "America/St_Barthelemy",
                "America/St_Kitts",
                "America/St_Lucia",
                "America/St_Thomas",
                "America/St_Vincent",
                "America/Tortola",
                "Etc/GMT+4"
              ]
            },
            {
              "name": "Pacific SA Standard Time",
              "abbr": "PSST",
              "offset": -4,
              "isdst": false,
              "text": "(UTC-04:00) Santiago",
              "utc": [
                "America/Santiago",
                "Antarctica/Palmer"
              ]
            },
            {
              "name": "Newfoundland Standard Time",
              "abbr": "NDT",
              "offset": -2.5,
              "isdst": true,
              "text": "(UTC-03:30) Newfoundland",
              "utc": [
                "America/St_Johns"
              ]
            },
            {
              "name": "E. South America Standard Time",
              "abbr": "ESAST",
              "offset": -3,
              "isdst": false,
              "text": "(UTC-03:00) Brasilia",
              "utc": [
                "America/Sao_Paulo"
              ]
            },
            {
              "name": "Argentina Standard Time",
              "abbr": "AST",
              "offset": -3,
              "isdst": false,
              "text": "(UTC-03:00) Buenos Aires",
              "utc": [
                "America/Argentina/La_Rioja",
                "America/Argentina/Rio_Gallegos",
                "America/Argentina/Salta",
                "America/Argentina/San_Juan",
                "America/Argentina/San_Luis",
                "America/Argentina/Tucuman",
                "America/Argentina/Ushuaia",
                "America/Buenos_Aires",
                "America/Catamarca",
                "America/Cordoba",
                "America/Jujuy",
                "America/Mendoza"
              ]
            },
            {
              "name": "SA Eastern Standard Time",
              "abbr": "SEST",
              "offset": -3,
              "isdst": false,
              "text": "(UTC-03:00) Cayenne, Fortaleza",
              "utc": [
                "America/Araguaina",
                "America/Belem",
                "America/Cayenne",
                "America/Fortaleza",
                "America/Maceio",
                "America/Paramaribo",
                "America/Recife",
                "America/Santarem",
                "Antarctica/Rothera",
                "Atlantic/Stanley",
                "Etc/GMT+3"
              ]
            },
            {
              "name": "Greenland Standard Time",
              "abbr": "GDT",
              "offset": -3,
              "isdst": true,
              "text": "(UTC-03:00) Greenland",
              "utc": [
                "America/Godthab"
              ]
            },
            {
              "name": "Montevideo Standard Time",
              "abbr": "MST",
              "offset": -3,
              "isdst": false,
              "text": "(UTC-03:00) Montevideo",
              "utc": [
                "America/Montevideo"
              ]
            },
            {
              "name": "Bahia Standard Time",
              "abbr": "BST",
              "offset": -3,
              "isdst": false,
              "text": "(UTC-03:00) Salvador",
              "utc": [
                "America/Bahia"
              ]
            },
            {
              "name": "UTC-02",
              "abbr": "U",
              "offset": -2,
              "isdst": false,
              "text": "(UTC-02:00) Coordinated Universal Time-02",
              "utc": [
                "America/Noronha",
                "Atlantic/South_Georgia",
                "Etc/GMT+2"
              ]
            },
            {
              "name": "Mid-Atlantic Standard Time",
              "abbr": "MDT",
              "offset": -1,
              "isdst": true,
              "text": "(UTC-02:00) Mid-Atlantic - Old",
              "utc": []
            },
            {
              "name": "Azores Standard Time",
              "abbr": "ADT",
              "offset": 0,
              "isdst": true,
              "text": "(UTC-01:00) Azores",
              "utc": [
                "America/Scoresbysund",
                "Atlantic/Azores"
              ]
            },
            {
              "name": "Cape Verde Standard Time",
              "abbr": "CVST",
              "offset": -1,
              "isdst": false,
              "text": "(UTC-01:00) Cape Verde Is.",
              "utc": [
                "Atlantic/Cape_Verde",
                "Etc/GMT+1"
              ]
            },
            {
              "name": "Morocco Standard Time",
              "abbr": "MDT",
              "offset": 1,
              "isdst": true,
              "text": "(UTC) Casablanca",
              "utc": [
                "Africa/Casablanca",
                "Africa/El_Aaiun"
              ]
            },
            {
              "name": "UTC",
              "abbr": "UTC",
              "offset": 0,
              "isdst": false,
              "text": "(UTC) Coordinated Universal Time",
              "utc": [
                "America/Danmarkshavn",
                "Etc/GMT"
              ]
            },
            {
              "name": "GMT Standard Time",
              "abbr": "GMT",
              "offset": 0,
              "isdst": false,
              "text": "(UTC) Edinburgh, London",
              "utc": [
                "Europe/Isle_of_Man",
                "Europe/Guernsey",
                "Europe/Jersey",
                "Europe/London"
              ]
            },
            {
              "name": "British Summer Time",
              "abbr": "BST",
              "offset": 1,
              "isdst": true,
              "text": "(UTC+01:00) Edinburgh, London",
              "utc": [
                "Europe/Isle_of_Man",
                "Europe/Guernsey",
                "Europe/Jersey",
                "Europe/London"
              ]
            },
            {
              "name": "GMT Standard Time",
              "abbr": "GDT",
              "offset": 1,
              "isdst": true,
              "text": "(UTC) Dublin, Lisbon",
              "utc": [
                "Atlantic/Canary",
                "Atlantic/Faeroe",
                "Atlantic/Madeira",
                "Europe/Dublin",
                "Europe/Lisbon"
              ]
            },
            {
              "name": "Greenwich Standard Time",
              "abbr": "GST",
              "offset": 0,
              "isdst": false,
              "text": "(UTC) Monrovia, Reykjavik",
              "utc": [
                "Africa/Abidjan",
                "Africa/Accra",
                "Africa/Bamako",
                "Africa/Banjul",
                "Africa/Bissau",
                "Africa/Conakry",
                "Africa/Dakar",
                "Africa/Freetown",
                "Africa/Lome",
                "Africa/Monrovia",
                "Africa/Nouakchott",
                "Africa/Ouagadougou",
                "Africa/Sao_Tome",
                "Atlantic/Reykjavik",
                "Atlantic/St_Helena"
              ]
            },
            {
              "name": "W. Europe Standard Time",
              "abbr": "WEDT",
              "offset": 2,
              "isdst": true,
              "text": "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
              "utc": [
                "Arctic/Longyearbyen",
                "Europe/Amsterdam",
                "Europe/Andorra",
                "Europe/Berlin",
                "Europe/Busingen",
                "Europe/Gibraltar",
                "Europe/Luxembourg",
                "Europe/Malta",
                "Europe/Monaco",
                "Europe/Oslo",
                "Europe/Rome",
                "Europe/San_Marino",
                "Europe/Stockholm",
                "Europe/Vaduz",
                "Europe/Vatican",
                "Europe/Vienna",
                "Europe/Zurich"
              ]
            },
            {
              "name": "Central Europe Standard Time",
              "abbr": "CEDT",
              "offset": 2,
              "isdst": true,
              "text": "(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",
              "utc": [
                "Europe/Belgrade",
                "Europe/Bratislava",
                "Europe/Budapest",
                "Europe/Ljubljana",
                "Europe/Podgorica",
                "Europe/Prague",
                "Europe/Tirane"
              ]
            },
            {
              "name": "Romance Standard Time",
              "abbr": "RDT",
              "offset": 2,
              "isdst": true,
              "text": "(UTC+01:00) Brussels, Copenhagen, Madrid, Paris",
              "utc": [
                "Africa/Ceuta",
                "Europe/Brussels",
                "Europe/Copenhagen",
                "Europe/Madrid",
                "Europe/Paris"
              ]
            },
            {
              "name": "Central European Standard Time",
              "abbr": "CEDT",
              "offset": 2,
              "isdst": true,
              "text": "(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb",
              "utc": [
                "Europe/Sarajevo",
                "Europe/Skopje",
                "Europe/Warsaw",
                "Europe/Zagreb"
              ]
            },
            {
              "name": "W. Central Africa Standard Time",
              "abbr": "WCAST",
              "offset": 1,
              "isdst": false,
              "text": "(UTC+01:00) West Central Africa",
              "utc": [
                "Africa/Algiers",
                "Africa/Bangui",
                "Africa/Brazzaville",
                "Africa/Douala",
                "Africa/Kinshasa",
                "Africa/Lagos",
                "Africa/Libreville",
                "Africa/Luanda",
                "Africa/Malabo",
                "Africa/Ndjamena",
                "Africa/Niamey",
                "Africa/Porto-Novo",
                "Africa/Tunis",
                "Etc/GMT-1"
              ]
            },
            {
              "name": "Namibia Standard Time",
              "abbr": "NST",
              "offset": 1,
              "isdst": false,
              "text": "(UTC+01:00) Windhoek",
              "utc": [
                "Africa/Windhoek"
              ]
            },
            {
              "name": "GTB Standard Time",
              "abbr": "GDT",
              "offset": 3,
              "isdst": true,
              "text": "(UTC+02:00) Athens, Bucharest",
              "utc": [
                "Asia/Nicosia",
                "Europe/Athens",
                "Europe/Bucharest",
                "Europe/Chisinau"
              ]
            },
            {
              "name": "Middle East Standard Time",
              "abbr": "MEDT",
              "offset": 3,
              "isdst": true,
              "text": "(UTC+02:00) Beirut",
              "utc": [
                "Asia/Beirut"
              ]
            },
            {
              "name": "Egypt Standard Time",
              "abbr": "EST",
              "offset": 2,
              "isdst": false,
              "text": "(UTC+02:00) Cairo",
              "utc": [
                "Africa/Cairo"
              ]
            },
            {
              "name": "Syria Standard Time",
              "abbr": "SDT",
              "offset": 3,
              "isdst": true,
              "text": "(UTC+02:00) Damascus",
              "utc": [
                "Asia/Damascus"
              ]
            },
            {
              "name": "E. Europe Standard Time",
              "abbr": "EEDT",
              "offset": 3,
              "isdst": true,
              "text": "(UTC+02:00) E. Europe",
              "utc": [
                "Asia/Nicosia",
                "Europe/Athens",
                "Europe/Bucharest",
                "Europe/Chisinau",
                "Europe/Helsinki",
                "Europe/Kiev",
                "Europe/Mariehamn",
                "Europe/Nicosia",
                "Europe/Riga",
                "Europe/Sofia",
                "Europe/Tallinn",
                "Europe/Uzhgorod",
                "Europe/Vilnius",
                "Europe/Zaporozhye"
              ]
            },
            {
              "name": "South Africa Standard Time",
              "abbr": "SAST",
              "offset": 2,
              "isdst": false,
              "text": "(UTC+02:00) Harare, Pretoria",
              "utc": [
                "Africa/Blantyre",
                "Africa/Bujumbura",
                "Africa/Gaborone",
                "Africa/Harare",
                "Africa/Johannesburg",
                "Africa/Kigali",
                "Africa/Lubumbashi",
                "Africa/Lusaka",
                "Africa/Maputo",
                "Africa/Maseru",
                "Africa/Mbabane",
                "Etc/GMT-2"
              ]
            },
            {
              "name": "FLE Standard Time",
              "abbr": "FDT",
              "offset": 3,
              "isdst": true,
              "text": "(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
              "utc": [
                "Europe/Helsinki",
                "Europe/Kiev",
                "Europe/Mariehamn",
                "Europe/Riga",
                "Europe/Sofia",
                "Europe/Tallinn",
                "Europe/Uzhgorod",
                "Europe/Vilnius",
                "Europe/Zaporozhye"
              ]
            },
            {
              "name": "Turkey Standard Time",
              "abbr": "TDT",
              "offset": 3,
              "isdst": false,
              "text": "(UTC+03:00) Istanbul",
              "utc": [
                "Europe/Istanbul"
              ]
            },
            {
              "name": "Israel Standard Time",
              "abbr": "JDT",
              "offset": 3,
              "isdst": true,
              "text": "(UTC+02:00) Jerusalem",
              "utc": [
                "Asia/Jerusalem"
              ]
            },
            {
              "name": "Libya Standard Time",
              "abbr": "LST",
              "offset": 2,
              "isdst": false,
              "text": "(UTC+02:00) Tripoli",
              "utc": [
                "Africa/Tripoli"
              ]
            },
            {
              "name": "Jordan Standard Time",
              "abbr": "JST",
              "offset": 3,
              "isdst": false,
              "text": "(UTC+03:00) Amman",
              "utc": [
                "Asia/Amman"
              ]
            },
            {
              "name": "Arabic Standard Time",
              "abbr": "AST",
              "offset": 3,
              "isdst": false,
              "text": "(UTC+03:00) Baghdad",
              "utc": [
                "Asia/Baghdad"
              ]
            },
            {
              "name": "Kaliningrad Standard Time",
              "abbr": "KST",
              "offset": 3,
              "isdst": false,
              "text": "(UTC+02:00) Kaliningrad",
              "utc": [
                "Europe/Kaliningrad"
              ]
            },
            {
              "name": "Arab Standard Time",
              "abbr": "AST",
              "offset": 3,
              "isdst": false,
              "text": "(UTC+03:00) Kuwait, Riyadh",
              "utc": [
                "Asia/Aden",
                "Asia/Bahrain",
                "Asia/Kuwait",
                "Asia/Qatar",
                "Asia/Riyadh"
              ]
            },
            {
              "name": "E. Africa Standard Time",
              "abbr": "EAST",
              "offset": 3,
              "isdst": false,
              "text": "(UTC+03:00) Nairobi",
              "utc": [
                "Africa/Addis_Ababa",
                "Africa/Asmera",
                "Africa/Dar_es_Salaam",
                "Africa/Djibouti",
                "Africa/Juba",
                "Africa/Kampala",
                "Africa/Khartoum",
                "Africa/Mogadishu",
                "Africa/Nairobi",
                "Antarctica/Syowa",
                "Etc/GMT-3",
                "Indian/Antananarivo",
                "Indian/Comoro",
                "Indian/Mayotte"
              ]
            },
            {
              "name": "Moscow Standard Time",
              "abbr": "MSK",
              "offset": 3,
              "isdst": false,
              "text": "(UTC+03:00) Moscow, St. Petersburg, Volgograd, Minsk",
              "utc": [
                "Europe/Kirov",
                "Europe/Moscow",
                "Europe/Simferopol",
                "Europe/Volgograd",
                "Europe/Minsk"
              ]
            },
            {
              "name": "Samara Time",
              "abbr": "SAMT",
              "offset": 4,
              "isdst": false,
              "text": "(UTC+04:00) Samara, Ulyanovsk, Saratov",
              "utc": [
                "Europe/Astrakhan",
                "Europe/Samara",
                "Europe/Ulyanovsk"
              ]
            },
            {
              "name": "Iran Standard Time",
              "abbr": "IDT",
              "offset": 4.5,
              "isdst": true,
              "text": "(UTC+03:30) Tehran",
              "utc": [
                "Asia/Tehran"
              ]
            },
            {
              "name": "Arabian Standard Time",
              "abbr": "AST",
              "offset": 4,
              "isdst": false,
              "text": "(UTC+04:00) Abu Dhabi, Muscat",
              "utc": [
                "Asia/Dubai",
                "Asia/Muscat",
                "Etc/GMT-4"
              ]
            },
            {
              "name": "Azerbaijan Standard Time",
              "abbr": "ADT",
              "offset": 5,
              "isdst": true,
              "text": "(UTC+04:00) Baku",
              "utc": [
                "Asia/Baku"
              ]
            },
            {
              "name": "Mauritius Standard Time",
              "abbr": "MST",
              "offset": 4,
              "isdst": false,
              "text": "(UTC+04:00) Port Louis",
              "utc": [
                "Indian/Mahe",
                "Indian/Mauritius",
                "Indian/Reunion"
              ]
            },
            {
              "name": "Georgian Standard Time",
              "abbr": "GET",
              "offset": 4,
              "isdst": false,
              "text": "(UTC+04:00) Tbilisi",
              "utc": [
                "Asia/Tbilisi"
              ]
            },
            {
              "name": "Caucasus Standard Time",
              "abbr": "CST",
              "offset": 4,
              "isdst": false,
              "text": "(UTC+04:00) Yerevan",
              "utc": [
                "Asia/Yerevan"
              ]
            },
            {
              "name": "Afghanistan Standard Time",
              "abbr": "AST",
              "offset": 4.5,
              "isdst": false,
              "text": "(UTC+04:30) Kabul",
              "utc": [
                "Asia/Kabul"
              ]
            },
            {
              "name": "West Asia Standard Time",
              "abbr": "WAST",
              "offset": 5,
              "isdst": false,
              "text": "(UTC+05:00) Ashgabat, Tashkent",
              "utc": [
                "Antarctica/Mawson",
                "Asia/Aqtau",
                "Asia/Aqtobe",
                "Asia/Ashgabat",
                "Asia/Dushanbe",
                "Asia/Oral",
                "Asia/Samarkand",
                "Asia/Tashkent",
                "Etc/GMT-5",
                "Indian/Kerguelen",
                "Indian/Maldives"
              ]
            },
            {
              "name": "Yekaterinburg Time",
              "abbr": "YEKT",
              "offset": 5,
              "isdst": false,
              "text": "(UTC+05:00) Yekaterinburg",
              "utc": [
                "Asia/Yekaterinburg"
              ]
            },
            {
              "name": "Pakistan Standard Time",
              "abbr": "PKT",
              "offset": 5,
              "isdst": false,
              "text": "(UTC+05:00) Islamabad, Karachi",
              "utc": [
                "Asia/Karachi"
              ]
            },
            {
              "name": "India Standard Time",
              "abbr": "IST",
              "offset": 5.5,
              "isdst": false,
              "text": "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
              "utc": [
                "Asia/Kolkata"
              ]
            },
            {
              "name": "Sri Lanka Standard Time",
              "abbr": "SLST",
              "offset": 5.5,
              "isdst": false,
              "text": "(UTC+05:30) Sri Jayawardenepura",
              "utc": [
                "Asia/Colombo"
              ]
            },
            {
              "name": "Nepal Standard Time",
              "abbr": "NST",
              "offset": 5.75,
              "isdst": false,
              "text": "(UTC+05:45) Kathmandu",
              "utc": [
                "Asia/Kathmandu"
              ]
            },
            {
              "name": "Central Asia Standard Time",
              "abbr": "CAST",
              "offset": 6,
              "isdst": false,
              "text": "(UTC+06:00) Nur-Sultan (Astana)",
              "utc": [
                "Antarctica/Vostok",
                "Asia/Almaty",
                "Asia/Bishkek",
                "Asia/Qyzylorda",
                "Asia/Urumqi",
                "Etc/GMT-6",
                "Indian/Chagos"
              ]
            },
            {
              "name": "Bangladesh Standard Time",
              "abbr": "BST",
              "offset": 6,
              "isdst": false,
              "text": "(UTC+06:00) Dhaka",
              "utc": [
                "Asia/Dhaka",
                "Asia/Thimphu"
              ]
            },
            {
              "name": "Myanmar Standard Time",
              "abbr": "MST",
              "offset": 6.5,
              "isdst": false,
              "text": "(UTC+06:30) Yangon (Rangoon)",
              "utc": [
                "Asia/Rangoon",
                "Indian/Cocos"
              ]
            },
            {
              "name": "SE Asia Standard Time",
              "abbr": "SAST",
              "offset": 7,
              "isdst": false,
              "text": "(UTC+07:00) Bangkok, Hanoi, Jakarta",
              "utc": [
                "Antarctica/Davis",
                "Asia/Bangkok",
                "Asia/Hovd",
                "Asia/Jakarta",
                "Asia/Phnom_Penh",
                "Asia/Pontianak",
                "Asia/Saigon",
                "Asia/Vientiane",
                "Etc/GMT-7",
                "Indian/Christmas"
              ]
            },
            {
              "name": "N. Central Asia Standard Time",
              "abbr": "NCAST",
              "offset": 7,
              "isdst": false,
              "text": "(UTC+07:00) Novosibirsk",
              "utc": [
                "Asia/Novokuznetsk",
                "Asia/Novosibirsk",
                "Asia/Omsk"
              ]
            },
            {
              "name": "China Standard Time",
              "abbr": "CST",
              "offset": 8,
              "isdst": false,
              "text": "(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi",
              "utc": [
                "Asia/Hong_Kong",
                "Asia/Macau",
                "Asia/Shanghai"
              ]
            },
            {
              "name": "North Asia Standard Time",
              "abbr": "NAST",
              "offset": 8,
              "isdst": false,
              "text": "(UTC+08:00) Krasnoyarsk",
              "utc": [
                "Asia/Krasnoyarsk"
              ]
            },
            {
              "name": "Singapore Standard Time",
              "abbr": "MPST",
              "offset": 8,
              "isdst": false,
              "text": "(UTC+08:00) Kuala Lumpur, Singapore",
              "utc": [
                "Asia/Brunei",
                "Asia/Kuala_Lumpur",
                "Asia/Kuching",
                "Asia/Makassar",
                "Asia/Manila",
                "Asia/Singapore",
                "Etc/GMT-8"
              ]
            },
            {
              "name": "W. Australia Standard Time",
              "abbr": "WAST",
              "offset": 8,
              "isdst": false,
              "text": "(UTC+08:00) Perth",
              "utc": [
                "Antarctica/Casey",
                "Australia/Perth"
              ]
            },
            {
              "name": "Taipei Standard Time",
              "abbr": "TST",
              "offset": 8,
              "isdst": false,
              "text": "(UTC+08:00) Taipei",
              "utc": [
                "Asia/Taipei"
              ]
            },
            {
              "name": "Ulaanbaatar Standard Time",
              "abbr": "UST",
              "offset": 8,
              "isdst": false,
              "text": "(UTC+08:00) Ulaanbaatar",
              "utc": [
                "Asia/Choibalsan",
                "Asia/Ulaanbaatar"
              ]
            },
            {
              "name": "North Asia East Standard Time",
              "abbr": "NAEST",
              "offset": 8,
              "isdst": false,
              "text": "(UTC+08:00) Irkutsk",
              "utc": [
                "Asia/Irkutsk"
              ]
            },
            {
              "name": "Japan Standard Time",
              "abbr": "JST",
              "offset": 9,
              "isdst": false,
              "text": "(UTC+09:00) Osaka, Sapporo, Tokyo",
              "utc": [
                "Asia/Dili",
                "Asia/Jayapura",
                "Asia/Tokyo",
                "Etc/GMT-9",
                "Pacific/Palau"
              ]
            },
            {
              "name": "Korea Standard Time",
              "abbr": "KST",
              "offset": 9,
              "isdst": false,
              "text": "(UTC+09:00) Seoul",
              "utc": [
                "Asia/Pyongyang",
                "Asia/Seoul"
              ]
            },
            {
              "name": "Cen. Australia Standard Time",
              "abbr": "CAST",
              "offset": 9.5,
              "isdst": false,
              "text": "(UTC+09:30) Adelaide",
              "utc": [
                "Australia/Adelaide",
                "Australia/Broken_Hill"
              ]
            },
            {
              "name": "AUS Central Standard Time",
              "abbr": "ACST",
              "offset": 9.5,
              "isdst": false,
              "text": "(UTC+09:30) Darwin",
              "utc": [
                "Australia/Darwin"
              ]
            },
            {
              "name": "E. Australia Standard Time",
              "abbr": "EAST",
              "offset": 10,
              "isdst": false,
              "text": "(UTC+10:00) Brisbane",
              "utc": [
                "Australia/Brisbane",
                "Australia/Lindeman"
              ]
            },
            {
              "name": "AUS Eastern Standard Time",
              "abbr": "AEST",
              "offset": 10,
              "isdst": false,
              "text": "(UTC+10:00) Canberra, Melbourne, Sydney",
              "utc": [
                "Australia/Melbourne",
                "Australia/Sydney"
              ]
            },
            {
              "name": "West Pacific Standard Time",
              "abbr": "WPST",
              "offset": 10,
              "isdst": false,
              "text": "(UTC+10:00) Guam, Port Moresby",
              "utc": [
                "Antarctica/DumontDUrville",
                "Etc/GMT-10",
                "Pacific/Guam",
                "Pacific/Port_Moresby",
                "Pacific/Saipan",
                "Pacific/Truk"
              ]
            },
            {
              "name": "Tasmania Standard Time",
              "abbr": "TST",
              "offset": 10,
              "isdst": false,
              "text": "(UTC+10:00) Hobart",
              "utc": [
                "Australia/Currie",
                "Australia/Hobart"
              ]
            },
            {
              "name": "Yakutsk Standard Time",
              "abbr": "YST",
              "offset": 9,
              "isdst": false,
              "text": "(UTC+09:00) Yakutsk",
              "utc": [
                "Asia/Chita",
                "Asia/Khandyga",
                "Asia/Yakutsk"
              ]
            },
            {
              "name": "Central Pacific Standard Time",
              "abbr": "CPST",
              "offset": 11,
              "isdst": false,
              "text": "(UTC+11:00) Solomon Is., New Caledonia",
              "utc": [
                "Antarctica/Macquarie",
                "Etc/GMT-11",
                "Pacific/Efate",
                "Pacific/Guadalcanal",
                "Pacific/Kosrae",
                "Pacific/Noumea",
                "Pacific/Ponape"
              ]
            },
            {
              "name": "Vladivostok Standard Time",
              "abbr": "VST",
              "offset": 11,
              "isdst": false,
              "text": "(UTC+11:00) Vladivostok",
              "utc": [
                "Asia/Sakhalin",
                "Asia/Ust-Nera",
                "Asia/Vladivostok"
              ]
            },
            {
              "name": "New Zealand Standard Time",
              "abbr": "NZST",
              "offset": 12,
              "isdst": false,
              "text": "(UTC+12:00) Auckland, Wellington",
              "utc": [
                "Antarctica/McMurdo",
                "Pacific/Auckland"
              ]
            },
            {
              "name": "UTC+12",
              "abbr": "U",
              "offset": 12,
              "isdst": false,
              "text": "(UTC+12:00) Coordinated Universal Time+12",
              "utc": [
                "Etc/GMT-12",
                "Pacific/Funafuti",
                "Pacific/Kwajalein",
                "Pacific/Majuro",
                "Pacific/Nauru",
                "Pacific/Tarawa",
                "Pacific/Wake",
                "Pacific/Wallis"
              ]
            },
            {
              "name": "Fiji Standard Time",
              "abbr": "FST",
              "offset": 12,
              "isdst": false,
              "text": "(UTC+12:00) Fiji",
              "utc": [
                "Pacific/Fiji"
              ]
            },
            {
              "name": "Magadan Standard Time",
              "abbr": "MST",
              "offset": 12,
              "isdst": false,
              "text": "(UTC+12:00) Magadan",
              "utc": [
                "Asia/Anadyr",
                "Asia/Kamchatka",
                "Asia/Magadan",
                "Asia/Srednekolymsk"
              ]
            },
            {
              "name": "Kamchatka Standard Time",
              "abbr": "KDT",
              "offset": 13,
              "isdst": true,
              "text": "(UTC+12:00) Petropavlovsk-Kamchatsky - Old",
              "utc": [
                "Asia/Kamchatka"
              ]
            },
            {
              "name": "Tonga Standard Time",
              "abbr": "TST",
              "offset": 13,
              "isdst": false,
              "text": "(UTC+13:00) Nuku'alofa",
              "utc": [
                "Etc/GMT-13",
                "Pacific/Enderbury",
                "Pacific/Fakaofo",
                "Pacific/Tongatapu"
              ]
            },
            {
              "name": "Samoa Standard Time",
              "abbr": "SST",
              "offset": 13,
              "isdst": false,
              "text": "(UTC+13:00) Samoa",
              "utc": [
                "Pacific/Apia"
              ]
            }
          ],
          //List source: http://answers.google.com/answers/threadview/id/589312.html
          profession: [
            "Airline Pilot",
            "Academic Team",
            "Accountant",
            "Account Executive",
            "Actor",
            "Actuary",
            "Acquisition Analyst",
            "Administrative Asst.",
            "Administrative Analyst",
            "Administrator",
            "Advertising Director",
            "Aerospace Engineer",
            "Agent",
            "Agricultural Inspector",
            "Agricultural Scientist",
            "Air Traffic Controller",
            "Animal Trainer",
            "Anthropologist",
            "Appraiser",
            "Architect",
            "Art Director",
            "Artist",
            "Astronomer",
            "Athletic Coach",
            "Auditor",
            "Author",
            "Baker",
            "Banker",
            "Bankruptcy Attorney",
            "Benefits Manager",
            "Biologist",
            "Bio-feedback Specialist",
            "Biomedical Engineer",
            "Biotechnical Researcher",
            "Broadcaster",
            "Broker",
            "Building Manager",
            "Building Contractor",
            "Building Inspector",
            "Business Analyst",
            "Business Planner",
            "Business Manager",
            "Buyer",
            "Call Center Manager",
            "Career Counselor",
            "Cash Manager",
            "Ceramic Engineer",
            "Chief Executive Officer",
            "Chief Operation Officer",
            "Chef",
            "Chemical Engineer",
            "Chemist",
            "Child Care Manager",
            "Chief Medical Officer",
            "Chiropractor",
            "Cinematographer",
            "City Housing Manager",
            "City Manager",
            "Civil Engineer",
            "Claims Manager",
            "Clinical Research Assistant",
            "Collections Manager",
            "Compliance Manager",
            "Comptroller",
            "Computer Manager",
            "Commercial Artist",
            "Communications Affairs Director",
            "Communications Director",
            "Communications Engineer",
            "Compensation Analyst",
            "Computer Programmer",
            "Computer Ops. Manager",
            "Computer Engineer",
            "Computer Operator",
            "Computer Graphics Specialist",
            "Construction Engineer",
            "Construction Manager",
            "Consultant",
            "Consumer Relations Manager",
            "Contract Administrator",
            "Copyright Attorney",
            "Copywriter",
            "Corporate Planner",
            "Corrections Officer",
            "Cosmetologist",
            "Credit Analyst",
            "Cruise Director",
            "Chief Information Officer",
            "Chief Technology Officer",
            "Customer Service Manager",
            "Cryptologist",
            "Dancer",
            "Data Security Manager",
            "Database Manager",
            "Day Care Instructor",
            "Dentist",
            "Designer",
            "Design Engineer",
            "Desktop Publisher",
            "Developer",
            "Development Officer",
            "Diamond Merchant",
            "Dietitian",
            "Direct Marketer",
            "Director",
            "Distribution Manager",
            "Diversity Manager",
            "Economist",
            "EEO Compliance Manager",
            "Editor",
            "Education Adminator",
            "Electrical Engineer",
            "Electro Optical Engineer",
            "Electronics Engineer",
            "Embassy Management",
            "Employment Agent",
            "Engineer Technician",
            "Entrepreneur",
            "Environmental Analyst",
            "Environmental Attorney",
            "Environmental Engineer",
            "Environmental Specialist",
            "Escrow Officer",
            "Estimator",
            "Executive Assistant",
            "Executive Director",
            "Executive Recruiter",
            "Facilities Manager",
            "Family Counselor",
            "Fashion Events Manager",
            "Fashion Merchandiser",
            "Fast Food Manager",
            "Film Producer",
            "Film Production Assistant",
            "Financial Analyst",
            "Financial Planner",
            "Financier",
            "Fine Artist",
            "Wildlife Specialist",
            "Fitness Consultant",
            "Flight Attendant",
            "Flight Engineer",
            "Floral Designer",
            "Food & Beverage Director",
            "Food Service Manager",
            "Forestry Technician",
            "Franchise Management",
            "Franchise Sales",
            "Fraud Investigator",
            "Freelance Writer",
            "Fund Raiser",
            "General Manager",
            "Geologist",
            "General Counsel",
            "Geriatric Specialist",
            "Gerontologist",
            "Glamour Photographer",
            "Golf Club Manager",
            "Gourmet Chef",
            "Graphic Designer",
            "Grounds Keeper",
            "Hazardous Waste Manager",
            "Health Care Manager",
            "Health Therapist",
            "Health Service Administrator",
            "Hearing Officer",
            "Home Economist",
            "Horticulturist",
            "Hospital Administrator",
            "Hotel Manager",
            "Human Resources Manager",
            "Importer",
            "Industrial Designer",
            "Industrial Engineer",
            "Information Director",
            "Inside Sales",
            "Insurance Adjuster",
            "Interior Decorator",
            "Internal Controls Director",
            "International Acct.",
            "International Courier",
            "International Lawyer",
            "Interpreter",
            "Investigator",
            "Investment Banker",
            "Investment Manager",
            "IT Architect",
            "IT Project Manager",
            "IT Systems Analyst",
            "Jeweler",
            "Joint Venture Manager",
            "Journalist",
            "Labor Negotiator",
            "Labor Organizer",
            "Labor Relations Manager",
            "Lab Services Director",
            "Lab Technician",
            "Land Developer",
            "Landscape Architect",
            "Law Enforcement Officer",
            "Lawyer",
            "Lead Software Engineer",
            "Lead Software Test Engineer",
            "Leasing Manager",
            "Legal Secretary",
            "Library Manager",
            "Litigation Attorney",
            "Loan Officer",
            "Lobbyist",
            "Logistics Manager",
            "Maintenance Manager",
            "Management Consultant",
            "Managed Care Director",
            "Managing Partner",
            "Manufacturing Director",
            "Manpower Planner",
            "Marine Biologist",
            "Market Res. Analyst",
            "Marketing Director",
            "Materials Manager",
            "Mathematician",
            "Membership Chairman",
            "Mechanic",
            "Mechanical Engineer",
            "Media Buyer",
            "Medical Investor",
            "Medical Secretary",
            "Medical Technician",
            "Mental Health Counselor",
            "Merchandiser",
            "Metallurgical Engineering",
            "Meteorologist",
            "Microbiologist",
            "MIS Manager",
            "Motion Picture Director",
            "Multimedia Director",
            "Musician",
            "Network Administrator",
            "Network Specialist",
            "Network Operator",
            "New Product Manager",
            "Novelist",
            "Nuclear Engineer",
            "Nuclear Specialist",
            "Nutritionist",
            "Nursing Administrator",
            "Occupational Therapist",
            "Oceanographer",
            "Office Manager",
            "Operations Manager",
            "Operations Research Director",
            "Optical Technician",
            "Optometrist",
            "Organizational Development Manager",
            "Outplacement Specialist",
            "Paralegal",
            "Park Ranger",
            "Patent Attorney",
            "Payroll Specialist",
            "Personnel Specialist",
            "Petroleum Engineer",
            "Pharmacist",
            "Photographer",
            "Physical Therapist",
            "Physician",
            "Physician Assistant",
            "Physicist",
            "Planning Director",
            "Podiatrist",
            "Political Analyst",
            "Political Scientist",
            "Politician",
            "Portfolio Manager",
            "Preschool Management",
            "Preschool Teacher",
            "Principal",
            "Private Banker",
            "Private Investigator",
            "Probation Officer",
            "Process Engineer",
            "Producer",
            "Product Manager",
            "Product Engineer",
            "Production Engineer",
            "Production Planner",
            "Professional Athlete",
            "Professional Coach",
            "Professor",
            "Project Engineer",
            "Project Manager",
            "Program Manager",
            "Property Manager",
            "Public Administrator",
            "Public Safety Director",
            "PR Specialist",
            "Publisher",
            "Purchasing Agent",
            "Publishing Director",
            "Quality Assurance Specialist",
            "Quality Control Engineer",
            "Quality Control Inspector",
            "Radiology Manager",
            "Railroad Engineer",
            "Real Estate Broker",
            "Recreational Director",
            "Recruiter",
            "Redevelopment Specialist",
            "Regulatory Affairs Manager",
            "Registered Nurse",
            "Rehabilitation Counselor",
            "Relocation Manager",
            "Reporter",
            "Research Specialist",
            "Restaurant Manager",
            "Retail Store Manager",
            "Risk Analyst",
            "Safety Engineer",
            "Sales Engineer",
            "Sales Trainer",
            "Sales Promotion Manager",
            "Sales Representative",
            "Sales Manager",
            "Service Manager",
            "Sanitation Engineer",
            "Scientific Programmer",
            "Scientific Writer",
            "Securities Analyst",
            "Security Consultant",
            "Security Director",
            "Seminar Presenter",
            "Ship's Officer",
            "Singer",
            "Social Director",
            "Social Program Planner",
            "Social Research",
            "Social Scientist",
            "Social Worker",
            "Sociologist",
            "Software Developer",
            "Software Engineer",
            "Software Test Engineer",
            "Soil Scientist",
            "Special Events Manager",
            "Special Education Teacher",
            "Special Projects Director",
            "Speech Pathologist",
            "Speech Writer",
            "Sports Event Manager",
            "Statistician",
            "Store Manager",
            "Strategic Alliance Director",
            "Strategic Planning Director",
            "Stress Reduction Specialist",
            "Stockbroker",
            "Surveyor",
            "Structural Engineer",
            "Superintendent",
            "Supply Chain Director",
            "System Engineer",
            "Systems Analyst",
            "Systems Programmer",
            "System Administrator",
            "Tax Specialist",
            "Teacher",
            "Technical Support Specialist",
            "Technical Illustrator",
            "Technical Writer",
            "Technology Director",
            "Telecom Analyst",
            "Telemarketer",
            "Theatrical Director",
            "Title Examiner",
            "Tour Escort",
            "Tour Guide Director",
            "Traffic Manager",
            "Trainer Translator",
            "Transportation Manager",
            "Travel Agent",
            "Treasurer",
            "TV Programmer",
            "Underwriter",
            "Union Representative",
            "University Administrator",
            "University Dean",
            "Urban Planner",
            "Veterinarian",
            "Vendor Relations Director",
            "Viticulturist",
            "Warehouse Manager"
          ],
          animals: {
            //list of ocean animals comes from https://owlcation.com/stem/list-of-ocean-animals
            "ocean": ["Acantharea", "Anemone", "Angelfish King", "Ahi Tuna", "Albacore", "American Oyster", "Anchovy", "Armored Snail", "Arctic Char", "Atlantic Bluefin Tuna", "Atlantic Cod", "Atlantic Goliath Grouper", "Atlantic Trumpetfish", "Atlantic Wolffish", "Baleen Whale", "Banded Butterflyfish", "Banded Coral Shrimp", "Banded Sea Krait", "Barnacle", "Barndoor Skate", "Barracuda", "Basking Shark", "Bass", "Beluga Whale", "Bluebanded Goby", "Bluehead Wrasse", "Bluefish", "Bluestreak Cleaner-Wrasse", "Blue Marlin", "Blue Shark", "Blue Spiny Lobster", "Blue Tang", "Blue Whale", "Broadclub Cuttlefish", "Bull Shark", "Chambered Nautilus", "Chilean Basket Star", "Chilean Jack Mackerel", "Chinook Salmon", "Christmas Tree Worm", "Clam", "Clown Anemonefish", "Clown Triggerfish", "Cod", "Coelacanth", "Cockscomb Cup Coral", "Common Fangtooth", "Conch", "Cookiecutter Shark", "Copepod", "Coral", "Corydoras", "Cownose Ray", "Crab", "Crown-of-Thorns Starfish", "Cushion Star", "Cuttlefish", "California Sea Otters", "Dolphin", "Dolphinfish", "Dory", "Devil Fish", "Dugong", "Dumbo Octopus", "Dungeness Crab", "Eccentric Sand Dollar", "Edible Sea Cucumber", "Eel", "Elephant Seal", "Elkhorn Coral", "Emperor Shrimp", "Estuarine Crocodile", "Fathead Sculpin", "Fiddler Crab", "Fin Whale", "Flameback", "Flamingo Tongue Snail", "Flashlight Fish", "Flatback Turtle", "Flatfish", "Flying Fish", "Flounder", "Fluke", "French Angelfish", "Frilled Shark", "Fugu (also called Pufferfish)", "Gar", "Geoduck", "Giant Barrel Sponge", "Giant Caribbean Sea Anemone", "Giant Clam", "Giant Isopod", "Giant Kingfish", "Giant Oarfish", "Giant Pacific Octopus", "Giant Pyrosome", "Giant Sea Star", "Giant Squid", "Glowing Sucker Octopus", "Giant Tube Worm", "Goblin Shark", "Goosefish", "Great White Shark", "Greenland Shark", "Grey Atlantic Seal", "Grouper", "Grunion", "Guineafowl Puffer", "Haddock", "Hake", "Halibut", "Hammerhead Shark", "Hapuka", "Harbor Porpoise", "Harbor Seal", "Hatchetfish", "Hawaiian Monk Seal", "Hawksbill Turtle", "Hector's Dolphin", "Hermit Crab", "Herring", "Hoki", "Horn Shark", "Horseshoe Crab", "Humpback Anglerfish", "Humpback Whale", "Icefish", "Imperator Angelfish", "Irukandji Jellyfish", "Isopod", "Ivory Bush Coral", "Japanese Spider Crab", "Jellyfish", "John Dory", "Juan Fernandez Fur Seal", "Killer Whale", "Kiwa Hirsuta", "Krill", "Lagoon Triggerfish", "Lamprey", "Leafy Seadragon", "Leopard Seal", "Limpet", "Ling", "Lionfish", "Lions Mane Jellyfish", "Lobe Coral", "Lobster", "Loggerhead Turtle", "Longnose Sawshark", "Longsnout Seahorse", "Lophelia Coral", "Marrus Orthocanna", "Manatee", "Manta Ray", "Marlin", "Megamouth Shark", "Mexican Lookdown", "Mimic Octopus", "Moon Jelly", "Mollusk", "Monkfish", "Moray Eel", "Mullet", "Mussel", "Megaladon", "Napoleon Wrasse", "Nassau Grouper", "Narwhal", "Nautilus", "Needlefish", "Northern Seahorse", "North Atlantic Right Whale", "Northern Red Snapper", "Norway Lobster", "Nudibranch", "Nurse Shark", "Oarfish", "Ocean Sunfish", "Oceanic Whitetip Shark", "Octopus", "Olive Sea Snake", "Orange Roughy", "Ostracod", "Otter", "Oyster", "Pacific Angelshark", "Pacific Blackdragon", "Pacific Halibut", "Pacific Sardine", "Pacific Sea Nettle Jellyfish", "Pacific White Sided Dolphin", "Pantropical Spotted Dolphin", "Patagonian Toothfish", "Peacock Mantis Shrimp", "Pelagic Thresher Shark", "Penguin", "Peruvian Anchoveta", "Pilchard", "Pink Salmon", "Pinniped", "Plankton", "Porpoise", "Polar Bear", "Portuguese Man o' War", "Pycnogonid Sea Spider", "Quahog", "Queen Angelfish", "Queen Conch", "Queen Parrotfish", "Queensland Grouper", "Ragfish", "Ratfish", "Rattail Fish", "Ray", "Red Drum", "Red King Crab", "Ringed Seal", "Risso's Dolphin", "Ross Seals", "Sablefish", "Salmon", "Sand Dollar", "Sandbar Shark", "Sawfish", "Sarcastic Fringehead", "Scalloped Hammerhead Shark", "Seahorse", "Sea Cucumber", "Sea Lion", "Sea Urchin", "Seal", "Shark", "Shortfin Mako Shark", "Shovelnose Guitarfish", "Shrimp", "Silverside Fish", "Skipjack Tuna", "Slender Snipe Eel", "Smalltooth Sawfish", "Smelts", "Sockeye Salmon", "Southern Stingray", "Sponge", "Spotted Porcupinefish", "Spotted Dolphin", "Spotted Eagle Ray", "Spotted Moray", "Squid", "Squidworm", "Starfish", "Stickleback", "Stonefish", "Stoplight Loosejaw", "Sturgeon", "Swordfish", "Tan Bristlemouth", "Tasseled Wobbegong", "Terrible Claw Lobster", "Threespot Damselfish", "Tiger Prawn", "Tiger Shark", "Tilefish", "Toadfish", "Tropical Two-Wing Flyfish", "Tuna", "Umbrella Squid", "Velvet Crab", "Venus Flytrap Sea Anemone", "Vigtorniella Worm", "Viperfish", "Vampire Squid", "Vaquita", "Wahoo", "Walrus", "West Indian Manatee", "Whale", "Whale Shark", "Whiptail Gulper", "White-Beaked Dolphin", "White-Ring Garden Eel", "White Shrimp", "Wobbegong", "Wrasse", "Wreckfish", "Xiphosura", "Yellowtail Damselfish", "Yelloweye Rockfish", "Yellow Cup Black Coral", "Yellow Tube Sponge", "Yellowfin Tuna", "Zebrashark", "Zooplankton"],
            //list of desert, grassland, and forest animals comes from http://www.skyenimals.com/
            "desert": ["Aardwolf", "Addax", "African Wild Ass", "Ant", "Antelope", "Armadillo", "Baboon", "Badger", "Bat", "Bearded Dragon", "Beetle", "Bird", "Black-footed Cat", "Boa", "Brown Bear", "Bustard", "Butterfly", "Camel", "Caracal", "Caracara", "Caterpillar", "Centipede", "Cheetah", "Chipmunk", "Chuckwalla", "Climbing Mouse", "Coati", "Cobra", "Cotton Rat", "Cougar", "Courser", "Crane Fly", "Crow", "Dassie Rat", "Dove", "Dunnart", "Eagle", "Echidna", "Elephant", "Emu", "Falcon", "Fly", "Fox", "Frogmouth", "Gecko", "Geoffroy's Cat", "Gerbil", "Grasshopper", "Guanaco", "Gundi", "Hamster", "Hawk", "Hedgehog", "Hyena", "Hyrax", "Jackal", "Kangaroo", "Kangaroo Rat", "Kestrel", "Kowari", "Kultarr", "Leopard", "Lion", "Macaw", "Meerkat", "Mouse", "Oryx", "Ostrich", "Owl", "Pronghorn", "Python", "Rabbit", "Raccoon", "Rattlesnake", "Rhinoceros", "Sand Cat", "Spectacled Bear", "Spiny Mouse", "Starling", "Stick Bug", "Tarantula", "Tit", "Toad", "Tortoise", "Tyrant Flycatcher", "Viper", "Vulture", "Waxwing", "Xerus", "Zebra"],
            "grassland": ["Aardvark", "Aardwolf", "Accentor", "African Buffalo", "African Wild Dog", "Alpaca", "Anaconda", "Ant", "Anteater", "Antelope", "Armadillo", "Baboon", "Badger", "Bandicoot", "Barbet", "Bat", "Bee", "Bee-eater", "Beetle", "Bird", "Bison", "Black-footed Cat", "Black-footed Ferret", "Bluebird", "Boa", "Bowerbird", "Brown Bear", "Bush Dog", "Bushshrike", "Bustard", "Butterfly", "Buzzard", "Caracal", "Caracara", "Cardinal", "Caterpillar", "Cheetah", "Chipmunk", "Civet", "Climbing Mouse", "Clouded Leopard", "Coati", "Cobra", "Cockatoo", "Cockroach", "Common Genet", "Cotton Rat", "Cougar", "Courser", "Coyote", "Crane", "Crane Fly", "Cricket", "Crow", "Culpeo", "Death Adder", "Deer", "Deer Mouse", "Dingo", "Dinosaur", "Dove", "Drongo", "Duck", "Duiker", "Dunnart", "Eagle", "Echidna", "Elephant", "Elk", "Emu", "Falcon", "Finch", "Flea", "Fly", "Flying Frog", "Fox", "Frog", "Frogmouth", "Garter Snake", "Gazelle", "Gecko", "Geoffroy's Cat", "Gerbil", "Giant Tortoise", "Giraffe", "Grasshopper", "Grison", "Groundhog", "Grouse", "Guanaco", "Guinea Pig", "Hamster", "Harrier", "Hartebeest", "Hawk", "Hedgehog", "Helmetshrike", "Hippopotamus", "Hornbill", "Hyena", "Hyrax", "Impala", "Jackal", "Jaguar", "Jaguarundi", "Kangaroo", "Kangaroo Rat", "Kestrel", "Kultarr", "Ladybug", "Leopard", "Lion", "Macaw", "Meerkat", "Mouse", "Newt", "Oryx", "Ostrich", "Owl", "Pangolin", "Pheasant", "Prairie Dog", "Pronghorn", "Przewalski's Horse", "Python", "Quoll", "Rabbit", "Raven", "Rhinoceros", "Shelduck", "Sloth Bear", "Spectacled Bear", "Squirrel", "Starling", "Stick Bug", "Tamandua", "Tasmanian Devil", "Thornbill", "Thrush", "Toad", "Tortoise"],
            "forest": ["Agouti", "Anaconda", "Anoa", "Ant", "Anteater", "Antelope", "Armadillo", "Asian Black Bear", "Aye-aye", "Babirusa", "Baboon", "Badger", "Bandicoot", "Banteng", "Barbet", "Basilisk", "Bat", "Bearded Dragon", "Bee", "Bee-eater", "Beetle", "Bettong", "Binturong", "Bird-of-paradise", "Bongo", "Bowerbird", "Bulbul", "Bush Dog", "Bushbaby", "Bushshrike", "Butterfly", "Buzzard", "Caecilian", "Cardinal", "Cassowary", "Caterpillar", "Centipede", "Chameleon", "Chimpanzee", "Cicada", "Civet", "Clouded Leopard", "Coati", "Cobra", "Cockatoo", "Cockroach", "Colugo", "Cotinga", "Cotton Rat", "Cougar", "Crane Fly", "Cricket", "Crocodile", "Crow", "Cuckoo", "Cuscus", "Death Adder", "Deer", "Dhole", "Dingo", "Dinosaur", "Drongo", "Duck", "Duiker", "Eagle", "Echidna", "Elephant", "Finch", "Flat-headed Cat", "Flea", "Flowerpecker", "Fly", "Flying Frog", "Fossa", "Frog", "Frogmouth", "Gaur", "Gecko", "Gorilla", "Grison", "Hawaiian Honeycreeper", "Hawk", "Hedgehog", "Helmetshrike", "Hornbill", "Hyrax", "Iguana", "Jackal", "Jaguar", "Jaguarundi", "Kestrel", "Ladybug", "Lemur", "Leopard", "Lion", "Macaw", "Mandrill", "Margay", "Monkey", "Mouse", "Mouse Deer", "Newt", "Okapi", "Old World Flycatcher", "Orangutan", "Owl", "Pangolin", "Peafowl", "Pheasant", "Possum", "Python", "Quokka", "Rabbit", "Raccoon", "Red Panda", "Red River Hog", "Rhinoceros", "Sloth Bear", "Spectacled Bear", "Squirrel", "Starling", "Stick Bug", "Sun Bear", "Tamandua", "Tamarin", "Tapir", "Tarantula", "Thrush", "Tiger", "Tit", "Toad", "Tortoise", "Toucan", "Trogon", "Trumpeter", "Turaco", "Turtle", "Tyrant Flycatcher", "Viper", "Vulture", "Wallaby", "Warbler", "Wasp", "Waxwing", "Weaver", "Weaver-finch", "Whistler", "White-eye", "Whydah", "Woodswallow", "Worm", "Wren", "Xenops", "Yellowjacket", "Accentor", "African Buffalo", "American Black Bear", "Anole", "Bird", "Bison", "Boa", "Brown Bear", "Chipmunk", "Common Genet", "Copperhead", "Coyote", "Deer Mouse", "Dormouse", "Elk", "Emu", "Fisher", "Fox", "Garter Snake", "Giant Panda", "Giant Tortoise", "Groundhog", "Grouse", "Guanaco", "Himalayan Tahr", "Kangaroo", "Koala", "Numbat", "Quoll", "Raccoon dog", "Tasmanian Devil", "Thornbill", "Turkey", "Vole", "Weasel", "Wildcat", "Wolf", "Wombat", "Woodchuck", "Woodpecker"],
            //list of farm animals comes from https://www.buzzle.com/articles/farm-animals-list.html
            "farm": ["Alpaca", "Buffalo", "Banteng", "Cow", "Cat", "Chicken", "Carp", "Camel", "Donkey", "Dog", "Duck", "Emu", "Goat", "Gayal", "Guinea", "Goose", "Horse", "Honey", "Llama", "Pig", "Pigeon", "Rhea", "Rabbit", "Sheep", "Silkworm", "Turkey", "Yak", "Zebu"],
            //list of pet animals comes from https://www.dogbreedinfo.com/pets/pet.htm
            "pet": ["Bearded Dragon", "Birds", "Burro", "Cats", "Chameleons", "Chickens", "Chinchillas", "Chinese Water Dragon", "Cows", "Dogs", "Donkey", "Ducks", "Ferrets", "Fish", "Geckos", "Geese", "Gerbils", "Goats", "Guinea Fowl", "Guinea Pigs", "Hamsters", "Hedgehogs", "Horses", "Iguanas", "Llamas", "Lizards", "Mice", "Mule", "Peafowl", "Pigs and Hogs", "Pigeons", "Ponies", "Pot Bellied Pig", "Rabbits", "Rats", "Sheep", "Skinks", "Snakes", "Stick Insects", "Sugar Gliders", "Tarantula", "Turkeys", "Turtles"],
            //list of zoo animals comes from https://bronxzoo.com/animals
            "zoo": ["Aardvark", "African Wild Dog", "Aldabra Tortoise", "American Alligator", "American Bison", "Amur Tiger", "Anaconda", "Andean Condor", "Asian Elephant", "Baby Doll Sheep", "Bald Eagle", "Barred Owl", "Blue Iguana", "Boer Goat", "California Sea Lion", "Caribbean Flamingo", "Chinchilla", "Collared Lemur", "Coquerel's Sifaka", "Cuban Amazon Parrot", "Ebony Langur", "Fennec Fox", "Fossa", "Gelada", "Giant Anteater", "Giraffe", "Gorilla", "Grizzly Bear", "Henkel's Leaf-tailed Gecko", "Indian Gharial", "Indian Rhinoceros", "King Cobra", "King Vulture", "Komodo Dragon", "Linne's Two-toed Sloth", "Lion", "Little Penguin", "Madagascar Tree Boa", "Magellanic Penguin", "Malayan Tapir", "Malayan Tiger", "Matschies Tree Kangaroo", "Mini Donkey", "Monarch Butterfly", "Nile crocodile", "North American Porcupine", "Nubian Ibex", "Okapi", "Poison Dart Frog", "Polar Bear", "Pygmy Marmoset", "Radiated Tortoise", "Red Panda", "Red Ruffed Lemur", "Ring-tailed Lemur", "Ring-tailed Mongoose", "Rock Hyrax", "Small Clawed Asian Otter", "Snow Leopard", "Snowy Owl", "Southern White-faced Owl", "Southern White Rhinocerous", "Squirrel Monkey", "Tufted Puffin", "White Cheeked Gibbon", "White-throated Bee Eater", "Zebra"]
          },
          primes: [
            // 1230 first primes, i.e. all primes up to the first one greater than 10000, inclusive.
            2,
            3,
            5,
            7,
            11,
            13,
            17,
            19,
            23,
            29,
            31,
            37,
            41,
            43,
            47,
            53,
            59,
            61,
            67,
            71,
            73,
            79,
            83,
            89,
            97,
            101,
            103,
            107,
            109,
            113,
            127,
            131,
            137,
            139,
            149,
            151,
            157,
            163,
            167,
            173,
            179,
            181,
            191,
            193,
            197,
            199,
            211,
            223,
            227,
            229,
            233,
            239,
            241,
            251,
            257,
            263,
            269,
            271,
            277,
            281,
            283,
            293,
            307,
            311,
            313,
            317,
            331,
            337,
            347,
            349,
            353,
            359,
            367,
            373,
            379,
            383,
            389,
            397,
            401,
            409,
            419,
            421,
            431,
            433,
            439,
            443,
            449,
            457,
            461,
            463,
            467,
            479,
            487,
            491,
            499,
            503,
            509,
            521,
            523,
            541,
            547,
            557,
            563,
            569,
            571,
            577,
            587,
            593,
            599,
            601,
            607,
            613,
            617,
            619,
            631,
            641,
            643,
            647,
            653,
            659,
            661,
            673,
            677,
            683,
            691,
            701,
            709,
            719,
            727,
            733,
            739,
            743,
            751,
            757,
            761,
            769,
            773,
            787,
            797,
            809,
            811,
            821,
            823,
            827,
            829,
            839,
            853,
            857,
            859,
            863,
            877,
            881,
            883,
            887,
            907,
            911,
            919,
            929,
            937,
            941,
            947,
            953,
            967,
            971,
            977,
            983,
            991,
            997,
            1009,
            1013,
            1019,
            1021,
            1031,
            1033,
            1039,
            1049,
            1051,
            1061,
            1063,
            1069,
            1087,
            1091,
            1093,
            1097,
            1103,
            1109,
            1117,
            1123,
            1129,
            1151,
            1153,
            1163,
            1171,
            1181,
            1187,
            1193,
            1201,
            1213,
            1217,
            1223,
            1229,
            1231,
            1237,
            1249,
            1259,
            1277,
            1279,
            1283,
            1289,
            1291,
            1297,
            1301,
            1303,
            1307,
            1319,
            1321,
            1327,
            1361,
            1367,
            1373,
            1381,
            1399,
            1409,
            1423,
            1427,
            1429,
            1433,
            1439,
            1447,
            1451,
            1453,
            1459,
            1471,
            1481,
            1483,
            1487,
            1489,
            1493,
            1499,
            1511,
            1523,
            1531,
            1543,
            1549,
            1553,
            1559,
            1567,
            1571,
            1579,
            1583,
            1597,
            1601,
            1607,
            1609,
            1613,
            1619,
            1621,
            1627,
            1637,
            1657,
            1663,
            1667,
            1669,
            1693,
            1697,
            1699,
            1709,
            1721,
            1723,
            1733,
            1741,
            1747,
            1753,
            1759,
            1777,
            1783,
            1787,
            1789,
            1801,
            1811,
            1823,
            1831,
            1847,
            1861,
            1867,
            1871,
            1873,
            1877,
            1879,
            1889,
            1901,
            1907,
            1913,
            1931,
            1933,
            1949,
            1951,
            1973,
            1979,
            1987,
            1993,
            1997,
            1999,
            2003,
            2011,
            2017,
            2027,
            2029,
            2039,
            2053,
            2063,
            2069,
            2081,
            2083,
            2087,
            2089,
            2099,
            2111,
            2113,
            2129,
            2131,
            2137,
            2141,
            2143,
            2153,
            2161,
            2179,
            2203,
            2207,
            2213,
            2221,
            2237,
            2239,
            2243,
            2251,
            2267,
            2269,
            2273,
            2281,
            2287,
            2293,
            2297,
            2309,
            2311,
            2333,
            2339,
            2341,
            2347,
            2351,
            2357,
            2371,
            2377,
            2381,
            2383,
            2389,
            2393,
            2399,
            2411,
            2417,
            2423,
            2437,
            2441,
            2447,
            2459,
            2467,
            2473,
            2477,
            2503,
            2521,
            2531,
            2539,
            2543,
            2549,
            2551,
            2557,
            2579,
            2591,
            2593,
            2609,
            2617,
            2621,
            2633,
            2647,
            2657,
            2659,
            2663,
            2671,
            2677,
            2683,
            2687,
            2689,
            2693,
            2699,
            2707,
            2711,
            2713,
            2719,
            2729,
            2731,
            2741,
            2749,
            2753,
            2767,
            2777,
            2789,
            2791,
            2797,
            2801,
            2803,
            2819,
            2833,
            2837,
            2843,
            2851,
            2857,
            2861,
            2879,
            2887,
            2897,
            2903,
            2909,
            2917,
            2927,
            2939,
            2953,
            2957,
            2963,
            2969,
            2971,
            2999,
            3001,
            3011,
            3019,
            3023,
            3037,
            3041,
            3049,
            3061,
            3067,
            3079,
            3083,
            3089,
            3109,
            3119,
            3121,
            3137,
            3163,
            3167,
            3169,
            3181,
            3187,
            3191,
            3203,
            3209,
            3217,
            3221,
            3229,
            3251,
            3253,
            3257,
            3259,
            3271,
            3299,
            3301,
            3307,
            3313,
            3319,
            3323,
            3329,
            3331,
            3343,
            3347,
            3359,
            3361,
            3371,
            3373,
            3389,
            3391,
            3407,
            3413,
            3433,
            3449,
            3457,
            3461,
            3463,
            3467,
            3469,
            3491,
            3499,
            3511,
            3517,
            3527,
            3529,
            3533,
            3539,
            3541,
            3547,
            3557,
            3559,
            3571,
            3581,
            3583,
            3593,
            3607,
            3613,
            3617,
            3623,
            3631,
            3637,
            3643,
            3659,
            3671,
            3673,
            3677,
            3691,
            3697,
            3701,
            3709,
            3719,
            3727,
            3733,
            3739,
            3761,
            3767,
            3769,
            3779,
            3793,
            3797,
            3803,
            3821,
            3823,
            3833,
            3847,
            3851,
            3853,
            3863,
            3877,
            3881,
            3889,
            3907,
            3911,
            3917,
            3919,
            3923,
            3929,
            3931,
            3943,
            3947,
            3967,
            3989,
            4001,
            4003,
            4007,
            4013,
            4019,
            4021,
            4027,
            4049,
            4051,
            4057,
            4073,
            4079,
            4091,
            4093,
            4099,
            4111,
            4127,
            4129,
            4133,
            4139,
            4153,
            4157,
            4159,
            4177,
            4201,
            4211,
            4217,
            4219,
            4229,
            4231,
            4241,
            4243,
            4253,
            4259,
            4261,
            4271,
            4273,
            4283,
            4289,
            4297,
            4327,
            4337,
            4339,
            4349,
            4357,
            4363,
            4373,
            4391,
            4397,
            4409,
            4421,
            4423,
            4441,
            4447,
            4451,
            4457,
            4463,
            4481,
            4483,
            4493,
            4507,
            4513,
            4517,
            4519,
            4523,
            4547,
            4549,
            4561,
            4567,
            4583,
            4591,
            4597,
            4603,
            4621,
            4637,
            4639,
            4643,
            4649,
            4651,
            4657,
            4663,
            4673,
            4679,
            4691,
            4703,
            4721,
            4723,
            4729,
            4733,
            4751,
            4759,
            4783,
            4787,
            4789,
            4793,
            4799,
            4801,
            4813,
            4817,
            4831,
            4861,
            4871,
            4877,
            4889,
            4903,
            4909,
            4919,
            4931,
            4933,
            4937,
            4943,
            4951,
            4957,
            4967,
            4969,
            4973,
            4987,
            4993,
            4999,
            5003,
            5009,
            5011,
            5021,
            5023,
            5039,
            5051,
            5059,
            5077,
            5081,
            5087,
            5099,
            5101,
            5107,
            5113,
            5119,
            5147,
            5153,
            5167,
            5171,
            5179,
            5189,
            5197,
            5209,
            5227,
            5231,
            5233,
            5237,
            5261,
            5273,
            5279,
            5281,
            5297,
            5303,
            5309,
            5323,
            5333,
            5347,
            5351,
            5381,
            5387,
            5393,
            5399,
            5407,
            5413,
            5417,
            5419,
            5431,
            5437,
            5441,
            5443,
            5449,
            5471,
            5477,
            5479,
            5483,
            5501,
            5503,
            5507,
            5519,
            5521,
            5527,
            5531,
            5557,
            5563,
            5569,
            5573,
            5581,
            5591,
            5623,
            5639,
            5641,
            5647,
            5651,
            5653,
            5657,
            5659,
            5669,
            5683,
            5689,
            5693,
            5701,
            5711,
            5717,
            5737,
            5741,
            5743,
            5749,
            5779,
            5783,
            5791,
            5801,
            5807,
            5813,
            5821,
            5827,
            5839,
            5843,
            5849,
            5851,
            5857,
            5861,
            5867,
            5869,
            5879,
            5881,
            5897,
            5903,
            5923,
            5927,
            5939,
            5953,
            5981,
            5987,
            6007,
            6011,
            6029,
            6037,
            6043,
            6047,
            6053,
            6067,
            6073,
            6079,
            6089,
            6091,
            6101,
            6113,
            6121,
            6131,
            6133,
            6143,
            6151,
            6163,
            6173,
            6197,
            6199,
            6203,
            6211,
            6217,
            6221,
            6229,
            6247,
            6257,
            6263,
            6269,
            6271,
            6277,
            6287,
            6299,
            6301,
            6311,
            6317,
            6323,
            6329,
            6337,
            6343,
            6353,
            6359,
            6361,
            6367,
            6373,
            6379,
            6389,
            6397,
            6421,
            6427,
            6449,
            6451,
            6469,
            6473,
            6481,
            6491,
            6521,
            6529,
            6547,
            6551,
            6553,
            6563,
            6569,
            6571,
            6577,
            6581,
            6599,
            6607,
            6619,
            6637,
            6653,
            6659,
            6661,
            6673,
            6679,
            6689,
            6691,
            6701,
            6703,
            6709,
            6719,
            6733,
            6737,
            6761,
            6763,
            6779,
            6781,
            6791,
            6793,
            6803,
            6823,
            6827,
            6829,
            6833,
            6841,
            6857,
            6863,
            6869,
            6871,
            6883,
            6899,
            6907,
            6911,
            6917,
            6947,
            6949,
            6959,
            6961,
            6967,
            6971,
            6977,
            6983,
            6991,
            6997,
            7001,
            7013,
            7019,
            7027,
            7039,
            7043,
            7057,
            7069,
            7079,
            7103,
            7109,
            7121,
            7127,
            7129,
            7151,
            7159,
            7177,
            7187,
            7193,
            7207,
            7211,
            7213,
            7219,
            7229,
            7237,
            7243,
            7247,
            7253,
            7283,
            7297,
            7307,
            7309,
            7321,
            7331,
            7333,
            7349,
            7351,
            7369,
            7393,
            7411,
            7417,
            7433,
            7451,
            7457,
            7459,
            7477,
            7481,
            7487,
            7489,
            7499,
            7507,
            7517,
            7523,
            7529,
            7537,
            7541,
            7547,
            7549,
            7559,
            7561,
            7573,
            7577,
            7583,
            7589,
            7591,
            7603,
            7607,
            7621,
            7639,
            7643,
            7649,
            7669,
            7673,
            7681,
            7687,
            7691,
            7699,
            7703,
            7717,
            7723,
            7727,
            7741,
            7753,
            7757,
            7759,
            7789,
            7793,
            7817,
            7823,
            7829,
            7841,
            7853,
            7867,
            7873,
            7877,
            7879,
            7883,
            7901,
            7907,
            7919,
            7927,
            7933,
            7937,
            7949,
            7951,
            7963,
            7993,
            8009,
            8011,
            8017,
            8039,
            8053,
            8059,
            8069,
            8081,
            8087,
            8089,
            8093,
            8101,
            8111,
            8117,
            8123,
            8147,
            8161,
            8167,
            8171,
            8179,
            8191,
            8209,
            8219,
            8221,
            8231,
            8233,
            8237,
            8243,
            8263,
            8269,
            8273,
            8287,
            8291,
            8293,
            8297,
            8311,
            8317,
            8329,
            8353,
            8363,
            8369,
            8377,
            8387,
            8389,
            8419,
            8423,
            8429,
            8431,
            8443,
            8447,
            8461,
            8467,
            8501,
            8513,
            8521,
            8527,
            8537,
            8539,
            8543,
            8563,
            8573,
            8581,
            8597,
            8599,
            8609,
            8623,
            8627,
            8629,
            8641,
            8647,
            8663,
            8669,
            8677,
            8681,
            8689,
            8693,
            8699,
            8707,
            8713,
            8719,
            8731,
            8737,
            8741,
            8747,
            8753,
            8761,
            8779,
            8783,
            8803,
            8807,
            8819,
            8821,
            8831,
            8837,
            8839,
            8849,
            8861,
            8863,
            8867,
            8887,
            8893,
            8923,
            8929,
            8933,
            8941,
            8951,
            8963,
            8969,
            8971,
            8999,
            9001,
            9007,
            9011,
            9013,
            9029,
            9041,
            9043,
            9049,
            9059,
            9067,
            9091,
            9103,
            9109,
            9127,
            9133,
            9137,
            9151,
            9157,
            9161,
            9173,
            9181,
            9187,
            9199,
            9203,
            9209,
            9221,
            9227,
            9239,
            9241,
            9257,
            9277,
            9281,
            9283,
            9293,
            9311,
            9319,
            9323,
            9337,
            9341,
            9343,
            9349,
            9371,
            9377,
            9391,
            9397,
            9403,
            9413,
            9419,
            9421,
            9431,
            9433,
            9437,
            9439,
            9461,
            9463,
            9467,
            9473,
            9479,
            9491,
            9497,
            9511,
            9521,
            9533,
            9539,
            9547,
            9551,
            9587,
            9601,
            9613,
            9619,
            9623,
            9629,
            9631,
            9643,
            9649,
            9661,
            9677,
            9679,
            9689,
            9697,
            9719,
            9721,
            9733,
            9739,
            9743,
            9749,
            9767,
            9769,
            9781,
            9787,
            9791,
            9803,
            9811,
            9817,
            9829,
            9833,
            9839,
            9851,
            9857,
            9859,
            9871,
            9883,
            9887,
            9901,
            9907,
            9923,
            9929,
            9931,
            9941,
            9949,
            9967,
            9973,
            10007
          ],
          emotions: [
            "love",
            "joy",
            "surprise",
            "anger",
            "sadness",
            "fear"
          ]
        };
        var o_hasOwnProperty = Object.prototype.hasOwnProperty;
        var o_keys = Object.keys || function(obj) {
          var result = [];
          for (var key in obj) {
            if (o_hasOwnProperty.call(obj, key)) {
              result.push(key);
            }
          }
          return result;
        };
        function _copyObject(source, target) {
          var keys = o_keys(source);
          var key;
          for (var i = 0, l = keys.length; i < l; i++) {
            key = keys[i];
            target[key] = source[key] || target[key];
          }
        }
        function _copyArray(source, target) {
          for (var i = 0, l = source.length; i < l; i++) {
            target[i] = source[i];
          }
        }
        function copyObject(source, _target) {
          var isArray = Array.isArray(source);
          var target = _target || (isArray ? new Array(source.length) : {});
          if (isArray) {
            _copyArray(source, target);
          } else {
            _copyObject(source, target);
          }
          return target;
        }
        Chance2.prototype.get = function(name) {
          return copyObject(data[name]);
        };
        Chance2.prototype.mac_address = function(options) {
          options = initOptions(options);
          if (!options.separator) {
            options.separator = options.networkVersion ? "." : ":";
          }
          var mac_pool = "ABCDEF1234567890", mac = "";
          if (!options.networkVersion) {
            mac = this.n(this.string, 6, { pool: mac_pool, length: 2 }).join(options.separator);
          } else {
            mac = this.n(this.string, 3, { pool: mac_pool, length: 4 }).join(options.separator);
          }
          return mac;
        };
        Chance2.prototype.normal = function(options) {
          options = initOptions(options, { mean: 0, dev: 1, pool: [] });
          testRange(
            options.pool.constructor !== Array,
            "Chance: The pool option must be a valid array."
          );
          testRange(
            typeof options.mean !== "number",
            "Chance: Mean (mean) must be a number"
          );
          testRange(
            typeof options.dev !== "number",
            "Chance: Standard deviation (dev) must be a number"
          );
          if (options.pool.length > 0) {
            return this.normal_pool(options);
          }
          var s, u, v, norm, mean = options.mean, dev = options.dev;
          do {
            u = this.random() * 2 - 1;
            v = this.random() * 2 - 1;
            s = u * u + v * v;
          } while (s >= 1);
          norm = u * Math.sqrt(-2 * Math.log(s) / s);
          return dev * norm + mean;
        };
        Chance2.prototype.normal_pool = function(options) {
          var performanceCounter = 0;
          do {
            var idx = Math.round(this.normal({ mean: options.mean, dev: options.dev }));
            if (idx < options.pool.length && idx >= 0) {
              return options.pool[idx];
            } else {
              performanceCounter++;
            }
          } while (performanceCounter < 100);
          throw new RangeError("Chance: Your pool is too small for the given mean and standard deviation. Please adjust.");
        };
        Chance2.prototype.radio = function(options) {
          options = initOptions(options, { side: "?" });
          var fl = "";
          switch (options.side.toLowerCase()) {
            case "east":
            case "e":
              fl = "W";
              break;
            case "west":
            case "w":
              fl = "K";
              break;
            default:
              fl = this.character({ pool: "KW" });
              break;
          }
          return fl + this.character({ alpha: true, casing: "upper" }) + this.character({ alpha: true, casing: "upper" }) + this.character({ alpha: true, casing: "upper" });
        };
        Chance2.prototype.set = function(name, values) {
          if (typeof name === "string") {
            data[name] = values;
          } else {
            data = copyObject(name, data);
          }
        };
        Chance2.prototype.tv = function(options) {
          return this.radio(options);
        };
        Chance2.prototype.cnpj = function() {
          var n = this.n(this.natural, 8, { max: 9 });
          var d1 = 2 + n[7] * 6 + n[6] * 7 + n[5] * 8 + n[4] * 9 + n[3] * 2 + n[2] * 3 + n[1] * 4 + n[0] * 5;
          d1 = 11 - d1 % 11;
          if (d1 >= 10) {
            d1 = 0;
          }
          var d2 = d1 * 2 + 3 + n[7] * 7 + n[6] * 8 + n[5] * 9 + n[4] * 2 + n[3] * 3 + n[2] * 4 + n[1] * 5 + n[0] * 6;
          d2 = 11 - d2 % 11;
          if (d2 >= 10) {
            d2 = 0;
          }
          return "" + n[0] + n[1] + "." + n[2] + n[3] + n[4] + "." + n[5] + n[6] + n[7] + "/0001-" + d1 + d2;
        };
        Chance2.prototype.emotion = function() {
          return this.pick(this.get("emotions"));
        };
        Chance2.prototype.mersenne_twister = function(seed) {
          return new MersenneTwister(seed);
        };
        Chance2.prototype.blueimp_md5 = function() {
          return new BlueImpMD5();
        };
        var MersenneTwister = function(seed) {
          if (seed === void 0) {
            seed = Math.floor(Math.random() * Math.pow(10, 13));
          }
          this.N = 624;
          this.M = 397;
          this.MATRIX_A = 2567483615;
          this.UPPER_MASK = 2147483648;
          this.LOWER_MASK = 2147483647;
          this.mt = new Array(this.N);
          this.mti = this.N + 1;
          this.init_genrand(seed);
        };
        MersenneTwister.prototype.init_genrand = function(s) {
          this.mt[0] = s >>> 0;
          for (this.mti = 1; this.mti < this.N; this.mti++) {
            s = this.mt[this.mti - 1] ^ this.mt[this.mti - 1] >>> 30;
            this.mt[this.mti] = (((s & 4294901760) >>> 16) * 1812433253 << 16) + (s & 65535) * 1812433253 + this.mti;
            this.mt[this.mti] >>>= 0;
          }
        };
        MersenneTwister.prototype.init_by_array = function(init_key, key_length) {
          var i = 1, j = 0, k, s;
          this.init_genrand(19650218);
          k = this.N > key_length ? this.N : key_length;
          for (; k; k--) {
            s = this.mt[i - 1] ^ this.mt[i - 1] >>> 30;
            this.mt[i] = (this.mt[i] ^ (((s & 4294901760) >>> 16) * 1664525 << 16) + (s & 65535) * 1664525) + init_key[j] + j;
            this.mt[i] >>>= 0;
            i++;
            j++;
            if (i >= this.N) {
              this.mt[0] = this.mt[this.N - 1];
              i = 1;
            }
            if (j >= key_length) {
              j = 0;
            }
          }
          for (k = this.N - 1; k; k--) {
            s = this.mt[i - 1] ^ this.mt[i - 1] >>> 30;
            this.mt[i] = (this.mt[i] ^ (((s & 4294901760) >>> 16) * 1566083941 << 16) + (s & 65535) * 1566083941) - i;
            this.mt[i] >>>= 0;
            i++;
            if (i >= this.N) {
              this.mt[0] = this.mt[this.N - 1];
              i = 1;
            }
          }
          this.mt[0] = 2147483648;
        };
        MersenneTwister.prototype.genrand_int32 = function() {
          var y;
          var mag01 = new Array(0, this.MATRIX_A);
          if (this.mti >= this.N) {
            var kk;
            if (this.mti === this.N + 1) {
              this.init_genrand(5489);
            }
            for (kk = 0; kk < this.N - this.M; kk++) {
              y = this.mt[kk] & this.UPPER_MASK | this.mt[kk + 1] & this.LOWER_MASK;
              this.mt[kk] = this.mt[kk + this.M] ^ y >>> 1 ^ mag01[y & 1];
            }
            for (; kk < this.N - 1; kk++) {
              y = this.mt[kk] & this.UPPER_MASK | this.mt[kk + 1] & this.LOWER_MASK;
              this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ y >>> 1 ^ mag01[y & 1];
            }
            y = this.mt[this.N - 1] & this.UPPER_MASK | this.mt[0] & this.LOWER_MASK;
            this.mt[this.N - 1] = this.mt[this.M - 1] ^ y >>> 1 ^ mag01[y & 1];
            this.mti = 0;
          }
          y = this.mt[this.mti++];
          y ^= y >>> 11;
          y ^= y << 7 & 2636928640;
          y ^= y << 15 & 4022730752;
          y ^= y >>> 18;
          return y >>> 0;
        };
        MersenneTwister.prototype.genrand_int31 = function() {
          return this.genrand_int32() >>> 1;
        };
        MersenneTwister.prototype.genrand_real1 = function() {
          return this.genrand_int32() * (1 / 4294967295);
        };
        MersenneTwister.prototype.random = function() {
          return this.genrand_int32() * (1 / 4294967296);
        };
        MersenneTwister.prototype.genrand_real3 = function() {
          return (this.genrand_int32() + 0.5) * (1 / 4294967296);
        };
        MersenneTwister.prototype.genrand_res53 = function() {
          var a = this.genrand_int32() >>> 5, b = this.genrand_int32() >>> 6;
          return (a * 67108864 + b) * (1 / 9007199254740992);
        };
        var BlueImpMD5 = function() {
        };
        BlueImpMD5.prototype.VERSION = "1.0.1";
        BlueImpMD5.prototype.safe_add = function safe_add(x, y) {
          var lsw = (x & 65535) + (y & 65535), msw = (x >> 16) + (y >> 16) + (lsw >> 16);
          return msw << 16 | lsw & 65535;
        };
        BlueImpMD5.prototype.bit_roll = function(num, cnt) {
          return num << cnt | num >>> 32 - cnt;
        };
        BlueImpMD5.prototype.md5_cmn = function(q, a, b, x, s, t) {
          return this.safe_add(this.bit_roll(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
        };
        BlueImpMD5.prototype.md5_ff = function(a, b, c, d, x, s, t) {
          return this.md5_cmn(b & c | ~b & d, a, b, x, s, t);
        };
        BlueImpMD5.prototype.md5_gg = function(a, b, c, d, x, s, t) {
          return this.md5_cmn(b & d | c & ~d, a, b, x, s, t);
        };
        BlueImpMD5.prototype.md5_hh = function(a, b, c, d, x, s, t) {
          return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
        };
        BlueImpMD5.prototype.md5_ii = function(a, b, c, d, x, s, t) {
          return this.md5_cmn(c ^ (b | ~d), a, b, x, s, t);
        };
        BlueImpMD5.prototype.binl_md5 = function(x, len) {
          x[len >> 5] |= 128 << len % 32;
          x[(len + 64 >>> 9 << 4) + 14] = len;
          var i, olda, oldb, oldc, oldd, a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
          for (i = 0; i < x.length; i += 16) {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;
            a = this.md5_ff(a, b, c, d, x[i], 7, -680876936);
            d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
            a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = this.md5_gg(b, c, d, a, x[i], 20, -373897302);
            a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
            a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = this.md5_hh(d, a, b, c, x[i], 11, -358537222);
            c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
            a = this.md5_ii(a, b, c, d, x[i], 6, -198630844);
            d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
            a = this.safe_add(a, olda);
            b = this.safe_add(b, oldb);
            c = this.safe_add(c, oldc);
            d = this.safe_add(d, oldd);
          }
          return [a, b, c, d];
        };
        BlueImpMD5.prototype.binl2rstr = function(input) {
          var i, output = "";
          for (i = 0; i < input.length * 32; i += 8) {
            output += String.fromCharCode(input[i >> 5] >>> i % 32 & 255);
          }
          return output;
        };
        BlueImpMD5.prototype.rstr2binl = function(input) {
          var i, output = [];
          output[(input.length >> 2) - 1] = void 0;
          for (i = 0; i < output.length; i += 1) {
            output[i] = 0;
          }
          for (i = 0; i < input.length * 8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 255) << i % 32;
          }
          return output;
        };
        BlueImpMD5.prototype.rstr_md5 = function(s) {
          return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
        };
        BlueImpMD5.prototype.rstr_hmac_md5 = function(key, data2) {
          var i, bkey = this.rstr2binl(key), ipad = [], opad = [], hash;
          ipad[15] = opad[15] = void 0;
          if (bkey.length > 16) {
            bkey = this.binl_md5(bkey, key.length * 8);
          }
          for (i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 909522486;
            opad[i] = bkey[i] ^ 1549556828;
          }
          hash = this.binl_md5(ipad.concat(this.rstr2binl(data2)), 512 + data2.length * 8);
          return this.binl2rstr(this.binl_md5(opad.concat(hash), 512 + 128));
        };
        BlueImpMD5.prototype.rstr2hex = function(input) {
          var hex_tab = "0123456789abcdef", output = "", x, i;
          for (i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt(x >>> 4 & 15) + hex_tab.charAt(x & 15);
          }
          return output;
        };
        BlueImpMD5.prototype.str2rstr_utf8 = function(input) {
          return unescape(encodeURIComponent(input));
        };
        BlueImpMD5.prototype.raw_md5 = function(s) {
          return this.rstr_md5(this.str2rstr_utf8(s));
        };
        BlueImpMD5.prototype.hex_md5 = function(s) {
          return this.rstr2hex(this.raw_md5(s));
        };
        BlueImpMD5.prototype.raw_hmac_md5 = function(k, d) {
          return this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d));
        };
        BlueImpMD5.prototype.hex_hmac_md5 = function(k, d) {
          return this.rstr2hex(this.raw_hmac_md5(k, d));
        };
        BlueImpMD5.prototype.md5 = function(string, key, raw) {
          if (!key) {
            if (!raw) {
              return this.hex_md5(string);
            }
            return this.raw_md5(string);
          }
          if (!raw) {
            return this.hex_hmac_md5(key, string);
          }
          return this.raw_hmac_md5(key, string);
        };
        if (typeof exports !== "undefined") {
          if (typeof module !== "undefined" && module.exports) {
            exports = module.exports = Chance2;
          }
          exports.Chance = Chance2;
        }
        if (typeof define === "function" && define.amd) {
          define([], function() {
            return Chance2;
          });
        }
        if (typeof importScripts !== "undefined") {
          chance = new Chance2();
          self.Chance = Chance2;
        }
        if (typeof window === "object" && typeof window.document === "object") {
          window.Chance = Chance2;
          window.chance = new Chance2();
        }
      })();
    }
  });

  // static/astar.js
  var require_astar = __commonJS({
    "static/astar.js"(exports, module) {
      (function(definition) {
        if (typeof module === "object" && typeof module.exports === "object") {
          module.exports = definition();
        } else if (typeof define === "function" && define.amd) {
          define([], definition);
        } else {
          var exports2 = definition();
          window.astar = exports2.astar;
          window.Graph = exports2.Graph;
        }
      })(function() {
        function pathTo(node) {
          var curr = node;
          var path = [];
          while (curr.parent) {
            path.unshift(curr);
            curr = curr.parent;
          }
          return path;
        }
        function getHeap() {
          return new BinaryHeap(function(node) {
            return node.f;
          });
        }
        var astar2 = {
          /**
          * Perform an A* Search on a graph given a start and end node.
          * @param {Graph} graph
          * @param {GridNode} start
          * @param {GridNode} end
          * @param {Object} [options]
          * @param {bool} [options.closest] Specifies whether to return the
                     path to the closest node if the target is unreachable.
          * @param {Function} [options.heuristic] Heuristic function (see
          *          astar.heuristics).
          */
          search: function(graph, start, end, options) {
            graph.cleanDirty();
            options = options || {};
            var heuristic = options.heuristic || astar2.heuristics.manhattan;
            var closest = options.closest || false;
            var openHeap = getHeap();
            var closestNode = start;
            start.h = heuristic(start, end);
            graph.markDirty(start);
            openHeap.push(start);
            while (openHeap.size() > 0) {
              var currentNode = openHeap.pop();
              if (currentNode === end) {
                return pathTo(currentNode);
              }
              currentNode.closed = true;
              var neighbors = graph.neighbors(currentNode);
              for (var i = 0, il = neighbors.length; i < il; ++i) {
                var neighbor = neighbors[i];
                if (neighbor.closed || neighbor.isWall()) {
                  continue;
                }
                var gScore = currentNode.g + neighbor.getCost(currentNode);
                var beenVisited = neighbor.visited;
                if (!beenVisited || gScore < neighbor.g) {
                  neighbor.visited = true;
                  neighbor.parent = currentNode;
                  neighbor.h = neighbor.h || heuristic(neighbor, end);
                  neighbor.g = gScore;
                  neighbor.f = neighbor.g + neighbor.h;
                  graph.markDirty(neighbor);
                  if (closest) {
                    if (neighbor.h < closestNode.h || neighbor.h === closestNode.h && neighbor.g < closestNode.g) {
                      closestNode = neighbor;
                    }
                  }
                  if (!beenVisited) {
                    openHeap.push(neighbor);
                  } else {
                    openHeap.rescoreElement(neighbor);
                  }
                }
              }
            }
            if (closest) {
              return pathTo(closestNode);
            }
            return [];
          },
          // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
          heuristics: {
            manhattan: function(pos0, pos1) {
              var d1 = Math.abs(pos1.x - pos0.x);
              var d2 = Math.abs(pos1.y - pos0.y);
              return d1 + d2;
            },
            diagonal: function(pos0, pos1) {
              var D = 1;
              var D2 = Math.sqrt(2);
              var d1 = Math.abs(pos1.x - pos0.x);
              var d2 = Math.abs(pos1.y - pos0.y);
              return D * (d1 + d2) + (D2 - 2 * D) * Math.min(d1, d2);
            }
          },
          cleanNode: function(node) {
            node.f = 0;
            node.g = 0;
            node.h = 0;
            node.visited = false;
            node.closed = false;
            node.parent = null;
          }
        };
        function Graph2(gridIn, options) {
          options = options || {};
          this.nodes = [];
          this.diagonal = !!options.diagonal;
          this.grid = [];
          for (var x = 0; x < gridIn.length; x++) {
            this.grid[x] = [];
            for (var y = 0, row = gridIn[x]; y < row.length; y++) {
              var node = new GridNode(x, y, row[y]);
              this.grid[x][y] = node;
              this.nodes.push(node);
            }
          }
          this.init();
        }
        Graph2.prototype.init = function() {
          this.dirtyNodes = [];
          for (var i = 0; i < this.nodes.length; i++) {
            astar2.cleanNode(this.nodes[i]);
          }
        };
        Graph2.prototype.cleanDirty = function() {
          for (var i = 0; i < this.dirtyNodes.length; i++) {
            astar2.cleanNode(this.dirtyNodes[i]);
          }
          this.dirtyNodes = [];
        };
        Graph2.prototype.markDirty = function(node) {
          this.dirtyNodes.push(node);
        };
        Graph2.prototype.neighbors = function(node) {
          var ret = [];
          var x = node.x;
          var y = node.y;
          var grid = this.grid;
          if (grid[x - 1] && grid[x - 1][y]) {
            ret.push(grid[x - 1][y]);
          }
          if (grid[x + 1] && grid[x + 1][y]) {
            ret.push(grid[x + 1][y]);
          }
          if (grid[x] && grid[x][y - 1]) {
            ret.push(grid[x][y - 1]);
          }
          if (grid[x] && grid[x][y + 1]) {
            ret.push(grid[x][y + 1]);
          }
          if (this.diagonal) {
            if (grid[x - 1] && grid[x - 1][y - 1]) {
              ret.push(grid[x - 1][y - 1]);
            }
            if (grid[x + 1] && grid[x + 1][y - 1]) {
              ret.push(grid[x + 1][y - 1]);
            }
            if (grid[x - 1] && grid[x - 1][y + 1]) {
              ret.push(grid[x - 1][y + 1]);
            }
            if (grid[x + 1] && grid[x + 1][y + 1]) {
              ret.push(grid[x + 1][y + 1]);
            }
          }
          return ret;
        };
        Graph2.prototype.toString = function() {
          var graphString = [];
          var nodes = this.grid;
          for (var x = 0; x < nodes.length; x++) {
            var rowDebug = [];
            var row = nodes[x];
            for (var y = 0; y < row.length; y++) {
              rowDebug.push(row[y].weight);
            }
            graphString.push(rowDebug.join(" "));
          }
          return graphString.join("\n");
        };
        function GridNode(x, y, weight) {
          this.x = x;
          this.y = y;
          this.weight = weight;
        }
        GridNode.prototype.toString = function() {
          return "[" + this.x + " " + this.y + "]";
        };
        GridNode.prototype.getCost = function(fromNeighbor) {
          if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
            return this.weight * 1.41421;
          }
          return this.weight;
        };
        GridNode.prototype.isWall = function() {
          return this.weight === 0;
        };
        function BinaryHeap(scoreFunction) {
          this.content = [];
          this.scoreFunction = scoreFunction;
        }
        BinaryHeap.prototype = {
          push: function(element) {
            this.content.push(element);
            this.sinkDown(this.content.length - 1);
          },
          pop: function() {
            var result = this.content[0];
            var end = this.content.pop();
            if (this.content.length > 0) {
              this.content[0] = end;
              this.bubbleUp(0);
            }
            return result;
          },
          remove: function(node) {
            var i = this.content.indexOf(node);
            var end = this.content.pop();
            if (i !== this.content.length - 1) {
              this.content[i] = end;
              if (this.scoreFunction(end) < this.scoreFunction(node)) {
                this.sinkDown(i);
              } else {
                this.bubbleUp(i);
              }
            }
          },
          size: function() {
            return this.content.length;
          },
          rescoreElement: function(node) {
            this.sinkDown(this.content.indexOf(node));
          },
          sinkDown: function(n) {
            var element = this.content[n];
            while (n > 0) {
              var parentN = (n + 1 >> 1) - 1;
              var parent = this.content[parentN];
              if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                this.content[parentN] = element;
                this.content[n] = parent;
                n = parentN;
              } else {
                break;
              }
            }
          },
          bubbleUp: function(n) {
            var length = this.content.length;
            var element = this.content[n];
            var elemScore = this.scoreFunction(element);
            while (true) {
              var child2N = n + 1 << 1;
              var child1N = child2N - 1;
              var swap = null;
              var child1Score;
              if (child1N < length) {
                var child1 = this.content[child1N];
                child1Score = this.scoreFunction(child1);
                if (child1Score < elemScore) {
                  swap = child1N;
                }
              }
              if (child2N < length) {
                var child2 = this.content[child2N];
                var child2Score = this.scoreFunction(child2);
                if (child2Score < (swap === null ? elemScore : child1Score)) {
                  swap = child2N;
                }
              }
              if (swap !== null) {
                this.content[n] = this.content[swap];
                this.content[swap] = element;
                n = swap;
              } else {
                break;
              }
            }
          }
        };
        return {
          astar: astar2,
          Graph: Graph2
        };
      });
    }
  });

  // node_modules/.pnpm/hyperscript.org@0.9.11/node_modules/hyperscript.org/dist/_hyperscript.min.js
  var require_hyperscript_min = __commonJS({
    "node_modules/.pnpm/hyperscript.org@0.9.11/node_modules/hyperscript.org/dist/_hyperscript.min.js"(exports, module) {
      (function(e, t) {
        const r = t(e);
        if (typeof exports === "object" && typeof exports["nodeName"] !== "string") {
          module.exports = r;
        } else {
          e["_hyperscript"] = r;
          if ("document" in e)
            e["_hyperscript"].browserInit();
        }
      })(typeof self !== "undefined" ? self : exports, (e) => {
        "use strict";
        const t = { dynamicResolvers: [function(e2, t2) {
          if (e2 === "Fixed") {
            return Number(t2).toFixed();
          } else if (e2.indexOf("Fixed:") === 0) {
            let r2 = e2.split(":")[1];
            return Number(t2).toFixed(parseInt(r2));
          }
        }], String: function(e2) {
          if (e2.toString) {
            return e2.toString();
          } else {
            return "" + e2;
          }
        }, Int: function(e2) {
          return parseInt(e2);
        }, Float: function(e2) {
          return parseFloat(e2);
        }, Number: function(e2) {
          return Number(e2);
        }, Date: function(e2) {
          return new Date(e2);
        }, Array: function(e2) {
          return Array.from(e2);
        }, JSON: function(e2) {
          return JSON.stringify(e2);
        }, Object: function(e2) {
          if (e2 instanceof String) {
            e2 = e2.toString();
          }
          if (typeof e2 === "string") {
            return JSON.parse(e2);
          } else {
            return Object.assign({}, e2);
          }
        } };
        const r = { attributes: "_, script, data-script", defaultTransition: "all 500ms ease-in", disableSelector: "[disable-scripting], [data-disable-scripting]", hideShowStrategies: {}, conversions: t };
        class n {
          static OP_TABLE = { "+": "PLUS", "-": "MINUS", "*": "MULTIPLY", "/": "DIVIDE", ".": "PERIOD", "..": "ELLIPSIS", "\\": "BACKSLASH", ":": "COLON", "%": "PERCENT", "|": "PIPE", "!": "EXCLAMATION", "?": "QUESTION", "#": "POUND", "&": "AMPERSAND", $: "DOLLAR", ";": "SEMI", ",": "COMMA", "(": "L_PAREN", ")": "R_PAREN", "<": "L_ANG", ">": "R_ANG", "<=": "LTE_ANG", ">=": "GTE_ANG", "==": "EQ", "===": "EQQ", "!=": "NEQ", "!==": "NEQQ", "{": "L_BRACE", "}": "R_BRACE", "[": "L_BRACKET", "]": "R_BRACKET", "=": "EQUALS" };
          static isValidCSSClassChar(e2) {
            return n.isAlpha(e2) || n.isNumeric(e2) || e2 === "-" || e2 === "_" || e2 === ":";
          }
          static isValidCSSIDChar(e2) {
            return n.isAlpha(e2) || n.isNumeric(e2) || e2 === "-" || e2 === "_" || e2 === ":";
          }
          static isWhitespace(e2) {
            return e2 === " " || e2 === "	" || n.isNewline(e2);
          }
          static positionString(e2) {
            return "[Line: " + e2.line + ", Column: " + e2.column + "]";
          }
          static isNewline(e2) {
            return e2 === "\r" || e2 === "\n";
          }
          static isNumeric(e2) {
            return e2 >= "0" && e2 <= "9";
          }
          static isAlpha(e2) {
            return e2 >= "a" && e2 <= "z" || e2 >= "A" && e2 <= "Z";
          }
          static isIdentifierChar(e2, t2) {
            return e2 === "_" || e2 === "$";
          }
          static isReservedChar(e2) {
            return e2 === "`" || e2 === "^";
          }
          static isValidSingleQuoteStringStart(e2) {
            if (e2.length > 0) {
              var t2 = e2[e2.length - 1];
              if (t2.type === "IDENTIFIER" || t2.type === "CLASS_REF" || t2.type === "ID_REF") {
                return false;
              }
              if (t2.op && (t2.value === ">" || t2.value === ")")) {
                return false;
              }
            }
            return true;
          }
          static tokenize(e2, t2) {
            var r2 = [];
            var a2 = e2;
            var o2 = 0;
            var s2 = 0;
            var u2 = 1;
            var l2 = "<START>";
            var c2 = 0;
            function f2() {
              return t2 && c2 === 0;
            }
            while (o2 < a2.length) {
              if (S2() === "-" && q() === "-" && (n.isWhitespace(N(2)) || N(2) === "" || N(2) === "-") || S2() === "/" && q() === "/" && (n.isWhitespace(N(2)) || N(2) === "" || N(2) === "/")) {
                h2();
              } else if (S2() === "/" && q() === "*" && (n.isWhitespace(N(2)) || N(2) === "" || N(2) === "*")) {
                v2();
              } else {
                if (n.isWhitespace(S2())) {
                  r2.push(R());
                } else if (!I() && S2() === "." && (n.isAlpha(q()) || q() === "{" || q() === "-")) {
                  r2.push(d2());
                } else if (!I() && S2() === "#" && (n.isAlpha(q()) || q() === "{")) {
                  r2.push(k2());
                } else if (S2() === "[" && q() === "@") {
                  r2.push(E2());
                } else if (S2() === "@") {
                  r2.push(T2());
                } else if (S2() === "*" && n.isAlpha(q())) {
                  r2.push(y2());
                } else if (n.isAlpha(S2()) || !f2() && n.isIdentifierChar(S2())) {
                  r2.push(x2());
                } else if (n.isNumeric(S2())) {
                  r2.push(g2());
                } else if (!f2() && (S2() === '"' || S2() === "`")) {
                  r2.push(w2());
                } else if (!f2() && S2() === "'") {
                  if (n.isValidSingleQuoteStringStart(r2)) {
                    r2.push(w2());
                  } else {
                    r2.push(b2());
                  }
                } else if (n.OP_TABLE[S2()]) {
                  if (l2 === "$" && S2() === "{") {
                    c2++;
                  }
                  if (S2() === "}") {
                    c2--;
                  }
                  r2.push(b2());
                } else if (f2() || n.isReservedChar(S2())) {
                  r2.push(p2("RESERVED", C()));
                } else {
                  if (o2 < a2.length) {
                    throw Error("Unknown token: " + S2() + " ");
                  }
                }
              }
            }
            return new i(r2, [], a2);
            function m2(e3, t3) {
              var r3 = p2(e3, t3);
              r3.op = true;
              return r3;
            }
            function p2(e3, t3) {
              return { type: e3, value: t3 || "", start: o2, end: o2 + 1, column: s2, line: u2 };
            }
            function h2() {
              while (S2() && !n.isNewline(S2())) {
                C();
              }
              C();
            }
            function v2() {
              while (S2() && !(S2() === "*" && q() === "/")) {
                C();
              }
              C();
              C();
            }
            function d2() {
              var e3 = p2("CLASS_REF");
              var t3 = C();
              if (S2() === "{") {
                e3.template = true;
                t3 += C();
                while (S2() && S2() !== "}") {
                  t3 += C();
                }
                if (S2() !== "}") {
                  throw Error("Unterminated class reference");
                } else {
                  t3 += C();
                }
              } else {
                while (n.isValidCSSClassChar(S2())) {
                  t3 += C();
                }
              }
              e3.value = t3;
              e3.end = o2;
              return e3;
            }
            function E2() {
              var e3 = p2("ATTRIBUTE_REF");
              var t3 = C();
              while (o2 < a2.length && S2() !== "]") {
                t3 += C();
              }
              if (S2() === "]") {
                t3 += C();
              }
              e3.value = t3;
              e3.end = o2;
              return e3;
            }
            function T2() {
              var e3 = p2("ATTRIBUTE_REF");
              var t3 = C();
              while (n.isValidCSSIDChar(S2())) {
                t3 += C();
              }
              if (S2() === "=") {
                t3 += C();
                if (S2() === '"' || S2() === "'") {
                  let e4 = w2();
                  t3 += e4.value;
                } else if (n.isAlpha(S2()) || n.isNumeric(S2()) || n.isIdentifierChar(S2())) {
                  let e4 = x2();
                  t3 += e4.value;
                }
              }
              e3.value = t3;
              e3.end = o2;
              return e3;
            }
            function y2() {
              var e3 = p2("STYLE_REF");
              var t3 = C();
              while (n.isAlpha(S2()) || S2() === "-") {
                t3 += C();
              }
              e3.value = t3;
              e3.end = o2;
              return e3;
            }
            function k2() {
              var e3 = p2("ID_REF");
              var t3 = C();
              if (S2() === "{") {
                e3.template = true;
                t3 += C();
                while (S2() && S2() !== "}") {
                  t3 += C();
                }
                if (S2() !== "}") {
                  throw Error("Unterminated id reference");
                } else {
                  C();
                }
              } else {
                while (n.isValidCSSIDChar(S2())) {
                  t3 += C();
                }
              }
              e3.value = t3;
              e3.end = o2;
              return e3;
            }
            function x2() {
              var e3 = p2("IDENTIFIER");
              var t3 = C();
              while (n.isAlpha(S2()) || n.isNumeric(S2()) || n.isIdentifierChar(S2())) {
                t3 += C();
              }
              if (S2() === "!" && t3 === "beep") {
                t3 += C();
              }
              e3.value = t3;
              e3.end = o2;
              return e3;
            }
            function g2() {
              var e3 = p2("NUMBER");
              var t3 = C();
              while (n.isNumeric(S2())) {
                t3 += C();
              }
              if (S2() === "." && n.isNumeric(q())) {
                t3 += C();
              }
              while (n.isNumeric(S2())) {
                t3 += C();
              }
              if (S2() === "e" || S2() === "E") {
                if (n.isNumeric(q())) {
                  t3 += C();
                } else if (q() === "-") {
                  t3 += C();
                  t3 += C();
                }
              }
              while (n.isNumeric(S2())) {
                t3 += C();
              }
              e3.value = t3;
              e3.end = o2;
              return e3;
            }
            function b2() {
              var e3 = m2();
              var t3 = C();
              while (S2() && n.OP_TABLE[t3 + S2()]) {
                t3 += C();
              }
              e3.type = n.OP_TABLE[t3];
              e3.value = t3;
              e3.end = o2;
              return e3;
            }
            function w2() {
              var e3 = p2("STRING");
              var t3 = C();
              var r3 = "";
              while (S2() && S2() !== t3) {
                if (S2() === "\\") {
                  C();
                  let e4 = C();
                  if (e4 === "b") {
                    r3 += "\b";
                  } else if (e4 === "f") {
                    r3 += "\f";
                  } else if (e4 === "n") {
                    r3 += "\n";
                  } else if (e4 === "r") {
                    r3 += "\r";
                  } else if (e4 === "t") {
                    r3 += "	";
                  } else if (e4 === "v") {
                    r3 += "\v";
                  } else {
                    r3 += e4;
                  }
                } else {
                  r3 += C();
                }
              }
              if (S2() !== t3) {
                throw Error("Unterminated string at " + n.positionString(e3));
              } else {
                C();
              }
              e3.value = r3;
              e3.end = o2;
              e3.template = t3 === "`";
              return e3;
            }
            function S2() {
              return a2.charAt(o2);
            }
            function q() {
              return a2.charAt(o2 + 1);
            }
            function N(e3 = 1) {
              return a2.charAt(o2 + e3);
            }
            function C() {
              l2 = S2();
              o2++;
              s2++;
              return l2;
            }
            function I() {
              return n.isAlpha(l2) || n.isNumeric(l2) || l2 === ")" || l2 === '"' || l2 === "'" || l2 === "`" || l2 === "}" || l2 === "]";
            }
            function R() {
              var e3 = p2("WHITESPACE");
              var t3 = "";
              while (S2() && n.isWhitespace(S2())) {
                if (n.isNewline(S2())) {
                  s2 = 0;
                  u2++;
                }
                t3 += C();
              }
              e3.value = t3;
              e3.end = o2;
              return e3;
            }
          }
          tokenize(e2, t2) {
            return n.tokenize(e2, t2);
          }
        }
        class i {
          constructor(e2, t2, r2) {
            this.tokens = e2;
            this.consumed = t2;
            this.source = r2;
            this.consumeWhitespace();
          }
          get list() {
            return this.tokens;
          }
          _lastConsumed = null;
          consumeWhitespace() {
            while (this.token(0, true).type === "WHITESPACE") {
              this.consumed.push(this.tokens.shift());
            }
          }
          raiseError(e2, t2) {
            a.raiseParseError(e2, t2);
          }
          requireOpToken(e2) {
            var t2 = this.matchOpToken(e2);
            if (t2) {
              return t2;
            } else {
              this.raiseError(this, "Expected '" + e2 + "' but found '" + this.currentToken().value + "'");
            }
          }
          matchAnyOpToken(e2, t2, r2) {
            for (var n2 = 0; n2 < arguments.length; n2++) {
              var i2 = arguments[n2];
              var a2 = this.matchOpToken(i2);
              if (a2) {
                return a2;
              }
            }
          }
          matchAnyToken(e2, t2, r2) {
            for (var n2 = 0; n2 < arguments.length; n2++) {
              var i2 = arguments[n2];
              var a2 = this.matchToken(i2);
              if (a2) {
                return a2;
              }
            }
          }
          matchOpToken(e2) {
            if (this.currentToken() && this.currentToken().op && this.currentToken().value === e2) {
              return this.consumeToken();
            }
          }
          requireTokenType(e2, t2, r2, n2) {
            var i2 = this.matchTokenType(e2, t2, r2, n2);
            if (i2) {
              return i2;
            } else {
              this.raiseError(this, "Expected one of " + JSON.stringify([e2, t2, r2]));
            }
          }
          matchTokenType(e2, t2, r2, n2) {
            if (this.currentToken() && this.currentToken().type && [e2, t2, r2, n2].indexOf(this.currentToken().type) >= 0) {
              return this.consumeToken();
            }
          }
          requireToken(e2, t2) {
            var r2 = this.matchToken(e2, t2);
            if (r2) {
              return r2;
            } else {
              this.raiseError(this, "Expected '" + e2 + "' but found '" + this.currentToken().value + "'");
            }
          }
          peekToken(e2, t2, r2) {
            t2 = t2 || 0;
            r2 = r2 || "IDENTIFIER";
            if (this.tokens[t2] && this.tokens[t2].value === e2 && this.tokens[t2].type === r2) {
              return this.tokens[t2];
            }
          }
          matchToken(e2, t2) {
            if (this.follows.indexOf(e2) !== -1) {
              return;
            }
            t2 = t2 || "IDENTIFIER";
            if (this.currentToken() && this.currentToken().value === e2 && this.currentToken().type === t2) {
              return this.consumeToken();
            }
          }
          consumeToken() {
            var e2 = this.tokens.shift();
            this.consumed.push(e2);
            this._lastConsumed = e2;
            this.consumeWhitespace();
            return e2;
          }
          consumeUntil(e2, t2) {
            var r2 = [];
            var n2 = this.token(0, true);
            while ((t2 == null || n2.type !== t2) && (e2 == null || n2.value !== e2) && n2.type !== "EOF") {
              var i2 = this.tokens.shift();
              this.consumed.push(i2);
              r2.push(n2);
              n2 = this.token(0, true);
            }
            this.consumeWhitespace();
            return r2;
          }
          lastWhitespace() {
            if (this.consumed[this.consumed.length - 1] && this.consumed[this.consumed.length - 1].type === "WHITESPACE") {
              return this.consumed[this.consumed.length - 1].value;
            } else {
              return "";
            }
          }
          consumeUntilWhitespace() {
            return this.consumeUntil(null, "WHITESPACE");
          }
          hasMore() {
            return this.tokens.length > 0;
          }
          token(e2, t2) {
            var r2;
            var n2 = 0;
            do {
              if (!t2) {
                while (this.tokens[n2] && this.tokens[n2].type === "WHITESPACE") {
                  n2++;
                }
              }
              r2 = this.tokens[n2];
              e2--;
              n2++;
            } while (e2 > -1);
            if (r2) {
              return r2;
            } else {
              return { type: "EOF", value: "<<<EOF>>>" };
            }
          }
          currentToken() {
            return this.token(0);
          }
          lastMatch() {
            return this._lastConsumed;
          }
          static sourceFor = function() {
            return this.programSource.substring(this.startToken.start, this.endToken.end);
          };
          static lineFor = function() {
            return this.programSource.split("\n")[this.startToken.line - 1];
          };
          follows = [];
          pushFollow(e2) {
            this.follows.push(e2);
          }
          popFollow() {
            this.follows.pop();
          }
          clearFollows() {
            var e2 = this.follows;
            this.follows = [];
            return e2;
          }
          restoreFollows(e2) {
            this.follows = e2;
          }
        }
        class a {
          constructor(e2) {
            this.runtime = e2;
            this.possessivesDisabled = false;
            this.addGrammarElement("feature", function(e3, t2, r2) {
              if (r2.matchOpToken("(")) {
                var n2 = e3.requireElement("feature", r2);
                r2.requireOpToken(")");
                return n2;
              }
              var i2 = e3.FEATURES[r2.currentToken().value || ""];
              if (i2) {
                return i2(e3, t2, r2);
              }
            });
            this.addGrammarElement("command", function(e3, t2, r2) {
              if (r2.matchOpToken("(")) {
                const t3 = e3.requireElement("command", r2);
                r2.requireOpToken(")");
                return t3;
              }
              var n2 = e3.COMMANDS[r2.currentToken().value || ""];
              let i2;
              if (n2) {
                i2 = n2(e3, t2, r2);
              } else if (r2.currentToken().type === "IDENTIFIER") {
                i2 = e3.parseElement("pseudoCommand", r2);
              }
              if (i2) {
                return e3.parseElement("indirectStatement", r2, i2);
              }
              return i2;
            });
            this.addGrammarElement("commandList", function(e3, t2, r2) {
              if (r2.hasMore()) {
                var n2 = e3.parseElement("command", r2);
                if (n2) {
                  r2.matchToken("then");
                  const t3 = e3.parseElement("commandList", r2);
                  if (t3)
                    n2.next = t3;
                  return n2;
                }
              }
              return { type: "emptyCommandListCommand", op: function(e4) {
                return t2.findNext(this, e4);
              }, execute: function(e4) {
                return t2.unifiedExec(this, e4);
              } };
            });
            this.addGrammarElement("leaf", function(e3, t2, r2) {
              var n2 = e3.parseAnyOf(e3.LEAF_EXPRESSIONS, r2);
              if (n2 == null) {
                return e3.parseElement("symbol", r2);
              }
              return n2;
            });
            this.addGrammarElement("indirectExpression", function(e3, t2, r2, n2) {
              for (var i2 = 0; i2 < e3.INDIRECT_EXPRESSIONS.length; i2++) {
                var a2 = e3.INDIRECT_EXPRESSIONS[i2];
                n2.endToken = r2.lastMatch();
                var o2 = e3.parseElement(a2, r2, n2);
                if (o2) {
                  return o2;
                }
              }
              return n2;
            });
            this.addGrammarElement("indirectStatement", function(e3, t2, r2, n2) {
              if (r2.matchToken("unless")) {
                n2.endToken = r2.lastMatch();
                var i2 = e3.requireElement("expression", r2);
                var a2 = { type: "unlessStatementModifier", args: [i2], op: function(e4, t3) {
                  if (t3) {
                    return this.next;
                  } else {
                    return n2;
                  }
                }, execute: function(e4) {
                  return t2.unifiedExec(this, e4);
                } };
                n2.parent = a2;
                return a2;
              }
              return n2;
            });
            this.addGrammarElement("primaryExpression", function(e3, t2, r2) {
              var n2 = e3.parseElement("leaf", r2);
              if (n2) {
                return e3.parseElement("indirectExpression", r2, n2);
              }
              e3.raiseParseError(r2, "Unexpected value: " + r2.currentToken().value);
            });
          }
          use(e2) {
            e2(this);
            return this;
          }
          GRAMMAR = {};
          COMMANDS = {};
          FEATURES = {};
          LEAF_EXPRESSIONS = [];
          INDIRECT_EXPRESSIONS = [];
          initElt(e2, t2, r2) {
            e2.startToken = t2;
            e2.sourceFor = i.sourceFor;
            e2.lineFor = i.lineFor;
            e2.programSource = r2.source;
          }
          parseElement(e2, t2, r2 = void 0) {
            var n2 = this.GRAMMAR[e2];
            if (n2) {
              var i2 = t2.currentToken();
              var a2 = n2(this, this.runtime, t2, r2);
              if (a2) {
                this.initElt(a2, i2, t2);
                a2.endToken = a2.endToken || t2.lastMatch();
                var r2 = a2.root;
                while (r2 != null) {
                  this.initElt(r2, i2, t2);
                  r2 = r2.root;
                }
              }
              return a2;
            }
          }
          requireElement(e2, t2, r2, n2) {
            var i2 = this.parseElement(e2, t2, n2);
            if (!i2)
              a.raiseParseError(t2, r2 || "Expected " + e2);
            return i2;
          }
          parseAnyOf(e2, t2) {
            for (var r2 = 0; r2 < e2.length; r2++) {
              var n2 = e2[r2];
              var i2 = this.parseElement(n2, t2);
              if (i2) {
                return i2;
              }
            }
          }
          addGrammarElement(e2, t2) {
            this.GRAMMAR[e2] = t2;
          }
          addCommand(e2, t2) {
            var r2 = e2 + "Command";
            var n2 = function(e3, n3, i2) {
              const a2 = t2(e3, n3, i2);
              if (a2) {
                a2.type = r2;
                a2.execute = function(e4) {
                  e4.meta.command = a2;
                  return n3.unifiedExec(this, e4);
                };
                return a2;
              }
            };
            this.GRAMMAR[r2] = n2;
            this.COMMANDS[e2] = n2;
          }
          addFeature(e2, t2) {
            var r2 = e2 + "Feature";
            var n2 = function(n3, i2, a2) {
              var o2 = t2(n3, i2, a2);
              if (o2) {
                o2.isFeature = true;
                o2.keyword = e2;
                o2.type = r2;
                return o2;
              }
            };
            this.GRAMMAR[r2] = n2;
            this.FEATURES[e2] = n2;
          }
          addLeafExpression(e2, t2) {
            this.LEAF_EXPRESSIONS.push(e2);
            this.addGrammarElement(e2, t2);
          }
          addIndirectExpression(e2, t2) {
            this.INDIRECT_EXPRESSIONS.push(e2);
            this.addGrammarElement(e2, t2);
          }
          static createParserContext(e2) {
            var t2 = e2.currentToken();
            var r2 = e2.source;
            var n2 = r2.split("\n");
            var i2 = t2 && t2.line ? t2.line - 1 : n2.length - 1;
            var a2 = n2[i2];
            var o2 = t2 && t2.line ? t2.column : a2.length - 1;
            return a2 + "\n" + " ".repeat(o2) + "^^\n\n";
          }
          static raiseParseError(e2, t2) {
            t2 = (t2 || "Unexpected Token : " + e2.currentToken().value) + "\n\n" + a.createParserContext(e2);
            var r2 = new Error(t2);
            r2["tokens"] = e2;
            throw r2;
          }
          raiseParseError(e2, t2) {
            a.raiseParseError(e2, t2);
          }
          parseHyperScript(e2) {
            var t2 = this.parseElement("hyperscript", e2);
            if (e2.hasMore())
              this.raiseParseError(e2);
            if (t2)
              return t2;
          }
          setParent(e2, t2) {
            if (typeof e2 === "object") {
              e2.parent = t2;
              if (typeof t2 === "object") {
                t2.children = t2.children || /* @__PURE__ */ new Set();
                t2.children.add(e2);
              }
              this.setParent(e2.next, t2);
            }
          }
          commandStart(e2) {
            return this.COMMANDS[e2.value || ""];
          }
          featureStart(e2) {
            return this.FEATURES[e2.value || ""];
          }
          commandBoundary(e2) {
            if (e2.value == "end" || e2.value == "then" || e2.value == "else" || e2.value == "otherwise" || e2.value == ")" || this.commandStart(e2) || this.featureStart(e2) || e2.type == "EOF") {
              return true;
            }
            return false;
          }
          parseStringTemplate(e2) {
            var t2 = [""];
            do {
              t2.push(e2.lastWhitespace());
              if (e2.currentToken().value === "$") {
                e2.consumeToken();
                var r2 = e2.matchOpToken("{");
                t2.push(this.requireElement("expression", e2));
                if (r2) {
                  e2.requireOpToken("}");
                }
                t2.push("");
              } else if (e2.currentToken().value === "\\") {
                e2.consumeToken();
                e2.consumeToken();
              } else {
                var n2 = e2.consumeToken();
                t2[t2.length - 1] += n2 ? n2.value : "";
              }
            } while (e2.hasMore());
            t2.push(e2.lastWhitespace());
            return t2;
          }
          ensureTerminated(e2) {
            const t2 = this.runtime;
            var r2 = { type: "implicitReturn", op: function(e3) {
              e3.meta.returned = true;
              if (e3.meta.resolve) {
                e3.meta.resolve();
              }
              return t2.HALT;
            }, execute: function(e3) {
            } };
            var n2 = e2;
            while (n2.next) {
              n2 = n2.next;
            }
            n2.next = r2;
          }
        }
        class o {
          constructor(e2, t2) {
            this.lexer = e2 ?? new n();
            this.parser = t2 ?? new a(this).use(T).use(y);
            this.parser.runtime = this;
          }
          matchesSelector(e2, t2) {
            var r2 = e2.matches || e2.matchesSelector || e2.msMatchesSelector || e2.mozMatchesSelector || e2.webkitMatchesSelector || e2.oMatchesSelector;
            return r2 && r2.call(e2, t2);
          }
          makeEvent(t2, r2) {
            var n2;
            if (e.Event && typeof e.Event === "function") {
              n2 = new Event(t2, { bubbles: true, cancelable: true });
              n2["detail"] = r2;
            } else {
              n2 = document.createEvent("CustomEvent");
              n2.initCustomEvent(t2, true, true, r2);
            }
            return n2;
          }
          triggerEvent(e2, t2, r2, n2) {
            r2 = r2 || {};
            r2["sender"] = n2;
            var i2 = this.makeEvent(t2, r2);
            var a2 = e2.dispatchEvent(i2);
            return a2;
          }
          isArrayLike(e2) {
            return Array.isArray(e2) || typeof NodeList !== "undefined" && (e2 instanceof NodeList || e2 instanceof HTMLCollection);
          }
          isIterable(e2) {
            return typeof e2 === "object" && Symbol.iterator in e2 && typeof e2[Symbol.iterator] === "function";
          }
          shouldAutoIterate(e2) {
            return e2 != null && e2[p] || this.isArrayLike(e2);
          }
          forEach(e2, t2) {
            if (e2 == null) {
            } else if (this.isIterable(e2)) {
              for (const r3 of e2) {
                t2(r3);
              }
            } else if (this.isArrayLike(e2)) {
              for (var r2 = 0; r2 < e2.length; r2++) {
                t2(e2[r2]);
              }
            } else {
              t2(e2);
            }
          }
          implicitLoop(e2, t2) {
            if (this.shouldAutoIterate(e2)) {
              for (const r2 of e2)
                t2(r2);
            } else {
              t2(e2);
            }
          }
          wrapArrays(e2) {
            var t2 = [];
            for (var r2 = 0; r2 < e2.length; r2++) {
              var n2 = e2[r2];
              if (Array.isArray(n2)) {
                t2.push(Promise.all(n2));
              } else {
                t2.push(n2);
              }
            }
            return t2;
          }
          unwrapAsyncs(e2) {
            for (var t2 = 0; t2 < e2.length; t2++) {
              var r2 = e2[t2];
              if (r2.asyncWrapper) {
                e2[t2] = r2.value;
              }
              if (Array.isArray(r2)) {
                for (var n2 = 0; n2 < r2.length; n2++) {
                  var i2 = r2[n2];
                  if (i2.asyncWrapper) {
                    r2[n2] = i2.value;
                  }
                }
              }
            }
          }
          static HALT = {};
          HALT = o.HALT;
          unifiedExec(e2, t2) {
            while (true) {
              try {
                var r2 = this.unifiedEval(e2, t2);
              } catch (n2) {
                if (t2.meta.handlingFinally) {
                  console.error(" Exception in finally block: ", n2);
                  r2 = o.HALT;
                } else {
                  this.registerHyperTrace(t2, n2);
                  if (t2.meta.errorHandler && !t2.meta.handlingError) {
                    t2.meta.handlingError = true;
                    t2.locals[t2.meta.errorSymbol] = n2;
                    e2 = t2.meta.errorHandler;
                    continue;
                  } else {
                    t2.meta.currentException = n2;
                    r2 = o.HALT;
                  }
                }
              }
              if (r2 == null) {
                console.error(e2, " did not return a next element to execute! context: ", t2);
                return;
              } else if (r2.then) {
                r2.then((e3) => {
                  this.unifiedExec(e3, t2);
                }).catch((e3) => {
                  this.unifiedExec({ op: function() {
                    throw e3;
                  } }, t2);
                });
                return;
              } else if (r2 === o.HALT) {
                if (t2.meta.finallyHandler && !t2.meta.handlingFinally) {
                  t2.meta.handlingFinally = true;
                  e2 = t2.meta.finallyHandler;
                } else {
                  if (t2.meta.onHalt) {
                    t2.meta.onHalt();
                  }
                  if (t2.meta.currentException) {
                    if (t2.meta.reject) {
                      t2.meta.reject(t2.meta.currentException);
                      return;
                    } else {
                      throw t2.meta.currentException;
                    }
                  } else {
                    return;
                  }
                }
              } else {
                e2 = r2;
              }
            }
          }
          unifiedEval(e2, t2) {
            var r2 = [t2];
            var n2 = false;
            var i2 = false;
            if (e2.args) {
              for (var a2 = 0; a2 < e2.args.length; a2++) {
                var o2 = e2.args[a2];
                if (o2 == null) {
                  r2.push(null);
                } else if (Array.isArray(o2)) {
                  var s2 = [];
                  for (var u2 = 0; u2 < o2.length; u2++) {
                    var l2 = o2[u2];
                    var c2 = l2 ? l2.evaluate(t2) : null;
                    if (c2) {
                      if (c2.then) {
                        n2 = true;
                      } else if (c2.asyncWrapper) {
                        i2 = true;
                      }
                    }
                    s2.push(c2);
                  }
                  r2.push(s2);
                } else if (o2.evaluate) {
                  var c2 = o2.evaluate(t2);
                  if (c2) {
                    if (c2.then) {
                      n2 = true;
                    } else if (c2.asyncWrapper) {
                      i2 = true;
                    }
                  }
                  r2.push(c2);
                } else {
                  r2.push(o2);
                }
              }
            }
            if (n2) {
              return new Promise((t3, n3) => {
                r2 = this.wrapArrays(r2);
                Promise.all(r2).then(function(r3) {
                  if (i2) {
                    this.unwrapAsyncs(r3);
                  }
                  try {
                    var a3 = e2.op.apply(e2, r3);
                    t3(a3);
                  } catch (e3) {
                    n3(e3);
                  }
                }).catch(function(e3) {
                  n3(e3);
                });
              });
            } else {
              if (i2) {
                this.unwrapAsyncs(r2);
              }
              return e2.op.apply(e2, r2);
            }
          }
          _scriptAttrs = null;
          getScriptAttributes() {
            if (this._scriptAttrs == null) {
              this._scriptAttrs = r.attributes.replace(/ /g, "").split(",");
            }
            return this._scriptAttrs;
          }
          getScript(e2) {
            for (var t2 = 0; t2 < this.getScriptAttributes().length; t2++) {
              var r2 = this.getScriptAttributes()[t2];
              if (e2.hasAttribute && e2.hasAttribute(r2)) {
                return e2.getAttribute(r2);
              }
            }
            if (e2 instanceof HTMLScriptElement && e2.type === "text/hyperscript") {
              return e2.innerText;
            }
            return null;
          }
          hyperscriptFeaturesMap = /* @__PURE__ */ new WeakMap();
          getHyperscriptFeatures(e2) {
            var t2 = this.hyperscriptFeaturesMap.get(e2);
            if (typeof t2 === "undefined") {
              if (e2) {
                this.hyperscriptFeaturesMap.set(e2, t2 = {});
              }
            }
            return t2;
          }
          addFeatures(e2, t2) {
            if (e2) {
              Object.assign(t2.locals, this.getHyperscriptFeatures(e2));
              this.addFeatures(e2.parentElement, t2);
            }
          }
          makeContext(e2, t2, r2, n2) {
            return new f(e2, t2, r2, n2, this);
          }
          getScriptSelector() {
            return this.getScriptAttributes().map(function(e2) {
              return "[" + e2 + "]";
            }).join(", ");
          }
          convertValue(e2, r2) {
            var n2 = t.dynamicResolvers;
            for (var i2 = 0; i2 < n2.length; i2++) {
              var a2 = n2[i2];
              var o2 = a2(r2, e2);
              if (o2 !== void 0) {
                return o2;
              }
            }
            if (e2 == null) {
              return null;
            }
            var s2 = t[r2];
            if (s2) {
              return s2(e2);
            }
            throw "Unknown conversion : " + r2;
          }
          parse(e2) {
            const t2 = this.lexer, r2 = this.parser;
            var n2 = t2.tokenize(e2);
            if (this.parser.commandStart(n2.currentToken())) {
              var i2 = r2.requireElement("commandList", n2);
              if (n2.hasMore())
                r2.raiseParseError(n2);
              r2.ensureTerminated(i2);
              return i2;
            } else if (r2.featureStart(n2.currentToken())) {
              var a2 = r2.requireElement("hyperscript", n2);
              if (n2.hasMore())
                r2.raiseParseError(n2);
              return a2;
            } else {
              var o2 = r2.requireElement("expression", n2);
              if (n2.hasMore())
                r2.raiseParseError(n2);
              return o2;
            }
          }
          evaluateNoPromise(e2, t2) {
            let r2 = e2.evaluate(t2);
            if (r2.next) {
              throw new Error(i.sourceFor.call(e2) + " returned a Promise in a context that they are not allowed.");
            }
            return r2;
          }
          evaluate(t2, r2, n2) {
            class i2 extends EventTarget {
              constructor(e2) {
                super();
                this.module = e2;
              }
              toString() {
                return this.module.id;
              }
            }
            var a2 = "document" in e ? e.document.body : new i2(n2 && n2.module);
            r2 = Object.assign(this.makeContext(a2, null, a2, null), r2 || {});
            var o2 = this.parse(t2);
            if (o2.execute) {
              o2.execute(r2);
              return r2.result;
            } else if (o2.apply) {
              o2.apply(a2, a2, n2);
              return this.getHyperscriptFeatures(a2);
            } else {
              return o2.evaluate(r2);
            }
            function s2() {
              return {};
            }
          }
          processNode(e2) {
            var t2 = this.getScriptSelector();
            if (this.matchesSelector(e2, t2)) {
              this.initElement(e2, e2);
            }
            if (e2 instanceof HTMLScriptElement && e2.type === "text/hyperscript") {
              this.initElement(e2, document.body);
            }
            if (e2.querySelectorAll) {
              this.forEach(e2.querySelectorAll(t2 + ", [type='text/hyperscript']"), (e3) => {
                this.initElement(e3, e3 instanceof HTMLScriptElement && e3.type === "text/hyperscript" ? document.body : e3);
              });
            }
          }
          initElement(e2, t2) {
            if (e2.closest && e2.closest(r.disableSelector)) {
              return;
            }
            var n2 = this.getInternalData(e2);
            if (!n2.initialized) {
              var i2 = this.getScript(e2);
              if (i2) {
                try {
                  n2.initialized = true;
                  n2.script = i2;
                  const r2 = this.lexer, s2 = this.parser;
                  var a2 = r2.tokenize(i2);
                  var o2 = s2.parseHyperScript(a2);
                  if (!o2)
                    return;
                  o2.apply(t2 || e2, e2);
                  setTimeout(() => {
                    this.triggerEvent(t2 || e2, "load", { hyperscript: true });
                  }, 1);
                } catch (t3) {
                  this.triggerEvent(e2, "exception", { error: t3 });
                  console.error("hyperscript errors were found on the following element:", e2, "\n\n", t3.message, t3.stack);
                }
              }
            }
          }
          internalDataMap = /* @__PURE__ */ new WeakMap();
          getInternalData(e2) {
            var t2 = this.internalDataMap.get(e2);
            if (typeof t2 === "undefined") {
              this.internalDataMap.set(e2, t2 = {});
            }
            return t2;
          }
          typeCheck(e2, t2, r2) {
            if (e2 == null && r2) {
              return true;
            }
            var n2 = Object.prototype.toString.call(e2).slice(8, -1);
            return n2 === t2;
          }
          getElementScope(e2) {
            var t2 = e2.meta && e2.meta.owner;
            if (t2) {
              var r2 = this.getInternalData(t2);
              var n2 = "elementScope";
              if (e2.meta.feature && e2.meta.feature.behavior) {
                n2 = e2.meta.feature.behavior + "Scope";
              }
              var i2 = h(r2, n2);
              return i2;
            } else {
              return {};
            }
          }
          isReservedWord(e2) {
            return ["meta", "it", "result", "locals", "event", "target", "detail", "sender", "body"].includes(e2);
          }
          isHyperscriptContext(e2) {
            return e2 instanceof f;
          }
          resolveSymbol(t2, r2, n2) {
            if (t2 === "me" || t2 === "my" || t2 === "I") {
              return r2.me;
            }
            if (t2 === "it" || t2 === "its" || t2 === "result") {
              return r2.result;
            }
            if (t2 === "you" || t2 === "your" || t2 === "yourself") {
              return r2.you;
            } else {
              if (n2 === "global") {
                return e[t2];
              } else if (n2 === "element") {
                var i2 = this.getElementScope(r2);
                return i2[t2];
              } else if (n2 === "local") {
                return r2.locals[t2];
              } else {
                if (r2.meta && r2.meta.context) {
                  var a2 = r2.meta.context[t2];
                  if (typeof a2 !== "undefined") {
                    return a2;
                  }
                  if (r2.meta.context.detail) {
                    a2 = r2.meta.context.detail[t2];
                    if (typeof a2 !== "undefined") {
                      return a2;
                    }
                  }
                }
                if (this.isHyperscriptContext(r2) && !this.isReservedWord(t2)) {
                  var o2 = r2.locals[t2];
                } else {
                  var o2 = r2[t2];
                }
                if (typeof o2 !== "undefined") {
                  return o2;
                } else {
                  var i2 = this.getElementScope(r2);
                  o2 = i2[t2];
                  if (typeof o2 !== "undefined") {
                    return o2;
                  } else {
                    return e[t2];
                  }
                }
              }
            }
          }
          setSymbol(t2, r2, n2, i2) {
            if (n2 === "global") {
              e[t2] = i2;
            } else if (n2 === "element") {
              var a2 = this.getElementScope(r2);
              a2[t2] = i2;
            } else if (n2 === "local") {
              r2.locals[t2] = i2;
            } else {
              if (this.isHyperscriptContext(r2) && !this.isReservedWord(t2) && typeof r2.locals[t2] !== "undefined") {
                r2.locals[t2] = i2;
              } else {
                var a2 = this.getElementScope(r2);
                var o2 = a2[t2];
                if (typeof o2 !== "undefined") {
                  a2[t2] = i2;
                } else {
                  if (this.isHyperscriptContext(r2) && !this.isReservedWord(t2)) {
                    r2.locals[t2] = i2;
                  } else {
                    r2[t2] = i2;
                  }
                }
              }
            }
          }
          findNext(e2, t2) {
            if (e2) {
              if (e2.resolveNext) {
                return e2.resolveNext(t2);
              } else if (e2.next) {
                return e2.next;
              } else {
                return this.findNext(e2.parent, t2);
              }
            }
          }
          flatGet(e2, t2, r2) {
            if (e2 != null) {
              var n2 = r2(e2, t2);
              if (typeof n2 !== "undefined") {
                return n2;
              }
              if (this.shouldAutoIterate(e2)) {
                var i2 = [];
                for (var a2 of e2) {
                  var o2 = r2(a2, t2);
                  i2.push(o2);
                }
                return i2;
              }
            }
          }
          resolveProperty(e2, t2) {
            return this.flatGet(e2, t2, (e3, t3) => e3[t3]);
          }
          resolveAttribute(e2, t2) {
            return this.flatGet(e2, t2, (e3, t3) => e3.getAttribute && e3.getAttribute(t3));
          }
          resolveStyle(e2, t2) {
            return this.flatGet(e2, t2, (e3, t3) => e3.style && e3.style[t3]);
          }
          resolveComputedStyle(e2, t2) {
            return this.flatGet(e2, t2, (e3, t3) => getComputedStyle(e3).getPropertyValue(t3));
          }
          assignToNamespace(t2, r2, n2, i2) {
            let a2;
            if (typeof document !== "undefined" && t2 === document.body) {
              a2 = e;
            } else {
              a2 = this.getHyperscriptFeatures(t2);
            }
            var o2;
            while ((o2 = r2.shift()) !== void 0) {
              var s2 = a2[o2];
              if (s2 == null) {
                s2 = {};
                a2[o2] = s2;
              }
              a2 = s2;
            }
            a2[n2] = i2;
          }
          getHyperTrace(e2, t2) {
            var r2 = [];
            var n2 = e2;
            while (n2.meta.caller) {
              n2 = n2.meta.caller;
            }
            if (n2.meta.traceMap) {
              return n2.meta.traceMap.get(t2, r2);
            }
          }
          registerHyperTrace(e2, t2) {
            var r2 = [];
            var n2 = null;
            while (e2 != null) {
              r2.push(e2);
              n2 = e2;
              e2 = e2.meta.caller;
            }
            if (n2.meta.traceMap == null) {
              n2.meta.traceMap = /* @__PURE__ */ new Map();
            }
            if (!n2.meta.traceMap.get(t2)) {
              var i2 = { trace: r2, print: function(e3) {
                e3 = e3 || console.error;
                e3("hypertrace /// ");
                var t3 = 0;
                for (var n3 = 0; n3 < r2.length; n3++) {
                  t3 = Math.max(t3, r2[n3].meta.feature.displayName.length);
                }
                for (var n3 = 0; n3 < r2.length; n3++) {
                  var i3 = r2[n3];
                  e3("  ->", i3.meta.feature.displayName.padEnd(t3 + 2), "-", i3.meta.owner);
                }
              } };
              n2.meta.traceMap.set(t2, i2);
            }
          }
          escapeSelector(e2) {
            return e2.replace(/:/g, function(e3) {
              return "\\" + e3;
            });
          }
          nullCheck(e2, t2) {
            if (e2 == null) {
              throw new Error("'" + t2.sourceFor() + "' is null");
            }
          }
          isEmpty(e2) {
            return e2 == void 0 || e2.length === 0;
          }
          doesExist(e2) {
            if (e2 == null) {
              return false;
            }
            if (this.shouldAutoIterate(e2)) {
              for (const t2 of e2) {
                return true;
              }
              return false;
            }
            return true;
          }
          getRootNode(e2) {
            if (e2 && e2 instanceof Node) {
              var t2 = e2.getRootNode();
              if (t2 instanceof Document || t2 instanceof ShadowRoot)
                return t2;
            }
            return document;
          }
          getEventQueueFor(e2, t2) {
            let r2 = this.getInternalData(e2);
            var n2 = r2.eventQueues;
            if (n2 == null) {
              n2 = /* @__PURE__ */ new Map();
              r2.eventQueues = n2;
            }
            var i2 = n2.get(t2);
            if (i2 == null) {
              i2 = { queue: [], executing: false };
              n2.set(t2, i2);
            }
            return i2;
          }
          beepValueToConsole(e2, t2, r2) {
            if (this.triggerEvent(e2, "hyperscript:beep", { element: e2, expression: t2, value: r2 })) {
              var n2;
              if (r2) {
                if (r2 instanceof m) {
                  n2 = "ElementCollection";
                } else if (r2.constructor) {
                  n2 = r2.constructor.name;
                } else {
                  n2 = "unknown";
                }
              } else {
                n2 = "object (null)";
              }
              var a2 = r2;
              if (n2 === "String") {
                a2 = '"' + a2 + '"';
              } else if (r2 instanceof m) {
                a2 = Array.from(r2);
              }
              console.log("///_ BEEP! The expression (" + i.sourceFor.call(t2).replace("beep! ", "") + ") evaluates to:", a2, "of type " + n2);
            }
          }
          hyperscriptUrl = "document" in e && document.currentScript ? document.currentScript.src : null;
        }
        function s() {
          let e2 = document.cookie.split("; ").map((e3) => {
            let t2 = e3.split("=");
            return { name: t2[0], value: decodeURIComponent(t2[1]) };
          });
          return e2;
        }
        function u(e2) {
          document.cookie = e2 + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        function l() {
          for (const e2 of s()) {
            u(e2.name);
          }
        }
        const c = new Proxy({}, { get(e2, t2) {
          if (t2 === "then" || t2 === "asyncWrapper") {
            return null;
          } else if (t2 === "length") {
            return s().length;
          } else if (t2 === "clear") {
            return u;
          } else if (t2 === "clearAll") {
            return l;
          } else if (typeof t2 === "string") {
            if (!isNaN(t2)) {
              return s()[parseInt(t2)];
            } else {
              let e3 = document.cookie.split("; ").find((e4) => e4.startsWith(t2 + "="))?.split("=")[1];
              if (e3) {
                return decodeURIComponent(e3);
              }
            }
          } else if (t2 === Symbol.iterator) {
            return s()[t2];
          }
        }, set(e2, t2, r2) {
          var n2 = null;
          if ("string" === typeof r2) {
            n2 = encodeURIComponent(r2);
            n2 += ";samesite=lax";
          } else {
            n2 = encodeURIComponent(r2.value);
            if (r2.expires) {
              n2 += ";expires=" + r2.maxAge;
            }
            if (r2.maxAge) {
              n2 += ";max-age=" + r2.maxAge;
            }
            if (r2.partitioned) {
              n2 += ";partitioned=" + r2.partitioned;
            }
            if (r2.path) {
              n2 += ";path=" + r2.path;
            }
            if (r2.samesite) {
              n2 += ";samesite=" + r2.path;
            }
            if (r2.secure) {
              n2 += ";secure=" + r2.path;
            }
          }
          document.cookie = t2 + "=" + n2;
          return true;
        } });
        class f {
          constructor(t2, r2, n2, i2, a2) {
            this.meta = { parser: a2.parser, lexer: a2.lexer, runtime: a2, owner: t2, feature: r2, iterators: {}, ctx: this };
            this.locals = { cookies: c };
            this.me = n2, this.you = void 0;
            this.result = void 0;
            this.event = i2;
            this.target = i2 ? i2.target : null;
            this.detail = i2 ? i2.detail : null;
            this.sender = i2 ? i2.detail ? i2.detail.sender : null : null;
            this.body = "document" in e ? document.body : null;
            a2.addFeatures(t2, this);
          }
        }
        class m {
          constructor(e2, t2, r2) {
            this._css = e2;
            this.relativeToElement = t2;
            this.escape = r2;
            this[p] = true;
          }
          get css() {
            if (this.escape) {
              return o.prototype.escapeSelector(this._css);
            } else {
              return this._css;
            }
          }
          get className() {
            return this._css.substr(1);
          }
          get id() {
            return this.className();
          }
          contains(e2) {
            for (let t2 of this) {
              if (t2.contains(e2)) {
                return true;
              }
            }
            return false;
          }
          get length() {
            return this.selectMatches().length;
          }
          [Symbol.iterator]() {
            let e2 = this.selectMatches();
            return e2[Symbol.iterator]();
          }
          selectMatches() {
            let e2 = o.prototype.getRootNode(this.relativeToElement).querySelectorAll(this.css);
            return e2;
          }
        }
        const p = Symbol();
        function h(e2, t2) {
          var r2 = e2[t2];
          if (r2) {
            return r2;
          } else {
            var n2 = {};
            e2[t2] = n2;
            return n2;
          }
        }
        function v(e2) {
          try {
            return JSON.parse(e2);
          } catch (e3) {
            d(e3);
            return null;
          }
        }
        function d(e2) {
          if (console.error) {
            console.error(e2);
          } else if (console.log) {
            console.log("ERROR: ", e2);
          }
        }
        function E(e2, t2) {
          return new (e2.bind.apply(e2, [e2].concat(t2)))();
        }
        function T(t2) {
          t2.addLeafExpression("parenthesized", function(e2, t3, r3) {
            if (r3.matchOpToken("(")) {
              var n2 = r3.clearFollows();
              try {
                var i2 = e2.requireElement("expression", r3);
              } finally {
                r3.restoreFollows(n2);
              }
              r3.requireOpToken(")");
              return i2;
            }
          });
          t2.addLeafExpression("string", function(e2, t3, r3) {
            var i2 = r3.matchTokenType("STRING");
            if (!i2)
              return;
            var a3 = i2.value;
            var o2;
            if (i2.template) {
              var s3 = n.tokenize(a3, true);
              o2 = e2.parseStringTemplate(s3);
            } else {
              o2 = [];
            }
            return { type: "string", token: i2, args: o2, op: function(e3) {
              var t4 = "";
              for (var r4 = 1; r4 < arguments.length; r4++) {
                var n2 = arguments[r4];
                if (n2 !== void 0) {
                  t4 += n2;
                }
              }
              return t4;
            }, evaluate: function(e3) {
              if (o2.length === 0) {
                return a3;
              } else {
                return t3.unifiedEval(this, e3);
              }
            } };
          });
          t2.addGrammarElement("nakedString", function(e2, t3, r3) {
            if (r3.hasMore()) {
              var n2 = r3.consumeUntilWhitespace();
              r3.matchTokenType("WHITESPACE");
              return { type: "nakedString", tokens: n2, evaluate: function(e3) {
                return n2.map(function(e4) {
                  return e4.value;
                }).join("");
              } };
            }
          });
          t2.addLeafExpression("number", function(e2, t3, r3) {
            var n2 = r3.matchTokenType("NUMBER");
            if (!n2)
              return;
            var i2 = n2;
            var a3 = parseFloat(n2.value);
            return { type: "number", value: a3, numberToken: i2, evaluate: function() {
              return a3;
            } };
          });
          t2.addLeafExpression("idRef", function(e2, t3, r3) {
            var i2 = r3.matchTokenType("ID_REF");
            if (!i2)
              return;
            if (!i2.value)
              return;
            if (i2.template) {
              var a3 = i2.value.substring(2);
              var o2 = n.tokenize(a3);
              var s3 = e2.requireElement("expression", o2);
              return { type: "idRefTemplate", args: [s3], op: function(e3, r4) {
                return t3.getRootNode(e3.me).getElementById(r4);
              }, evaluate: function(e3) {
                return t3.unifiedEval(this, e3);
              } };
            } else {
              const e3 = i2.value.substring(1);
              return { type: "idRef", css: i2.value, value: e3, evaluate: function(r4) {
                return t3.getRootNode(r4.me).getElementById(e3);
              } };
            }
          });
          t2.addLeafExpression("classRef", function(e2, t3, r3) {
            var i2 = r3.matchTokenType("CLASS_REF");
            if (!i2)
              return;
            if (!i2.value)
              return;
            if (i2.template) {
              var a3 = i2.value.substring(2);
              var o2 = n.tokenize(a3);
              var s3 = e2.requireElement("expression", o2);
              return { type: "classRefTemplate", args: [s3], op: function(e3, t4) {
                return new m("." + t4, e3.me, true);
              }, evaluate: function(e3) {
                return t3.unifiedEval(this, e3);
              } };
            } else {
              const e3 = i2.value;
              return { type: "classRef", css: e3, evaluate: function(t4) {
                return new m(e3, t4.me, true);
              } };
            }
          });
          class r2 extends m {
            constructor(e2, t3, r3) {
              super(e2, t3);
              this.templateParts = r3;
              this.elements = r3.filter((e3) => e3 instanceof Element);
            }
            get css() {
              let e2 = "", t3 = 0;
              for (const r3 of this.templateParts) {
                if (r3 instanceof Element) {
                  e2 += "[data-hs-query-id='" + t3++ + "']";
                } else
                  e2 += r3;
              }
              return e2;
            }
            [Symbol.iterator]() {
              this.elements.forEach((e3, t3) => e3.dataset.hsQueryId = t3);
              const e2 = super[Symbol.iterator]();
              this.elements.forEach((e3) => e3.removeAttribute("data-hs-query-id"));
              return e2;
            }
          }
          t2.addLeafExpression("queryRef", function(e2, t3, i2) {
            var a3 = i2.matchOpToken("<");
            if (!a3)
              return;
            var o2 = i2.consumeUntil("/");
            i2.requireOpToken("/");
            i2.requireOpToken(">");
            var s3 = o2.map(function(e3) {
              if (e3.type === "STRING") {
                return '"' + e3.value + '"';
              } else {
                return e3.value;
              }
            }).join("");
            var u3, l3, c3;
            if (s3.indexOf("$") >= 0) {
              u3 = true;
              l3 = n.tokenize(s3, true);
              c3 = e2.parseStringTemplate(l3);
            }
            return { type: "queryRef", css: s3, args: c3, op: function(e3, ...t4) {
              if (u3) {
                return new r2(s3, e3.me, t4);
              } else {
                return new m(s3, e3.me);
              }
            }, evaluate: function(e3) {
              return t3.unifiedEval(this, e3);
            } };
          });
          t2.addLeafExpression("attributeRef", function(e2, t3, r3) {
            var n2 = r3.matchTokenType("ATTRIBUTE_REF");
            if (!n2)
              return;
            if (!n2.value)
              return;
            var i2 = n2.value;
            if (i2.indexOf("[") === 0) {
              var a3 = i2.substring(2, i2.length - 1);
            } else {
              var a3 = i2.substring(1);
            }
            var o2 = "[" + a3 + "]";
            var s3 = a3.split("=");
            var u3 = s3[0];
            var l3 = s3[1];
            if (l3) {
              if (l3.indexOf('"') === 0) {
                l3 = l3.substring(1, l3.length - 1);
              }
            }
            return { type: "attributeRef", name: u3, css: o2, value: l3, op: function(e3) {
              var t4 = e3.you || e3.me;
              if (t4) {
                return t4.getAttribute(u3);
              }
            }, evaluate: function(e3) {
              return t3.unifiedEval(this, e3);
            } };
          });
          t2.addLeafExpression("styleRef", function(e2, t3, r3) {
            var n2 = r3.matchTokenType("STYLE_REF");
            if (!n2)
              return;
            if (!n2.value)
              return;
            var i2 = n2.value.substr(1);
            if (i2.startsWith("computed-")) {
              i2 = i2.substr("computed-".length);
              return { type: "computedStyleRef", name: i2, op: function(e3) {
                var r4 = e3.you || e3.me;
                if (r4) {
                  return t3.resolveComputedStyle(r4, i2);
                }
              }, evaluate: function(e3) {
                return t3.unifiedEval(this, e3);
              } };
            } else {
              return { type: "styleRef", name: i2, op: function(e3) {
                var r4 = e3.you || e3.me;
                if (r4) {
                  return t3.resolveStyle(r4, i2);
                }
              }, evaluate: function(e3) {
                return t3.unifiedEval(this, e3);
              } };
            }
          });
          t2.addGrammarElement("objectKey", function(e2, t3, r3) {
            var n2;
            if (n2 = r3.matchTokenType("STRING")) {
              return { type: "objectKey", key: n2.value, evaluate: function() {
                return n2.value;
              } };
            } else if (r3.matchOpToken("[")) {
              var i2 = e2.parseElement("expression", r3);
              r3.requireOpToken("]");
              return { type: "objectKey", expr: i2, args: [i2], op: function(e3, t4) {
                return t4;
              }, evaluate: function(e3) {
                return t3.unifiedEval(this, e3);
              } };
            } else {
              var a3 = "";
              do {
                n2 = r3.matchTokenType("IDENTIFIER") || r3.matchOpToken("-");
                if (n2)
                  a3 += n2.value;
              } while (n2);
              return { type: "objectKey", key: a3, evaluate: function() {
                return a3;
              } };
            }
          });
          t2.addLeafExpression("objectLiteral", function(e2, t3, r3) {
            if (!r3.matchOpToken("{"))
              return;
            var n2 = [];
            var i2 = [];
            if (!r3.matchOpToken("}")) {
              do {
                var a3 = e2.requireElement("objectKey", r3);
                r3.requireOpToken(":");
                var o2 = e2.requireElement("expression", r3);
                i2.push(o2);
                n2.push(a3);
              } while (r3.matchOpToken(","));
              r3.requireOpToken("}");
            }
            return { type: "objectLiteral", args: [n2, i2], op: function(e3, t4, r4) {
              var n3 = {};
              for (var i3 = 0; i3 < t4.length; i3++) {
                n3[t4[i3]] = r4[i3];
              }
              return n3;
            }, evaluate: function(e3) {
              return t3.unifiedEval(this, e3);
            } };
          });
          t2.addGrammarElement("nakedNamedArgumentList", function(e2, t3, r3) {
            var n2 = [];
            var i2 = [];
            if (r3.currentToken().type === "IDENTIFIER") {
              do {
                var a3 = r3.requireTokenType("IDENTIFIER");
                r3.requireOpToken(":");
                var o2 = e2.requireElement("expression", r3);
                i2.push(o2);
                n2.push({ name: a3, value: o2 });
              } while (r3.matchOpToken(","));
            }
            return { type: "namedArgumentList", fields: n2, args: [i2], op: function(e3, t4) {
              var r4 = { _namedArgList_: true };
              for (var i3 = 0; i3 < t4.length; i3++) {
                var a4 = n2[i3];
                r4[a4.name.value] = t4[i3];
              }
              return r4;
            }, evaluate: function(e3) {
              return t3.unifiedEval(this, e3);
            } };
          });
          t2.addGrammarElement("namedArgumentList", function(e2, t3, r3) {
            if (!r3.matchOpToken("("))
              return;
            var n2 = e2.requireElement("nakedNamedArgumentList", r3);
            r3.requireOpToken(")");
            return n2;
          });
          t2.addGrammarElement("symbol", function(e2, t3, r3) {
            var n2 = "default";
            if (r3.matchToken("global")) {
              n2 = "global";
            } else if (r3.matchToken("element") || r3.matchToken("module")) {
              n2 = "element";
              if (r3.matchOpToken("'")) {
                r3.requireToken("s");
              }
            } else if (r3.matchToken("local")) {
              n2 = "local";
            }
            let i2 = r3.matchOpToken(":");
            let a3 = r3.matchTokenType("IDENTIFIER");
            if (a3 && a3.value) {
              var o2 = a3.value;
              if (i2) {
                o2 = ":" + o2;
              }
              if (n2 === "default") {
                if (o2.indexOf("$") === 0) {
                  n2 = "global";
                }
                if (o2.indexOf(":") === 0) {
                  n2 = "element";
                }
              }
              return { type: "symbol", token: a3, scope: n2, name: o2, evaluate: function(e3) {
                return t3.resolveSymbol(o2, e3, n2);
              } };
            }
          });
          t2.addGrammarElement("implicitMeTarget", function(e2, t3, r3) {
            return { type: "implicitMeTarget", evaluate: function(e3) {
              return e3.you || e3.me;
            } };
          });
          t2.addLeafExpression("boolean", function(e2, t3, r3) {
            var n2 = r3.matchToken("true") || r3.matchToken("false");
            if (!n2)
              return;
            const i2 = n2.value === "true";
            return { type: "boolean", evaluate: function(e3) {
              return i2;
            } };
          });
          t2.addLeafExpression("null", function(e2, t3, r3) {
            if (r3.matchToken("null")) {
              return { type: "null", evaluate: function(e3) {
                return null;
              } };
            }
          });
          t2.addLeafExpression("arrayLiteral", function(e2, t3, r3) {
            if (!r3.matchOpToken("["))
              return;
            var n2 = [];
            if (!r3.matchOpToken("]")) {
              do {
                var i2 = e2.requireElement("expression", r3);
                n2.push(i2);
              } while (r3.matchOpToken(","));
              r3.requireOpToken("]");
            }
            return { type: "arrayLiteral", values: n2, args: [n2], op: function(e3, t4) {
              return t4;
            }, evaluate: function(e3) {
              return t3.unifiedEval(this, e3);
            } };
          });
          t2.addLeafExpression("blockLiteral", function(e2, t3, r3) {
            if (!r3.matchOpToken("\\"))
              return;
            var n2 = [];
            var i2 = r3.matchTokenType("IDENTIFIER");
            if (i2) {
              n2.push(i2);
              while (r3.matchOpToken(",")) {
                n2.push(r3.requireTokenType("IDENTIFIER"));
              }
            }
            r3.requireOpToken("-");
            r3.requireOpToken(">");
            var a3 = e2.requireElement("expression", r3);
            return { type: "blockLiteral", args: n2, expr: a3, evaluate: function(e3) {
              var t4 = function() {
                for (var t5 = 0; t5 < n2.length; t5++) {
                  e3.locals[n2[t5].value] = arguments[t5];
                }
                return a3.evaluate(e3);
              };
              return t4;
            } };
          });
          t2.addIndirectExpression("propertyAccess", function(e2, t3, r3, n2) {
            if (!r3.matchOpToken("."))
              return;
            var i2 = r3.requireTokenType("IDENTIFIER");
            var a3 = { type: "propertyAccess", root: n2, prop: i2, args: [n2], op: function(e3, r4) {
              var n3 = t3.resolveProperty(r4, i2.value);
              return n3;
            }, evaluate: function(e3) {
              return t3.unifiedEval(this, e3);
            } };
            return e2.parseElement("indirectExpression", r3, a3);
          });
          t2.addIndirectExpression("of", function(e2, t3, r3, n2) {
            if (!r3.matchToken("of"))
              return;
            var i2 = e2.requireElement("unaryExpression", r3);
            var a3 = null;
            var o2 = n2;
            while (o2.root) {
              a3 = o2;
              o2 = o2.root;
            }
            if (o2.type !== "symbol" && o2.type !== "attributeRef" && o2.type !== "styleRef" && o2.type !== "computedStyleRef") {
              e2.raiseParseError(r3, "Cannot take a property of a non-symbol: " + o2.type);
            }
            var s3 = o2.type === "attributeRef";
            var u3 = o2.type === "styleRef" || o2.type === "computedStyleRef";
            if (s3 || u3) {
              var l3 = o2;
            }
            var c3 = o2.name;
            var f3 = { type: "ofExpression", prop: o2.token, root: i2, attribute: l3, expression: n2, args: [i2], op: function(e3, r4) {
              if (s3) {
                return t3.resolveAttribute(r4, c3);
              } else if (u3) {
                if (o2.type === "computedStyleRef") {
                  return t3.resolveComputedStyle(r4, c3);
                } else {
                  return t3.resolveStyle(r4, c3);
                }
              } else {
                return t3.resolveProperty(r4, c3);
              }
            }, evaluate: function(e3) {
              return t3.unifiedEval(this, e3);
            } };
            if (o2.type === "attributeRef") {
              f3.attribute = o2;
            }
            if (a3) {
              a3.root = f3;
              a3.args = [f3];
            } else {
              n2 = f3;
            }
            return e2.parseElement("indirectExpression", r3, n2);
          });
          t2.addIndirectExpression("possessive", function(e2, t3, r3, n2) {
            if (e2.possessivesDisabled) {
              return;
            }
            var i2 = r3.matchOpToken("'");
            if (i2 || n2.type === "symbol" && (n2.name === "my" || n2.name === "its" || n2.name === "your") && (r3.currentToken().type === "IDENTIFIER" || r3.currentToken().type === "ATTRIBUTE_REF" || r3.currentToken().type === "STYLE_REF")) {
              if (i2) {
                r3.requireToken("s");
              }
              var a3, o2, s3;
              a3 = e2.parseElement("attributeRef", r3);
              if (a3 == null) {
                o2 = e2.parseElement("styleRef", r3);
                if (o2 == null) {
                  s3 = r3.requireTokenType("IDENTIFIER");
                }
              }
              var u3 = { type: "possessive", root: n2, attribute: a3 || o2, prop: s3, args: [n2], op: function(e3, r4) {
                if (a3) {
                  var n3 = t3.resolveAttribute(r4, a3.name);
                } else if (o2) {
                  var n3;
                  if (o2.type === "computedStyleRef") {
                    n3 = t3.resolveComputedStyle(r4, o2["name"]);
                  } else {
                    n3 = t3.resolveStyle(r4, o2["name"]);
                  }
                } else {
                  var n3 = t3.resolveProperty(r4, s3.value);
                }
                return n3;
              }, evaluate: function(e3) {
                return t3.unifiedEval(this, e3);
              } };
              return e2.parseElement("indirectExpression", r3, u3);
            }
          });
          t2.addIndirectExpression("inExpression", function(e2, t3, r3, n2) {
            if (!r3.matchToken("in"))
              return;
            var i2 = e2.requireElement("unaryExpression", r3);
            var a3 = { type: "inExpression", root: n2, args: [n2, i2], op: function(e3, r4, n3) {
              var i3 = [];
              if (r4.css) {
                t3.implicitLoop(n3, function(e4) {
                  var t4 = e4.querySelectorAll(r4.css);
                  for (var n4 = 0; n4 < t4.length; n4++) {
                    i3.push(t4[n4]);
                  }
                });
              } else if (r4 instanceof Element) {
                var a4 = false;
                t3.implicitLoop(n3, function(e4) {
                  if (e4.contains(r4)) {
                    a4 = true;
                  }
                });
                if (a4) {
                  return r4;
                }
              } else {
                t3.implicitLoop(r4, function(e4) {
                  t3.implicitLoop(n3, function(t4) {
                    if (e4 === t4) {
                      i3.push(e4);
                    }
                  });
                });
              }
              return i3;
            }, evaluate: function(e3) {
              return t3.unifiedEval(this, e3);
            } };
            return e2.parseElement("indirectExpression", r3, a3);
          });
          t2.addIndirectExpression("asExpression", function(e2, t3, r3, n2) {
            if (!r3.matchToken("as"))
              return;
            r3.matchToken("a") || r3.matchToken("an");
            var i2 = e2.requireElement("dotOrColonPath", r3).evaluate();
            var a3 = { type: "asExpression", root: n2, args: [n2], op: function(e3, r4) {
              return t3.convertValue(r4, i2);
            }, evaluate: function(e3) {
              return t3.unifiedEval(this, e3);
            } };
            return e2.parseElement("indirectExpression", r3, a3);
          });
          t2.addIndirectExpression("functionCall", function(e2, t3, r3, n2) {
            if (!r3.matchOpToken("("))
              return;
            var i2 = [];
            if (!r3.matchOpToken(")")) {
              do {
                i2.push(e2.requireElement("expression", r3));
              } while (r3.matchOpToken(","));
              r3.requireOpToken(")");
            }
            if (n2.root) {
              var a3 = { type: "functionCall", root: n2, argExressions: i2, args: [n2.root, i2], op: function(e3, r4, i3) {
                t3.nullCheck(r4, n2.root);
                var a4 = r4[n2.prop.value];
                t3.nullCheck(a4, n2);
                if (a4.hyperfunc) {
                  i3.push(e3);
                }
                return a4.apply(r4, i3);
              }, evaluate: function(e3) {
                return t3.unifiedEval(this, e3);
              } };
            } else {
              var a3 = { type: "functionCall", root: n2, argExressions: i2, args: [n2, i2], op: function(e3, r4, i3) {
                t3.nullCheck(r4, n2);
                if (r4.hyperfunc) {
                  i3.push(e3);
                }
                var a4 = r4.apply(null, i3);
                return a4;
              }, evaluate: function(e3) {
                return t3.unifiedEval(this, e3);
              } };
            }
            return e2.parseElement("indirectExpression", r3, a3);
          });
          t2.addIndirectExpression("attributeRefAccess", function(e2, t3, r3, n2) {
            var i2 = e2.parseElement("attributeRef", r3);
            if (!i2)
              return;
            var a3 = { type: "attributeRefAccess", root: n2, attribute: i2, args: [n2], op: function(e3, r4) {
              var n3 = t3.resolveAttribute(r4, i2.name);
              return n3;
            }, evaluate: function(e3) {
              return t3.unifiedEval(this, e3);
            } };
            return a3;
          });
          t2.addIndirectExpression("arrayIndex", function(e2, t3, r3, n2) {
            if (!r3.matchOpToken("["))
              return;
            var i2 = false;
            var a3 = false;
            var o2 = null;
            var s3 = null;
            if (r3.matchOpToken("..")) {
              i2 = true;
              o2 = e2.requireElement("expression", r3);
            } else {
              o2 = e2.requireElement("expression", r3);
              if (r3.matchOpToken("..")) {
                a3 = true;
                var u3 = r3.currentToken();
                if (u3.type !== "R_BRACKET") {
                  s3 = e2.parseElement("expression", r3);
                }
              }
            }
            r3.requireOpToken("]");
            var l3 = { type: "arrayIndex", root: n2, prop: o2, firstIndex: o2, secondIndex: s3, args: [n2, o2, s3], op: function(e3, t4, r4, n3) {
              if (t4 == null) {
                return null;
              }
              if (i2) {
                if (r4 < 0) {
                  r4 = t4.length + r4;
                }
                return t4.slice(0, r4 + 1);
              } else if (a3) {
                if (n3 != null) {
                  if (n3 < 0) {
                    n3 = t4.length + n3;
                  }
                  return t4.slice(r4, n3 + 1);
                } else {
                  return t4.slice(r4);
                }
              } else {
                return t4[r4];
              }
            }, evaluate: function(e3) {
              return t3.unifiedEval(this, e3);
            } };
            return e2.parseElement("indirectExpression", r3, l3);
          });
          var a2 = ["em", "ex", "cap", "ch", "ic", "rem", "lh", "rlh", "vw", "vh", "vi", "vb", "vmin", "vmax", "cm", "mm", "Q", "pc", "pt", "px"];
          t2.addGrammarElement("postfixExpression", function(e2, t3, r3) {
            var n2 = e2.parseElement("primaryExpression", r3);
            let i2 = r3.matchAnyToken.apply(r3, a2) || r3.matchOpToken("%");
            if (i2) {
              return { type: "stringPostfix", postfix: i2.value, args: [n2], op: function(e3, t4) {
                return "" + t4 + i2.value;
              }, evaluate: function(e3) {
                return t3.unifiedEval(this, e3);
              } };
            }
            var o2 = null;
            if (r3.matchToken("s") || r3.matchToken("seconds")) {
              o2 = 1e3;
            } else if (r3.matchToken("ms") || r3.matchToken("milliseconds")) {
              o2 = 1;
            }
            if (o2) {
              return { type: "timeExpression", time: n2, factor: o2, args: [n2], op: function(e3, t4) {
                return t4 * o2;
              }, evaluate: function(e3) {
                return t3.unifiedEval(this, e3);
              } };
            }
            if (r3.matchOpToken(":")) {
              var s3 = r3.requireTokenType("IDENTIFIER");
              if (!s3.value)
                return;
              var u3 = !r3.matchOpToken("!");
              return { type: "typeCheck", typeName: s3, nullOk: u3, args: [n2], op: function(e3, r4) {
                var n3 = t3.typeCheck(r4, this.typeName.value, u3);
                if (n3) {
                  return r4;
                } else {
                  throw new Error("Typecheck failed!  Expected: " + s3.value);
                }
              }, evaluate: function(e3) {
                return t3.unifiedEval(this, e3);
              } };
            } else {
              return n2;
            }
          });
          t2.addGrammarElement("logicalNot", function(e2, t3, r3) {
            if (!r3.matchToken("not"))
              return;
            var n2 = e2.requireElement("unaryExpression", r3);
            return { type: "logicalNot", root: n2, args: [n2], op: function(e3, t4) {
              return !t4;
            }, evaluate: function(e3) {
              return t3.unifiedEval(this, e3);
            } };
          });
          t2.addGrammarElement("noExpression", function(e2, t3, r3) {
            if (!r3.matchToken("no"))
              return;
            var n2 = e2.requireElement("unaryExpression", r3);
            return { type: "noExpression", root: n2, args: [n2], op: function(e3, r4) {
              return t3.isEmpty(r4);
            }, evaluate: function(e3) {
              return t3.unifiedEval(this, e3);
            } };
          });
          t2.addLeafExpression("some", function(e2, t3, r3) {
            if (!r3.matchToken("some"))
              return;
            var n2 = e2.requireElement("expression", r3);
            return { type: "noExpression", root: n2, args: [n2], op: function(e3, r4) {
              return !t3.isEmpty(r4);
            }, evaluate(e3) {
              return t3.unifiedEval(this, e3);
            } };
          });
          t2.addGrammarElement("negativeNumber", function(e2, t3, r3) {
            if (!r3.matchOpToken("-"))
              return;
            var n2 = e2.requireElement("unaryExpression", r3);
            return { type: "negativeNumber", root: n2, args: [n2], op: function(e3, t4) {
              return -1 * t4;
            }, evaluate: function(e3) {
              return t3.unifiedEval(this, e3);
            } };
          });
          t2.addGrammarElement("unaryExpression", function(e2, t3, r3) {
            r3.matchToken("the");
            return e2.parseAnyOf(["beepExpression", "logicalNot", "relativePositionalExpression", "positionalExpression", "noExpression", "negativeNumber", "postfixExpression"], r3);
          });
          t2.addGrammarElement("beepExpression", function(e2, t3, r3) {
            if (!r3.matchToken("beep!"))
              return;
            var n2 = e2.parseElement("unaryExpression", r3);
            if (n2) {
              n2["booped"] = true;
              var i2 = n2.evaluate;
              n2.evaluate = function(e3) {
                let r4 = i2.apply(n2, arguments);
                let a3 = e3.me;
                t3.beepValueToConsole(a3, n2, r4);
                return r4;
              };
              return n2;
            }
          });
          var s2 = function(e2, t3, r3, n2) {
            var i2 = t3.querySelectorAll(r3);
            for (var a3 = 0; a3 < i2.length; a3++) {
              var o2 = i2[a3];
              if (o2.compareDocumentPosition(e2) === Node.DOCUMENT_POSITION_PRECEDING) {
                return o2;
              }
            }
            if (n2) {
              return i2[0];
            }
          };
          var u2 = function(e2, t3, r3, n2) {
            var i2 = t3.querySelectorAll(r3);
            for (var a3 = i2.length - 1; a3 >= 0; a3--) {
              var o2 = i2[a3];
              if (o2.compareDocumentPosition(e2) === Node.DOCUMENT_POSITION_FOLLOWING) {
                return o2;
              }
            }
            if (n2) {
              return i2[i2.length - 1];
            }
          };
          var l2 = function(e2, t3, r3, n2) {
            var i2 = [];
            o.prototype.forEach(t3, function(t4) {
              if (t4.matches(r3) || t4 === e2) {
                i2.push(t4);
              }
            });
            for (var a3 = 0; a3 < i2.length - 1; a3++) {
              var s3 = i2[a3];
              if (s3 === e2) {
                return i2[a3 + 1];
              }
            }
            if (n2) {
              var u3 = i2[0];
              if (u3 && u3.matches(r3)) {
                return u3;
              }
            }
          };
          var c2 = function(e2, t3, r3, n2) {
            return l2(e2, Array.from(t3).reverse(), r3, n2);
          };
          t2.addGrammarElement("relativePositionalExpression", function(e2, t3, r3) {
            var n2 = r3.matchAnyToken("next", "previous");
            if (!n2)
              return;
            var a3 = n2.value === "next";
            var o2 = e2.parseElement("expression", r3);
            if (r3.matchToken("from")) {
              r3.pushFollow("in");
              try {
                var f3 = e2.requireElement("unaryExpression", r3);
              } finally {
                r3.popFollow();
              }
            } else {
              var f3 = e2.requireElement("implicitMeTarget", r3);
            }
            var m2 = false;
            var p3;
            if (r3.matchToken("in")) {
              m2 = true;
              var h2 = e2.requireElement("unaryExpression", r3);
            } else if (r3.matchToken("within")) {
              p3 = e2.requireElement("unaryExpression", r3);
            } else {
              p3 = document.body;
            }
            var v3 = false;
            if (r3.matchToken("with")) {
              r3.requireToken("wrapping");
              v3 = true;
            }
            return { type: "relativePositionalExpression", from: f3, forwardSearch: a3, inSearch: m2, wrapping: v3, inElt: h2, withinElt: p3, operator: n2.value, args: [o2, f3, h2, p3], op: function(e3, t4, r4, n3, f4) {
              var p4 = t4.css;
              if (p4 == null) {
                throw "Expected a CSS value to be returned by " + i.sourceFor.apply(o2);
              }
              if (m2) {
                if (n3) {
                  if (a3) {
                    return l2(r4, n3, p4, v3);
                  } else {
                    return c2(r4, n3, p4, v3);
                  }
                }
              } else {
                if (f4) {
                  if (a3) {
                    return s2(r4, f4, p4, v3);
                  } else {
                    return u2(r4, f4, p4, v3);
                  }
                }
              }
            }, evaluate: function(e3) {
              return t3.unifiedEval(this, e3);
            } };
          });
          t2.addGrammarElement("positionalExpression", function(e2, t3, r3) {
            var n2 = r3.matchAnyToken("first", "last", "random");
            if (!n2)
              return;
            r3.matchAnyToken("in", "from", "of");
            var i2 = e2.requireElement("unaryExpression", r3);
            const a3 = n2.value;
            return { type: "positionalExpression", rhs: i2, operator: n2.value, args: [i2], op: function(e3, t4) {
              if (t4 && !Array.isArray(t4)) {
                if (t4.children) {
                  t4 = t4.children;
                } else {
                  t4 = Array.from(t4);
                }
              }
              if (t4) {
                if (a3 === "first") {
                  return t4[0];
                } else if (a3 === "last") {
                  return t4[t4.length - 1];
                } else if (a3 === "random") {
                  return t4[Math.floor(Math.random() * t4.length)];
                }
              }
            }, evaluate: function(e3) {
              return t3.unifiedEval(this, e3);
            } };
          });
          t2.addGrammarElement("mathOperator", function(e2, t3, r3) {
            var n2 = e2.parseElement("unaryExpression", r3);
            var i2, a3 = null;
            i2 = r3.matchAnyOpToken("+", "-", "*", "/") || r3.matchToken("mod");
            while (i2) {
              a3 = a3 || i2;
              var o2 = i2.value;
              if (a3.value !== o2) {
                e2.raiseParseError(r3, "You must parenthesize math operations with different operators");
              }
              var s3 = e2.parseElement("unaryExpression", r3);
              n2 = { type: "mathOperator", lhs: n2, rhs: s3, operator: o2, args: [n2, s3], op: function(e3, t4, r4) {
                if (o2 === "+") {
                  return t4 + r4;
                } else if (o2 === "-") {
                  return t4 - r4;
                } else if (o2 === "*") {
                  return t4 * r4;
                } else if (o2 === "/") {
                  return t4 / r4;
                } else if (o2 === "mod") {
                  return t4 % r4;
                }
              }, evaluate: function(e3) {
                return t3.unifiedEval(this, e3);
              } };
              i2 = r3.matchAnyOpToken("+", "-", "*", "/") || r3.matchToken("mod");
            }
            return n2;
          });
          t2.addGrammarElement("mathExpression", function(e2, t3, r3) {
            return e2.parseAnyOf(["mathOperator", "unaryExpression"], r3);
          });
          function f2(e2, t3, r3) {
            if (t3["contains"]) {
              return t3.contains(r3);
            } else if (t3["includes"]) {
              return t3.includes(r3);
            } else {
              throw Error("The value of " + e2.sourceFor() + " does not have a contains or includes method on it");
            }
          }
          function p2(e2, t3, r3) {
            if (t3["match"]) {
              return !!t3.match(r3);
            } else if (t3["matches"]) {
              return t3.matches(r3);
            } else {
              throw Error("The value of " + e2.sourceFor() + " does not have a match or matches method on it");
            }
          }
          t2.addGrammarElement("comparisonOperator", function(e2, t3, r3) {
            var n2 = e2.parseElement("mathExpression", r3);
            var i2 = r3.matchAnyOpToken("<", ">", "<=", ">=", "==", "===", "!=", "!==");
            var a3 = i2 ? i2.value : null;
            var o2 = true;
            var s3 = false;
            if (a3 == null) {
              if (r3.matchToken("is") || r3.matchToken("am")) {
                if (r3.matchToken("not")) {
                  if (r3.matchToken("in")) {
                    a3 = "not in";
                  } else if (r3.matchToken("a")) {
                    a3 = "not a";
                    s3 = true;
                  } else if (r3.matchToken("empty")) {
                    a3 = "not empty";
                    o2 = false;
                  } else {
                    if (r3.matchToken("really")) {
                      a3 = "!==";
                    } else {
                      a3 = "!=";
                    }
                    if (r3.matchToken("equal")) {
                      r3.matchToken("to");
                    }
                  }
                } else if (r3.matchToken("in")) {
                  a3 = "in";
                } else if (r3.matchToken("a")) {
                  a3 = "a";
                  s3 = true;
                } else if (r3.matchToken("empty")) {
                  a3 = "empty";
                  o2 = false;
                } else if (r3.matchToken("less")) {
                  r3.requireToken("than");
                  if (r3.matchToken("or")) {
                    r3.requireToken("equal");
                    r3.requireToken("to");
                    a3 = "<=";
                  } else {
                    a3 = "<";
                  }
                } else if (r3.matchToken("greater")) {
                  r3.requireToken("than");
                  if (r3.matchToken("or")) {
                    r3.requireToken("equal");
                    r3.requireToken("to");
                    a3 = ">=";
                  } else {
                    a3 = ">";
                  }
                } else {
                  if (r3.matchToken("really")) {
                    a3 = "===";
                  } else {
                    a3 = "==";
                  }
                  if (r3.matchToken("equal")) {
                    r3.matchToken("to");
                  }
                }
              } else if (r3.matchToken("equals")) {
                a3 = "==";
              } else if (r3.matchToken("really")) {
                r3.requireToken("equals");
                a3 = "===";
              } else if (r3.matchToken("exist") || r3.matchToken("exists")) {
                a3 = "exist";
                o2 = false;
              } else if (r3.matchToken("matches") || r3.matchToken("match")) {
                a3 = "match";
              } else if (r3.matchToken("contains") || r3.matchToken("contain")) {
                a3 = "contain";
              } else if (r3.matchToken("includes") || r3.matchToken("include")) {
                a3 = "include";
              } else if (r3.matchToken("do") || r3.matchToken("does")) {
                r3.requireToken("not");
                if (r3.matchToken("matches") || r3.matchToken("match")) {
                  a3 = "not match";
                } else if (r3.matchToken("contains") || r3.matchToken("contain")) {
                  a3 = "not contain";
                } else if (r3.matchToken("exist") || r3.matchToken("exist")) {
                  a3 = "not exist";
                  o2 = false;
                } else if (r3.matchToken("include")) {
                  a3 = "not include";
                } else {
                  e2.raiseParseError(r3, "Expected matches or contains");
                }
              }
            }
            if (a3) {
              var u3, l3, c3;
              if (s3) {
                u3 = r3.requireTokenType("IDENTIFIER");
                l3 = !r3.matchOpToken("!");
              } else if (o2) {
                c3 = e2.requireElement("mathExpression", r3);
                if (a3 === "match" || a3 === "not match") {
                  c3 = c3.css ? c3.css : c3;
                }
              }
              var m2 = n2;
              n2 = { type: "comparisonOperator", operator: a3, typeName: u3, nullOk: l3, lhs: n2, rhs: c3, args: [n2, c3], op: function(e3, r4, n3) {
                if (a3 === "==") {
                  return r4 == n3;
                } else if (a3 === "!=") {
                  return r4 != n3;
                }
                if (a3 === "===") {
                  return r4 === n3;
                } else if (a3 === "!==") {
                  return r4 !== n3;
                }
                if (a3 === "match") {
                  return r4 != null && p2(m2, r4, n3);
                }
                if (a3 === "not match") {
                  return r4 == null || !p2(m2, r4, n3);
                }
                if (a3 === "in") {
                  return n3 != null && f2(c3, n3, r4);
                }
                if (a3 === "not in") {
                  return n3 == null || !f2(c3, n3, r4);
                }
                if (a3 === "contain") {
                  return r4 != null && f2(m2, r4, n3);
                }
                if (a3 === "not contain") {
                  return r4 == null || !f2(m2, r4, n3);
                }
                if (a3 === "include") {
                  return r4 != null && f2(m2, r4, n3);
                }
                if (a3 === "not include") {
                  return r4 == null || !f2(m2, r4, n3);
                }
                if (a3 === "===") {
                  return r4 === n3;
                } else if (a3 === "!==") {
                  return r4 !== n3;
                } else if (a3 === "<") {
                  return r4 < n3;
                } else if (a3 === ">") {
                  return r4 > n3;
                } else if (a3 === "<=") {
                  return r4 <= n3;
                } else if (a3 === ">=") {
                  return r4 >= n3;
                } else if (a3 === "empty") {
                  return t3.isEmpty(r4);
                } else if (a3 === "not empty") {
                  return !t3.isEmpty(r4);
                } else if (a3 === "exist") {
                  return t3.doesExist(r4);
                } else if (a3 === "not exist") {
                  return !t3.doesExist(r4);
                } else if (a3 === "a") {
                  return t3.typeCheck(r4, u3.value, l3);
                } else if (a3 === "not a") {
                  return !t3.typeCheck(r4, u3.value, l3);
                } else {
                  throw "Unknown comparison : " + a3;
                }
              }, evaluate: function(e3) {
                return t3.unifiedEval(this, e3);
              } };
            }
            return n2;
          });
          t2.addGrammarElement("comparisonExpression", function(e2, t3, r3) {
            return e2.parseAnyOf(["comparisonOperator", "mathExpression"], r3);
          });
          t2.addGrammarElement("logicalOperator", function(e2, t3, r3) {
            var n2 = e2.parseElement("comparisonExpression", r3);
            var i2, a3 = null;
            i2 = r3.matchToken("and") || r3.matchToken("or");
            while (i2) {
              a3 = a3 || i2;
              if (a3.value !== i2.value) {
                e2.raiseParseError(r3, "You must parenthesize logical operations with different operators");
              }
              var o2 = e2.requireElement("comparisonExpression", r3);
              const s3 = i2.value;
              n2 = { type: "logicalOperator", operator: s3, lhs: n2, rhs: o2, args: [n2, o2], op: function(e3, t4, r4) {
                if (s3 === "and") {
                  return t4 && r4;
                } else {
                  return t4 || r4;
                }
              }, evaluate: function(e3) {
                return t3.unifiedEval(this, e3);
              } };
              i2 = r3.matchToken("and") || r3.matchToken("or");
            }
            return n2;
          });
          t2.addGrammarElement("logicalExpression", function(e2, t3, r3) {
            return e2.parseAnyOf(["logicalOperator", "mathExpression"], r3);
          });
          t2.addGrammarElement("asyncExpression", function(e2, t3, r3) {
            if (r3.matchToken("async")) {
              var n2 = e2.requireElement("logicalExpression", r3);
              var i2 = { type: "asyncExpression", value: n2, evaluate: function(e3) {
                return { asyncWrapper: true, value: this.value.evaluate(e3) };
              } };
              return i2;
            } else {
              return e2.parseElement("logicalExpression", r3);
            }
          });
          t2.addGrammarElement("expression", function(e2, t3, r3) {
            r3.matchToken("the");
            return e2.parseElement("asyncExpression", r3);
          });
          t2.addGrammarElement("assignableExpression", function(e2, t3, r3) {
            r3.matchToken("the");
            var n2 = e2.parseElement("primaryExpression", r3);
            if (n2 && (n2.type === "symbol" || n2.type === "ofExpression" || n2.type === "propertyAccess" || n2.type === "attributeRefAccess" || n2.type === "attributeRef" || n2.type === "styleRef" || n2.type === "arrayIndex" || n2.type === "possessive")) {
              return n2;
            } else {
              e2.raiseParseError(r3, "A target expression must be writable.  The expression type '" + (n2 && n2.type) + "' is not.");
            }
            return n2;
          });
          t2.addGrammarElement("hyperscript", function(e2, t3, r3) {
            var n2 = [];
            if (r3.hasMore()) {
              while (e2.featureStart(r3.currentToken()) || r3.currentToken().value === "(") {
                var i2 = e2.requireElement("feature", r3);
                n2.push(i2);
                r3.matchToken("end");
              }
            }
            return { type: "hyperscript", features: n2, apply: function(e3, t4, r4) {
              for (const i3 of n2) {
                i3.install(e3, t4, r4);
              }
            } };
          });
          var v2 = function(e2) {
            var t3 = [];
            if (e2.token(0).value === "(" && (e2.token(1).value === ")" || e2.token(2).value === "," || e2.token(2).value === ")")) {
              e2.matchOpToken("(");
              do {
                t3.push(e2.requireTokenType("IDENTIFIER"));
              } while (e2.matchOpToken(","));
              e2.requireOpToken(")");
            }
            return t3;
          };
          t2.addFeature("on", function(e2, t3, r3) {
            if (!r3.matchToken("on"))
              return;
            var n2 = false;
            if (r3.matchToken("every")) {
              n2 = true;
            }
            var i2 = [];
            var a3 = null;
            do {
              var o2 = e2.requireElement("eventName", r3, "Expected event name");
              var s3 = o2.evaluate();
              if (a3) {
                a3 = a3 + " or " + s3;
              } else {
                a3 = "on " + s3;
              }
              var u3 = v2(r3);
              var l3 = null;
              if (r3.matchOpToken("[")) {
                l3 = e2.requireElement("expression", r3);
                r3.requireOpToken("]");
              }
              var c3, f3, m2;
              if (r3.currentToken().type === "NUMBER") {
                var p3 = r3.consumeToken();
                if (!p3.value)
                  return;
                c3 = parseInt(p3.value);
                if (r3.matchToken("to")) {
                  var h2 = r3.consumeToken();
                  if (!h2.value)
                    return;
                  f3 = parseInt(h2.value);
                } else if (r3.matchToken("and")) {
                  m2 = true;
                  r3.requireToken("on");
                }
              }
              var d3, E2;
              if (s3 === "intersection") {
                d3 = {};
                if (r3.matchToken("with")) {
                  d3["with"] = e2.requireElement("expression", r3).evaluate();
                }
                if (r3.matchToken("having")) {
                  do {
                    if (r3.matchToken("margin")) {
                      d3["rootMargin"] = e2.requireElement("stringLike", r3).evaluate();
                    } else if (r3.matchToken("threshold")) {
                      d3["threshold"] = e2.requireElement("expression", r3).evaluate();
                    } else {
                      e2.raiseParseError(r3, "Unknown intersection config specification");
                    }
                  } while (r3.matchToken("and"));
                }
              } else if (s3 === "mutation") {
                E2 = {};
                if (r3.matchToken("of")) {
                  do {
                    if (r3.matchToken("anything")) {
                      E2["attributes"] = true;
                      E2["subtree"] = true;
                      E2["characterData"] = true;
                      E2["childList"] = true;
                    } else if (r3.matchToken("childList")) {
                      E2["childList"] = true;
                    } else if (r3.matchToken("attributes")) {
                      E2["attributes"] = true;
                      E2["attributeOldValue"] = true;
                    } else if (r3.matchToken("subtree")) {
                      E2["subtree"] = true;
                    } else if (r3.matchToken("characterData")) {
                      E2["characterData"] = true;
                      E2["characterDataOldValue"] = true;
                    } else if (r3.currentToken().type === "ATTRIBUTE_REF") {
                      var T3 = r3.consumeToken();
                      if (E2["attributeFilter"] == null) {
                        E2["attributeFilter"] = [];
                      }
                      if (T3.value.indexOf("@") == 0) {
                        E2["attributeFilter"].push(T3.value.substring(1));
                      } else {
                        e2.raiseParseError(r3, "Only shorthand attribute references are allowed here");
                      }
                    } else {
                      e2.raiseParseError(r3, "Unknown mutation config specification");
                    }
                  } while (r3.matchToken("or"));
                } else {
                  E2["attributes"] = true;
                  E2["characterData"] = true;
                  E2["childList"] = true;
                }
              }
              var y3 = null;
              var k3 = false;
              if (r3.matchToken("from")) {
                if (r3.matchToken("elsewhere")) {
                  k3 = true;
                } else {
                  r3.pushFollow("or");
                  try {
                    y3 = e2.requireElement("expression", r3);
                  } finally {
                    r3.popFollow();
                  }
                  if (!y3) {
                    e2.raiseParseError(r3, 'Expected either target value or "elsewhere".');
                  }
                }
              }
              if (y3 === null && k3 === false && r3.matchToken("elsewhere")) {
                k3 = true;
              }
              if (r3.matchToken("in")) {
                var x3 = e2.parseElement("unaryExpression", r3);
              }
              if (r3.matchToken("debounced")) {
                r3.requireToken("at");
                var g3 = e2.requireElement("unaryExpression", r3);
                var b3 = g3.evaluate({});
              } else if (r3.matchToken("throttled")) {
                r3.requireToken("at");
                var g3 = e2.requireElement("unaryExpression", r3);
                var w3 = g3.evaluate({});
              }
              i2.push({ execCount: 0, every: n2, on: s3, args: u3, filter: l3, from: y3, inExpr: x3, elsewhere: k3, startCount: c3, endCount: f3, unbounded: m2, debounceTime: b3, throttleTime: w3, mutationSpec: E2, intersectionSpec: d3, debounced: void 0, lastExec: void 0 });
            } while (r3.matchToken("or"));
            var S3 = true;
            if (!n2) {
              if (r3.matchToken("queue")) {
                if (r3.matchToken("all")) {
                  var q = true;
                  var S3 = false;
                } else if (r3.matchToken("first")) {
                  var N = true;
                } else if (r3.matchToken("none")) {
                  var C = true;
                } else {
                  r3.requireToken("last");
                }
              }
            }
            var I = e2.requireElement("commandList", r3);
            e2.ensureTerminated(I);
            var R, A;
            if (r3.matchToken("catch")) {
              R = r3.requireTokenType("IDENTIFIER").value;
              A = e2.requireElement("commandList", r3);
              e2.ensureTerminated(A);
            }
            if (r3.matchToken("finally")) {
              var O = e2.requireElement("commandList", r3);
              e2.ensureTerminated(O);
            }
            var L = { displayName: a3, events: i2, start: I, every: n2, execCount: 0, errorHandler: A, errorSymbol: R, execute: function(e3) {
              let r4 = t3.getEventQueueFor(e3.me, L);
              if (r4.executing && n2 === false) {
                if (C || N && r4.queue.length > 0) {
                  return;
                }
                if (S3) {
                  r4.queue.length = 0;
                }
                r4.queue.push(e3);
                return;
              }
              L.execCount++;
              r4.executing = true;
              e3.meta.onHalt = function() {
                r4.executing = false;
                var e4 = r4.queue.shift();
                if (e4) {
                  setTimeout(function() {
                    L.execute(e4);
                  }, 1);
                }
              };
              e3.meta.reject = function(r5) {
                console.error(r5.message ? r5.message : r5);
                var n3 = t3.getHyperTrace(e3, r5);
                if (n3) {
                  n3.print();
                }
                t3.triggerEvent(e3.me, "exception", { error: r5 });
              };
              I.execute(e3);
            }, install: function(e3, r4) {
              for (const r5 of L.events) {
                var n3;
                if (r5.elsewhere) {
                  n3 = [document];
                } else if (r5.from) {
                  n3 = r5.from.evaluate(t3.makeContext(e3, L, e3, null));
                } else {
                  n3 = [e3];
                }
                t3.implicitLoop(n3, function(n4) {
                  var i3 = r5.on;
                  if (n4 == null) {
                    console.warn("'%s' feature ignored because target does not exists:", a3, e3);
                    return;
                  }
                  if (r5.mutationSpec) {
                    i3 = "hyperscript:mutation";
                    const e4 = new MutationObserver(function(e5, r6) {
                      if (!L.executing) {
                        t3.triggerEvent(n4, i3, { mutationList: e5, observer: r6 });
                      }
                    });
                    e4.observe(n4, r5.mutationSpec);
                  }
                  if (r5.intersectionSpec) {
                    i3 = "hyperscript:intersection";
                    const e4 = new IntersectionObserver(function(r6) {
                      for (const o4 of r6) {
                        var a4 = { observer: e4 };
                        a4 = Object.assign(a4, o4);
                        a4["intersecting"] = o4.isIntersecting;
                        t3.triggerEvent(n4, i3, a4);
                      }
                    }, r5.intersectionSpec);
                    e4.observe(n4);
                  }
                  var o3 = n4.addEventListener || n4.on;
                  o3.call(n4, i3, function a4(o4) {
                    if (typeof Node !== "undefined" && e3 instanceof Node && n4 !== e3 && !e3.isConnected) {
                      n4.removeEventListener(i3, a4);
                      return;
                    }
                    var s4 = t3.makeContext(e3, L, e3, o4);
                    if (r5.elsewhere && e3.contains(o4.target)) {
                      return;
                    }
                    if (r5.from) {
                      s4.result = n4;
                    }
                    for (const e4 of r5.args) {
                      let t4 = s4.event[e4.value];
                      if (t4 !== void 0) {
                        s4.locals[e4.value] = t4;
                      } else if ("detail" in s4.event) {
                        s4.locals[e4.value] = s4.event["detail"][e4.value];
                      }
                    }
                    s4.meta.errorHandler = A;
                    s4.meta.errorSymbol = R;
                    s4.meta.finallyHandler = O;
                    if (r5.filter) {
                      var u4 = s4.meta.context;
                      s4.meta.context = s4.event;
                      try {
                        var l4 = r5.filter.evaluate(s4);
                        if (l4) {
                        } else {
                          return;
                        }
                      } finally {
                        s4.meta.context = u4;
                      }
                    }
                    if (r5.inExpr) {
                      var c4 = o4.target;
                      while (true) {
                        if (c4.matches && c4.matches(r5.inExpr.css)) {
                          s4.result = c4;
                          break;
                        } else {
                          c4 = c4.parentElement;
                          if (c4 == null) {
                            return;
                          }
                        }
                      }
                    }
                    r5.execCount++;
                    if (r5.startCount) {
                      if (r5.endCount) {
                        if (r5.execCount < r5.startCount || r5.execCount > r5.endCount) {
                          return;
                        }
                      } else if (r5.unbounded) {
                        if (r5.execCount < r5.startCount) {
                          return;
                        }
                      } else if (r5.execCount !== r5.startCount) {
                        return;
                      }
                    }
                    if (r5.debounceTime) {
                      if (r5.debounced) {
                        clearTimeout(r5.debounced);
                      }
                      r5.debounced = setTimeout(function() {
                        L.execute(s4);
                      }, r5.debounceTime);
                      return;
                    }
                    if (r5.throttleTime) {
                      if (r5.lastExec && Date.now() < r5.lastExec + r5.throttleTime) {
                        return;
                      } else {
                        r5.lastExec = Date.now();
                      }
                    }
                    L.execute(s4);
                  });
                });
              }
            } };
            e2.setParent(I, L);
            return L;
          });
          t2.addFeature("def", function(e2, t3, r3) {
            if (!r3.matchToken("def"))
              return;
            var n2 = e2.requireElement("dotOrColonPath", r3);
            var i2 = n2.evaluate();
            var a3 = i2.split(".");
            var o2 = a3.pop();
            var s3 = [];
            if (r3.matchOpToken("(")) {
              if (r3.matchOpToken(")")) {
              } else {
                do {
                  s3.push(r3.requireTokenType("IDENTIFIER"));
                } while (r3.matchOpToken(","));
                r3.requireOpToken(")");
              }
            }
            var u3 = e2.requireElement("commandList", r3);
            var l3, c3;
            if (r3.matchToken("catch")) {
              l3 = r3.requireTokenType("IDENTIFIER").value;
              c3 = e2.parseElement("commandList", r3);
            }
            if (r3.matchToken("finally")) {
              var f3 = e2.requireElement("commandList", r3);
              e2.ensureTerminated(f3);
            }
            var m2 = { displayName: o2 + "(" + s3.map(function(e3) {
              return e3.value;
            }).join(", ") + ")", name: o2, args: s3, start: u3, errorHandler: c3, errorSymbol: l3, finallyHandler: f3, install: function(e3, r4) {
              var n3 = function() {
                var n4 = t3.makeContext(r4, m2, e3, null);
                n4.meta.errorHandler = c3;
                n4.meta.errorSymbol = l3;
                n4.meta.finallyHandler = f3;
                for (var i3 = 0; i3 < s3.length; i3++) {
                  var a4 = s3[i3];
                  var o3 = arguments[i3];
                  if (a4) {
                    n4.locals[a4.value] = o3;
                  }
                }
                n4.meta.caller = arguments[s3.length];
                if (n4.meta.caller) {
                  n4.meta.callingCommand = n4.meta.caller.meta.command;
                }
                var p3, h2 = null;
                var v3 = new Promise(function(e4, t4) {
                  p3 = e4;
                  h2 = t4;
                });
                u3.execute(n4);
                if (n4.meta.returned) {
                  return n4.meta.returnValue;
                } else {
                  n4.meta.resolve = p3;
                  n4.meta.reject = h2;
                  return v3;
                }
              };
              n3.hyperfunc = true;
              n3.hypername = i2;
              t3.assignToNamespace(e3, a3, o2, n3);
            } };
            e2.ensureTerminated(u3);
            if (c3) {
              e2.ensureTerminated(c3);
            }
            e2.setParent(u3, m2);
            return m2;
          });
          t2.addFeature("set", function(e2, t3, r3) {
            let n2 = e2.parseElement("setCommand", r3);
            if (n2) {
              if (n2.target.scope !== "element") {
                e2.raiseParseError(r3, "variables declared at the feature level must be element scoped.");
              }
              let i2 = { start: n2, install: function(e3, r4) {
                n2 && n2.execute(t3.makeContext(e3, i2, e3, null));
              } };
              e2.ensureTerminated(n2);
              return i2;
            }
          });
          t2.addFeature("init", function(e2, t3, r3) {
            if (!r3.matchToken("init"))
              return;
            var n2 = r3.matchToken("immediately");
            var i2 = e2.requireElement("commandList", r3);
            var a3 = { start: i2, install: function(e3, r4) {
              let o2 = function() {
                i2 && i2.execute(t3.makeContext(e3, a3, e3, null));
              };
              if (n2) {
                o2();
              } else {
                setTimeout(o2, 0);
              }
            } };
            e2.ensureTerminated(i2);
            e2.setParent(i2, a3);
            return a3;
          });
          t2.addFeature("worker", function(e2, t3, r3) {
            if (r3.matchToken("worker")) {
              e2.raiseParseError(r3, "In order to use the 'worker' feature, include the _hyperscript worker plugin. See https://hyperscript.org/features/worker/ for more info.");
              return void 0;
            }
          });
          t2.addFeature("behavior", function(t3, r3, n2) {
            if (!n2.matchToken("behavior"))
              return;
            var i2 = t3.requireElement("dotOrColonPath", n2).evaluate();
            var a3 = i2.split(".");
            var o2 = a3.pop();
            var s3 = [];
            if (n2.matchOpToken("(") && !n2.matchOpToken(")")) {
              do {
                s3.push(n2.requireTokenType("IDENTIFIER").value);
              } while (n2.matchOpToken(","));
              n2.requireOpToken(")");
            }
            var u3 = t3.requireElement("hyperscript", n2);
            for (var l3 = 0; l3 < u3.features.length; l3++) {
              var c3 = u3.features[l3];
              c3.behavior = i2;
            }
            return { install: function(t4, n3) {
              r3.assignToNamespace(e.document && e.document.body, a3, o2, function(e2, t5, n4) {
                var a4 = r3.getInternalData(e2);
                var o3 = h(a4, i2 + "Scope");
                for (var l4 = 0; l4 < s3.length; l4++) {
                  o3[s3[l4]] = n4[s3[l4]];
                }
                u3.apply(e2, t5);
              });
            } };
          });
          t2.addFeature("install", function(t3, r3, n2) {
            if (!n2.matchToken("install"))
              return;
            var i2 = t3.requireElement("dotOrColonPath", n2).evaluate();
            var a3 = i2.split(".");
            var o2 = t3.parseElement("namedArgumentList", n2);
            var s3;
            return s3 = { install: function(t4, n3) {
              r3.unifiedEval({ args: [o2], op: function(r4, o3) {
                var s4 = e;
                for (var u3 = 0; u3 < a3.length; u3++) {
                  s4 = s4[a3[u3]];
                  if (typeof s4 !== "object" && typeof s4 !== "function")
                    throw new Error("No such behavior defined as " + i2);
                }
                if (!(s4 instanceof Function))
                  throw new Error(i2 + " is not a behavior");
                s4(t4, n3, o3);
              } }, r3.makeContext(t4, s3, t4, null));
            } };
          });
          t2.addGrammarElement("jsBody", function(e2, t3, r3) {
            var n2 = r3.currentToken().start;
            var i2 = r3.currentToken();
            var a3 = [];
            var o2 = "";
            var s3 = false;
            while (r3.hasMore()) {
              i2 = r3.consumeToken();
              var u3 = r3.token(0, true);
              if (u3.type === "IDENTIFIER" && u3.value === "end") {
                break;
              }
              if (s3) {
                if (i2.type === "IDENTIFIER" || i2.type === "NUMBER") {
                  o2 += i2.value;
                } else {
                  if (o2 !== "")
                    a3.push(o2);
                  o2 = "";
                  s3 = false;
                }
              } else if (i2.type === "IDENTIFIER" && i2.value === "function") {
                s3 = true;
              }
            }
            var l3 = i2.end + 1;
            return { type: "jsBody", exposedFunctionNames: a3, jsSource: r3.source.substring(n2, l3) };
          });
          t2.addFeature("js", function(t3, r3, n2) {
            if (!n2.matchToken("js"))
              return;
            var i2 = t3.requireElement("jsBody", n2);
            var a3 = i2.jsSource + "\nreturn { " + i2.exposedFunctionNames.map(function(e2) {
              return e2 + ":" + e2;
            }).join(",") + " } ";
            var o2 = new Function(a3);
            return { jsSource: a3, function: o2, exposedFunctionNames: i2.exposedFunctionNames, install: function() {
              Object.assign(e, o2());
            } };
          });
          t2.addCommand("js", function(t3, r3, n2) {
            if (!n2.matchToken("js"))
              return;
            var i2 = [];
            if (n2.matchOpToken("(")) {
              if (n2.matchOpToken(")")) {
              } else {
                do {
                  var a3 = n2.requireTokenType("IDENTIFIER");
                  i2.push(a3.value);
                } while (n2.matchOpToken(","));
                n2.requireOpToken(")");
              }
            }
            var o2 = t3.requireElement("jsBody", n2);
            n2.matchToken("end");
            var s3 = E(Function, i2.concat([o2.jsSource]));
            var u3 = { jsSource: o2.jsSource, function: s3, inputs: i2, op: function(t4) {
              var n3 = [];
              i2.forEach(function(e2) {
                n3.push(r3.resolveSymbol(e2, t4, "default"));
              });
              var a4 = s3.apply(e, n3);
              if (a4 && typeof a4.then === "function") {
                return new Promise(function(e2) {
                  a4.then(function(n4) {
                    t4.result = n4;
                    e2(r3.findNext(this, t4));
                  });
                });
              } else {
                t4.result = a4;
                return r3.findNext(this, t4);
              }
            } };
            return u3;
          });
          t2.addCommand("async", function(e2, t3, r3) {
            if (!r3.matchToken("async"))
              return;
            if (r3.matchToken("do")) {
              var n2 = e2.requireElement("commandList", r3);
              var i2 = n2;
              while (i2.next)
                i2 = i2.next;
              i2.next = t3.HALT;
              r3.requireToken("end");
            } else {
              var n2 = e2.requireElement("command", r3);
            }
            var a3 = { body: n2, op: function(e3) {
              setTimeout(function() {
                n2.execute(e3);
              });
              return t3.findNext(this, e3);
            } };
            e2.setParent(n2, a3);
            return a3;
          });
          t2.addCommand("tell", function(e2, t3, r3) {
            var n2 = r3.currentToken();
            if (!r3.matchToken("tell"))
              return;
            var i2 = e2.requireElement("expression", r3);
            var a3 = e2.requireElement("commandList", r3);
            if (r3.hasMore() && !e2.featureStart(r3.currentToken())) {
              r3.requireToken("end");
            }
            var o2 = "tell_" + n2.start;
            var s3 = { value: i2, body: a3, args: [i2], resolveNext: function(e3) {
              var r4 = e3.meta.iterators[o2];
              if (r4.index < r4.value.length) {
                e3.you = r4.value[r4.index++];
                return a3;
              } else {
                e3.you = r4.originalYou;
                if (this.next) {
                  return this.next;
                } else {
                  return t3.findNext(this.parent, e3);
                }
              }
            }, op: function(e3, t4) {
              if (t4 == null) {
                t4 = [];
              } else if (!(Array.isArray(t4) || t4 instanceof NodeList)) {
                t4 = [t4];
              }
              e3.meta.iterators[o2] = { originalYou: e3.you, index: 0, value: t4 };
              return this.resolveNext(e3);
            } };
            e2.setParent(a3, s3);
            return s3;
          });
          t2.addCommand("wait", function(e2, t3, r3) {
            if (!r3.matchToken("wait"))
              return;
            var n2;
            if (r3.matchToken("for")) {
              r3.matchToken("a");
              var i2 = [];
              do {
                var a3 = r3.token(0);
                if (a3.type === "NUMBER" || a3.type === "L_PAREN") {
                  i2.push({ time: e2.requireElement("expression", r3).evaluate() });
                } else {
                  i2.push({ name: e2.requireElement("dotOrColonPath", r3, "Expected event name").evaluate(), args: v2(r3) });
                }
              } while (r3.matchToken("or"));
              if (r3.matchToken("from")) {
                var o2 = e2.requireElement("expression", r3);
              }
              n2 = { event: i2, on: o2, args: [o2], op: function(e3, r4) {
                var n3 = r4 ? r4 : e3.me;
                if (!(n3 instanceof EventTarget))
                  throw new Error("Not a valid event target: " + this.on.sourceFor());
                return new Promise((r5) => {
                  var a4 = false;
                  for (const s4 of i2) {
                    var o3 = (n4) => {
                      e3.result = n4;
                      if (s4.args) {
                        for (const t4 of s4.args) {
                          e3.locals[t4.value] = n4[t4.value] || (n4.detail ? n4.detail[t4.value] : null);
                        }
                      }
                      if (!a4) {
                        a4 = true;
                        r5(t3.findNext(this, e3));
                      }
                    };
                    if (s4.name) {
                      n3.addEventListener(s4.name, o3, { once: true });
                    } else if (s4.time != null) {
                      setTimeout(o3, s4.time, s4.time);
                    }
                  }
                });
              } };
              return n2;
            } else {
              var s3;
              if (r3.matchToken("a")) {
                r3.requireToken("tick");
                s3 = 0;
              } else {
                s3 = e2.requireElement("expression", r3);
              }
              n2 = { type: "waitCmd", time: s3, args: [s3], op: function(e3, r4) {
                return new Promise((n3) => {
                  setTimeout(() => {
                    n3(t3.findNext(this, e3));
                  }, r4);
                });
              }, execute: function(e3) {
                return t3.unifiedExec(this, e3);
              } };
              return n2;
            }
          });
          t2.addGrammarElement("dotOrColonPath", function(e2, t3, r3) {
            var n2 = r3.matchTokenType("IDENTIFIER");
            if (n2) {
              var i2 = [n2.value];
              var a3 = r3.matchOpToken(".") || r3.matchOpToken(":");
              if (a3) {
                do {
                  i2.push(r3.requireTokenType("IDENTIFIER", "NUMBER").value);
                } while (r3.matchOpToken(a3.value));
              }
              return { type: "dotOrColonPath", path: i2, evaluate: function() {
                return i2.join(a3 ? a3.value : "");
              } };
            }
          });
          t2.addGrammarElement("eventName", function(e2, t3, r3) {
            var n2;
            if (n2 = r3.matchTokenType("STRING")) {
              return { evaluate: function() {
                return n2.value;
              } };
            }
            return e2.parseElement("dotOrColonPath", r3);
          });
          function d2(e2, t3, r3, n2) {
            var i2 = t3.requireElement("eventName", n2);
            var a3 = t3.parseElement("namedArgumentList", n2);
            if (e2 === "send" && n2.matchToken("to") || e2 === "trigger" && n2.matchToken("on")) {
              var o2 = t3.requireElement("expression", n2);
            } else {
              var o2 = t3.requireElement("implicitMeTarget", n2);
            }
            var s3 = { eventName: i2, details: a3, to: o2, args: [o2, i2, a3], op: function(e3, t4, n3, i3) {
              r3.nullCheck(t4, o2);
              r3.implicitLoop(t4, function(t5) {
                r3.triggerEvent(t5, n3, i3, e3.me);
              });
              return r3.findNext(s3, e3);
            } };
            return s3;
          }
          t2.addCommand("trigger", function(e2, t3, r3) {
            if (r3.matchToken("trigger")) {
              return d2("trigger", e2, t3, r3);
            }
          });
          t2.addCommand("send", function(e2, t3, r3) {
            if (r3.matchToken("send")) {
              return d2("send", e2, t3, r3);
            }
          });
          var T2 = function(e2, t3, r3, n2) {
            if (n2) {
              if (e2.commandBoundary(r3.currentToken())) {
                e2.raiseParseError(r3, "'return' commands must return a value.  If you do not wish to return a value, use 'exit' instead.");
              } else {
                var i2 = e2.requireElement("expression", r3);
              }
            }
            var a3 = { value: i2, args: [i2], op: function(e3, r4) {
              var n3 = e3.meta.resolve;
              e3.meta.returned = true;
              e3.meta.returnValue = r4;
              if (n3) {
                if (r4) {
                  n3(r4);
                } else {
                  n3();
                }
              }
              return t3.HALT;
            } };
            return a3;
          };
          t2.addCommand("return", function(e2, t3, r3) {
            if (r3.matchToken("return")) {
              return T2(e2, t3, r3, true);
            }
          });
          t2.addCommand("exit", function(e2, t3, r3) {
            if (r3.matchToken("exit")) {
              return T2(e2, t3, r3, false);
            }
          });
          t2.addCommand("halt", function(e2, t3, r3) {
            if (r3.matchToken("halt")) {
              if (r3.matchToken("the")) {
                r3.requireToken("event");
                if (r3.matchOpToken("'")) {
                  r3.requireToken("s");
                }
                var n2 = true;
              }
              if (r3.matchToken("bubbling")) {
                var i2 = true;
              } else if (r3.matchToken("default")) {
                var a3 = true;
              }
              var o2 = T2(e2, t3, r3, false);
              var s3 = { keepExecuting: true, bubbling: i2, haltDefault: a3, exit: o2, op: function(e3) {
                if (e3.event) {
                  if (i2) {
                    e3.event.stopPropagation();
                  } else if (a3) {
                    e3.event.preventDefault();
                  } else {
                    e3.event.stopPropagation();
                    e3.event.preventDefault();
                  }
                  if (n2) {
                    return t3.findNext(this, e3);
                  } else {
                    return o2;
                  }
                }
              } };
              return s3;
            }
          });
          t2.addCommand("log", function(e2, t3, r3) {
            if (!r3.matchToken("log"))
              return;
            var n2 = [e2.parseElement("expression", r3)];
            while (r3.matchOpToken(",")) {
              n2.push(e2.requireElement("expression", r3));
            }
            if (r3.matchToken("with")) {
              var i2 = e2.requireElement("expression", r3);
            }
            var a3 = { exprs: n2, withExpr: i2, args: [i2, n2], op: function(e3, r4, n3) {
              if (r4) {
                r4.apply(null, n3);
              } else {
                console.log.apply(null, n3);
              }
              return t3.findNext(this, e3);
            } };
            return a3;
          });
          t2.addCommand("beep!", function(e2, t3, r3) {
            if (!r3.matchToken("beep!"))
              return;
            var n2 = [e2.parseElement("expression", r3)];
            while (r3.matchOpToken(",")) {
              n2.push(e2.requireElement("expression", r3));
            }
            var i2 = { exprs: n2, args: [n2], op: function(e3, r4) {
              for (let i3 = 0; i3 < n2.length; i3++) {
                const a3 = n2[i3];
                const o2 = r4[i3];
                t3.beepValueToConsole(e3.me, a3, o2);
              }
              return t3.findNext(this, e3);
            } };
            return i2;
          });
          t2.addCommand("throw", function(e2, t3, r3) {
            if (!r3.matchToken("throw"))
              return;
            var n2 = e2.requireElement("expression", r3);
            var i2 = { expr: n2, args: [n2], op: function(e3, r4) {
              t3.registerHyperTrace(e3, r4);
              throw r4;
            } };
            return i2;
          });
          var y2 = function(e2, t3, r3) {
            var n2 = e2.requireElement("expression", r3);
            var i2 = { expr: n2, args: [n2], op: function(e3, r4) {
              e3.result = r4;
              return t3.findNext(i2, e3);
            } };
            return i2;
          };
          t2.addCommand("call", function(e2, t3, r3) {
            if (!r3.matchToken("call"))
              return;
            var n2 = y2(e2, t3, r3);
            if (n2.expr && n2.expr.type !== "functionCall") {
              e2.raiseParseError(r3, "Must be a function invocation");
            }
            return n2;
          });
          t2.addCommand("get", function(e2, t3, r3) {
            if (r3.matchToken("get")) {
              return y2(e2, t3, r3);
            }
          });
          t2.addCommand("make", function(e2, t3, r3) {
            if (!r3.matchToken("make"))
              return;
            r3.matchToken("a") || r3.matchToken("an");
            var n2 = e2.requireElement("expression", r3);
            var i2 = [];
            if (n2.type !== "queryRef" && r3.matchToken("from")) {
              do {
                i2.push(e2.requireElement("expression", r3));
              } while (r3.matchOpToken(","));
            }
            if (r3.matchToken("called")) {
              var a3 = e2.requireElement("symbol", r3);
            }
            var o2;
            if (n2.type === "queryRef") {
              o2 = { op: function(e3) {
                var r4, i3 = "div", o3, s3 = [];
                var u3 = /(?:(^|#|\.)([^#\. ]+))/g;
                while (r4 = u3.exec(n2.css)) {
                  if (r4[1] === "")
                    i3 = r4[2].trim();
                  else if (r4[1] === "#")
                    o3 = r4[2].trim();
                  else
                    s3.push(r4[2].trim());
                }
                var l3 = document.createElement(i3);
                if (o3 !== void 0)
                  l3.id = o3;
                for (var c3 = 0; c3 < s3.length; c3++) {
                  var f3 = s3[c3];
                  l3.classList.add(f3);
                }
                e3.result = l3;
                if (a3) {
                  t3.setSymbol(a3.name, e3, a3.scope, l3);
                }
                return t3.findNext(this, e3);
              } };
              return o2;
            } else {
              o2 = { args: [n2, i2], op: function(e3, r4, n3) {
                e3.result = E(r4, n3);
                if (a3) {
                  t3.setSymbol(a3.name, e3, a3.scope, e3.result);
                }
                return t3.findNext(this, e3);
              } };
              return o2;
            }
          });
          t2.addGrammarElement("pseudoCommand", function(e2, t3, r3) {
            let n2 = r3.token(1);
            if (!(n2 && n2.op && (n2.value === "." || n2.value === "("))) {
              return null;
            }
            var i2 = e2.requireElement("primaryExpression", r3);
            var a3 = i2.root;
            var o2 = i2;
            while (a3.root != null) {
              o2 = o2.root;
              a3 = a3.root;
            }
            if (i2.type !== "functionCall") {
              e2.raiseParseError(r3, "Pseudo-commands must be function calls");
            }
            if (o2.type === "functionCall" && o2.root.root == null) {
              if (r3.matchAnyToken("the", "to", "on", "with", "into", "from", "at")) {
                var s3 = e2.requireElement("expression", r3);
              } else if (r3.matchToken("me")) {
                var s3 = e2.requireElement("implicitMeTarget", r3);
              }
            }
            var u3;
            if (s3) {
              u3 = { type: "pseudoCommand", root: s3, argExressions: o2.argExressions, args: [s3, o2.argExressions], op: function(e3, r4, n3) {
                t3.nullCheck(r4, s3);
                var i3 = r4[o2.root.name];
                t3.nullCheck(i3, o2);
                if (i3.hyperfunc) {
                  n3.push(e3);
                }
                e3.result = i3.apply(r4, n3);
                return t3.findNext(u3, e3);
              }, execute: function(e3) {
                return t3.unifiedExec(this, e3);
              } };
            } else {
              u3 = { type: "pseudoCommand", expr: i2, args: [i2], op: function(e3, r4) {
                e3.result = r4;
                return t3.findNext(u3, e3);
              }, execute: function(e3) {
                return t3.unifiedExec(this, e3);
              } };
            }
            return u3;
          });
          var k2 = function(e2, t3, r3, n2, i2) {
            var a3 = n2.type === "symbol";
            var o2 = n2.type === "attributeRef";
            var s3 = n2.type === "styleRef";
            var u3 = n2.type === "arrayIndex";
            if (!(o2 || s3 || a3) && n2.root == null) {
              e2.raiseParseError(r3, "Can only put directly into symbols, not references");
            }
            var l3 = null;
            var c3 = null;
            if (a3) {
            } else if (o2 || s3) {
              l3 = e2.requireElement("implicitMeTarget", r3);
              var f3 = n2;
            } else if (u3) {
              c3 = n2.firstIndex;
              l3 = n2.root;
            } else {
              c3 = n2.prop ? n2.prop.value : null;
              var f3 = n2.attribute;
              l3 = n2.root;
            }
            var m2 = { target: n2, symbolWrite: a3, value: i2, args: [l3, c3, i2], op: function(e3, r4, i3, o3) {
              if (a3) {
                t3.setSymbol(n2.name, e3, n2.scope, o3);
              } else {
                t3.nullCheck(r4, l3);
                if (u3) {
                  r4[i3] = o3;
                } else {
                  t3.implicitLoop(r4, function(e4) {
                    if (f3) {
                      if (f3.type === "attributeRef") {
                        if (o3 == null) {
                          e4.removeAttribute(f3.name);
                        } else {
                          e4.setAttribute(f3.name, o3);
                        }
                      } else {
                        e4.style[f3.name] = o3;
                      }
                    } else {
                      e4[i3] = o3;
                    }
                  });
                }
              }
              return t3.findNext(this, e3);
            } };
            return m2;
          };
          t2.addCommand("default", function(e2, t3, r3) {
            if (!r3.matchToken("default"))
              return;
            var n2 = e2.requireElement("assignableExpression", r3);
            r3.requireToken("to");
            var i2 = e2.requireElement("expression", r3);
            var a3 = k2(e2, t3, r3, n2, i2);
            var o2 = { target: n2, value: i2, setter: a3, args: [n2], op: function(e3, r4) {
              if (r4) {
                return t3.findNext(this, e3);
              } else {
                return a3;
              }
            } };
            a3.parent = o2;
            return o2;
          });
          t2.addCommand("set", function(e2, t3, r3) {
            if (!r3.matchToken("set"))
              return;
            if (r3.currentToken().type === "L_BRACE") {
              var n2 = e2.requireElement("objectLiteral", r3);
              r3.requireToken("on");
              var i2 = e2.requireElement("expression", r3);
              var a3 = { objectLiteral: n2, target: i2, args: [n2, i2], op: function(e3, r4, n3) {
                Object.assign(n3, r4);
                return t3.findNext(this, e3);
              } };
              return a3;
            }
            try {
              r3.pushFollow("to");
              var i2 = e2.requireElement("assignableExpression", r3);
            } finally {
              r3.popFollow();
            }
            r3.requireToken("to");
            var o2 = e2.requireElement("expression", r3);
            return k2(e2, t3, r3, i2, o2);
          });
          t2.addCommand("if", function(e2, t3, r3) {
            if (!r3.matchToken("if"))
              return;
            var n2 = e2.requireElement("expression", r3);
            r3.matchToken("then");
            var i2 = e2.parseElement("commandList", r3);
            var a3 = false;
            let o2 = r3.matchToken("else") || r3.matchToken("otherwise");
            if (o2) {
              let t4 = r3.peekToken("if");
              a3 = t4 != null && t4.line === o2.line;
              if (a3) {
                var s3 = e2.parseElement("command", r3);
              } else {
                var s3 = e2.parseElement("commandList", r3);
              }
            }
            if (r3.hasMore() && !a3) {
              r3.requireToken("end");
            }
            var u3 = { expr: n2, trueBranch: i2, falseBranch: s3, args: [n2], op: function(e3, r4) {
              if (r4) {
                return i2;
              } else if (s3) {
                return s3;
              } else {
                return t3.findNext(this, e3);
              }
            } };
            e2.setParent(i2, u3);
            e2.setParent(s3, u3);
            return u3;
          });
          var x2 = function(e2, t3, r3, n2) {
            var i2 = t3.currentToken();
            var a3;
            if (t3.matchToken("for") || n2) {
              var o2 = t3.requireTokenType("IDENTIFIER");
              a3 = o2.value;
              t3.requireToken("in");
              var s3 = e2.requireElement("expression", t3);
            } else if (t3.matchToken("in")) {
              a3 = "it";
              var s3 = e2.requireElement("expression", t3);
            } else if (t3.matchToken("while")) {
              var u3 = e2.requireElement("expression", t3);
            } else if (t3.matchToken("until")) {
              var l3 = true;
              if (t3.matchToken("event")) {
                var c3 = e2.requireElement("dotOrColonPath", t3, "Expected event name");
                if (t3.matchToken("from")) {
                  var f3 = e2.requireElement("expression", t3);
                }
              } else {
                var u3 = e2.requireElement("expression", t3);
              }
            } else {
              if (!e2.commandBoundary(t3.currentToken()) && t3.currentToken().value !== "forever") {
                var m2 = e2.requireElement("expression", t3);
                t3.requireToken("times");
              } else {
                t3.matchToken("forever");
                var p3 = true;
              }
            }
            if (t3.matchToken("index")) {
              var o2 = t3.requireTokenType("IDENTIFIER");
              var h2 = o2.value;
            }
            var v3 = e2.parseElement("commandList", t3);
            if (v3 && c3) {
              var d3 = v3;
              while (d3.next) {
                d3 = d3.next;
              }
              var E2 = { type: "waitATick", op: function() {
                return new Promise(function(e3) {
                  setTimeout(function() {
                    e3(r3.findNext(E2));
                  }, 0);
                });
              } };
              d3.next = E2;
            }
            if (t3.hasMore()) {
              t3.requireToken("end");
            }
            if (a3 == null) {
              a3 = "_implicit_repeat_" + i2.start;
              var T3 = a3;
            } else {
              var T3 = a3 + "_" + i2.start;
            }
            var y3 = { identifier: a3, indexIdentifier: h2, slot: T3, expression: s3, forever: p3, times: m2, until: l3, event: c3, on: f3, whileExpr: u3, resolveNext: function() {
              return this;
            }, loop: v3, args: [u3, m2], op: function(e3, t4, n3) {
              var i3 = e3.meta.iterators[T3];
              var o3 = false;
              var s4 = null;
              if (this.forever) {
                o3 = true;
              } else if (this.until) {
                if (c3) {
                  o3 = e3.meta.iterators[T3].eventFired === false;
                } else {
                  o3 = t4 !== true;
                }
              } else if (u3) {
                o3 = t4;
              } else if (n3) {
                o3 = i3.index < n3;
              } else {
                var l4 = i3.iterator.next();
                o3 = !l4.done;
                s4 = l4.value;
              }
              if (o3) {
                if (i3.value) {
                  e3.result = e3.locals[a3] = s4;
                } else {
                  e3.result = i3.index;
                }
                if (h2) {
                  e3.locals[h2] = i3.index;
                }
                i3.index++;
                return v3;
              } else {
                e3.meta.iterators[T3] = null;
                return r3.findNext(this.parent, e3);
              }
            } };
            e2.setParent(v3, y3);
            var k3 = { name: "repeatInit", args: [s3, c3, f3], op: function(e3, t4, r4, n3) {
              var i3 = { index: 0, value: t4, eventFired: false };
              e3.meta.iterators[T3] = i3;
              if (t4 && t4[Symbol.iterator]) {
                i3.iterator = t4[Symbol.iterator]();
              }
              if (c3) {
                var a4 = n3 || e3.me;
                a4.addEventListener(r4, function(t5) {
                  e3.meta.iterators[T3].eventFired = true;
                }, { once: true });
              }
              return y3;
            }, execute: function(e3) {
              return r3.unifiedExec(this, e3);
            } };
            e2.setParent(y3, k3);
            return k3;
          };
          t2.addCommand("repeat", function(e2, t3, r3) {
            if (r3.matchToken("repeat")) {
              return x2(e2, r3, t3, false);
            }
          });
          t2.addCommand("for", function(e2, t3, r3) {
            if (r3.matchToken("for")) {
              return x2(e2, r3, t3, true);
            }
          });
          t2.addCommand("continue", function(e2, t3, r3) {
            if (!r3.matchToken("continue"))
              return;
            var n2 = { op: function(t4) {
              for (var n3 = this.parent; true; n3 = n3.parent) {
                if (n3 == void 0) {
                  e2.raiseParseError(r3, "Command `continue` cannot be used outside of a `repeat` loop.");
                }
                if (n3.loop != void 0) {
                  return n3.resolveNext(t4);
                }
              }
            } };
            return n2;
          });
          t2.addCommand("break", function(e2, t3, r3) {
            if (!r3.matchToken("break"))
              return;
            var n2 = { op: function(n3) {
              for (var i2 = this.parent; true; i2 = i2.parent) {
                if (i2 == void 0) {
                  e2.raiseParseError(r3, "Command `continue` cannot be used outside of a `repeat` loop.");
                }
                if (i2.loop != void 0) {
                  return t3.findNext(i2.parent, n3);
                }
              }
            } };
            return n2;
          });
          t2.addGrammarElement("stringLike", function(e2, t3, r3) {
            return e2.parseAnyOf(["string", "nakedString"], r3);
          });
          t2.addCommand("append", function(e2, t3, r3) {
            if (!r3.matchToken("append"))
              return;
            var n2 = null;
            var i2 = e2.requireElement("expression", r3);
            var a3 = { type: "symbol", evaluate: function(e3) {
              return t3.resolveSymbol("result", e3);
            } };
            if (r3.matchToken("to")) {
              n2 = e2.requireElement("expression", r3);
            } else {
              n2 = a3;
            }
            var o2 = null;
            if (n2.type === "symbol" || n2.type === "attributeRef" || n2.root != null) {
              o2 = k2(e2, t3, r3, n2, a3);
            }
            var s3 = { value: i2, target: n2, args: [n2, i2], op: function(e3, r4, n3) {
              if (Array.isArray(r4)) {
                r4.push(n3);
                return t3.findNext(this, e3);
              } else if (r4 instanceof Element) {
                r4.innerHTML += n3;
                return t3.findNext(this, e3);
              } else if (o2) {
                e3.result = (r4 || "") + n3;
                return o2;
              } else {
                throw Error("Unable to append a value!");
              }
            }, execute: function(e3) {
              return t3.unifiedExec(this, e3);
            } };
            if (o2 != null) {
              o2.parent = s3;
            }
            return s3;
          });
          function g2(e2, t3, r3) {
            r3.matchToken("at") || r3.matchToken("from");
            const n2 = { includeStart: true, includeEnd: false };
            n2.from = r3.matchToken("start") ? 0 : e2.requireElement("expression", r3);
            if (r3.matchToken("to") || r3.matchOpToken("..")) {
              if (r3.matchToken("end")) {
                n2.toEnd = true;
              } else {
                n2.to = e2.requireElement("expression", r3);
              }
            }
            if (r3.matchToken("inclusive"))
              n2.includeEnd = true;
            else if (r3.matchToken("exclusive"))
              n2.includeStart = false;
            return n2;
          }
          class b2 {
            constructor(e2, t3) {
              this.re = e2;
              this.str = t3;
            }
            next() {
              const e2 = this.re.exec(this.str);
              if (e2 === null)
                return { done: true };
              else
                return { value: e2 };
            }
          }
          class w2 {
            constructor(e2, t3, r3) {
              this.re = e2;
              this.flags = t3;
              this.str = r3;
            }
            [Symbol.iterator]() {
              return new b2(new RegExp(this.re, this.flags), this.str);
            }
          }
          t2.addCommand("pick", (e2, t3, r3) => {
            if (!r3.matchToken("pick"))
              return;
            r3.matchToken("the");
            if (r3.matchToken("item") || r3.matchToken("items") || r3.matchToken("character") || r3.matchToken("characters")) {
              const n2 = g2(e2, t3, r3);
              r3.requireToken("from");
              const i2 = e2.requireElement("expression", r3);
              return { args: [i2, n2.from, n2.to], op(e3, r4, i3, a3) {
                if (n2.toEnd)
                  a3 = r4.length;
                if (!n2.includeStart)
                  i3++;
                if (n2.includeEnd)
                  a3++;
                if (a3 == null || a3 == void 0)
                  a3 = i3 + 1;
                e3.result = r4.slice(i3, a3);
                return t3.findNext(this, e3);
              } };
            }
            if (r3.matchToken("match")) {
              r3.matchToken("of");
              const n2 = e2.parseElement("expression", r3);
              let i2 = "";
              if (r3.matchOpToken("|")) {
                i2 = r3.requireToken("identifier").value;
              }
              r3.requireToken("from");
              const a3 = e2.parseElement("expression", r3);
              return { args: [a3, n2], op(e3, r4, n3) {
                e3.result = new RegExp(n3, i2).exec(r4);
                return t3.findNext(this, e3);
              } };
            }
            if (r3.matchToken("matches")) {
              r3.matchToken("of");
              const n2 = e2.parseElement("expression", r3);
              let i2 = "gu";
              if (r3.matchOpToken("|")) {
                i2 = "g" + r3.requireToken("identifier").value.replace("g", "");
              }
              console.log("flags", i2);
              r3.requireToken("from");
              const a3 = e2.parseElement("expression", r3);
              return { args: [a3, n2], op(e3, r4, n3) {
                e3.result = new w2(n3, i2, r4);
                return t3.findNext(this, e3);
              } };
            }
          });
          t2.addCommand("increment", function(e2, t3, r3) {
            if (!r3.matchToken("increment"))
              return;
            var n2;
            var i2 = e2.parseElement("assignableExpression", r3);
            if (r3.matchToken("by")) {
              n2 = e2.requireElement("expression", r3);
            }
            var a3 = { type: "implicitIncrementOp", target: i2, args: [i2, n2], op: function(e3, t4, r4) {
              t4 = t4 ? parseFloat(t4) : 0;
              r4 = n2 ? parseFloat(r4) : 1;
              var i3 = t4 + r4;
              e3.result = i3;
              return i3;
            }, evaluate: function(e3) {
              return t3.unifiedEval(this, e3);
            } };
            return k2(e2, t3, r3, i2, a3);
          });
          t2.addCommand("decrement", function(e2, t3, r3) {
            if (!r3.matchToken("decrement"))
              return;
            var n2;
            var i2 = e2.parseElement("assignableExpression", r3);
            if (r3.matchToken("by")) {
              n2 = e2.requireElement("expression", r3);
            }
            var a3 = { type: "implicitDecrementOp", target: i2, args: [i2, n2], op: function(e3, t4, r4) {
              t4 = t4 ? parseFloat(t4) : 0;
              r4 = n2 ? parseFloat(r4) : 1;
              var i3 = t4 - r4;
              e3.result = i3;
              return i3;
            }, evaluate: function(e3) {
              return t3.unifiedEval(this, e3);
            } };
            return k2(e2, t3, r3, i2, a3);
          });
          function S2(e2, t3) {
            var r3 = "text";
            var n2;
            e2.matchToken("a") || e2.matchToken("an");
            if (e2.matchToken("json") || e2.matchToken("Object")) {
              r3 = "json";
            } else if (e2.matchToken("response")) {
              r3 = "response";
            } else if (e2.matchToken("html")) {
              r3 = "html";
            } else if (e2.matchToken("text")) {
            } else {
              n2 = t3.requireElement("dotOrColonPath", e2).evaluate();
            }
            return { type: r3, conversion: n2 };
          }
          t2.addCommand("fetch", function(e2, t3, r3) {
            if (!r3.matchToken("fetch"))
              return;
            var n2 = e2.requireElement("stringLike", r3);
            if (r3.matchToken("as")) {
              var i2 = S2(r3, e2);
            }
            if (r3.matchToken("with") && r3.currentToken().value !== "{") {
              var a3 = e2.parseElement("nakedNamedArgumentList", r3);
            } else {
              var a3 = e2.parseElement("objectLiteral", r3);
            }
            if (i2 == null && r3.matchToken("as")) {
              i2 = S2(r3, e2);
            }
            var o2 = i2 ? i2.type : "text";
            var s3 = i2 ? i2.conversion : null;
            var u3 = { url: n2, argExpressions: a3, args: [n2, a3], op: function(e3, r4, n3) {
              var i3 = n3 || {};
              i3["sender"] = e3.me;
              i3["headers"] = i3["headers"] || {};
              var a4 = new AbortController();
              let l3 = e3.me.addEventListener("fetch:abort", function() {
                a4.abort();
              }, { once: true });
              i3["signal"] = a4.signal;
              t3.triggerEvent(e3.me, "hyperscript:beforeFetch", i3);
              t3.triggerEvent(e3.me, "fetch:beforeRequest", i3);
              n3 = i3;
              var c3 = false;
              if (n3.timeout) {
                setTimeout(function() {
                  if (!c3) {
                    a4.abort();
                  }
                }, n3.timeout);
              }
              return fetch(r4, n3).then(function(r5) {
                let n4 = { response: r5 };
                t3.triggerEvent(e3.me, "fetch:afterResponse", n4);
                r5 = n4.response;
                if (o2 === "response") {
                  e3.result = r5;
                  t3.triggerEvent(e3.me, "fetch:afterRequest", { result: r5 });
                  c3 = true;
                  return t3.findNext(u3, e3);
                }
                if (o2 === "json") {
                  return r5.json().then(function(r6) {
                    e3.result = r6;
                    t3.triggerEvent(e3.me, "fetch:afterRequest", { result: r6 });
                    c3 = true;
                    return t3.findNext(u3, e3);
                  });
                }
                return r5.text().then(function(r6) {
                  if (s3)
                    r6 = t3.convertValue(r6, s3);
                  if (o2 === "html")
                    r6 = t3.convertValue(r6, "Fragment");
                  e3.result = r6;
                  t3.triggerEvent(e3.me, "fetch:afterRequest", { result: r6 });
                  c3 = true;
                  return t3.findNext(u3, e3);
                });
              }).catch(function(r5) {
                t3.triggerEvent(e3.me, "fetch:error", { reason: r5 });
                throw r5;
              }).finally(function() {
                e3.me.removeEventListener("fetch:abort", l3);
              });
            } };
            return u3;
          });
        }
        function y(e2) {
          e2.addCommand("settle", function(e3, t3, r2) {
            if (r2.matchToken("settle")) {
              if (!e3.commandBoundary(r2.currentToken())) {
                var n3 = e3.requireElement("expression", r2);
              } else {
                var n3 = e3.requireElement("implicitMeTarget", r2);
              }
              var i3 = { type: "settleCmd", args: [n3], op: function(e4, r3) {
                t3.nullCheck(r3, n3);
                var a3 = null;
                var o3 = false;
                var s2 = false;
                var u2 = new Promise(function(e5) {
                  a3 = e5;
                });
                r3.addEventListener("transitionstart", function() {
                  s2 = true;
                }, { once: true });
                setTimeout(function() {
                  if (!s2 && !o3) {
                    a3(t3.findNext(i3, e4));
                  }
                }, 500);
                r3.addEventListener("transitionend", function() {
                  if (!o3) {
                    a3(t3.findNext(i3, e4));
                  }
                }, { once: true });
                return u2;
              }, execute: function(e4) {
                return t3.unifiedExec(this, e4);
              } };
              return i3;
            }
          });
          e2.addCommand("add", function(e3, t3, r2) {
            if (r2.matchToken("add")) {
              var n3 = e3.parseElement("classRef", r2);
              var i3 = null;
              var a3 = null;
              if (n3 == null) {
                i3 = e3.parseElement("attributeRef", r2);
                if (i3 == null) {
                  a3 = e3.parseElement("styleLiteral", r2);
                  if (a3 == null) {
                    e3.raiseParseError(r2, "Expected either a class reference or attribute expression");
                  }
                }
              } else {
                var o3 = [n3];
                while (n3 = e3.parseElement("classRef", r2)) {
                  o3.push(n3);
                }
              }
              if (r2.matchToken("to")) {
                var s2 = e3.requireElement("expression", r2);
              } else {
                var s2 = e3.requireElement("implicitMeTarget", r2);
              }
              if (r2.matchToken("when")) {
                if (a3) {
                  e3.raiseParseError(r2, "Only class and properties are supported with a when clause");
                }
                var u2 = e3.requireElement("expression", r2);
              }
              if (o3) {
                return { classRefs: o3, to: s2, args: [s2, o3], op: function(e4, r3, n4) {
                  t3.nullCheck(r3, s2);
                  t3.forEach(n4, function(n5) {
                    t3.implicitLoop(r3, function(r4) {
                      if (u2) {
                        e4.result = r4;
                        let i4 = t3.evaluateNoPromise(u2, e4);
                        if (i4) {
                          if (r4 instanceof Element)
                            r4.classList.add(n5.className);
                        } else {
                          if (r4 instanceof Element)
                            r4.classList.remove(n5.className);
                        }
                        e4.result = null;
                      } else {
                        if (r4 instanceof Element)
                          r4.classList.add(n5.className);
                      }
                    });
                  });
                  return t3.findNext(this, e4);
                } };
              } else if (i3) {
                return { type: "addCmd", attributeRef: i3, to: s2, args: [s2], op: function(e4, r3, n4) {
                  t3.nullCheck(r3, s2);
                  t3.implicitLoop(r3, function(r4) {
                    if (u2) {
                      e4.result = r4;
                      let n5 = t3.evaluateNoPromise(u2, e4);
                      if (n5) {
                        r4.setAttribute(i3.name, i3.value);
                      } else {
                        r4.removeAttribute(i3.name);
                      }
                      e4.result = null;
                    } else {
                      r4.setAttribute(i3.name, i3.value);
                    }
                  });
                  return t3.findNext(this, e4);
                }, execute: function(e4) {
                  return t3.unifiedExec(this, e4);
                } };
              } else {
                return { type: "addCmd", cssDeclaration: a3, to: s2, args: [s2, a3], op: function(e4, r3, n4) {
                  t3.nullCheck(r3, s2);
                  t3.implicitLoop(r3, function(e5) {
                    e5.style.cssText += n4;
                  });
                  return t3.findNext(this, e4);
                }, execute: function(e4) {
                  return t3.unifiedExec(this, e4);
                } };
              }
            }
          });
          e2.addGrammarElement("styleLiteral", function(e3, t3, r2) {
            if (!r2.matchOpToken("{"))
              return;
            var n3 = [""];
            var i3 = [];
            while (r2.hasMore()) {
              if (r2.matchOpToken("\\")) {
                r2.consumeToken();
              } else if (r2.matchOpToken("}")) {
                break;
              } else if (r2.matchToken("$")) {
                var a3 = r2.matchOpToken("{");
                var o3 = e3.parseElement("expression", r2);
                if (a3)
                  r2.requireOpToken("}");
                i3.push(o3);
                n3.push("");
              } else {
                var s2 = r2.consumeToken();
                n3[n3.length - 1] += r2.source.substring(s2.start, s2.end);
              }
              n3[n3.length - 1] += r2.lastWhitespace();
            }
            return { type: "styleLiteral", args: [i3], op: function(e4, t4) {
              var r3 = "";
              n3.forEach(function(e5, n4) {
                r3 += e5;
                if (n4 in t4)
                  r3 += t4[n4];
              });
              return r3;
            }, evaluate: function(e4) {
              return t3.unifiedEval(this, e4);
            } };
          });
          e2.addCommand("remove", function(e3, t3, r2) {
            if (r2.matchToken("remove")) {
              var n3 = e3.parseElement("classRef", r2);
              var i3 = null;
              var a3 = null;
              if (n3 == null) {
                i3 = e3.parseElement("attributeRef", r2);
                if (i3 == null) {
                  a3 = e3.parseElement("expression", r2);
                  if (a3 == null) {
                    e3.raiseParseError(r2, "Expected either a class reference, attribute expression or value expression");
                  }
                }
              } else {
                var o3 = [n3];
                while (n3 = e3.parseElement("classRef", r2)) {
                  o3.push(n3);
                }
              }
              if (r2.matchToken("from")) {
                var s2 = e3.requireElement("expression", r2);
              } else {
                if (a3 == null) {
                  var s2 = e3.requireElement("implicitMeTarget", r2);
                }
              }
              if (a3) {
                return { elementExpr: a3, from: s2, args: [a3, s2], op: function(e4, r3, n4) {
                  t3.nullCheck(r3, a3);
                  t3.implicitLoop(r3, function(e5) {
                    if (e5.parentElement && (n4 == null || n4.contains(e5))) {
                      e5.parentElement.removeChild(e5);
                    }
                  });
                  return t3.findNext(this, e4);
                } };
              } else {
                return { classRefs: o3, attributeRef: i3, elementExpr: a3, from: s2, args: [o3, s2], op: function(e4, r3, n4) {
                  t3.nullCheck(n4, s2);
                  if (r3) {
                    t3.forEach(r3, function(e5) {
                      t3.implicitLoop(n4, function(t4) {
                        t4.classList.remove(e5.className);
                      });
                    });
                  } else {
                    t3.implicitLoop(n4, function(e5) {
                      e5.removeAttribute(i3.name);
                    });
                  }
                  return t3.findNext(this, e4);
                } };
              }
            }
          });
          e2.addCommand("toggle", function(e3, t3, r2) {
            if (r2.matchToken("toggle")) {
              r2.matchAnyToken("the", "my");
              if (r2.currentToken().type === "STYLE_REF") {
                let t4 = r2.consumeToken();
                var n3 = t4.value.substr(1);
                var a3 = true;
                var o3 = i2(e3, r2, n3);
                if (r2.matchToken("of")) {
                  r2.pushFollow("with");
                  try {
                    var s2 = e3.requireElement("expression", r2);
                  } finally {
                    r2.popFollow();
                  }
                } else {
                  var s2 = e3.requireElement("implicitMeTarget", r2);
                }
              } else if (r2.matchToken("between")) {
                var u2 = true;
                var l2 = e3.parseElement("classRef", r2);
                r2.requireToken("and");
                var c2 = e3.requireElement("classRef", r2);
              } else {
                var l2 = e3.parseElement("classRef", r2);
                var f2 = null;
                if (l2 == null) {
                  f2 = e3.parseElement("attributeRef", r2);
                  if (f2 == null) {
                    e3.raiseParseError(r2, "Expected either a class reference or attribute expression");
                  }
                } else {
                  var m2 = [l2];
                  while (l2 = e3.parseElement("classRef", r2)) {
                    m2.push(l2);
                  }
                }
              }
              if (a3 !== true) {
                if (r2.matchToken("on")) {
                  var s2 = e3.requireElement("expression", r2);
                } else {
                  var s2 = e3.requireElement("implicitMeTarget", r2);
                }
              }
              if (r2.matchToken("for")) {
                var p2 = e3.requireElement("expression", r2);
              } else if (r2.matchToken("until")) {
                var h2 = e3.requireElement("dotOrColonPath", r2, "Expected event name");
                if (r2.matchToken("from")) {
                  var v2 = e3.requireElement("expression", r2);
                }
              }
              var d2 = { classRef: l2, classRef2: c2, classRefs: m2, attributeRef: f2, on: s2, time: p2, evt: h2, from: v2, toggle: function(e4, r3, n4, i3) {
                t3.nullCheck(e4, s2);
                if (a3) {
                  t3.implicitLoop(e4, function(e5) {
                    o3("toggle", e5);
                  });
                } else if (u2) {
                  t3.implicitLoop(e4, function(e5) {
                    if (e5.classList.contains(r3.className)) {
                      e5.classList.remove(r3.className);
                      e5.classList.add(n4.className);
                    } else {
                      e5.classList.add(r3.className);
                      e5.classList.remove(n4.className);
                    }
                  });
                } else if (i3) {
                  t3.forEach(i3, function(r4) {
                    t3.implicitLoop(e4, function(e5) {
                      e5.classList.toggle(r4.className);
                    });
                  });
                } else {
                  t3.forEach(e4, function(e5) {
                    if (e5.hasAttribute(f2.name)) {
                      e5.removeAttribute(f2.name);
                    } else {
                      e5.setAttribute(f2.name, f2.value);
                    }
                  });
                }
              }, args: [s2, p2, h2, v2, l2, c2, m2], op: function(e4, r3, n4, i3, a4, o4, s3, u3) {
                if (n4) {
                  return new Promise(function(i4) {
                    d2.toggle(r3, o4, s3, u3);
                    setTimeout(function() {
                      d2.toggle(r3, o4, s3, u3);
                      i4(t3.findNext(d2, e4));
                    }, n4);
                  });
                } else if (i3) {
                  return new Promise(function(n5) {
                    var l3 = a4 || e4.me;
                    l3.addEventListener(i3, function() {
                      d2.toggle(r3, o4, s3, u3);
                      n5(t3.findNext(d2, e4));
                    }, { once: true });
                    d2.toggle(r3, o4, s3, u3);
                  });
                } else {
                  this.toggle(r3, o4, s3, u3);
                  return t3.findNext(d2, e4);
                }
              } };
              return d2;
            }
          });
          var t2 = { display: function(r2, n3, i3) {
            if (i3) {
              n3.style.display = i3;
            } else if (r2 === "toggle") {
              if (getComputedStyle(n3).display === "none") {
                t2.display("show", n3, i3);
              } else {
                t2.display("hide", n3, i3);
              }
            } else if (r2 === "hide") {
              const t3 = e2.runtime.getInternalData(n3);
              if (t3.originalDisplay == null) {
                t3.originalDisplay = n3.style.display;
              }
              n3.style.display = "none";
            } else {
              const t3 = e2.runtime.getInternalData(n3);
              if (t3.originalDisplay && t3.originalDisplay !== "none") {
                n3.style.display = t3.originalDisplay;
              } else {
                n3.style.removeProperty("display");
              }
            }
          }, visibility: function(e3, r2, n3) {
            if (n3) {
              r2.style.visibility = n3;
            } else if (e3 === "toggle") {
              if (getComputedStyle(r2).visibility === "hidden") {
                t2.visibility("show", r2, n3);
              } else {
                t2.visibility("hide", r2, n3);
              }
            } else if (e3 === "hide") {
              r2.style.visibility = "hidden";
            } else {
              r2.style.visibility = "visible";
            }
          }, opacity: function(e3, r2, n3) {
            if (n3) {
              r2.style.opacity = n3;
            } else if (e3 === "toggle") {
              if (getComputedStyle(r2).opacity === "0") {
                t2.opacity("show", r2, n3);
              } else {
                t2.opacity("hide", r2, n3);
              }
            } else if (e3 === "hide") {
              r2.style.opacity = "0";
            } else {
              r2.style.opacity = "1";
            }
          } };
          var n2 = function(e3, t3, r2) {
            var n3;
            var i3 = r2.currentToken();
            if (i3.value === "when" || i3.value === "with" || e3.commandBoundary(i3)) {
              n3 = e3.parseElement("implicitMeTarget", r2);
            } else {
              n3 = e3.parseElement("expression", r2);
            }
            return n3;
          };
          var i2 = function(e3, n3, i3) {
            var a3 = r.defaultHideShowStrategy;
            var o3 = t2;
            if (r.hideShowStrategies) {
              o3 = Object.assign(o3, r.hideShowStrategies);
            }
            i3 = i3 || a3 || "display";
            var s2 = o3[i3];
            if (s2 == null) {
              e3.raiseParseError(n3, "Unknown show/hide strategy : " + i3);
            }
            return s2;
          };
          e2.addCommand("hide", function(e3, t3, r2) {
            if (r2.matchToken("hide")) {
              var a3 = n2(e3, t3, r2);
              var o3 = null;
              if (r2.matchToken("with")) {
                o3 = r2.requireTokenType("IDENTIFIER", "STYLE_REF").value;
                if (o3.indexOf("*") === 0) {
                  o3 = o3.substr(1);
                }
              }
              var s2 = i2(e3, r2, o3);
              return { target: a3, args: [a3], op: function(e4, r3) {
                t3.nullCheck(r3, a3);
                t3.implicitLoop(r3, function(e5) {
                  s2("hide", e5);
                });
                return t3.findNext(this, e4);
              } };
            }
          });
          e2.addCommand("show", function(e3, t3, r2) {
            if (r2.matchToken("show")) {
              var a3 = n2(e3, t3, r2);
              var o3 = null;
              if (r2.matchToken("with")) {
                o3 = r2.requireTokenType("IDENTIFIER", "STYLE_REF").value;
                if (o3.indexOf("*") === 0) {
                  o3 = o3.substr(1);
                }
              }
              var s2 = null;
              if (r2.matchOpToken(":")) {
                var u2 = r2.consumeUntilWhitespace();
                r2.matchTokenType("WHITESPACE");
                s2 = u2.map(function(e4) {
                  return e4.value;
                }).join("");
              }
              if (r2.matchToken("when")) {
                var l2 = e3.requireElement("expression", r2);
              }
              var c2 = i2(e3, r2, o3);
              return { target: a3, when: l2, args: [a3], op: function(e4, r3) {
                t3.nullCheck(r3, a3);
                t3.implicitLoop(r3, function(r4) {
                  if (l2) {
                    e4.result = r4;
                    let n3 = t3.evaluateNoPromise(l2, e4);
                    if (n3) {
                      c2("show", r4, s2);
                    } else {
                      c2("hide", r4);
                    }
                    e4.result = null;
                  } else {
                    c2("show", r4, s2);
                  }
                });
                return t3.findNext(this, e4);
              } };
            }
          });
          e2.addCommand("take", function(e3, t3, r2) {
            if (r2.matchToken("take")) {
              var n3 = e3.parseElement("classRef", r2);
              var i3 = null;
              var a3 = null;
              if (n3 == null) {
                i3 = e3.parseElement("attributeRef", r2);
                if (i3 == null) {
                  e3.raiseParseError(r2, "Expected either a class reference or attribute expression");
                }
                if (r2.matchToken("with")) {
                  a3 = e3.requireElement("expression", r2);
                }
              }
              if (r2.matchToken("from")) {
                var o3 = e3.requireElement("expression", r2);
              } else {
                var o3 = n3;
              }
              if (r2.matchToken("for")) {
                var s2 = e3.requireElement("expression", r2);
              } else {
                var s2 = e3.requireElement("implicitMeTarget", r2);
              }
              if (n3) {
                var u2 = { classRef: n3, from: o3, forElt: s2, args: [n3, o3, s2], op: function(e4, r3, n4, i4) {
                  t3.nullCheck(n4, o3);
                  t3.nullCheck(i4, s2);
                  var a4 = r3.className;
                  t3.implicitLoop(n4, function(e5) {
                    e5.classList.remove(a4);
                  });
                  t3.implicitLoop(i4, function(e5) {
                    e5.classList.add(a4);
                  });
                  return t3.findNext(this, e4);
                } };
                return u2;
              } else {
                var u2 = { attributeRef: i3, from: o3, forElt: s2, args: [o3, s2, a3], op: function(e4, r3, n4, a4) {
                  t3.nullCheck(r3, o3);
                  t3.nullCheck(n4, s2);
                  t3.implicitLoop(r3, function(e5) {
                    if (!a4) {
                      e5.removeAttribute(i3.name);
                    } else {
                      e5.setAttribute(i3.name, a4);
                    }
                  });
                  t3.implicitLoop(n4, function(e5) {
                    e5.setAttribute(i3.name, i3.value || "");
                  });
                  return t3.findNext(this, e4);
                } };
                return u2;
              }
            }
          });
          function a2(t3, r2, n3, i3) {
            if (n3 != null) {
              var a3 = t3.resolveSymbol(n3, r2);
            } else {
              var a3 = r2;
            }
            if (a3 instanceof Element || a3 instanceof HTMLDocument) {
              while (a3.firstChild)
                a3.removeChild(a3.firstChild);
              a3.append(e2.runtime.convertValue(i3, "Fragment"));
              t3.processNode(a3);
            } else {
              if (n3 != null) {
                t3.setSymbol(n3, r2, null, i3);
              } else {
                throw "Don't know how to put a value into " + typeof r2;
              }
            }
          }
          e2.addCommand("put", function(e3, t3, r2) {
            if (r2.matchToken("put")) {
              var n3 = e3.requireElement("expression", r2);
              var i3 = r2.matchAnyToken("into", "before", "after");
              if (i3 == null && r2.matchToken("at")) {
                r2.matchToken("the");
                i3 = r2.matchAnyToken("start", "end");
                r2.requireToken("of");
              }
              if (i3 == null) {
                e3.raiseParseError(r2, "Expected one of 'into', 'before', 'at start of', 'at end of', 'after'");
              }
              var o3 = e3.requireElement("expression", r2);
              var s2 = i3.value;
              var u2 = false;
              var l2 = false;
              var c2 = null;
              var f2 = null;
              if (o3.type === "arrayIndex" && s2 === "into") {
                u2 = true;
                f2 = o3.prop;
                c2 = o3.root;
              } else if (o3.prop && o3.root && s2 === "into") {
                f2 = o3.prop.value;
                c2 = o3.root;
              } else if (o3.type === "symbol" && s2 === "into") {
                l2 = true;
                f2 = o3.name;
              } else if (o3.type === "attributeRef" && s2 === "into") {
                var m2 = true;
                f2 = o3.name;
                c2 = e3.requireElement("implicitMeTarget", r2);
              } else if (o3.type === "styleRef" && s2 === "into") {
                var p2 = true;
                f2 = o3.name;
                c2 = e3.requireElement("implicitMeTarget", r2);
              } else if (o3.attribute && s2 === "into") {
                var m2 = o3.attribute.type === "attributeRef";
                var p2 = o3.attribute.type === "styleRef";
                f2 = o3.attribute.name;
                c2 = o3.root;
              } else {
                c2 = o3;
              }
              var h2 = { target: o3, operation: s2, symbolWrite: l2, value: n3, args: [c2, f2, n3], op: function(e4, r3, n4, i4) {
                if (l2) {
                  a2(t3, e4, n4, i4);
                } else {
                  t3.nullCheck(r3, c2);
                  if (s2 === "into") {
                    if (m2) {
                      t3.implicitLoop(r3, function(e5) {
                        e5.setAttribute(n4, i4);
                      });
                    } else if (p2) {
                      t3.implicitLoop(r3, function(e5) {
                        e5.style[n4] = i4;
                      });
                    } else if (u2) {
                      r3[n4] = i4;
                    } else {
                      t3.implicitLoop(r3, function(e5) {
                        a2(t3, e5, n4, i4);
                      });
                    }
                  } else {
                    var o4 = s2 === "before" ? Element.prototype.before : s2 === "after" ? Element.prototype.after : s2 === "start" ? Element.prototype.prepend : s2 === "end" ? Element.prototype.append : Element.prototype.append;
                    t3.implicitLoop(r3, function(e5) {
                      o4.call(e5, i4 instanceof Node ? i4 : t3.convertValue(i4, "Fragment"));
                      if (e5.parentElement) {
                        t3.processNode(e5.parentElement);
                      } else {
                        t3.processNode(e5);
                      }
                    });
                  }
                }
                return t3.findNext(this, e4);
              } };
              return h2;
            }
          });
          function o2(e3, t3, r2) {
            var n3;
            if (r2.matchToken("the") || r2.matchToken("element") || r2.matchToken("elements") || r2.currentToken().type === "CLASS_REF" || r2.currentToken().type === "ID_REF" || r2.currentToken().op && r2.currentToken().value === "<") {
              e3.possessivesDisabled = true;
              try {
                n3 = e3.parseElement("expression", r2);
              } finally {
                delete e3.possessivesDisabled;
              }
              if (r2.matchOpToken("'")) {
                r2.requireToken("s");
              }
            } else if (r2.currentToken().type === "IDENTIFIER" && r2.currentToken().value === "its") {
              var i3 = r2.matchToken("its");
              n3 = { type: "pseudopossessiveIts", token: i3, name: i3.value, evaluate: function(e4) {
                return t3.resolveSymbol("it", e4);
              } };
            } else {
              r2.matchToken("my") || r2.matchToken("me");
              n3 = e3.parseElement("implicitMeTarget", r2);
            }
            return n3;
          }
          e2.addCommand("transition", function(e3, t3, n3) {
            if (n3.matchToken("transition")) {
              var i3 = o2(e3, t3, n3);
              var a3 = [];
              var s2 = [];
              var u2 = [];
              var l2 = n3.currentToken();
              while (!e3.commandBoundary(l2) && l2.value !== "over" && l2.value !== "using") {
                if (n3.currentToken().type === "STYLE_REF") {
                  let e4 = n3.consumeToken();
                  let t4 = e4.value.substr(1);
                  a3.push({ type: "styleRefValue", evaluate: function() {
                    return t4;
                  } });
                } else {
                  a3.push(e3.requireElement("stringLike", n3));
                }
                if (n3.matchToken("from")) {
                  s2.push(e3.requireElement("expression", n3));
                } else {
                  s2.push(null);
                }
                n3.requireToken("to");
                if (n3.matchToken("initial")) {
                  u2.push({ type: "initial_literal", evaluate: function() {
                    return "initial";
                  } });
                } else {
                  u2.push(e3.requireElement("expression", n3));
                }
                l2 = n3.currentToken();
              }
              if (n3.matchToken("over")) {
                var c2 = e3.requireElement("expression", n3);
              } else if (n3.matchToken("using")) {
                var f2 = e3.requireElement("expression", n3);
              }
              var m2 = { to: u2, args: [i3, a3, s2, u2, f2, c2], op: function(e4, n4, a4, o3, s3, u3, l3) {
                t3.nullCheck(n4, i3);
                var c3 = [];
                t3.implicitLoop(n4, function(e5) {
                  var n5 = new Promise(function(n6, i4) {
                    var c4 = e5.style.transition;
                    if (l3) {
                      e5.style.transition = "all " + l3 + "ms ease-in";
                    } else if (u3) {
                      e5.style.transition = u3;
                    } else {
                      e5.style.transition = r.defaultTransition;
                    }
                    var f3 = t3.getInternalData(e5);
                    var m3 = getComputedStyle(e5);
                    var p2 = {};
                    for (var h2 = 0; h2 < m3.length; h2++) {
                      var v2 = m3[h2];
                      var d2 = m3[v2];
                      p2[v2] = d2;
                    }
                    if (!f3.initalStyles) {
                      f3.initalStyles = p2;
                    }
                    for (var h2 = 0; h2 < a4.length; h2++) {
                      var E2 = a4[h2];
                      var T2 = o3[h2];
                      if (T2 === "computed" || T2 == null) {
                        e5.style[E2] = p2[E2];
                      } else {
                        e5.style[E2] = T2;
                      }
                    }
                    var y2 = false;
                    var k2 = false;
                    e5.addEventListener("transitionend", function() {
                      if (!k2) {
                        e5.style.transition = c4;
                        k2 = true;
                        n6();
                      }
                    }, { once: true });
                    e5.addEventListener("transitionstart", function() {
                      y2 = true;
                    }, { once: true });
                    setTimeout(function() {
                      if (!k2 && !y2) {
                        e5.style.transition = c4;
                        k2 = true;
                        n6();
                      }
                    }, 100);
                    setTimeout(function() {
                      var t4 = [];
                      for (var r2 = 0; r2 < a4.length; r2++) {
                        var n7 = a4[r2];
                        var i5 = s3[r2];
                        if (i5 === "initial") {
                          var o4 = f3.initalStyles[n7];
                          e5.style[n7] = o4;
                        } else {
                          e5.style[n7] = i5;
                        }
                      }
                    }, 0);
                  });
                  c3.push(n5);
                });
                return Promise.all(c3).then(function() {
                  return t3.findNext(m2, e4);
                });
              } };
              return m2;
            }
          });
          e2.addCommand("measure", function(e3, t3, r2) {
            if (!r2.matchToken("measure"))
              return;
            var n3 = o2(e3, t3, r2);
            var i3 = [];
            if (!e3.commandBoundary(r2.currentToken()))
              do {
                i3.push(r2.matchTokenType("IDENTIFIER").value);
              } while (r2.matchOpToken(","));
            return { properties: i3, args: [n3], op: function(e4, r3) {
              t3.nullCheck(r3, n3);
              if (0 in r3)
                r3 = r3[0];
              var a3 = r3.getBoundingClientRect();
              var o3 = { top: r3.scrollTop, left: r3.scrollLeft, topMax: r3.scrollTopMax, leftMax: r3.scrollLeftMax, height: r3.scrollHeight, width: r3.scrollWidth };
              e4.result = { x: a3.x, y: a3.y, left: a3.left, top: a3.top, right: a3.right, bottom: a3.bottom, width: a3.width, height: a3.height, bounds: a3, scrollLeft: o3.left, scrollTop: o3.top, scrollLeftMax: o3.leftMax, scrollTopMax: o3.topMax, scrollWidth: o3.width, scrollHeight: o3.height, scroll: o3 };
              t3.forEach(i3, function(t4) {
                if (t4 in e4.result)
                  e4.locals[t4] = e4.result[t4];
                else
                  throw "No such measurement as " + t4;
              });
              return t3.findNext(this, e4);
            } };
          });
          e2.addLeafExpression("closestExpr", function(e3, t3, r2) {
            if (r2.matchToken("closest")) {
              if (r2.matchToken("parent")) {
                var n3 = true;
              }
              var i3 = null;
              if (r2.currentToken().type === "ATTRIBUTE_REF") {
                var a3 = e3.requireElement("attributeRefAccess", r2, null);
                i3 = "[" + a3.attribute.name + "]";
              }
              if (i3 == null) {
                var o3 = e3.requireElement("expression", r2);
                if (o3.css == null) {
                  e3.raiseParseError(r2, "Expected a CSS expression");
                } else {
                  i3 = o3.css;
                }
              }
              if (r2.matchToken("to")) {
                var s2 = e3.parseElement("expression", r2);
              } else {
                var s2 = e3.parseElement("implicitMeTarget", r2);
              }
              var u2 = { type: "closestExpr", parentSearch: n3, expr: o3, css: i3, to: s2, args: [s2], op: function(e4, r3) {
                if (r3 == null) {
                  return null;
                } else {
                  let e5 = [];
                  t3.implicitLoop(r3, function(t4) {
                    if (n3) {
                      e5.push(t4.parentElement ? t4.parentElement.closest(i3) : null);
                    } else {
                      e5.push(t4.closest(i3));
                    }
                  });
                  if (t3.shouldAutoIterate(r3)) {
                    return e5;
                  } else {
                    return e5[0];
                  }
                }
              }, evaluate: function(e4) {
                return t3.unifiedEval(this, e4);
              } };
              if (a3) {
                a3.root = u2;
                a3.args = [u2];
                return a3;
              } else {
                return u2;
              }
            }
          });
          e2.addCommand("go", function(e3, t3, r2) {
            if (r2.matchToken("go")) {
              if (r2.matchToken("back")) {
                var n3 = true;
              } else {
                r2.matchToken("to");
                if (r2.matchToken("url")) {
                  var i3 = e3.requireElement("stringLike", r2);
                  var a3 = true;
                  if (r2.matchToken("in")) {
                    r2.requireToken("new");
                    r2.requireToken("window");
                    var o3 = true;
                  }
                } else {
                  r2.matchToken("the");
                  var s2 = r2.matchAnyToken("top", "middle", "bottom");
                  var u2 = r2.matchAnyToken("left", "center", "right");
                  if (s2 || u2) {
                    r2.requireToken("of");
                  }
                  var i3 = e3.requireElement("unaryExpression", r2);
                  var l2 = r2.matchAnyOpToken("+", "-");
                  if (l2) {
                    r2.pushFollow("px");
                    try {
                      var c2 = e3.requireElement("expression", r2);
                    } finally {
                      r2.popFollow();
                    }
                  }
                  r2.matchToken("px");
                  var f2 = r2.matchAnyToken("smoothly", "instantly");
                  var m2 = {};
                  if (s2) {
                    if (s2.value === "top") {
                      m2.block = "start";
                    } else if (s2.value === "bottom") {
                      m2.block = "end";
                    } else if (s2.value === "middle") {
                      m2.block = "center";
                    }
                  }
                  if (u2) {
                    if (u2.value === "left") {
                      m2.inline = "start";
                    } else if (u2.value === "center") {
                      m2.inline = "center";
                    } else if (u2.value === "right") {
                      m2.inline = "end";
                    }
                  }
                  if (f2) {
                    if (f2.value === "smoothly") {
                      m2.behavior = "smooth";
                    } else if (f2.value === "instantly") {
                      m2.behavior = "instant";
                    }
                  }
                }
              }
              var p2 = { target: i3, args: [i3, c2], op: function(e4, r3, i4) {
                if (n3) {
                  window.history.back();
                } else if (a3) {
                  if (r3) {
                    if (o3) {
                      window.open(r3);
                    } else {
                      window.location.href = r3;
                    }
                  }
                } else {
                  t3.implicitLoop(r3, function(e5) {
                    if (e5 === window) {
                      e5 = document.body;
                    }
                    if (l2) {
                      var t4 = e5.getBoundingClientRect();
                      let n4 = document.createElement("div");
                      if (l2.value === "-") {
                        var r4 = -i4;
                      } else {
                        var r4 = - -i4;
                      }
                      n4.style.position = "absolute";
                      n4.style.top = t4.x + r4 + "px";
                      n4.style.left = t4.y + r4 + "px";
                      n4.style.height = t4.height + 2 * r4 + "px";
                      n4.style.width = t4.width + 2 * r4 + "px";
                      n4.style.zIndex = "" + Number.MIN_SAFE_INTEGER;
                      n4.style.opacity = "0";
                      document.body.appendChild(n4);
                      setTimeout(function() {
                        document.body.removeChild(n4);
                      }, 100);
                      e5 = n4;
                    }
                    e5.scrollIntoView(m2);
                  });
                }
                return t3.findNext(p2, e4);
              } };
              return p2;
            }
          });
          r.conversions.dynamicResolvers.push(function(t3, r2) {
            if (!(t3 === "Values" || t3.indexOf("Values:") === 0)) {
              return;
            }
            var n3 = t3.split(":")[1];
            var i3 = {};
            var a3 = e2.runtime.implicitLoop.bind(e2.runtime);
            a3(r2, function(e3) {
              var t4 = s2(e3);
              if (t4 !== void 0) {
                i3[t4.name] = t4.value;
                return;
              }
              if (e3.querySelectorAll != void 0) {
                var r3 = e3.querySelectorAll("input,select,textarea");
                r3.forEach(o3);
              }
            });
            if (n3) {
              if (n3 === "JSON") {
                return JSON.stringify(i3);
              } else if (n3 === "Form") {
                return new URLSearchParams(i3).toString();
              } else {
                throw "Unknown conversion: " + n3;
              }
            } else {
              return i3;
            }
            function o3(e3) {
              var t4 = s2(e3);
              if (t4 == void 0) {
                return;
              }
              if (i3[t4.name] == void 0) {
                i3[t4.name] = t4.value;
                return;
              }
              if (Array.isArray(i3[t4.name]) && Array.isArray(t4.value)) {
                i3[t4.name] = [].concat(i3[t4.name], t4.value);
                return;
              }
            }
            function s2(e3) {
              try {
                var t4 = { name: e3.name, value: e3.value };
                if (t4.name == void 0 || t4.value == void 0) {
                  return void 0;
                }
                if (e3.type == "radio" && e3.checked == false) {
                  return void 0;
                }
                if (e3.type == "checkbox") {
                  if (e3.checked == false) {
                    t4.value = void 0;
                  } else if (typeof t4.value === "string") {
                    t4.value = [t4.value];
                  }
                }
                if (e3.type == "select-multiple") {
                  var r3 = e3.querySelectorAll("option[selected]");
                  t4.value = [];
                  for (var n4 = 0; n4 < r3.length; n4++) {
                    t4.value.push(r3[n4].value);
                  }
                }
                return t4;
              } catch (e4) {
                return void 0;
              }
            }
          });
          r.conversions["HTML"] = function(e3) {
            var t3 = function(e4) {
              if (e4 instanceof Array) {
                return e4.map(function(e5) {
                  return t3(e5);
                }).join("");
              }
              if (e4 instanceof HTMLElement) {
                return e4.outerHTML;
              }
              if (e4 instanceof NodeList) {
                var r2 = "";
                for (var n3 = 0; n3 < e4.length; n3++) {
                  var i3 = e4[n3];
                  if (i3 instanceof HTMLElement) {
                    r2 += i3.outerHTML;
                  }
                }
                return r2;
              }
              if (e4.toString) {
                return e4.toString();
              }
              return "";
            };
            return t3(e3);
          };
          r.conversions["Fragment"] = function(t3) {
            var r2 = document.createDocumentFragment();
            e2.runtime.implicitLoop(t3, function(e3) {
              if (e3 instanceof Node)
                r2.append(e3);
              else {
                var t4 = document.createElement("template");
                t4.innerHTML = e3;
                r2.append(t4.content);
              }
            });
            return r2;
          };
        }
        const k = new o(), x = k.lexer, g = k.parser;
        function b(e2, t2) {
          return k.evaluate(e2, t2);
        }
        function w() {
          var t2 = Array.from(e.document.querySelectorAll("script[type='text/hyperscript'][src]"));
          Promise.all(t2.map(function(e2) {
            return fetch(e2.src).then(function(e3) {
              return e3.text();
            });
          })).then((e2) => e2.forEach((e3) => S(e3))).then(() => n2(function() {
            a2();
            k.processNode(document.documentElement);
            e.document.addEventListener("htmx:load", function(e2) {
              k.processNode(e2.detail.elt);
            });
          }));
          function n2(e2) {
            if (document.readyState !== "loading") {
              setTimeout(e2);
            } else {
              document.addEventListener("DOMContentLoaded", e2);
            }
          }
          function i2() {
            var e2 = document.querySelector('meta[name="htmx-config"]');
            if (e2) {
              return v(e2.content);
            } else {
              return null;
            }
          }
          function a2() {
            var e2 = i2();
            if (e2) {
              Object.assign(r, e2);
            }
          }
        }
        const S = Object.assign(b, { config: r, use(e2) {
          e2(S);
        }, internals: { lexer: x, parser: g, runtime: k, Lexer: n, Tokens: i, Parser: a, Runtime: o }, ElementCollection: m, addFeature: g.addFeature.bind(g), addCommand: g.addCommand.bind(g), addLeafExpression: g.addLeafExpression.bind(g), addIndirectExpression: g.addIndirectExpression.bind(g), evaluate: k.evaluate.bind(k), parse: k.parse.bind(k), processNode: k.processNode.bind(k), browserInit: w });
        return S;
      });
    }
  });

  // node_modules/.pnpm/hyperscript.org@0.9.11/node_modules/hyperscript.org/src/template.js
  var require_template = __commonJS({
    "node_modules/.pnpm/hyperscript.org@0.9.11/node_modules/hyperscript.org/src/template.js"(exports, module) {
      (function(self2, factory) {
        const plugin = factory(self2);
        if (typeof exports === "object" && typeof exports["nodeName"] !== "string") {
          module.exports = plugin;
        } else {
          if ("_hyperscript" in self2)
            self2._hyperscript.use(plugin);
        }
      })(typeof self !== "undefined" ? self : exports, (self2) => {
        function compileTemplate(template) {
          return template.replace(/(?:^|\n)([^@]*)@?/gm, function(match, p1) {
            var templateStr = (" " + p1).replace(/([^\\])\$\{/g, "$1$${escape html ").substring(1);
            return "\ncall meta.__ht_template_result.push(`" + templateStr + "`)\n";
          });
        }
        return (_hyperscript2) => {
          function renderTemplate(template, ctx) {
            var buf = [];
            const renderCtx = Object.assign({}, ctx);
            renderCtx.meta = Object.assign({ __ht_template_result: buf }, ctx.meta);
            _hyperscript2.evaluate(template, renderCtx);
            return buf.join("");
          }
          _hyperscript2.addCommand("render", function(parser, runtime, tokens) {
            if (!tokens.matchToken("render"))
              return;
            var template_ = parser.requireElement("expression", tokens);
            var templateArgs = {};
            if (tokens.matchToken("with")) {
              templateArgs = parser.parseElement("namedArgumentList", tokens);
            }
            return {
              args: [template_, templateArgs],
              op: function(ctx, template, templateArgs2) {
                if (!(template instanceof Element))
                  throw new Error(template_.sourceFor() + " is not an element");
                const context = _hyperscript2.internals.runtime.makeContext();
                context.locals = templateArgs2;
                ctx.result = renderTemplate(compileTemplate(template.innerHTML), context);
                return runtime.findNext(this, ctx);
              }
            };
          });
          function escapeHTML(html) {
            return String(html).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\x22/g, "&quot;").replace(/\x27/g, "&#039;");
          }
          _hyperscript2.addLeafExpression("escape", function(parser, runtime, tokens) {
            if (!tokens.matchToken("escape"))
              return;
            var escapeType = tokens.matchTokenType("IDENTIFIER").value;
            var unescaped = tokens.matchToken("unescaped");
            var arg = parser.requireElement("expression", tokens);
            return {
              args: [arg],
              op: function(ctx, arg2) {
                if (unescaped)
                  return arg2;
                if (arg2 === void 0)
                  return "";
                switch (escapeType) {
                  case "html":
                    return escapeHTML(arg2);
                  default:
                    throw new Error("Unknown escape: " + escapeType);
                }
              },
              evaluate: function(ctx) {
                return runtime.unifiedEval(this, ctx);
              }
            };
          });
        };
      });
    }
  });

  // src/main.js
  var import_chance = __toESM(require_chance());
  var import_astar = __toESM(require_astar());
  var import_hyperscript = __toESM(require_hyperscript_min());
  var import_template = __toESM(require_template());

  // src/utility.js
  var GRID_SIZE = 64;
  function clamp(value, min, max) {
    if (min > max) {
      throw Error("min cannot be greater than max");
    }
    return Math.min(Math.max(value, min), max);
  }
  function transpose_array(arr) {
    out = [];
    for (let x = 0; x < arr[0].length; x++) {
      out[x] = [];
      for (let y = 0; y < arr.length; y++) {
        out[x][y] = arr[y][x];
      }
    }
    return out;
  }
  function get_move_dir(old_x, new_x) {
    return Math.sign(new_x - old_x);
  }
  function world_to_grid(x, with_scale = true) {
    let value_scale = with_scale ? state.scale : 1;
    return Math.floor(x / (GRID_SIZE * value_scale));
  }
  function grid_to_world(x, with_scale = true) {
    let value_scale = with_scale ? state.scale : 1;
    return Math.floor(x * (GRID_SIZE * value_scale));
  }
  var TypedLocalStorage = class {
    setItem(keyName, keyValue) {
      return localStorage.setItem(keyName, JSON.stringify(keyValue));
    }
    getItem(keyName) {
      return JSON.parse(localStorage.getItem(keyName));
    }
    key(index) {
      return JSON.parse(localStorage.key(index));
    }
    removeItem(keyName) {
      return localStorage.removeItem(keyName);
    }
    clear() {
      return localStorage.clear();
    }
    get length() {
      return localStorage.length;
    }
  };
  var typedLocalStorage2 = new TypedLocalStorage();
  globalThis.typedLocalStorage = typedLocalStorage2;

  // src/input.js
  var game_view = document.querySelector("#game-view");
  game_view.addEventListener("pointermove", function(e) {
    if (e.buttons == 1) {
      game_view.scrollLeft -= e.movementX;
      game_view.scrollTop -= e.movementY;
    }
  });
  var map_elem = document.querySelector("#map");
  var pointer_down = null;
  map_elem.addEventListener("pointerdown", function(e) {
    pointer_down = e;
  });
  map_elem.addEventListener("pointerup", function(e) {
    if (is_click(pointer_down, e)) {
      click_handler(e);
    }
    pointer_down = null;
  });
  window.addEventListener("click", function(e) {
    if (!typedLocalStorage.getItem("mute-bgm")) {
      audios.bgm.main.play();
    }
  });
  function is_click(start, end) {
    const max_dist = 5;
    const x_delta = Math.abs(start.pageX - end.pageX);
    const y_delta = Math.abs(start.pageY - end.pageY);
    const time_delta = end.timeStamp - start.timeStamp;
    const is_primary_button = start.buttons == 1;
    return x_delta < max_dist && y_delta < max_dist && time_delta < 2e3 && is_primary_button;
  }
  function click_handler(e) {
    state.player.move(
      world_to_grid(e.offsetX, false),
      world_to_grid(e.offsetY, false)
    );
    handle_input(
      world_to_grid(e.offsetX, false),
      world_to_grid(e.offsetY, false)
    );
  }
  var evCache = [];
  var prevDiff = -1;
  function init_pinch_handler() {
    const el = document.getElementById("game-view");
    el.addEventListener("pointerdown", pinch_pointerdown_handler);
    el.addEventListener("pointermove", pinch_pointermove_handler);
    el.addEventListener("pointerup", pinch_pointerup_handler);
    el.addEventListener("pointercancel", pinch_pointerup_handler);
    el.addEventListener("pointerout", pinch_pointerup_handler);
    el.addEventListener("pointerleave", pinch_pointerup_handler);
  }
  init_pinch_handler();
  function pinch_pointerdown_handler(ev) {
    evCache.push(ev);
  }
  function pinch_pointermove_handler(ev) {
    const index = evCache.findIndex(
      (cachedEv) => cachedEv.pointerId === ev.pointerId
    );
    evCache[index] = ev;
    if (evCache.length === 2) {
      const curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX) + Math.abs(evCache[0].clientY - evCache[1].clientY);
      if (prevDiff > 0) {
        const delta = Math.abs(curDiff - prevDiff);
        const dir = Math.sign(curDiff - prevDiff);
        if (delta > 7) {
          zoom(delta * dir);
        }
      }
      prevDiff = curDiff;
    }
  }
  function pinch_pointerup_handler(ev) {
    pinch_remove_event(ev);
    if (evCache.length < 2) {
      prevDiff = -1;
    }
  }
  function pinch_remove_event(ev) {
    const index = evCache.findIndex(
      (cachedEv) => cachedEv.pointerId === ev.pointerId
    );
    evCache.splice(index, 1);
  }
  window.addEventListener("wheel", function(e) {
    if (Math.abs(e.deltaY) > 3) {
      zoom(Math.sign(e.deltaY));
    }
  });

  // src/resources.js
  var sprites = {
    player: {
      standing: "/static/res/player/standing.png",
      moving: "/static/res/player/moving.png",
      attack: "/static/res/player/attack.png"
    },
    enemy: {
      standing: "/static/res/npc/bot-1/standing.png",
      attack: "/static/res/npc/bot-1/attack.png",
      exploding: "/static/res/npc/bot-1/exploding.png",
      dead: "/static/res/npc/bot-1/dead.png",
      dying: "/static/res/npc/bot-1/dying.gif"
    },
    items: {
      water_bottle: "/static/res/item/water_bottle.png",
      dvd: "/static/res/item/dvd.png",
      pendrive: "/static/res/item/pendrive.png"
    },
    decoration: {
      vending_machine: "/static/res/decoration/vending_machine.png",
      boom: "/static/res/etc/boom.gif"
    },
    etc: {
      boom: "/static/res/etc/boom.gif"
    }
  };
  function audio_resource(src, options) {
    const audio = new Audio();
    audio.src = src;
    audio.preload = true;
    for (const option in options) {
      audio[option] = options[option];
      if (option === "volume") {
        audio._volume = options[option];
      }
    }
    audio.load();
    return audio;
  }
  var audios2 = {
    bgm: {
      main: audio_resource(
        "/static/res/bgm/main_game.mp3",
        {
          loop: true,
          volume: 0.05
        }
      )
    },
    sfx: {
      booster: audio_resource(
        "/static/res/sfx/booster.mp3",
        {
          volume: 0.4
        }
      ),
      pickup: audio_resource(
        "/static/res/sfx/pickup.mp3",
        {
          volume: 0.4
        }
      ),
      boom: audio_resource(
        "/static/res/sfx/boom.mp3",
        {
          volume: 0.1
        }
      )
    }
  };

  // src/common.js
  var Point2 = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  };
  var Rectangle = class {
    constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.width = w;
      this.height = h;
    }
    contains_point(x, y) {
      return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height;
    }
    get_random_point(rng) {
      const x = rng.natural({ min: this.x, max: this.x + this.width - 1 });
      const y = rng.natural({ min: this.y, max: this.y + this.height - 1 });
      return new Point2(x, y);
    }
    toString() {
      return `Rectangle((${this.x}, ${this.y}), w: ${this.width}, h: ${this.height})`;
    }
  };

  // src/level.js
  var Level = class {
    constructor(number, map, entities) {
      this.number = number;
      this.map = map;
      this.entities = entities;
      this.last_player_pos = null;
    }
    set_last_pos(x, y) {
      this.last_player_pos = new Point(x, y);
    }
  };
  var Grid = class {
    constructor(width, height, default_value = 0) {
      this.content = [];
      for (let y = 0; y < height; y++) {
        this.content[y] = Array(width).fill(default_value);
      }
      this.width = width;
      this.height = height;
    }
    #check_bound(x, y) {
      if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
        throw Error(`Out of bound access at (${x}, ${y})`);
      }
    }
    get(x, y) {
      this.#check_bound(x, y);
      return this.content[y][x];
    }
    set(x, y, value) {
      this.#check_bound(x, y);
      this.content[y][x] = value;
    }
    set_line(x0, y0, x1, y1, value) {
      const dx = x1 - x0;
      const dy = y1 - y0;
      const x_dir = Math.sign(dx);
      const y_dir = Math.sign(dy);
      if (dx != 0 && dy != 0) {
        throw Error("Only horizontal and vertical lines supported");
      }
      if (dx != 0) {
        for (let i = 0; i <= Math.abs(dx); i++) {
          this.set(x0 + i * x_dir, y0, value);
        }
      } else {
        for (let i = 0; i <= Math.abs(dy); i++) {
          this.set(x0, y0 + i * y_dir, value);
        }
      }
    }
    set_rect(x0, y0, x1, y1, value) {
      this.set_line(x0, y0, x1, y0, value);
      this.set_line(x0, y1, x1, y1, value);
      this.set_line(x0, y0, x0, y1, value);
      this.set_line(x1, y0, x1, y1, value);
    }
    set_from_rectangle(rectangle, value) {
      const rx = rectangle.x;
      const ry = rectangle.y;
      this.set_rect(rx, ry, rx + rectangle.width - 1, ry + rectangle.height - 1, value);
    }
    set_filled_rect(x0, y0, x1, y1, value) {
      const dy = y1 - y0;
      const y_dir = Math.sign(dy);
      for (let i = 0; i <= Math.abs(dy); i++) {
        const target_y = y0 + i * y_dir;
        this.set_line(x0, target_y, x1, target_y, value);
      }
    }
    set_filled_from_rectangle(rectangle, value) {
      const rx = rectangle.x;
      const ry = rectangle.y;
      this.set_filled_rect(rx, ry, rx + rectangle.width - 1, ry + rectangle.height - 1, value);
    }
    toString() {
      const row_strings = Array.from(this.content, function(row) {
        return row.reduce(function(acc, val) {
          const symbol = val > 0 ? " " : "#";
          return acc + symbol;
        }, "");
      });
      return row_strings.join("\n");
    }
  };
  var BSPNode = class _BSPNode {
    constructor(id, rect) {
      this.id = id;
      this.rect = rect;
    }
    id;
    rect;
    split_offset;
    split_direction;
    left;
    right;
    hole_offset;
    static Direction = {
      horizontal: "H",
      vertical: "V"
    };
    split(direction, offset) {
      this.split_direction = direction;
      this.split_offset = offset;
      if (direction == _BSPNode.Direction.horizontal) {
        this.left = new _BSPNode(this.id + "0", new Rectangle(
          this.rect.x,
          this.rect.y,
          this.rect.width,
          offset
        ));
        this.right = new _BSPNode(this.id + "1", new Rectangle(
          this.rect.x,
          this.rect.y + offset + 1,
          this.rect.width,
          this.rect.height - offset - 1
        ));
      } else if (direction == _BSPNode.Direction.vertical) {
        this.left = new _BSPNode(this.id + "0", new Rectangle(
          this.rect.x,
          this.rect.y,
          offset,
          this.rect.height
        ));
        this.right = new _BSPNode(this.id + "1", new Rectangle(
          this.rect.x + offset + 1,
          this.rect.y,
          this.rect.width - offset - 1,
          this.rect.height
        ));
      }
    }
    get_branches() {
      if (this.left) {
        return [this].concat(this.left.get_branches()).concat(this.right.get_branches());
      } else {
        return [];
      }
    }
    get_leaves() {
      if (!this.left) {
        return [this];
      } else {
        return this.left.get_leaves().concat(this.right.get_leaves());
      }
    }
    get_wall() {
      if (this.split_direction == _BSPNode.Direction.horizontal) {
        return new Rectangle(
          this.rect.x,
          this.rect.y + this.split_offset,
          this.rect.width,
          1
        );
      } else if (this.split_direction == _BSPNode.Direction.vertical) {
        return new Rectangle(
          this.rect.x + this.split_offset,
          this.rect.y,
          1,
          this.rect.height
        );
      } else {
        return null;
      }
    }
    get_walls() {
      if (!this.left) {
        return [];
      }
      const my_wall = this.get_wall();
      return [my_wall].concat(this.left.get_walls()).concat(this.right.get_walls());
    }
    toString() {
      let depth = this.id.length - 1;
      let indent = " ".repeat(depth * 4);
      let children;
      if (this.left) {
        children = `{
${this.left.toString()}
${this.right.toString()}
${indent}}`;
      }
      return `${indent}BSPNode(${this.id}: ${this.rect.toString()} ${children || "#"})`;
    }
  };
  function do_map_splits(rng, node, n, config) {
    if (n <= 0) {
      return;
    }
    if (node.rect.width <= config.MIN_SIZE && node.rect.height <= config.MIN_SIZE) {
      return;
    }
    if (node.rect.width <= config.MAX_SIZE && node.rect.height <= config.MAX_SIZE && rng.bool({ likelihhod: config.SPLIT_END_CHANCE })) {
      return;
    }
    let split_dir;
    if (node.rect.width / node.rect.height > config.WIDTH_THRESHOLD) {
      split_dir = BSPNode.Direction.vertical;
    } else if (node.rect.height / node.rect.width > config.HEIGHT_THRESHOLD) {
      split_dir = BSPNode.Direction.horizontal;
    } else {
      split_dir = rng.bool() >= config.RANDOM_SPLIT_THRESHOLD ? BSPNode.Direction.horizontal : BSPNode.Direction.vertical;
    }
    let max;
    if (split_dir == BSPNode.Direction.horizontal) {
      max = node.rect.height - config.MIN_SIZE;
    } else {
      max = node.rect.width - config.MIN_SIZE;
    }
    if (max <= config.MIN_SIZE) {
      return;
    }
    node.split(split_dir, rng.integer(
      {
        min: config.MIN_SIZE,
        max
      }
    ));
    do_map_splits(rng, node.left, n - 1, config);
    do_map_splits(rng, node.right, n - 1, config);
  }
  function generate_map(rng) {
    let grid = new Grid(48, 24);
    const root = new BSPNode("0", new Rectangle(1, 1, grid.width - 2, grid.height - 2));
    const SPLITS = 5;
    const split_config = {
      MIN_SIZE: 5,
      MAX_SIZE: 12,
      SPLIT_END_CHANCE: 25,
      WIDTH_THRESHOLD: 1.25,
      HEIGHT_THRESHOLD: 1.25,
      RANDOM_SPLIT_THRESHOLD: 0.5
    };
    do_map_splits(rng, root, SPLITS, split_config);
    for (const leaf of root.get_leaves()) {
      grid.set_filled_from_rectangle(leaf.rect, 1);
    }
    for (const branch of root.get_branches()) {
      let wall = branch.get_wall();
      let tried = [];
      while (true) {
        let hole_offset;
        let hole_pos = { x: null, y: null };
        let neighbor_deltas = [];
        if (branch.split_direction == BSPNode.Direction.horizontal) {
          hole_offset = rng.natural({ min: 0, max: wall.width, exclude: tried });
          hole_pos.x = wall.x + hole_offset;
          hole_pos.y = wall.y;
          neighbor_deltas = [{ x: 0, y: -1 }, { x: 0, y: 1 }];
        } else {
          hole_offset = rng.natural({ min: 0, max: wall.height, exclude: tried });
          hole_pos.x = wall.x;
          hole_pos.y = wall.y + hole_offset;
          neighbor_deltas = [{ x: -1, y: 0 }, { x: 1, y: 0 }];
        }
        let ok_sides = 0;
        for (const leaf of branch.get_leaves()) {
          for (const delta of neighbor_deltas) {
            if (leaf.rect.contains_point(
              hole_pos.x + delta.x,
              hole_pos.y + delta.y
            )) {
              ok_sides += 1;
            }
          }
        }
        if (ok_sides == 2) {
          grid.set(hole_pos.x, hole_pos.y, 1);
          branch.hole_offset = hole_offset;
          break;
        } else {
          tried.push(hole_offset);
        }
      }
    }
    return { grid, tree: root };
  }
  function place_entities(rng, map) {
    const N_ENTITIES = 10;
    const entity_templates = [
      [9, 3, "Robot", "X", true, sprites.enemy.standing, -1],
      [24, 13, "Botella de agua", "X", false, sprites.items.water_bottle, 1],
      [3, 12, "DVD", "X", false, sprites.items.dvd, 1],
      [29, 7, "Pendrive", "X", false, sprites.items.pendrive, 1],
      [20, 2, "Maquina", "X", true, sprites.decoration.vending_machine, 1]
    ];
    let entities = [];
    const rooms = map.tree.get_leaves().slice(1);
    for (let i = 0; i < N_ENTITIES; i++) {
      const room_idx = rng.integer({ min: 0, max: rooms.length - 1 });
      const room = rooms[room_idx];
      const room_pos = room.rect.get_random_point(rng);
      const entity_idx = rng.integer({ min: 0, max: entity_templates.length - 1 });
      let template = entity_templates[entity_idx];
      let entity = new Entity(
        room_pos.x,
        room_pos.y,
        template[2],
        template[3],
        template[4],
        template[5]
      );
      entities.push(entity);
    }
    return entities;
  }
  function generate_level(rng, level) {
    const game_map = generate_map(rng);
    const entities = place_entities(rng, game_map);
    return new Level(level, game_map, entities);
  }

  // src/main.js
  import_hyperscript.default.browserInit();
  globalThis._hyperscript = import_hyperscript.default;
  import_hyperscript.default.use(import_template.default);
  if (!CSS.px) {
    CSS.px = function(i) {
      return `${i}px`;
    };
  }
  function zoom2(direction) {
    let base_delta = 0.05;
    if (state2.scale < 0.5) {
      base_delta = 0.0125;
    } else if (state2.scale < 0.75) {
      base_delta = 0.025;
    }
    const delta = base_delta * Math.sign(direction);
    set_zoom(state2.scale + delta, true);
  }
  function set_zoom(zoom3, do_render = false) {
    const game_view2 = document.querySelector("#game-view");
    zoom_delta = zoom3 - state2.scale;
    state2.scale = clamp(zoom3, 0.2, 2);
    typedLocalStorage.setItem("game-scale", state2.scale);
    game_view2.scrollLeft *= 1 + zoom_delta;
    game_view2.scrollTop *= 1 + zoom_delta;
    document.body.style.setProperty("--scale", state2.scale, "important");
    if (do_render) {
      render();
    }
  }
  var Entity = class _Entity {
    constructor(x, y, name, description, solid, sprite, facing, interact = null, components = {}) {
      this.id = _Entity.id_counter++;
      this.x = x;
      this.y = y;
      this.name = name;
      this.descritpion = description;
      this.solid = solid;
      this.sprite = sprite;
      this.facing = 1;
      this.interact = interact;
      for (const component in components) {
        this[component] = components[component];
      }
    }
    set_facing(dir) {
      this.facing = Math.sign(dir);
      if (this.facing == 0) {
        this.facing = 1;
      }
    }
    async move(x, y) {
      let playback_promise;
      try {
        if (this.moving) {
          return;
        }
        this.moving = true;
        this.set_facing(get_move_dir(this.x, x));
        let entity = state2.get_entity(x, y);
        let graph = new import_astar.Graph(transpose_array(state2.get_collision_map()), {
          diagonal: true
        });
        let start = graph.grid[this.x][this.y];
        let end = graph.grid[x][y];
        let result = import_astar.astar.search(graph, start, end, {
          heuristic: import_astar.astar.heuristics.diagonal
        });
        if (entity) {
          if (result.length == 0 || result.length == 1 && !entity.solid) {
            entity.interact();
            this.moving = false;
            return;
          }
        }
        playback_promise = audios2.sfx.booster.play();
        for (const step of result) {
          this.set_facing(get_move_dir(this.x, step.x));
          this.x = step.x;
          this.y = step.y;
          render();
        }
      } finally {
        this.moving = false;
        if (playback_promise) {
          audios2.sfx.booster.pause();
        }
        audios2.sfx.booster.currentTime = 0;
      }
    }
    move_relative(x_delta, y_delta) {
      this.move(this.x + x_delta, this.y + y_delta);
    }
    static id_counter = 0;
  };
  var state2 = {
    levels: [],
    level: null,
    map: {},
    player: null,
    entities: [],
    scale: 1,
    seed: 1,
    start_time: /* @__PURE__ */ new Date(),
    end_time: null,
    total_time: null,
    score: 0,
    success: false,
    kills: 0,
    get_collision_map() {
      let map_data = structuredClone(this.level.map.grid.content);
      for (let entity of this.level.entities) {
        if (entity.solid) {
          map_data[entity.y][entity.x] = 0;
        }
      }
      return map_data;
    },
    get_entity(x, y) {
      for (const entity of this.level.entities) {
        if (entity.x == x && entity.y == y) {
          return entity;
        }
      }
      return null;
    },
    remove_entity(entity) {
      let idx = this.level.entities.indexOf(entity);
      this.level.entities.splice(idx, 1);
    }
  };
  function render() {
    const entities_elt = document.querySelector("#entities");
    const entity_elements = entities_elt.children;
    const entity_ids = state2.level.entities.map(function(entity) {
      return entity.id;
    });
    for (const entity_element of Array.from(entity_elements)) {
      const entity_id = +entity_element.getAttribute("entity-id");
      if (!entity_ids.includes(entity_id)) {
        entity_element.remove();
      }
    }
    if (state2.level.entities.indexOf(state2.player) == -1) {
      state2.level.entities.push(state2.player);
    }
    for (const entity of state2.level.entities) {
      const elem_id = "entity-" + entity.id;
      let elem = document.getElementById(elem_id);
      if (!elem) {
        elem = document.createElement("div");
        elem.id = elem_id;
        elem.setAttribute("entity-id", entity.id);
        elem_img = document.createElement("img");
        elem_img.src = entity.sprite;
        elem.append(elem_img);
        entities_elt.append(elem);
      }
      elem.style.left = CSS.px(grid_to_world(entity.x));
      elem.style.top = CSS.px(grid_to_world(entity.y));
      const facing = entity.facing;
      elem.style.setProperty("--flip", entity.facing);
    }
  }
  function set_audio(category, mute) {
    if (!(category in audios2)) {
      throw Error("Invalid audio category");
    }
    typedLocalStorage.setItem(`mute-${category}`, mute);
    const category_audios = audios2[category];
    for (const name in category_audios) {
      const target = category_audios[name];
      if (mute) {
        target.volume = 0;
        if (category == "bgm") {
          target.pause();
        }
      } else {
        target.volume = target._volume;
        if (category == "bgm") {
          target.play();
        }
      }
    }
  }
  function load_settings() {
    for (const category in audios2) {
      const stored_mute = typedLocalStorage.getItem(`mute-${category}`);
      set_audio(category, stored_mute || false);
    }
    set_zoom(typedLocalStorage.getItem("game-scale") || 1);
  }
  function render_map() {
    const new_table = document.createElement("table");
    new_table.id = "map-table";
    for (let y = 0; y < state2.level.map.grid.height; y++) {
      let current_row = document.createElement("tr");
      for (let x = 0; x < state2.level.map.grid.width; x++) {
        let current_cell = document.createElement("td");
        let cell_contents = document.createElement("div");
        cell_contents.setAttribute("x", x);
        cell_contents.setAttribute("y", y);
        cell_contents.classList.add("map-cell");
        if (state2.level.map.grid.get(x, y) == 0) {
          cell_contents.classList.add("solid");
        }
        current_cell.appendChild(cell_contents);
        current_row.appendChild(current_cell);
      }
      new_table.appendChild(current_row);
    }
    const map_table = document.querySelector("#map-table");
    map_table.replaceWith(new_table);
  }
  function init_game() {
    const proc_gen = new import_chance.default();
    state2.player = new Entity(5, 3, "Jugador", "El jugador", true, sprites.player.standing, 1);
    load_settings();
    for (let i = 0; i < 5; i++) {
      const level = generate_level(proc_gen, i + 1);
      state2.levels.push(level);
    }
    state2.level = state2.levels[0];
    render_map();
    render();
  }
  server_info = JSON.parse(
    document.getElementById("server-info").text
  );
  document.addEventListener("DOMContentLoaded", init_game);
  window.dispatchEvent(new Event("gameload"));
  globalThis.state = state2;
  globalThis.zoom = zoom2;
})();
