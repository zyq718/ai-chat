/** 简易 Markdown 渲染器（无需外部依赖） */

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/** 渲染行内格式：`code`、**bold**、*italic* */
function renderInline(text: string): string {
  let result = escapeHtml(text);
  // 行内代码
  result = result.replace(
    /`([^`]+)`/g,
    '<code>$1</code>'
  );
  // 粗体
  result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // 斜体
  result = result.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return result;
}

/** 将 Markdown 文本渲染为 HTML */
export function renderMarkdown(md: string): string {
  if (!md) return "";
  const lines = md.split("\n");
  const html: string[] = [];
  let inCodeBlock = false;
  let codeLang = "";
  let codeContent: string[] = [];
  let inList = false;
  let listType: "ul" | "ol" | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 代码块
    if (line.trim().startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = line.trim().slice(3);
        codeContent = [];
      } else {
        const langLabel = codeLang
          ? `<div style="font-size:12px;color:#999;padding:4px 8px;border-bottom:1px solid #eee;">${escapeHtml(
              codeLang
            )}</div>`
          : "";
        html.push(
          `<pre>${langLabel}<code>${escapeHtml(
            codeContent.join("\n")
          )}</code></pre>`
        );
        inCodeBlock = false;
        codeLang = "";
        codeContent = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    // 空行
    if (line.trim() === "") {
      if (inList) {
        html.push(`</${listType}>`);
        inList = false;
        listType = null;
      }
      continue;
    }

    // 标题
    const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      if (inList) {
        html.push(`</${listType}>`);
        inList = false;
        listType = null;
      }
      const level = headingMatch[1].length;
      html.push(`<h${level}>${renderInline(headingMatch[2])}</h${level}>`);
      continue;
    }

    // 引用
    if (line.startsWith("> ")) {
      if (inList) {
        html.push(`</${listType}>`);
        inList = false;
        listType = null;
      }
      html.push(`<blockquote>${renderInline(line.slice(2))}</blockquote>`);
      continue;
    }

    // 分割线
    if (line.trim() === "---" || line.trim() === "***") {
      if (inList) {
        html.push(`</${listType}>`);
        inList = false;
        listType = null;
      }
      html.push("<hr/>");
      continue;
    }

    // 有序列表
    const olMatch = line.match(/^\d+\.\s+(.+)/);
    if (olMatch) {
      if (!inList || listType !== "ol") {
        if (inList) html.push(`</${listType}>`);
        html.push("<ol>");
        inList = true;
        listType = "ol";
      }
      html.push(`<li>${renderInline(olMatch[1])}</li>`);
      continue;
    }

    // 无序列表
    const ulMatch = line.match(/^[-*]\s+(.+)/);
    if (ulMatch) {
      if (!inList || listType !== "ul") {
        if (inList) html.push(`</${listType}>`);
        html.push("<ul>");
        inList = true;
        listType = "ul";
      }
      html.push(`<li>${renderInline(ulMatch[1])}</li>`);
      continue;
    }

    // 普通段落
    if (inList) {
      html.push(`</${listType}>`);
      inList = false;
      listType = null;
    }
    html.push(`<p>${renderInline(line)}</p>`);
  }

  // 收尾
  if (inCodeBlock) {
    html.push(
      `<pre><code>${escapeHtml(codeContent.join("\n"))}</code></pre>`
    );
  }
  if (inList) {
    html.push(`</${listType}>`);
  }

  return html.join("\n");
}
