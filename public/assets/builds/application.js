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

// node_modules/@barba/core/dist/barba.umd.js
var require_barba_umd = __commonJS({
  "node_modules/@barba/core/dist/barba.umd.js"(exports, module) {
    !(function(t, n) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = n() : "function" == typeof define && define.amd ? define(n) : (t || self).barba = n();
    })(exports, function() {
      function t(t2, n2) {
        for (var r2 = 0; r2 < n2.length; r2++) {
          var i2 = n2[r2];
          i2.enumerable = i2.enumerable || false, i2.configurable = true, "value" in i2 && (i2.writable = true), Object.defineProperty(t2, "symbol" == typeof (e2 = (function(t3, n3) {
            if ("object" != typeof t3 || null === t3) return t3;
            var r3 = t3[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var i3 = r3.call(t3, "string");
              if ("object" != typeof i3) return i3;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return String(t3);
          })(i2.key)) ? e2 : String(e2), i2);
        }
        var e2;
      }
      function n(n2, r2, i2) {
        return r2 && t(n2.prototype, r2), i2 && t(n2, i2), Object.defineProperty(n2, "prototype", { writable: false }), n2;
      }
      function r() {
        return r = Object.assign ? Object.assign.bind() : function(t2) {
          for (var n2 = 1; n2 < arguments.length; n2++) {
            var r2 = arguments[n2];
            for (var i2 in r2) Object.prototype.hasOwnProperty.call(r2, i2) && (t2[i2] = r2[i2]);
          }
          return t2;
        }, r.apply(this, arguments);
      }
      function i(t2, n2) {
        t2.prototype = Object.create(n2.prototype), t2.prototype.constructor = t2, o(t2, n2);
      }
      function e(t2) {
        return e = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t3) {
          return t3.__proto__ || Object.getPrototypeOf(t3);
        }, e(t2);
      }
      function o(t2, n2) {
        return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t3, n3) {
          return t3.__proto__ = n3, t3;
        }, o(t2, n2);
      }
      function u() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if ("function" == typeof Proxy) return true;
        try {
          return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
          })), true;
        } catch (t2) {
          return false;
        }
      }
      function s(t2, n2, r2) {
        return s = u() ? Reflect.construct.bind() : function(t3, n3, r3) {
          var i2 = [null];
          i2.push.apply(i2, n3);
          var e2 = new (Function.bind.apply(t3, i2))();
          return r3 && o(e2, r3.prototype), e2;
        }, s.apply(null, arguments);
      }
      function f(t2) {
        var n2 = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
        return f = function(t3) {
          if (null === t3 || -1 === Function.toString.call(t3).indexOf("[native code]")) return t3;
          if ("function" != typeof t3) throw new TypeError("Super expression must either be null or a function");
          if (void 0 !== n2) {
            if (n2.has(t3)) return n2.get(t3);
            n2.set(t3, r2);
          }
          function r2() {
            return s(t3, arguments, e(this).constructor);
          }
          return r2.prototype = Object.create(t3.prototype, { constructor: { value: r2, enumerable: false, writable: true, configurable: true } }), o(r2, t3);
        }, f(t2);
      }
      function c(t2) {
        if (void 0 === t2) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return t2;
      }
      var a, h = function() {
        this.before = void 0, this.beforeLeave = void 0, this.leave = void 0, this.afterLeave = void 0, this.beforeEnter = void 0, this.enter = void 0, this.afterEnter = void 0, this.after = void 0;
      };
      !(function(t2) {
        t2[t2.off = 0] = "off", t2[t2.error = 1] = "error", t2[t2.warning = 2] = "warning", t2[t2.info = 3] = "info", t2[t2.debug = 4] = "debug";
      })(a || (a = {}));
      var v = a.off, d = /* @__PURE__ */ (function() {
        function t2(t3) {
          this.t = void 0, this.t = t3;
        }
        t2.getLevel = function() {
          return v;
        }, t2.setLevel = function(t3) {
          return v = a[t3];
        };
        var n2 = t2.prototype;
        return n2.error = function() {
          this.i(console.error, a.error, [].slice.call(arguments));
        }, n2.warn = function() {
          this.i(console.warn, a.warning, [].slice.call(arguments));
        }, n2.info = function() {
          this.i(console.info, a.info, [].slice.call(arguments));
        }, n2.debug = function() {
          this.i(console.log, a.debug, [].slice.call(arguments));
        }, n2.i = function(n3, r2, i2) {
          r2 <= t2.getLevel() && n3.apply(console, ["[" + this.t + "] "].concat(i2));
        }, t2;
      })();
      function l(t2) {
        return t2.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
      }
      function p(t2) {
        return t2 && t2.sensitive ? "" : "i";
      }
      var m = { container: "container", history: "history", namespace: "namespace", prefix: "data-barba", prevent: "prevent", wrapper: "wrapper" }, w = /* @__PURE__ */ (function() {
        function t2() {
          this.o = m, this.u = void 0, this.h = { after: null, before: null, parent: null };
        }
        var n2 = t2.prototype;
        return n2.toString = function(t3) {
          return t3.outerHTML;
        }, n2.toDocument = function(t3) {
          return this.u || (this.u = new DOMParser()), this.u.parseFromString(t3, "text/html");
        }, n2.toElement = function(t3) {
          var n3 = document.createElement("div");
          return n3.innerHTML = t3, n3;
        }, n2.getHtml = function(t3) {
          return void 0 === t3 && (t3 = document), this.toString(t3.documentElement);
        }, n2.getWrapper = function(t3) {
          return void 0 === t3 && (t3 = document), t3.querySelector("[" + this.o.prefix + '="' + this.o.wrapper + '"]');
        }, n2.getContainer = function(t3) {
          return void 0 === t3 && (t3 = document), t3.querySelector("[" + this.o.prefix + '="' + this.o.container + '"]');
        }, n2.removeContainer = function(t3) {
          document.body.contains(t3) && (this.v(t3), t3.parentNode.removeChild(t3));
        }, n2.addContainer = function(t3, n3) {
          var r2 = this.getContainer() || this.h.before;
          r2 ? this.l(t3, r2) : this.h.after ? this.h.after.parentNode.insertBefore(t3, this.h.after) : this.h.parent ? this.h.parent.appendChild(t3) : n3.appendChild(t3);
        }, n2.getSibling = function() {
          return this.h;
        }, n2.getNamespace = function(t3) {
          void 0 === t3 && (t3 = document);
          var n3 = t3.querySelector("[" + this.o.prefix + "-" + this.o.namespace + "]");
          return n3 ? n3.getAttribute(this.o.prefix + "-" + this.o.namespace) : null;
        }, n2.getHref = function(t3) {
          if (t3.tagName && "a" === t3.tagName.toLowerCase()) {
            if ("string" == typeof t3.href) return t3.href;
            var n3 = t3.getAttribute("href") || t3.getAttribute("xlink:href");
            if (n3) return this.resolveUrl(n3.baseVal || n3);
          }
          return null;
        }, n2.resolveUrl = function() {
          var t3 = [].slice.call(arguments).length;
          if (0 === t3) throw new Error("resolveUrl requires at least one argument; got none.");
          var n3 = document.createElement("base");
          if (n3.href = arguments[0], 1 === t3) return n3.href;
          var r2 = document.getElementsByTagName("head")[0];
          r2.insertBefore(n3, r2.firstChild);
          for (var i2, e2 = document.createElement("a"), o2 = 1; o2 < t3; o2++) e2.href = arguments[o2], n3.href = i2 = e2.href;
          return r2.removeChild(n3), i2;
        }, n2.l = function(t3, n3) {
          n3.parentNode.insertBefore(t3, n3.nextSibling);
        }, n2.v = function(t3) {
          return this.h = { after: t3.nextElementSibling, before: t3.previousElementSibling, parent: t3.parentElement }, this.h;
        }, t2;
      })(), b = new w(), y = /* @__PURE__ */ (function() {
        function t2() {
          this.p = void 0, this.m = [], this.P = -1;
        }
        var i2 = t2.prototype;
        return i2.init = function(t3, n2) {
          this.p = "barba";
          var r2 = { data: {}, ns: n2, scroll: { x: window.scrollX, y: window.scrollY }, url: t3 };
          this.P = 0, this.m.push(r2);
          var i3 = { from: this.p, index: this.P, states: [].concat(this.m) };
          window.history && window.history.replaceState(i3, "", t3);
        }, i2.change = function(t3, n2, r2) {
          if (r2 && r2.state) {
            var i3 = r2.state, e2 = i3.index;
            n2 = this.g(this.P - e2), this.replace(i3.states), this.P = e2;
          } else this.add(t3, n2);
          return n2;
        }, i2.add = function(t3, n2, r2, i3) {
          var e2 = null != r2 ? r2 : this.R(n2), o2 = { data: null != i3 ? i3 : {}, ns: "tmp", scroll: { x: window.scrollX, y: window.scrollY }, url: t3 };
          switch (e2) {
            case "push":
              this.P = this.size, this.m.push(o2);
              break;
            case "replace":
              this.set(this.P, o2);
          }
          var u2 = { from: this.p, index: this.P, states: [].concat(this.m) };
          switch (e2) {
            case "push":
              window.history && window.history.pushState(u2, "", t3);
              break;
            case "replace":
              window.history && window.history.replaceState(u2, "", t3);
          }
        }, i2.store = function(t3, n2) {
          var i3 = n2 || this.P, e2 = this.get(i3);
          e2.data = r({}, e2.data, t3), this.set(i3, e2);
          var o2 = { from: this.p, index: this.P, states: [].concat(this.m) };
          window.history.replaceState(o2, "");
        }, i2.update = function(t3, n2) {
          var i3 = n2 || this.P, e2 = r({}, this.get(i3), t3);
          this.set(i3, e2);
        }, i2.remove = function(t3) {
          t3 ? this.m.splice(t3, 1) : this.m.pop(), this.P--;
        }, i2.clear = function() {
          this.m = [], this.P = -1;
        }, i2.replace = function(t3) {
          this.m = t3;
        }, i2.get = function(t3) {
          return this.m[t3];
        }, i2.set = function(t3, n2) {
          return this.m[t3] = n2;
        }, i2.R = function(t3) {
          var n2 = "push", r2 = t3, i3 = m.prefix + "-" + m.history;
          return r2.hasAttribute && r2.hasAttribute(i3) && (n2 = r2.getAttribute(i3)), n2;
        }, i2.g = function(t3) {
          return Math.abs(t3) > 1 ? t3 > 0 ? "forward" : "back" : 0 === t3 ? "popstate" : t3 > 0 ? "back" : "forward";
        }, n(t2, [{ key: "current", get: function() {
          return this.m[this.P];
        } }, { key: "previous", get: function() {
          return this.P < 1 ? null : this.m[this.P - 1];
        } }, { key: "size", get: function() {
          return this.m.length;
        } }]), t2;
      })(), P = new y(), g = function(t2, n2) {
        try {
          var r2 = (function() {
            if (!n2.next.html) return Promise.resolve(t2).then(function(t3) {
              var r3 = n2.next;
              if (t3) {
                var i2 = b.toElement(t3.html);
                r3.namespace = b.getNamespace(i2), r3.container = b.getContainer(i2), r3.url = t3.url, r3.html = t3.html, P.update({ ns: r3.namespace });
                var e2 = b.toDocument(t3.html);
                document.title = e2.title;
              }
            });
          })();
          return Promise.resolve(r2 && r2.then ? r2.then(function() {
          }) : void 0);
        } catch (t3) {
          return Promise.reject(t3);
        }
      }, E = function t2(n2, r2, i2) {
        return n2 instanceof RegExp ? (function(t3, n3) {
          if (!n3) return t3;
          for (var r3 = /\((?:\?<(.*?)>)?(?!\?)/g, i3 = 0, e2 = r3.exec(t3.source); e2; ) n3.push({ name: e2[1] || i3++, prefix: "", suffix: "", modifier: "", pattern: "" }), e2 = r3.exec(t3.source);
          return t3;
        })(n2, r2) : Array.isArray(n2) ? (function(n3, r3, i3) {
          var e2 = n3.map(function(n4) {
            return t2(n4, r3, i3).source;
          });
          return new RegExp("(?:".concat(e2.join("|"), ")"), p(i3));
        })(n2, r2, i2) : (function(t3, n3, r3) {
          return (function(t4, n4, r4) {
            void 0 === r4 && (r4 = {});
            for (var i3 = r4.strict, e2 = void 0 !== i3 && i3, o2 = r4.start, u2 = void 0 === o2 || o2, s2 = r4.end, f2 = void 0 === s2 || s2, c2 = r4.encode, a2 = void 0 === c2 ? function(t5) {
              return t5;
            } : c2, h2 = r4.delimiter, v2 = void 0 === h2 ? "/#?" : h2, d2 = r4.endsWith, m2 = "[".concat(l(void 0 === d2 ? "" : d2), "]|$"), w2 = "[".concat(l(v2), "]"), b2 = u2 ? "^" : "", y2 = 0, P2 = t4; y2 < P2.length; y2++) {
              var g2 = P2[y2];
              if ("string" == typeof g2) b2 += l(a2(g2));
              else {
                var E2 = l(a2(g2.prefix)), x2 = l(a2(g2.suffix));
                if (g2.pattern) if (n4 && n4.push(g2), E2 || x2) if ("+" === g2.modifier || "*" === g2.modifier) {
                  var R2 = "*" === g2.modifier ? "?" : "";
                  b2 += "(?:".concat(E2, "((?:").concat(g2.pattern, ")(?:").concat(x2).concat(E2, "(?:").concat(g2.pattern, "))*)").concat(x2, ")").concat(R2);
                } else b2 += "(?:".concat(E2, "(").concat(g2.pattern, ")").concat(x2, ")").concat(g2.modifier);
                else b2 += "+" === g2.modifier || "*" === g2.modifier ? "((?:".concat(g2.pattern, ")").concat(g2.modifier, ")") : "(".concat(g2.pattern, ")").concat(g2.modifier);
                else b2 += "(?:".concat(E2).concat(x2, ")").concat(g2.modifier);
              }
            }
            if (f2) e2 || (b2 += "".concat(w2, "?")), b2 += r4.endsWith ? "(?=".concat(m2, ")") : "$";
            else {
              var k2 = t4[t4.length - 1], O2 = "string" == typeof k2 ? w2.indexOf(k2[k2.length - 1]) > -1 : void 0 === k2;
              e2 || (b2 += "(?:".concat(w2, "(?=").concat(m2, "))?")), O2 || (b2 += "(?=".concat(w2, "|").concat(m2, ")"));
            }
            return new RegExp(b2, p(r4));
          })((function(t4, n4) {
            void 0 === n4 && (n4 = {});
            for (var r4 = (function(t5) {
              for (var n5 = [], r5 = 0; r5 < t5.length; ) {
                var i4 = t5[r5];
                if ("*" !== i4 && "+" !== i4 && "?" !== i4) if ("\\" !== i4) if ("{" !== i4) if ("}" !== i4) if (":" !== i4) if ("(" !== i4) n5.push({ type: "CHAR", index: r5, value: t5[r5++] });
                else {
                  var e3 = 1, o3 = "";
                  if ("?" === t5[s3 = r5 + 1]) throw new TypeError('Pattern cannot start with "?" at '.concat(s3));
                  for (; s3 < t5.length; ) if ("\\" !== t5[s3]) {
                    if (")" === t5[s3]) {
                      if (0 == --e3) {
                        s3++;
                        break;
                      }
                    } else if ("(" === t5[s3] && (e3++, "?" !== t5[s3 + 1])) throw new TypeError("Capturing groups are not allowed at ".concat(s3));
                    o3 += t5[s3++];
                  } else o3 += t5[s3++] + t5[s3++];
                  if (e3) throw new TypeError("Unbalanced pattern at ".concat(r5));
                  if (!o3) throw new TypeError("Missing pattern at ".concat(r5));
                  n5.push({ type: "PATTERN", index: r5, value: o3 }), r5 = s3;
                }
                else {
                  for (var u3 = "", s3 = r5 + 1; s3 < t5.length; ) {
                    var f3 = t5.charCodeAt(s3);
                    if (!(f3 >= 48 && f3 <= 57 || f3 >= 65 && f3 <= 90 || f3 >= 97 && f3 <= 122 || 95 === f3)) break;
                    u3 += t5[s3++];
                  }
                  if (!u3) throw new TypeError("Missing parameter name at ".concat(r5));
                  n5.push({ type: "NAME", index: r5, value: u3 }), r5 = s3;
                }
                else n5.push({ type: "CLOSE", index: r5, value: t5[r5++] });
                else n5.push({ type: "OPEN", index: r5, value: t5[r5++] });
                else n5.push({ type: "ESCAPED_CHAR", index: r5++, value: t5[r5++] });
                else n5.push({ type: "MODIFIER", index: r5, value: t5[r5++] });
              }
              return n5.push({ type: "END", index: r5, value: "" }), n5;
            })(t4), i3 = n4.prefixes, e2 = void 0 === i3 ? "./" : i3, o2 = "[^".concat(l(n4.delimiter || "/#?"), "]+?"), u2 = [], s2 = 0, f2 = 0, c2 = "", a2 = function(t5) {
              if (f2 < r4.length && r4[f2].type === t5) return r4[f2++].value;
            }, h2 = function(t5) {
              var n5 = a2(t5);
              if (void 0 !== n5) return n5;
              var i4 = r4[f2], e3 = i4.index;
              throw new TypeError("Unexpected ".concat(i4.type, " at ").concat(e3, ", expected ").concat(t5));
            }, v2 = function() {
              for (var t5, n5 = ""; t5 = a2("CHAR") || a2("ESCAPED_CHAR"); ) n5 += t5;
              return n5;
            }; f2 < r4.length; ) {
              var d2 = a2("CHAR"), p2 = a2("NAME"), m2 = a2("PATTERN");
              if (p2 || m2) -1 === e2.indexOf(b2 = d2 || "") && (c2 += b2, b2 = ""), c2 && (u2.push(c2), c2 = ""), u2.push({ name: p2 || s2++, prefix: b2, suffix: "", pattern: m2 || o2, modifier: a2("MODIFIER") || "" });
              else {
                var w2 = d2 || a2("ESCAPED_CHAR");
                if (w2) c2 += w2;
                else if (c2 && (u2.push(c2), c2 = ""), a2("OPEN")) {
                  var b2 = v2(), y2 = a2("NAME") || "", P2 = a2("PATTERN") || "", g2 = v2();
                  h2("CLOSE"), u2.push({ name: y2 || (P2 ? s2++ : ""), pattern: y2 && !P2 ? o2 : P2, prefix: b2, suffix: g2, modifier: a2("MODIFIER") || "" });
                } else h2("END");
              }
            }
            return u2;
          })(t3, r3), n3, r3);
        })(n2, r2, i2);
      }, x = { __proto__: null, update: g, nextTick: function() {
        return new Promise(function(t2) {
          window.requestAnimationFrame(t2);
        });
      }, pathToRegexp: E }, R = function() {
        return window.location.origin;
      }, k = function(t2) {
        return void 0 === t2 && (t2 = window.location.href), O(t2).port;
      }, O = function(t2) {
        var n2, r2 = t2.match(/:\d+/);
        if (null === r2) /^http/.test(t2) && (n2 = 80), /^https/.test(t2) && (n2 = 443);
        else {
          var i2 = r2[0].substring(1);
          n2 = parseInt(i2, 10);
        }
        var e2, o2 = t2.replace(R(), ""), u2 = {}, s2 = o2.indexOf("#");
        s2 >= 0 && (e2 = o2.slice(s2 + 1), o2 = o2.slice(0, s2));
        var f2 = o2.indexOf("?");
        return f2 >= 0 && (u2 = T(o2.slice(f2 + 1)), o2 = o2.slice(0, f2)), { hash: e2, path: o2, port: n2, query: u2 };
      }, T = function(t2) {
        return t2.split("&").reduce(function(t3, n2) {
          var r2 = n2.split("=");
          return t3[r2[0]] = r2[1], t3;
        }, {});
      }, A = function(t2) {
        return void 0 === t2 && (t2 = window.location.href), t2.replace(/(\/#.*|\/|#.*)$/, "");
      }, j = { __proto__: null, getHref: function() {
        return window.location.href;
      }, getAbsoluteHref: function(t2, n2) {
        return void 0 === n2 && (n2 = document.baseURI), new URL(t2, n2).href;
      }, getOrigin: R, getPort: k, getPath: function(t2) {
        return void 0 === t2 && (t2 = window.location.href), O(t2).path;
      }, getQuery: function(t2, n2) {
        return void 0 === n2 && (n2 = false), n2 ? JSON.stringify(O(t2).query) : O(t2).query;
      }, getHash: function(t2) {
        return O(t2).hash;
      }, parse: O, parseQuery: T, clean: A };
      function M(t2, n2, i2, e2, o2) {
        return void 0 === n2 && (n2 = 2e3), new Promise(function(u2, s2) {
          var f2 = new XMLHttpRequest();
          f2.onreadystatechange = function() {
            if (f2.readyState === XMLHttpRequest.DONE) {
              if (200 === f2.status) {
                var n3 = "" !== f2.responseURL && f2.responseURL !== t2 ? f2.responseURL : t2;
                u2({ html: f2.responseText, url: r({ href: n3 }, O(n3)) }), e2.update(t2, { status: "fulfilled", target: n3 });
              } else if (f2.status) {
                var o3 = { status: f2.status, statusText: f2.statusText };
                i2(t2, o3), s2(o3), e2.update(t2, { status: "rejected" });
              }
            }
          }, f2.ontimeout = function() {
            var r2 = new Error("Timeout error [" + n2 + "]");
            i2(t2, r2), s2(r2), e2.update(t2, { status: "rejected" });
          }, f2.onerror = function() {
            var n3 = new Error("Fetch error");
            i2(t2, n3), s2(n3), e2.update(t2, { status: "rejected" });
          }, f2.open("GET", t2), f2.timeout = n2, f2.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml"), f2.setRequestHeader("x-barba", "yes"), o2.all().forEach(function(t3, n3) {
            f2.setRequestHeader(n3, t3);
          }), f2.send();
        });
      }
      function N(t2) {
        return !!t2 && ("object" == typeof t2 || "function" == typeof t2) && "function" == typeof t2.then;
      }
      function S(t2, n2) {
        return void 0 === n2 && (n2 = {}), function() {
          var r2 = arguments, i2 = false, e2 = new Promise(function(e3, o2) {
            n2.async = function() {
              return i2 = true, function(t3, n3) {
                t3 ? o2(t3) : e3(n3);
              };
            };
            var u2 = t2.apply(n2, [].slice.call(r2));
            i2 || (N(u2) ? u2.then(e3, o2) : e3(u2));
          });
          return e2;
        };
      }
      var C = /* @__PURE__ */ (function(t2) {
        function n2() {
          var n3;
          return (n3 = t2.call(this) || this).logger = new d("@barba/core"), n3.all = ["ready", "page", "reset", "currentAdded", "currentRemoved", "nextAdded", "nextRemoved", "beforeOnce", "once", "afterOnce", "before", "beforeLeave", "leave", "afterLeave", "beforeEnter", "enter", "afterEnter", "after"], n3.registered = /* @__PURE__ */ new Map(), n3.init(), n3;
        }
        i(n2, t2);
        var r2 = n2.prototype;
        return r2.init = function() {
          var t3 = this;
          this.registered.clear(), this.all.forEach(function(n3) {
            t3[n3] || (t3[n3] = function(r3, i2) {
              t3.registered.has(n3) || t3.registered.set(n3, /* @__PURE__ */ new Set()), t3.registered.get(n3).add({ ctx: i2 || {}, fn: r3 });
            });
          });
        }, r2.do = function(t3) {
          var n3 = arguments, r3 = this;
          if (this.registered.has(t3)) {
            var i2 = Promise.resolve();
            return this.registered.get(t3).forEach(function(t4) {
              i2 = i2.then(function() {
                return S(t4.fn, t4.ctx).apply(void 0, [].slice.call(n3, 1));
              });
            }), i2.catch(function(n4) {
              r3.logger.debug("Hook error [" + t3 + "]"), r3.logger.error(n4);
            });
          }
          return Promise.resolve();
        }, r2.clear = function() {
          var t3 = this;
          this.all.forEach(function(n3) {
            delete t3[n3];
          }), this.init();
        }, r2.help = function() {
          this.logger.info("Available hooks: " + this.all.join(","));
          var t3 = [];
          this.registered.forEach(function(n3, r3) {
            return t3.push(r3);
          }), this.logger.info("Registered hooks: " + t3.join(","));
        }, n2;
      })(h), L = new C(), H = /* @__PURE__ */ (function() {
        function t2(t3) {
          if (this.k = void 0, this.O = [], "boolean" == typeof t3) this.k = t3;
          else {
            var n2 = Array.isArray(t3) ? t3 : [t3];
            this.O = n2.map(function(t4) {
              return E(t4);
            });
          }
        }
        return t2.prototype.checkHref = function(t3) {
          if ("boolean" == typeof this.k) return this.k;
          var n2 = O(t3).path;
          return this.O.some(function(t4) {
            return null !== t4.exec(n2);
          });
        }, t2;
      })(), _ = /* @__PURE__ */ (function(t2) {
        function n2(n3) {
          var r2;
          return (r2 = t2.call(this, n3) || this).T = /* @__PURE__ */ new Map(), r2;
        }
        i(n2, t2);
        var e2 = n2.prototype;
        return e2.set = function(t3, n3, r2, i2, e3) {
          return this.T.set(t3, { action: r2, request: n3, status: i2, target: null != e3 ? e3 : t3 }), { action: r2, request: n3, status: i2, target: e3 };
        }, e2.get = function(t3) {
          return this.T.get(t3);
        }, e2.getRequest = function(t3) {
          return this.T.get(t3).request;
        }, e2.getAction = function(t3) {
          return this.T.get(t3).action;
        }, e2.getStatus = function(t3) {
          return this.T.get(t3).status;
        }, e2.getTarget = function(t3) {
          return this.T.get(t3).target;
        }, e2.has = function(t3) {
          return !this.checkHref(t3) && this.T.has(t3);
        }, e2.delete = function(t3) {
          return this.T.delete(t3);
        }, e2.update = function(t3, n3) {
          var i2 = r({}, this.T.get(t3), n3);
          return this.T.set(t3, i2), i2;
        }, n2;
      })(H), D = /* @__PURE__ */ (function() {
        function t2() {
          this.A = /* @__PURE__ */ new Map();
        }
        var n2 = t2.prototype;
        return n2.set = function(t3, n3) {
          return this.A.set(t3, n3), { name: n3 };
        }, n2.get = function(t3) {
          return this.A.get(t3);
        }, n2.all = function() {
          return this.A;
        }, n2.has = function(t3) {
          return this.A.has(t3);
        }, n2.delete = function(t3) {
          return this.A.delete(t3);
        }, n2.clear = function() {
          return this.A.clear();
        }, t2;
      })(), B = function() {
        return !window.history.pushState;
      }, q = function(t2) {
        return !t2.el || !t2.href;
      }, F = function(t2) {
        var n2 = t2.event;
        return n2.which > 1 || n2.metaKey || n2.ctrlKey || n2.shiftKey || n2.altKey;
      }, I = function(t2) {
        var n2 = t2.el;
        return n2.hasAttribute("target") && "_blank" === n2.target;
      }, U = function(t2) {
        var n2 = t2.el;
        return void 0 !== n2.protocol && window.location.protocol !== n2.protocol || void 0 !== n2.hostname && window.location.hostname !== n2.hostname;
      }, $ = function(t2) {
        var n2 = t2.el;
        return void 0 !== n2.port && k() !== k(n2.href);
      }, Q = function(t2) {
        var n2 = t2.el;
        return n2.getAttribute && "string" == typeof n2.getAttribute("download");
      }, X = function(t2) {
        return t2.el.hasAttribute(m.prefix + "-" + m.prevent);
      }, z = function(t2) {
        return Boolean(t2.el.closest("[" + m.prefix + "-" + m.prevent + '="all"]'));
      }, G = function(t2) {
        var n2 = t2.href;
        return A(n2) === A() && k(n2) === k();
      }, J = /* @__PURE__ */ (function(t2) {
        function n2(n3) {
          var r3;
          return (r3 = t2.call(this, n3) || this).suite = [], r3.tests = /* @__PURE__ */ new Map(), r3.init(), r3;
        }
        i(n2, t2);
        var r2 = n2.prototype;
        return r2.init = function() {
          this.add("pushState", B), this.add("exists", q), this.add("newTab", F), this.add("blank", I), this.add("corsDomain", U), this.add("corsPort", $), this.add("download", Q), this.add("preventSelf", X), this.add("preventAll", z), this.add("sameUrl", G, false);
        }, r2.add = function(t3, n3, r3) {
          void 0 === r3 && (r3 = true), this.tests.set(t3, n3), r3 && this.suite.push(t3);
        }, r2.run = function(t3, n3, r3, i2) {
          return this.tests.get(t3)({ el: n3, event: r3, href: i2 });
        }, r2.checkLink = function(t3, n3, r3) {
          var i2 = this;
          return this.suite.some(function(e2) {
            return i2.run(e2, t3, n3, r3);
          });
        }, n2;
      })(H), W = /* @__PURE__ */ (function(t2) {
        function n2(r2, i2) {
          var e2;
          return void 0 === i2 && (i2 = "Barba error"), (e2 = t2.call.apply(t2, [this].concat([].slice.call(arguments, 2))) || this).error = void 0, e2.label = void 0, e2.error = r2, e2.label = i2, Error.captureStackTrace && Error.captureStackTrace(c(e2), n2), e2.name = "BarbaError", e2;
        }
        return i(n2, t2), n2;
      })(/* @__PURE__ */ f(Error)), K = /* @__PURE__ */ (function() {
        function t2(t3) {
          void 0 === t3 && (t3 = []), this.logger = new d("@barba/core"), this.all = [], this.page = [], this.once = [], this.j = [{ name: "namespace", type: "strings" }, { name: "custom", type: "function" }], t3 && (this.all = this.all.concat(t3)), this.update();
        }
        var n2 = t2.prototype;
        return n2.add = function(t3, n3) {
          "rule" === t3 ? this.j.splice(n3.position || 0, 0, n3.value) : this.all.push(n3), this.update();
        }, n2.resolve = function(t3, n3) {
          var r2 = this;
          void 0 === n3 && (n3 = {});
          var i2 = n3.once ? this.once : this.page;
          i2 = i2.filter(n3.self ? function(t4) {
            return t4.name && "self" === t4.name;
          } : function(t4) {
            return !t4.name || "self" !== t4.name;
          });
          var e2 = /* @__PURE__ */ new Map(), o2 = i2.find(function(i3) {
            var o3 = true, u3 = {};
            return n3.self && "self" === i3.name ? (e2.set(i3, u3), true) : (r2.j.reverse().forEach(function(n4) {
              o3 && (o3 = r2.M(i3, n4, t3, u3), i3.from && i3.to && (o3 = r2.M(i3, n4, t3, u3, "from") && r2.M(i3, n4, t3, u3, "to")), i3.from && !i3.to && (o3 = r2.M(i3, n4, t3, u3, "from")), !i3.from && i3.to && (o3 = r2.M(i3, n4, t3, u3, "to")));
            }), e2.set(i3, u3), o3);
          }), u2 = e2.get(o2), s2 = [];
          if (s2.push(n3.once ? "once" : "page"), n3.self && s2.push("self"), u2) {
            var f2, c2 = [o2];
            Object.keys(u2).length > 0 && c2.push(u2), (f2 = this.logger).info.apply(f2, ["Transition found [" + s2.join(",") + "]"].concat(c2));
          } else this.logger.info("No transition found [" + s2.join(",") + "]");
          return o2;
        }, n2.update = function() {
          var t3 = this;
          this.all = this.all.map(function(n3) {
            return t3.N(n3);
          }).sort(function(t4, n3) {
            return t4.priority - n3.priority;
          }).reverse().map(function(t4) {
            return delete t4.priority, t4;
          }), this.page = this.all.filter(function(t4) {
            return void 0 !== t4.leave || void 0 !== t4.enter;
          }), this.once = this.all.filter(function(t4) {
            return void 0 !== t4.once;
          });
        }, n2.M = function(t3, n3, r2, i2, e2) {
          var o2 = true, u2 = false, s2 = t3, f2 = n3.name, c2 = f2, a2 = f2, h2 = f2, v2 = e2 ? s2[e2] : s2, d2 = "to" === e2 ? r2.next : r2.current;
          if (e2 ? v2 && v2[f2] : v2[f2]) {
            switch (n3.type) {
              case "strings":
              default:
                var l2 = Array.isArray(v2[c2]) ? v2[c2] : [v2[c2]];
                d2[c2] && -1 !== l2.indexOf(d2[c2]) && (u2 = true), -1 === l2.indexOf(d2[c2]) && (o2 = false);
                break;
              case "object":
                var p2 = Array.isArray(v2[a2]) ? v2[a2] : [v2[a2]];
                d2[a2] ? (d2[a2].name && -1 !== p2.indexOf(d2[a2].name) && (u2 = true), -1 === p2.indexOf(d2[a2].name) && (o2 = false)) : o2 = false;
                break;
              case "function":
                v2[h2](r2) ? u2 = true : o2 = false;
            }
            u2 && (e2 ? (i2[e2] = i2[e2] || {}, i2[e2][f2] = s2[e2][f2]) : i2[f2] = s2[f2]);
          }
          return o2;
        }, n2.S = function(t3, n3, r2) {
          var i2 = 0;
          return (t3[n3] || t3.from && t3.from[n3] || t3.to && t3.to[n3]) && (i2 += Math.pow(10, r2), t3.from && t3.from[n3] && (i2 += 1), t3.to && t3.to[n3] && (i2 += 2)), i2;
        }, n2.N = function(t3) {
          var n3 = this;
          t3.priority = 0;
          var r2 = 0;
          return this.j.forEach(function(i2, e2) {
            r2 += n3.S(t3, i2.name, e2 + 1);
          }), t3.priority = r2, t3;
        }, t2;
      })();
      function V(t2, n2) {
        try {
          var r2 = t2();
        } catch (t3) {
          return n2(t3);
        }
        return r2 && r2.then ? r2.then(void 0, n2) : r2;
      }
      var Y = /* @__PURE__ */ (function() {
        function t2(t3) {
          void 0 === t3 && (t3 = []), this.logger = new d("@barba/core"), this.store = void 0, this.C = false, this.store = new K(t3);
        }
        var r2 = t2.prototype;
        return r2.get = function(t3, n2) {
          return this.store.resolve(t3, n2);
        }, r2.doOnce = function(t3) {
          var n2 = t3.data, r3 = t3.transition;
          try {
            var i2 = function() {
              e2.C = false;
            }, e2 = this, o2 = r3 || {};
            e2.C = true;
            var u2 = V(function() {
              return Promise.resolve(e2.L("beforeOnce", n2, o2)).then(function() {
                return Promise.resolve(e2.once(n2, o2)).then(function() {
                  return Promise.resolve(e2.L("afterOnce", n2, o2)).then(function() {
                  });
                });
              });
            }, function(t4) {
              e2.C = false, e2.logger.debug("Transition error [before/after/once]"), e2.logger.error(t4);
            });
            return Promise.resolve(u2 && u2.then ? u2.then(i2) : i2());
          } catch (t4) {
            return Promise.reject(t4);
          }
        }, r2.doPage = function(t3) {
          var n2 = t3.data, r3 = t3.transition, i2 = t3.page, e2 = t3.wrapper;
          try {
            var o2 = function(t4) {
              u2.C = false;
            }, u2 = this, s2 = r3 || {}, f2 = true === s2.sync || false;
            u2.C = true;
            var c2 = V(function() {
              function t4() {
                return Promise.resolve(u2.L("before", n2, s2)).then(function() {
                  function t5(t6) {
                    return Promise.resolve(u2.remove(n2)).then(function() {
                      return Promise.resolve(u2.L("after", n2, s2)).then(function() {
                      });
                    });
                  }
                  var r5 = (function() {
                    if (f2) return V(function() {
                      return Promise.resolve(u2.add(n2, e2)).then(function() {
                        return Promise.resolve(u2.L("beforeLeave", n2, s2)).then(function() {
                          return Promise.resolve(u2.L("beforeEnter", n2, s2)).then(function() {
                            return Promise.resolve(Promise.all([u2.leave(n2, s2), u2.enter(n2, s2)])).then(function() {
                              return Promise.resolve(u2.L("afterLeave", n2, s2)).then(function() {
                                return Promise.resolve(u2.L("afterEnter", n2, s2)).then(function() {
                                });
                              });
                            });
                          });
                        });
                      });
                    }, function(t7) {
                      if (u2.H(t7)) throw new W(t7, "Transition error [sync]");
                    });
                    var t6 = function(t7) {
                      return V(function() {
                        var t8 = (function() {
                          if (false !== r6) return Promise.resolve(u2.add(n2, e2)).then(function() {
                            return Promise.resolve(u2.L("beforeEnter", n2, s2)).then(function() {
                              return Promise.resolve(u2.enter(n2, s2, r6)).then(function() {
                                return Promise.resolve(u2.L("afterEnter", n2, s2)).then(function() {
                                });
                              });
                            });
                          });
                        })();
                        if (t8 && t8.then) return t8.then(function() {
                        });
                      }, function(t8) {
                        if (u2.H(t8)) throw new W(t8, "Transition error [before/after/enter]");
                      });
                    }, r6 = false, o3 = V(function() {
                      return Promise.resolve(u2.L("beforeLeave", n2, s2)).then(function() {
                        return Promise.resolve(Promise.all([u2.leave(n2, s2), g(i2, n2)]).then(function(t7) {
                          return t7[0];
                        })).then(function(t7) {
                          return r6 = t7, Promise.resolve(u2.L("afterLeave", n2, s2)).then(function() {
                          });
                        });
                      });
                    }, function(t7) {
                      if (u2.H(t7)) throw new W(t7, "Transition error [before/after/leave]");
                    });
                    return o3 && o3.then ? o3.then(t6) : t6();
                  })();
                  return r5 && r5.then ? r5.then(t5) : t5();
                });
              }
              var r4 = (function() {
                if (f2) return Promise.resolve(g(i2, n2)).then(function() {
                });
              })();
              return r4 && r4.then ? r4.then(t4) : t4();
            }, function(t4) {
              if (u2.C = false, t4.name && "BarbaError" === t4.name) throw u2.logger.debug(t4.label), u2.logger.error(t4.error), t4;
              throw u2.logger.debug("Transition error [page]"), u2.logger.error(t4), t4;
            });
            return Promise.resolve(c2 && c2.then ? c2.then(o2) : o2());
          } catch (t4) {
            return Promise.reject(t4);
          }
        }, r2.once = function(t3, n2) {
          try {
            return Promise.resolve(L.do("once", t3, n2)).then(function() {
              return n2.once ? S(n2.once, n2)(t3) : Promise.resolve();
            });
          } catch (t4) {
            return Promise.reject(t4);
          }
        }, r2.leave = function(t3, n2) {
          try {
            return Promise.resolve(L.do("leave", t3, n2)).then(function() {
              return n2.leave ? S(n2.leave, n2)(t3) : Promise.resolve();
            });
          } catch (t4) {
            return Promise.reject(t4);
          }
        }, r2.enter = function(t3, n2, r3) {
          try {
            return Promise.resolve(L.do("enter", t3, n2)).then(function() {
              return n2.enter ? S(n2.enter, n2)(t3, r3) : Promise.resolve();
            });
          } catch (t4) {
            return Promise.reject(t4);
          }
        }, r2.add = function(t3, n2) {
          try {
            return b.addContainer(t3.next.container, n2), L.do("nextAdded", t3), Promise.resolve();
          } catch (t4) {
            return Promise.reject(t4);
          }
        }, r2.remove = function(t3) {
          try {
            return b.removeContainer(t3.current.container), L.do("currentRemoved", t3), Promise.resolve();
          } catch (t4) {
            return Promise.reject(t4);
          }
        }, r2.H = function(t3) {
          return t3.message ? !/Timeout error|Fetch error/.test(t3.message) : !t3.status;
        }, r2.L = function(t3, n2, r3) {
          try {
            return Promise.resolve(L.do(t3, n2, r3)).then(function() {
              return r3[t3] ? S(r3[t3], r3)(n2) : Promise.resolve();
            });
          } catch (t4) {
            return Promise.reject(t4);
          }
        }, n(t2, [{ key: "isRunning", get: function() {
          return this.C;
        }, set: function(t3) {
          this.C = t3;
        } }, { key: "hasOnce", get: function() {
          return this.store.once.length > 0;
        } }, { key: "hasSelf", get: function() {
          return this.store.all.some(function(t3) {
            return "self" === t3.name;
          });
        } }, { key: "shouldWait", get: function() {
          return this.store.all.some(function(t3) {
            return t3.to && !t3.to.route || t3.sync;
          });
        } }]), t2;
      })(), Z = /* @__PURE__ */ (function() {
        function t2(t3) {
          var n2 = this;
          this.names = ["beforeLeave", "afterLeave", "beforeEnter", "afterEnter"], this.byNamespace = /* @__PURE__ */ new Map(), 0 !== t3.length && (t3.forEach(function(t4) {
            n2.byNamespace.set(t4.namespace, t4);
          }), this.names.forEach(function(t4) {
            L[t4](n2._(t4));
          }));
        }
        return t2.prototype._ = function(t3) {
          var n2 = this;
          return function(r2) {
            var i2 = t3.match(/enter/i) ? r2.next : r2.current, e2 = n2.byNamespace.get(i2.namespace);
            return e2 && e2[t3] ? S(e2[t3], e2)(r2) : Promise.resolve();
          };
        }, t2;
      })();
      Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector), Element.prototype.closest || (Element.prototype.closest = function(t2) {
        var n2 = this;
        do {
          if (n2.matches(t2)) return n2;
          n2 = n2.parentElement || n2.parentNode;
        } while (null !== n2 && 1 === n2.nodeType);
        return null;
      });
      var tt = { container: null, html: "", namespace: "", url: { hash: "", href: "", path: "", port: null, query: {} } }, nt = /* @__PURE__ */ (function() {
        function t2() {
          this.version = "2.10.3", this.schemaPage = tt, this.Logger = d, this.logger = new d("@barba/core"), this.plugins = [], this.timeout = void 0, this.cacheIgnore = void 0, this.cacheFirstPage = void 0, this.prefetchIgnore = void 0, this.preventRunning = void 0, this.hooks = L, this.cache = void 0, this.headers = void 0, this.prevent = void 0, this.transitions = void 0, this.views = void 0, this.dom = b, this.helpers = x, this.history = P, this.request = M, this.url = j, this.D = void 0, this.B = void 0, this.q = void 0, this.F = void 0;
        }
        var i2 = t2.prototype;
        return i2.use = function(t3, n2) {
          var r2 = this.plugins;
          r2.indexOf(t3) > -1 ? this.logger.warn("Plugin [" + t3.name + "] already installed.") : "function" == typeof t3.install ? (t3.install(this, n2), r2.push(t3)) : this.logger.warn("Plugin [" + t3.name + '] has no "install" method.');
        }, i2.init = function(t3) {
          var n2 = void 0 === t3 ? {} : t3, i3 = n2.transitions, e2 = void 0 === i3 ? [] : i3, o2 = n2.views, u2 = void 0 === o2 ? [] : o2, s2 = n2.schema, f2 = void 0 === s2 ? m : s2, c2 = n2.requestError, a2 = n2.timeout, h2 = void 0 === a2 ? 2e3 : a2, v2 = n2.cacheIgnore, l2 = void 0 !== v2 && v2, p2 = n2.cacheFirstPage, w2 = void 0 !== p2 && p2, b2 = n2.prefetchIgnore, y2 = void 0 !== b2 && b2, P2 = n2.preventRunning, g2 = void 0 !== P2 && P2, E2 = n2.prevent, x2 = void 0 === E2 ? null : E2, R2 = n2.debug, k2 = n2.logLevel;
          if (d.setLevel(true === (void 0 !== R2 && R2) ? "debug" : void 0 === k2 ? "off" : k2), this.logger.info(this.version), Object.keys(f2).forEach(function(t4) {
            m[t4] && (m[t4] = f2[t4]);
          }), this.B = c2, this.timeout = h2, this.cacheIgnore = l2, this.cacheFirstPage = w2, this.prefetchIgnore = y2, this.preventRunning = g2, this.q = this.dom.getWrapper(), !this.q) throw new Error("[@barba/core] No Barba wrapper found");
          this.I();
          var O2 = this.data.current;
          if (!O2.container) throw new Error("[@barba/core] No Barba container found");
          if (this.cache = new _(l2), this.headers = new D(), this.prevent = new J(y2), this.transitions = new Y(e2), this.views = new Z(u2), null !== x2) {
            if ("function" != typeof x2) throw new Error("[@barba/core] Prevent should be a function");
            this.prevent.add("preventCustom", x2);
          }
          this.history.init(O2.url.href, O2.namespace), w2 && this.cache.set(O2.url.href, Promise.resolve({ html: O2.html, url: O2.url }), "init", "fulfilled"), this.U = this.U.bind(this), this.$ = this.$.bind(this), this.X = this.X.bind(this), this.G(), this.plugins.forEach(function(t4) {
            return t4.init();
          });
          var T2 = this.data;
          T2.trigger = "barba", T2.next = T2.current, T2.current = r({}, this.schemaPage), this.hooks.do("ready", T2), this.once(T2), this.I();
        }, i2.destroy = function() {
          this.I(), this.J(), this.history.clear(), this.hooks.clear(), this.plugins = [];
        }, i2.force = function(t3) {
          window.location.assign(t3);
        }, i2.go = function(t3, n2, r2) {
          var i3;
          if (void 0 === n2 && (n2 = "barba"), this.F = null, this.transitions.isRunning) this.force(t3);
          else if (!(i3 = "popstate" === n2 ? this.history.current && this.url.getPath(this.history.current.url) === this.url.getPath(t3) && this.url.getQuery(this.history.current.url, true) === this.url.getQuery(t3, true) : this.prevent.run("sameUrl", null, null, t3)) || this.transitions.hasSelf) return n2 = this.history.change(this.cache.has(t3) ? this.cache.get(t3).target : t3, n2, r2), r2 && (r2.stopPropagation(), r2.preventDefault()), this.page(t3, n2, null != r2 ? r2 : void 0, i3);
        }, i2.once = function(t3) {
          try {
            var n2 = this;
            return Promise.resolve(n2.hooks.do("beforeEnter", t3)).then(function() {
              function r2() {
                return Promise.resolve(n2.hooks.do("afterEnter", t3)).then(function() {
                });
              }
              var i3 = (function() {
                if (n2.transitions.hasOnce) {
                  var r3 = n2.transitions.get(t3, { once: true });
                  return Promise.resolve(n2.transitions.doOnce({ transition: r3, data: t3 })).then(function() {
                  });
                }
              })();
              return i3 && i3.then ? i3.then(r2) : r2();
            });
          } catch (t4) {
            return Promise.reject(t4);
          }
        }, i2.page = function(t3, n2, i3, e2) {
          try {
            var o2, u2 = function() {
              var t4 = s2.data;
              return Promise.resolve(s2.hooks.do("page", t4)).then(function() {
                var n3 = (function(n4, r2) {
                  try {
                    var i4 = (u3 = s2.transitions.get(t4, { once: false, self: e2 }), Promise.resolve(s2.transitions.doPage({ data: t4, page: o2, transition: u3, wrapper: s2.q })).then(function() {
                      s2.I();
                    }));
                  } catch (t5) {
                    return r2();
                  }
                  var u3;
                  return i4 && i4.then ? i4.then(void 0, r2) : i4;
                })(0, function() {
                  0 === d.getLevel() && s2.force(t4.next.url.href);
                });
                if (n3 && n3.then) return n3.then(function() {
                });
              });
            }, s2 = this;
            if (s2.data.next.url = r({ href: t3 }, s2.url.parse(t3)), s2.data.trigger = n2, s2.data.event = i3, s2.cache.has(t3)) o2 = s2.cache.update(t3, { action: "click" }).request;
            else {
              var f2 = s2.request(t3, s2.timeout, s2.onRequestError.bind(s2, n2), s2.cache, s2.headers);
              f2.then(function(r2) {
                r2.url.href !== t3 && s2.history.add(r2.url.href, n2, "replace");
              }), o2 = s2.cache.set(t3, f2, "click", "pending").request;
            }
            var c2 = (function() {
              if (s2.transitions.shouldWait) return Promise.resolve(g(o2, s2.data)).then(function() {
              });
            })();
            return Promise.resolve(c2 && c2.then ? c2.then(u2) : u2());
          } catch (t4) {
            return Promise.reject(t4);
          }
        }, i2.onRequestError = function(t3) {
          this.transitions.isRunning = false;
          var n2 = [].slice.call(arguments, 1), r2 = n2[0], i3 = n2[1], e2 = this.cache.getAction(r2);
          return this.cache.delete(r2), this.B && false === this.B(t3, e2, r2, i3) || "click" === e2 && this.force(r2), false;
        }, i2.prefetch = function(t3) {
          var n2 = this;
          t3 = this.url.getAbsoluteHref(t3), this.cache.has(t3) || this.cache.set(t3, this.request(t3, this.timeout, this.onRequestError.bind(this, "barba"), this.cache, this.headers).catch(function(t4) {
            n2.logger.error(t4);
          }), "prefetch", "pending");
        }, i2.G = function() {
          true !== this.prefetchIgnore && (document.addEventListener("mouseover", this.U), document.addEventListener("touchstart", this.U)), document.addEventListener("click", this.$), window.addEventListener("popstate", this.X);
        }, i2.J = function() {
          true !== this.prefetchIgnore && (document.removeEventListener("mouseover", this.U), document.removeEventListener("touchstart", this.U)), document.removeEventListener("click", this.$), window.removeEventListener("popstate", this.X);
        }, i2.U = function(t3) {
          var n2 = this, r2 = this.W(t3);
          if (r2) {
            var i3 = this.url.getAbsoluteHref(this.dom.getHref(r2));
            this.prevent.checkHref(i3) || this.cache.has(i3) || this.cache.set(i3, this.request(i3, this.timeout, this.onRequestError.bind(this, r2), this.cache, this.headers).catch(function(t4) {
              n2.logger.error(t4);
            }), "enter", "pending");
          }
        }, i2.$ = function(t3) {
          var n2 = this.W(t3);
          if (n2) {
            if (this.transitions.isRunning && this.preventRunning) return t3.preventDefault(), void t3.stopPropagation();
            this.F = t3, this.go(this.dom.getHref(n2), n2, t3);
          }
        }, i2.X = function(t3) {
          this.go(this.url.getHref(), "popstate", t3);
        }, i2.W = function(t3) {
          for (var n2 = t3.target; n2 && !this.dom.getHref(n2); ) n2 = n2.parentNode;
          if (n2 && !this.prevent.checkLink(n2, t3, this.dom.getHref(n2))) return n2;
        }, i2.I = function() {
          var t3 = this.url.getHref(), n2 = { container: this.dom.getContainer(), html: this.dom.getHtml(), namespace: this.dom.getNamespace(), url: r({ href: t3 }, this.url.parse(t3)) };
          this.D = { current: n2, event: void 0, next: r({}, this.schemaPage), trigger: void 0 }, this.hooks.do("reset", this.data);
        }, n(t2, [{ key: "data", get: function() {
          return this.D;
        } }, { key: "wrapper", get: function() {
          return this.q;
        } }]), t2;
      })();
      return new nt();
    });
  }
});

