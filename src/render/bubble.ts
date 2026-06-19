export function renderSpeechBubble(reply: string): string {
  const safeReply = escapeXml(reply).slice(0, 18);

  return `<g class="bubble">
      <rect x="12" y="3" width="56" height="12" rx="2" class="thin"/>
      <path d="M34 15l4 4l2-4" class="fill"/>
      <text x="16" y="11">${safeReply}</text>
    </g>`;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
