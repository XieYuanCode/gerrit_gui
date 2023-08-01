export const isMac = () => /macintosh|macintel/g.test(navigator.userAgent.toLowerCase())
export const isWin = () => /windows|win32|win64|wow32|wow64/g.test(navigator.userAgent.toLowerCase())