// node_modules/@splidejs/splide/dist/js/splide.esm.js
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}
var MEDIA_PREFERS_REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
var CREATED = 1;
var MOUNTED = 2;
var IDLE = 3;
var MOVING = 4;
var SCROLLING = 5;
var DRAGGING = 6;
var DESTROYED = 7;
var STATES = {
  CREATED,
  MOUNTED,
  IDLE,
  MOVING,
  SCROLLING,
  DRAGGING,
  DESTROYED
};
function empty(array) {
  array.length = 0;
}
function slice(arrayLike, start, end) {
  return Array.prototype.slice.call(arrayLike, start, end);
}
function apply(func) {
  return func.bind.apply(func, [null].concat(slice(arguments, 1)));
}
var nextTick = setTimeout;
var noop = function noop2() {
};
function raf(func) {
  return requestAnimationFrame(func);
}
function typeOf(type, subject) {
  return typeof subject === type;
}
function isObject(subject) {
  return !isNull(subject) && typeOf("object", subject);
}
var isArray = Array.isArray;
var isFunction = apply(typeOf, "function");
var isString = apply(typeOf, "string");
var isUndefined = apply(typeOf, "undefined");
function isNull(subject) {
  return subject === null;
}
function isHTMLElement(subject) {
  try {
    return subject instanceof (subject.ownerDocument.defaultView || window).HTMLElement;
  } catch (e) {
    return false;
  }
}
function toArray(value) {
  return isArray(value) ? value : [value];
}
function forEach(values, iteratee) {
  toArray(values).forEach(iteratee);
}
function includes(array, value) {
  return array.indexOf(value) > -1;
}
function push(array, items) {
  array.push.apply(array, toArray(items));
  return array;
}
function toggleClass(elm, classes, add) {
  if (elm) {
    forEach(classes, function(name) {
      if (name) {
        elm.classList[add ? "add" : "remove"](name);
      }
    });
  }
}
function addClass(elm, classes) {
  toggleClass(elm, isString(classes) ? classes.split(" ") : classes, true);
}
function append(parent, children2) {
  forEach(children2, parent.appendChild.bind(parent));
}
function before(nodes, ref) {
  forEach(nodes, function(node) {
    var parent = (ref || node).parentNode;
    if (parent) {
      parent.insertBefore(node, ref);
    }
  });
}
function matches(elm, selector) {
  return isHTMLElement(elm) && (elm["msMatchesSelector"] || elm.matches).call(elm, selector);
}
function children(parent, selector) {
  var children2 = parent ? slice(parent.children) : [];
  return selector ? children2.filter(function(child2) {
    return matches(child2, selector);
  }) : children2;
}
function child(parent, selector) {
  return selector ? children(parent, selector)[0] : parent.firstElementChild;
}
var ownKeys = Object.keys;
function forOwn(object, iteratee, right) {
  if (object) {
    (right ? ownKeys(object).reverse() : ownKeys(object)).forEach(function(key) {
      key !== "__proto__" && iteratee(object[key], key);
    });
  }
  return object;
}
function assign(object) {
  slice(arguments, 1).forEach(function(source) {
    forOwn(source, function(value, key) {
      object[key] = source[key];
    });
  });
  return object;
}
function merge(object) {
  slice(arguments, 1).forEach(function(source) {
    forOwn(source, function(value, key) {
      if (isArray(value)) {
        object[key] = value.slice();
      } else if (isObject(value)) {
        object[key] = merge({}, isObject(object[key]) ? object[key] : {}, value);
      } else {
        object[key] = value;
      }
    });
  });
  return object;
}
function omit(object, keys) {
  forEach(keys || ownKeys(object), function(key) {
    delete object[key];
  });
}
function removeAttribute(elms, attrs) {
  forEach(elms, function(elm) {
    forEach(attrs, function(attr) {
      elm && elm.removeAttribute(attr);
    });
  });
}
function setAttribute(elms, attrs, value) {
  if (isObject(attrs)) {
    forOwn(attrs, function(value2, name) {
      setAttribute(elms, name, value2);
    });
  } else {
    forEach(elms, function(elm) {
      isNull(value) || value === "" ? removeAttribute(elm, attrs) : elm.setAttribute(attrs, String(value));
    });
  }
}
function create(tag, attrs, parent) {
  var elm = document.createElement(tag);
  if (attrs) {
    isString(attrs) ? addClass(elm, attrs) : setAttribute(elm, attrs);
  }
  parent && append(parent, elm);
  return elm;
}
function style(elm, prop, value) {
  if (isUndefined(value)) {
    return getComputedStyle(elm)[prop];
  }
  if (!isNull(value)) {
    elm.style[prop] = "" + value;
  }
}
function display(elm, display2) {
  style(elm, "display", display2);
}
function focus(elm) {
  elm["setActive"] && elm["setActive"]() || elm.focus({
    preventScroll: true
  });
}
function getAttribute(elm, attr) {
  return elm.getAttribute(attr);
}
function hasClass(elm, className) {
  return elm && elm.classList.contains(className);
}
function rect(target) {
  return target.getBoundingClientRect();
}
function remove(nodes) {
  forEach(nodes, function(node) {
    if (node && node.parentNode) {
      node.parentNode.removeChild(node);
    }
  });
}
function parseHtml(html) {
  return child(new DOMParser().parseFromString(html, "text/html").body);
}
function prevent(e, stopPropagation) {
  e.preventDefault();
  if (stopPropagation) {
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
}
function query(parent, selector) {
  return parent && parent.querySelector(selector);
}
function queryAll(parent, selector) {
  return selector ? slice(parent.querySelectorAll(selector)) : [];
}
function removeClass(elm, classes) {
  toggleClass(elm, classes, false);
}
function timeOf(e) {
  return e.timeStamp;
}
function unit(value) {
  return isString(value) ? value : value ? value + "px" : "";
}
var PROJECT_CODE = "splide";
var DATA_ATTRIBUTE = "data-" + PROJECT_CODE;
function assert(condition, message) {
  if (!condition) {
    throw new Error("[" + PROJECT_CODE + "] " + (message || ""));
  }
}
var min = Math.min;
var max = Math.max;
var floor = Math.floor;
var ceil = Math.ceil;
var abs = Math.abs;
function approximatelyEqual(x, y, epsilon) {
  return abs(x - y) < epsilon;
}
function between(number, x, y, exclusive) {
  var minimum = min(x, y);
  var maximum = max(x, y);
  return exclusive ? minimum < number && number < maximum : minimum <= number && number <= maximum;
}
function clamp(number, x, y) {
  var minimum = min(x, y);
  var maximum = max(x, y);
  return min(max(minimum, number), maximum);
}
function sign(x) {
  return +(x > 0) - +(x < 0);
}
function format(string, replacements) {
  forEach(replacements, function(replacement) {
    string = string.replace("%s", "" + replacement);
  });
  return string;
}
function pad(number) {
  return number < 10 ? "0" + number : "" + number;
}
var ids = {};
function uniqueId(prefix) {
  return "" + prefix + pad(ids[prefix] = (ids[prefix] || 0) + 1);
}
function EventBinder() {
  var listeners = [];
  function bind(targets, events, callback, options) {
    forEachEvent(targets, events, function(target, event, namespace) {
      var isEventTarget = "addEventListener" in target;
      var remover = isEventTarget ? target.removeEventListener.bind(target, event, callback, options) : target["removeListener"].bind(target, callback);
      isEventTarget ? target.addEventListener(event, callback, options) : target["addListener"](callback);
      listeners.push([target, event, namespace, callback, remover]);
    });
  }
  function unbind(targets, events, callback) {
    forEachEvent(targets, events, function(target, event, namespace) {
      listeners = listeners.filter(function(listener) {
        if (listener[0] === target && listener[1] === event && listener[2] === namespace && (!callback || listener[3] === callback)) {
          listener[4]();
          return false;
        }
        return true;
      });
    });
  }
  function dispatch(target, type, detail) {
    var e;
    var bubbles = true;
    if (typeof CustomEvent === "function") {
      e = new CustomEvent(type, {
        bubbles,
        detail
      });
    } else {
      e = document.createEvent("CustomEvent");
      e.initCustomEvent(type, bubbles, false, detail);
    }
    target.dispatchEvent(e);
    return e;
  }
  function forEachEvent(targets, events, iteratee) {
    forEach(targets, function(target) {
      target && forEach(events, function(events2) {
        events2.split(" ").forEach(function(eventNS) {
          var fragment = eventNS.split(".");
          iteratee(target, fragment[0], fragment[1]);
        });
      });
    });
  }
  function destroy() {
    listeners.forEach(function(data) {
      data[4]();
    });
    empty(listeners);
  }
  return {
    bind,
    unbind,
    dispatch,
    destroy
  };
}
var EVENT_MOUNTED = "mounted";
var EVENT_READY = "ready";
var EVENT_MOVE = "move";
var EVENT_MOVED = "moved";
var EVENT_CLICK = "click";
var EVENT_ACTIVE = "active";
var EVENT_INACTIVE = "inactive";
var EVENT_VISIBLE = "visible";
var EVENT_HIDDEN = "hidden";
var EVENT_REFRESH = "refresh";
var EVENT_UPDATED = "updated";
var EVENT_RESIZE = "resize";
var EVENT_RESIZED = "resized";
var EVENT_DRAG = "drag";
var EVENT_DRAGGING = "dragging";
var EVENT_DRAGGED = "dragged";
var EVENT_SCROLL = "scroll";
var EVENT_SCROLLED = "scrolled";
var EVENT_OVERFLOW = "overflow";
var EVENT_DESTROY = "destroy";
var EVENT_ARROWS_MOUNTED = "arrows:mounted";
var EVENT_ARROWS_UPDATED = "arrows:updated";
var EVENT_PAGINATION_MOUNTED = "pagination:mounted";
var EVENT_PAGINATION_UPDATED = "pagination:updated";
var EVENT_NAVIGATION_MOUNTED = "navigation:mounted";
var EVENT_AUTOPLAY_PLAY = "autoplay:play";
var EVENT_AUTOPLAY_PLAYING = "autoplay:playing";
var EVENT_AUTOPLAY_PAUSE = "autoplay:pause";
var EVENT_LAZYLOAD_LOADED = "lazyload:loaded";
var EVENT_SLIDE_KEYDOWN = "sk";
var EVENT_SHIFTED = "sh";
var EVENT_END_INDEX_CHANGED = "ei";
function EventInterface(Splide2) {
  var bus = Splide2 ? Splide2.event.bus : document.createDocumentFragment();
  var binder = EventBinder();
  function on(events, callback) {
    binder.bind(bus, toArray(events).join(" "), function(e) {
      callback.apply(callback, isArray(e.detail) ? e.detail : []);
    });
  }
  function emit(event) {
    binder.dispatch(bus, event, slice(arguments, 1));
  }
  if (Splide2) {
    Splide2.event.on(EVENT_DESTROY, binder.destroy);
  }
  return assign(binder, {
    bus,
    on,
    off: apply(binder.unbind, bus),
    emit
  });
}
function RequestInterval(interval, onInterval, onUpdate, limit) {
  var now = Date.now;
  var startTime;
  var rate = 0;
  var id;
  var paused = true;
  var count = 0;
  function update() {
    if (!paused) {
      rate = interval ? min((now() - startTime) / interval, 1) : 1;
      onUpdate && onUpdate(rate);
      if (rate >= 1) {
        onInterval();
        startTime = now();
        if (limit && ++count >= limit) {
          return pause();
        }
      }
      id = raf(update);
    }
  }
  function start(resume) {
    resume || cancel();
    startTime = now() - (resume ? rate * interval : 0);
    paused = false;
    id = raf(update);
  }
  function pause() {
    paused = true;
  }
  function rewind() {
    startTime = now();
    rate = 0;
    if (onUpdate) {
      onUpdate(rate);
    }
  }
  function cancel() {
    id && cancelAnimationFrame(id);
    rate = 0;
    id = 0;
    paused = true;
  }
  function set(time) {
    interval = time;
  }
  function isPaused() {
    return paused;
  }
  return {
    start,
    rewind,
    pause,
    cancel,
    set,
    isPaused
  };
}
function State(initialState) {
  var state = initialState;
  function set(value) {
    state = value;
  }
  function is(states) {
    return includes(toArray(states), state);
  }
  return {
    set,
    is
  };
}
function Throttle(func, duration) {
  var interval = RequestInterval(duration || 0, func, null, 1);
  return function() {
    interval.isPaused() && interval.start();
  };
}
function Media(Splide2, Components2, options) {
  var state = Splide2.state;
  var breakpoints = options.breakpoints || {};
  var reducedMotion = options.reducedMotion || {};
  var binder = EventBinder();
  var queries = [];
  function setup() {
    var isMin = options.mediaQuery === "min";
    ownKeys(breakpoints).sort(function(n, m) {
      return isMin ? +n - +m : +m - +n;
    }).forEach(function(key) {
      register(breakpoints[key], "(" + (isMin ? "min" : "max") + "-width:" + key + "px)");
    });
    register(reducedMotion, MEDIA_PREFERS_REDUCED_MOTION);
    update();
  }
  function destroy(completely) {
    if (completely) {
      binder.destroy();
    }
  }
  function register(options2, query2) {
    var queryList = matchMedia(query2);
    binder.bind(queryList, "change", update);
    queries.push([options2, queryList]);
  }
  function update() {
    var destroyed = state.is(DESTROYED);
    var direction = options.direction;
    var merged = queries.reduce(function(merged2, entry) {
      return merge(merged2, entry[1].matches ? entry[0] : {});
    }, {});
    omit(options);
    set(merged);
    if (options.destroy) {
      Splide2.destroy(options.destroy === "completely");
    } else if (destroyed) {
      destroy(true);
      Splide2.mount();
    } else {
      direction !== options.direction && Splide2.refresh();
    }
  }
  function reduce(enable) {
    if (matchMedia(MEDIA_PREFERS_REDUCED_MOTION).matches) {
      enable ? merge(options, reducedMotion) : omit(options, ownKeys(reducedMotion));
    }
  }
  function set(opts, base, notify) {
    merge(options, opts);
    base && merge(Object.getPrototypeOf(options), opts);
    if (notify || !state.is(CREATED)) {
      Splide2.emit(EVENT_UPDATED, options);
    }
  }
  return {
    setup,
    destroy,
    reduce,
    set
  };
}
var ARROW = "Arrow";
var ARROW_LEFT = ARROW + "Left";
var ARROW_RIGHT = ARROW + "Right";
var ARROW_UP = ARROW + "Up";
var ARROW_DOWN = ARROW + "Down";
var RTL = "rtl";
var TTB = "ttb";
var ORIENTATION_MAP = {
  width: ["height"],
  left: ["top", "right"],
  right: ["bottom", "left"],
  x: ["y"],
  X: ["Y"],
  Y: ["X"],
  ArrowLeft: [ARROW_UP, ARROW_RIGHT],
  ArrowRight: [ARROW_DOWN, ARROW_LEFT]
};
function Direction(Splide2, Components2, options) {
  function resolve(prop, axisOnly, direction) {
    direction = direction || options.direction;
    var index = direction === RTL && !axisOnly ? 1 : direction === TTB ? 0 : -1;
    return ORIENTATION_MAP[prop] && ORIENTATION_MAP[prop][index] || prop.replace(/width|left|right/i, function(match, offset) {
      var replacement = ORIENTATION_MAP[match.toLowerCase()][index] || match;
      return offset > 0 ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement;
    });
  }
  function orient(value) {
    return value * (options.direction === RTL ? 1 : -1);
  }
  return {
    resolve,
    orient
  };
}
var ROLE = "role";
var TAB_INDEX = "tabindex";
var DISABLED = "disabled";
var ARIA_PREFIX = "aria-";
var ARIA_CONTROLS = ARIA_PREFIX + "controls";
var ARIA_CURRENT = ARIA_PREFIX + "current";
var ARIA_SELECTED = ARIA_PREFIX + "selected";
var ARIA_LABEL = ARIA_PREFIX + "label";
var ARIA_LABELLEDBY = ARIA_PREFIX + "labelledby";
var ARIA_HIDDEN = ARIA_PREFIX + "hidden";
var ARIA_ORIENTATION = ARIA_PREFIX + "orientation";
var ARIA_ROLEDESCRIPTION = ARIA_PREFIX + "roledescription";
var ARIA_LIVE = ARIA_PREFIX + "live";
var ARIA_BUSY = ARIA_PREFIX + "busy";
var ARIA_ATOMIC = ARIA_PREFIX + "atomic";
var ALL_ATTRIBUTES = [ROLE, TAB_INDEX, DISABLED, ARIA_CONTROLS, ARIA_CURRENT, ARIA_LABEL, ARIA_LABELLEDBY, ARIA_HIDDEN, ARIA_ORIENTATION, ARIA_ROLEDESCRIPTION];
var CLASS_PREFIX = PROJECT_CODE + "__";
var STATUS_CLASS_PREFIX = "is-";
var CLASS_ROOT = PROJECT_CODE;
var CLASS_TRACK = CLASS_PREFIX + "track";
var CLASS_LIST = CLASS_PREFIX + "list";
var CLASS_SLIDE = CLASS_PREFIX + "slide";
var CLASS_CLONE = CLASS_SLIDE + "--clone";
var CLASS_CONTAINER = CLASS_SLIDE + "__container";
var CLASS_ARROWS = CLASS_PREFIX + "arrows";
var CLASS_ARROW = CLASS_PREFIX + "arrow";
var CLASS_ARROW_PREV = CLASS_ARROW + "--prev";
var CLASS_ARROW_NEXT = CLASS_ARROW + "--next";
var CLASS_PAGINATION = CLASS_PREFIX + "pagination";
var CLASS_PAGINATION_PAGE = CLASS_PAGINATION + "__page";
var CLASS_PROGRESS = CLASS_PREFIX + "progress";
var CLASS_PROGRESS_BAR = CLASS_PROGRESS + "__bar";
var CLASS_TOGGLE = CLASS_PREFIX + "toggle";
var CLASS_TOGGLE_PLAY = CLASS_TOGGLE + "__play";
var CLASS_TOGGLE_PAUSE = CLASS_TOGGLE + "__pause";
var CLASS_SPINNER = CLASS_PREFIX + "spinner";
var CLASS_SR = CLASS_PREFIX + "sr";
var CLASS_INITIALIZED = STATUS_CLASS_PREFIX + "initialized";
var CLASS_ACTIVE = STATUS_CLASS_PREFIX + "active";
var CLASS_PREV = STATUS_CLASS_PREFIX + "prev";
var CLASS_NEXT = STATUS_CLASS_PREFIX + "next";
var CLASS_VISIBLE = STATUS_CLASS_PREFIX + "visible";
var CLASS_LOADING = STATUS_CLASS_PREFIX + "loading";
var CLASS_FOCUS_IN = STATUS_CLASS_PREFIX + "focus-in";
var CLASS_OVERFLOW = STATUS_CLASS_PREFIX + "overflow";
var STATUS_CLASSES = [CLASS_ACTIVE, CLASS_VISIBLE, CLASS_PREV, CLASS_NEXT, CLASS_LOADING, CLASS_FOCUS_IN, CLASS_OVERFLOW];
var CLASSES = {
  slide: CLASS_SLIDE,
  clone: CLASS_CLONE,
  arrows: CLASS_ARROWS,
  arrow: CLASS_ARROW,
  prev: CLASS_ARROW_PREV,
  next: CLASS_ARROW_NEXT,
  pagination: CLASS_PAGINATION,
  page: CLASS_PAGINATION_PAGE,
  spinner: CLASS_SPINNER
};
function closest(from, selector) {
  if (isFunction(from.closest)) {
    return from.closest(selector);
  }
  var elm = from;
  while (elm && elm.nodeType === 1) {
    if (matches(elm, selector)) {
      break;
    }
    elm = elm.parentElement;
  }
  return elm;
}
var FRICTION = 5;
var LOG_INTERVAL = 200;
var POINTER_DOWN_EVENTS = "touchstart mousedown";
var POINTER_MOVE_EVENTS = "touchmove mousemove";
var POINTER_UP_EVENTS = "touchend touchcancel mouseup click";
function Elements(Splide2, Components2, options) {
  var _EventInterface = EventInterface(Splide2), on = _EventInterface.on, bind = _EventInterface.bind;
  var root = Splide2.root;
  var i18n = options.i18n;
  var elements = {};
  var slides = [];
  var rootClasses = [];
  var trackClasses = [];
  var track;
  var list;
  var isUsingKey;
  function setup() {
    collect();
    init2();
    update();
  }
  function mount() {
    on(EVENT_REFRESH, destroy);
    on(EVENT_REFRESH, setup);
    on(EVENT_UPDATED, update);
    bind(document, POINTER_DOWN_EVENTS + " keydown", function(e) {
      isUsingKey = e.type === "keydown";
    }, {
      capture: true
    });
    bind(root, "focusin", function() {
      toggleClass(root, CLASS_FOCUS_IN, !!isUsingKey);
    });
  }
  function destroy(completely) {
    var attrs = ALL_ATTRIBUTES.concat("style");
    empty(slides);
    removeClass(root, rootClasses);
    removeClass(track, trackClasses);
    removeAttribute([track, list], attrs);
    removeAttribute(root, completely ? attrs : ["style", ARIA_ROLEDESCRIPTION]);
  }
  function update() {
    removeClass(root, rootClasses);
    removeClass(track, trackClasses);
    rootClasses = getClasses(CLASS_ROOT);
    trackClasses = getClasses(CLASS_TRACK);
    addClass(root, rootClasses);
    addClass(track, trackClasses);
    setAttribute(root, ARIA_LABEL, options.label);
    setAttribute(root, ARIA_LABELLEDBY, options.labelledby);
  }
  function collect() {
    track = find("." + CLASS_TRACK);
    list = child(track, "." + CLASS_LIST);
    assert(track && list, "A track/list element is missing.");
    push(slides, children(list, "." + CLASS_SLIDE + ":not(." + CLASS_CLONE + ")"));
    forOwn({
      arrows: CLASS_ARROWS,
      pagination: CLASS_PAGINATION,
      prev: CLASS_ARROW_PREV,
      next: CLASS_ARROW_NEXT,
      bar: CLASS_PROGRESS_BAR,
      toggle: CLASS_TOGGLE
    }, function(className, key) {
      elements[key] = find("." + className);
    });
    assign(elements, {
      root,
      track,
      list,
      slides
    });
  }
  function init2() {
    var id = root.id || uniqueId(PROJECT_CODE);
    var role = options.role;
    root.id = id;
    track.id = track.id || id + "-track";
    list.id = list.id || id + "-list";
    if (!getAttribute(root, ROLE) && root.tagName !== "SECTION" && role) {
      setAttribute(root, ROLE, role);
    }
    setAttribute(root, ARIA_ROLEDESCRIPTION, i18n.carousel);
    setAttribute(list, ROLE, "presentation");
  }
  function find(selector) {
    var elm = query(root, selector);
    return elm && closest(elm, "." + CLASS_ROOT) === root ? elm : void 0;
  }
  function getClasses(base) {
    return [base + "--" + options.type, base + "--" + options.direction, options.drag && base + "--draggable", options.isNavigation && base + "--nav", base === CLASS_ROOT && CLASS_ACTIVE];
  }
  return assign(elements, {
    setup,
    mount,
    destroy
  });
}
var SLIDE = "slide";
var LOOP = "loop";
var FADE = "fade";
function Slide$1(Splide2, index, slideIndex, slide) {
  var event = EventInterface(Splide2);
  var on = event.on, emit = event.emit, bind = event.bind;
  var Components = Splide2.Components, root = Splide2.root, options = Splide2.options;
  var isNavigation = options.isNavigation, updateOnMove = options.updateOnMove, i18n = options.i18n, pagination = options.pagination, slideFocus = options.slideFocus;
  var resolve = Components.Direction.resolve;
  var styles = getAttribute(slide, "style");
  var label = getAttribute(slide, ARIA_LABEL);
  var isClone = slideIndex > -1;
  var container = child(slide, "." + CLASS_CONTAINER);
  var destroyed;
  function mount() {
    if (!isClone) {
      slide.id = root.id + "-slide" + pad(index + 1);
      setAttribute(slide, ROLE, pagination ? "tabpanel" : "group");
      setAttribute(slide, ARIA_ROLEDESCRIPTION, i18n.slide);
      setAttribute(slide, ARIA_LABEL, label || format(i18n.slideLabel, [index + 1, Splide2.length]));
    }
    listen();
  }
  function listen() {
    bind(slide, "click", apply(emit, EVENT_CLICK, self2));
    bind(slide, "keydown", apply(emit, EVENT_SLIDE_KEYDOWN, self2));
    on([EVENT_MOVED, EVENT_SHIFTED, EVENT_SCROLLED], update);
    on(EVENT_NAVIGATION_MOUNTED, initNavigation);
    if (updateOnMove) {
      on(EVENT_MOVE, onMove);
    }
  }
  function destroy() {
    destroyed = true;
    event.destroy();
    removeClass(slide, STATUS_CLASSES);
    removeAttribute(slide, ALL_ATTRIBUTES);
    setAttribute(slide, "style", styles);
    setAttribute(slide, ARIA_LABEL, label || "");
  }
  function initNavigation() {
    var controls = Splide2.splides.map(function(target) {
      var Slide2 = target.splide.Components.Slides.getAt(index);
      return Slide2 ? Slide2.slide.id : "";
    }).join(" ");
    setAttribute(slide, ARIA_LABEL, format(i18n.slideX, (isClone ? slideIndex : index) + 1));
    setAttribute(slide, ARIA_CONTROLS, controls);
    setAttribute(slide, ROLE, slideFocus ? "button" : "");
    slideFocus && removeAttribute(slide, ARIA_ROLEDESCRIPTION);
  }
  function onMove() {
    if (!destroyed) {
      update();
    }
  }
  function update() {
    if (!destroyed) {
      var curr = Splide2.index;
      updateActivity();
      updateVisibility();
      toggleClass(slide, CLASS_PREV, index === curr - 1);
      toggleClass(slide, CLASS_NEXT, index === curr + 1);
    }
  }
  function updateActivity() {
    var active = isActive();
    if (active !== hasClass(slide, CLASS_ACTIVE)) {
      toggleClass(slide, CLASS_ACTIVE, active);
      setAttribute(slide, ARIA_CURRENT, isNavigation && active || "");
      emit(active ? EVENT_ACTIVE : EVENT_INACTIVE, self2);
    }
  }
  function updateVisibility() {
    var visible = isVisible();
    var hidden = !visible && (!isActive() || isClone);
    if (!Splide2.state.is([MOVING, SCROLLING])) {
      setAttribute(slide, ARIA_HIDDEN, hidden || "");
    }
    setAttribute(queryAll(slide, options.focusableNodes || ""), TAB_INDEX, hidden ? -1 : "");
    if (slideFocus) {
      setAttribute(slide, TAB_INDEX, hidden ? -1 : 0);
    }
    if (visible !== hasClass(slide, CLASS_VISIBLE)) {
      toggleClass(slide, CLASS_VISIBLE, visible);
      emit(visible ? EVENT_VISIBLE : EVENT_HIDDEN, self2);
    }
    if (!visible && document.activeElement === slide) {
      var Slide2 = Components.Slides.getAt(Splide2.index);
      Slide2 && focus(Slide2.slide);
    }
  }
  function style$1(prop, value, useContainer) {
    style(useContainer && container || slide, prop, value);
  }
  function isActive() {
    var curr = Splide2.index;
    return curr === index || options.cloneStatus && curr === slideIndex;
  }
  function isVisible() {
    if (Splide2.is(FADE)) {
      return isActive();
    }
    var trackRect = rect(Components.Elements.track);
    var slideRect = rect(slide);
    var left = resolve("left", true);
    var right = resolve("right", true);
    return floor(trackRect[left]) <= ceil(slideRect[left]) && floor(slideRect[right]) <= ceil(trackRect[right]);
  }
  function isWithin(from, distance) {
    var diff = abs(from - index);
    if (!isClone && (options.rewind || Splide2.is(LOOP))) {
      diff = min(diff, Splide2.length - diff);
    }
    return diff <= distance;
  }
  var self2 = {
    index,
    slideIndex,
    slide,
    container,
    isClone,
    mount,
    destroy,
    update,
    style: style$1,
    isWithin
  };
  return self2;
}
function Slides(Splide2, Components2, options) {
  var _EventInterface2 = EventInterface(Splide2), on = _EventInterface2.on, emit = _EventInterface2.emit, bind = _EventInterface2.bind;
  var _Components2$Elements = Components2.Elements, slides = _Components2$Elements.slides, list = _Components2$Elements.list;
  var Slides2 = [];
  function mount() {
    init2();
    on(EVENT_REFRESH, destroy);
    on(EVENT_REFRESH, init2);
  }
  function init2() {
    slides.forEach(function(slide, index) {
      register(slide, index, -1);
    });
  }
  function destroy() {
    forEach$1(function(Slide2) {
      Slide2.destroy();
    });
    empty(Slides2);
  }
  function update() {
    forEach$1(function(Slide2) {
      Slide2.update();
    });
  }
  function register(slide, index, slideIndex) {
    var object = Slide$1(Splide2, index, slideIndex, slide);
    object.mount();
    Slides2.push(object);
    Slides2.sort(function(Slide1, Slide2) {
      return Slide1.index - Slide2.index;
    });
  }
  function get(excludeClones) {
    return excludeClones ? filter(function(Slide2) {
      return !Slide2.isClone;
    }) : Slides2;
  }
  function getIn(page) {
    var Controller2 = Components2.Controller;
    var index = Controller2.toIndex(page);
    var max2 = Controller2.hasFocus() ? 1 : options.perPage;
    return filter(function(Slide2) {
      return between(Slide2.index, index, index + max2 - 1);
    });
  }
  function getAt(index) {
    return filter(index)[0];
  }
  function add(items, index) {
    forEach(items, function(slide) {
      if (isString(slide)) {
        slide = parseHtml(slide);
      }
      if (isHTMLElement(slide)) {
        var ref = slides[index];
        ref ? before(slide, ref) : append(list, slide);
        addClass(slide, options.classes.slide);
        observeImages(slide, apply(emit, EVENT_RESIZE));
      }
    });
    emit(EVENT_REFRESH);
  }
  function remove$1(matcher) {
    remove(filter(matcher).map(function(Slide2) {
      return Slide2.slide;
    }));
    emit(EVENT_REFRESH);
  }
  function forEach$1(iteratee, excludeClones) {
    get(excludeClones).forEach(iteratee);
  }
  function filter(matcher) {
    return Slides2.filter(isFunction(matcher) ? matcher : function(Slide2) {
      return isString(matcher) ? matches(Slide2.slide, matcher) : includes(toArray(matcher), Slide2.index);
    });
  }
  function style2(prop, value, useContainer) {
    forEach$1(function(Slide2) {
      Slide2.style(prop, value, useContainer);
    });
  }
  function observeImages(elm, callback) {
    var images = queryAll(elm, "img");
    var length = images.length;
    if (length) {
      images.forEach(function(img) {
        bind(img, "load error", function() {
          if (!--length) {
            callback();
          }
        });
      });
    } else {
      callback();
    }
  }
  function getLength(excludeClones) {
    return excludeClones ? slides.length : Slides2.length;
  }
  function isEnough() {
    return Slides2.length > options.perPage;
  }
  return {
    mount,
    destroy,
    update,
    register,
    get,
    getIn,
    getAt,
    add,
    remove: remove$1,
    forEach: forEach$1,
    filter,
    style: style2,
    getLength,
    isEnough
  };
}
function Layout(Splide2, Components2, options) {
  var _EventInterface3 = EventInterface(Splide2), on = _EventInterface3.on, bind = _EventInterface3.bind, emit = _EventInterface3.emit;
  var Slides2 = Components2.Slides;
  var resolve = Components2.Direction.resolve;
  var _Components2$Elements2 = Components2.Elements, root = _Components2$Elements2.root, track = _Components2$Elements2.track, list = _Components2$Elements2.list;
  var getAt = Slides2.getAt, styleSlides = Slides2.style;
  var vertical;
  var rootRect;
  var overflow;
  function mount() {
    init2();
    bind(window, "resize load", Throttle(apply(emit, EVENT_RESIZE)));
    on([EVENT_UPDATED, EVENT_REFRESH], init2);
    on(EVENT_RESIZE, resize);
  }
  function init2() {
    vertical = options.direction === TTB;
    style(root, "maxWidth", unit(options.width));
    style(track, resolve("paddingLeft"), cssPadding(false));
    style(track, resolve("paddingRight"), cssPadding(true));
    resize(true);
  }
  function resize(force) {
    var newRect = rect(root);
    if (force || rootRect.width !== newRect.width || rootRect.height !== newRect.height) {
      style(track, "height", cssTrackHeight());
      styleSlides(resolve("marginRight"), unit(options.gap));
      styleSlides("width", cssSlideWidth());
      styleSlides("height", cssSlideHeight(), true);
      rootRect = newRect;
      emit(EVENT_RESIZED);
      if (overflow !== (overflow = isOverflow())) {
        toggleClass(root, CLASS_OVERFLOW, overflow);
        emit(EVENT_OVERFLOW, overflow);
      }
    }
  }
  function cssPadding(right) {
    var padding = options.padding;
    var prop = resolve(right ? "right" : "left");
    return padding && unit(padding[prop] || (isObject(padding) ? 0 : padding)) || "0px";
  }
  function cssTrackHeight() {
    var height = "";
    if (vertical) {
      height = cssHeight();
      assert(height, "height or heightRatio is missing.");
      height = "calc(" + height + " - " + cssPadding(false) + " - " + cssPadding(true) + ")";
    }
    return height;
  }
  function cssHeight() {
    return unit(options.height || rect(list).width * options.heightRatio);
  }
  function cssSlideWidth() {
    return options.autoWidth ? null : unit(options.fixedWidth) || (vertical ? "" : cssSlideSize());
  }
  function cssSlideHeight() {
    return unit(options.fixedHeight) || (vertical ? options.autoHeight ? null : cssSlideSize() : cssHeight());
  }
  function cssSlideSize() {
    var gap = unit(options.gap);
    return "calc((100%" + (gap && " + " + gap) + ")/" + (options.perPage || 1) + (gap && " - " + gap) + ")";
  }
  function listSize() {
    return rect(list)[resolve("width")];
  }
  function slideSize(index, withoutGap) {
    var Slide2 = getAt(index || 0);
    return Slide2 ? rect(Slide2.slide)[resolve("width")] + (withoutGap ? 0 : getGap()) : 0;
  }
  function totalSize(index, withoutGap) {
    var Slide2 = getAt(index);
    if (Slide2) {
      var right = rect(Slide2.slide)[resolve("right")];
      var left = rect(list)[resolve("left")];
      return abs(right - left) + (withoutGap ? 0 : getGap());
    }
    return 0;
  }
  function sliderSize(withoutGap) {
    return totalSize(Splide2.length - 1) - totalSize(0) + slideSize(0, withoutGap);
  }
  function getGap() {
    var Slide2 = getAt(0);
    return Slide2 && parseFloat(style(Slide2.slide, resolve("marginRight"))) || 0;
  }
  function getPadding(right) {
    return parseFloat(style(track, resolve("padding" + (right ? "Right" : "Left")))) || 0;
  }
  function isOverflow() {
    return Splide2.is(FADE) || sliderSize(true) > listSize();
  }
  return {
    mount,
    resize,
    listSize,
    slideSize,
    sliderSize,
    totalSize,
    getPadding,
    isOverflow
  };
}
var MULTIPLIER = 2;
function Clones(Splide2, Components2, options) {
  var event = EventInterface(Splide2);
  var on = event.on;
  var Elements2 = Components2.Elements, Slides2 = Components2.Slides;
  var resolve = Components2.Direction.resolve;
  var clones = [];
  var cloneCount;
  function mount() {
    on(EVENT_REFRESH, remount);
    on([EVENT_UPDATED, EVENT_RESIZE], observe);
    if (cloneCount = computeCloneCount()) {
      generate(cloneCount);
      Components2.Layout.resize(true);
    }
  }
  function remount() {
    destroy();
    mount();
  }
  function destroy() {
    remove(clones);
    empty(clones);
    event.destroy();
  }
  function observe() {
    var count = computeCloneCount();
    if (cloneCount !== count) {
      if (cloneCount < count || !count) {
        event.emit(EVENT_REFRESH);
      }
    }
  }
  function generate(count) {
    var slides = Slides2.get().slice();
    var length = slides.length;
    if (length) {
      while (slides.length < count) {
        push(slides, slides);
      }
      push(slides.slice(-count), slides.slice(0, count)).forEach(function(Slide2, index) {
        var isHead = index < count;
        var clone = cloneDeep(Slide2.slide, index);
        isHead ? before(clone, slides[0].slide) : append(Elements2.list, clone);
        push(clones, clone);
        Slides2.register(clone, index - count + (isHead ? 0 : length), Slide2.index);
      });
    }
  }
  function cloneDeep(elm, index) {
    var clone = elm.cloneNode(true);
    addClass(clone, options.classes.clone);
    clone.id = Splide2.root.id + "-clone" + pad(index + 1);
    return clone;
  }
  function computeCloneCount() {
    var clones2 = options.clones;
    if (!Splide2.is(LOOP)) {
      clones2 = 0;
    } else if (isUndefined(clones2)) {
      var fixedSize = options[resolve("fixedWidth")] && Components2.Layout.slideSize(0);
      var fixedCount = fixedSize && ceil(rect(Elements2.track)[resolve("width")] / fixedSize);
      clones2 = fixedCount || options[resolve("autoWidth")] && Splide2.length || options.perPage * MULTIPLIER;
    }
    return clones2;
  }
  return {
    mount,
    destroy
  };
}
function Move(Splide2, Components2, options) {
  var _EventInterface4 = EventInterface(Splide2), on = _EventInterface4.on, emit = _EventInterface4.emit;
  var set = Splide2.state.set;
  var _Components2$Layout = Components2.Layout, slideSize = _Components2$Layout.slideSize, getPadding = _Components2$Layout.getPadding, totalSize = _Components2$Layout.totalSize, listSize = _Components2$Layout.listSize, sliderSize = _Components2$Layout.sliderSize;
  var _Components2$Directio = Components2.Direction, resolve = _Components2$Directio.resolve, orient = _Components2$Directio.orient;
  var _Components2$Elements3 = Components2.Elements, list = _Components2$Elements3.list, track = _Components2$Elements3.track;
  var Transition;
  function mount() {
    Transition = Components2.Transition;
    on([EVENT_MOUNTED, EVENT_RESIZED, EVENT_UPDATED, EVENT_REFRESH], reposition);
  }
  function reposition() {
    if (!Components2.Controller.isBusy()) {
      Components2.Scroll.cancel();
      jump(Splide2.index);
      Components2.Slides.update();
    }
  }
  function move(dest, index, prev, callback) {
    if (dest !== index && canShift(dest > prev)) {
      cancel();
      translate(shift(getPosition(), dest > prev), true);
    }
    set(MOVING);
    emit(EVENT_MOVE, index, prev, dest);
    Transition.start(index, function() {
      set(IDLE);
      emit(EVENT_MOVED, index, prev, dest);
      callback && callback();
    });
  }
  function jump(index) {
    translate(toPosition(index, true));
  }
  function translate(position, preventLoop) {
    if (!Splide2.is(FADE)) {
      var destination = preventLoop ? position : loop(position);
      style(list, "transform", "translate" + resolve("X") + "(" + destination + "px)");
      position !== destination && emit(EVENT_SHIFTED);
    }
  }
  function loop(position) {
    if (Splide2.is(LOOP)) {
      var index = toIndex(position);
      var exceededMax = index > Components2.Controller.getEnd();
      var exceededMin = index < 0;
      if (exceededMin || exceededMax) {
        position = shift(position, exceededMax);
      }
    }
    return position;
  }
  function shift(position, backwards) {
    var excess = position - getLimit(backwards);
    var size = sliderSize();
    position -= orient(size * (ceil(abs(excess) / size) || 1)) * (backwards ? 1 : -1);
    return position;
  }
  function cancel() {
    translate(getPosition(), true);
    Transition.cancel();
  }
  function toIndex(position) {
    var Slides2 = Components2.Slides.get();
    var index = 0;
    var minDistance = Infinity;
    for (var i = 0; i < Slides2.length; i++) {
      var slideIndex = Slides2[i].index;
      var distance = abs(toPosition(slideIndex, true) - position);
      if (distance <= minDistance) {
        minDistance = distance;
        index = slideIndex;
      } else {
        break;
      }
    }
    return index;
  }
  function toPosition(index, trimming) {
    var position = orient(totalSize(index - 1) - offset(index));
    return trimming ? trim(position) : position;
  }
  function getPosition() {
    var left = resolve("left");
    return rect(list)[left] - rect(track)[left] + orient(getPadding(false));
  }
  function trim(position) {
    if (options.trimSpace && Splide2.is(SLIDE)) {
      position = clamp(position, 0, orient(sliderSize(true) - listSize()));
    }
    return position;
  }
  function offset(index) {
    var focus2 = options.focus;
    return focus2 === "center" ? (listSize() - slideSize(index, true)) / 2 : +focus2 * slideSize(index) || 0;
  }
  function getLimit(max2) {
    return toPosition(max2 ? Components2.Controller.getEnd() : 0, !!options.trimSpace);
  }
  function canShift(backwards) {
    var shifted = orient(shift(getPosition(), backwards));
    return backwards ? shifted >= 0 : shifted <= list[resolve("scrollWidth")] - rect(track)[resolve("width")];
  }
  function exceededLimit(max2, position) {
    position = isUndefined(position) ? getPosition() : position;
    var exceededMin = max2 !== true && orient(position) < orient(getLimit(false));
    var exceededMax = max2 !== false && orient(position) > orient(getLimit(true));
    return exceededMin || exceededMax;
  }
  return {
    mount,
    move,
    jump,
    translate,
    shift,
    cancel,
    toIndex,
    toPosition,
    getPosition,
    getLimit,
    exceededLimit,
    reposition
  };
}
function Controller(Splide2, Components2, options) {
  var _EventInterface5 = EventInterface(Splide2), on = _EventInterface5.on, emit = _EventInterface5.emit;
  var Move2 = Components2.Move;
  var getPosition = Move2.getPosition, getLimit = Move2.getLimit, toPosition = Move2.toPosition;
  var _Components2$Slides = Components2.Slides, isEnough = _Components2$Slides.isEnough, getLength = _Components2$Slides.getLength;
  var omitEnd = options.omitEnd;
  var isLoop = Splide2.is(LOOP);
  var isSlide = Splide2.is(SLIDE);
  var getNext = apply(getAdjacent, false);
  var getPrev = apply(getAdjacent, true);
  var currIndex = options.start || 0;
  var endIndex;
  var prevIndex = currIndex;
  var slideCount;
  var perMove;
  var perPage;
  function mount() {
    init2();
    on([EVENT_UPDATED, EVENT_REFRESH, EVENT_END_INDEX_CHANGED], init2);
    on(EVENT_RESIZED, onResized);
  }
  function init2() {
    slideCount = getLength(true);
    perMove = options.perMove;
    perPage = options.perPage;
    endIndex = getEnd();
    var index = clamp(currIndex, 0, omitEnd ? endIndex : slideCount - 1);
    if (index !== currIndex) {
      currIndex = index;
      Move2.reposition();
    }
  }
  function onResized() {
    if (endIndex !== getEnd()) {
      emit(EVENT_END_INDEX_CHANGED);
    }
  }
  function go(control, allowSameIndex, callback) {
    if (!isBusy()) {
      var dest = parse(control);
      var index = loop(dest);
      if (index > -1 && (allowSameIndex || index !== currIndex)) {
        setIndex(index);
        Move2.move(dest, index, prevIndex, callback);
      }
    }
  }
  function scroll(destination, duration, snap, callback) {
    Components2.Scroll.scroll(destination, duration, snap, function() {
      var index = loop(Move2.toIndex(getPosition()));
      setIndex(omitEnd ? min(index, endIndex) : index);
      callback && callback();
    });
  }
  function parse(control) {
    var index = currIndex;
    if (isString(control)) {
      var _ref = control.match(/([+\-<>])(\d+)?/) || [], indicator = _ref[1], number = _ref[2];
      if (indicator === "+" || indicator === "-") {
        index = computeDestIndex(currIndex + +("" + indicator + (+number || 1)), currIndex);
      } else if (indicator === ">") {
        index = number ? toIndex(+number) : getNext(true);
      } else if (indicator === "<") {
        index = getPrev(true);
      }
    } else {
      index = isLoop ? control : clamp(control, 0, endIndex);
    }
    return index;
  }
  function getAdjacent(prev, destination) {
    var number = perMove || (hasFocus() ? 1 : perPage);
    var dest = computeDestIndex(currIndex + number * (prev ? -1 : 1), currIndex, !(perMove || hasFocus()));
    if (dest === -1 && isSlide) {
      if (!approximatelyEqual(getPosition(), getLimit(!prev), 1)) {
        return prev ? 0 : endIndex;
      }
    }
    return destination ? dest : loop(dest);
  }
  function computeDestIndex(dest, from, snapPage) {
    if (isEnough() || hasFocus()) {
      var index = computeMovableDestIndex(dest);
      if (index !== dest) {
        from = dest;
        dest = index;
        snapPage = false;
      }
      if (dest < 0 || dest > endIndex) {
        if (!perMove && (between(0, dest, from, true) || between(endIndex, from, dest, true))) {
          dest = toIndex(toPage(dest));
        } else {
          if (isLoop) {
            dest = snapPage ? dest < 0 ? -(slideCount % perPage || perPage) : slideCount : dest;
          } else if (options.rewind) {
            dest = dest < 0 ? endIndex : 0;
          } else {
            dest = -1;
          }
        }
      } else {
        if (snapPage && dest !== from) {
          dest = toIndex(toPage(from) + (dest < from ? -1 : 1));
        }
      }
    } else {
      dest = -1;
    }
    return dest;
  }
  function computeMovableDestIndex(dest) {
    if (isSlide && options.trimSpace === "move" && dest !== currIndex) {
      var position = getPosition();
      while (position === toPosition(dest, true) && between(dest, 0, Splide2.length - 1, !options.rewind)) {
        dest < currIndex ? --dest : ++dest;
      }
    }
    return dest;
  }
  function loop(index) {
    return isLoop ? (index + slideCount) % slideCount || 0 : index;
  }
  function getEnd() {
    var end = slideCount - (hasFocus() || isLoop && perMove ? 1 : perPage);
    while (omitEnd && end-- > 0) {
      if (toPosition(slideCount - 1, true) !== toPosition(end, true)) {
        end++;
        break;
      }
    }
    return clamp(end, 0, slideCount - 1);
  }
  function toIndex(page) {
    return clamp(hasFocus() ? page : perPage * page, 0, endIndex);
  }
  function toPage(index) {
    return hasFocus() ? min(index, endIndex) : floor((index >= endIndex ? slideCount - 1 : index) / perPage);
  }
  function toDest(destination) {
    var closest2 = Move2.toIndex(destination);
    return isSlide ? clamp(closest2, 0, endIndex) : closest2;
  }
  function setIndex(index) {
    if (index !== currIndex) {
      prevIndex = currIndex;
      currIndex = index;
    }
  }
  function getIndex(prev) {
    return prev ? prevIndex : currIndex;
  }
  function hasFocus() {
    return !isUndefined(options.focus) || options.isNavigation;
  }
  function isBusy() {
    return Splide2.state.is([MOVING, SCROLLING]) && !!options.waitForTransition;
  }
  return {
    mount,
    go,
    scroll,
    getNext,
    getPrev,
    getAdjacent,
    getEnd,
    setIndex,
    getIndex,
    toIndex,
    toPage,
    toDest,
    hasFocus,
    isBusy
  };
}
var XML_NAME_SPACE = "http://www.w3.org/2000/svg";
var PATH = "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z";
var SIZE = 40;
function Arrows(Splide2, Components2, options) {
  var event = EventInterface(Splide2);
  var on = event.on, bind = event.bind, emit = event.emit;
  var classes = options.classes, i18n = options.i18n;
  var Elements2 = Components2.Elements, Controller2 = Components2.Controller;
  var placeholder = Elements2.arrows, track = Elements2.track;
  var wrapper = placeholder;
  var prev = Elements2.prev;
  var next = Elements2.next;
  var created;
  var wrapperClasses;
  var arrows = {};
  function mount() {
    init2();
    on(EVENT_UPDATED, remount);
  }
  function remount() {
    destroy();
    mount();
  }
  function init2() {
    var enabled = options.arrows;
    if (enabled && !(prev && next)) {
      createArrows();
    }
    if (prev && next) {
      assign(arrows, {
        prev,
        next
      });
      display(wrapper, enabled ? "" : "none");
      addClass(wrapper, wrapperClasses = CLASS_ARROWS + "--" + options.direction);
      if (enabled) {
        listen();
        update();
        setAttribute([prev, next], ARIA_CONTROLS, track.id);
        emit(EVENT_ARROWS_MOUNTED, prev, next);
      }
    }
  }
  function destroy() {
    event.destroy();
    removeClass(wrapper, wrapperClasses);
    if (created) {
      remove(placeholder ? [prev, next] : wrapper);
      prev = next = null;
    } else {
      removeAttribute([prev, next], ALL_ATTRIBUTES);
    }
  }
  function listen() {
    on([EVENT_MOUNTED, EVENT_MOVED, EVENT_REFRESH, EVENT_SCROLLED, EVENT_END_INDEX_CHANGED], update);
    bind(next, "click", apply(go, ">"));
    bind(prev, "click", apply(go, "<"));
  }
  function go(control) {
    Controller2.go(control, true);
  }
  function createArrows() {
    wrapper = placeholder || create("div", classes.arrows);
    prev = createArrow(true);
    next = createArrow(false);
    created = true;
    append(wrapper, [prev, next]);
    !placeholder && before(wrapper, track);
  }
  function createArrow(prev2) {
    var arrow = '<button class="' + classes.arrow + " " + (prev2 ? classes.prev : classes.next) + '" type="button"><svg xmlns="' + XML_NAME_SPACE + '" viewBox="0 0 ' + SIZE + " " + SIZE + '" width="' + SIZE + '" height="' + SIZE + '" focusable="false"><path d="' + (options.arrowPath || PATH) + '" />';
    return parseHtml(arrow);
  }
  function update() {
    if (prev && next) {
      var index = Splide2.index;
      var prevIndex = Controller2.getPrev();
      var nextIndex = Controller2.getNext();
      var prevLabel = prevIndex > -1 && index < prevIndex ? i18n.last : i18n.prev;
      var nextLabel = nextIndex > -1 && index > nextIndex ? i18n.first : i18n.next;
      prev.disabled = prevIndex < 0;
      next.disabled = nextIndex < 0;
      setAttribute(prev, ARIA_LABEL, prevLabel);
      setAttribute(next, ARIA_LABEL, nextLabel);
      emit(EVENT_ARROWS_UPDATED, prev, next, prevIndex, nextIndex);
    }
  }
  return {
    arrows,
    mount,
    destroy,
    update
  };
}
var INTERVAL_DATA_ATTRIBUTE = DATA_ATTRIBUTE + "-interval";
function Autoplay(Splide2, Components2, options) {
  var _EventInterface6 = EventInterface(Splide2), on = _EventInterface6.on, bind = _EventInterface6.bind, emit = _EventInterface6.emit;
  var interval = RequestInterval(options.interval, Splide2.go.bind(Splide2, ">"), onAnimationFrame);
  var isPaused = interval.isPaused;
  var Elements2 = Components2.Elements, _Components2$Elements4 = Components2.Elements, root = _Components2$Elements4.root, toggle = _Components2$Elements4.toggle;
  var autoplay = options.autoplay;
  var hovered;
  var focused;
  var stopped = autoplay === "pause";
  function mount() {
    if (autoplay) {
      listen();
      toggle && setAttribute(toggle, ARIA_CONTROLS, Elements2.track.id);
      stopped || play();
      update();
    }
  }
  function listen() {
    if (options.pauseOnHover) {
      bind(root, "mouseenter mouseleave", function(e) {
        hovered = e.type === "mouseenter";
        autoToggle();
      });
    }
    if (options.pauseOnFocus) {
      bind(root, "focusin focusout", function(e) {
        focused = e.type === "focusin";
        autoToggle();
      });
    }
    if (toggle) {
      bind(toggle, "click", function() {
        stopped ? play() : pause(true);
      });
    }
    on([EVENT_MOVE, EVENT_SCROLL, EVENT_REFRESH], interval.rewind);
    on(EVENT_MOVE, onMove);
  }
  function play() {
    if (isPaused() && Components2.Slides.isEnough()) {
      interval.start(!options.resetProgress);
      focused = hovered = stopped = false;
      update();
      emit(EVENT_AUTOPLAY_PLAY);
    }
  }
  function pause(stop) {
    if (stop === void 0) {
      stop = true;
    }
    stopped = !!stop;
    update();
    if (!isPaused()) {
      interval.pause();
      emit(EVENT_AUTOPLAY_PAUSE);
    }
  }
  function autoToggle() {
    if (!stopped) {
      hovered || focused ? pause(false) : play();
    }
  }
  function update() {
    if (toggle) {
      toggleClass(toggle, CLASS_ACTIVE, !stopped);
      setAttribute(toggle, ARIA_LABEL, options.i18n[stopped ? "play" : "pause"]);
    }
  }
  function onAnimationFrame(rate) {
    var bar = Elements2.bar;
    bar && style(bar, "width", rate * 100 + "%");
    emit(EVENT_AUTOPLAY_PLAYING, rate);
  }
  function onMove(index) {
    var Slide2 = Components2.Slides.getAt(index);
    interval.set(Slide2 && +getAttribute(Slide2.slide, INTERVAL_DATA_ATTRIBUTE) || options.interval);
  }
  return {
    mount,
    destroy: interval.cancel,
    play,
    pause,
    isPaused
  };
}
function Cover(Splide2, Components2, options) {
  var _EventInterface7 = EventInterface(Splide2), on = _EventInterface7.on;
  function mount() {
    if (options.cover) {
      on(EVENT_LAZYLOAD_LOADED, apply(toggle, true));
      on([EVENT_MOUNTED, EVENT_UPDATED, EVENT_REFRESH], apply(cover, true));
    }
  }
  function cover(cover2) {
    Components2.Slides.forEach(function(Slide2) {
      var img = child(Slide2.container || Slide2.slide, "img");
      if (img && img.src) {
        toggle(cover2, img, Slide2);
      }
    });
  }
  function toggle(cover2, img, Slide2) {
    Slide2.style("background", cover2 ? 'center/cover no-repeat url("' + img.src + '")' : "", true);
    display(img, cover2 ? "none" : "");
  }
  return {
    mount,
    destroy: apply(cover, false)
  };
}
var BOUNCE_DIFF_THRESHOLD = 10;
var BOUNCE_DURATION = 600;
var FRICTION_FACTOR = 0.6;
var BASE_VELOCITY = 1.5;
var MIN_DURATION = 800;
function Scroll(Splide2, Components2, options) {
  var _EventInterface8 = EventInterface(Splide2), on = _EventInterface8.on, emit = _EventInterface8.emit;
  var set = Splide2.state.set;
  var Move2 = Components2.Move;
  var getPosition = Move2.getPosition, getLimit = Move2.getLimit, exceededLimit = Move2.exceededLimit, translate = Move2.translate;
  var isSlide = Splide2.is(SLIDE);
  var interval;
  var callback;
  var friction = 1;
  function mount() {
    on(EVENT_MOVE, clear);
    on([EVENT_UPDATED, EVENT_REFRESH], cancel);
  }
  function scroll(destination, duration, snap, onScrolled, noConstrain) {
    var from = getPosition();
    clear();
    if (snap && (!isSlide || !exceededLimit())) {
      var size = Components2.Layout.sliderSize();
      var offset = sign(destination) * size * floor(abs(destination) / size) || 0;
      destination = Move2.toPosition(Components2.Controller.toDest(destination % size)) + offset;
    }
    var noDistance = approximatelyEqual(from, destination, 1);
    friction = 1;
    duration = noDistance ? 0 : duration || max(abs(destination - from) / BASE_VELOCITY, MIN_DURATION);
    callback = onScrolled;
    interval = RequestInterval(duration, onEnd, apply(update, from, destination, noConstrain), 1);
    set(SCROLLING);
    emit(EVENT_SCROLL);
    interval.start();
  }
  function onEnd() {
    set(IDLE);
    callback && callback();
    emit(EVENT_SCROLLED);
  }
  function update(from, to, noConstrain, rate) {
    var position = getPosition();
    var target = from + (to - from) * easing(rate);
    var diff = (target - position) * friction;
    translate(position + diff);
    if (isSlide && !noConstrain && exceededLimit()) {
      friction *= FRICTION_FACTOR;
      if (abs(diff) < BOUNCE_DIFF_THRESHOLD) {
        scroll(getLimit(exceededLimit(true)), BOUNCE_DURATION, false, callback, true);
      }
    }
  }
  function clear() {
    if (interval) {
      interval.cancel();
    }
  }
  function cancel() {
    if (interval && !interval.isPaused()) {
      clear();
      onEnd();
    }
  }
  function easing(t) {
    var easingFunc = options.easingFunc;
    return easingFunc ? easingFunc(t) : 1 - Math.pow(1 - t, 4);
  }
  return {
    mount,
    destroy: clear,
    scroll,
    cancel
  };
}
var SCROLL_LISTENER_OPTIONS = {
  passive: false,
  capture: true
};
function Drag(Splide2, Components2, options) {
  var _EventInterface9 = EventInterface(Splide2), on = _EventInterface9.on, emit = _EventInterface9.emit, bind = _EventInterface9.bind, unbind = _EventInterface9.unbind;
  var state = Splide2.state;
  var Move2 = Components2.Move, Scroll2 = Components2.Scroll, Controller2 = Components2.Controller, track = Components2.Elements.track, reduce = Components2.Media.reduce;
  var _Components2$Directio2 = Components2.Direction, resolve = _Components2$Directio2.resolve, orient = _Components2$Directio2.orient;
  var getPosition = Move2.getPosition, exceededLimit = Move2.exceededLimit;
  var basePosition;
  var baseEvent;
  var prevBaseEvent;
  var isFree;
  var dragging;
  var exceeded = false;
  var clickPrevented;
  var disabled;
  var target;
  function mount() {
    bind(track, POINTER_MOVE_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
    bind(track, POINTER_UP_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
    bind(track, POINTER_DOWN_EVENTS, onPointerDown, SCROLL_LISTENER_OPTIONS);
    bind(track, "click", onClick, {
      capture: true
    });
    bind(track, "dragstart", prevent);
    on([EVENT_MOUNTED, EVENT_UPDATED], init2);
  }
  function init2() {
    var drag = options.drag;
    disable(!drag);
    isFree = drag === "free";
  }
  function onPointerDown(e) {
    clickPrevented = false;
    if (!disabled) {
      var isTouch = isTouchEvent(e);
      if (isDraggable(e.target) && (isTouch || !e.button)) {
        if (!Controller2.isBusy()) {
          target = isTouch ? track : window;
          dragging = state.is([MOVING, SCROLLING]);
          prevBaseEvent = null;
          bind(target, POINTER_MOVE_EVENTS, onPointerMove, SCROLL_LISTENER_OPTIONS);
          bind(target, POINTER_UP_EVENTS, onPointerUp, SCROLL_LISTENER_OPTIONS);
          Move2.cancel();
          Scroll2.cancel();
          save(e);
        } else {
          prevent(e, true);
        }
      }
    }
  }
  function onPointerMove(e) {
    if (!state.is(DRAGGING)) {
      state.set(DRAGGING);
      emit(EVENT_DRAG);
    }
    if (e.cancelable) {
      if (dragging) {
        Move2.translate(basePosition + constrain(diffCoord(e)));
        var expired = diffTime(e) > LOG_INTERVAL;
        var hasExceeded = exceeded !== (exceeded = exceededLimit());
        if (expired || hasExceeded) {
          save(e);
        }
        clickPrevented = true;
        emit(EVENT_DRAGGING);
        prevent(e);
      } else if (isSliderDirection(e)) {
        dragging = shouldStart(e);
        prevent(e);
      }
    }
  }
  function onPointerUp(e) {
    if (state.is(DRAGGING)) {
      state.set(IDLE);
      emit(EVENT_DRAGGED);
    }
    if (dragging) {
      move(e);
      prevent(e);
    }
    unbind(target, POINTER_MOVE_EVENTS, onPointerMove);
    unbind(target, POINTER_UP_EVENTS, onPointerUp);
    dragging = false;
  }
  function onClick(e) {
    if (!disabled && clickPrevented) {
      prevent(e, true);
    }
  }
  function save(e) {
    prevBaseEvent = baseEvent;
    baseEvent = e;
    basePosition = getPosition();
  }
  function move(e) {
    var velocity = computeVelocity(e);
    var destination = computeDestination(velocity);
    var rewind = options.rewind && options.rewindByDrag;
    reduce(false);
    if (isFree) {
      Controller2.scroll(destination, 0, options.snap);
    } else if (Splide2.is(FADE)) {
      Controller2.go(orient(sign(velocity)) < 0 ? rewind ? "<" : "-" : rewind ? ">" : "+");
    } else if (Splide2.is(SLIDE) && exceeded && rewind) {
      Controller2.go(exceededLimit(true) ? ">" : "<");
    } else {
      Controller2.go(Controller2.toDest(destination), true);
    }
    reduce(true);
  }
  function shouldStart(e) {
    var thresholds = options.dragMinThreshold;
    var isObj = isObject(thresholds);
    var mouse = isObj && thresholds.mouse || 0;
    var touch = (isObj ? thresholds.touch : +thresholds) || 10;
    return abs(diffCoord(e)) > (isTouchEvent(e) ? touch : mouse);
  }
  function isSliderDirection(e) {
    return abs(diffCoord(e)) > abs(diffCoord(e, true));
  }
  function computeVelocity(e) {
    if (Splide2.is(LOOP) || !exceeded) {
      var time = diffTime(e);
      if (time && time < LOG_INTERVAL) {
        return diffCoord(e) / time;
      }
    }
    return 0;
  }
  function computeDestination(velocity) {
    return getPosition() + sign(velocity) * min(abs(velocity) * (options.flickPower || 600), isFree ? Infinity : Components2.Layout.listSize() * (options.flickMaxPages || 1));
  }
  function diffCoord(e, orthogonal) {
    return coordOf(e, orthogonal) - coordOf(getBaseEvent(e), orthogonal);
  }
  function diffTime(e) {
    return timeOf(e) - timeOf(getBaseEvent(e));
  }
  function getBaseEvent(e) {
    return baseEvent === e && prevBaseEvent || baseEvent;
  }
  function coordOf(e, orthogonal) {
    return (isTouchEvent(e) ? e.changedTouches[0] : e)["page" + resolve(orthogonal ? "Y" : "X")];
  }
  function constrain(diff) {
    return diff / (exceeded && Splide2.is(SLIDE) ? FRICTION : 1);
  }
  function isDraggable(target2) {
    var noDrag = options.noDrag;
    return !matches(target2, "." + CLASS_PAGINATION_PAGE + ", ." + CLASS_ARROW) && (!noDrag || !matches(target2, noDrag));
  }
  function isTouchEvent(e) {
    return typeof TouchEvent !== "undefined" && e instanceof TouchEvent;
  }
  function isDragging() {
    return dragging;
  }
  function disable(value) {
    disabled = value;
  }
  return {
    mount,
    disable,
    isDragging
  };
}
var NORMALIZATION_MAP = {
  Spacebar: " ",
  Right: ARROW_RIGHT,
  Left: ARROW_LEFT,
  Up: ARROW_UP,
  Down: ARROW_DOWN
};
function normalizeKey(key) {
  key = isString(key) ? key : key.key;
  return NORMALIZATION_MAP[key] || key;
}
var KEYBOARD_EVENT = "keydown";
function Keyboard(Splide2, Components2, options) {
  var _EventInterface10 = EventInterface(Splide2), on = _EventInterface10.on, bind = _EventInterface10.bind, unbind = _EventInterface10.unbind;
  var root = Splide2.root;
  var resolve = Components2.Direction.resolve;
  var target;
  var disabled;
  function mount() {
    init2();
    on(EVENT_UPDATED, destroy);
    on(EVENT_UPDATED, init2);
    on(EVENT_MOVE, onMove);
  }
  function init2() {
    var keyboard = options.keyboard;
    if (keyboard) {
      target = keyboard === "global" ? window : root;
      bind(target, KEYBOARD_EVENT, onKeydown);
    }
  }
  function destroy() {
    unbind(target, KEYBOARD_EVENT);
  }
  function disable(value) {
    disabled = value;
  }
  function onMove() {
    var _disabled = disabled;
    disabled = true;
    nextTick(function() {
      disabled = _disabled;
    });
  }
  function onKeydown(e) {
    if (!disabled) {
      var key = normalizeKey(e);
      if (key === resolve(ARROW_LEFT)) {
        Splide2.go("<");
      } else if (key === resolve(ARROW_RIGHT)) {
        Splide2.go(">");
      }
    }
  }
  return {
    mount,
    destroy,
    disable
  };
}
var SRC_DATA_ATTRIBUTE = DATA_ATTRIBUTE + "-lazy";
var SRCSET_DATA_ATTRIBUTE = SRC_DATA_ATTRIBUTE + "-srcset";
var IMAGE_SELECTOR = "[" + SRC_DATA_ATTRIBUTE + "], [" + SRCSET_DATA_ATTRIBUTE + "]";
function LazyLoad(Splide2, Components2, options) {
  var _EventInterface11 = EventInterface(Splide2), on = _EventInterface11.on, off = _EventInterface11.off, bind = _EventInterface11.bind, emit = _EventInterface11.emit;
  var isSequential = options.lazyLoad === "sequential";
  var events = [EVENT_MOVED, EVENT_SCROLLED];
  var entries = [];
  function mount() {
    if (options.lazyLoad) {
      init2();
      on(EVENT_REFRESH, init2);
    }
  }
  function init2() {
    empty(entries);
    register();
    if (isSequential) {
      loadNext();
    } else {
      off(events);
      on(events, check);
      check();
    }
  }
  function register() {
    Components2.Slides.forEach(function(Slide2) {
      queryAll(Slide2.slide, IMAGE_SELECTOR).forEach(function(img) {
        var src = getAttribute(img, SRC_DATA_ATTRIBUTE);
        var srcset = getAttribute(img, SRCSET_DATA_ATTRIBUTE);
        if (src !== img.src || srcset !== img.srcset) {
          var className = options.classes.spinner;
          var parent = img.parentElement;
          var spinner = child(parent, "." + className) || create("span", className, parent);
          entries.push([img, Slide2, spinner]);
          img.src || display(img, "none");
        }
      });
    });
  }
  function check() {
    entries = entries.filter(function(data) {
      var distance = options.perPage * ((options.preloadPages || 1) + 1) - 1;
      return data[1].isWithin(Splide2.index, distance) ? load(data) : true;
    });
    entries.length || off(events);
  }
  function load(data) {
    var img = data[0];
    addClass(data[1].slide, CLASS_LOADING);
    bind(img, "load error", apply(onLoad, data));
    setAttribute(img, "src", getAttribute(img, SRC_DATA_ATTRIBUTE));
    setAttribute(img, "srcset", getAttribute(img, SRCSET_DATA_ATTRIBUTE));
    removeAttribute(img, SRC_DATA_ATTRIBUTE);
    removeAttribute(img, SRCSET_DATA_ATTRIBUTE);
  }
  function onLoad(data, e) {
    var img = data[0], Slide2 = data[1];
    removeClass(Slide2.slide, CLASS_LOADING);
    if (e.type !== "error") {
      remove(data[2]);
      display(img, "");
      emit(EVENT_LAZYLOAD_LOADED, img, Slide2);
      emit(EVENT_RESIZE);
    }
    isSequential && loadNext();
  }
  function loadNext() {
    entries.length && load(entries.shift());
  }
  return {
    mount,
    destroy: apply(empty, entries),
    check
  };
}
function Pagination(Splide2, Components2, options) {
  var event = EventInterface(Splide2);
  var on = event.on, emit = event.emit, bind = event.bind;
  var Slides2 = Components2.Slides, Elements2 = Components2.Elements, Controller2 = Components2.Controller;
  var hasFocus = Controller2.hasFocus, getIndex = Controller2.getIndex, go = Controller2.go;
  var resolve = Components2.Direction.resolve;
  var placeholder = Elements2.pagination;
  var items = [];
  var list;
  var paginationClasses;
  function mount() {
    destroy();
    on([EVENT_UPDATED, EVENT_REFRESH, EVENT_END_INDEX_CHANGED], mount);
    var enabled = options.pagination;
    placeholder && display(placeholder, enabled ? "" : "none");
    if (enabled) {
      on([EVENT_MOVE, EVENT_SCROLL, EVENT_SCROLLED], update);
      createPagination();
      update();
      emit(EVENT_PAGINATION_MOUNTED, {
        list,
        items
      }, getAt(Splide2.index));
    }
  }
  function destroy() {
    if (list) {
      remove(placeholder ? slice(list.children) : list);
      removeClass(list, paginationClasses);
      empty(items);
      list = null;
    }
    event.destroy();
  }
  function createPagination() {
    var length = Splide2.length;
    var classes = options.classes, i18n = options.i18n, perPage = options.perPage;
    var max2 = hasFocus() ? Controller2.getEnd() + 1 : ceil(length / perPage);
    list = placeholder || create("ul", classes.pagination, Elements2.track.parentElement);
    addClass(list, paginationClasses = CLASS_PAGINATION + "--" + getDirection());
    setAttribute(list, ROLE, "tablist");
    setAttribute(list, ARIA_LABEL, i18n.select);
    setAttribute(list, ARIA_ORIENTATION, getDirection() === TTB ? "vertical" : "");
    for (var i = 0; i < max2; i++) {
      var li = create("li", null, list);
      var button = create("button", {
        class: classes.page,
        type: "button"
      }, li);
      var controls = Slides2.getIn(i).map(function(Slide2) {
        return Slide2.slide.id;
      });
      var text = !hasFocus() && perPage > 1 ? i18n.pageX : i18n.slideX;
      bind(button, "click", apply(onClick, i));
      if (options.paginationKeyboard) {
        bind(button, "keydown", apply(onKeydown, i));
      }
      setAttribute(li, ROLE, "presentation");
      setAttribute(button, ROLE, "tab");
      setAttribute(button, ARIA_CONTROLS, controls.join(" "));
      setAttribute(button, ARIA_LABEL, format(text, i + 1));
      setAttribute(button, TAB_INDEX, -1);
      items.push({
        li,
        button,
        page: i
      });
    }
  }
  function onClick(page) {
    go(">" + page, true);
  }
  function onKeydown(page, e) {
    var length = items.length;
    var key = normalizeKey(e);
    var dir = getDirection();
    var nextPage = -1;
    if (key === resolve(ARROW_RIGHT, false, dir)) {
      nextPage = ++page % length;
    } else if (key === resolve(ARROW_LEFT, false, dir)) {
      nextPage = (--page + length) % length;
    } else if (key === "Home") {
      nextPage = 0;
    } else if (key === "End") {
      nextPage = length - 1;
    }
    var item = items[nextPage];
    if (item) {
      focus(item.button);
      go(">" + nextPage);
      prevent(e, true);
    }
  }
  function getDirection() {
    return options.paginationDirection || options.direction;
  }
  function getAt(index) {
    return items[Controller2.toPage(index)];
  }
  function update() {
    var prev = getAt(getIndex(true));
    var curr = getAt(getIndex());
    if (prev) {
      var button = prev.button;
      removeClass(button, CLASS_ACTIVE);
      removeAttribute(button, ARIA_SELECTED);
      setAttribute(button, TAB_INDEX, -1);
    }
    if (curr) {
      var _button = curr.button;
      addClass(_button, CLASS_ACTIVE);
      setAttribute(_button, ARIA_SELECTED, true);
      setAttribute(_button, TAB_INDEX, "");
    }
    emit(EVENT_PAGINATION_UPDATED, {
      list,
      items
    }, prev, curr);
  }
  return {
    items,
    mount,
    destroy,
    getAt,
    update
  };
}
var TRIGGER_KEYS = [" ", "Enter"];
function Sync(Splide2, Components2, options) {
  var isNavigation = options.isNavigation, slideFocus = options.slideFocus;
  var events = [];
  function mount() {
    Splide2.splides.forEach(function(target) {
      if (!target.isParent) {
        sync(Splide2, target.splide);
        sync(target.splide, Splide2);
      }
    });
    if (isNavigation) {
      navigate();
    }
  }
  function destroy() {
    events.forEach(function(event) {
      event.destroy();
    });
    empty(events);
  }
  function remount() {
    destroy();
    mount();
  }
  function sync(splide, target) {
    var event = EventInterface(splide);
    event.on(EVENT_MOVE, function(index, prev, dest) {
      target.go(target.is(LOOP) ? dest : index);
    });
    events.push(event);
  }
  function navigate() {
    var event = EventInterface(Splide2);
    var on = event.on;
    on(EVENT_CLICK, onClick);
    on(EVENT_SLIDE_KEYDOWN, onKeydown);
    on([EVENT_MOUNTED, EVENT_UPDATED], update);
    events.push(event);
    event.emit(EVENT_NAVIGATION_MOUNTED, Splide2.splides);
  }
  function update() {
    setAttribute(Components2.Elements.list, ARIA_ORIENTATION, options.direction === TTB ? "vertical" : "");
  }
  function onClick(Slide2) {
    Splide2.go(Slide2.index);
  }
  function onKeydown(Slide2, e) {
    if (includes(TRIGGER_KEYS, normalizeKey(e))) {
      onClick(Slide2);
      prevent(e);
    }
  }
  return {
    setup: apply(Components2.Media.set, {
      slideFocus: isUndefined(slideFocus) ? isNavigation : slideFocus
    }, true),
    mount,
    destroy,
    remount
  };
}
function Wheel(Splide2, Components2, options) {
  var _EventInterface12 = EventInterface(Splide2), bind = _EventInterface12.bind;
  var lastTime = 0;
  function mount() {
    if (options.wheel) {
      bind(Components2.Elements.track, "wheel", onWheel, SCROLL_LISTENER_OPTIONS);
    }
  }
  function onWheel(e) {
    if (e.cancelable) {
      var deltaY = e.deltaY;
      var backwards = deltaY < 0;
      var timeStamp = timeOf(e);
      var _min = options.wheelMinThreshold || 0;
      var sleep = options.wheelSleep || 0;
      if (abs(deltaY) > _min && timeStamp - lastTime > sleep) {
        Splide2.go(backwards ? "<" : ">");
        lastTime = timeStamp;
      }
      shouldPrevent(backwards) && prevent(e);
    }
  }
  function shouldPrevent(backwards) {
    return !options.releaseWheel || Splide2.state.is(MOVING) || Components2.Controller.getAdjacent(backwards) !== -1;
  }
  return {
    mount
  };
}
var SR_REMOVAL_DELAY = 90;
function Live(Splide2, Components2, options) {
  var _EventInterface13 = EventInterface(Splide2), on = _EventInterface13.on;
  var track = Components2.Elements.track;
  var enabled = options.live && !options.isNavigation;
  var sr = create("span", CLASS_SR);
  var interval = RequestInterval(SR_REMOVAL_DELAY, apply(toggle, false));
  function mount() {
    if (enabled) {
      disable(!Components2.Autoplay.isPaused());
      setAttribute(track, ARIA_ATOMIC, true);
      sr.textContent = "\u2026";
      on(EVENT_AUTOPLAY_PLAY, apply(disable, true));
      on(EVENT_AUTOPLAY_PAUSE, apply(disable, false));
      on([EVENT_MOVED, EVENT_SCROLLED], apply(toggle, true));
    }
  }
  function toggle(active) {
    setAttribute(track, ARIA_BUSY, active);
    if (active) {
      append(track, sr);
      interval.start();
    } else {
      remove(sr);
      interval.cancel();
    }
  }
  function destroy() {
    removeAttribute(track, [ARIA_LIVE, ARIA_ATOMIC, ARIA_BUSY]);
    remove(sr);
  }
  function disable(disabled) {
    if (enabled) {
      setAttribute(track, ARIA_LIVE, disabled ? "off" : "polite");
    }
  }
  return {
    mount,
    disable,
    destroy
  };
}
var ComponentConstructors = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  Media,
  Direction,
  Elements,
  Slides,
  Layout,
  Clones,
  Move,
  Controller,
  Arrows,
  Autoplay,
  Cover,
  Scroll,
  Drag,
  Keyboard,
  LazyLoad,
  Pagination,
  Sync,
  Wheel,
  Live
});
var I18N = {
  prev: "Previous slide",
  next: "Next slide",
  first: "Go to first slide",
  last: "Go to last slide",
  slideX: "Go to slide %s",
  pageX: "Go to page %s",
  play: "Start autoplay",
  pause: "Pause autoplay",
  carousel: "carousel",
  slide: "slide",
  select: "Select a slide to show",
  slideLabel: "%s of %s"
};
var DEFAULTS = {
  type: "slide",
  role: "region",
  speed: 400,
  perPage: 1,
  cloneStatus: true,
  arrows: true,
  pagination: true,
  paginationKeyboard: true,
  interval: 5e3,
  pauseOnHover: true,
  pauseOnFocus: true,
  resetProgress: true,
  easing: "cubic-bezier(0.25, 1, 0.5, 1)",
  drag: true,
  direction: "ltr",
  trimSpace: true,
  focusableNodes: "a, button, textarea, input, select, iframe",
  live: true,
  classes: CLASSES,
  i18n: I18N,
  reducedMotion: {
    speed: 0,
    rewindSpeed: 0,
    autoplay: "pause"
  }
};
function Fade(Splide2, Components2, options) {
  var Slides2 = Components2.Slides;
  function mount() {
    EventInterface(Splide2).on([EVENT_MOUNTED, EVENT_REFRESH], init2);
  }
  function init2() {
    Slides2.forEach(function(Slide2) {
      Slide2.style("transform", "translateX(-" + 100 * Slide2.index + "%)");
    });
  }
  function start(index, done) {
    Slides2.style("transition", "opacity " + options.speed + "ms " + options.easing);
    nextTick(done);
  }
  return {
    mount,
    start,
    cancel: noop
  };
}
function Slide(Splide2, Components2, options) {
  var Move2 = Components2.Move, Controller2 = Components2.Controller, Scroll2 = Components2.Scroll;
  var list = Components2.Elements.list;
  var transition = apply(style, list, "transition");
  var endCallback;
  function mount() {
    EventInterface(Splide2).bind(list, "transitionend", function(e) {
      if (e.target === list && endCallback) {
        cancel();
        endCallback();
      }
    });
  }
  function start(index, done) {
    var destination = Move2.toPosition(index, true);
    var position = Move2.getPosition();
    var speed = getSpeed(index);
    if (abs(destination - position) >= 1 && speed >= 1) {
      if (options.useScroll) {
        Scroll2.scroll(destination, speed, false, done);
      } else {
        transition("transform " + speed + "ms " + options.easing);
        Move2.translate(destination, true);
        endCallback = done;
      }
    } else {
      Move2.jump(index);
      done();
    }
  }
  function cancel() {
    transition("");
    Scroll2.cancel();
  }
  function getSpeed(index) {
    var rewindSpeed = options.rewindSpeed;
    if (Splide2.is(SLIDE) && rewindSpeed) {
      var prev = Controller2.getIndex(true);
      var end = Controller2.getEnd();
      if (prev === 0 && index >= end || prev >= end && index === 0) {
        return rewindSpeed;
      }
    }
    return options.speed;
  }
  return {
    mount,
    start,
    cancel
  };
}
var _Splide = /* @__PURE__ */ (function() {
  function _Splide2(target, options) {
    this.event = EventInterface();
    this.Components = {};
    this.state = State(CREATED);
    this.splides = [];
    this._o = {};
    this._E = {};
    var root = isString(target) ? query(document, target) : target;
    assert(root, root + " is invalid.");
    this.root = root;
    options = merge({
      label: getAttribute(root, ARIA_LABEL) || "",
      labelledby: getAttribute(root, ARIA_LABELLEDBY) || ""
    }, DEFAULTS, _Splide2.defaults, options || {});
    try {
      merge(options, JSON.parse(getAttribute(root, DATA_ATTRIBUTE)));
    } catch (e) {
      assert(false, "Invalid JSON");
    }
    this._o = Object.create(merge({}, options));
  }
  var _proto = _Splide2.prototype;
  _proto.mount = function mount(Extensions, Transition) {
    var _this = this;
    var state = this.state, Components2 = this.Components;
    assert(state.is([CREATED, DESTROYED]), "Already mounted!");
    state.set(CREATED);
    this._C = Components2;
    this._T = Transition || this._T || (this.is(FADE) ? Fade : Slide);
    this._E = Extensions || this._E;
    var Constructors = assign({}, ComponentConstructors, this._E, {
      Transition: this._T
    });
    forOwn(Constructors, function(Component, key) {
      var component = Component(_this, Components2, _this._o);
      Components2[key] = component;
      component.setup && component.setup();
    });
    forOwn(Components2, function(component) {
      component.mount && component.mount();
    });
    this.emit(EVENT_MOUNTED);
    addClass(this.root, CLASS_INITIALIZED);
    state.set(IDLE);
    this.emit(EVENT_READY);
    return this;
  };
  _proto.sync = function sync(splide) {
    this.splides.push({
      splide
    });
    splide.splides.push({
      splide: this,
      isParent: true
    });
    if (this.state.is(IDLE)) {
      this._C.Sync.remount();
      splide.Components.Sync.remount();
    }
    return this;
  };
  _proto.go = function go(control) {
    this._C.Controller.go(control);
    return this;
  };
  _proto.on = function on(events, callback) {
    this.event.on(events, callback);
    return this;
  };
  _proto.off = function off(events) {
    this.event.off(events);
    return this;
  };
  _proto.emit = function emit(event) {
    var _this$event;
    (_this$event = this.event).emit.apply(_this$event, [event].concat(slice(arguments, 1)));
    return this;
  };
  _proto.add = function add(slides, index) {
    this._C.Slides.add(slides, index);
    return this;
  };
  _proto.remove = function remove2(matcher) {
    this._C.Slides.remove(matcher);
    return this;
  };
  _proto.is = function is(type) {
    return this._o.type === type;
  };
  _proto.refresh = function refresh() {
    this.emit(EVENT_REFRESH);
    return this;
  };
  _proto.destroy = function destroy(completely) {
    if (completely === void 0) {
      completely = true;
    }
    var event = this.event, state = this.state;
    if (state.is(CREATED)) {
      EventInterface(this).on(EVENT_READY, this.destroy.bind(this, completely));
    } else {
      forOwn(this._C, function(component) {
        component.destroy && component.destroy(completely);
      }, true);
      event.emit(EVENT_DESTROY);
      event.destroy();
      completely && empty(this.splides);
      state.set(DESTROYED);
    }
    return this;
  };
  _createClass(_Splide2, [{
    key: "options",
    get: function get() {
      return this._o;
    },
    set: function set(options) {
      this._C.Media.set(options, true, true);
    }
  }, {
    key: "length",
    get: function get() {
      return this._C.Slides.getLength(true);
    }
  }, {
    key: "index",
    get: function get() {
      return this._C.Controller.getIndex();
    }
  }]);
  return _Splide2;
})();
var Splide = _Splide;
Splide.defaults = {};
Splide.STATES = STATES;

// app/javascript/barba.js
var import_core = __toESM(require_barba_umd());

// app/javascript/map.js
await window.mapApiLoaded;
function initMap2(mapDiv) {
  console.log("initMap\u547C\u3073\u51FA\u3057\u76F4\u524D", !!window.google?.maps, mapDiv);
  const gmap = new google.maps.Map(mapDiv, {
    center: { lat: 35.6812, lng: 139.7671 },
    zoom: 15,
    mapId: "56e6f7b7602076fe1ca74db5"
  });
  window.map = gmap;
}
window.initMap = initMap2;

// app/javascript/set_marker.js
console.log("set_marker module loaded");
async function initMarkerEvents() {
  console.log("\u30DE\u30FC\u30AB\u30FC\u30A4\u30D9\u30F3\u30C8\u304C\u767A\u706B\u3057\u307E\u3057\u305F");
  await window.mapApiLoaded;
  const map2 = window.map;
  console.log("\u751F\u6210\u6E08\u307F\u30DE\u30C3\u30D7\u3092\u53D6\u5F97\u3057\u307E\u3057\u305F");
  if (!map2) {
    console.warn("\u5730\u56F3\u304C\u8AAD\u307F\u8FBC\u307E\u308C\u3066\u3044\u307E\u305B\u3093");
    return;
  }
  let selectedMarker = null;
  const infoWindow = new google.maps.InfoWindow();
  const geocoder = new google.maps.Geocoder();
  const placesService = new google.maps.places.PlacesService(map2);
  google.maps.event.addListener(window.map, "click", (event) => {
    console.log("\u3053\u306E\u30DE\u30FC\u30AB\u30FC\u304C\u30AF\u30EA\u30C3\u30AF\u3055\u308C\u307E\u3057\u305F:", selectedMarker);
    if (!event.placeId) {
      console.log("\u30DE\u30FC\u30AB\u30FC\u304C\u7F6E\u304B\u308C\u307E\u3057\u305F");
      if (selectedMarker) {
        selectedMarker.setMap(null);
        infoWindow.close();
      }
      selectedMarker = new google.maps.marker.AdvancedMarkerElement({
        position: event.latLng,
        map: map2,
        title: "\u9078\u629E\u5730\u70B9"
      });
      window.searchCenter = event.latLng;
      geocoder.geocode({ location: event.latLng }, (results, status) => {
        if (status === "OK" && results[0]) {
          let content = `<div><strong>\u4F4F\u6240: </strong> ${results[0].formatted_address}</div>`;
          placesService.nearbySearch(
            {
              location: event.latLng,
              radius: 30
              //半径30m以内
            },
            (places, pStatus) => {
              if (pStatus === "OK" && places.length > 0) {
                const place = places[0];
                let content2 = `
                  <div>
                    <strong>${place.name}</strong><br>
                    ${results[0].formatted_address}<br>
                    <button id="setStart">\u3053\u3053\u3092\u51FA\u767A\u5730\u306B\u8A2D\u5B9A</button>
                    <button id="setDestination">\u3053\u3053\u3092\u76EE\u7684\u5730\u306B\u8A2D\u5B9A</button> 
                  </div>
                `;
                infoWindow.setContent(content2);
                infoWindow.open(map2, selectedMarker);
                google.maps.event.addListenerOnce(infoWindow, "domready", () => {
                  document.getElementById("setStart").addEventListener("click", () => {
                    console.log("\u51FA\u767A\u5730\u306B\u8A2D\u5B9A: ", event.latLng.toString());
                    window.routeStart = event.latLng;
                    const startBtn = document.getElementById("startPoint");
                    if (startBtn) {
                      startBtn.textContent = results[0].formatted_address;
                    }
                    infoWindow.close();
                  });
                  document.getElementById("setDestination").addEventListener("click", () => {
                    console.log("\u76EE\u7684\u5730\u306B\u8A2D\u5B9A: ", event.latLng.toString());
                    window.routeDestination = event.latLng;
                    const destinationBtn = document.getElementById("destinationPoint");
                    if (destinationBtn) {
                      destinationBtn.textContent = results[0].formatted_address;
                    }
                    infoWindow.close();
                  });
                });
              } else {
                infoWindow.setContent(content);
                infoWindow.open(map2, selectedMarker);
              }
            }
          );
        }
      });
    }
  });
}

// app/javascript/search_box.js
function highlightMarker(marker, duration = 1500) {
  if (!marker) return;
  let facilityName = marker.getTitle ? marker.getTitle() : "";
  let facilityAddress = marker.placeResult && marker.placeResult.formattedAddress ? marker.placeResult.formattedAddress : marker.formattedAddress || "";
  console.log("\u65BD\u8A2D\u540D\u3001\u4F4F\u6240\u3092\u53D6\u308A\u51FA\u3057\u307E\u3057\u305F");
  if (!facilityAddress && marker.address) facilityAddress = marker.address;
  if (!facilityAddress && marker.label) facilityAddress = marker.label;
  const infoContent = `
    <div style = "min-width:200px";>
      <div style="font-weight:bold;font-size:1.1em;margin-bottom:4px;">${facilityName}</div>
      <div style="font-size:0.95em;margin-bottom:8px;color:#555;">${facilityAddress}</div>
      <button id="setStr" style="marin-right:8px;">\u3053\u3053\u3092\u51FA\u767A\u5730\u306B\u8A2D\u5B9A</button>
      <button id="setDest">\u3053\u3053\u3092\u76EE\u7684\u5730\u306B\u8A2D\u5B9A</button>
    </div>
  `;
  if (window.activeInfoWindow) {
    window.activeInfoWindow.close();
  }
  const infoWindow = new google.maps.InfoWindow({
    content: infoContent
  });
  infoWindow.open(marker.getMap(), marker);
  window.activeInfoWindow = infoWindow;
  google.maps.event.addListenerOnce(infoWindow, "domready", function() {
    console.log("setStr:", document.getElementById("setStr"));
    console.log("setDest:", document.getElementById("setDest"));
    const start_btn = document.getElementById("setStr");
    const destination_btn = document.getElementById("setDest");
    if (start_btn) {
      start_btn.addEventListener("click", function() {
        window.routeStart = marker.getPosition ? marker.getPosition() : marker.position;
        const uiStart = document.getElementById("startPoint");
        if (uiStart) {
          console.log("\u51FA\u767A\u5730UI\u3092\u66F4\u65B0\u3057\u307E\u3059:", uiStart);
          uiStart.textContent = facilityName || "\u9078\u629E\u3057\u305F\u5834\u6240";
        }
        infoWindow.close();
      });
    }
    console.log("\u51FA\u767A\u5730\u30DC\u30BF\u30F3\u306B\u30A4\u30D9\u30F3\u30C8\u767B\u9332\u3057\u307E\u3057\u305F", start_btn);
    if (destination_btn) {
      destination_btn.addEventListener("click", function() {
        window.routeDestination = marker.getPosition ? marker.getPosition() : marker.position;
        const uiDest = document.getElementById("destinationPoint");
        if (uiDest) {
          console.log("\u76EE\u7684\u5730UI\u3092\u66F4\u65B0\u3057\u307E\u3059:", uiDest);
          uiDest.textContent = facilityName || "\u9078\u629E\u3057\u305F\u5834\u6240";
        }
        infoWindow.close();
      });
    }
    console.log("\u76EE\u7684\u5730\u30DC\u30BF\u30F3\u306B\u30A4\u30D9\u30F3\u30C8\u767B\u9332\u3057\u307E\u3057\u305F", destination_btn);
  });
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(() => {
    marker.setAnimation(null);
  }, duration);
}
async function searchExactPlace(query2) {
  const { Place } = await google.maps.importLibrary("places");
  const center = map.getCenter();
  console.log("Place\u30E9\u30A4\u30D6\u30E9\u30EA\u304C\u547C\u3070\u308C\u307E\u3057\u305F");
  const request = {
    textQuery: query2,
    fields: ["location", "displayName", "formattedAddress", "photos"],
    // #マップの中心周辺５キロのように検索範囲を与える
    locationBias: center
  };
  const result = await Place.searchByText(request);
  console.log(result);
  if (!result.places || result.places.length === 0) {
    alert("\u8A72\u5F53\u3059\u308B\u65BD\u8A2D\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F");
    return;
  }
  const sortedPlaces = result.places.sort((a, b) => {
    const distA = google.maps.geometry.spherical.computeDistanceBetween(center, a.location);
    const distB = google.maps.geometry.spherical.computeDistanceBetween(center, b.location);
    return distA - distB;
  });
  if (window.markers && window.markers.length > 0) {
    window.markers.forEach((m) => m.setMap(null));
  }
  window.markers = [];
  sortedPlaces.forEach((place) => {
    const marker = new google.maps.Marker({
      position: place.location,
      map,
      title: place.displayName,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      }
    });
    window.markers.push(marker);
  });
  let mapDiv = document.getElementById("map");
  let container = document.getElementById("resultContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "resultContainer";
    container.style.maxHeight = "200px";
    container.style.overflowY = "auto";
    container.style.border = "1px solid #ccc";
    container.style.padding = "5px";
    container.style.marginTop = "10px";
    mapDiv.parentNode.insertBefore(container, mapDiv.nextSibling);
  } else {
    container.innerHTML = "";
  }
  sortedPlaces.forEach((place, index) => {
    const marker = window.markers[index];
    window.markers[index].addListener("click", () => {
      highlightMarker(window.markers[index]);
      const listItem = container.children[index];
      if (listItem) {
        listItem.scrollIntoView({ behavior: "smooth", block: "center" });
        listItem.style.backgroundColor = "#ffff99";
        setTimeout(() => {
          listItem.style.backgroundColor = "";
        }, 1500);
      }
    });
    const item = document.createElement("div");
    item.classList.add("result-item");
    item.style.borderBottom = "1px solid #eee";
    item.style.padding = "5px";
    item.style.cursor = "pointer";
    const name = document.createElement("h4");
    name.textContent = place.displayName;
    name.style.margin = "0 0 3px 0";
    const address = document.createElement("p");
    address.textContent = place.formattedAddress || "";
    address.style.margin = "0 0 3px 0";
    address.style.fontSize = "0.9em";
    address.style.color = "#555";
    let img;
    if (place.photos && place.photos.length > 0) {
      img = document.createElement("img");
      img.src = place.photos[0].getURI({ maxWidth: 100, maxHeight: 100 });
      img.style.display = "block";
      img.style.marginBottom = "3px";
    }
    item.appendChild(name);
    if (img) item.appendChild(img);
    item.appendChild(address);
    container.appendChild(item);
    item.addEventListener("click", () => {
      map.panTo(place.location);
      highlightMarker(markers[index]);
      console.log("highlightMarker\u304C\u547C\u3070\u308C\u305F");
    });
  });
}
function initSearchBox() {
  const btn = document.getElementById("searchBtn");
  const input = document.getElementById("address");
  console.log("\u691C\u7D22\u30DC\u30BF\u30F3\u30A2\u30AF\u30B7\u30E7\u30F3\u304C\u547C\u3070\u308C\u307E\u3057\u305F");
  if (btn && input) {
    btn.addEventListener("click", () => {
      const value = input.value.trim();
      if (value) {
        searchExactPlace(value);
      }
    });
  }
}
function clearSearchMarkersOnRouteDraw() {
  const walkBtn = document.getElementById("walkDrawRoute");
  const carBtn = document.getElementById("carDrawRoute");
  const clearMarkers = () => {
    if (window.markers && window.markers.length > 0) {
      window.markers.forEach((marker) => marker.setMap(null));
      window.markers = [];
      console.log("\u691C\u7D22\u30DE\u30FC\u30AB\u30FC\u3092\u6D88\u3057\u307E\u3057\u305F");
    }
  };
  if (walkBtn) walkBtn.addEventListener("click", clearMarkers);
  if (carBtn) carBtn.addEventListener("click", clearMarkers);
}

