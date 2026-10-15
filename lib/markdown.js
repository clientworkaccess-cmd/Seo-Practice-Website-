import { marked } from "marked";
marked.setOptions({ gfm: true, breaks: false });
export function renderMarkdown(md) { return marked.parse(md || ""); }
