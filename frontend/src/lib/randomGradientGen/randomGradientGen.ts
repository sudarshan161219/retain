export const getRandomColor = () =>
  "#" +
  Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("");

export const getRandomGradient = () =>
  `linear-gradient(${Math.floor(
    Math.random() * 360,
  )}deg, ${getRandomColor()}, ${getRandomColor()})`;