// app/javascript/search_parking.js
async function searchParking() {
  console.log("searchParking\u304C\u547C\u3070\u308C\u307E\u3057\u305F");
  const btn = document.getElementById("searchNearby");
  if (btn) {
    btn.addEventListener("click", async () => {
      const center = window.routeDestination;
      console.log("\u30DE\u30FC\u30AB\u30FC\u3092\u53D6\u5F97\u3057\u307E\u3057\u305F");
      if (!center) {
        alert("\u76EE\u7684\u5730\u3092\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044");
        return;
      }
      try {
        const { Place } = await google.maps.importLibrary("places");
        const request = {
          textQuery: "parking",
          locationBias: { lat: center.lat(), lng: center.lng() },
          fields: ["location", "displayName", "formattedAddress"]
        };
        const result = await Place.searchByText(request);
        if (!result.places || result.places.length === 0) {
          alert("\u5468\u8FBA\u306B\u99D0\u8ECA\u5834\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F");
          return;
        }
        result.places.forEach((place) => {
          const marker = new google.maps.marker.AdvancedMarkerElement({
            map: window.map,
            position: place.location,
            content: (() => {
              const div = document.createElement("div");
              div.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="green">
                  <path d="M18.92 6.01C18.72 5.42 18.15 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 
                  .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 
                  .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 
                  16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 
                  13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 
                  0c-.83 0-1.5-.67-1.5-1.5S16.67 13 17.5 
                  13s1.5.67 1.5 1.5S18.33 16 17.5 16zM5 11l1.5-4.5h11L19 
                  11H5z"/>
                </svg>
              `;
              return div;
            })()
          });
          if (!window.parkingMarkers) {
            window.parkingMarkers = [];
          }
          window.parkingMarkers.push(marker);
          marker.addListener("click", () => {
            if (window.activeInfoWindow) {
              window.activeInfoWindow.close();
            }
            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div style="min-width:200px">
                  <div style="font-size:0.95em;color:#555;">
                    ${place.formattedAddress || "\u4F4F\u6240\u60C5\u5831\u306A\u3057"}
                  </div>
                  <button id="setParking" style="marin-right:8px;">\u3053\u3053\u306B\u99D0\u8ECA\u3059\u308B</button>
                </div>
              `
            });
            infoWindow.open(window.map, marker);
            window.activeInfoWindow = infoWindow;
            google.maps.event.addListenerOnce(infoWindow, "domready", () => {
              const parkingBtn = document.getElementById("setParking");
              if (parkingBtn) {
                parkingBtn.addEventListener("click", () => {
                  window.routeParking = place.location;
                  if (window.parkingMarkers) {
                    window.parkingMarkers.forEach((m) => {
                      if (m !== marker) {
                        m.map = null;
                      }
                    });
                  }
                  const routeParkingBtn = document.getElementById("routeParking");
                  if (routeParkingBtn) {
                    routeParkingBtn.textContent = place.formattedAddress || "\u99D0\u8ECA\u5834";
                    routeParkingBtn.style.display = "inline-block";
                  }
                  infoWindow.close();
                });
              }
            });
          });
        });
        window.map.panTo(result.places[0].location);
      } catch (error) {
        alert("\u99D0\u8ECA\u5834\u306E\u691C\u7D22\u306B\u5931\u6557\u3057\u307E\u3057\u305F: " + error.message);
      }
    });
  }
}

