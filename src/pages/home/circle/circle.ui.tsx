import { CircleCoords, ITableSize } from "../home-page.model";

const drawCircles = (
  context: CanvasRenderingContext2D,
  tableSize: ITableSize,
  circles: CircleCoords[]
) => {
  const { width, height, x, y } = tableSize;
  const xEnd = x + width - 140;
  const yEnd = y + height - 140;

  for (let i = 1; i <= 16; i++) {
    const { x, y, radius } = getRandomCoordsCircle(xEnd, yEnd, tableSize, circles);
    const color = getRandomColor();
    drawCircle(context, x, y, radius, color, circles);
  }
};

const getRandomCoordsCircle = (
  xEnd: number,
  yEnd: number,
  tableSize: ITableSize,
  circles: CircleCoords[]
): CircleCoords => {
  const { x, y } = tableSize;

  const xArc: number = Math.floor(Math.random() * (xEnd - x) + x + 70);
  const yArc: number = Math.floor(Math.random() * (yEnd - y) + y + 70);
  const radius: number = Math.floor(Math.random() * (50 - 40) + 40);

  if (checkCollision(xArc, yArc, radius, circles)) {
    return getRandomCoordsCircle(xEnd, yEnd, tableSize, circles);
  }

  return {
    x: xArc,
    y: yArc,
    radius,
  };
};

const checkCollision = (
  xArc: number,
  yArc: number,
  radiusArc: number,
  circles: CircleCoords[]
): CircleCoords | undefined => {
  return circles.find((circle: CircleCoords) => {
    const { x, y, radius } = circle;
    if (
      Math.abs((x - xArc) * (x - xArc) + (y - yArc) * (y - yArc)) <
      (radius + radiusArc) * (radius + radiusArc)
    ) {
      return true;
    }
  });
};

const drawCircle = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  circles: CircleCoords[]
) => {
  const circle = new Path2D();
  context.fillStyle = color;
  context.beginPath();
  circle.arc(x, y, radius, 0, 2 * Math.PI);
  context.fill(circle);
  circles.push({ x, y, radius });
};

const getRandomColor = () =>
  "rgb(" +
  Math.round(Math.random() * 255) +
  "," +
  Math.round(Math.random() * 255) +
  "," +
  Math.round(Math.random() * 255) +
  ")";

export const circles = {
  drawCircles,
  checkCollision,
  drawCircle
};
