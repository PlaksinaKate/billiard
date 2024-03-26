import { useEffect, useRef, useState } from "react";
import { useScreenSize } from "../../shared/hooks/useScreenSize";
import { ITableSize } from "./home-page.model";
import { ColorPicker } from "../../shared/ui/ColorPicker";
import { billiardTable, balls } from "../../features";
import { BallCoords } from "../../features/balls/balls.model";

export const HomePage = () => {
  const screenSize = useScreenSize();
  const ref = useRef<HTMLCanvasElement>(null);
  const { width, height } = screenSize;
  let [ballArray] = useState<BallCoords[]>([]);
  const [color, setColor] = useState<string>("");
  let [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [clickedBall, setClickedBall] = useState<number>(0);
  const [moveBall, setMoveBall] = useState<boolean>(false);

  const tableSize: ITableSize = {
    width: width - 100,
    height: height - 100,
    x: 40,
    y: 40,
  };

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");

    if (canvas && context && ballArray.length === 0) {
      canvas.width = width - 50;
      canvas.height = height - 50;
      billiardTable.drawBilliardTable(context, tableSize);
      balls.drawBalls(context, tableSize, ballArray);
    }
  }, []);

  const onClickCanvas = (event: { clientX: number; clientY: number }) => {
    const ball = balls.checkCollision(
      event.clientX,
      event.clientY,
      0,
      ballArray
    );
    if (ball) {
      setClickedBall(ball.id);
      setShowColorPicker(true);
    }
  };

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (context) {
      ballArray.forEach((c) => {
        if (c.id === clickedBall) c.color = color;
      });
    }
  }, [color]);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (context && canvas && ballArray.length !== 0 && moveBall) {
      balls.animate(tableSize, context, ballArray);
    }
  }, [ballArray, moveBall]);

  const onMouseMove = (event: { clientX: number; clientY: number }) => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (ballArray.length !== 0) {
      const ball = balls.checkCollision(
        event.clientX,
        event.clientY,
        0,
        ballArray
      );

      if (canvas && ball && context) {
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;

        const dx = ball.x - mouseX;
        const dy = ball.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < ball.radius) {
          const angle = Math.atan2(dy, dx);
          ball.dx += Math.cos(angle) * 1;
          ball.dy += Math.sin(angle) * 1;
          ballArray.forEach((b) => {
            if (b.id === ball.id) {
              b.dx = ball.dx;
              b.dy = ball.dy;
            }
          });
          setMoveBall(true);
        }
      }
    }
  };

  return (
    <>
      <canvas ref={ref} onClick={onClickCanvas} onMouseMove={onMouseMove} />
      {showColorPicker && <ColorPicker setColor={setColor} />}
    </>
  );
};
