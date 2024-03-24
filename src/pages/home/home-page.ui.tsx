import { useEffect, useRef, useState } from "react";
import { useScreenSize } from "../../shared/hooks/useScreenSize";
import { CircleCoords } from "./home-page.model";
import { ColorPicker } from "../../shared/ui/ColorPicker";

export const HomePage = () => {
  const screenSize = useScreenSize();
  const ref = useRef<HTMLCanvasElement>(null);
  const { width, height } = screenSize;
  const circles: CircleCoords[] = [];
  const [color, setColor] = useState<string>('');

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
    const xEnd = x + width - 140;
    const yEnd = y + height - 140;

    for (let i = 1; i <= 16; i++) {
      const { x, y, radius } = getRandomCoordsCircle(xEnd, yEnd);
      const color =
        "rgb(" +
        Math.round(Math.random() * 255) +
        "," +
        Math.round(Math.random() * 255) +
        "," +
        Math.round(Math.random() * 255) +
        ")";
      drawCircle(context, x, y, radius, color);
    }
  };

  const getRandomCoordsCircle = (xEnd: number, yEnd: number): CircleCoords => {
    const { x, y } = tableSize;

    const xArc: number = Math.floor(Math.random() * (xEnd - x) + x + 70);
    const yArc: number = Math.floor(Math.random() * (yEnd - y) + y + 70);
    const radius: number = Math.floor(Math.random() * (50 - 40) + 40);

    if (checkCollision(xArc, yArc, radius)) {
      return getRandomCoordsCircle(xEnd, yEnd);
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
    radiusArc: number
  ): boolean => {
    return circles.some((circle) => {
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
    color: string
  ) => {
    const circle = new Path2D();
    context.fillStyle = color;
    context.beginPath();
    circle.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill(circle);
    circles.push({ x, y, radius });
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

  const onClickCanvas = (event: { clientX: any; clientY: any }) => {
    if (checkCollision(event.clientX, event.clientY, 0)) {
      
    }
  };

  return (
    <>
      <canvas ref={ref} onClick={onClickCanvas} />
      <ColorPicker setColor={setColor} />
    </>
  );
};
