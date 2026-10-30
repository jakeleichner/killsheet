const { useState, useEffect } = React;
// ── Text size (Appearance > Text size): every number font size in an inline style is scaled as React draws it, so
// one setting reaches every screen without a base size to change. Text inside SVG drawings (maps, the campaign
// board) keeps its size so it still fits. TEXT_SCALE is set by App before it draws; --ts scales the stylesheet's
// few sizes. ──
let TEXT_SCALE = 1;
const TEXT_SIZES = { normal: 1, large: 1.12, larger: 1.25 };
const SVG_TEXT = new Set(["text", "tspan", "textPath"]);
(() => {
  const make = React.createElement;
  React.createElement = function (type, props, ...children) {
    if (TEXT_SCALE !== 1 && props && props.style && typeof props.style.fontSize === "number" && !SVG_TEXT.has(type)) {
      props = { ...props, style: { ...props.style, fontSize: Math.round(props.style.fontSize * TEXT_SCALE * 2) / 2 } };
    }
    return make.call(this, type, props, ...children);
  };
})();

