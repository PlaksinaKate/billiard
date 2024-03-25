import { memo, useEffect, useRef, useState } from "react";
import { useScreenSize } from "../../shared/hooks/useScreenSize";
import { CircleCoords, ITableSize } from "./home-page.model";
import { ColorPicker } from "../../shared/ui/ColorPicker";
import { circles } from "./circle";

export const HomePage = memo(() => {
  const screenSize = useScreenSize();
  const ref = useRef<HTMLCanvasElement>(null);
  const { width, height } = screenSize;
  let [circlesArray] = useState<CircleCoords[]>([]);
  const [color, setColor] = useState<string>("");
  let [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [clickedCircle, setClickedCircle] = useState<CircleCoords>({
    x: 0,
    y: 0,
    radius: 0,
  });

  const tableSize: ITableSize = {
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

  useEffect(() => {
    const canvas = ref.current;
    if (canvas) {
      canvas.width = width - 50;
      canvas.height = height - 50;
      const context = canvas.getContext("2d");
      if (context) {
        drawBilliardTable(context);
        circles.drawCircles(context, tableSize, circlesArray);
      }
    }
  }, []);

  const onClickCanvas = (event: { clientX: number; clientY: number }) => {
    const circle = circles.checkCollision(event.clientX, event.clientY, 0, circlesArray);
    if (circle) {
      circlesArray = circlesArray.filter((c) => c !== circle);
      setClickedCircle(circle);
      setShowColorPicker(true);
    }
  };

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    const { x, y, radius } = clickedCircle;
    if (context) {
      circles.drawCircle(context, x, y, radius, color, circlesArray);
    }
  }, [color]);

  return (
    <>
      <canvas ref={ref} onClick={onClickCanvas} />
      {showColorPicker && <ColorPicker setColor={setColor} />}
    </>
  );
});