// app/javascript/current_position.js
function getCurrentPosition() {
  return new Promise((resolve, reject2) => {
    if (!navigator.geolocation) {
      console.warn("\u3053\u306E\u30D6\u30E9\u30A6\u30B6\u306F\u4F4D\u7F6E\u60C5\u5831\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093");
      reject2(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const currentPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        window.currentPos = currentPos;
        console.log("\u73FE\u5728\u5730\u3092\u53D6\u5F97\u3057\u307E\u3057\u305F", currentPos);
        resolve(currentPos);
      },
      (err) => {
        console.error("\u4F4D\u7F6E\u60C5\u5831\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F:", err.message);
        reject2(err);
      }
    );
  });
}

// app/javascript/current_pos.js
function getLatLngFromPosition2(pos) {
  return {
    lat: pos.coords.latitude,
    lng: pos.coords.longitude
  };
}
function initCurrentPosBtn(buttonIds = ["currentPosBtn", "currentPosBtnCar"]) {
  console.log("\u73FE\u5728\u5730\u53D6\u5F97\u958B\u59CB");
  buttonIds.forEach((buttonId) => {
    const btn = document.getElementById(buttonId);
    console.log("btn:", btn);
    if (!btn) {
      console.warn(`\u30DC\u30BF\u30F3\u304C\u5B58\u5728\u3057\u307E\u305B\u3093: ${buttonId}`);
      return;
    }
    btn.addEventListener("click", (e) => {
      console.log("\u30AF\u30EA\u30C3\u30AF\u30A4\u30D9\u30F3\u30C8\u767A\u706B:", e.target);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const currentPos = getLatLngFromPosition2(pos);
          window.currentPos = currentPos;
          console.log("\u73FE\u5728\u5730\u53D6\u5F97\u5B8C\u4E86:", currentPos);
          const map2 = window.map;
          if (map2) {
            map2.setCenter(currentPos);
            if (window.currentPosMarker) {
              window.currentPosMarker.setMap(null);
            }
            window.currentPosMarker = new google.maps.Marker({
              position: currentPos,
              map: map2,
              title: "\u73FE\u5728\u5730",
              animation: google.maps.Animation.BOUNCE
            });
          } else {
            console.warn("\u30DE\u30C3\u30D7\u304C\u307E\u3060\u5B58\u5728\u3057\u307E\u305B\u3093");
          }
        },
        (err) => {
          console.log("\u73FE\u5728\u5730\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F: ", err);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5e3 }
      );
    });
  });
}

