var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var main = "";
class User {
  constructor(conf) {
    __publicField(this, "data");
    const localUser = JSON.parse(window.localStorage.getItem("ArtalkUser") || "{}");
    this.data = {
      nick: localUser.nick || "",
      email: localUser.email || "",
      link: localUser.link || "",
      token: localUser.token || "",
      isAdmin: localUser.isAdmin || false
    };
  }
  save() {
    window.localStorage.setItem("ArtalkUser", JSON.stringify(this.data));
  }
  checkHasBasicUserInfo() {
    return !!this.data.nick && !!this.data.email;
  }
}
class Context {
  constructor(rootEl, conf) {
    __publicField(this, "cid");
    __publicField(this, "$root");
    __publicField(this, "conf");
    __publicField(this, "user");
    __publicField(this, "eventList", []);
    this.cid = +new Date();
    this.$root = rootEl;
    this.conf = conf;
    this.user = new User(this.conf);
    this.$root.setAttribute("atk-run-id", this.cid.toString());
  }
  on(name, handler, scope = "internal") {
    this.eventList.push({ name, handler, scope });
  }
  off(name, handler, scope = "internal") {
    this.eventList = this.eventList.filter((evt) => {
      if (handler)
        return !(evt.name === name && evt.handler === handler && evt.scope === scope);
      return !(evt.name === name && evt.scope === scope);
    });
  }
  trigger(name, payload, scope) {
    this.eventList.filter((evt) => evt.name === name && (scope ? evt.scope === scope : true)).map((evt) => evt.handler).forEach((handler) => handler(payload));
  }
}
const defaults$3 = {
  el: "",
  pageKey: "",
  server: "",
  site: "",
  placeholder: "\u952E\u5165\u5185\u5BB9...",
  noComment: "\u300C\u6B64\u65F6\u65E0\u58F0\u80DC\u6709\u58F0\u300D",
  sendBtn: "\u53D1\u9001\u8BC4\u8BBA",
  darkMode: false,
  emoticons: "https://cdn.jsdelivr.net/gh/ArtalkJS/Emoticons/grps/default.json",
  vote: true,
  voteDown: false,
  uaBadge: true,
  flatMode: "auto",
  maxNesting: 3,
  gravatar: {
    default: "mp",
    mirror: "https://sdn.geekzu.org/avatar/"
  },
  pagination: {
    pageSize: 15,
    readMore: true,
    autoLoad: true
  },
  heightLimit: {
    content: 300,
    children: 400
  },
  reqTimeout: 15e3,
  versionCheck: true
};
class Component {
  constructor(ctx) {
    __publicField(this, "$el");
    __publicField(this, "ctx");
    __publicField(this, "conf");
    this.ctx = ctx;
    this.conf = ctx.conf;
  }
}
function getDefaults() {
  return {
    baseUrl: null,
    breaks: false,
    extensions: null,
    gfm: true,
    headerIds: true,
    headerPrefix: "",
    highlight: null,
    langPrefix: "language-",
    mangle: true,
    pedantic: false,
    renderer: null,
    sanitize: false,
    sanitizer: null,
    silent: false,
    smartLists: false,
    smartypants: false,
    tokenizer: null,
    walkTokens: null,
    xhtml: false
  };
}
let defaults$2 = getDefaults();
function changeDefaults(newDefaults) {
  defaults$2 = newDefaults;
}
const escapeTest = /[&<>"']/;
const escapeReplace = /[&<>"']/g;
const escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
const escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
const escapeReplacements = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
const getEscapeReplacement = (ch) => escapeReplacements[ch];
function escape(html, encode) {
  if (encode) {
    if (escapeTest.test(html)) {
      return html.replace(escapeReplace, getEscapeReplacement);
    }
  } else {
    if (escapeTestNoEncode.test(html)) {
      return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
    }
  }
  return html;
}
const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
function unescape(html) {
  return html.replace(unescapeTest, (_, n) => {
    n = n.toLowerCase();
    if (n === "colon")
      return ":";
    if (n.charAt(0) === "#") {
      return n.charAt(1) === "x" ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
    }
    return "";
  });
}
const caret = /(^|[^\[])\^/g;
function edit(regex, opt) {
  regex = regex.source || regex;
  opt = opt || "";
  const obj = {
    replace: (name, val) => {
      val = val.source || val;
      val = val.replace(caret, "$1");
      regex = regex.replace(name, val);
      return obj;
    },
    getRegex: () => {
      return new RegExp(regex, opt);
    }
  };
  return obj;
}
const nonWordAndColonTest = /[^\w:]/g;
const originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
function cleanUrl(sanitize, base, href) {
  if (sanitize) {
    let prot;
    try {
      prot = decodeURIComponent(unescape(href)).replace(nonWordAndColonTest, "").toLowerCase();
    } catch (e) {
      return null;
    }
    if (prot.indexOf("javascript:") === 0 || prot.indexOf("vbscript:") === 0 || prot.indexOf("data:") === 0) {
      return null;
    }
  }
  if (base && !originIndependentUrl.test(href)) {
    href = resolveUrl(base, href);
  }
  try {
    href = encodeURI(href).replace(/%25/g, "%");
  } catch (e) {
    return null;
  }
  return href;
}
const baseUrls = {};
const justDomain = /^[^:]+:\/*[^/]*$/;
const protocol = /^([^:]+:)[\s\S]*$/;
const domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;
function resolveUrl(base, href) {
  if (!baseUrls[" " + base]) {
    if (justDomain.test(base)) {
      baseUrls[" " + base] = base + "/";
    } else {
      baseUrls[" " + base] = rtrim(base, "/", true);
    }
  }
  base = baseUrls[" " + base];
  const relativeBase = base.indexOf(":") === -1;
  if (href.substring(0, 2) === "//") {
    if (relativeBase) {
      return href;
    }
    return base.replace(protocol, "$1") + href;
  } else if (href.charAt(0) === "/") {
    if (relativeBase) {
      return href;
    }
    return base.replace(domain, "$1") + href;
  } else {
    return base + href;
  }
}
const noopTest = { exec: function noopTest2() {
} };
function merge(obj) {
  let i = 1, target, key;
  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }
  return obj;
}
function splitCells(tableRow, count) {
  const row = tableRow.replace(/\|/g, (match, offset, str) => {
    let escaped = false, curr = offset;
    while (--curr >= 0 && str[curr] === "\\")
      escaped = !escaped;
    if (escaped) {
      return "|";
    } else {
      return " |";
    }
  }), cells = row.split(/ \|/);
  let i = 0;
  if (!cells[0].trim()) {
    cells.shift();
  }
  if (!cells[cells.length - 1].trim()) {
    cells.pop();
  }
  if (cells.length > count) {
    cells.splice(count);
  } else {
    while (cells.length < count)
      cells.push("");
  }
  for (; i < cells.length; i++) {
    cells[i] = cells[i].trim().replace(/\\\|/g, "|");
  }
  return cells;
}
function rtrim(str, c, invert) {
  const l = str.length;
  if (l === 0) {
    return "";
  }
  let suffLen = 0;
  while (suffLen < l) {
    const currChar = str.charAt(l - suffLen - 1);
    if (currChar === c && !invert) {
      suffLen++;
    } else if (currChar !== c && invert) {
      suffLen++;
    } else {
      break;
    }
  }
  return str.substr(0, l - suffLen);
}
function findClosingBracket(str, b) {
  if (str.indexOf(b[1]) === -1) {
    return -1;
  }
  const l = str.length;
  let level = 0, i = 0;
  for (; i < l; i++) {
    if (str[i] === "\\") {
      i++;
    } else if (str[i] === b[0]) {
      level++;
    } else if (str[i] === b[1]) {
      level--;
      if (level < 0) {
        return i;
      }
    }
  }
  return -1;
}
function checkSanitizeDeprecation(opt) {
  if (opt && opt.sanitize && !opt.silent) {
    console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options");
  }
}
function repeatString(pattern, count) {
  if (count < 1) {
    return "";
  }
  let result = "";
  while (count > 1) {
    if (count & 1) {
      result += pattern;
    }
    count >>= 1;
    pattern += pattern;
  }
  return result + pattern;
}
function outputLink(cap, link, raw, lexer) {
  const href = link.href;
  const title = link.title ? escape(link.title) : null;
  const text = cap[1].replace(/\\([\[\]])/g, "$1");
  if (cap[0].charAt(0) !== "!") {
    lexer.state.inLink = true;
    const token = {
      type: "link",
      raw,
      href,
      title,
      text,
      tokens: lexer.inlineTokens(text, [])
    };
    lexer.state.inLink = false;
    return token;
  } else {
    return {
      type: "image",
      raw,
      href,
      title,
      text: escape(text)
    };
  }
}
function indentCodeCompensation(raw, text) {
  const matchIndentToCode = raw.match(/^(\s+)(?:```)/);
  if (matchIndentToCode === null) {
    return text;
  }
  const indentToCode = matchIndentToCode[1];
  return text.split("\n").map((node) => {
    const matchIndentInNode = node.match(/^\s+/);
    if (matchIndentInNode === null) {
      return node;
    }
    const [indentInNode] = matchIndentInNode;
    if (indentInNode.length >= indentToCode.length) {
      return node.slice(indentToCode.length);
    }
    return node;
  }).join("\n");
}
class Tokenizer {
  constructor(options) {
    this.options = options || defaults$2;
  }
  space(src) {
    const cap = this.rules.block.newline.exec(src);
    if (cap) {
      if (cap[0].length > 1) {
        return {
          type: "space",
          raw: cap[0]
        };
      }
      return { raw: "\n" };
    }
  }
  code(src) {
    const cap = this.rules.block.code.exec(src);
    if (cap) {
      const text = cap[0].replace(/^ {1,4}/gm, "");
      return {
        type: "code",
        raw: cap[0],
        codeBlockStyle: "indented",
        text: !this.options.pedantic ? rtrim(text, "\n") : text
      };
    }
  }
  fences(src) {
    const cap = this.rules.block.fences.exec(src);
    if (cap) {
      const raw = cap[0];
      const text = indentCodeCompensation(raw, cap[3] || "");
      return {
        type: "code",
        raw,
        lang: cap[2] ? cap[2].trim() : cap[2],
        text
      };
    }
  }
  heading(src) {
    const cap = this.rules.block.heading.exec(src);
    if (cap) {
      let text = cap[2].trim();
      if (/#$/.test(text)) {
        const trimmed = rtrim(text, "#");
        if (this.options.pedantic) {
          text = trimmed.trim();
        } else if (!trimmed || / $/.test(trimmed)) {
          text = trimmed.trim();
        }
      }
      const token = {
        type: "heading",
        raw: cap[0],
        depth: cap[1].length,
        text,
        tokens: []
      };
      this.lexer.inline(token.text, token.tokens);
      return token;
    }
  }
  hr(src) {
    const cap = this.rules.block.hr.exec(src);
    if (cap) {
      return {
        type: "hr",
        raw: cap[0]
      };
    }
  }
  blockquote(src) {
    const cap = this.rules.block.blockquote.exec(src);
    if (cap) {
      const text = cap[0].replace(/^ *> ?/gm, "");
      return {
        type: "blockquote",
        raw: cap[0],
        tokens: this.lexer.blockTokens(text, []),
        text
      };
    }
  }
  list(src) {
    let cap = this.rules.block.list.exec(src);
    if (cap) {
      let raw, istask, ischecked, indent, i, blankLine, endsWithBlankLine, line, lines, itemContents;
      let bull = cap[1].trim();
      const isordered = bull.length > 1;
      const list2 = {
        type: "list",
        raw: "",
        ordered: isordered,
        start: isordered ? +bull.slice(0, -1) : "",
        loose: false,
        items: []
      };
      bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;
      if (this.options.pedantic) {
        bull = isordered ? bull : "[*+-]";
      }
      const itemRegex = new RegExp(`^( {0,3}${bull})((?: [^\\n]*| *)(?:\\n[^\\n]*)*(?:\\n|$))`);
      while (src) {
        if (this.rules.block.hr.test(src)) {
          break;
        }
        if (!(cap = itemRegex.exec(src))) {
          break;
        }
        lines = cap[2].split("\n");
        if (this.options.pedantic) {
          indent = 2;
          itemContents = lines[0].trimLeft();
        } else {
          indent = cap[2].search(/[^ ]/);
          indent = cap[1].length + (indent > 4 ? 1 : indent);
          itemContents = lines[0].slice(indent - cap[1].length);
        }
        blankLine = false;
        raw = cap[0];
        if (!lines[0] && /^ *$/.test(lines[1])) {
          raw = cap[1] + lines.slice(0, 2).join("\n") + "\n";
          list2.loose = true;
          lines = [];
        }
        const nextBulletRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])`);
        for (i = 1; i < lines.length; i++) {
          line = lines[i];
          if (this.options.pedantic) {
            line = line.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ");
          }
          if (nextBulletRegex.test(line)) {
            raw = cap[1] + lines.slice(0, i).join("\n") + "\n";
            break;
          }
          if (!blankLine) {
            if (!line.trim()) {
              blankLine = true;
            }
            if (line.search(/[^ ]/) >= indent) {
              itemContents += "\n" + line.slice(indent);
            } else {
              itemContents += "\n" + line;
            }
            continue;
          }
          if (line.search(/[^ ]/) >= indent || !line.trim()) {
            itemContents += "\n" + line.slice(indent);
            continue;
          } else {
            raw = cap[1] + lines.slice(0, i).join("\n") + "\n";
            break;
          }
        }
        if (!list2.loose) {
          if (endsWithBlankLine) {
            list2.loose = true;
          } else if (/\n *\n *$/.test(raw)) {
            endsWithBlankLine = true;
          }
        }
        if (this.options.gfm) {
          istask = /^\[[ xX]\] /.exec(itemContents);
          if (istask) {
            ischecked = istask[0] !== "[ ] ";
            itemContents = itemContents.replace(/^\[[ xX]\] +/, "");
          }
        }
        list2.items.push({
          type: "list_item",
          raw,
          task: !!istask,
          checked: ischecked,
          loose: false,
          text: itemContents
        });
        list2.raw += raw;
        src = src.slice(raw.length);
      }
      list2.items[list2.items.length - 1].raw = raw.trimRight();
      list2.items[list2.items.length - 1].text = itemContents.trimRight();
      list2.raw = list2.raw.trimRight();
      const l = list2.items.length;
      for (i = 0; i < l; i++) {
        this.lexer.state.top = false;
        list2.items[i].tokens = this.lexer.blockTokens(list2.items[i].text, []);
        if (list2.items[i].tokens.some((t) => t.type === "space")) {
          list2.loose = true;
          list2.items[i].loose = true;
        }
      }
      return list2;
    }
  }
  html(src) {
    const cap = this.rules.block.html.exec(src);
    if (cap) {
      const token = {
        type: "html",
        raw: cap[0],
        pre: !this.options.sanitizer && (cap[1] === "pre" || cap[1] === "script" || cap[1] === "style"),
        text: cap[0]
      };
      if (this.options.sanitize) {
        token.type = "paragraph";
        token.text = this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]);
        token.tokens = [];
        this.lexer.inline(token.text, token.tokens);
      }
      return token;
    }
  }
  def(src) {
    const cap = this.rules.block.def.exec(src);
    if (cap) {
      if (cap[3])
        cap[3] = cap[3].substring(1, cap[3].length - 1);
      const tag = cap[1].toLowerCase().replace(/\s+/g, " ");
      return {
        type: "def",
        tag,
        raw: cap[0],
        href: cap[2],
        title: cap[3]
      };
    }
  }
  table(src) {
    const cap = this.rules.block.table.exec(src);
    if (cap) {
      const item = {
        type: "table",
        header: splitCells(cap[1]).map((c) => {
          return { text: c };
        }),
        align: cap[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
        rows: cap[3] ? cap[3].replace(/\n$/, "").split("\n") : []
      };
      if (item.header.length === item.align.length) {
        item.raw = cap[0];
        let l = item.align.length;
        let i, j, k, row;
        for (i = 0; i < l; i++) {
          if (/^ *-+: *$/.test(item.align[i])) {
            item.align[i] = "right";
          } else if (/^ *:-+: *$/.test(item.align[i])) {
            item.align[i] = "center";
          } else if (/^ *:-+ *$/.test(item.align[i])) {
            item.align[i] = "left";
          } else {
            item.align[i] = null;
          }
        }
        l = item.rows.length;
        for (i = 0; i < l; i++) {
          item.rows[i] = splitCells(item.rows[i], item.header.length).map((c) => {
            return { text: c };
          });
        }
        l = item.header.length;
        for (j = 0; j < l; j++) {
          item.header[j].tokens = [];
          this.lexer.inlineTokens(item.header[j].text, item.header[j].tokens);
        }
        l = item.rows.length;
        for (j = 0; j < l; j++) {
          row = item.rows[j];
          for (k = 0; k < row.length; k++) {
            row[k].tokens = [];
            this.lexer.inlineTokens(row[k].text, row[k].tokens);
          }
        }
        return item;
      }
    }
  }
  lheading(src) {
    const cap = this.rules.block.lheading.exec(src);
    if (cap) {
      const token = {
        type: "heading",
        raw: cap[0],
        depth: cap[2].charAt(0) === "=" ? 1 : 2,
        text: cap[1],
        tokens: []
      };
      this.lexer.inline(token.text, token.tokens);
      return token;
    }
  }
  paragraph(src) {
    const cap = this.rules.block.paragraph.exec(src);
    if (cap) {
      const token = {
        type: "paragraph",
        raw: cap[0],
        text: cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1],
        tokens: []
      };
      this.lexer.inline(token.text, token.tokens);
      return token;
    }
  }
  text(src) {
    const cap = this.rules.block.text.exec(src);
    if (cap) {
      const token = {
        type: "text",
        raw: cap[0],
        text: cap[0],
        tokens: []
      };
      this.lexer.inline(token.text, token.tokens);
      return token;
    }
  }
  escape(src) {
    const cap = this.rules.inline.escape.exec(src);
    if (cap) {
      return {
        type: "escape",
        raw: cap[0],
        text: escape(cap[1])
      };
    }
  }
  tag(src) {
    const cap = this.rules.inline.tag.exec(src);
    if (cap) {
      if (!this.lexer.state.inLink && /^<a /i.test(cap[0])) {
        this.lexer.state.inLink = true;
      } else if (this.lexer.state.inLink && /^<\/a>/i.test(cap[0])) {
        this.lexer.state.inLink = false;
      }
      if (!this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        this.lexer.state.inRawBlock = true;
      } else if (this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        this.lexer.state.inRawBlock = false;
      }
      return {
        type: this.options.sanitize ? "text" : "html",
        raw: cap[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0]
      };
    }
  }
  link(src) {
    const cap = this.rules.inline.link.exec(src);
    if (cap) {
      const trimmedUrl = cap[2].trim();
      if (!this.options.pedantic && /^</.test(trimmedUrl)) {
        if (!/>$/.test(trimmedUrl)) {
          return;
        }
        const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), "\\");
        if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
          return;
        }
      } else {
        const lastParenIndex = findClosingBracket(cap[2], "()");
        if (lastParenIndex > -1) {
          const start = cap[0].indexOf("!") === 0 ? 5 : 4;
          const linkLen = start + cap[1].length + lastParenIndex;
          cap[2] = cap[2].substring(0, lastParenIndex);
          cap[0] = cap[0].substring(0, linkLen).trim();
          cap[3] = "";
        }
      }
      let href = cap[2];
      let title = "";
      if (this.options.pedantic) {
        const link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);
        if (link) {
          href = link[1];
          title = link[3];
        }
      } else {
        title = cap[3] ? cap[3].slice(1, -1) : "";
      }
      href = href.trim();
      if (/^</.test(href)) {
        if (this.options.pedantic && !/>$/.test(trimmedUrl)) {
          href = href.slice(1);
        } else {
          href = href.slice(1, -1);
        }
      }
      return outputLink(cap, {
        href: href ? href.replace(this.rules.inline._escapes, "$1") : href,
        title: title ? title.replace(this.rules.inline._escapes, "$1") : title
      }, cap[0], this.lexer);
    }
  }
  reflink(src, links) {
    let cap;
    if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
      let link = (cap[2] || cap[1]).replace(/\s+/g, " ");
      link = links[link.toLowerCase()];
      if (!link || !link.href) {
        const text = cap[0].charAt(0);
        return {
          type: "text",
          raw: text,
          text
        };
      }
      return outputLink(cap, link, cap[0], this.lexer);
    }
  }
  emStrong(src, maskedSrc, prevChar = "") {
    let match = this.rules.inline.emStrong.lDelim.exec(src);
    if (!match)
      return;
    if (match[3] && prevChar.match(/[\p{L}\p{N}]/u))
      return;
    const nextChar = match[1] || match[2] || "";
    if (!nextChar || nextChar && (prevChar === "" || this.rules.inline.punctuation.exec(prevChar))) {
      const lLength = match[0].length - 1;
      let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;
      const endReg = match[0][0] === "*" ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
      endReg.lastIndex = 0;
      maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
      while ((match = endReg.exec(maskedSrc)) != null) {
        rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
        if (!rDelim)
          continue;
        rLength = rDelim.length;
        if (match[3] || match[4]) {
          delimTotal += rLength;
          continue;
        } else if (match[5] || match[6]) {
          if (lLength % 3 && !((lLength + rLength) % 3)) {
            midDelimTotal += rLength;
            continue;
          }
        }
        delimTotal -= rLength;
        if (delimTotal > 0)
          continue;
        rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
        if (Math.min(lLength, rLength) % 2) {
          const text2 = src.slice(1, lLength + match.index + rLength);
          return {
            type: "em",
            raw: src.slice(0, lLength + match.index + rLength + 1),
            text: text2,
            tokens: this.lexer.inlineTokens(text2, [])
          };
        }
        const text = src.slice(2, lLength + match.index + rLength - 1);
        return {
          type: "strong",
          raw: src.slice(0, lLength + match.index + rLength + 1),
          text,
          tokens: this.lexer.inlineTokens(text, [])
        };
      }
    }
  }
  codespan(src) {
    const cap = this.rules.inline.code.exec(src);
    if (cap) {
      let text = cap[2].replace(/\n/g, " ");
      const hasNonSpaceChars = /[^ ]/.test(text);
      const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
      if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
        text = text.substring(1, text.length - 1);
      }
      text = escape(text, true);
      return {
        type: "codespan",
        raw: cap[0],
        text
      };
    }
  }
  br(src) {
    const cap = this.rules.inline.br.exec(src);
    if (cap) {
      return {
        type: "br",
        raw: cap[0]
      };
    }
  }
  del(src) {
    const cap = this.rules.inline.del.exec(src);
    if (cap) {
      return {
        type: "del",
        raw: cap[0],
        text: cap[2],
        tokens: this.lexer.inlineTokens(cap[2], [])
      };
    }
  }
  autolink(src, mangle2) {
    const cap = this.rules.inline.autolink.exec(src);
    if (cap) {
      let text, href;
      if (cap[2] === "@") {
        text = escape(this.options.mangle ? mangle2(cap[1]) : cap[1]);
        href = "mailto:" + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      return {
        type: "link",
        raw: cap[0],
        text,
        href,
        tokens: [
          {
            type: "text",
            raw: text,
            text
          }
        ]
      };
    }
  }
  url(src, mangle2) {
    let cap;
    if (cap = this.rules.inline.url.exec(src)) {
      let text, href;
      if (cap[2] === "@") {
        text = escape(this.options.mangle ? mangle2(cap[0]) : cap[0]);
        href = "mailto:" + text;
      } else {
        let prevCapZero;
        do {
          prevCapZero = cap[0];
          cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
        } while (prevCapZero !== cap[0]);
        text = escape(cap[0]);
        if (cap[1] === "www.") {
          href = "http://" + text;
        } else {
          href = text;
        }
      }
      return {
        type: "link",
        raw: cap[0],
        text,
        href,
        tokens: [
          {
            type: "text",
            raw: text,
            text
          }
        ]
      };
    }
  }
  inlineText(src, smartypants2) {
    const cap = this.rules.inline.text.exec(src);
    if (cap) {
      let text;
      if (this.lexer.state.inRawBlock) {
        text = this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0];
      } else {
        text = escape(this.options.smartypants ? smartypants2(cap[0]) : cap[0]);
      }
      return {
        type: "text",
        raw: cap[0],
        text
      };
    }
  }
}
const block = {
  newline: /^(?: *(?:\n|$))+/,
  code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
  fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
  hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
  heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
  blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
  list: /^( {0,3}bull)( [^\n]+?)?(?:\n|$)/,
  html: "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))",
  def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
  table: noopTest,
  lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
  _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html| +\n)[^\n]+)*)/,
  text: /^[^\n]+/
};
block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
block.def = edit(block.def).replace("label", block._label).replace("title", block._title).getRegex();
block.bullet = /(?:[*+-]|\d{1,9}[.)])/;
block.listItemStart = edit(/^( *)(bull) */).replace("bull", block.bullet).getRegex();
block.list = edit(block.list).replace(/bull/g, block.bullet).replace("hr", "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def", "\\n+(?=" + block.def.source + ")").getRegex();
block._tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
block._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
block.html = edit(block.html, "i").replace("comment", block._comment).replace("tag", block._tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
block.paragraph = edit(block._paragraph).replace("hr", block.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", block._tag).getRegex();
block.blockquote = edit(block.blockquote).replace("paragraph", block.paragraph).getRegex();
block.normal = merge({}, block);
block.gfm = merge({}, block.normal, {
  table: "^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
});
block.gfm.table = edit(block.gfm.table).replace("hr", block.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", block._tag).getRegex();
block.pedantic = merge({}, block.normal, {
  html: edit(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", block._comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: noopTest,
  paragraph: edit(block.normal._paragraph).replace("hr", block.hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", block.lheading).replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").getRegex()
});
const inline = {
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: noopTest,
  tag: "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",
  link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
  reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
  nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
  reflinkSearch: "reflink|nolink(?!\\()",
  emStrong: {
    lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
    rDelimAst: /^[^_*]*?\_\_[^_*]*?\*[^_*]*?(?=\_\_)|[punct_](\*+)(?=[\s]|$)|[^punct*_\s](\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|[^punct*_\s](\*+)(?=[^punct*_\s])/,
    rDelimUnd: /^[^_*]*?\*\*[^_*]*?\_[^_*]*?(?=\*\*)|[punct*](\_+)(?=[\s]|$)|[^punct*_\s](\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/
  },
  code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
  br: /^( {2,}|\\)\n(?!\s*$)/,
  del: noopTest,
  text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
  punctuation: /^([\spunctuation])/
};
inline._punctuation = "!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~";
inline.punctuation = edit(inline.punctuation).replace(/punctuation/g, inline._punctuation).getRegex();
inline.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
inline.escapedEmSt = /\\\*|\\_/g;
inline._comment = edit(block._comment).replace("(?:-->|$)", "-->").getRegex();
inline.emStrong.lDelim = edit(inline.emStrong.lDelim).replace(/punct/g, inline._punctuation).getRegex();
inline.emStrong.rDelimAst = edit(inline.emStrong.rDelimAst, "g").replace(/punct/g, inline._punctuation).getRegex();
inline.emStrong.rDelimUnd = edit(inline.emStrong.rDelimUnd, "g").replace(/punct/g, inline._punctuation).getRegex();
inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
inline.autolink = edit(inline.autolink).replace("scheme", inline._scheme).replace("email", inline._email).getRegex();
inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
inline.tag = edit(inline.tag).replace("comment", inline._comment).replace("attribute", inline._attribute).getRegex();
inline._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
inline._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
inline.link = edit(inline.link).replace("label", inline._label).replace("href", inline._href).replace("title", inline._title).getRegex();
inline.reflink = edit(inline.reflink).replace("label", inline._label).getRegex();
inline.reflinkSearch = edit(inline.reflinkSearch, "g").replace("reflink", inline.reflink).replace("nolink", inline.nolink).getRegex();
inline.normal = merge({}, inline);
inline.pedantic = merge({}, inline.normal, {
  strong: {
    start: /^__|\*\*/,
    middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
    endAst: /\*\*(?!\*)/g,
    endUnd: /__(?!_)/g
  },
  em: {
    start: /^_|\*/,
    middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
    endAst: /\*(?!\*)/g,
    endUnd: /_(?!_)/g
  },
  link: edit(/^!?\[(label)\]\((.*?)\)/).replace("label", inline._label).getRegex(),
  reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", inline._label).getRegex()
});
inline.gfm = merge({}, inline.normal, {
  escape: edit(inline.escape).replace("])", "~|])").getRegex(),
  _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
  url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
  _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
});
inline.gfm.url = edit(inline.gfm.url, "i").replace("email", inline.gfm._extended_email).getRegex();
inline.breaks = merge({}, inline.gfm, {
  br: edit(inline.br).replace("{2,}", "*").getRegex(),
  text: edit(inline.gfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
});
function smartypants(text) {
  return text.replace(/---/g, "\u2014").replace(/--/g, "\u2013").replace(/(^|[-\u2014/(\[{"\s])'/g, "$1\u2018").replace(/'/g, "\u2019").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1\u201C").replace(/"/g, "\u201D").replace(/\.{3}/g, "\u2026");
}
function mangle(text) {
  let out = "", i, ch;
  const l = text.length;
  for (i = 0; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = "x" + ch.toString(16);
    }
    out += "&#" + ch + ";";
  }
  return out;
}
class Lexer {
  constructor(options) {
    this.tokens = [];
    this.tokens.links = Object.create(null);
    this.options = options || defaults$2;
    this.options.tokenizer = this.options.tokenizer || new Tokenizer();
    this.tokenizer = this.options.tokenizer;
    this.tokenizer.options = this.options;
    this.tokenizer.lexer = this;
    this.inlineQueue = [];
    this.state = {
      inLink: false,
      inRawBlock: false,
      top: true
    };
    const rules = {
      block: block.normal,
      inline: inline.normal
    };
    if (this.options.pedantic) {
      rules.block = block.pedantic;
      rules.inline = inline.pedantic;
    } else if (this.options.gfm) {
      rules.block = block.gfm;
      if (this.options.breaks) {
        rules.inline = inline.breaks;
      } else {
        rules.inline = inline.gfm;
      }
    }
    this.tokenizer.rules = rules;
  }
  static get rules() {
    return {
      block,
      inline
    };
  }
  static lex(src, options) {
    const lexer = new Lexer(options);
    return lexer.lex(src);
  }
  static lexInline(src, options) {
    const lexer = new Lexer(options);
    return lexer.inlineTokens(src);
  }
  lex(src) {
    src = src.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    ");
    this.blockTokens(src, this.tokens);
    let next;
    while (next = this.inlineQueue.shift()) {
      this.inlineTokens(next.src, next.tokens);
    }
    return this.tokens;
  }
  blockTokens(src, tokens = []) {
    if (this.options.pedantic) {
      src = src.replace(/^ +$/gm, "");
    }
    let token, lastToken, cutSrc, lastParagraphClipped;
    while (src) {
      if (this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((extTokenizer) => {
        if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          return true;
        }
        return false;
      })) {
        continue;
      }
      if (token = this.tokenizer.space(src)) {
        src = src.substring(token.raw.length);
        if (token.type) {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.code(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && (lastToken.type === "paragraph" || lastToken.type === "text")) {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.fences(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.heading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.hr(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.blockquote(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.list(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.html(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.def(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && (lastToken.type === "paragraph" || lastToken.type === "text")) {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.raw;
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else if (!this.tokens.links[token.tag]) {
          this.tokens.links[token.tag] = {
            href: token.href,
            title: token.title
          };
        }
        continue;
      }
      if (token = this.tokenizer.table(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.lheading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      cutSrc = src;
      if (this.options.extensions && this.options.extensions.startBlock) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startBlock.forEach(function(getStartIndex) {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === "number" && tempStart >= 0) {
            startIndex = Math.min(startIndex, tempStart);
          }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
        lastToken = tokens[tokens.length - 1];
        if (lastParagraphClipped && lastToken.type === "paragraph") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue.pop();
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        lastParagraphClipped = cutSrc.length !== src.length;
        src = src.substring(token.raw.length);
        continue;
      }
      if (token = this.tokenizer.text(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.type === "text") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue.pop();
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (src) {
        const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }
    this.state.top = true;
    return tokens;
  }
  inline(src, tokens) {
    this.inlineQueue.push({ src, tokens });
  }
  inlineTokens(src, tokens = []) {
    let token, lastToken, cutSrc;
    let maskedSrc = src;
    let match;
    let keepPrevChar, prevChar;
    if (this.tokens.links) {
      const links = Object.keys(this.tokens.links);
      if (links.length > 0) {
        while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
          if (links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1))) {
            maskedSrc = maskedSrc.slice(0, match.index) + "[" + repeatString("a", match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
          }
        }
      }
    }
    while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + "[" + repeatString("a", match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    }
    while ((match = this.tokenizer.rules.inline.escapedEmSt.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + "++" + maskedSrc.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
    }
    while (src) {
      if (!keepPrevChar) {
        prevChar = "";
      }
      keepPrevChar = false;
      if (this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((extTokenizer) => {
        if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          return true;
        }
        return false;
      })) {
        continue;
      }
      if (token = this.tokenizer.escape(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.tag(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && token.type === "text" && lastToken.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.link(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.reflink(src, this.tokens.links)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && token.type === "text" && lastToken.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.codespan(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.br(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.del(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.autolink(src, mangle)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (!this.state.inLink && (token = this.tokenizer.url(src, mangle))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      cutSrc = src;
      if (this.options.extensions && this.options.extensions.startInline) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startInline.forEach(function(getStartIndex) {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === "number" && tempStart >= 0) {
            startIndex = Math.min(startIndex, tempStart);
          }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (token = this.tokenizer.inlineText(cutSrc, smartypants)) {
        src = src.substring(token.raw.length);
        if (token.raw.slice(-1) !== "_") {
          prevChar = token.raw.slice(-1);
        }
        keepPrevChar = true;
        lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (src) {
        const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }
    return tokens;
  }
}
class Renderer {
  constructor(options) {
    this.options = options || defaults$2;
  }
  code(code, infostring, escaped) {
    const lang = (infostring || "").match(/\S*/)[0];
    if (this.options.highlight) {
      const out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }
    code = code.replace(/\n$/, "") + "\n";
    if (!lang) {
      return "<pre><code>" + (escaped ? code : escape(code, true)) + "</code></pre>\n";
    }
    return '<pre><code class="' + this.options.langPrefix + escape(lang, true) + '">' + (escaped ? code : escape(code, true)) + "</code></pre>\n";
  }
  blockquote(quote) {
    return "<blockquote>\n" + quote + "</blockquote>\n";
  }
  html(html) {
    return html;
  }
  heading(text, level, raw, slugger) {
    if (this.options.headerIds) {
      return "<h" + level + ' id="' + this.options.headerPrefix + slugger.slug(raw) + '">' + text + "</h" + level + ">\n";
    }
    return "<h" + level + ">" + text + "</h" + level + ">\n";
  }
  hr() {
    return this.options.xhtml ? "<hr/>\n" : "<hr>\n";
  }
  list(body, ordered, start) {
    const type = ordered ? "ol" : "ul", startatt = ordered && start !== 1 ? ' start="' + start + '"' : "";
    return "<" + type + startatt + ">\n" + body + "</" + type + ">\n";
  }
  listitem(text) {
    return "<li>" + text + "</li>\n";
  }
  checkbox(checked) {
    return "<input " + (checked ? 'checked="" ' : "") + 'disabled="" type="checkbox"' + (this.options.xhtml ? " /" : "") + "> ";
  }
  paragraph(text) {
    return "<p>" + text + "</p>\n";
  }
  table(header, body) {
    if (body)
      body = "<tbody>" + body + "</tbody>";
    return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
  }
  tablerow(content) {
    return "<tr>\n" + content + "</tr>\n";
  }
  tablecell(content, flags) {
    const type = flags.header ? "th" : "td";
    const tag = flags.align ? "<" + type + ' align="' + flags.align + '">' : "<" + type + ">";
    return tag + content + "</" + type + ">\n";
  }
  strong(text) {
    return "<strong>" + text + "</strong>";
  }
  em(text) {
    return "<em>" + text + "</em>";
  }
  codespan(text) {
    return "<code>" + text + "</code>";
  }
  br() {
    return this.options.xhtml ? "<br/>" : "<br>";
  }
  del(text) {
    return "<del>" + text + "</del>";
  }
  link(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }
    let out = '<a href="' + escape(href) + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += ">" + text + "</a>";
    return out;
  }
  image(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }
    let out = '<img src="' + href + '" alt="' + text + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += this.options.xhtml ? "/>" : ">";
    return out;
  }
  text(text) {
    return text;
  }
}
class TextRenderer {
  strong(text) {
    return text;
  }
  em(text) {
    return text;
  }
  codespan(text) {
    return text;
  }
  del(text) {
    return text;
  }
  html(text) {
    return text;
  }
  text(text) {
    return text;
  }
  link(href, title, text) {
    return "" + text;
  }
  image(href, title, text) {
    return "" + text;
  }
  br() {
    return "";
  }
}
class Slugger {
  constructor() {
    this.seen = {};
  }
  serialize(value) {
    return value.toLowerCase().trim().replace(/<[!\/a-z].*?>/ig, "").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "").replace(/\s/g, "-");
  }
  getNextSafeSlug(originalSlug, isDryRun) {
    let slug = originalSlug;
    let occurenceAccumulator = 0;
    if (this.seen.hasOwnProperty(slug)) {
      occurenceAccumulator = this.seen[originalSlug];
      do {
        occurenceAccumulator++;
        slug = originalSlug + "-" + occurenceAccumulator;
      } while (this.seen.hasOwnProperty(slug));
    }
    if (!isDryRun) {
      this.seen[originalSlug] = occurenceAccumulator;
      this.seen[slug] = 0;
    }
    return slug;
  }
  slug(value, options = {}) {
    const slug = this.serialize(value);
    return this.getNextSafeSlug(slug, options.dryrun);
  }
}
class Parser {
  constructor(options) {
    this.options = options || defaults$2;
    this.options.renderer = this.options.renderer || new Renderer();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
    this.textRenderer = new TextRenderer();
    this.slugger = new Slugger();
  }
  static parse(tokens, options) {
    const parser2 = new Parser(options);
    return parser2.parse(tokens);
  }
  static parseInline(tokens, options) {
    const parser2 = new Parser(options);
    return parser2.parseInline(tokens);
  }
  parse(tokens, top = true) {
    let out = "", i, j, k, l2, l3, row, cell, header, body, token, ordered, start, loose, itemBody, item, checked, task, checkbox, ret;
    const l = tokens.length;
    for (i = 0; i < l; i++) {
      token = tokens[i];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
        ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
        if (ret !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(token.type)) {
          out += ret || "";
          continue;
        }
      }
      switch (token.type) {
        case "space": {
          continue;
        }
        case "hr": {
          out += this.renderer.hr();
          continue;
        }
        case "heading": {
          out += this.renderer.heading(this.parseInline(token.tokens), token.depth, unescape(this.parseInline(token.tokens, this.textRenderer)), this.slugger);
          continue;
        }
        case "code": {
          out += this.renderer.code(token.text, token.lang, token.escaped);
          continue;
        }
        case "table": {
          header = "";
          cell = "";
          l2 = token.header.length;
          for (j = 0; j < l2; j++) {
            cell += this.renderer.tablecell(this.parseInline(token.header[j].tokens), { header: true, align: token.align[j] });
          }
          header += this.renderer.tablerow(cell);
          body = "";
          l2 = token.rows.length;
          for (j = 0; j < l2; j++) {
            row = token.rows[j];
            cell = "";
            l3 = row.length;
            for (k = 0; k < l3; k++) {
              cell += this.renderer.tablecell(this.parseInline(row[k].tokens), { header: false, align: token.align[k] });
            }
            body += this.renderer.tablerow(cell);
          }
          out += this.renderer.table(header, body);
          continue;
        }
        case "blockquote": {
          body = this.parse(token.tokens);
          out += this.renderer.blockquote(body);
          continue;
        }
        case "list": {
          ordered = token.ordered;
          start = token.start;
          loose = token.loose;
          l2 = token.items.length;
          body = "";
          for (j = 0; j < l2; j++) {
            item = token.items[j];
            checked = item.checked;
            task = item.task;
            itemBody = "";
            if (item.task) {
              checkbox = this.renderer.checkbox(checked);
              if (loose) {
                if (item.tokens.length > 0 && item.tokens[0].type === "paragraph") {
                  item.tokens[0].text = checkbox + " " + item.tokens[0].text;
                  if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === "text") {
                    item.tokens[0].tokens[0].text = checkbox + " " + item.tokens[0].tokens[0].text;
                  }
                } else {
                  item.tokens.unshift({
                    type: "text",
                    text: checkbox
                  });
                }
              } else {
                itemBody += checkbox;
              }
            }
            itemBody += this.parse(item.tokens, loose);
            body += this.renderer.listitem(itemBody, task, checked);
          }
          out += this.renderer.list(body, ordered, start);
          continue;
        }
        case "html": {
          out += this.renderer.html(token.text);
          continue;
        }
        case "paragraph": {
          out += this.renderer.paragraph(this.parseInline(token.tokens));
          continue;
        }
        case "text": {
          body = token.tokens ? this.parseInline(token.tokens) : token.text;
          while (i + 1 < l && tokens[i + 1].type === "text") {
            token = tokens[++i];
            body += "\n" + (token.tokens ? this.parseInline(token.tokens) : token.text);
          }
          out += top ? this.renderer.paragraph(body) : body;
          continue;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return;
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return out;
  }
  parseInline(tokens, renderer) {
    renderer = renderer || this.renderer;
    let out = "", i, token, ret;
    const l = tokens.length;
    for (i = 0; i < l; i++) {
      token = tokens[i];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
        ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
        if (ret !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(token.type)) {
          out += ret || "";
          continue;
        }
      }
      switch (token.type) {
        case "escape": {
          out += renderer.text(token.text);
          break;
        }
        case "html": {
          out += renderer.html(token.text);
          break;
        }
        case "link": {
          out += renderer.link(token.href, token.title, this.parseInline(token.tokens, renderer));
          break;
        }
        case "image": {
          out += renderer.image(token.href, token.title, token.text);
          break;
        }
        case "strong": {
          out += renderer.strong(this.parseInline(token.tokens, renderer));
          break;
        }
        case "em": {
          out += renderer.em(this.parseInline(token.tokens, renderer));
          break;
        }
        case "codespan": {
          out += renderer.codespan(token.text);
          break;
        }
        case "br": {
          out += renderer.br();
          break;
        }
        case "del": {
          out += renderer.del(this.parseInline(token.tokens, renderer));
          break;
        }
        case "text": {
          out += renderer.text(token.text);
          break;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return;
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return out;
  }
}
function marked$1(src, opt, callback) {
  if (typeof src === "undefined" || src === null) {
    throw new Error("marked(): input parameter is undefined or null");
  }
  if (typeof src !== "string") {
    throw new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected");
  }
  if (typeof opt === "function") {
    callback = opt;
    opt = null;
  }
  opt = merge({}, marked$1.defaults, opt || {});
  checkSanitizeDeprecation(opt);
  if (callback) {
    const highlight = opt.highlight;
    let tokens;
    try {
      tokens = Lexer.lex(src, opt);
    } catch (e) {
      return callback(e);
    }
    const done = function(err) {
      let out;
      if (!err) {
        try {
          if (opt.walkTokens) {
            marked$1.walkTokens(tokens, opt.walkTokens);
          }
          out = Parser.parse(tokens, opt);
        } catch (e) {
          err = e;
        }
      }
      opt.highlight = highlight;
      return err ? callback(err) : callback(null, out);
    };
    if (!highlight || highlight.length < 3) {
      return done();
    }
    delete opt.highlight;
    if (!tokens.length)
      return done();
    let pending = 0;
    marked$1.walkTokens(tokens, function(token) {
      if (token.type === "code") {
        pending++;
        setTimeout(() => {
          highlight(token.text, token.lang, function(err, code) {
            if (err) {
              return done(err);
            }
            if (code != null && code !== token.text) {
              token.text = code;
              token.escaped = true;
            }
            pending--;
            if (pending === 0) {
              done();
            }
          });
        }, 0);
      }
    });
    if (pending === 0) {
      done();
    }
    return;
  }
  try {
    const tokens = Lexer.lex(src, opt);
    if (opt.walkTokens) {
      marked$1.walkTokens(tokens, opt.walkTokens);
    }
    return Parser.parse(tokens, opt);
  } catch (e) {
    e.message += "\nPlease report this to https://github.com/markedjs/marked.";
    if (opt.silent) {
      return "<p>An error occurred:</p><pre>" + escape(e.message + "", true) + "</pre>";
    }
    throw e;
  }
}
marked$1.options = marked$1.setOptions = function(opt) {
  merge(marked$1.defaults, opt);
  changeDefaults(marked$1.defaults);
  return marked$1;
};
marked$1.getDefaults = getDefaults;
marked$1.defaults = defaults$2;
marked$1.use = function(...args) {
  const opts = merge({}, ...args);
  const extensions = marked$1.defaults.extensions || { renderers: {}, childTokens: {} };
  let hasExtensions;
  args.forEach((pack) => {
    if (pack.extensions) {
      hasExtensions = true;
      pack.extensions.forEach((ext) => {
        if (!ext.name) {
          throw new Error("extension name required");
        }
        if (ext.renderer) {
          const prevRenderer = extensions.renderers ? extensions.renderers[ext.name] : null;
          if (prevRenderer) {
            extensions.renderers[ext.name] = function(...args2) {
              let ret = ext.renderer.apply(this, args2);
              if (ret === false) {
                ret = prevRenderer.apply(this, args2);
              }
              return ret;
            };
          } else {
            extensions.renderers[ext.name] = ext.renderer;
          }
        }
        if (ext.tokenizer) {
          if (!ext.level || ext.level !== "block" && ext.level !== "inline") {
            throw new Error("extension level must be 'block' or 'inline'");
          }
          if (extensions[ext.level]) {
            extensions[ext.level].unshift(ext.tokenizer);
          } else {
            extensions[ext.level] = [ext.tokenizer];
          }
          if (ext.start) {
            if (ext.level === "block") {
              if (extensions.startBlock) {
                extensions.startBlock.push(ext.start);
              } else {
                extensions.startBlock = [ext.start];
              }
            } else if (ext.level === "inline") {
              if (extensions.startInline) {
                extensions.startInline.push(ext.start);
              } else {
                extensions.startInline = [ext.start];
              }
            }
          }
        }
        if (ext.childTokens) {
          extensions.childTokens[ext.name] = ext.childTokens;
        }
      });
    }
    if (pack.renderer) {
      const renderer = marked$1.defaults.renderer || new Renderer();
      for (const prop in pack.renderer) {
        const prevRenderer = renderer[prop];
        renderer[prop] = (...args2) => {
          let ret = pack.renderer[prop].apply(renderer, args2);
          if (ret === false) {
            ret = prevRenderer.apply(renderer, args2);
          }
          return ret;
        };
      }
      opts.renderer = renderer;
    }
    if (pack.tokenizer) {
      const tokenizer = marked$1.defaults.tokenizer || new Tokenizer();
      for (const prop in pack.tokenizer) {
        const prevTokenizer = tokenizer[prop];
        tokenizer[prop] = (...args2) => {
          let ret = pack.tokenizer[prop].apply(tokenizer, args2);
          if (ret === false) {
            ret = prevTokenizer.apply(tokenizer, args2);
          }
          return ret;
        };
      }
      opts.tokenizer = tokenizer;
    }
    if (pack.walkTokens) {
      const walkTokens = marked$1.defaults.walkTokens;
      opts.walkTokens = function(token) {
        pack.walkTokens.call(this, token);
        if (walkTokens) {
          walkTokens.call(this, token);
        }
      };
    }
    if (hasExtensions) {
      opts.extensions = extensions;
    }
    marked$1.setOptions(opts);
  });
};
marked$1.walkTokens = function(tokens, callback) {
  for (const token of tokens) {
    callback.call(marked$1, token);
    switch (token.type) {
      case "table": {
        for (const cell of token.header) {
          marked$1.walkTokens(cell.tokens, callback);
        }
        for (const row of token.rows) {
          for (const cell of row) {
            marked$1.walkTokens(cell.tokens, callback);
          }
        }
        break;
      }
      case "list": {
        marked$1.walkTokens(token.items, callback);
        break;
      }
      default: {
        if (marked$1.defaults.extensions && marked$1.defaults.extensions.childTokens && marked$1.defaults.extensions.childTokens[token.type]) {
          marked$1.defaults.extensions.childTokens[token.type].forEach(function(childTokens) {
            marked$1.walkTokens(token[childTokens], callback);
          });
        } else if (token.tokens) {
          marked$1.walkTokens(token.tokens, callback);
        }
      }
    }
  }
};
marked$1.parseInline = function(src, opt) {
  if (typeof src === "undefined" || src === null) {
    throw new Error("marked.parseInline(): input parameter is undefined or null");
  }
  if (typeof src !== "string") {
    throw new Error("marked.parseInline(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected");
  }
  opt = merge({}, marked$1.defaults, opt || {});
  checkSanitizeDeprecation(opt);
  try {
    const tokens = Lexer.lexInline(src, opt);
    if (opt.walkTokens) {
      marked$1.walkTokens(tokens, opt.walkTokens);
    }
    return Parser.parseInline(tokens, opt);
  } catch (e) {
    e.message += "\nPlease report this to https://github.com/markedjs/marked.";
    if (opt.silent) {
      return "<p>An error occurred:</p><pre>" + escape(e.message + "", true) + "</pre>";
    }
    throw e;
  }
};
marked$1.Parser = Parser;
marked$1.parser = Parser.parse;
marked$1.Renderer = Renderer;
marked$1.TextRenderer = TextRenderer;
marked$1.Lexer = Lexer;
marked$1.lexer = Lexer.lex;
marked$1.Tokenizer = Tokenizer;
marked$1.Slugger = Slugger;
marked$1.parse = marked$1;
Parser.parse;
Lexer.lex;
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var escapes = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
var unescapes = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'"
};
var rescaped = /(&amp;|&lt;|&gt;|&quot;|&#39;)/g;
var runescaped = /[&<>"']/g;
function escapeHtmlChar(match) {
  return escapes[match];
}
function unescapeHtmlChar(match) {
  return unescapes[match];
}
function escapeHtml(text) {
  return text == null ? "" : String(text).replace(runescaped, escapeHtmlChar);
}
function unescapeHtml(html) {
  return html == null ? "" : String(html).replace(rescaped, unescapeHtmlChar);
}
escapeHtml.options = unescapeHtml.options = {};
var she = {
  encode: escapeHtml,
  escape: escapeHtml,
  decode: unescapeHtml,
  unescape: unescapeHtml,
  version: "1.0.0-browser"
};
function assignment(result) {
  var stack = Array.prototype.slice.call(arguments, 1);
  var item;
  var key;
  while (stack.length) {
    item = stack.shift();
    for (key in item) {
      if (item.hasOwnProperty(key)) {
        if (Object.prototype.toString.call(result[key]) === "[object Object]") {
          result[key] = assignment(result[key], item[key]);
        } else {
          result[key] = item[key];
        }
      }
    }
  }
  return result;
}
var assignment_1 = assignment;
var lowercase$2 = function lowercase(string) {
  return typeof string === "string" ? string.toLowerCase() : string;
};
function toMap$2(list2) {
  return list2.reduce(asKey, {});
}
function asKey(accumulator, item) {
  accumulator[item] = true;
  return accumulator;
}
var toMap_1 = toMap$2;
var toMap$1 = toMap_1;
var uris = ["background", "base", "cite", "href", "longdesc", "src", "usemap"];
var attributes$1 = {
  uris: toMap$1(uris)
};
var toMap = toMap_1;
var voids = ["area", "br", "col", "hr", "img", "wbr", "input", "base", "basefont", "link", "meta"];
var elements$2 = {
  voids: toMap(voids)
};
var he$1 = she;
var lowercase$1 = lowercase$2;
var elements$1 = elements$2;
var rstart = /^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/;
var rend = /^<\s*\/\s*([\w:-]+)[^>]*>/;
var rattrs = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g;
var rtag = /^</;
var rtagend = /^<\s*\//;
function createStack() {
  var stack = [];
  stack.lastItem = function lastItem() {
    return stack[stack.length - 1];
  };
  return stack;
}
function parser$1(html, handler) {
  var stack = createStack();
  var last = html;
  var chars;
  while (html) {
    parsePart();
  }
  parseEndTag();
  function parsePart() {
    chars = true;
    parseTag();
    var same = html === last;
    last = html;
    if (same) {
      html = "";
    }
  }
  function parseTag() {
    if (html.substr(0, 4) === "<!--") {
      parseComment();
    } else if (rtagend.test(html)) {
      parseEdge(rend, parseEndTag);
    } else if (rtag.test(html)) {
      parseEdge(rstart, parseStartTag);
    }
    parseTagDecode();
  }
  function parseEdge(regex, parser2) {
    var match = html.match(regex);
    if (match) {
      html = html.substring(match[0].length);
      match[0].replace(regex, parser2);
      chars = false;
    }
  }
  function parseComment() {
    var index = html.indexOf("-->");
    if (index >= 0) {
      if (handler.comment) {
        handler.comment(html.substring(4, index));
      }
      html = html.substring(index + 3);
      chars = false;
    }
  }
  function parseTagDecode() {
    if (!chars) {
      return;
    }
    var text;
    var index = html.indexOf("<");
    if (index >= 0) {
      text = html.substring(0, index);
      html = html.substring(index);
    } else {
      text = html;
      html = "";
    }
    if (handler.chars) {
      handler.chars(text);
    }
  }
  function parseStartTag(tag, tagName, rest, unary) {
    var attrs = {};
    var low = lowercase$1(tagName);
    var u = elements$1.voids[low] || !!unary;
    rest.replace(rattrs, attrReplacer);
    if (!u) {
      stack.push(low);
    }
    if (handler.start) {
      handler.start(low, attrs, u);
    }
    function attrReplacer(match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
      if (doubleQuotedValue === void 0 && singleQuotedValue === void 0 && unquotedValue === void 0) {
        attrs[name] = void 0;
      } else {
        attrs[name] = he$1.decode(doubleQuotedValue || singleQuotedValue || unquotedValue || "");
      }
    }
  }
  function parseEndTag(tag, tagName) {
    var i;
    var pos = 0;
    var low = lowercase$1(tagName);
    if (low) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos] === low) {
          break;
        }
      }
    }
    if (pos >= 0) {
      for (i = stack.length - 1; i >= pos; i--) {
        if (handler.end) {
          handler.end(stack[i]);
        }
      }
      stack.length = pos;
    }
  }
}
var parser_1 = parser$1;
var he = she;
var lowercase2 = lowercase$2;
var attributes = attributes$1;
var elements = elements$2;
function sanitizer$1(buffer, options) {
  var context;
  var o = options || {};
  reset();
  return {
    start,
    end,
    chars
  };
  function out(value) {
    buffer.push(value);
  }
  function start(tag, attrs, unary) {
    var low = lowercase2(tag);
    if (context.ignoring) {
      ignore(low);
      return;
    }
    if ((o.allowedTags || []).indexOf(low) === -1) {
      ignore(low);
      return;
    }
    if (o.filter && !o.filter({ tag: low, attrs })) {
      ignore(low);
      return;
    }
    out("<");
    out(low);
    Object.keys(attrs).forEach(parse);
    out(unary ? "/>" : ">");
    function parse(key) {
      var value = attrs[key];
      var classesOk = (o.allowedClasses || {})[low] || [];
      var attrsOk = (o.allowedAttributes || {})[low] || [];
      var valid;
      var lkey = lowercase2(key);
      if (lkey === "class" && attrsOk.indexOf(lkey) === -1) {
        value = value.split(" ").filter(isValidClass).join(" ").trim();
        valid = value.length;
      } else {
        valid = attrsOk.indexOf(lkey) !== -1 && (attributes.uris[lkey] !== true || testUrl(value));
      }
      if (valid) {
        out(" ");
        out(key);
        if (typeof value === "string") {
          out('="');
          out(he.encode(value));
          out('"');
        }
      }
      function isValidClass(className) {
        return classesOk && classesOk.indexOf(className) !== -1;
      }
    }
  }
  function end(tag) {
    var low = lowercase2(tag);
    var allowed = (o.allowedTags || []).indexOf(low) !== -1;
    if (allowed) {
      if (context.ignoring === false) {
        out("</");
        out(low);
        out(">");
      } else {
        unignore(low);
      }
    } else {
      unignore(low);
    }
  }
  function testUrl(text) {
    var start2 = text[0];
    if (start2 === "#" || start2 === "/") {
      return true;
    }
    var colon = text.indexOf(":");
    if (colon === -1) {
      return true;
    }
    var questionmark = text.indexOf("?");
    if (questionmark !== -1 && colon > questionmark) {
      return true;
    }
    var hash = text.indexOf("#");
    if (hash !== -1 && colon > hash) {
      return true;
    }
    return o.allowedSchemes.some(matches);
    function matches(scheme) {
      return text.indexOf(scheme + ":") === 0;
    }
  }
  function chars(text) {
    if (context.ignoring === false) {
      out(o.transformText ? o.transformText(text) : text);
    }
  }
  function ignore(tag) {
    if (elements.voids[tag]) {
      return;
    }
    if (context.ignoring === false) {
      context = { ignoring: tag, depth: 1 };
    } else if (context.ignoring === tag) {
      context.depth++;
    }
  }
  function unignore(tag) {
    if (context.ignoring === tag) {
      if (--context.depth <= 0) {
        reset();
      }
    }
  }
  function reset() {
    context = { ignoring: false, depth: 0 };
  }
}
var sanitizer_1 = sanitizer$1;
var defaults$1 = {
  allowedAttributes: {
    a: ["href", "name", "target", "title", "aria-label"],
    iframe: ["allowfullscreen", "frameborder", "src"],
    img: ["src", "alt", "title", "aria-label"]
  },
  allowedClasses: {},
  allowedSchemes: ["http", "https", "mailto"],
  allowedTags: [
    "a",
    "abbr",
    "article",
    "b",
    "blockquote",
    "br",
    "caption",
    "code",
    "del",
    "details",
    "div",
    "em",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "hr",
    "i",
    "img",
    "ins",
    "kbd",
    "li",
    "main",
    "mark",
    "ol",
    "p",
    "pre",
    "section",
    "span",
    "strike",
    "strong",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "th",
    "thead",
    "tr",
    "u",
    "ul"
  ],
  filter: null
};
var defaults_1 = defaults$1;
var assign = assignment_1;
var parser = parser_1;
var sanitizer = sanitizer_1;
var defaults = defaults_1;
function insane(html, options, strict) {
  var buffer = [];
  var configuration = strict === true ? options : assign({}, defaults, options);
  var handler = sanitizer(buffer, configuration);
  parser(html, handler);
  return buffer.join("");
}
insane.defaults = defaults;
var insane_1 = insane;
var hanabi$1 = { exports: {} };
(function(module, exports) {
  (function(global2, factory) {
    module.exports = factory();
  })(commonjsGlobal, function() {
    function createCommonjsModule(fn, module2) {
      return module2 = { exports: {} }, fn(module2, module2.exports), module2.exports;
    }
    var index$1 = createCommonjsModule(function(module2) {
      var comment2 = module2.exports = function() {
        return new RegExp("(?:" + comment2.line().source + ")|(?:" + comment2.block().source + ")", "gm");
      };
      comment2.line = function() {
        return /(?:^|\s)\/\/(.+?)$/gm;
      };
      comment2.block = function() {
        return /\/\*([\S\s]*?)\*\//gm;
      };
    });
    var defaultColors = ["23AC69", "91C132", "F19726", "E8552D", "1AAB8E", "E1147F", "2980C1", "1BA1E6", "9FA0A0", "F19726", "E30B20", "E30B20", "A3338B"];
    var index = function(input, ref) {
      if (ref === void 0)
        ref = {};
      var colors = ref.colors;
      if (colors === void 0)
        colors = defaultColors;
      var index2 = 0;
      var cache = {};
      var wordRe = /[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|\w+/;
      var leftAngleRe = /</;
      var re = new RegExp("(" + wordRe.source + "|" + leftAngleRe.source + ")|(" + index$1().source + ")", "gmi");
      return input.replace(re, function(m, word, cm) {
        if (cm) {
          return toComment(cm);
        }
        if (word === "<") {
          return "&lt;";
        }
        var color;
        if (cache[word]) {
          color = cache[word];
        } else {
          color = colors[index2];
          cache[word] = color;
        }
        var out = '<span style="color: #' + color + '">' + word + "</span>";
        index2 = ++index2 % colors.length;
        return out;
      });
    };
    function toComment(cm) {
      return '<span style="color: slategray">' + cm + "</span>";
    }
    return index;
  });
})(hanabi$1);
var hanabi = hanabi$1.exports;
function createElement(htmlStr = "") {
  const div = document.createElement("div");
  div.innerHTML = htmlStr.trim();
  return div.firstElementChild || div;
}
function getHeight(el) {
  return parseFloat(getComputedStyle(el, null).height.replace("px", ""));
}
function htmlEncode(str) {
  const temp = document.createElement("div");
  temp.innerText = str;
  const output = temp.innerHTML;
  return output;
}
function getQueryParam(name) {
  const match = RegExp(`[?&]${name}=([^&]*)`).exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}
function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX
  };
}
function padWithZeros(vNumber, width) {
  let numAsString = vNumber.toString();
  while (numAsString.length < width) {
    numAsString = `0${numAsString}`;
  }
  return numAsString;
}
function dateFormat(date) {
  const vDay = padWithZeros(date.getDate(), 2);
  const vMonth = padWithZeros(date.getMonth() + 1, 2);
  const vYear = padWithZeros(date.getFullYear(), 2);
  return `${vYear}-${vMonth}-${vDay}`;
}
function timeAgo(date) {
  try {
    const oldTime = date.getTime();
    const currTime = new Date().getTime();
    const diffValue = currTime - oldTime;
    const days = Math.floor(diffValue / (24 * 3600 * 1e3));
    if (days === 0) {
      const leave1 = diffValue % (24 * 3600 * 1e3);
      const hours = Math.floor(leave1 / (3600 * 1e3));
      if (hours === 0) {
        const leave2 = leave1 % (3600 * 1e3);
        const minutes = Math.floor(leave2 / (60 * 1e3));
        if (minutes === 0) {
          const leave3 = leave2 % (60 * 1e3);
          const seconds = Math.round(leave3 / 1e3);
          return `${seconds} \u79D2\u524D`;
        }
        return `${minutes} \u5206\u949F\u524D`;
      }
      return `${hours} \u5C0F\u65F6\u524D`;
    }
    if (days < 0)
      return "\u521A\u521A";
    if (days < 8) {
      return `${days} \u5929\u524D`;
    }
    return dateFormat(date);
  } catch (error) {
    console.error(error);
    return " - ";
  }
}
function getGravatarURL(ctx, emailMD5) {
  var _a, _b;
  return `${(((_a = ctx.conf.gravatar) == null ? void 0 : _a.mirror) || "").replace(/\/$/, "")}/${emailMD5}?d=${encodeURIComponent(((_b = ctx.conf.gravatar) == null ? void 0 : _b.default) || "")}&s=80`;
}
function versionCompare(a, b) {
  const pa = a.split(".");
  const pb = b.split(".");
  for (let i = 0; i < 3; i++) {
    const na = Number(pa[i]);
    const nb = Number(pb[i]);
    if (na > nb)
      return 1;
    if (nb > na)
      return -1;
    if (!Number.isNaN(na) && Number.isNaN(nb))
      return 1;
    if (Number.isNaN(na) && !Number.isNaN(nb))
      return -1;
  }
  return 0;
}
let markedInstance;
function marked(ctx, src) {
  if (!markedInstance) {
    const renderer = new marked$1.Renderer();
    const linkRenderer = renderer.link;
    renderer.link = (href, title, text) => {
      const localLink = href == null ? void 0 : href.startsWith(`${window.location.protocol}//${window.location.hostname}`);
      const html = linkRenderer.call(renderer, href, title, text);
      return html.replace(/^<a /, `<a target="_blank" ${!localLink ? `rel="noreferrer noopener nofollow"` : ""} `);
    };
    const nMarked = marked$1;
    marked$1.setOptions({
      renderer,
      highlight: (code) => hanabi(code),
      pedantic: false,
      gfm: true,
      breaks: true,
      smartLists: true,
      smartypants: true,
      xhtml: false,
      sanitize: true,
      sanitizer: (html) => insane_1(html, __spreadProps(__spreadValues({}, insane_1.defaults), {
        allowedAttributes: __spreadProps(__spreadValues({}, insane_1.defaults.allowedAttributes), {
          img: ["src", "atk-emoticon"]
        })
      })),
      silent: true
    });
    markedInstance = nMarked;
  }
  return markedInstance.parse(src);
}
function showLoading(parentElem) {
  if (parentElem instanceof Context)
    parentElem = parentElem.$root;
  let $loading = parentElem.querySelector(".atk-loading");
  if (!$loading) {
    $loading = createElement(`<div class="atk-loading atk-fade-in" style="display: none;">
      <div class="atk-loading-spinner">
        <svg viewBox="25 25 50 50"><circle cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></circle></svg>
      </div>
    </div>`);
    parentElem.appendChild($loading);
  }
  $loading.style.display = "";
  const $spinner = $loading.querySelector(".atk-loading-spinner");
  if ($spinner) {
    $spinner.style.display = "none";
    window.setTimeout(() => {
      $spinner.style.display = "";
    }, 500);
  }
}
function hideLoading(parentElem) {
  if (parentElem instanceof Context)
    parentElem = parentElem.$root;
  const $loading = parentElem.querySelector(".atk-loading");
  if ($loading)
    $loading.style.display = "none";
}
function isVisible(el, viewport = document.documentElement) {
  const viewportHeight = viewport.clientHeight;
  const docViewTop = viewport.scrollTop;
  const docViewBottom = docViewTop + viewportHeight;
  const rect = el.getBoundingClientRect();
  const elemTop = rect.top + docViewTop;
  const elemBottom = elemTop + rect.height;
  return elemBottom <= docViewBottom;
}
function scrollIntoView(elem, enableAnim = true) {
  const top = getOffset(elem).top + getHeight(elem) / 2 - document.documentElement.clientHeight / 2;
  if (enableAnim) {
    window.scroll({
      top: top > 0 ? top : 0,
      left: 0
    });
  } else {
    window.scroll(0, top > 0 ? top : 0);
  }
}
function showNotify(wrapElem, msg, type) {
  const colors = { s: "#57d59f", e: "#ff6f6c", w: "#ffc721", i: "#2ebcfc" };
  const timeout = 3e3;
  const notifyElem = createElement(`<div class="atk-notify atk-fade-in" style="background-color: ${colors[type]}"><span class="atk-notify-content"></span></div>`);
  const notifyContentEl = notifyElem.querySelector(".atk-notify-content");
  notifyContentEl.innerHTML = htmlEncode(msg).replace("\n", "<br/>");
  wrapElem.appendChild(notifyElem);
  const notifyRemove = () => {
    notifyElem.classList.add("atk-fade-out");
    setTimeout(() => {
      notifyElem.remove();
    }, 200);
  };
  let timeoutFn;
  {
    timeoutFn = window.setTimeout(() => {
      notifyRemove();
    }, timeout);
  }
  notifyElem.addEventListener("click", () => {
    notifyRemove();
    window.clearTimeout(timeoutFn);
  });
}
function playFadeAnim(elem, after, type = "in") {
  elem.classList.add(`atk-fade-${type}`);
  const onAnimEnded = () => {
    elem.classList.remove(`atk-fade-${type}`);
    elem.removeEventListener("animationend", onAnimEnded);
    if (after)
      after();
  };
  elem.addEventListener("animationend", onAnimEnded);
}
function playFadeInAnim(elem, after) {
  playFadeAnim(elem, after, "in");
}
function setError(parentElem, html, title = '<span class="atk-error-title">Artalk Error</span>') {
  if (parentElem instanceof Context)
    parentElem = parentElem.$root;
  let elem = parentElem.querySelector(".atk-error-layer");
  if (html === null) {
    if (elem !== null)
      elem.remove();
    return;
  }
  if (!elem) {
    elem = createElement(`<div class="atk-error-layer">${title}<span class="atk-error-text"></span></div>`);
    parentElem.appendChild(elem);
  }
  const errorTextEl = elem.querySelector(".atk-error-text");
  errorTextEl.innerHTML = "";
  if (html === null)
    return;
  if (html instanceof HTMLElement) {
    errorTextEl.appendChild(html);
  } else {
    errorTextEl.innerText = html;
  }
}
function getScrollBarWidth() {
  const inner = document.createElement("p");
  inner.style.width = "100%";
  inner.style.height = "200px";
  const outer = document.createElement("div");
  outer.style.position = "absolute";
  outer.style.top = "0px";
  outer.style.left = "0px";
  outer.style.visibility = "hidden";
  outer.style.width = "200px";
  outer.style.height = "150px";
  outer.style.overflow = "hidden";
  outer.appendChild(inner);
  document.body.appendChild(outer);
  const w1 = inner.offsetWidth;
  outer.style.overflow = "scroll";
  let w2 = inner.offsetWidth;
  if (w1 === w2)
    w2 = outer.clientWidth;
  document.body.removeChild(outer);
  return w1 - w2;
}
const _Layer = class extends Component {
  constructor(ctx, name, el) {
    super(ctx);
    __publicField(this, "name");
    __publicField(this, "$wrap");
    __publicField(this, "$mask");
    __publicField(this, "maskClickHideEnable", true);
    __publicField(this, "bodyStyleOrgOverflow", "");
    __publicField(this, "bodyStyleOrgPaddingRight", "");
    this.name = name;
    const { $wrap, $mask } = GetLayerWrap(ctx);
    this.$wrap = $wrap;
    this.$mask = $mask;
    this.$el = this.$wrap.querySelector(`[data-layer-name="${name}"].atk-layer-item`);
    if (this.$el === null) {
      if (!el) {
        this.$el = createElement();
        this.$el.classList.add("atk-layer-item");
      } else {
        this.$el = el;
      }
    }
    this.$el.setAttribute("data-layer-name", name);
    this.$el.style.display = "none";
    this.$wrap.append(this.$el);
  }
  getName() {
    return this.name;
  }
  getWrapEl() {
    return this.$wrap;
  }
  getEl() {
    return this.$el;
  }
  show() {
    _Layer.hideTimeoutList.forEach((item) => {
      clearTimeout(item);
    });
    _Layer.hideTimeoutList = [];
    this.$wrap.style.display = "block";
    this.$mask.style.display = "block";
    this.$mask.classList.add("atk-fade-in");
    this.$el.style.display = "";
    this.$mask.onclick = () => {
      if (this.maskClickHideEnable)
        this.hide();
    };
    this.bodyStyleOrgOverflow = document.body.style.overflow;
    this.bodyStyleOrgPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    const bpr = parseInt(window.getComputedStyle(document.body, null).getPropertyValue("padding-right"), 10);
    document.body.style.paddingRight = `${getScrollBarWidth() + bpr || 0}px`;
  }
  hide() {
    _Layer.hideTimeoutList.push(window.setTimeout(() => {
      this.$wrap.style.display = "none";
      document.body.style.overflow = this.bodyStyleOrgOverflow;
      document.body.style.paddingRight = this.bodyStyleOrgPaddingRight;
    }, 450));
    this.$wrap.classList.add("atk-fade-out");
    _Layer.hideTimeoutList.push(window.setTimeout(() => {
      this.$wrap.style.display = "none";
      this.$wrap.classList.remove("atk-fade-out");
    }, 200));
    this.$el.style.display = "none";
  }
  setMaskClickHide(enable) {
    this.maskClickHideEnable = enable;
  }
  disposeNow() {
    document.body.style.overflow = "";
    this.$el.remove();
    this.checkCleanLayer();
  }
  dispose() {
    this.hide();
    this.$el.remove();
    this.checkCleanLayer();
  }
  checkCleanLayer() {
    if (this.getWrapEl().querySelectorAll(".atk-layer-item").length === 0) {
      this.$wrap.style.display = "none";
    }
  }
};
let Layer = _Layer;
__publicField(Layer, "hideTimeoutList", []);
function GetLayerWrap(ctx) {
  let $wrap = document.querySelector(`.atk-layer-wrap#ctx-${ctx.cid}`);
  if (!$wrap) {
    $wrap = createElement(`<div class="atk-layer-wrap" id="ctx-${ctx.cid}" style="display: none;"><div class="atk-layer-mask"></div></div>`);
    document.body.appendChild($wrap);
  }
  const $mask = $wrap.querySelector(".atk-layer-mask");
  return { $wrap, $mask };
}
class Dialog {
  constructor(contentEl) {
    __publicField(this, "$el");
    __publicField(this, "$content");
    __publicField(this, "$actions");
    this.$el = createElement(`<div class="atk-layer-dialog-wrap">
        <div class="atk-layer-dialog">
          <div class="atk-layer-dialog-content"></div>
          <div class="atk-layer-dialog-actions"></div>
        </div>
      </div>`);
    this.$actions = this.$el.querySelector(".atk-layer-dialog-actions");
    this.$content = this.$el.querySelector(".atk-layer-dialog-content");
    this.$content.appendChild(contentEl);
    return this;
  }
  setYes(handler) {
    const btn = createElement('<button data-action="confirm">\u786E\u5B9A</button>');
    btn.onclick = this.onBtnClick(handler);
    this.$actions.appendChild(btn);
    return this;
  }
  setNo(handler) {
    const btn = createElement('<button data-action="cancel">\u53D6\u6D88</button>');
    btn.onclick = this.onBtnClick(handler);
    this.$actions.appendChild(btn);
    return this;
  }
  onBtnClick(handler) {
    return (evt) => {
      const re = handler(evt.currentTarget, this);
      if (re === void 0 || re === true) {
        this.$el.remove();
      }
    };
  }
}
function Fetch(ctx, input, init, timeout) {
  return __async(this, null, function* () {
    if (ctx.user.data.token) {
      const requestHeaders = new Headers();
      requestHeaders.set("Authorization", `Bearer ${ctx.user.data.token}`);
      init.headers = requestHeaders;
    }
    try {
      let resp;
      if (typeof timeout !== "number" && ctx.conf.reqTimeout === 0 || timeout === 0) {
        resp = yield fetch(input, init);
      } else {
        resp = yield timeoutPromise(timeout || ctx.conf.reqTimeout || 15e3, fetch(input, init));
      }
      if (!resp.ok && resp.status !== 401)
        throw new Error(`\u8BF7\u6C42\u54CD\u5E94 ${resp.status}`);
      let json = yield resp.json();
      const recall = (resolve, reject) => {
        Fetch(ctx, input, init).then((d) => {
          resolve(d);
        }).catch((err) => {
          reject(err);
        });
      };
      if (json.data && json.data.need_captcha) {
        json = yield new Promise((resolve, reject) => {
          ctx.trigger("checker-captcha", {
            imgData: json.data.img_data,
            onSuccess: () => {
              recall(resolve, reject);
            },
            onCancel: () => {
              reject(json);
            }
          });
        });
      } else if (json.data && json.data.need_login || resp.status === 401) {
        json = yield new Promise((resolve, reject) => {
          ctx.trigger("checker-admin", {
            onSuccess: () => {
              recall(resolve, reject);
            },
            onCancel: () => {
              reject(json);
            }
          });
        });
      }
      if (!json.success)
        throw json;
      return json;
    } catch (err) {
      console.error(err);
      if (err instanceof TypeError)
        throw new Error(`\u7F51\u7EDC\u9519\u8BEF`);
      throw err;
    }
  });
}
function POST(ctx, url, data) {
  return __async(this, null, function* () {
    const init = {
      method: "POST"
    };
    if (data)
      init.body = ToFormData(data);
    const json = yield Fetch(ctx, url, init);
    return json.data || {};
  });
}
function GET(ctx, url, data) {
  return __async(this, null, function* () {
    const json = yield Fetch(ctx, url + (data ? `?${new URLSearchParams(data)}` : ""), {
      method: "GET"
    });
    return json.data || {};
  });
}
function ToFormData(object) {
  const formData = new FormData();
  Object.keys(object).forEach((key) => formData.append(key, String(object[key])));
  return formData;
}
function timeoutPromise(ms, promise) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("\u8BF7\u6C42\u8D85\u65F6"));
    }, ms);
    promise.then((res) => {
      clearTimeout(timeoutId);
      resolve(res);
    }, (err) => {
      clearTimeout(timeoutId);
      reject(err);
    });
  });
}
class Api {
  constructor(ctx) {
    __publicField(this, "ctx");
    __publicField(this, "baseURL");
    this.ctx = ctx;
    this.baseURL = ctx.conf.server;
  }
  get(offset, type, flatMode, paramsEditor) {
    var _a;
    const params = {
      page_key: this.ctx.conf.pageKey,
      site_name: this.ctx.conf.site || "",
      limit: ((_a = this.ctx.conf.pagination) == null ? void 0 : _a.pageSize) || 15,
      offset
    };
    if (type)
      params.type = type;
    if (flatMode)
      params.flat_mode = flatMode;
    if (this.ctx.user.checkHasBasicUserInfo()) {
      params.name = this.ctx.user.data.nick;
      params.email = this.ctx.user.data.email;
    }
    if (paramsEditor)
      paramsEditor(params);
    return POST(this.ctx, `${this.baseURL}/get`, params);
  }
  add(comment2) {
    return __async(this, null, function* () {
      const params = {
        name: comment2.nick,
        email: comment2.email,
        link: comment2.link,
        content: comment2.content,
        rid: comment2.rid,
        page_key: comment2.page_key
      };
      if (comment2.page_title)
        params.page_title = comment2.page_title;
      if (comment2.site_name)
        params.site_name = comment2.site_name;
      const data = yield POST(this.ctx, `${this.baseURL}/add`, params);
      return data.comment;
    });
  }
  commentEdit(data) {
    return __async(this, null, function* () {
      const params = __spreadValues({}, data);
      const d = yield POST(this.ctx, `${this.baseURL}/admin/comment-edit`, params);
      return d.comment;
    });
  }
  commentDel(commentID, siteName) {
    const params = {
      id: String(commentID),
      site_name: siteName || ""
    };
    return POST(this.ctx, `${this.baseURL}/admin/comment-del`, params);
  }
  login(name, email, password) {
    return __async(this, null, function* () {
      const params = {
        name,
        email,
        password
      };
      if (this.ctx.conf.site)
        params.site_name = this.ctx.conf.site;
      const data = yield POST(this.ctx, `${this.baseURL}/login`, params);
      return data.token;
    });
  }
  userGet(name, email) {
    const ctrl = new AbortController();
    const { signal } = ctrl;
    const params = {
      name,
      email,
      site_name: this.ctx.conf.site || ""
    };
    const req = Fetch(this.ctx, `${this.baseURL}/user-get`, {
      method: "POST",
      body: ToFormData(params),
      signal
    }).then((json) => ({
      user: json.data.user,
      is_login: json.data.is_login,
      unread: json.data.unread || [],
      unread_count: json.data.unread_count || 0
    }));
    return {
      req,
      abort: () => {
        ctrl.abort();
      }
    };
  }
  pageGet(siteName, offset, limit) {
    return __async(this, null, function* () {
      const params = {
        site_name: siteName || "",
        offset: offset || 0,
        limit: limit || 15
      };
      const d = yield POST(this.ctx, `${this.baseURL}/admin/page-get`, params);
      return d;
    });
  }
  pageEdit(data) {
    return __async(this, null, function* () {
      const params = {
        id: data.id,
        key: data.key,
        title: data.title,
        admin_only: data.admin_only,
        site_name: data.site_name || this.ctx.conf.site
      };
      const d = yield POST(this.ctx, `${this.baseURL}/admin/page-edit`, params);
      return d.page;
    });
  }
  pageDel(pageKey, siteName) {
    const params = {
      key: String(pageKey),
      site_name: siteName || ""
    };
    return POST(this.ctx, `${this.baseURL}/admin/page-del`, params);
  }
  pageFetch(id) {
    return __async(this, null, function* () {
      const params = {
        id
      };
      const d = yield POST(this.ctx, `${this.baseURL}/admin/page-fetch`, params);
      return d.page;
    });
  }
  siteGet() {
    return __async(this, null, function* () {
      const params = {};
      const d = yield POST(this.ctx, `${this.baseURL}/admin/site-get`, params);
      return d.sites;
    });
  }
  siteAdd(name, urls) {
    return __async(this, null, function* () {
      const params = {
        name,
        urls
      };
      const d = yield POST(this.ctx, `${this.baseURL}/admin/site-add`, params);
      return d.site;
    });
  }
  siteEdit(data) {
    return __async(this, null, function* () {
      const params = {
        id: data.id,
        name: data.name || "",
        urls: data.urls || ""
      };
      const d = yield POST(this.ctx, `${this.baseURL}/admin/site-edit`, params);
      return d.site;
    });
  }
  siteDel(id, delContent = false) {
    const params = { id, del_content: delContent };
    return POST(this.ctx, `${this.baseURL}/admin/site-del`, params);
  }
  export() {
    return __async(this, null, function* () {
      var _a;
      const d = yield Fetch(this.ctx, `${this.baseURL}/admin/export`, { method: "POST" }, 0);
      return ((_a = d.data) == null ? void 0 : _a.data) || "";
    });
  }
  vote(targetID, type) {
    return __async(this, null, function* () {
      const params = {
        site_name: this.ctx.conf.site || "",
        target_id: targetID,
        type
      };
      if (this.ctx.user.checkHasBasicUserInfo()) {
        params.name = this.ctx.user.data.nick;
        params.email = this.ctx.user.data.email;
      }
      const data = yield POST(this.ctx, `${this.baseURL}/vote`, params);
      return data;
    });
  }
  markRead(notifyKey, readAll = false) {
    const params = {
      site_name: this.ctx.conf.site || "",
      notify_key: notifyKey
    };
    if (readAll) {
      delete params.notify_key;
      params.read_all = true;
      params.name = this.ctx.user.data.nick;
      params.email = this.ctx.user.data.email;
    }
    return POST(this.ctx, `${this.baseURL}/mark-read`, params);
  }
  captchaGet() {
    return __async(this, null, function* () {
      const data = yield GET(this.ctx, `${this.baseURL}/captcha/refresh`);
      return data.img_data || "";
    });
  }
  captchaCheck(value) {
    return __async(this, null, function* () {
      const data = yield GET(this.ctx, `${this.baseURL}/captcha/check`, { value });
      return data.img_data || "";
    });
  }
}
const CaptchaChecker = {
  request(that, inputVal) {
    return new Api(that.ctx).captchaCheck(inputVal);
  },
  body(that) {
    const elem = createElement(`<span><img class="atk-captcha-img" src="${that.submitCaptchaImgData || ""}" alt="\u9A8C\u8BC1\u7801">\u6572\u5165\u9A8C\u8BC1\u7801\u7EE7\u7EED\uFF1A</span>`);
    elem.querySelector(".atk-captcha-img").onclick = () => {
      const imgEl = elem.querySelector(".atk-captcha-img");
      new Api(that.ctx).captchaGet().then((imgData) => {
        imgEl.setAttribute("src", imgData);
      }).catch((err) => {
        console.error("\u9A8C\u8BC1\u7801\u83B7\u53D6\u5931\u8D25 ", err);
      });
    };
    return elem;
  },
  onSuccess(that, data, inputVal, formEl) {
    that.submitCaptchaVal = inputVal;
  },
  onError(that, err, inputVal, formEl) {
    formEl.querySelector(".atk-captcha-img").click();
  }
};
const AdminChecker = {
  inputType: "password",
  request(that, inputVal) {
    const data = {
      name: that.ctx.user.data.nick,
      email: that.ctx.user.data.email,
      password: inputVal
    };
    return new Api(that.ctx).login(data.name, data.email, data.password);
  },
  body() {
    return createElement("<span>\u6572\u5165\u5BC6\u7801\u6765\u9A8C\u8BC1\u7BA1\u7406\u5458\u8EAB\u4EFD\uFF1A</span>");
  },
  onSuccess(that, userToken, inputVal, formEl) {
    that.ctx.user.data.isAdmin = true;
    that.ctx.user.data.token = userToken;
    that.ctx.user.save();
    that.ctx.trigger("user-changed", that.ctx.user.data);
    that.ctx.trigger("list-reload");
  },
  onError(that, err, inputVal, formEl) {
  }
};
class CheckerLauncher {
  constructor(ctx) {
    __publicField(this, "ctx");
    __publicField(this, "launched", []);
    __publicField(this, "submitCaptchaVal");
    __publicField(this, "submitCaptchaImgData");
    this.ctx = ctx;
    this.initEventBind();
  }
  initEventBind() {
    this.ctx.on("checker-captcha", (conf) => {
      if (conf.imgData) {
        this.submitCaptchaImgData = conf.imgData;
      }
      this.fire(CaptchaChecker, conf);
    });
    this.ctx.on("checker-admin", (conf) => {
      this.fire(AdminChecker, conf);
    });
  }
  fire(checker, payload) {
    if (this.launched.includes(checker))
      return;
    this.launched.push(checker);
    const layer = new Layer(this.ctx, `checker-${new Date().getTime()}`);
    layer.setMaskClickHide(false);
    layer.show();
    const formEl = createElement();
    formEl.appendChild(checker.body(this));
    const input = createElement(`<input id="check" type="${checker.inputType || "text"}" autocomplete="off" required placeholder="">`);
    formEl.appendChild(input);
    setTimeout(() => input.focus(), 80);
    input.onkeyup = (evt) => {
      if (evt.key === "Enter" || evt.keyCode === 13) {
        evt.preventDefault();
        layer.getEl().querySelector('button[data-action="confirm"]').click();
      }
    };
    let btnTextOrg;
    const dialog = new Dialog(formEl);
    dialog.setYes((btnEl) => {
      const inputVal = input.value.trim();
      if (!btnTextOrg)
        btnTextOrg = btnEl.innerText;
      const btnTextSet = (btnText) => {
        btnEl.innerText = btnText;
        btnEl.classList.add("error");
      };
      const btnTextRestore = () => {
        btnEl.innerText = btnTextOrg || "";
        btnEl.classList.remove("error");
      };
      btnEl.innerText = "\u52A0\u8F7D\u4E2D...";
      checker.request(this, inputVal).then((data) => {
        this.done(checker, layer);
        if (checker.onSuccess)
          checker.onSuccess(this, data, inputVal, formEl);
        if (payload.onSuccess)
          payload.onSuccess(inputVal, dialog.$el);
      }).catch((err) => {
        btnTextSet(String(err.msg || String(err)));
        if (checker.onError)
          checker.onError(this, err, inputVal, formEl);
        const tf = setTimeout(() => btnTextRestore(), 3e3);
        input.onfocus = () => {
          btnTextRestore();
          clearTimeout(tf);
        };
      });
      return false;
    });
    dialog.setNo(() => {
      this.done(checker, layer);
      if (payload.onCancel)
        payload.onCancel();
      return false;
    });
    layer.getEl().append(dialog.$el);
    if (payload.onMount)
      payload.onMount(dialog.$el);
  }
  done(checker, layer) {
    layer.disposeNow();
    this.launched = this.launched.filter((c) => c !== checker);
  }
}
var editor = "";
var EditorHTML = '<div class="atk-editor">\n  <div class="atk-editor-header">\n    <input name="nick" placeholder="\u6635\u79F0" class="atk-nick" type="text" required="required">\n    <input name="email" placeholder="\u90AE\u7BB1" class="atk-email" type="email" required="required">\n    <input name="link" placeholder="\u7F51\u5740 (https://)" class="atk-link" type="url">\n  </div>\n  <div class="atk-editor-textarea-wrap">\n    <div class="atk-close-comment" style="display: none;"><span>\u4EC5\u7BA1\u7406\u5458\u53EF\u8BC4\u8BBA</span></div>\n    <textarea id="atk-editor-textarea" class="atk-editor-textarea" placeholder=""></textarea>\n  </div>\n  <div class="atk-editor-plug-wrap" style="display: none;"></div>\n  <div class="atk-editor-bottom">\n    <div class="atk-editor-bottom-part atk-left atk-editor-plug-switcher-wrap"></div>\n    <div class="atk-editor-bottom-part atk-right">\n      <button type="button" class="atk-send-btn"></button>\n    </div>\n  </div>\n  <div class="atk-editor-notify-wrap"></div>\n</div>\n';
var emoticonsPlug = "";
class EditorPlug {
  constructor(editor2) {
    __publicField(this, "editor");
    __publicField(this, "ctx");
    this.editor = editor2;
    this.ctx = editor2.ctx;
  }
}
__publicField(EditorPlug, "Name");
__publicField(EditorPlug, "BtnHTML");
class EmoticonsPlug extends EditorPlug {
  constructor(editor2) {
    super(editor2);
    __publicField(this, "$el");
    __publicField(this, "emoticons", []);
    __publicField(this, "$listWrap");
    __publicField(this, "$types");
    this.editor = editor2;
    this.$el = createElement(`<div class="atk-editor-plug-emoticons"></div>`);
    this.init();
  }
  init() {
    return __async(this, null, function* () {
      showLoading(this.$el);
      this.emoticons = yield this.handleData(this.ctx.conf.emoticons);
      hideLoading(this.$el);
      this.initEmoticonsList();
    });
  }
  handleData(data) {
    return __async(this, null, function* () {
      if (!Array.isArray(data) && ["object", "string"].includes(typeof data)) {
        data = [data];
      }
      if (!Array.isArray(data)) {
        setError(this.$el, "\u8868\u60C5\u5305\u6570\u636E\u5FC5\u987B\u4E3A Array/Object/String \u7C7B\u578B");
        hideLoading(this.$el);
        return [];
      }
      const pushGrp = (grp) => {
        if (typeof grp !== "object")
          return;
        if (grp.name && data.find((o) => o.name === grp.name))
          return;
        data.push(grp);
      };
      const remoteLoad = (d) => __async(this, null, function* () {
        yield Promise.all(d.map((grp, index) => __async(this, null, function* () {
          if (typeof grp === "object" && !Array.isArray(grp)) {
            pushGrp(grp);
          } else if (Array.isArray(grp)) {
            yield remoteLoad(grp);
          } else if (typeof grp === "string") {
            const grpData = yield this.remoteLoad(grp);
            if (Array.isArray(grpData))
              yield remoteLoad(grpData);
            else if (typeof grpData === "object")
              pushGrp(grpData);
          }
        })));
      });
      yield remoteLoad(data);
      data.forEach((item) => {
        if (this.isOwOFormat(item)) {
          const c = this.convertOwO(item);
          c.forEach((grp) => {
            pushGrp(grp);
          });
        } else if (Array.isArray(item)) {
          item.forEach((grp) => {
            pushGrp(grp);
          });
        }
      });
      data = data.filter((item) => typeof item === "object" && !Array.isArray(item) && !!item && !!item.name);
      console.log(data);
      this.solveNullKey(data);
      this.solveSameKey(data);
      return data;
    });
  }
  remoteLoad(url) {
    return __async(this, null, function* () {
      if (!url)
        return [];
      try {
        const resp = yield fetch(url);
        const json = yield resp.json();
        return json;
      } catch (err) {
        hideLoading(this.$el);
        setError(this.$el, `\u8868\u60C5\u52A0\u8F7D\u5931\u8D25 ${String(err)}`);
        return [];
      }
    });
  }
  solveNullKey(data) {
    data.forEach((grp) => {
      grp.items.forEach((item, index) => {
        if (!item.key)
          item.key = `${grp.name} ${index + 1}`;
      });
    });
  }
  solveSameKey(data) {
    const tmp = {};
    data.forEach((grp) => {
      grp.items.forEach((item) => {
        if (!item.key || String(item.key).trim() === "")
          return;
        if (!tmp[item.key])
          tmp[item.key] = 1;
        else
          tmp[item.key]++;
        if (tmp[item.key] > 1)
          item.key = `${item.key} ${tmp[item.key]}`;
      });
    });
  }
  isOwOFormat(data) {
    try {
      return typeof data === "object" && !!Object.values(data).length && Array.isArray(Object.keys(Object.values(data)[0].container)) && Object.keys(Object.values(data)[0].container[0]).includes("icon");
    } catch (e) {
      return false;
    }
  }
  convertOwO(owoData) {
    const dest = [];
    Object.entries(owoData).forEach(([grpName, grp]) => {
      const nGrp = { name: grpName, type: grp.type, items: [] };
      grp.container.forEach((item, index) => {
        const iconStr = item.icon;
        if (/<(img|IMG)/.test(iconStr)) {
          const find = /src=["'](.*?)["']/.exec(iconStr);
          if (find && find.length > 1)
            item.icon = find[1];
        }
        nGrp.items.push({ key: item.text || `${grpName} ${index + 1}`, val: item.icon });
      });
      dest.push(nGrp);
    });
    return dest;
  }
  initEmoticonsList() {
    this.$listWrap = createElement(`<div class="atk-emoticons-list-wrap"></div>`);
    this.$el.append(this.$listWrap);
    this.emoticons.forEach((grp, index) => {
      const emoticonsEl = createElement(`<div class="atk-emoticons-list" style="display: none;"></div>`);
      this.$listWrap.append(emoticonsEl);
      emoticonsEl.setAttribute("data-index", String(index));
      emoticonsEl.setAttribute("data-grp-name", grp.name);
      emoticonsEl.setAttribute("data-type", grp.type);
      grp.items.forEach((item) => {
        const $item = createElement(`<span class="atk-emoticons-item"></span>`);
        emoticonsEl.append($item);
        if (!!item.key && !new RegExp(`^(${grp.name})?\\s?[0-9]+$`).test(item.key))
          $item.setAttribute("title", item.key);
        if (grp.type === "image") {
          const imgEl = document.createElement("img");
          imgEl.src = item.val;
          imgEl.alt = item.key;
          $item.append(imgEl);
        } else {
          $item.innerText = item.val;
        }
        $item.onclick = () => {
          if (grp.type === "image") {
            this.editor.insertContent(`:[${item.key}]`);
          } else {
            this.editor.insertContent(item.val || "");
          }
        };
      });
    });
    this.$types = createElement(`<div class="atk-emoticons-types"></div>`);
    this.$el.append(this.$types);
    this.emoticons.forEach((grp, index) => {
      const $item = createElement("<span />");
      $item.innerText = grp.name;
      $item.setAttribute("data-index", String(index));
      $item.onclick = () => this.openGrp(index);
      this.$types.append($item);
    });
    if (this.emoticons.length > 0)
      this.openGrp(0);
  }
  openGrp(index) {
    var _a;
    Array.from(this.$listWrap.children).forEach((item) => {
      const el = item;
      if (el.getAttribute("data-index") !== String(index)) {
        el.style.display = "none";
      } else {
        el.style.display = "";
      }
    });
    this.$types.querySelectorAll("span.active").forEach((item) => item.classList.remove("active"));
    (_a = this.$types.querySelector(`span[data-index="${index}"]`)) == null ? void 0 : _a.classList.add("active");
    this.changeListHeight();
  }
  getEl() {
    return this.$el;
  }
  changeListHeight() {
  }
  onShow() {
    setTimeout(() => {
      this.changeListHeight();
    }, 30);
  }
  onHide() {
    this.$el.parentElement.style.height = "";
  }
  transEmoticonImageText(text) {
    if (!this.emoticons || !Array.isArray(this.emoticons))
      return text;
    this.emoticons.forEach((grp) => {
      if (grp.type !== "image")
        return;
      Object.entries(grp.items).forEach(([index, item]) => {
        text = text.split(`:[${item.key}]`).join(`<img src="${item.val}" atk-emoticon="${item.key}">`);
      });
    });
    return text;
  }
}
__publicField(EmoticonsPlug, "Name", "emoticons");
__publicField(EmoticonsPlug, "BtnHTML", "\u8868\u60C5");
var previewPlug = "";
class PreviewPlug extends EditorPlug {
  constructor(editor2) {
    super(editor2);
    __publicField(this, "$el");
    __publicField(this, "binded", false);
    this.initEl();
  }
  initEl() {
    this.$el = createElement('<div class="atk-editor-plug-preview"></div>');
    this.binded = false;
  }
  getEl() {
    return this.$el;
  }
  onShow() {
    this.updateContent();
    if (!this.binded) {
      const event = () => {
        this.updateContent();
      };
      this.editor.$textarea.addEventListener("input", event);
      this.editor.$textarea.addEventListener("change", event);
      this.binded = true;
    }
  }
  onHide() {
  }
  updateContent() {
    if (this.$el.style.display !== "none") {
      this.$el.innerHTML = this.editor.getContentMarked();
    }
  }
}
__publicField(PreviewPlug, "Name", "preview");
__publicField(PreviewPlug, "BtnHTML", '\u9884\u89C8 <i title="Markdown is supported"><svg class="markdown" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z"></path></svg></i>');
class Editor extends Component {
  constructor(ctx) {
    super(ctx);
    __publicField(this, "LOADABLE_PLUG_LIST", [EmoticonsPlug, PreviewPlug]);
    __publicField(this, "plugList", {});
    __publicField(this, "$header");
    __publicField(this, "$textareaWrap");
    __publicField(this, "$textarea");
    __publicField(this, "$closeComment");
    __publicField(this, "$plugWrap");
    __publicField(this, "$bottom");
    __publicField(this, "$bottomPartLeft");
    __publicField(this, "$plugSwitcherWrap");
    __publicField(this, "$bottomPartRight");
    __publicField(this, "$submitBtn");
    __publicField(this, "$notifyWrap");
    __publicField(this, "replyComment", null);
    __publicField(this, "$sendReply", null);
    __publicField(this, "queryUserInfo", {
      timeout: null,
      abortFunc: null
    });
    __publicField(this, "openedPlugName", null);
    this.$el = createElement(EditorHTML);
    this.$header = this.$el.querySelector(".atk-editor-header");
    this.$textareaWrap = this.$el.querySelector(".atk-editor-textarea-wrap");
    this.$textarea = this.$el.querySelector(".atk-editor-textarea");
    this.$closeComment = this.$el.querySelector(".atk-close-comment");
    this.$plugWrap = this.$el.querySelector(".atk-editor-plug-wrap");
    this.$bottom = this.$el.querySelector(".atk-editor-bottom");
    this.$bottomPartLeft = this.$el.querySelector(".atk-editor-bottom-part.atk-left");
    this.$plugSwitcherWrap = this.$el.querySelector(".atk-editor-plug-switcher-wrap");
    this.$bottomPartRight = this.$el.querySelector(".atk-editor-bottom-part.atk-right");
    this.$submitBtn = this.$el.querySelector(".atk-send-btn");
    this.$notifyWrap = this.$el.querySelector(".atk-editor-notify-wrap");
    this.initLocalStorage();
    this.initHeader();
    this.initTextarea();
    this.initEditorPlug();
    this.initBottomPart();
    this.ctx.on("editor-open", () => this.open());
    this.ctx.on("editor-close", () => this.close());
    this.ctx.on("editor-reply", (commentData) => this.setReply(commentData));
    this.ctx.on("editor-show-loading", () => showLoading(this.$el));
    this.ctx.on("editor-hide-loading", () => hideLoading(this.$el));
    this.ctx.on("editor-notify", (f) => this.showNotify(f.msg, f.type));
  }
  get user() {
    return this.ctx.user;
  }
  initLocalStorage() {
    const localContent = window.localStorage.getItem("ArtalkContent") || "";
    if (localContent.trim() !== "") {
      this.showNotify("\u5DF2\u81EA\u52A8\u6062\u590D", "i");
      this.setContent(localContent);
    }
    this.$textarea.addEventListener("input", () => {
      this.saveContent();
    });
  }
  initHeader() {
    Object.keys(this.user.data).forEach((field) => {
      const inputEl = this.getInputEl(field);
      if (inputEl && inputEl instanceof HTMLInputElement) {
        inputEl.value = this.user.data[field] || "";
        inputEl.addEventListener("input", () => this.onHeaderInputChanged(field, inputEl));
      }
    });
  }
  getInputEl(field) {
    const inputEl = this.$header.querySelector(`[name="${field}"]`);
    return inputEl;
  }
  onHeaderInputChanged(field, inputEl) {
    this.user.data[field] = inputEl.value.trim();
    if (field === "nick" || field === "email") {
      this.user.data.token = "";
      this.user.data.isAdmin = false;
      if (this.queryUserInfo.timeout !== null)
        window.clearTimeout(this.queryUserInfo.timeout);
      if (this.queryUserInfo.abortFunc !== null)
        this.queryUserInfo.abortFunc();
      this.queryUserInfo.timeout = window.setTimeout(() => {
        this.queryUserInfo.timeout = null;
        const { req, abort } = new Api(this.ctx).userGet(this.user.data.nick, this.user.data.email);
        this.queryUserInfo.abortFunc = abort;
        req.then((data) => {
          if (!data.is_login) {
            this.user.data.token = "";
            this.user.data.isAdmin = false;
          }
          this.ctx.trigger("unread-update", { notifies: data.unread });
          if (this.user.checkHasBasicUserInfo() && !data.is_login && data.user && data.user.is_admin) {
            this.showLoginDialog();
          }
          if (data.user && data.user.link) {
            this.user.data.link = data.user.link;
            this.getInputEl("link").value = data.user.link;
          }
        }).finally(() => {
          this.queryUserInfo.abortFunc = null;
        });
      }, 400);
    }
    this.saveUser();
  }
  showLoginDialog() {
    this.ctx.trigger("checker-admin", {
      onSuccess: () => {
      }
    });
  }
  saveUser() {
    this.user.save();
    this.ctx.trigger("user-changed", this.ctx.user.data);
  }
  saveContent() {
    window.localStorage.setItem("ArtalkContent", this.getContentOriginal().trim());
  }
  initTextarea() {
    this.$textarea.placeholder = this.ctx.conf.placeholder || "";
    this.$textarea.addEventListener("keydown", (e) => {
      const keyCode = e.keyCode || e.which;
      if (keyCode === 9) {
        e.preventDefault();
        this.insertContent("	");
      }
    });
    this.$textarea.addEventListener("input", (evt) => {
      this.adjustTextareaHeight();
    });
  }
  adjustTextareaHeight() {
    const diff = this.$textarea.offsetHeight - this.$textarea.clientHeight;
    this.$textarea.style.height = "0px";
    this.$textarea.style.height = `${this.$textarea.scrollHeight + diff}px`;
  }
  initEditorPlug() {
    this.plugList = {};
    this.$plugWrap.innerHTML = "";
    this.$plugWrap.style.display = "none";
    this.openedPlugName = null;
    this.$plugSwitcherWrap.innerHTML = "";
    this.LOADABLE_PLUG_LIST.forEach((PlugObj) => {
      const btnElem = createElement(`<span class="atk-editor-action atk-editor-plug-switcher">${PlugObj.BtnHTML}</span>`);
      this.$plugSwitcherWrap.appendChild(btnElem);
      btnElem.addEventListener("click", () => {
        let plug = this.plugList[PlugObj.Name];
        if (!plug) {
          plug = new PlugObj(this);
          this.plugList[PlugObj.Name] = plug;
        }
        this.$plugSwitcherWrap.querySelectorAll(".active").forEach((item) => item.classList.remove("active"));
        if (PlugObj.Name === this.openedPlugName) {
          plug.onHide();
          this.$plugWrap.style.display = "none";
          this.openedPlugName = null;
          return;
        }
        if (this.$plugWrap.querySelector(`[data-plug-name="${PlugObj.Name}"]`) === null) {
          const plugEl = plug.getEl();
          plugEl.setAttribute("data-plug-name", PlugObj.Name);
          plugEl.style.display = "none";
          this.$plugWrap.appendChild(plugEl);
        }
        Array.from(this.$plugWrap.children).forEach((plugItemEl) => {
          const plugItemName = plugItemEl.getAttribute("data-plug-name");
          if (plugItemName === PlugObj.Name) {
            plugItemEl.style.display = "";
            this.plugList[plugItemName].onShow();
          } else {
            plugItemEl.style.display = "none";
            this.plugList[plugItemName].onHide();
          }
        });
        this.$plugWrap.style.display = "";
        this.openedPlugName = PlugObj.Name;
        btnElem.classList.add("active");
      });
    });
  }
  closePlug() {
    this.$plugWrap.innerHTML = "";
    this.$plugWrap.style.display = "none";
    this.openedPlugName = null;
  }
  insertContent(val) {
    if (document.selection) {
      this.$textarea.focus();
      document.selection.createRange().text = val;
      this.$textarea.focus();
    } else if (this.$textarea.selectionStart || this.$textarea.selectionStart === 0) {
      const sStart = this.$textarea.selectionStart;
      const sEnd = this.$textarea.selectionEnd;
      const sT = this.$textarea.scrollTop;
      this.setContent(this.$textarea.value.substring(0, sStart) + val + this.$textarea.value.substring(sEnd, this.$textarea.value.length));
      this.$textarea.focus();
      this.$textarea.selectionStart = sStart + val.length;
      this.$textarea.selectionEnd = sStart + val.length;
      this.$textarea.scrollTop = sT;
    } else {
      this.$textarea.focus();
      this.$textarea.value += val;
    }
  }
  setContent(val) {
    this.$textarea.value = val;
    this.saveContent();
    if (!!this.plugList && !!this.plugList.preview) {
      this.plugList.preview.updateContent();
    }
    this.adjustTextareaHeight();
  }
  clearEditor() {
    this.setContent("");
    this.cancelReply();
  }
  getContent() {
    let content = this.getContentOriginal();
    if (this.plugList && this.plugList.emoticons) {
      const emoticonsPlug2 = this.plugList.emoticons;
      content = emoticonsPlug2.transEmoticonImageText(content);
    }
    return content;
  }
  getContentOriginal() {
    return this.$textarea.value || "";
  }
  getContentMarked() {
    return marked(this.ctx, this.getContent());
  }
  initBottomPart() {
    this.initReply();
    this.initSubmit();
  }
  initReply() {
    this.replyComment = null;
    this.$sendReply = null;
  }
  setReply(commentData) {
    if (this.replyComment !== null) {
      this.cancelReply();
    }
    if (this.$sendReply === null) {
      this.$sendReply = createElement('<div class="atk-send-reply">\u56DE\u590D <span class="atk-text"></span><span class="atk-cancel" title="\u53D6\u6D88 AT">\xD7</span></div>');
      this.$sendReply.querySelector(".atk-text").innerText = `@${commentData.nick}`;
      this.$sendReply.addEventListener("click", () => {
        this.cancelReply();
      });
      this.$textareaWrap.append(this.$sendReply);
    }
    this.replyComment = commentData;
    scrollIntoView(this.$el);
    this.$textarea.focus();
  }
  cancelReply() {
    if (this.$sendReply !== null) {
      this.$sendReply.remove();
      this.$sendReply = null;
    }
    this.replyComment = null;
  }
  initSubmit() {
    this.$submitBtn.innerText = this.ctx.conf.sendBtn || "Send";
    this.$submitBtn.addEventListener("click", (evt) => {
      evt.currentTarget;
      this.submit();
    });
  }
  submit() {
    return __async(this, null, function* () {
      if (this.getContent().trim() === "") {
        this.$textarea.focus();
        return;
      }
      this.ctx.trigger("editor-submit");
      showLoading(this.$el);
      try {
        const nComment = yield new Api(this.ctx).add({
          content: this.getContent(),
          nick: this.user.data.nick,
          email: this.user.data.email,
          link: this.user.data.link,
          rid: this.replyComment === null ? 0 : this.replyComment.id,
          page_key: this.replyComment === null ? this.ctx.conf.pageKey : this.replyComment.page_key,
          page_title: this.replyComment === null ? this.ctx.conf.pageTitle : void 0,
          site_name: this.replyComment === null ? this.ctx.conf.site : this.replyComment.site_name
        });
        if (this.replyComment !== null && this.replyComment.page_key !== this.ctx.conf.pageKey) {
          window.open(`${this.replyComment.page_key}#atk-comment-${nComment.id}`);
        }
        this.ctx.trigger("list-insert", nComment);
        this.clearEditor();
        this.ctx.trigger("editor-submitted");
      } catch (err) {
        console.error(err);
        this.showNotify(`\u8BC4\u8BBA\u5931\u8D25\uFF0C${err.msg || String(err)}`, "e");
        return;
      } finally {
        hideLoading(this.$el);
      }
    });
  }
  showNotify(msg, type) {
    showNotify(this.$notifyWrap, msg, type);
  }
  close() {
    this.$closeComment.style.display = "";
    if (!this.user.data.isAdmin) {
      this.$textarea.style.display = "none";
      this.closePlug();
      this.$bottom.style.display = "none";
    } else {
      this.$textarea.style.display = "";
      this.$bottom.style.display = "";
    }
  }
  open() {
    this.$closeComment.style.display = "none";
    this.$textarea.style.display = "";
    this.$bottom.style.display = "";
  }
}
var list = "";
var ListHTML = '<div class="atk-list">\n  <div class="atk-list-header">\n    <div class="atk-comment-count">\n      <span class="atk-comment-count-num">0</span>\n      \u6761\u8BC4\u8BBA\n    </div>\n    <div class="atk-right-action">\n      <span data-action="admin-close-comment" class="atk-hide" atk-only-admin-show>\u5173\u95ED\u8BC4\u8BBA</span>\n      <span data-action="open-sidebar" class="atk-hide atk-on">\n        <span class="atk-unread-badge" style="display: none;"></span>\n        \u901A\u77E5\u4E2D\u5FC3\n      </span>\n    </div>\n  </div>\n  <div class="atk-list-body"></div>\n  <div class="atk-list-footer">\n    <div class="atk-copyright"></div>\n  </div>\n</div>\n';
var comment = "";
var win = window || {};
var nav = navigator || {};
function Detect(userAgent) {
  var u = userAgent || nav.userAgent;
  var _this = this;
  var match = {
    Trident: u.indexOf("Trident") > -1 || u.indexOf("NET CLR") > -1,
    Presto: u.indexOf("Presto") > -1,
    WebKit: u.indexOf("AppleWebKit") > -1,
    Gecko: u.indexOf("Gecko/") > -1,
    Safari: u.indexOf("Safari") > -1,
    Chrome: u.indexOf("Chrome") > -1 || u.indexOf("CriOS") > -1,
    IE: u.indexOf("MSIE") > -1 || u.indexOf("Trident") > -1,
    Edge: u.indexOf("Edge") > -1,
    Firefox: u.indexOf("Firefox") > -1 || u.indexOf("FxiOS") > -1,
    "Firefox Focus": u.indexOf("Focus") > -1,
    Chromium: u.indexOf("Chromium") > -1,
    Opera: u.indexOf("Opera") > -1 || u.indexOf("OPR") > -1,
    Vivaldi: u.indexOf("Vivaldi") > -1,
    Yandex: u.indexOf("YaBrowser") > -1,
    Kindle: u.indexOf("Kindle") > -1 || u.indexOf("Silk/") > -1,
    360: u.indexOf("360EE") > -1 || u.indexOf("360SE") > -1,
    UC: u.indexOf("UC") > -1 || u.indexOf(" UBrowser") > -1,
    QQBrowser: u.indexOf("QQBrowser") > -1,
    QQ: u.indexOf("QQ/") > -1,
    Baidu: u.indexOf("Baidu") > -1 || u.indexOf("BIDUBrowser") > -1,
    Maxthon: u.indexOf("Maxthon") > -1,
    Sogou: u.indexOf("MetaSr") > -1 || u.indexOf("Sogou") > -1,
    LBBROWSER: u.indexOf("LBBROWSER") > -1,
    "2345Explorer": u.indexOf("2345Explorer") > -1,
    TheWorld: u.indexOf("TheWorld") > -1,
    XiaoMi: u.indexOf("MiuiBrowser") > -1,
    Quark: u.indexOf("Quark") > -1,
    Qiyu: u.indexOf("Qiyu") > -1,
    Wechat: u.indexOf("MicroMessenger") > -1,
    Taobao: u.indexOf("AliApp(TB") > -1,
    Alipay: u.indexOf("AliApp(AP") > -1,
    Weibo: u.indexOf("Weibo") > -1,
    Douban: u.indexOf("com.douban.frodo") > -1,
    Suning: u.indexOf("SNEBUY-APP") > -1,
    iQiYi: u.indexOf("IqiyiApp") > -1,
    Windows: u.indexOf("Windows") > -1,
    Linux: u.indexOf("Linux") > -1 || u.indexOf("X11") > -1,
    "Mac OS": u.indexOf("Macintosh") > -1,
    Android: u.indexOf("Android") > -1 || u.indexOf("Adr") > -1,
    Ubuntu: u.indexOf("Ubuntu") > -1,
    FreeBSD: u.indexOf("FreeBSD") > -1,
    Debian: u.indexOf("Debian") > -1,
    "Windows Phone": u.indexOf("IEMobile") > -1 || u.indexOf("Windows Phone") > -1,
    BlackBerry: u.indexOf("BlackBerry") > -1 || u.indexOf("RIM") > -1,
    MeeGo: u.indexOf("MeeGo") > -1,
    Symbian: u.indexOf("Symbian") > -1,
    iOS: u.indexOf("like Mac OS X") > -1,
    "Chrome OS": u.indexOf("CrOS") > -1,
    WebOS: u.indexOf("hpwOS") > -1,
    Mobile: u.indexOf("Mobi") > -1 || u.indexOf("iPh") > -1 || u.indexOf("480") > -1,
    Tablet: u.indexOf("Tablet") > -1 || u.indexOf("Pad") > -1 || u.indexOf("Nexus 7") > -1
  };
  if (match.Mobile) {
    match.Mobile = !(u.indexOf("iPad") > -1);
  } else if (win.showModalDialog && win.chrome) {
    match["360"] = true;
  }
  var hash = {
    engine: ["WebKit", "Trident", "Gecko", "Presto"],
    browser: ["Safari", "Chrome", "Edge", "IE", "Firefox", "Firefox Focus", "Chromium", "Opera", "Vivaldi", "Yandex", "Kindle", "360", "UC", "QQBrowser", "QQ", "Baidu", "Maxthon", "Sogou", "LBBROWSER", "2345Explorer", "TheWorld", "XiaoMi", "Quark", "Qiyu", "Wechat", "Taobao", "Alipay", "Weibo", "Douban", "Suning", "iQiYi"],
    os: ["Windows", "Linux", "Mac OS", "Android", "Ubuntu", "FreeBSD", "Debian", "iOS", "Windows Phone", "BlackBerry", "MeeGo", "Symbian", "Chrome OS", "WebOS"],
    device: ["Mobile", "Tablet"]
  };
  _this.device = "PC";
  _this.language = function() {
    var g = nav.browserLanguage || nav.language;
    var arr = g.split("-");
    if (arr[1]) {
      arr[1] = arr[1].toUpperCase();
    }
    return arr.join("_");
  }();
  for (var s in hash) {
    for (var i = 0; i < hash[s].length; i++) {
      var value = hash[s][i];
      if (match[value]) {
        _this[s] = value;
      }
    }
  }
  var osVersion = {
    Windows: function() {
      var v = u.replace(/^.*Windows NT ([\d.]+);.*$/, "$1");
      var hash2 = {
        6.4: "10",
        6.3: "8.1",
        6.2: "8",
        6.1: "7",
        "6.0": "Vista",
        5.2: "XP",
        5.1: "XP",
        "5.0": "2000"
      };
      return hash2[v] || v;
    },
    Android: function() {
      return u.replace(/^.*Android ([\d.]+);.*$/, "$1");
    },
    iOS: function() {
      return u.replace(/^.*OS ([\d_]+) like.*$/, "$1").replace(/_/g, ".");
    },
    Debian: function() {
      return u.replace(/^.*Debian\/([\d.]+).*$/, "$1");
    },
    "Windows Phone": function() {
      return u.replace(/^.*Windows Phone( OS)? ([\d.]+);.*$/, "$2");
    },
    "Mac OS": function() {
      return u.replace(/^.*Mac OS X ([\d_]+).*$/, "$1").replace(/_/g, ".");
    },
    WebOS: function() {
      return u.replace(/^.*hpwOS\/([\d.]+);.*$/, "$1");
    }
  };
  _this.osVersion = "";
  if (osVersion[_this.os]) {
    _this.osVersion = osVersion[_this.os]();
    if (_this.osVersion === u) {
      _this.osVersion = "";
    }
  }
  var version = {
    Safari: function() {
      return u.replace(/^.*Version\/([\d.]+).*$/, "$1");
    },
    Chrome: function() {
      return u.replace(/^.*Chrome\/([\d.]+).*$/, "$1").replace(/^.*CriOS\/([\d.]+).*$/, "$1");
    },
    IE: function() {
      return u.replace(/^.*MSIE ([\d.]+).*$/, "$1").replace(/^.*rv:([\d.]+).*$/, "$1");
    },
    Edge: function() {
      return u.replace(/^.*Edge\/([\d.]+).*$/, "$1");
    },
    Firefox: function() {
      return u.replace(/^.*Firefox\/([\d.]+).*$/, "$1").replace(/^.*FxiOS\/([\d.]+).*$/, "$1");
    },
    "Firefox Focus": function() {
      return u.replace(/^.*Focus\/([\d.]+).*$/, "$1");
    },
    Chromium: function() {
      return u.replace(/^.*Chromium\/([\d.]+).*$/, "$1");
    },
    Opera: function() {
      return u.replace(/^.*Opera\/([\d.]+).*$/, "$1").replace(/^.*OPR\/([\d.]+).*$/, "$1");
    },
    Vivaldi: function() {
      return u.replace(/^.*Vivaldi\/([\d.]+).*$/, "$1");
    },
    Yandex: function() {
      return u.replace(/^.*YaBrowser\/([\d.]+).*$/, "$1");
    },
    Kindle: function() {
      return u.replace(/^.*Version\/([\d.]+).*$/, "$1");
    },
    Maxthon: function() {
      return u.replace(/^.*Maxthon\/([\d.]+).*$/, "$1");
    },
    QQBrowser: function() {
      return u.replace(/^.*QQBrowser\/([\d.]+).*$/, "$1");
    },
    QQ: function() {
      return u.replace(/^.*QQ\/([\d.]+).*$/, "$1");
    },
    Baidu: function() {
      return u.replace(/^.*BIDUBrowser[\s/]([\d.]+).*$/, "$1");
    },
    UC: function() {
      return u.replace(/^.*UC?Browser\/([\d.]+).*$/, "$1");
    },
    Sogou: function() {
      return u.replace(/^.*SE ([\d.X]+).*$/, "$1").replace(/^.*SogouMobileBrowser\/([\d.]+).*$/, "$1");
    },
    "2345Explorer": function() {
      return u.replace(/^.*2345Explorer\/([\d.]+).*$/, "$1");
    },
    TheWorld: function() {
      return u.replace(/^.*TheWorld ([\d.]+).*$/, "$1");
    },
    XiaoMi: function() {
      return u.replace(/^.*MiuiBrowser\/([\d.]+).*$/, "$1");
    },
    Quark: function() {
      return u.replace(/^.*Quark\/([\d.]+).*$/, "$1");
    },
    Qiyu: function() {
      return u.replace(/^.*Qiyu\/([\d.]+).*$/, "$1");
    },
    Wechat: function() {
      return u.replace(/^.*MicroMessenger\/([\d.]+).*$/, "$1");
    },
    Taobao: function() {
      return u.replace(/^.*AliApp\(TB\/([\d.]+).*$/, "$1");
    },
    Alipay: function() {
      return u.replace(/^.*AliApp\(AP\/([\d.]+).*$/, "$1");
    },
    Weibo: function() {
      return u.replace(/^.*weibo__([\d.]+).*$/, "$1");
    },
    Douban: function() {
      return u.replace(/^.*com.douban.frodo\/([\d.]+).*$/, "$1");
    },
    Suning: function() {
      return u.replace(/^.*SNEBUY-APP([\d.]+).*$/, "$1");
    },
    iQiYi: function() {
      return u.replace(/^.*IqiyiVersion\/([\d.]+).*$/, "$1");
    }
  };
  _this.version = "";
  if (version[_this.browser]) {
    _this.version = version[_this.browser]();
    if (_this.version === u) {
      _this.version = "";
    }
  }
  if (_this.version.indexOf(".")) {
    _this.version = _this.version.substring(0, _this.version.indexOf("."));
  }
  if (_this.browser === "Edge") {
    _this.engine = "EdgeHTML";
  } else if (_this.browser === "Chrome" && parseInt(_this.version) > 27) {
    _this.engine = "Blink";
  } else if (_this.browser === "Opera" && parseInt(_this.version) > 12) {
    _this.engine = "Blink";
  } else if (_this.browser === "Yandex") {
    _this.engine = "Blink";
  } else if (_this.browser === void 0) {
    _this.browser = "Unknow App";
  }
}
function detectFactory(u) {
  return new Detect(u);
}
var CommentHTML = '<div class="atk-comment-wrap" data-comment-id="">\n  <div class="atk-comment">\n\n    <div class="atk-avatar"></div>\n\n    <div class="atk-comment-main">\n\n      <div class="atk-header">\n        <span class="atk-nick"></span>\n        <span class="atk-badge"></span>\n        <span class="atk-date"></span>\n      </div>\n\n      <div class="atk-body">\n        <div class="atk-content"></div>\n      </div>\n\n      <div class="atk-footer">\n        <div class="atk-comment-actions"></div>\n      </div>\n\n    </div>\n\n  </div>\n</div>\n';
class ActionBtn {
  constructor(conf) {
    __publicField(this, "conf");
    __publicField(this, "$el");
    __publicField(this, "isLoading", false);
    __publicField(this, "msgRecTimer");
    __publicField(this, "msgRecTimerFunc");
    __publicField(this, "isConfirming", false);
    __publicField(this, "confirmRecTimer");
    this.$el = createElement(`<span class="atk-common-action-btn"></span>`);
    this.conf = typeof conf !== "object" ? { text: conf } : conf;
    this.$el.innerText = this.getText();
    if (this.conf.adminOnly)
      this.$el.setAttribute("atk-only-admin-show", "");
  }
  get isMessaging() {
    return !!this.msgRecTimer;
  }
  appendTo(dom) {
    dom.append(this.$el);
    return this;
  }
  getText() {
    return typeof this.conf.text === "string" ? this.conf.text : this.conf.text();
  }
  setClick(func) {
    this.$el.onclick = (e) => {
      e.stopPropagation();
      if (this.isLoading) {
        return;
      }
      if (this.conf.confirm && !this.isMessaging) {
        const confirmRestore = () => {
          this.isConfirming = false;
          this.$el.classList.remove("atk-btn-confirm");
          this.$el.innerText = this.getText();
        };
        if (!this.isConfirming) {
          this.isConfirming = true;
          this.$el.classList.add("atk-btn-confirm");
          this.$el.innerText = this.conf.confirmText || "\u786E\u8BA4\u64CD\u4F5C";
          this.confirmRecTimer = window.setTimeout(() => confirmRestore(), 5e3);
          return;
        }
        if (this.confirmRecTimer)
          window.clearTimeout(this.confirmRecTimer);
        confirmRestore();
      }
      if (this.msgRecTimer) {
        this.fireMsgRecTimer();
        this.clearMsgRecTimer();
        return;
      }
      func();
    };
  }
  updateText(text) {
    if (text)
      this.conf.text = text;
    this.setLoading(false);
    this.$el.innerText = this.getText();
  }
  setLoading(value = true, loadingText) {
    if (this.isLoading === value)
      return;
    this.isLoading = value;
    if (value) {
      this.$el.classList.add("atk-btn-loading");
      this.$el.innerText = loadingText || "\u52A0\u8F7D\u4E2D...";
    } else {
      this.$el.classList.remove("atk-btn-loading");
      this.$el.innerText = this.getText();
    }
  }
  setError(text) {
    this.setMsg(text, "atk-btn-error");
  }
  setWarn(text) {
    this.setMsg(text, "atk-btn-warn");
  }
  setSuccess(text) {
    this.setMsg(text, "atk-btn-success");
  }
  setMsg(text, className, duringTime, after) {
    this.setLoading(false);
    if (className)
      this.$el.classList.add(className);
    this.$el.innerText = text;
    this.setMsgRecTimer(() => {
      this.$el.innerText = this.getText();
      if (className)
        this.$el.classList.remove(className);
      if (after)
        after();
    }, duringTime || 2500);
  }
  setMsgRecTimer(func, duringTime) {
    this.fireMsgRecTimer();
    this.clearMsgRecTimer();
    this.msgRecTimerFunc = func;
    this.msgRecTimer = window.setTimeout(() => {
      func();
      this.clearMsgRecTimer();
    }, duringTime);
  }
  fireMsgRecTimer() {
    if (this.msgRecTimerFunc)
      this.msgRecTimerFunc();
  }
  clearMsgRecTimer() {
    if (this.msgRecTimer)
      window.clearTimeout(this.msgRecTimer);
    this.msgRecTimer = void 0;
    this.msgRecTimerFunc = void 0;
  }
}
class Comment extends Component {
  constructor(ctx, data) {
    super(ctx);
    __publicField(this, "data");
    __publicField(this, "$main");
    __publicField(this, "$header");
    __publicField(this, "$body");
    __publicField(this, "$content");
    __publicField(this, "$children");
    __publicField(this, "$actions");
    __publicField(this, "voteBtnUp");
    __publicField(this, "voteBtnDown");
    __publicField(this, "parent");
    __publicField(this, "nestedNum");
    __publicField(this, "maxNestingNum");
    __publicField(this, "children", []);
    __publicField(this, "replyTo");
    __publicField(this, "$replyTo");
    __publicField(this, "afterRender");
    __publicField(this, "unread", false);
    __publicField(this, "openable", false);
    __publicField(this, "openURL");
    __publicField(this, "openEvt");
    __publicField(this, "onDelete");
    this.maxNestingNum = ctx.conf.maxNesting || 3;
    this.data = __spreadValues({}, data);
    this.data.date = this.data.date.replace(/-/g, "/");
    this.parent = null;
    this.nestedNum = 1;
  }
  render() {
    this.$el = createElement(CommentHTML);
    this.$main = this.$el.querySelector(".atk-comment-main");
    this.$header = this.$el.querySelector(".atk-header");
    this.$body = this.$el.querySelector(".atk-body");
    this.$content = this.$body.querySelector(".atk-content");
    this.$actions = this.$el.querySelector(".atk-comment-actions");
    this.$children = null;
    this.$el.setAttribute("data-comment-id", `${this.data.id}`);
    this.renderCheckUnread();
    this.renderCheckClickable();
    this.renderAvatar();
    this.renderHeader();
    this.renderContent();
    this.renderReplyTo();
    this.renderPending();
    this.renderActionBtn();
    if (this.afterRender)
      this.afterRender();
    return this.$el;
  }
  renderCheckUnread() {
    if (this.unread)
      this.$el.classList.add("atk-unread");
    else
      this.$el.classList.remove("atk-unread");
  }
  renderCheckClickable() {
    if (this.openable) {
      this.$el.classList.add("atk-openable");
    } else {
      this.$el.classList.remove("atk-openable");
    }
    this.$el.addEventListener("click", (evt) => {
      if (this.openable && this.openURL) {
        evt.preventDefault();
        window.open(this.openURL);
      }
      if (this.openEvt)
        this.openEvt();
    });
  }
  renderAvatar() {
    const $avatar = this.$el.querySelector(".atk-avatar");
    const $avatarImg = createElement("<img />");
    $avatarImg.src = this.getGravatarUrl();
    if (this.data.link) {
      const $avatarA = createElement('<a target="_blank" rel="noreferrer noopener nofollow"></a>');
      $avatarA.href = this.data.link;
      $avatarA.append($avatarImg);
      $avatar.append($avatarA);
    } else {
      $avatar.append($avatarImg);
    }
  }
  renderHeader() {
    const $nick = this.$el.querySelector(".atk-nick");
    if (this.data.link) {
      const $nickA = createElement('<a target="_blank" rel="noreferrer noopener nofollow"></a>');
      $nickA.innerText = this.data.nick;
      $nickA.href = this.data.link;
      $nick.append($nickA);
    } else {
      $nick.innerText = this.data.nick;
    }
    const $badge = this.$el.querySelector(".atk-badge");
    if (this.data.badge_name) {
      $badge.innerText = this.data.badge_name;
      if (this.data.badge_color)
        $badge.style.backgroundColor = this.data.badge_color;
    } else {
      $badge.remove();
    }
    const $date = this.$el.querySelector(".atk-date");
    $date.innerText = this.getDateFormatted();
    $date.setAttribute("data-atk-comment-date", String(+new Date(this.data.date)));
    if (this.conf.uaBadge) {
      const $uaWrap = createElement(`<span class="atk-ua-wrap"></span>`);
      const $uaBrowser = createElement(`<span class="atk-ua ua-browser"></span>`);
      const $usOS = createElement(`<span class="atk-ua ua-os"></span>`);
      $uaBrowser.innerText = this.getUserUaBrowser();
      $usOS.innerText = this.getUserUaOS();
      $uaWrap.append($uaBrowser);
      $uaWrap.append($usOS);
      this.$header.append($uaWrap);
    }
  }
  renderContent() {
    if (!this.data.is_collapsed) {
      this.$content.innerHTML = this.getContentMarked();
      return;
    }
    this.$content.classList.add("atk-hide", "atk-type-collapsed");
    const collapsedInfoEl = createElement(`
      <div class="atk-collapsed">
        <span class="atk-text">\u8BE5\u8BC4\u8BBA\u5DF2\u88AB\u7CFB\u7EDF\u6216\u7BA1\u7406\u5458\u6298\u53E0</span>
        <span class="atk-show-btn">\u67E5\u770B\u5185\u5BB9</span>
      </div>`);
    this.$body.insertAdjacentElement("beforeend", collapsedInfoEl);
    const contentShowBtn = collapsedInfoEl.querySelector(".atk-show-btn");
    contentShowBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.$content.classList.contains("atk-hide")) {
        this.$content.innerHTML = this.getContentMarked();
        this.$content.classList.remove("atk-hide");
        playFadeInAnim(this.$content);
        contentShowBtn.innerHTML = "\u6536\u8D77\u5185\u5BB9";
      } else {
        this.$content.innerHTML = "";
        this.$content.classList.add("atk-hide");
        contentShowBtn.innerHTML = "\u67E5\u770B\u5185\u5BB9";
      }
    });
  }
  renderReplyTo() {
    if (!this.replyTo)
      return;
    this.$replyTo = createElement(`
      <div class="atk-reply-to">
        <div class="atk-meta">\u56DE\u590D <span class="atk-nick"></span>:</div>
        <div class="atk-content"></div>
      </div>`);
    this.$replyTo.querySelector(".atk-nick").innerText = `@${this.replyTo.nick}`;
    let replyContent = marked(this.ctx, this.replyTo.content);
    if (this.replyTo.is_collapsed)
      replyContent = "[\u5DF2\u6298\u53E0]";
    this.$replyTo.querySelector(".atk-content").innerHTML = replyContent;
    this.$body.prepend(this.$replyTo);
  }
  renderPending() {
    if (!this.data.is_pending)
      return;
    const pendingEl = createElement(`<div class="atk-pending">\u5BA1\u6838\u4E2D\uFF0C\u4EC5\u672C\u4EBA\u53EF\u89C1\u3002</div>`);
    this.$body.prepend(pendingEl);
  }
  renderActionBtn() {
    if (this.ctx.conf.vote) {
      this.voteBtnUp = new ActionBtn(() => `\u8D5E\u540C (${this.data.vote_up || 0})`).appendTo(this.$actions);
      this.voteBtnUp.setClick(() => {
        this.vote("up");
      });
      if (this.ctx.conf.voteDown) {
        this.voteBtnDown = new ActionBtn(() => `\u53CD\u5BF9 (${this.data.vote_down || 0})`).appendTo(this.$actions);
        this.voteBtnDown.setClick(() => {
          this.vote("down");
        });
      }
    }
    if (this.data.is_allow_reply) {
      const replyBtn = createElement(`<span data-atk-action="comment-reply">\u56DE\u590D</span>`);
      this.$actions.append(replyBtn);
      replyBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.ctx.trigger("editor-reply", this.data);
      });
    }
    const collapseBtn = new ActionBtn({
      text: () => this.data.is_collapsed ? "\u53D6\u6D88\u6298\u53E0" : "\u6298\u53E0",
      adminOnly: true
    });
    collapseBtn.appendTo(this.$actions);
    collapseBtn.setClick(() => {
      this.adminEdit("collapsed", collapseBtn);
    });
    const pendingBtn = new ActionBtn({
      text: () => this.data.is_pending ? "\u5F85\u5BA1" : "\u5DF2\u5BA1",
      adminOnly: true
    });
    pendingBtn.appendTo(this.$actions);
    pendingBtn.setClick(() => {
      this.adminEdit("pending", pendingBtn);
    });
    const delBtn = new ActionBtn({
      text: "\u5220\u9664",
      confirm: true,
      confirmText: "\u786E\u8BA4\u5220\u9664",
      adminOnly: true
    });
    delBtn.appendTo(this.$actions);
    delBtn.setClick(() => {
      this.adminDelete(delBtn);
    });
  }
  refreshUI() {
    const originalEl = this.$el;
    const newEl = this.render();
    originalEl.replaceWith(newEl);
    this.playFadeInAnim();
    this.eachComment(this.children, (child) => {
      var _a;
      (_a = child.parent) == null ? void 0 : _a.getChildrenEl().appendChild(child.render());
      child.playFadeInAnim();
    });
    this.ctx.trigger("comments-loaded");
  }
  eachComment(commentList, action) {
    if (commentList.length === 0)
      return;
    commentList.every((item) => {
      if (action(item, commentList) === false)
        return false;
      this.eachComment(item.getChildren(), action);
      return true;
    });
  }
  getIsRoot() {
    return this.parent === null;
  }
  getChildren() {
    return this.children;
  }
  putChild(childC) {
    childC.parent = this;
    childC.nestedNum = this.nestedNum + 1;
    this.children.push(childC);
    this.getChildrenEl().appendChild(childC.getEl());
    childC.playFadeInAnim();
  }
  getChildrenEl() {
    if (this.$children === null) {
      if (this.nestedNum < this.maxNestingNum) {
        this.$children = createElement('<div class="atk-comment-children"></div>');
        this.$main.appendChild(this.$children);
      } else if (this.parent) {
        this.$children = this.parent.getChildrenEl();
      }
    }
    return this.$children;
  }
  getParent() {
    return this.parent;
  }
  getParents() {
    const parents = [];
    const once = (c) => {
      if (c.parent) {
        parents.push(c.parent);
        once(c.parent);
      }
    };
    once(this);
    return parents;
  }
  getEl() {
    return this.$el;
  }
  getData() {
    return this.data;
  }
  getGravatarUrl() {
    return getGravatarURL(this.ctx, this.data.email_encrypted);
  }
  getContentMarked() {
    return marked(this.ctx, this.data.content);
  }
  getDateFormatted() {
    return timeAgo(new Date(this.data.date));
  }
  getUserUaBrowser() {
    const info = detectFactory(this.data.ua);
    return `${info.browser} ${info.version}`;
  }
  getUserUaOS() {
    const info = detectFactory(this.data.ua);
    return `${info.os} ${info.osVersion}`;
  }
  playFadeInAnim() {
    playFadeInAnim(this.$el);
  }
  vote(type) {
    const actionBtn = type === "up" ? this.voteBtnUp : this.voteBtnDown;
    new Api(this.ctx).vote(this.data.id, `comment_${type}`).then((v) => {
      var _a, _b;
      this.data.vote_up = v.up;
      this.data.vote_down = v.down;
      (_a = this.voteBtnUp) == null ? void 0 : _a.updateText();
      (_b = this.voteBtnDown) == null ? void 0 : _b.updateText();
    }).catch((err) => {
      actionBtn == null ? void 0 : actionBtn.setError(`\u6295\u7968\u5931\u8D25`);
      console.log(err);
    });
  }
  adminEdit(type, btnElem) {
    if (btnElem.isLoading)
      return;
    btnElem.setLoading(true, "\u4FEE\u6539\u4E2D...");
    const modify = __spreadValues({}, this.data);
    if (type === "collapsed") {
      modify.is_collapsed = !modify.is_collapsed;
    } else if (type === "pending") {
      modify.is_pending = !modify.is_pending;
    }
    new Api(this.ctx).commentEdit(modify).then((comment2) => {
      btnElem.setLoading(false);
      this.data = comment2;
      this.refreshUI();
      playFadeInAnim(this.$body);
      this.ctx.trigger("list-refresh-ui");
    }).catch((err) => {
      console.error(err);
      btnElem.setError("\u4FEE\u6539\u5931\u8D25");
    });
  }
  adminDelete(btnElem) {
    if (btnElem.isLoading)
      return;
    btnElem.setLoading(true, "\u5220\u9664\u4E2D...");
    new Api(this.ctx).commentDel(this.data.id, this.data.site_name).then(() => {
      btnElem.setLoading(false);
      if (this.onDelete)
        this.onDelete(this);
    }).catch((e) => {
      console.error(e);
      btnElem.setError("\u5220\u9664\u5931\u8D25");
    });
  }
  setUnread(val) {
    this.unread = val;
    if (this.unread)
      this.$el.classList.add("atk-unread");
    else
      this.$el.classList.remove("atk-unread");
  }
  setOpenURL(url) {
    if (!url) {
      this.openable = false;
      this.$el.classList.remove("atk-openable");
    }
    this.openable = true;
    this.openURL = url;
    this.$el.classList.add("atk-openable");
  }
}
var pagination = "";
class Pagination {
  constructor(total, conf) {
    __publicField(this, "conf");
    __publicField(this, "total");
    __publicField(this, "$el");
    __publicField(this, "$input");
    __publicField(this, "inputTimer");
    __publicField(this, "$prevBtn");
    __publicField(this, "$nextBtn");
    __publicField(this, "page", 1);
    this.total = total;
    this.conf = conf;
    this.$el = createElement(`<div class="atk-pagination-wrap">
        <div class="atk-pagination">
          <div class="atk-btn atk-btn-prev">Prev</div>
          <input type="text" class="atk-input" />
          <div class="atk-btn atk-btn-next">Next</div>
        </div>
      </div>`);
    this.$input = this.$el.querySelector(".atk-input");
    this.$input.value = `${this.page}`;
    this.$input.oninput = () => this.input();
    this.$input.onkeydown = (e) => this.keydown(e);
    this.$prevBtn = this.$el.querySelector(".atk-btn-prev");
    this.$nextBtn = this.$el.querySelector(".atk-btn-next");
    this.$prevBtn.onclick = () => this.prev();
    this.$nextBtn.onclick = () => this.next();
    this.checkDisabled();
  }
  get pageSize() {
    return this.conf.pageSize || 15;
  }
  get offset() {
    return this.pageSize * (this.page - 1);
  }
  get maxPage() {
    return Math.ceil(this.total / this.pageSize);
  }
  update(offset, total) {
    this.page = Math.ceil(offset / this.pageSize) + 1;
    this.total = total;
    this.setInput(this.page);
    this.checkDisabled();
  }
  setInput(page) {
    this.$input.value = `${page}`;
  }
  input(now = false) {
    window.clearTimeout(this.inputTimer);
    const value = this.$input.value.trim();
    const modify = () => {
      if (value === "") {
        this.setInput(this.page);
        return;
      }
      let page = Number(value);
      if (Number.isNaN(page)) {
        this.setInput(this.page);
        return;
      }
      if (page < 1) {
        this.setInput(this.page);
        return;
      }
      if (page > this.maxPage) {
        this.setInput(this.maxPage);
        page = this.maxPage;
      }
      this.change(page);
    };
    if (!now)
      this.inputTimer = window.setTimeout(() => modify(), 800);
    else
      modify();
  }
  prev() {
    const page = this.page - 1;
    if (page < 1) {
      return;
    }
    this.change(page);
  }
  next() {
    const page = this.page + 1;
    if (page > this.maxPage) {
      return;
    }
    this.change(page);
  }
  change(page) {
    this.page = page;
    this.conf.onChange(this.offset);
    this.setInput(page);
    this.checkDisabled();
  }
  checkDisabled() {
    if (this.page + 1 > this.maxPage) {
      this.$nextBtn.classList.add("atk-disabled");
    } else {
      this.$nextBtn.classList.remove("atk-disabled");
    }
    if (this.page - 1 < 1) {
      this.$prevBtn.classList.add("atk-disabled");
    } else {
      this.$prevBtn.classList.remove("atk-disabled");
    }
  }
  keydown(e) {
    const keyCode = e.keyCode || e.which;
    if (keyCode === 38) {
      const page = Number(this.$input.value) + 1;
      if (page > this.maxPage) {
        return;
      }
      this.setInput(page);
      this.input();
    } else if (keyCode === 40) {
      const page = Number(this.$input.value) - 1;
      if (page < 1) {
        return;
      }
      this.setInput(page);
      this.input();
    } else if (keyCode === 13) {
      this.input(true);
    }
  }
  setLoading(isLoading) {
    if (isLoading)
      showLoading(this.$el);
    else
      hideLoading(this.$el);
  }
}
class ReadMoreBtn {
  constructor(conf) {
    __publicField(this, "conf");
    __publicField(this, "$el");
    __publicField(this, "$loading");
    __publicField(this, "$text");
    this.conf = conf;
    this.$el = createElement(`<div class="atk-list-read-more" style="display: none;">
      <div class="atk-list-read-more-inner">
        <div class="atk-loading-icon" style="display: none;"></div>
        <span class="atk-text">\u67E5\u770B\u66F4\u591A</span>
      </div>
    </div>`);
    this.$loading = this.$el.querySelector(".atk-loading-icon");
    this.$text = this.$el.querySelector(".atk-text");
    this.$el.onclick = () => this.click();
  }
  click() {
    this.conf.onClick();
  }
  show() {
    this.$el.style.display = "";
  }
  hide() {
    this.$el.style.display = "none";
  }
  setLoading(isLoading) {
    this.$loading.style.display = isLoading ? "" : "none";
    this.$text.style.display = isLoading ? "none" : "";
  }
  showErr(errMsg) {
    this.setLoading(false);
    this.$text.innerText = errMsg;
    this.$el.classList.add("atk-err");
    window.setTimeout(() => {
      this.$text.innerText = "\u67E5\u770B\u66F4\u591A";
      this.$el.classList.remove("atk-err");
    }, 2e3);
  }
}
class ListLite extends Component {
  constructor(ctx, $parent) {
    super(ctx);
    __publicField(this, "$parent");
    __publicField(this, "$commentsWrap");
    __publicField(this, "comments", []);
    __publicField(this, "data");
    __publicField(this, "pageSize", 15);
    __publicField(this, "offset", 0);
    __publicField(this, "type");
    __publicField(this, "noCommentText");
    __publicField(this, "renderComment");
    __publicField(this, "paramsEditor");
    __publicField(this, "onAfterLoad");
    __publicField(this, "isLoading", false);
    __publicField(this, "isFirstLoad", true);
    __publicField(this, "flatMode");
    __publicField(this, "pageMode", "pagination");
    __publicField(this, "pagination");
    __publicField(this, "readMoreBtn");
    __publicField(this, "autoLoadScrollEvent");
    __publicField(this, "autoLoadListenerAt");
    __publicField(this, "unread", []);
    __publicField(this, "unreadHighlight", false);
    this.$parent = $parent;
    this.$el = createElement(`<div class="atk-list-lite">
      <div class="atk-list-comments-wrap"></div>
    </div>`);
    this.$commentsWrap = this.$el.querySelector(".atk-list-comments-wrap");
    this.pageSize = this.conf.pagination ? this.conf.pagination.pageSize || this.pageSize : this.pageSize;
    this.noCommentText = this.conf.noComment || "\u65E0\u8BC4\u8BBA";
    window.setInterval(() => {
      this.$el.querySelectorAll("[data-atk-comment-date]").forEach((el) => {
        const date = el.getAttribute("data-atk-comment-date");
        el.innerText = timeAgo(new Date(Number(date)));
      });
    }, 30 * 1e3);
    this.ctx.on("unread-update", (data) => this.updateUnread(data.notifies));
  }
  reqComments(offset = 0) {
    return __async(this, null, function* () {
      if (offset === 0 && this.pageMode !== "pagination") {
        this.clearAllComments();
      }
      const showLoading$1 = () => {
        this.isLoading = true;
        if (offset === 0)
          showLoading(this.$el);
        else if (this.pageMode === "read-more")
          this.readMoreBtn.setLoading(true);
        else if (this.pageMode === "pagination")
          this.pagination.setLoading(true);
      };
      const hideLoading$1 = () => {
        this.isLoading = false;
        if (offset === 0)
          hideLoading(this.$el);
        else if (this.pageMode === "read-more")
          this.readMoreBtn.setLoading(false);
        else if (this.pageMode === "pagination")
          this.pagination.setLoading(false);
      };
      showLoading$1();
      this.ctx.trigger("comments-load");
      let listData;
      try {
        listData = yield new Api(this.ctx).get(offset, this.type, this.flatMode, this.paramsEditor);
      } catch (e) {
        this.onError(e.msg || String(e));
        throw e;
      } finally {
        hideLoading$1();
      }
      if (this.ctx.conf.versionCheck) {
        const needUpdate = this.apiVersionCheck(listData.api_version || {});
        if (needUpdate)
          return;
      }
      this.offset = offset;
      try {
        this.onLoad(listData, offset);
        if (this.onAfterLoad) {
          this.onAfterLoad(listData);
        }
      } catch (e) {
        this.onError(String(e));
        throw e;
      } finally {
        hideLoading$1();
      }
    });
  }
  onLoad(data, offset) {
    var _a;
    setError(this.$el, null);
    if (this.pageMode === "pagination") {
      this.clearAllComments();
    }
    this.data = data;
    this.importComments(data.comments);
    if (this.isFirstLoad) {
      this.onLoadInit();
    }
    if (this.pageMode === "pagination") {
      this.pagination.update(offset, ((_a = this.data) == null ? void 0 : _a.total_parents) || 0);
    }
    if (this.pageMode === "read-more") {
      if (this.hasMoreComments)
        this.readMoreBtn.show();
      else
        this.readMoreBtn.hide();
    }
    this.ctx.trigger("unread-update", { notifies: data.unread || [] });
    this.isFirstLoad = false;
  }
  onLoadInit() {
    var _a;
    if (this.autoLoadScrollEvent) {
      const at = this.autoLoadListenerAt || document;
      at.removeEventListener("scroll", this.autoLoadScrollEvent);
    }
    if (this.pageMode === "read-more") {
      const readMoreBtn = new ReadMoreBtn({
        pageSize: this.pageSize,
        total: 0,
        onClick: () => __async(this, null, function* () {
          const offset = this.offset + this.pageSize;
          yield this.reqComments(offset);
        })
      });
      if (this.readMoreBtn)
        this.readMoreBtn.$el.replaceWith(readMoreBtn.$el);
      else
        this.$el.append(readMoreBtn.$el);
      this.readMoreBtn = readMoreBtn;
      if ((_a = this.conf.pagination) == null ? void 0 : _a.autoLoad) {
        this.autoLoadScrollEvent = () => {
          if (this.pageMode !== "read-more")
            return;
          if (!this.hasMoreComments)
            return;
          if (this.isLoading)
            return;
          const $target = this.$el.querySelector(".atk-list-comments-wrap > .atk-comment-wrap:nth-last-child(3)");
          if (!$target)
            return;
          if (isVisible($target, this.autoLoadListenerAt)) {
            this.readMoreBtn.click();
          }
        };
        const at = this.autoLoadListenerAt || document;
        at.addEventListener("scroll", this.autoLoadScrollEvent);
      }
    } else if (this.pageMode === "pagination") {
      const pagination2 = new Pagination(this.parentCommentsCount, {
        pageSize: this.pageSize,
        onChange: (offset) => __async(this, null, function* () {
          yield this.reqComments(offset);
          if (this.$parent) {
            let topPos = 0;
            if (!this.autoLoadListenerAt && this.$parent) {
              topPos = getOffset(this.$parent).top;
            }
            const at = this.autoLoadListenerAt || window;
            at.scroll({
              top: topPos,
              left: 0
            });
          }
        })
      });
      if (this.pagination)
        this.pagination.$el.replaceWith(pagination2.$el);
      else
        this.$el.append(pagination2.$el);
      this.pagination = pagination2;
    }
  }
  onError(msg) {
    var _a;
    msg = String(msg);
    console.error(msg);
    if (this.isFirstLoad || this.pageMode === "pagination") {
      const errEl = createElement(`<span>${msg}\uFF0C\u65E0\u6CD5\u83B7\u53D6\u8BC4\u8BBA\u5217\u8868\u6570\u636E<br/></span>`);
      const retryBtn = createElement('<span style="cursor:pointer;">\u70B9\u51FB\u91CD\u65B0\u83B7\u53D6</span>');
      retryBtn.onclick = () => {
        this.reqComments(this.offset);
      };
      errEl.appendChild(retryBtn);
      const adminBtn = createElement('<span atk-only-admin-show> | <span style="cursor:pointer;">\u6253\u5F00\u63A7\u5236\u53F0</span></span>');
      adminBtn.onclick = () => {
        this.ctx.trigger("sidebar-show");
      };
      if (!this.ctx.user.data.isAdmin) {
        adminBtn.classList.add("atk-hide");
      }
      errEl.appendChild(adminBtn);
      setError(this.$el, errEl);
    } else {
      (_a = this.readMoreBtn) == null ? void 0 : _a.showErr(`\u83B7\u53D6\u5931\u8D25`);
    }
  }
  refreshUI() {
    const noComment = this.comments.length <= 0;
    let noCommentEl = this.$commentsWrap.querySelector(".atk-list-no-comment");
    if (noComment) {
      if (!noCommentEl) {
        noCommentEl = createElement('<div class="atk-list-no-comment"></div>');
        this.$commentsWrap.appendChild(noCommentEl);
        noCommentEl.innerHTML = this.noCommentText;
      }
    }
    if (!noComment && noCommentEl)
      noCommentEl.remove();
    this.ctx.trigger("check-admin-show-el");
  }
  createComment(data) {
    const comment2 = new Comment(this.ctx, data);
    comment2.afterRender = () => {
      if (this.renderComment)
        this.renderComment(comment2);
    };
    comment2.onDelete = (c) => {
      this.deleteComment(c);
      this.refreshUI();
    };
    return comment2;
  }
  importComments(rawData) {
    const queryImportChildren = (parentC) => {
      const children = rawData.filter((o) => o.rid === parentC.data.id);
      if (children.length === 0)
        return;
      children.forEach((itemData) => {
        itemData.is_allow_reply = parentC.data.is_allow_reply;
        const childC = this.createComment(itemData);
        childC.render();
        parentC.putChild(childC);
        queryImportChildren(childC);
      });
    };
    if (!this.flatMode) {
      rawData.filter((o) => o.rid === 0).forEach((rootCommentData) => {
        if (rootCommentData.is_collapsed)
          rootCommentData.is_allow_reply = false;
        const rootComment = this.createComment(rootCommentData);
        rootComment.render();
        this.comments.push(rootComment);
        this.$commentsWrap.appendChild(rootComment.getEl());
        rootComment.playFadeInAnim();
        queryImportChildren(rootComment);
      });
    } else {
      rawData.forEach((commentData) => {
        this.putCommentFlatMode(commentData, rawData, "append");
      });
    }
    this.eachComment(this.comments, (c) => {
      if (c.getIsRoot())
        this.checkMoreHide(c);
    });
    this.refreshUI();
    this.ctx.trigger("comments-loaded");
  }
  putCommentFlatMode(commentItem, comments, insertMode) {
    if (commentItem.is_collapsed)
      commentItem.is_allow_reply = false;
    const comment2 = this.createComment(commentItem);
    if (commentItem.rid !== 0) {
      const rComment = comments.find((o) => o.id === commentItem.rid);
      if (rComment)
        comment2.replyTo = rComment;
    }
    comment2.render();
    if (insertMode === "append") {
      this.comments.push(comment2);
    } else {
      this.comments.unshift(comment2);
    }
    if (commentItem.visible) {
      if (insertMode === "append") {
        this.$commentsWrap.appendChild(comment2.getEl());
      } else {
        this.$commentsWrap.prepend(comment2.getEl());
      }
      comment2.playFadeInAnim();
    }
    this.checkMoreHide(comment2);
  }
  insertComment(commentData) {
    if (!this.flatMode) {
      const comment2 = this.createComment(commentData);
      comment2.render();
      if (commentData.rid === 0) {
        this.$commentsWrap.prepend(comment2.getEl());
        this.comments.unshift(comment2);
        this.checkMoreHide(comment2);
      } else {
        const parent = this.findComment(commentData.rid);
        if (parent) {
          parent.putChild(comment2);
          if (parent.$children)
            this.removeHideMore(parent.$children);
          this.eachComment(parent.children, (c) => {
            this.checkMoreHide(c);
          });
        }
      }
      scrollIntoView(comment2.getEl());
      comment2.playFadeInAnim();
    } else {
      this.putCommentFlatMode(commentData, this.comments.map((c) => c.data), "prepend");
    }
    if (this.data)
      this.data.total += 1;
    this.refreshUI();
    this.ctx.trigger("comments-loaded");
  }
  checkMoreHide(c) {
    this.checkMoreHideEl(c, "children");
    this.checkMoreHideEl(c, "content");
    if (c.$replyTo)
      this.checkMoreHideEl(c, "replyTo");
  }
  checkMoreHideEl(comment2, area, allowHeight = 300) {
    var _a, _b;
    const childrenH = (_a = this.ctx.conf.heightLimit) == null ? void 0 : _a.children;
    const contentH = (_b = this.ctx.conf.heightLimit) == null ? void 0 : _b.content;
    if (area === "children" && !childrenH)
      return;
    if ((area === "content" || area === "replyTo") && !contentH)
      return;
    if (area === "children")
      allowHeight = childrenH || 300;
    else
      allowHeight = contentH || 200;
    let $target;
    if (area === "children")
      $target = comment2.$children;
    else if (area === "content")
      $target = comment2.$content;
    else if (area === "replyTo")
      $target = comment2.$replyTo;
    if (!$target)
      return;
    let $hideMoreOpenBtn = $target.querySelector(".atk-more-hide-open-btn");
    const removeHideMore = () => {
      $target.classList.remove("atk-comment-more-hide");
      if ($hideMoreOpenBtn)
        $hideMoreOpenBtn.remove();
      $target.style.height = "";
      $target.style.overflow = "";
    };
    if (getHeight($target) > allowHeight) {
      $target.classList.add("atk-comment-more-hide");
      $target.style.height = `${allowHeight}px`;
      $target.style.overflow = "hidden";
      if (!$hideMoreOpenBtn) {
        $hideMoreOpenBtn = createElement(`<div class="atk-more-hide-open-btn">\u9605\u8BFB\u66F4\u591A</span>`);
        $hideMoreOpenBtn.onclick = (e) => {
          e.stopPropagation();
          removeHideMore();
          if (comment2.getIsRoot()) {
            const children = comment2.getChildren();
            if (children.length > 1) {
              this.eachComment(children, (c) => {
                this.checkMoreHideEl(c, "content", contentH || 200);
              });
            }
          }
        };
        $target.append($hideMoreOpenBtn);
      }
    }
  }
  removeHideMore($target) {
    const $hideMoreOpenBtn = $target.querySelector(".atk-more-hide-open-btn");
    $target.classList.remove("atk-comment-more-hide");
    if ($hideMoreOpenBtn)
      $hideMoreOpenBtn.remove();
    $target.style.height = "";
    $target.style.overflow = "";
  }
  get commentsCount() {
    var _a;
    return Number((_a = this.data) == null ? void 0 : _a.total) || 0;
  }
  get parentCommentsCount() {
    var _a;
    return Number((_a = this.data) == null ? void 0 : _a.total_parents) || 0;
  }
  get hasMoreComments() {
    if (!this.data)
      return false;
    return this.data.total_parents > this.offset + this.pageSize;
  }
  eachComment(commentList, action) {
    if (commentList.length === 0)
      return;
    commentList.every((item) => {
      if (action(item, commentList) === false)
        return false;
      this.eachComment(item.getChildren(), action);
      return true;
    });
  }
  findComment(id, src) {
    if (!src)
      src = this.comments;
    let comment2 = null;
    this.eachComment(src, (item) => {
      if (item.data.id === id) {
        comment2 = item;
        return false;
      }
      return true;
    });
    return comment2;
  }
  getCommentCount() {
    let count = 0;
    this.eachComment(this.comments, () => {
      count++;
    });
    return count;
  }
  deleteComment(comment2) {
    let findComment;
    if (typeof comment2 === "number") {
      findComment = this.findComment(comment2);
      if (!findComment)
        throw Error(`\u672A\u627E\u5230\u8BC4\u8BBA ${comment2}`);
    } else
      findComment = comment2;
    findComment.getEl().remove();
    this.eachComment(this.comments, (item, levelList) => {
      if (item === findComment) {
        levelList.splice(levelList.indexOf(item), 1);
        return false;
      }
      return true;
    });
    this.refreshUI();
  }
  clearAllComments() {
    this.$commentsWrap.innerHTML = "";
    this.data = void 0;
    this.comments = [];
  }
  updateUnread(notifies) {
    this.unread = notifies;
    if (this.unreadHighlight) {
      this.eachComment(this.comments, (comment2) => {
        const notify = this.unread.find((o) => o.comment_id === comment2.data.id);
        if (notify) {
          comment2.setUnread(true);
          comment2.setOpenURL(notify.read_link);
          comment2.openEvt = () => {
            this.unread = this.unread.filter((o) => o.comment_id !== comment2.data.id);
            this.ctx.trigger("unread-update", {
              notifies: this.unread
            });
          };
        } else {
          comment2.setUnread(false);
        }
      });
    }
  }
  apiVersionCheck(versionData) {
    const needVersion = (versionData == null ? void 0 : versionData.fe_min_version) || "0.0.0";
    const needUpdate = versionCompare(needVersion, "2.1.2") === 1;
    if (needUpdate) {
      const errEl = createElement(`<div>\u524D\u7AEF Artalk \u7248\u672C\u5DF2\u8FC7\u65F6\uFF0C\u8BF7\u66F4\u65B0\u4EE5\u83B7\u5F97\u5B8C\u6574\u4F53\u9A8C<br/>\u82E5\u60A8\u662F\u7AD9\u70B9\u7BA1\u7406\u5458\uFF0C\u8BF7\u524D\u5F80 \u201C<a href="https://artalk.js.org/" target="_blank">\u5B98\u65B9\u6587\u6863</a>\u201D \u83B7\u53D6\u5E2E\u52A9<br/><br/><span style="color: var(--at-color-meta);">\u524D\u7AEF\u7248\u672C ${"2.1.2"}\uFF0C\u9700\u6C42\u7248\u672C >= ${needVersion}</span><br/><br/></div>`);
      const ignoreBtn = createElement('<span style="cursor:pointer;">\u5FFD\u7565</span>');
      ignoreBtn.onclick = () => {
        setError(this.ctx, null);
        this.ctx.conf.versionCheck = false;
        this.reqComments(0);
      };
      errEl.append(ignoreBtn);
      setError(this.ctx, errEl, '<span class="atk-warn-title">Artalk Warn</span>');
    }
    return needUpdate;
  }
}
class List extends ListLite {
  constructor(ctx) {
    var _a;
    const el = createElement(ListHTML);
    super(ctx, el);
    __publicField(this, "$closeCommentBtn");
    __publicField(this, "$openSidebarBtn");
    __publicField(this, "$unreadBadge");
    el.querySelector(".atk-list-body").append(this.$el);
    this.$el = el;
    let flatMode = false;
    if (this.ctx.conf.flatMode === "auto") {
      if (window.matchMedia("(max-width: 768px)").matches)
        flatMode = true;
    } else if (this.ctx.conf.flatMode === true) {
      flatMode = true;
    }
    this.flatMode = flatMode;
    this.pageMode = ((_a = this.conf.pagination) == null ? void 0 : _a.readMore) ? "read-more" : "pagination";
    this.initListActionBtn();
    this.$el.querySelector(".atk-copyright").innerHTML = `Powered By <a href="https://artalk.js.org" target="_blank" title="Artalk v${"2.1.2"}">Artalk</a>`;
    this.ctx.on("list-reload", () => this.reqComments(0));
    this.ctx.on("list-refresh-ui", () => this.refreshUI());
    this.ctx.on("list-import", (data) => this.importComments(data));
    this.ctx.on("list-insert", (data) => this.insertComment(data));
    this.ctx.on("list-delete", (comment2) => this.deleteComment(comment2.id));
    this.ctx.on("list-update", (updateData) => {
      updateData(this.data);
      this.refreshUI();
    });
    this.ctx.on("unread-update", (data) => {
      var _a2;
      return this.showUnreadBadge(((_a2 = data.notifies) == null ? void 0 : _a2.length) || 0);
    });
  }
  initListActionBtn() {
    this.$openSidebarBtn = this.$el.querySelector('[data-action="open-sidebar"]');
    this.$closeCommentBtn = this.$el.querySelector('[data-action="admin-close-comment"]');
    this.$unreadBadge = this.$el.querySelector(".atk-unread-badge");
    this.$openSidebarBtn.addEventListener("click", () => {
      this.ctx.trigger("sidebar-show");
    });
    this.$closeCommentBtn.addEventListener("click", () => {
      if (!this.data)
        return;
      this.data.page.admin_only = !this.data.page.admin_only;
      this.adminPageEditSave();
    });
  }
  refreshUI() {
    super.refreshUI();
    this.$el.querySelector(".atk-comment-count-num").innerText = String(this.commentsCount);
    if (!!this.ctx.user.data.nick && !!this.ctx.user.data.email) {
      this.$openSidebarBtn.classList.remove("atk-hide");
    } else {
      this.$openSidebarBtn.classList.add("atk-hide");
    }
    this.ctx.trigger("check-admin-show-el");
    this.$openSidebarBtn.innerText = !this.ctx.user.data.isAdmin ? "\u901A\u77E5\u4E2D\u5FC3" : "\u63A7\u5236\u4E2D\u5FC3";
    if (!!this.data && !!this.data.page && this.data.page.admin_only === true) {
      this.ctx.trigger("editor-close");
      this.$closeCommentBtn.innerHTML = "\u6253\u5F00\u8BC4\u8BBA";
    } else {
      this.ctx.trigger("editor-open");
      this.$closeCommentBtn.innerHTML = "\u5173\u95ED\u8BC4\u8BBA";
    }
  }
  onLoad(data, offset) {
    super.onLoad(data, offset);
    this.checkGoToCommentByUrlHash();
  }
  checkGoToCommentByUrlHash() {
    return __async(this, null, function* () {
      let commentId = Number(getQueryParam("atk_comment"));
      if (!commentId) {
        const match = window.location.hash.match(/#atk-comment-([0-9]+)/);
        if (!match || !match[1] || Number.isNaN(Number(match[1])))
          return;
        commentId = Number(match[1]);
      }
      if (!commentId)
        return;
      const notifyKey = getQueryParam("atk_notify_key");
      if (notifyKey) {
        new Api(this.ctx).markRead(notifyKey).then(() => {
          this.unread = this.unread.filter((o) => o.comment_id !== commentId);
          this.ctx.trigger("unread-update", {
            notifies: this.unread
          });
        });
      }
      const comment2 = this.findComment(commentId);
      if (!comment2)
        return;
      scrollIntoView(comment2.getEl(), false);
      window.setTimeout(() => {
        comment2.getEl().classList.add("atk-flash-once");
      }, 800);
    });
  }
  adminPageEditSave() {
    if (!this.data || !this.data.page)
      return;
    this.ctx.trigger("editor-show-loading");
    new Api(this.ctx).pageEdit(this.data.page).then((page) => {
      if (this.data)
        this.data.page = __spreadValues({}, page);
      this.refreshUI();
    }).catch((err) => {
      this.ctx.trigger("editor-notify", { msg: `\u4FEE\u6539\u9875\u9762\u6570\u636E\u5931\u8D25\uFF1A${err.msg || String(err)}`, type: "e" });
    }).finally(() => {
      this.ctx.trigger("editor-hide-loading");
    });
  }
  showUnreadBadge(count) {
    if (count > 0) {
      this.$unreadBadge.innerText = `${Number(count || 0)}`;
      this.$unreadBadge.style.display = "block";
    } else {
      this.$unreadBadge.style.display = "none";
    }
  }
}
var sidebar = "";
var MD5 = function(d) {
  var r = M(V(Y(X(d), 8 * d.length)));
  return r.toLowerCase();
};
function M(d) {
  for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++)
    _ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _);
  return f;
}
function X(d) {
  for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++)
    _[m] = 0;
  for (m = 0; m < 8 * d.length; m += 8)
    _[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32;
  return _;
}
function V(d) {
  for (var _ = "", m = 0; m < 32 * d.length; m += 8)
    _ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255);
  return _;
}
function Y(d, _) {
  d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _;
  for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) {
    var h = m, t = f, g = r, e = i;
    f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e);
  }
  return Array(m, f, r, i);
}
function md5_cmn(d, _, m, f, r, i) {
  return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m);
}
function md5_ff(d, _, m, f, r, i, n) {
  return md5_cmn(_ & m | ~_ & f, d, _, r, i, n);
}
function md5_gg(d, _, m, f, r, i, n) {
  return md5_cmn(_ & f | m & ~f, d, _, r, i, n);
}
function md5_hh(d, _, m, f, r, i, n) {
  return md5_cmn(_ ^ m ^ f, d, _, r, i, n);
}
function md5_ii(d, _, m, f, r, i, n) {
  return md5_cmn(m ^ (_ | ~f), d, _, r, i, n);
}
function safe_add(d, _) {
  var m = (65535 & d) + (65535 & _);
  return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m;
}
function bit_rol(d, _) {
  return d << _ | d >>> 32 - _;
}
var SidebarHTML = '<div class="atk-sidebar">\n  <div class="atk-sidebar-inner">\n    <div class="atk-sidebar-header">\n      <span class="atk-avatar">\n        <span class="atk-site-logo"></span>\n      </span>\n      <span class="atk-menu">\n        <span class="atk-item atk-active atk-sidebar-title">\u63A7\u5236\u4E2D\u5FC3</span>\n      </span>\n      <div class="atk-sidebar-close"><i class="atk-icon atk-icon-close"></i></div>\n    </div>\n    <div class="atk-sidebar-nav">\n      <div class="akt-curt-view-btn">\n        <div class="atk-icon"><span></span><span></span><span></span></div>\n        <div class="atk-text"></div>\n      </div>\n      <div class="atk-tabs"></div>\n      <div class="atk-tabs atk-views" style="display: none;"></div>\n    </div>\n    <div class="atk-sidebar-view-wrap"></div>\n  </div>\n</div>\n';
class SidebarView extends Component {
  constructor(ctx, $parent) {
    super(ctx);
    __publicField(this, "viewTabs", {});
    __publicField(this, "viewActiveTab", "");
    __publicField(this, "$parent");
    this.$parent = $parent;
    this.$el = createElement(`<div class="atk-sidebar-view"></div>`);
  }
  mount(siteName) {
  }
  switchTab(tab, siteName) {
  }
}
__publicField(SidebarView, "viewName", "");
__publicField(SidebarView, "viewTitle", "");
__publicField(SidebarView, "viewAdminOnly", false);
class MessageView extends SidebarView {
  constructor() {
    super(...arguments);
    __publicField(this, "viewTabs", {});
    __publicField(this, "viewActiveTab", "");
    __publicField(this, "list");
  }
  mount(siteName) {
    if (this.ctx.user.data.isAdmin) {
      this.viewTabs = {
        admin_all: "\u5168\u90E8",
        admin_pending: "\u5F85\u5BA1",
        all: "\u4E2A\u4EBA"
      };
      this.viewActiveTab = "admin_all";
    } else {
      this.viewTabs = {
        mentions: "\u63D0\u53CA",
        all: "\u5168\u90E8",
        mine: "\u6211\u7684",
        pending: "\u5F85\u5BA1"
      };
      this.viewActiveTab = "mentions";
    }
    this.list = new ListLite(this.ctx, this.$el);
    this.list.flatMode = true;
    this.list.unreadHighlight = true;
    this.list.autoLoadListenerAt = this.$parent;
    this.list.pageMode = "pagination";
    this.list.noCommentText = '<div class="atk-sidebar-no-content">\u65E0\u5185\u5BB9</div>';
    this.list.renderComment = (comment2) => {
      var _a;
      comment2.setOpenURL(`${comment2.data.page_key}#atk-comment-${comment2.data.id}`);
      (_a = comment2.$actions.querySelector('[data-atk-action="comment-reply"]')) == null ? void 0 : _a.addEventListener("click", () => {
        this.ctx.trigger("sidebar-hide");
      });
    };
    this.list.paramsEditor = (params) => {
      params.site_name = siteName;
    };
    this.$el.innerHTML = "";
    this.$el.append(this.list.$el);
    this.switchTab(this.viewActiveTab, siteName);
  }
  switchTab(tab, siteName) {
    this.viewActiveTab = tab;
    this.list.type = tab;
    this.list.isFirstLoad = true;
    this.list.paramsEditor = (params) => {
      params.site_name = siteName;
    };
    this.list.reqComments();
    return true;
  }
}
__publicField(MessageView, "viewName", "comments");
__publicField(MessageView, "viewTitle", "\u8BC4\u8BBA");
var pageList = "";
var itemTextEditor = "";
class ItemTextEditor {
  constructor(conf) {
    __publicField(this, "conf");
    __publicField(this, "$el");
    __publicField(this, "$input");
    __publicField(this, "$yesBtn");
    __publicField(this, "$noBtn");
    __publicField(this, "value", "");
    __publicField(this, "allowSubmit", true);
    this.conf = conf;
    this.$el = createElement(`<div class="atk-item-text-editor-layer">
      <div class="atk-edit-form">
        <input class="atk-main-input" type="text" placeholder="\u8F93\u5165\u5185\u5BB9..." autocomplete="off" autofocus>
      </div>
      <div class="atk-actions">
        <div class="atk-item atk-yes-btn">
          <i class="atk-icon atk-icon-yes"></i>
        </div>
        <div class="atk-item atk-no-btn">
          <i class="atk-icon atk-icon-no"></i>
        </div>
      </div>
    </div>`);
    this.$input = this.$el.querySelector(".atk-main-input");
    this.$yesBtn = this.$el.querySelector(".atk-yes-btn");
    this.$noBtn = this.$el.querySelector(".atk-no-btn");
    this.$input.value = conf.initValue || "";
    this.value = conf.initValue || "";
    if (this.conf.placeholder)
      this.$input.placeholder = this.conf.placeholder;
    this.$input.oninput = () => this.onInput();
    this.$input.onkeyup = (evt) => {
      if (evt.key === "Enter" || evt.keyCode === 13) {
        evt.preventDefault();
        this.submit();
      }
    };
    window.setTimeout(() => this.$input.focus(), 80);
    this.$yesBtn.onclick = () => {
      this.submit();
    };
    this.$noBtn.onclick = () => {
      this.cancel();
    };
  }
  appendTo(parentDOM) {
    parentDOM.append(this.$el);
    return this;
  }
  onInput() {
    this.value = this.$input.value;
    if (this.conf.validator) {
      const ok = this.conf.validator(this.value);
      this.setAllowSubmit(ok);
      if (!ok) {
        this.$input.classList.add("atk-invalid");
      } else {
        this.$input.classList.remove("atk-invalid");
      }
    }
  }
  setAllowSubmit(allow) {
    if (this.allowSubmit === allow)
      return;
    this.allowSubmit = allow;
    if (!allow) {
      this.$yesBtn.classList.add(".atk-disabled");
    } else {
      this.$yesBtn.classList.remove(".atk-disabled");
    }
  }
  submit() {
    return __async(this, null, function* () {
      if (!this.allowSubmit)
        return;
      if (this.conf.onYes) {
        let isContinue;
        if (this.conf.onYes instanceof (() => __async(this, null, function* () {
        })).constructor) {
          isContinue = yield this.conf.onYes(this.value);
        } else {
          isContinue = this.conf.onYes(this.value);
        }
        if (isContinue === void 0 || isContinue === true) {
          this.closeEditor();
        }
      } else {
        this.closeEditor();
      }
    });
  }
  cancel() {
    return __async(this, null, function* () {
      if (this.conf.onNo) {
        let isContinue;
        if (this.conf.onNo instanceof (() => __async(this, null, function* () {
        })).constructor) {
          isContinue = yield this.conf.onNo();
        } else {
          isContinue = this.conf.onNo();
        }
        if (isContinue === void 0 || isContinue === true) {
          this.closeEditor();
        }
      } else {
        this.closeEditor();
      }
    });
  }
  closeEditor() {
    this.$el.remove();
  }
}
class PageList extends Component {
  constructor(ctx) {
    super(ctx);
    __publicField(this, "$editor");
    __publicField(this, "$inputer");
    __publicField(this, "pages", []);
    this.$el = createElement(`<div class="atk-page-list"></div>`);
  }
  clearAll() {
    this.pages = [];
    this.$el.innerHTML = "";
  }
  importPages(pages) {
    this.pages.push(...pages);
    pages.forEach((page) => {
      const $page = this.renderPage(page);
      this.$el.append($page);
    });
  }
  renderPage(page) {
    const $page = createElement(`<div class="atk-page-item">
        <div class="atk-page-main">
          <div class="atk-title"></div>
          <div class="atk-sub"></div>
        </div>
        <div class="atk-page-actions">
          <div class="atk-item atk-edit-btn">
            <i class="atk-icon atk-icon-edit"></i>
          </div>
        </div>
      </div>`);
    const $main = $page.querySelector(".atk-page-main");
    const $title = $main.querySelector(".atk-title");
    const $sub = $main.querySelector(".atk-sub");
    const $editBtn = $page.querySelector(".atk-edit-btn");
    $title.innerText = page.title;
    $sub.innerText = page.url || page.key;
    $editBtn.onclick = () => this.showEditor(page, $page);
    return $page;
  }
  showEditor(page, $page) {
    this.closeEditor();
    this.$editor = createElement(`<div class="atk-page-edit-layer">
      <div class="atk-page-main-actions">
        <div class="atk-item atk-title-edit-btn">\u6807\u9898\u4FEE\u6539</div>
        <div class="atk-item atk-key-edit-btn">KEY \u53D8\u66F4</div>
        <div class="atk-item atk-admin-only-btn"></div>
      </div>
      <div class="atk-page-actions">
        <div class="atk-item atk-sync-btn">
          <i class="atk-icon atk-icon-sync"></i>
        </div>
        <div class="atk-item atk-del-btn">
          <i class="atk-icon atk-icon-del"></i>
        </div>
        <div class="atk-item atk-close-btn">
          <i class="atk-icon atk-icon-close"></i>
        </div>
      </div>
    </div>`);
    $page.prepend(this.$editor);
    const $titleEditBtn = this.$editor.querySelector(".atk-title-edit-btn");
    const $keyEditBtn = this.$editor.querySelector(".atk-key-edit-btn");
    const $adminOnlyBtn = this.$editor.querySelector(".atk-admin-only-btn");
    const $syncBtn = this.$editor.querySelector(".atk-sync-btn");
    const $delBtn = this.$editor.querySelector(".atk-del-btn");
    const $closeBtn = this.$editor.querySelector(".atk-close-btn");
    const showLoading$1 = () => {
      showLoading(this.$editor);
    };
    const hideLoading$1 = () => {
      hideLoading(this.$editor);
    };
    const showError = (msg) => {
      window.alert(msg);
    };
    $closeBtn.onclick = () => this.closeEditor();
    const openTextEditor = (key) => {
      const textEditor = new ItemTextEditor({
        initValue: page[key] || "",
        onYes: (val) => __async(this, null, function* () {
          showLoading(textEditor.$el);
          let p;
          try {
            p = yield new Api(this.ctx).pageEdit(__spreadProps(__spreadValues({}, page), { [key]: val }));
          } catch (err) {
            showError(`\u4FEE\u6539\u5931\u8D25\uFF1A${err.msg || "\u672A\u77E5\u9519\u8BEF"}`);
            console.error(err);
            return false;
          } finally {
            hideLoading(textEditor.$el);
          }
          $page.replaceWith(this.renderPage(p));
          return true;
        })
      });
      textEditor.appendTo(this.$editor);
    };
    $titleEditBtn.onclick = () => openTextEditor("title");
    $keyEditBtn.onclick = () => openTextEditor("key");
    const adminOnlyActionBtn = new ActionBtn({
      text: () => {
        $adminOnlyBtn.classList.remove("atk-green", "atk-yellow");
        $adminOnlyBtn.classList.add(!page.admin_only ? "atk-green" : "atk-yellow");
        return !page.admin_only ? "\u6240\u6709\u4EBA\u53EF\u8BC4" : "\u7BA1\u7406\u5458\u53EF\u8BC4";
      }
    }).appendTo($adminOnlyBtn);
    $adminOnlyBtn.onclick = () => __async(this, null, function* () {
      showLoading$1();
      let p;
      try {
        p = yield new Api(this.ctx).pageEdit(__spreadProps(__spreadValues({}, page), { admin_only: !page.admin_only }));
      } catch (err) {
        showError(`\u4FEE\u6539\u5931\u8D25\uFF1A${err.msg || "\u672A\u77E5\u9519\u8BEF"}`);
        console.log(err);
        return;
      } finally {
        hideLoading$1();
      }
      page.admin_only = p.admin_only;
      adminOnlyActionBtn.updateText();
    });
    $syncBtn.onclick = () => __async(this, null, function* () {
      showLoading$1();
      let p;
      try {
        p = yield new Api(this.ctx).pageFetch(page.id);
      } catch (err) {
        showError(`\u540C\u6B65\u5931\u8D25\uFF1A${err.msg || "\u672A\u77E5\u9519\u8BEF"}`);
        console.log(err);
        return;
      } finally {
        hideLoading$1();
      }
      $page.replaceWith(this.renderPage(p));
    });
    $delBtn.onclick = () => {
      const del = () => __async(this, null, function* () {
        showLoading$1();
        try {
          yield new Api(this.ctx).pageDel(page.key, page.site_name);
        } catch (err) {
          console.log(err);
          showError(`\u5220\u9664\u5931\u8D25 ${String(err)}`);
          return;
        } finally {
          hideLoading$1();
        }
        $page.remove();
      });
      if (window.confirm(`\u786E\u8BA4\u5220\u9664\u9875\u9762 "${page.title || page.key}"\uFF1F\u5C06\u4F1A\u5220\u9664\u6240\u6709\u76F8\u5173\u6570\u636E`))
        del();
    };
  }
  closeEditor() {
    if (!this.$editor)
      return;
    this.$editor.remove();
  }
}
const PAGE_SIZE = 20;
class PagesView extends SidebarView {
  constructor() {
    super(...arguments);
    __publicField(this, "viewTabs", {});
    __publicField(this, "viewActiveTab", "");
    __publicField(this, "pageList");
    __publicField(this, "pagination");
  }
  mount(siteName) {
    if (!this.pageList) {
      this.pageList = new PageList(this.ctx);
      this.$el.append(this.pageList.$el);
    }
    this.switchTab(this.viewActiveTab, siteName);
  }
  switchTab(tab, siteName) {
    this.reqPages(siteName, 0);
  }
  reqPages(siteName, offset) {
    return __async(this, null, function* () {
      var _a;
      this.pageList.clearAll();
      (_a = this.$el.parentNode) == null ? void 0 : _a.scrollTo(0, 0);
      showLoading(this.$el);
      const data = yield new Api(this.ctx).pageGet(siteName, offset, PAGE_SIZE);
      this.pageList.importPages(data.pages || []);
      hideLoading(this.$el);
      if (!this.pagination) {
        this.pagination = new Pagination(data.total, {
          pageSize: PAGE_SIZE,
          onChange: (o) => {
            this.reqPages(siteName, o);
          }
        });
        this.$el.append(this.pagination.$el);
      }
      if (this.pagination && offset === 0)
        this.pagination.update(offset, data.total);
    });
  }
}
__publicField(PagesView, "viewName", "pages");
__publicField(PagesView, "viewTitle", "\u9875\u9762");
__publicField(PagesView, "viewAdminOnly", true);
var siteList = "";
class SiteList extends Component {
  constructor(ctx) {
    super(ctx);
    __publicField(this, "sites", []);
    __publicField(this, "$header");
    __publicField(this, "$headerTitle");
    __publicField(this, "$headerActions");
    __publicField(this, "$rowsWrap");
    __publicField(this, "$editor");
    __publicField(this, "activeSite", "");
    __publicField(this, "$add");
    this.$el = createElement(`<div class="atk-site-list">
      <div class="atk-header">
        <div class="atk-title"></div>
        <div class="atk-actions">
          <div class="atk-item atk-site-add-btn"><i class="atk-icon atk-icon-plus"></i></div>
        </div>
      </div>
      <div class="atk-site-rows-wrap"></div>
    </div>`);
    this.$header = this.$el.querySelector(".atk-header");
    this.$headerTitle = this.$header.querySelector(".atk-title");
    this.$headerActions = this.$header.querySelector(".atk-actions");
    this.$rowsWrap = this.$el.querySelector(".atk-site-rows-wrap");
    this.$headerTitle.innerText = `\u5171 0 \u4E2A\u7AD9\u70B9`;
    const $addBtn = this.$headerActions.querySelector(".atk-site-add-btn");
    $addBtn.onclick = () => {
      this.closeEditor();
      this.showAdd();
    };
  }
  loadSites(sites) {
    this.sites = sites;
    this.activeSite = "";
    this.$rowsWrap.innerHTML = "";
    this.$headerTitle.innerText = `\u5171 0 \u4E2A\u7AD9\u70B9`;
    let $row;
    for (let i = 0; i < sites.length; i++) {
      const site = sites[i];
      if (i % 4 === 0) {
        $row = createElement('<div class="atk-site-row">');
        this.$rowsWrap.append($row);
      }
      const $site = this.renderSite(site, $row);
      $row.append($site);
    }
    this.$headerTitle.innerText = `\u5171 ${sites.length} \u4E2A\u7AD9\u70B9`;
  }
  renderSite(site, $row) {
    const $site = createElement(`<div class="atk-site-item">
        <div class="atk-site-logo"></div>
        <div class="atk-site-name"></div>
      </div>`);
    const $siteLogo = $site.querySelector(".atk-site-logo");
    const $siteName = $site.querySelector(".atk-site-name");
    const setActive = () => {
      $site.classList.add("atk-active");
    };
    $siteLogo.innerText = site.name.substr(0, 1);
    $siteName.innerText = site.name;
    $site.onclick = () => {
      this.closeEditor();
      this.closeAdd();
      setActive();
      this.showEditor(site, $site, $row);
    };
    if (this.activeSite === site.name) {
      setActive();
    }
    return $site;
  }
  showEditor(site, $site, $row) {
    this.activeSite = site.name;
    this.$editor = createElement(`
    <div class="atk-site-edit">
    <div class="atk-header">
      <div class="atk-site-info">
        <span class="atk-site-name"></span>
        <span class="atk-site-urls"></span>
      </div>
      <div class="atk-close-btn">
        <i class="atk-icon atk-icon-close"></i>
      </div>
    </div>
    <div class="atk-main">
      <div class="atk-site-text-actions">
        <div class="atk-item atk-rename-btn">\u91CD\u547D\u540D</div>
        <div class="atk-item atk-edit-url-btn">\u4FEE\u6539 URL</div>
        <!--<div class="atk-item atk-export-btn">\u5BFC\u51FA</div>
        <div class="atk-item atk-import-btn">\u5BFC\u5165</div>-->
      </div>
      <div class="atk-site-btn-actions">
        <div class="atk-item atk-del-btn">
          <i class="atk-icon atk-icon-del"></i>
        </div>
      </div>
    </div>
    </div>`);
    $row.before(this.$editor);
    const $siteName = this.$editor.querySelector(".atk-site-name");
    const $siteUrls = this.$editor.querySelector(".atk-site-urls");
    const $closeBtn = this.$editor.querySelector(".atk-close-btn");
    $closeBtn.onclick = () => this.closeEditor();
    const update = (s) => {
      var _a;
      site = s;
      $siteName.innerText = site.name;
      $siteName.onclick = () => {
        if (site.first_url)
          window.open(site.first_url);
      };
      $siteUrls.innerHTML = "";
      (_a = site.urls) == null ? void 0 : _a.forEach((u) => {
        const $item = createElement('<span class="atk-url-item"></span>');
        $siteUrls.append($item);
        $item.innerText = (u || "").replace(/\/$/, "");
        $item.onclick = () => {
          window.open(u);
        };
      });
    };
    update(site);
    const $main = this.$editor.querySelector(".atk-main");
    const $actions = this.$editor.querySelector(".atk-site-text-actions");
    const $renameBtn = $actions.querySelector(".atk-rename-btn");
    const $editUrlBtn = $actions.querySelector(".atk-edit-url-btn");
    const $delBtn = this.$editor.querySelector(".atk-del-btn");
    const showLoading$1 = () => {
      showLoading(this.$editor);
    };
    const hideLoading$1 = () => {
      hideLoading(this.$editor);
    };
    const showError = (msg) => {
      window.alert(msg);
    };
    const openTextEditor = (key) => {
      let initValue = site[key] || "";
      if (key === "urls")
        initValue = site.urls_raw || "";
      const textEditor = new ItemTextEditor({
        initValue,
        onYes: (val) => __async(this, null, function* () {
          showLoading(textEditor.$el);
          let s;
          try {
            s = yield new Api(this.ctx).siteEdit(__spreadProps(__spreadValues({}, site), { [key]: val }));
          } catch (err) {
            showError(`\u4FEE\u6539\u5931\u8D25\uFF1A${err.msg || "\u672A\u77E5\u9519\u8BEF"}`);
            console.error(err);
            return false;
          } finally {
            hideLoading(textEditor.$el);
          }
          $site.replaceWith(this.renderSite(s, $row));
          update(s);
          return true;
        })
      });
      textEditor.appendTo($main);
    };
    $renameBtn.onclick = () => openTextEditor("name");
    $editUrlBtn.onclick = () => openTextEditor("urls");
    $delBtn.onclick = () => {
      const del = () => __async(this, null, function* () {
        showLoading$1();
        try {
          yield new Api(this.ctx).siteDel(site.id, true);
        } catch (err) {
          console.log(err);
          showError(`\u5220\u9664\u5931\u8D25 ${String(err)}`);
          return;
        } finally {
          hideLoading$1();
        }
        this.closeEditor();
        $site.remove();
        this.sites = this.sites.filter((s) => s.name !== site.name);
      });
      if (window.confirm(`\u786E\u8BA4\u5220\u9664\u7AD9\u70B9 "${site.name}"\uFF1F\u5C06\u4F1A\u5220\u9664\u6240\u6709\u76F8\u5173\u6570\u636E`))
        del();
    };
  }
  closeEditor() {
    if (!this.$editor)
      return;
    this.$editor.remove();
    this.$rowsWrap.querySelectorAll(".atk-site-item").forEach((e) => e.classList.remove("atk-active"));
    this.activeSite = "";
  }
  showAdd() {
    this.closeAdd();
    this.$add = createElement(`
    <div class="atk-site-add">
    <div class="atk-header">
      <div class="atk-title">\u65B0\u589E\u7AD9\u70B9</div>
      <div class="atk-close-btn">
        <i class="atk-icon atk-icon-close"></i>
      </div>
    </div>
    <div class="atk-form">
      <input type="text" name="AtkSiteName" placeholder="\u7AD9\u70B9\u540D\u79F0" autocomplete="off">
      <input type="text" name="AtkSiteUrls" placeholder="\u7AD9\u70B9 URL\uFF08\u591A\u4E2A\u7528\u9017\u53F7\u9694\u5F00\uFF09" autocomplete="off">
      <button class="atk-btn" name="AtkSubmit">\u521B\u5EFA</button>
    </div>
    </div>`);
    this.$header.after(this.$add);
    const $closeBtn = this.$add.querySelector(".atk-close-btn");
    $closeBtn.onclick = () => this.closeAdd();
    const $siteName = this.$add.querySelector('[name="AtkSiteName"]');
    const $siteUrls = this.$add.querySelector('[name="AtkSiteUrls"]');
    const $submitBtn = this.$add.querySelector('[name="AtkSubmit"]');
    $submitBtn.onclick = () => __async(this, null, function* () {
      const siteName = $siteName.value.trim();
      const siteUrls = $siteUrls.value.trim();
      if (siteName === "") {
        $siteName.focus();
        return;
      }
      showLoading(this.$add);
      let s;
      try {
        s = yield new Api(this.ctx).siteAdd(siteName, siteUrls);
      } catch (err) {
        window.alert(`\u521B\u5EFA\u5931\u8D25\uFF1A${err.msg || ""}`);
        console.error(err);
        return;
      } finally {
        hideLoading(this.$add);
      }
      this.sites.push(s);
      this.loadSites(this.sites);
      this.closeAdd();
    });
    const keyDown = (evt) => {
      if (evt.key === "Enter") {
        $submitBtn.click();
      }
    };
    $siteName.onkeyup = (evt) => keyDown(evt);
    $siteUrls.onkeyup = (evt) => keyDown(evt);
  }
  closeAdd() {
    var _a;
    (_a = this.$add) == null ? void 0 : _a.remove();
  }
}
class SitesView extends SidebarView {
  constructor() {
    super(...arguments);
    __publicField(this, "viewTabs", {});
    __publicField(this, "viewActiveTab", "");
    __publicField(this, "siteList");
  }
  mount(siteName) {
    if (!this.siteList) {
      this.siteList = new SiteList(this.ctx);
      this.$el.append(this.siteList.$el);
    }
    this.reqSites();
  }
  switchTab(tab, siteName) {
    this.reqSites();
  }
  reqSites() {
    return __async(this, null, function* () {
      const sites = yield new Api(this.ctx).siteGet();
      this.siteList.loadSites(sites);
    });
  }
}
__publicField(SitesView, "viewName", "sites");
__publicField(SitesView, "viewTitle", "\u7AD9\u70B9");
__publicField(SitesView, "viewAdminOnly", true);
class TransferView extends SidebarView {
  constructor() {
    super(...arguments);
    __publicField(this, "\xDF");
    __publicField(this, "viewTabs", {
      "import": "\u5BFC\u5165",
      "export": "\u5BFC\u51FA"
    });
    __publicField(this, "viewActiveTab", "import");
  }
  mount(siteName) {
    this.switchTab("import", siteName);
  }
  switchTab(tab, siteName) {
    if (tab === "import") {
      this.initImport();
    } else if (tab === "export") {
      this.initExport();
      return false;
    }
    return true;
  }
  initImport() {
    this.$el.innerHTML = `<div class="atk-log-wrap" style="display: none;">
      <div class="atk-log-back-btn">\u8FD4\u56DE</div>
      <div class="atk-log"></div>
    </div>
    <div class="atk-form">
    <div class="atk-label">\u6570\u636E\u7C7B\u578B</div>
    <select name="AtkDataType">
      <option value="artrans">Artrans (\u6570\u636E\u884C\u56CA)</option>
      <option value="artalk_v1">Artalk v1 (PHP \u65E7\u7248)</option>
      <option value="typecho">Typecho</option>
      <option value="wordpress">WordPress</option>
      <option value="disqus">Disqus</option>
      <option value="commento">Commento</option>
      <option value="valine">Valine</option>
      <option value="twikoo">Twikoo</option>
    </select>
    <div class="atk-label atk-data-file-label">\u6570\u636E\u6587\u4EF6</div>
    <input type="file" name="AtkDataFile" accept="text/plain,.json">
    <div class="atk-label">\u76EE\u6807\u7AD9\u70B9\u540D</div>
    <input type="text" name="AtkSiteName" placeholder="\u8F93\u5165\u5185\u5BB9..." autocomplete="off">
    <div class="atk-label">\u76EE\u6807\u7AD9\u70B9 URL</div>
    <input type="text" name="AtkSiteURL" placeholder="\u8F93\u5165\u5185\u5BB9..." autocomplete="off">
    <div class="atk-label">\u542F\u52A8\u53C2\u6570\uFF08\u53EF\u9009\uFF09</div>
    <textarea name="AtkPayload"></textarea>
    <span class="atk-desc">\u542F\u52A8\u53C2\u6570\u67E5\u9605\uFF1A\u201C<a href="https://artalk.js.org/guide/transfer.html" target="_blank">\u6587\u6863 \xB7 \u6570\u636E\u642C\u5BB6</a>\u201D</span>
    <button class="atk-btn" name="AtkSubmit">\u5BFC\u5165</button>
    </div>`;
    const $form = this.$el.querySelector(".atk-form");
    const $dataType = $form.querySelector('[name="AtkDataType"]');
    const $dataFile = $form.querySelector('[name="AtkDataFile"]');
    const $dataFileLabel = $form.querySelector(".atk-data-file-label");
    const $siteName = $form.querySelector('[name="AtkSiteName"]');
    const $siteURL = $form.querySelector('[name="AtkSiteURL"]');
    const $payload = $form.querySelector('[name="AtkPayload"]');
    const $submitBtn = $form.querySelector('[name="AtkSubmit"]');
    const setError2 = (msg) => window.alert(msg);
    $dataType.onchange = () => {
      if (["typecho"].includes($dataType.value)) {
        $dataFile.style.display = "none";
        $dataFileLabel.style.display = "none";
      } else {
        $dataFile.style.display = "";
        $dataFileLabel.style.display = "";
      }
    };
    $submitBtn.onclick = () => {
      var _a;
      const dataType = $dataType.value.trim();
      const siteName = $siteName.value.trim();
      const siteURL = $siteURL.value.trim();
      const payload = $payload.value.trim();
      if (dataType === "") {
        setError2("\u8BF7\u9009\u62E9\u6570\u636E\u7C7B\u578B");
        return;
      }
      let rData = {};
      if (payload) {
        try {
          rData = JSON.parse(payload);
        } catch (err) {
          setError2(`Payload JSON \u683C\u5F0F\u6709\u8BEF\uFF1A${String(err)}`);
          return;
        }
        if (rData instanceof Object) {
          setError2(`Payload \u9700\u4E3A JSON \u5BF9\u8C61`);
          return;
        }
      }
      if (siteName)
        rData.t_name = siteName;
      if (siteURL)
        rData.t_url = siteURL;
      const createSession = (dataStr) => {
        const $logWrap = this.$el.querySelector(".atk-log-wrap");
        const $log = $logWrap.querySelector(".atk-log");
        const $backBtn = this.$el.querySelector(".atk-log-back-btn");
        $logWrap.style.display = "";
        $form.style.display = "none";
        $backBtn.onclick = () => {
          $logWrap.style.display = "none";
          $form.style.display = "";
        };
        if (dataStr)
          rData.json_data = dataStr;
        const frameName = `f_${+new Date()}`;
        const $frame = document.createElement("iframe");
        $frame.className = "atk-iframe";
        $frame.name = frameName;
        $log.innerHTML = "";
        $log.append($frame);
        const formParams = {
          type: dataType,
          payload: JSON.stringify(rData),
          token: this.ctx.user.data.token || ""
        };
        const $formTmp = document.createElement("form");
        $formTmp.style.display = "none";
        $formTmp.setAttribute("method", "post");
        $formTmp.setAttribute("action", `${this.ctx.conf.server}/admin/import`);
        $formTmp.setAttribute("target", frameName);
        Object.entries(formParams).forEach(([key, val]) => {
          const $inputTmp = document.createElement("input");
          $inputTmp.setAttribute("type", "hidden");
          $inputTmp.setAttribute("name", key);
          $inputTmp.value = val;
          $formTmp.appendChild($inputTmp);
        });
        $logWrap.append($formTmp);
        $formTmp.submit();
        $formTmp.remove();
      };
      const reader = new FileReader();
      reader.onload = () => {
        const data = String(reader.result);
        createSession(data);
      };
      if ((_a = $dataFile.files) == null ? void 0 : _a.length) {
        reader.readAsText($dataFile.files[0]);
      } else {
        createSession();
      }
    };
  }
  initExport() {
    return __async(this, null, function* () {
      showLoading(this.$el);
      try {
        const d = yield new Api(this.ctx).export();
        this.download(`artrans-${this.getYmdHisFilename()}.json`, d);
      } catch (err) {
        console.log(err);
        window.alert(`${String(err)}`);
        return;
      } finally {
        hideLoading(this.$el);
      }
    });
  }
  download(filename, text) {
    const el = document.createElement("a");
    el.setAttribute("href", `data:text/json;charset=utf-8,${encodeURIComponent(text)}`);
    el.setAttribute("download", filename);
    el.style.display = "none";
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  }
  getYmdHisFilename() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${year}${month}${day}-${hours}${padWithZeros(minutes, 2)}${padWithZeros(seconds, 2)}`;
  }
}
__publicField(TransferView, "viewName", "transfer");
__publicField(TransferView, "viewTitle", "\u8FC1\u79FB");
__publicField(TransferView, "viewAdminOnly", true);
class SiteListFloater {
  constructor(ctx, conf) {
    __publicField(this, "ctx");
    __publicField(this, "conf");
    __publicField(this, "$el");
    __publicField(this, "sites", []);
    __publicField(this, "$sites");
    __publicField(this, "outsideChecker");
    this.ctx = ctx;
    this.conf = conf;
    this.$el = createElement(`<div class="atk-site-list-floater" style="display: none;">
      <div class="atk-sites"></div>
    </div>`);
    this.$sites = this.$el.querySelector(".atk-sites");
  }
  load(selectedSite) {
    return __async(this, null, function* () {
      this.$sites.innerHTML = "";
      const renderSiteItem = (siteName, siteLogo, siteTarget, onclick) => {
        const $site = createElement(`<div class="atk-site-item">
          <div class="atk-site-logo"></div>
          <div class="atk-site-name"></div>
        </div>`);
        $site.onclick = !onclick ? () => this.switch(siteTarget || siteName) : () => onclick();
        $site.setAttribute("data-name", siteTarget || siteName);
        const $siteLogo = $site.querySelector(".atk-site-logo");
        const $siteName = $site.querySelector(".atk-site-name");
        $siteLogo.innerText = siteLogo;
        $siteName.innerText = siteName;
        if (selectedSite === (siteTarget || siteName))
          $site.classList.add("atk-active");
        this.$sites.append($site);
      };
      renderSiteItem("\u6240\u6709\u7AD9\u70B9", "_", "__ATK_SITE_ALL");
      const sites = yield new Api(this.ctx).siteGet();
      sites.forEach((site) => {
        renderSiteItem(site.name, site.name.substr(0, 1));
      });
      renderSiteItem("\u7AD9\u70B9\u7BA1\u7406", "+", "", () => {
        this.conf.onClickSitesViewBtn();
        this.hide();
      });
    });
  }
  switch(siteName) {
    if (this.conf.onSwitchSite(siteName) === false) {
      return;
    }
    this.$sites.querySelectorAll(".atk-site-item").forEach((e) => {
      if (e.getAttribute("data-name") !== siteName) {
        e.classList.remove("atk-active");
      } else {
        e.classList.add("atk-active");
      }
    });
    this.hide();
  }
  show($trigger) {
    this.$el.style.display = "";
    if ($trigger) {
      this.outsideChecker = (evt) => {
        const isClickInside = $trigger.contains(evt.target) || this.$el.contains(evt.target);
        if (!isClickInside) {
          this.hide();
        }
      };
      document.addEventListener("click", this.outsideChecker);
    }
  }
  hide() {
    this.$el.style.display = "none";
    if (this.outsideChecker)
      document.removeEventListener("click", this.outsideChecker);
  }
}
const DEFAULT_VIEW = "comments";
const REGISTER_VIEWS = [
  MessageView,
  PagesView,
  SitesView,
  TransferView
];
class Sidebar extends Component {
  constructor(ctx) {
    super(ctx);
    __publicField(this, "layer");
    __publicField(this, "$header");
    __publicField(this, "$headerMenu");
    __publicField(this, "$title");
    __publicField(this, "$avatar");
    __publicField(this, "$siteLogo");
    __publicField(this, "$closeBtn");
    __publicField(this, "$nav");
    __publicField(this, "$curtViewBtn");
    __publicField(this, "$curtViewBtnIcon");
    __publicField(this, "$curtViewBtnText");
    __publicField(this, "$navTabs");
    __publicField(this, "$navViews");
    __publicField(this, "$viewWrap");
    __publicField(this, "siteSwitcher");
    __publicField(this, "curtSite");
    __publicField(this, "curtView", DEFAULT_VIEW);
    __publicField(this, "curtTab");
    __publicField(this, "viewInstances", {});
    __publicField(this, "viewSwitcherShow", false);
    __publicField(this, "firstShow", true);
    this.$el = createElement(SidebarHTML);
    this.$header = this.$el.querySelector(".atk-sidebar-header");
    this.$headerMenu = this.$header.querySelector(".atk-menu");
    this.$title = this.$header.querySelector(".atk-sidebar-title");
    this.$avatar = this.$header.querySelector(".atk-avatar");
    this.$closeBtn = this.$header.querySelector(".atk-sidebar-close");
    this.$nav = this.$el.querySelector(".atk-sidebar-nav");
    this.$curtViewBtn = this.$nav.querySelector(".akt-curt-view-btn");
    this.$curtViewBtnIcon = this.$curtViewBtn.querySelector(".atk-icon");
    this.$curtViewBtnText = this.$curtViewBtn.querySelector(".atk-text");
    this.$navTabs = this.$nav.querySelector(".atk-tabs");
    this.$navViews = this.$nav.querySelector(".atk-views");
    this.$viewWrap = this.$el.querySelector(".atk-sidebar-view-wrap");
    this.initViewSwitcher();
    this.$closeBtn.onclick = () => {
      this.hide();
    };
    this.ctx.on("sidebar-show", () => this.show());
    this.ctx.on("sidebar-hide", () => this.hide());
    this.ctx.on("user-changed", () => {
      this.firstShow = true;
    });
  }
  get isAdmin() {
    return this.ctx.user.data.isAdmin;
  }
  get curtViewInstance() {
    return this.curtView ? this.viewInstances[this.curtView] : void 0;
  }
  initViewSwitcher() {
    this.$curtViewBtn.onclick = () => {
      this.toggleViewSwitcher();
    };
    this.$navViews.innerHTML = "";
    REGISTER_VIEWS.forEach((view) => {
      const $item = createElement(`<div class="atk-tab-item"></div>`);
      this.$navViews.append($item);
      $item.setAttribute("data-name", view.viewName);
      $item.innerText = view.viewTitle;
      if (view.viewName === this.curtView) {
        $item.classList.add("atk-active");
        this.$curtViewBtnText.innerText = view.viewTitle;
      }
      $item.onclick = () => {
        this.switchView(view.viewName);
        this.toggleViewSwitcher();
      };
    });
  }
  toggleViewSwitcher() {
    if (!this.viewSwitcherShow) {
      this.$navViews.style.display = "";
      this.$navTabs.style.display = "none";
      this.$curtViewBtnIcon.classList.add("atk-arrow");
    } else {
      this.$navViews.style.display = "none";
      this.$navTabs.style.display = "";
      this.$curtViewBtnIcon.classList.remove("atk-arrow");
    }
    this.viewSwitcherShow = !this.viewSwitcherShow;
  }
  show() {
    return __async(this, null, function* () {
      this.$el.style.transform = "";
      this.layer = new Layer(this.ctx, "sidebar", this.$el);
      this.layer.show();
      this.$viewWrap.scrollTo(0, 0);
      setTimeout(() => {
        this.$el.style.transform = "translate(0, 0)";
      }, 20);
      if (this.firstShow) {
        if (this.isAdmin) {
          this.$title.innerText = "\u63A7\u5236\u4E2D\u5FC3";
          this.$curtViewBtn.style.display = "";
          if (!this.siteSwitcher) {
            this.siteSwitcher = new SiteListFloater(this.ctx, {
              onSwitchSite: (siteName) => {
                this.switchSite(siteName);
              },
              onClickSitesViewBtn: () => {
                this.switchView("sites");
              }
            });
            this.$viewWrap.before(this.siteSwitcher.$el);
            this.$avatar.onclick = (evt) => {
              var _a;
              if (!this.isAdmin)
                return;
              (_a = this.siteSwitcher) == null ? void 0 : _a.show(evt.target);
            };
          }
          this.curtSite = this.conf.site;
          showLoading(this.$el);
          try {
            yield this.siteSwitcher.load(this.curtSite);
          } catch (err) {
            const $err = createElement(`<span>\u52A0\u8F7D\u5931\u8D25\uFF1A${err.msg || "\u7F51\u7EDC\u9519\u8BEF"}<br/></span>`);
            const $retryBtn = createElement('<span style="cursor:pointer;">\u70B9\u51FB\u91CD\u65B0\u83B7\u53D6</span>');
            $err.appendChild($retryBtn);
            $retryBtn.onclick = () => {
              setError(this.$el, null);
              this.show();
            };
            setError(this.$el, $err);
            return;
          } finally {
            hideLoading(this.$el);
          }
          this.$avatar.innerHTML = "";
          this.$siteLogo = createElement('<div class="atk-site-logo"></div>');
          this.$siteLogo.innerText = (this.curtSite || "").substr(0, 1);
          this.$avatar.append(this.$siteLogo);
        } else {
          this.$title.innerText = "\u901A\u77E5\u4E2D\u5FC3";
          this.$curtViewBtn.style.display = "none";
          this.curtSite = this.conf.site;
          const $avatarImg = document.createElement("img");
          $avatarImg.src = getGravatarURL(this.ctx, MD5(this.ctx.user.data.email.toLowerCase()));
          this.$avatar.innerHTML = "";
          this.$avatar.append($avatarImg);
        }
        this.switchView(DEFAULT_VIEW);
        this.firstShow = false;
      }
    });
  }
  hide() {
    var _a;
    this.$el.style.transform = "";
    (_a = this.layer) == null ? void 0 : _a.dispose();
  }
  switchView(viewName) {
    let view = this.viewInstances[viewName];
    if (!view) {
      const View = REGISTER_VIEWS.find((o) => o.viewName === viewName);
      view = new View(this.ctx, this.$viewWrap);
      this.viewInstances[viewName] = view;
    }
    view.mount(this.curtSite);
    this.curtView = viewName;
    this.curtTab = view.viewActiveTab;
    this.$curtViewBtnText.innerText = view.constructor.viewTitle;
    this.$navViews.querySelectorAll(".atk-tab-item").forEach((e) => {
      if (e.getAttribute("data-name") === viewName) {
        e.classList.add("atk-active");
      } else {
        e.classList.remove("atk-active");
      }
    });
    this.loadViewTabs(view);
    this.$viewWrap.innerHTML = "";
    this.$viewWrap.append(view.$el);
    this.$viewWrap.classList.forEach((c) => {
      if (c.startsWith("atk-view-name-"))
        this.$viewWrap.classList.remove(c);
    });
    this.$viewWrap.classList.add(`atk-view-name-${view.constructor.viewName}`);
  }
  loadViewTabs(view) {
    this.$navTabs.innerHTML = "";
    Object.entries(view.viewTabs).forEach(([tabName, label]) => {
      const $tab = createElement(`<div class="atk-tab-item"></div>`);
      this.$navTabs.append($tab);
      $tab.innerText = label;
      if (view.viewActiveTab === tabName)
        $tab.classList.add("atk-active");
      $tab.onclick = () => {
        if (view.switchTab(tabName, this.curtSite) === false) {
          return;
        }
        this.$navTabs.querySelectorAll(".atk-active").forEach((e) => e.classList.remove("atk-active"));
        $tab.classList.add("atk-active");
        this.curtTab = tabName;
      };
    });
  }
  switchSite(siteName) {
    this.curtSite = siteName;
    const curtView = this.curtViewInstance;
    curtView == null ? void 0 : curtView.switchTab(this.curtTab, siteName);
    if (this.$siteLogo)
      this.$siteLogo.innerText = this.curtSite.substr(0, 1);
  }
}
const _Artalk = class {
  constructor(customConf) {
    __publicField(this, "ctx");
    __publicField(this, "conf");
    __publicField(this, "$root");
    __publicField(this, "checkerLauncher");
    __publicField(this, "editor");
    __publicField(this, "list");
    __publicField(this, "sidebar");
    this.conf = __spreadValues(__spreadValues({}, _Artalk.defaults), customConf);
    this.conf.server = this.conf.server.replace(/\/$/, "");
    if (!this.conf.pageKey) {
      this.conf.pageKey = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
    }
    try {
      const $root = document.querySelector(this.conf.el);
      if (!$root)
        throw Error(`Sorry, target element "${this.conf.el}" was not found.`);
      this.$root = $root;
    } catch (e) {
      console.error(e);
      throw new Error("Please check your Artalk `el` config.");
    }
    this.ctx = new Context(this.$root, this.conf);
    this.$root.classList.add("artalk");
    this.$root.innerHTML = "";
    this.initDarkMode();
    this.checkerLauncher = new CheckerLauncher(this.ctx);
    this.editor = new Editor(this.ctx);
    this.$root.appendChild(this.editor.$el);
    this.list = new List(this.ctx);
    this.$root.appendChild(this.list.$el);
    this.sidebar = new Sidebar(this.ctx);
    this.$root.appendChild(this.sidebar.$el);
    this.list.reqComments();
    this.initEventBind();
  }
  initEventBind() {
    window.addEventListener("hashchange", () => {
      this.list.checkGoToCommentByUrlHash();
    });
    this.ctx.on("check-admin-show-el", () => {
      const items = [];
      this.$root.querySelectorAll(`[atk-only-admin-show]`).forEach((item) => items.push(item));
      const { $wrap: $layerWrap } = GetLayerWrap(this.ctx);
      if ($layerWrap)
        $layerWrap.querySelectorAll(`[atk-only-admin-show]`).forEach((item) => items.push(item));
      items.forEach(($item) => {
        if (this.ctx.user.data.isAdmin)
          $item.classList.remove("atk-hide");
        else
          $item.classList.add("atk-hide");
      });
    });
    this.ctx.on("user-changed", () => {
      this.ctx.trigger("check-admin-show-el");
      this.ctx.trigger("list-refresh-ui");
    });
  }
  reload() {
    this.list.reqComments();
  }
  initDarkMode() {
    const darkModeClassName = "atk-dark-mode";
    if (this.conf.darkMode) {
      this.$root.classList.add(darkModeClassName);
    } else {
      this.$root.classList.remove(darkModeClassName);
    }
    const { $wrap: $layerWrap } = GetLayerWrap(this.ctx);
    if ($layerWrap) {
      if (this.conf.darkMode) {
        $layerWrap.classList.add(darkModeClassName);
      } else {
        $layerWrap.classList.remove(darkModeClassName);
      }
    }
  }
  setDarkMode(darkMode) {
    this.ctx.conf.darkMode = darkMode;
    this.initDarkMode();
  }
  on(name, handler) {
    this.ctx.on(name, handler, "external");
  }
  off(name, handler) {
    this.ctx.off(name, handler, "external");
  }
  trigger(name, payload) {
    this.ctx.trigger(name, payload, "external");
  }
};
let Artalk = _Artalk;
__publicField(Artalk, "defaults", defaults$3);
export { Artalk as default };
