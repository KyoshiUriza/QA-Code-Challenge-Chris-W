/**
 * Test data in one place, so an edge-case string is defined once and every
 * spec that needs it agrees on exactly which characters it contains.
 */

export const TODO = 'Buy Milk!';
export const TODO_2 = 'Buy Bread!';
export const TODO_3 = 'Walk the dog';

/** U+200B. Invisible, and `String.prototype.trim()` does not treat it as whitespace. */
export const ZERO_WIDTH_SPACE = '\u200B';

/** U+00A0, non-breaking space. Looks like a space and `trim()` does remove it. */
export const NBSP = '\u00A0';

export const AIRPLANE_EMOJI = '✈️';

/** An emoji plus a skin-tone modifier — one grapheme, several code points. */
export const DARK_SKIN_TONE_THUMB_UP = '👍🏿';

/** Right-to-left script, which renders in the opposite direction to the UI. */
export const RTL_TEXT = 'اشترِ الحليب';

/** Reads as HTML/JS if the app ever renders titles unescaped. */
export const XSS_ATTEMPT = '<img src=x onerror="alert(1)">';

/** A single unbroken word — nothing for the layout to wrap on. */
export const LONG_UNBROKEN_WORD = 'A'.repeat(300);

export const LONG_SENTENCE = 'Remember to '.repeat(40).trim();

export const LEADING_TRAILING_SPACES = '   Buy Eggs   ';
