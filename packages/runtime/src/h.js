import { withoutNulls } from "./utils/arrays";

export const DOM_TYPES = {
  TEXT: "text",
  ELEMENT: "element",
  FRAGMENT: "fragment",
};

export function hString(str) {
  return {
    type: DOM_TYPES.TEXT,
    value: str,
  };
}

export function hFragment(children = []) {
  return {
    children: mapTextNodes(withoutNulls(children)),
    type: DOM_TYPES.FRAGMENT,
  };
}

// The name h() is short for hyperscript, a script that creates hypertext
export function h(tag, props = {}, children = []) {
  return {
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
    type: DOM_TYPES.ELEMENT,
  };
}

function mapTextNodes(children) {
  return children.map((child) =>
    typeof child === "string" ? hString(child) : child
  );
}
