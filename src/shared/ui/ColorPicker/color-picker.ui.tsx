import { useEffect, useRef } from "react";
import styles from './color-picker.module.css'

interface IColorPicker {
  setColor: (color: string) => void
}

export function ColorPicker({setColor}: IColorPicker) {
  const canvasStrip = useRef<HTMLCanvasElement>(null);
  let rgbaColor = "rgba(255,0,0,1)";

  function click(e: React.MouseEvent) {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const canvasStripEl = canvasStrip.current;
    const contextStrip = canvasStripEl?.getContext("2d");
    if(canvasStripEl && contextStrip) {
      const imageData = contextStrip.getImageData(x, y, 1, 1).data;
      rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
      setColor(rgbaColor)
    }
  }

  useEffect(() => {

    const canvasStripEl = canvasStrip.current;
    if (canvasStripEl) {
      const context = canvasStripEl?.getContext("2d");
      const width = canvasStripEl?.width;
      const height = canvasStripEl?.height;

      if (context) {
        context.rect(0, 0, width, height);
        const grd1 = context.createLinearGradient(0, 0, 0, height);
        grd1.addColorStop(0, "rgba(255, 0, 0, 1)");
        grd1.addColorStop(0.17, "rgba(255, 255, 0, 1)");
        grd1.addColorStop(0.51, "rgba(0, 255, 255, 1)");
        grd1.addColorStop(0.34, "rgba(0, 255, 0, 1)");
        grd1.addColorStop(0.68, "rgba(0, 0, 255, 1)");
        grd1.addColorStop(0.85, "rgba(255, 0, 255, 1)");
        grd1.addColorStop(1, "rgba(255, 0, 0, 1)");
        context.fillStyle = grd1;
        context.fill();
      }
    }
  });

  return (
    <div className={styles.wr}>
      <canvas
        ref={canvasStrip}
        height="150"
        width="30"
        onClick={click}
      ></canvas>
    </div>
  );
}
