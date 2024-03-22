import { useEffect, useRef } from "react";
import { useScreenSize } from "../../shared/hooks/useScreenSize";

export const HomePage = () => {
  const screenSize = useScreenSize();
  const ref = useRef<HTMLCanvasElement>(null);

  const draw = (context: CanvasRenderingContext2D) => {
    context.fillStyle = "green";
    const { width, height } = screenSize;
    context.fillRect(40, 40, width - 100, height - 100);
  };

  useEffect(() => {
    const { width, height } = screenSize;
    const canvas = ref.current;
    if (canvas) {
      canvas.width = width - 50;
      canvas.height = height - 50;
      const context = canvas?.getContext("2d");
      if (context) draw(context);
    }
  });

  return <canvas ref={ref} />;
};
