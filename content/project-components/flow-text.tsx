/** Keep the final phrase together when a paragraph reflows across screen sizes. */
export function FlowText({ text }: { text?: string }) {
  if (!text) return null;
  const words = text.trim().split(/\s+/);
  if (words.length < 3) return text;
  return <>{words.slice(0, -2).join(" ")} <span className="sentence-tail">{words.slice(-2).join(" ")}</span></>;
}
