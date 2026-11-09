// Light, dark or the phone's own setting ("auto"). The visitor's choice is kept on their device under
// this key; with no choice the site follows the phone. `themeScript` runs in <head> before the page
// paints, so the right colours show from the first frame (no white flash at night).
export type ThemeChoice = "light" | "dark" | "auto";
export const themeKey = "theme";

export const themeScript = `(function(){var c;try{c=localStorage.getItem("${themeKey}")}catch(e){}var d=c==="dark"||(c!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light"})()`;