// app/javascript/navigation.js
console.log("navigation.js\u3092\u59CB\u3081\u307E\u3059");
var currentMarker;
var watchId;
var stepIndex = 0;
function startNavigation() {
  if (!window.directionsResult) {
    alert("\u30EB\u30FC\u30C8\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
    return;
  }
  const route = window.directionsResult.routes[0].legs[0];
  const steps = route.steps;
  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const currentPos = getLatLngFromPosition(pos);
      if (!currentMarker) {
        currentMarker = new google.maps.Marker({
          position: currentPos,
          map: window.map,
          title: "\u73FE\u5728\u5730",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: "#00F",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#FFF"
          }
        });
      } else {
        currentMarker.setPosition(currentPos);
      }
      window.map.panTo(currentPos);
      const nextStep = steps[stepIndex].end_location;
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(currentPos),
        nextStep
      );
      if (distance < 30 && stepIndex < steps.length - 1) {
        stepIndex++;
        console.log("\u6B21\u306E\u30B9\u30C6\u30C3\u30D7\u3078\u9032\u307F\u307E\u3059:", steps[stepIndex].instructions);
      }
    },
    (err) => {
      console.error("\u4F4D\u7F6E\u60C5\u5831\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F: ", err);
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 5e3 }
  );
}

// app/javascript/walk_route.js
async function walkDrawRoute() {
  await window.mapApiLoaded;
  const currentPos = await new Promise((resolve) => {
    if (window.currentPos) {
      resolve(window.currentPos);
    } else {
      const check = setInterval(() => {
        if (window.currentPos) {
          clearInterval(check);
          console.log("\u73FE\u5728\u5730\u306E\u53D6\u5F97\u304C\u5B8C\u4E86\u3057\u307E\u3057\u305F", window.currentPos);
          resolve(window.currentPos);
        }
      }, 200);
    }
  });
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(window.map);
  console.log("route\u547C\u3073\u51FA\u3057\u76F4\u524D:", window.routeStart, routeDestination);
  directionsService.route(
    {
      origin: window.routeStart || currentPos,
      destination: routeDestination,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.WALKING
    },
    (response, status) => {
      console.log("route\u30B3\u30FC\u30EB\u30D0\u30C3\u30AF\u547C\u3070\u308C\u305F", status);
      if (status === "OK") {
        directionsRenderer.setDirections(response);
        console.log("directionsResult\u8A2D\u5B9A\u524D:", response);
        window.directionsResult = response;
        console.log("window.directionsResult:", window.directionsResult);
      } else {
        alert("\u30EB\u30FC\u30C8\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F: " + status);
      }
    }
  );
}
function walkRouteBtn() {
  const walkDrawRouteBtn = document.getElementById("walkDrawRoute");
  console.log("walkDrawRouteBtn(\u76F4\u63A5\u53D6\u5F97):", walkDrawRouteBtn);
  if (walkDrawRouteBtn) {
    walkDrawRouteBtn.addEventListener("click", walkDrawRoute);
    console.log("walkDrawRoute\u30DC\u30BF\u30F3\u306B\u30A4\u30D9\u30F3\u30C8\u767B\u9332\u5B8C\u4E86");
  } else {
    console.warn("walkDrawRoute\u30DC\u30BF\u30F3\u304C\u5B58\u5728\u3057\u307E\u305B\u3093");
  }
}

