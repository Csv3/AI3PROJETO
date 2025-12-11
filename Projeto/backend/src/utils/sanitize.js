import xss from "xss";
export function sanitizeInput(obj) {
  if (!obj) return obj;
  if (typeof obj === "string") return xss(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeInput);
  if (typeof obj === "object") {
    const out = {};
    for (const k in obj) out[k] = sanitizeInput(obj[k]);
    return out;
  }
  return obj;
}
