export const lineBreak = (text: string) => text.replace(/\\n/g, '\n');

export function ellipsize(text: string, size: number) {
  if (text.length < size) {
    return text;
  }

  return `${text.substring(0, size)}...`;
}

export function regexUrl(url?: string) {
  const regex =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

  if (url) {
    return regex.test(url);
  }

  return false;
}
