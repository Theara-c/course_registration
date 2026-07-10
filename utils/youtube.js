// utils/youtube.js
// Turns whatever a lecturer pastes (full URL, share link, or a bare ID)
// into the clean 11-character YouTube video ID our DB/embeds expect.
// Returns null if nothing usable was found.

export function extractYouTubeId(input) {
  if (!input) return null;
  const value = input.trim();
  if (!value) return null;

  // Already looks like a bare 11-char YouTube ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;

  // Standard watch / share / embed URL formats
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = value.match(regExp);
  if (match && match[2] && match[2].length === 11) return match[2];

  return null;
}