// app/javascript/car_route.js
async function carDrawRoute() {
  await window.mapApiLoaded;
  console.log("routeDestination:", window.routeDestination);
  console.log("routeParking:", window.routeParking);
  const currentPos = await new Promise((resolve) => {
    if (window.currentPos) {
      resolve(window.currentPos);
    } else {
      const check = setInterval(() => {
        if (window.currentPos) {
          clearInterval(check);
          resolve(window.currentPos);
        }
      }, 200);
    }
  });
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(window.map);
  if (window.routeParking && typeof window.routeParking.lat === "function" && typeof window.routeParking.lng === "function" && window.routeDestination) {
    directionsService.route(
      {
        origin: window.routeStart || currentPos,
        destination: window.routeParking,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (response, status) => {
        if (status === "OK") {
          const renderer1 = new google.maps.DirectionsRenderer({
            map: window.map,
            polylineOptions: { strokeColor: "green" }
            //車ルートは緑
          });
          renderer1.setDirections(response);
        } else {
          alert("\u51FA\u767A\u5730\u2192\u99D0\u8ECA\u5834\u306E\u30EB\u30FC\u30C8\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F: " + status);
        }
      }
    );
    console.log("\u5F92\u6B69\u30EB\u30FC\u30C8\u3092\u691C\u7D22\u3057\u307E\u3059");
    directionsService.route(
      {
        origin: window.routeParking,
        destination: window.routeDestination,
        travelMode: google.maps.TravelMode.WALKING
      },
      (response, status) => {
        if (status === "OK") {
          const renderer2 = new google.maps.DirectionsRenderer({
            map: window.map,
            polylineOptions: { strokeColor: "blue" }
            //徒歩ルートは青
          });
          renderer2.setDirections(response);
        } else {
          alert("\u99D0\u8ECA\u5834\u2192\u76EE\u7684\u5730\u306E\u30EB\u30FC\u30C8\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F: " + status);
        }
      }
    );
  } else if (window.routeDestination) {
    directionsService.route(
      {
        origin: window.routeStart || currentPos,
        destination: window.routeDestination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
          window.directionsResult = response;
        } else {
          alert("\u30EB\u30FC\u30C8\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F: " + status);
        }
      }
    );
  } else {
    alert("\u76EE\u7684\u5730\u3092\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044");
  }
}
function carRouteBtn() {
  const carDrawRouteBtn = document.getElementById("carDrawRoute");
  if (carDrawRouteBtn) {
    carDrawRouteBtn.addEventListener("click", carDrawRoute);
  } else {
    console.warn("carDrawRoute\u30DC\u30BF\u30F3\u304C\u5B58\u5728\u3057\u307E\u305B\u3093");
  }
  console.log("carDrawRouteBtn: ", carDrawRouteBtn);
}

