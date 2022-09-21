export const lineBreak = (text: string) => text.replace(/\\n/g, '\n');

export function ellipsize(text: string, size: number) {
  if (text.length < size) {
    return text;
  }

  return `${text.substring(0, size)}...`;
}
