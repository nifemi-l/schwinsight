// Utility function to censor expletives in user quotes
export const censorExpletives = (text) =>
  text.replace(/\b(fudge|crud|darn|heck|shoot|dang|gosh|drat|crud|blimey|shucks|rats|phooey|baloney|bullocks|jeez|golly|gee)\b/gi, '****'); 