// app/javascript/barba.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("barba\u304C\u547C\u3070\u308C\u307E\u3057\u305F");
  import_core.default.init({
    transitions: [
      {
        name: "slide-left",
        once({ next }) {
          next.container.style.opacity = 1;
          console.log("barba\u306E\u9014\u4E2D\u7D4C\u904E1");
        },
        leave({ current }) {
          return new Promise((resolve) => {
            document.body.style.backgroundColor = "#FDF8F4";
            current.container.style.transform = "translateX(0)";
            current.container.style.transition = "transform 1s ease, opacity 1s ease";
            requestAnimationFrame(() => {
              current.container.style.transform = "translateX(-100%)";
              current.container.style.opacity = "0";
            });
            setTimeout(resolve, 1e3);
          });
        },
        enter({ next }) {
          document.body.style.backgroundColor = "#FFEFE2";
          next.container.style.transform = "translateX(100%)";
          next.container.style.transition = "transform 1s ease, opacity 1s ease";
          console.log("barba\u306E\u9014\u4E2D\u7D4C\u904E4");
          next.container.style.opacity = "1";
          requestAnimationFrame(() => {
            next.container.style.transform = "translateX(0)";
            console.log("barba\u304C\u5B8C\u4E86\u3057\u307E\u3057\u305F");
          });
        },
        afterEnter({ next }) {
          console.log("afterEnter\u304C\u547C\u3070\u308C\u307E\u3057\u305F", next.container);
          const el = next.container.querySelector("#splide");
          if (el) {
            new Splide(el, {
              type: "loop",
              autoplay: true,
              interval: 3e3,
              pauseOnHover: true,
              arrows: true,
              pagination: true
            }).mount();
          }
          console.log("afterEnter Splide\u304C\u547C\u3070\u308C\u307E\u3057\u305F");
          const mapIds = ["map", "naviMap", "carNaviMap"];
          mapIds.forEach((id) => {
            const mapDiv = next.container.querySelector(`#${id}`);
            console.log("mapDiv\u30C1\u30A7\u30C3\u30AF:", id, mapDiv);
            console.log("dataset.mapInitialized:", mapDiv?.dataset.mapInitialized);
            if (mapDiv && !mapDiv.dataset.mapInitialized) {
              initMap2(mapDiv);
              mapDiv.dataset.mapInitialized = "true";
              if (id === "map") {
                initMarkerEvents();
                initSearchBox();
                searchParking();
                getLatLngFromPosition2();
              }
              if (id === "naviMap") {
                console.log("naviMap \u7528 afterEnter \u51E6\u7406\u958B\u59CB");
                getCurrentPosition();
                walkRouteBtn();
                carRouteBtn();
                console.log("afterEnter directionsResult:", window.directionsResult);
                startNavigation();
              }
              if (id === "carNaviMap") {
                getCurrentPosition();
                walkRouteBtn();
                carRouteBtn();
                startNavigation();
              }
            }
            console.log("afterEnter\u304C\u7D42\u308F\u308A\u307E\u3057\u305F");
          });
        }
      }
    ]
  });
});

