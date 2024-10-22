import type { TFile } from 'obsidian';
import { plug } from 'src/main';
import { getSetting } from 'src/settings';
import { FILENAME_KEY } from 'src/settings/structure';
import type { IconString } from '.';

type StringProperty = string | null | undefined;

/* NOTE: There is a new regex known as /\p{RGI_Emoji}/v that can do emojis that are made of more
than one emoji, but the `v` flag is not yet compatible */
const EMOJI_REGEX = /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]+/gu;
// regex to detect the Make.md "emoji//1f931" pattern
const EMOJI_CODE_REGEX = /^emoji\/\/([a-fA-F0-9]+)/;

// Detects 'lucide//' prefixed values followed by word characters
const LUCIDE_CODE_REGEX = /^lucide\/\/(\w+)/;

const HEADER_KEY_REGEX = /{{(.+?)}}/g;

export const extractIconFromYaml = (value: StringProperty): IconString | undefined => {
  if (!value) return undefined;

  const emojiCodeMatch = value.match(EMOJI_CODE_REGEX);
  if (emojiCodeMatch) {
    const emojiCode = emojiCodeMatch[1];
    try {
      const emoji = String.fromCodePoint(parseInt(emojiCode, 16));
      return { type: 'emoji', value: emoji };
    } catch (error) {
      console.error(`Invalid emoji code: ${emojiCode}`);
      return undefined;
    }
  }

  // Check for Lucide Icon
  const lucideCodeMatch = value.match(LUCIDE_CODE_REGEX);
  if (lucideCodeMatch && lucideCodeMatch[1]) {
    const lucideIconName = lucideCodeMatch[1];
    return { type: 'lucide', value: lucideIconName };
  }

  const match = value.match(EMOJI_REGEX);
  return match?.length
    ? { type: 'emoji', value: match.join('\u200d') }
    : { type: 'text', value: value.slice(0, 1) };
};

const parseHeader = (value: string, file: TFile): string => (
  value.replace(HEADER_KEY_REGEX, (match, keys: string) => {
    let parsed: StringProperty;
    for (const key of keys.split(',')) {
      if (parsed) break;

      const trimmedKey = key.trim();
      if (trimmedKey === FILENAME_KEY) {
        parsed = file.basename;
      } else {
        const property = plug.app.metadataCache.getFileCache(file)?.frontmatter?.[trimmedKey];
        parsed = Array.isArray(property) ? property[0] : property;
      }
    }
    return parsed || match;
  })
);

export const extractHeaderFromYaml = (value: StringProperty, file: TFile): string | undefined => {
  if (value === undefined) {
    return getSetting('useHeaderByDefault')
      ? parseHeader(getSetting('defaultHeaderValue'), file)
      : undefined;
  }
  if (value === null) return undefined;
  return parseHeader(value, file);
};