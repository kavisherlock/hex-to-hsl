export const HEX_REGEX = /#(([0-9a-fA-F]{2}){3,4}|([0-9a-fA-F]){3,4})/g;
export const RGB_REGEX = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/g;
export const HSL_REGEX = /hsla?\((\d+),?\s*(\d+)\s*%,?\s*(\d+)\s*%(?:,?\s*(\d+(?:\.\d+)?))?\)/g;

export const hex2rgb = (color : string) : string => {
  if (color.length < 7) {
    color = color.split('').map(c => (c === '#' ? c : c + c)).join('');
  }

  const r  = parseInt(color.substring(1, 3), 16);
  const g  = parseInt(color.substring(3, 5), 16);
  const b  = parseInt(color.substring(5, 7), 16);
  let a;
  if (color.length > 7) {
    a  = parseInt(color.substring(7), 16) / 255.0;
  }
  const rgbColor = a ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;

  return rgbColor;
};

export const rgb2hsl = (color : string) : string => {
  const rgbRegex = new RegExp(RGB_REGEX);
  const colorMatches = rgbRegex.exec(color);
  if (colorMatches === null) {
    console.log('null matches');
    return color;
  }

  const r = parseInt(colorMatches[1], 0) / 255.0;
  const g = parseInt(colorMatches[2], 0) / 255.0;
  const b = parseInt(colorMatches[3], 0) / 255.0;
  const a = colorMatches[4];

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === min) {
    return a ? `hsla(0, 0%, ${Math.round(max * 100)}%, ${a})` : `hsl(0, 0%, ${Math.round(max * 100)}%)`;
  }

  let h = 0;
  let s = 0;
  let l = (max + min) / 2;
  const d = max - min;
  s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  if (max === r) {
    h = (g - b) / d + (g < b ? 6 : 0);
  } else if (max === g) {
    h = (b - r) / d + 2;
  } else {
    h = (r - g) / d + 4;
  }
  h *= 60;
  if (h < 0) {
    h += 360;
  }
  h = Math.round(h);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return a ? `hsla(${h}, ${s}%, ${l}%, ${a})` : `hsl(${h}, ${s}%, ${l}%)`;
};

export const hex2hsl = (color : string) : string => {
  return rgb2hsl(hex2rgb(color));
};

export const hslToHex = (color : string) : string => {
  const hslRegex = new RegExp(HSL_REGEX);
  const colorMatches = hslRegex.exec(color);
  if (colorMatches === null) {
    console.log('null matches');
    return color;
  }

  const h = parseInt(colorMatches[1]);
  const s = parseInt(colorMatches[2]);
  let l = parseInt(colorMatches[3]);
  const a = colorMatches[4] ? parseInt(colorMatches[4]) : null;

  l /= 100;
  const x = s * Math.min(l, 1 - l) / 100;
  const f = (n : number) => {
    const k = (n + h / 30) % 12;
    const color = l - x * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}${a ? a.toString(16) : ''}`;
};
