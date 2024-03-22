import { useEffect, useRef } from "react";
import { useScreenSize } from "../../shared/hooks/useScreenSize";

export const HomePage = () => {
  const screenSize = useScreenSize();
  const ref = useRef<HTMLCanvasElement>(null);
  const { width, height } = screenSize;

  const tableSize = {
    width: width - 100,
    height: height - 100,
    x: 40,
    y: 40,
  };

  const drawBilliardTable = (context: CanvasRenderingContext2D) => {
    const { width, height, x, y } = tableSize;
    context.fillStyle = "green";
    context.fillRect(x, y, width, height);
  };

  const drawCircles = (context: CanvasRenderingContext2D) => {
    const { width, height, x, y } = tableSize;
    const xEnd = x + width - 80;
    const yEnd = y + height - 80;

    for (let i = 1; i <= 16; i++) {
      const xArc = Math.floor(Math.random() * (xEnd - x) + x + 40);
      const yArc = Math.floor(Math.random() * (yEnd - y) + y + 40);
      const color =
        "rgb(" +
        Math.round(Math.random() * 255) +
        "," +
        Math.round(Math.random() * 255) +
        "," +
        Math.round(Math.random() * 255) +
        ")";
      drawCircle(context, xArc, yArc, color);
    }
  };

  const drawCircle = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string
  ) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, 50, 0, 2 * Math.PI);
    context.fill();
  };

  useEffect(() => {
    const canvas = ref.current;
    if (canvas) {
      canvas.width = width - 50;
      canvas.height = height - 50;
      const context = canvas.getContext("2d");
      if (context) {
        drawBilliardTable(context);
        drawCircles(context);
      }
    }
  });

  return <canvas ref={ref} />;
};