// app/javascript/maps_ready.js
window.mapApiLoaded = new Promise((resolve) => {
  if (window.google && window.google.maps) {
    resolve();
    return;
  }
  const script = document.querySelector(
    'script[src*="https://maps.googleapis.com/maps/api/js"]'
  );
  if (!script) {
    reject(new Error("Google Maps API script not found"));
    return;
  }
  script.addEventListener("load", () => {
    if (window.google && window.google.maps) {
      console.log("Google Maps API fully loaded");
      resolve();
    } else {
      reject(new Error("Google Maps API loaded but google.map is missing"));
    }
  });
  script.addEventListener("error", () => {
    reject(new Error("Faild to load Google Maps API script"));
  });
});
window.mapApiLoaded.then(() => console.log("mapsReady\u304Cresolve\u3055\u308C\u305F\u306E\u3067initMap", window.google?.maps));

// app/javascript/geocode_address.js
window.mapApiLoaded.then(() => {
  console.log("API\u306E\u6E96\u5099\u304C\u3067\u304D\u307E\u3057\u305F");
  let geocoder = new google.maps.Geocoder();
  window.geocodeAddress = function() {
    const address = document.getElementById("address").value;
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK") {
        const location = results[0].geometry.location;
        window.map.setCenter(location);
        if (window.marker) {
          window.marker.setMap(null);
        }
        window.marker = new google.maps.Marker({
          map: window.map,
          position: location
        });
      } else {
        alert("\u30B8\u30AA\u30B3\u30FC\u30C7\u30A3\u30F3\u30B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F: " + status);
      }
    });
  };
});

// app/javascript/application.js
console.log("application.js\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3059");
console.log("navigation.js typeof getLatLngFromPosition:", typeof getLatLngFromPosition);
console.log("DOMContentLoaded\u8AAD\u307F\u8FBC\u307F\u76F4\u524D");
await window.mapApiLoaded;
console.log("await\u7D42\u4E86");
function init() {
  console.log("readyState at addEventListener:", document.readyState);
  console.log("splide\u30C1\u30A7\u30C3\u30AF\u958B\u59CB");
  const el = document.querySelector("#splide");
  console.log("el\u53D6\u5F97:", el);
  console.log("Splide\u578B:", typeof Splide);
  if (el && typeof Splide !== "undefined") {
    try {
      new Splide(el, {
        type: "loop",
        autoplay: true,
        interval: 3e3,
        pauseOnHover: true,
        arrows: true,
        pagination: true
      }).mount();
    } catch (e) {
      console.log("Splide initialization skipped: ", e);
    }
  }
  console.log("splide\u7D42\u4E86");
  const initMapIds = ["map", "naviMap", "carNaviMap"];
  initMapIds.forEach((id) => {
    const mapDiv = document.getElementById(id);
    if (mapDiv && !mapDiv.dataset.mapInitialized) {
      console.log(`initMap\u547C\u3073\u51FA\u3057: #${id}`);
      initMap(mapDiv);
      mapDiv.dataset.mapInitialized = "true";
      if (id === "map") {
        initMarkerEvents();
        initSearchBox();
        highlightMarker();
        searchParking();
        walkRouteBtn();
        clearSearchMarkersOnRouteDraw();
        initCurrentPosBtn();
      } else if (id === "naviMap") {
        getCurrentPosition();
        startNavigation();
      } else if (id === "carNaviMap") {
        getCurrentPosition();
        startNavigation();
      } else {
        console.warn("mapDiv\u304C\u5B58\u5728\u3057\u306A\u3044\u304B\u3001\u65E2\u306B\u521D\u671F\u5316\u6E08\u307F\u3067\u3059");
      }
    }
  });
  console.log("\u73FE\u5728\u5730\u30DC\u30BF\u30F3\u521D\u671F\u5316\u30C1\u30A7\u30C3\u30AF");
  if (document.getElementById("currentPosBtn") || document.getElementById("currentPosBtnCar")) {
    initCurrentPosBtn(["currentPosBtn", "currentPosBtnCar"]);
  }
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
/*! Bundled license information:

@splidejs/splide/dist/js/splide.esm.js:
  (*!
   * Splide.js
   * Version  : 4.1.4
   * License  : MIT
   * Copyright: 2022 Naotoshi Fujita
   *)
*/
//# sourceMappingURL=/assets/builds/application.js.map
