import { billiardTable } from "..";
import { ITableSize } from "../../pages/home/home-page.model";
import { BallCoords } from "./balls.model";

const drawBalls = (
  context: CanvasRenderingContext2D,
  tableSize: ITableSize,
  balls: BallCoords[]
) => {
  const { width, height, x, y } = tableSize;
  const xEnd = x + width - 140;
  const yEnd = y + height - 140;

  for (let i = 1; i <= 16; i++) {
    const { x, y, dx, dy, radius } = getRandomCoordsBall(
      xEnd,
      yEnd,
      tableSize,
      balls
    );
    const color = getRandomColor();
    balls.push({ id: i, x, y, dx, dy, radius, color });
    drawBall(context, x, y, radius, color);
  }
};

const getRandomCoordsBall = (
  xEnd: number,
  yEnd: number,
  tableSize: ITableSize,
  balls: BallCoords[]
): Omit<BallCoords, "color" | "id"> => {
  const { x, y } = tableSize;

  const xArc: number = Math.floor(Math.random() * (xEnd - x) + x + 70);
  const yArc: number = Math.floor(Math.random() * (yEnd - y) + y + 70);
  const radius: number = Math.floor(Math.random() * (50 - 40) + 40);

  if (checkCollision(xArc, yArc, radius, balls)) {
    return getRandomCoordsBall(xEnd, yEnd, tableSize, balls);
  }

  return {
    x: xArc,
    y: yArc,
    dx: 0,
    dy: 0,
    radius,
  };
};

const checkCollision = (
  xArc: number,
  yArc: number,
  radiusArc: number,
  balls: BallCoords[]
): BallCoords | undefined => {
  return balls.find((ball: BallCoords) => {
    const { x, y, radius } = ball;
    if (
      Math.abs((x - xArc) * (x - xArc) + (y - yArc) * (y - yArc)) <
      (radius + radiusArc) * (radius + radiusArc)
    ) {
      return true;
    }
  });
};

const drawBall = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
) => {
  context.beginPath();
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.fill();
  context.closePath();
};

const getRandomColor = () =>
  "rgb(" +
  Math.round(Math.random() * 255) +
  "," +
  Math.round(Math.random() * 255) +
  "," +
  Math.round(Math.random() * 255) +
  ")";

const update = (
  ball: BallCoords,
  ctx: CanvasRenderingContext2D,
  tableSize: ITableSize
) => {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if ( ball.x + ball.radius > tableSize.width - 10 || ball.x - ball.radius < 50) {
    ball.dx = -ball.dx / 1.5;
  }

  if (ball.y + ball.radius > tableSize.height - 10 || ball.y - ball.radius < 60) {
    ball.dy = -ball.dy / 1.5;
  }

  drawBall(ctx, ball.x, ball.y, ball.radius, ball.color);
};

function animate(
  tableSize: ITableSize,
  ctx: CanvasRenderingContext2D,
  balls: BallCoords[]
) {
  if (ctx) {
    requestAnimationFrame(() => animate(tableSize, ctx, balls));
    ctx.clearRect(0, 0, tableSize.width, tableSize.height);
    billiardTable.drawBilliardTable(ctx, tableSize);

    balls.forEach((ball) => {
      update(ball, ctx, tableSize);

      balls.forEach((otherBall) => {
        if (ball !== otherBall) {
          const dx = otherBall.x - ball.x;
          const dy = otherBall.y - ball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < ball.radius + otherBall.radius) {
            const angle = Math.atan2(dy, dx);
            const targetX =
              ball.x + Math.cos(angle) * (ball.radius + otherBall.radius);
            const targetY =
              ball.y + Math.sin(angle) * (ball.radius + otherBall.radius);
            const ax = (targetX - otherBall.x) * 0.1;
            const ay = (targetY - otherBall.y) * 0.1;

            ball.dx -= ax;
            ball.dy -= ay;
            otherBall.dx += ax;
            otherBall.dy += ay;
          }
        }
      });

      if (
        ball.x - ball.radius <= 0 ||
        ball.x + ball.radius >= tableSize.width
      ) {
        ball.dx = -ball.dx * -1;
      }

      if (
        ball.y - ball.radius <= 0 ||
        ball.y + ball.radius >= tableSize.height
      ) {
        ball.dy = -ball.dy * -1;
      }
    });
  }
}

export const balls = {
  drawBalls,
  checkCollision,
  drawBall,
  animate,
};
