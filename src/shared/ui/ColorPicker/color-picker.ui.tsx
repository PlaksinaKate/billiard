import { useEffect, useRef } from "react";
import styles from './color-picker.module.css'

interface IColorPicker {
  setColor: (color: string) => void
}

export function ColorPicker({setColor}: IColorPicker) {
  const canvasBlock = useRef<HTMLCanvasElement>(null);
  const canvasStrip = useRef<HTMLCanvasElement>(null);
  let rgbaColor = "rgba(255,0,0,1)";
  let drag = false;

  function fillGradient() {
    const canvasBlockEl = canvasBlock.current;
    const canvasStripEl = canvasStrip.current;

    if (canvasBlockEl && canvasStripEl) {
      const ctx = canvasBlockEl.getContext("2d");
      const contextStrip = canvasStripEl.getContext("2d");
      const widthBlock = canvasBlockEl.width;
      const heightBlock = canvasBlockEl.height;

      if (ctx && contextStrip) {
        ctx.fillStyle = rgbaColor;
        ctx.fillRect(0, 0, widthBlock, heightBlock);

        var grdWhite = contextStrip.createLinearGradient(0, 0, widthBlock, 0);
        grdWhite.addColorStop(0, "rgba(255,255,255,1)");
        grdWhite.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grdWhite;
        ctx.fillRect(0, 0, widthBlock, heightBlock);

        var grdBlack = contextStrip.createLinearGradient(0, 0, 0, heightBlock);
        grdBlack.addColorStop(0, "rgba(0,0,0,0)");
        grdBlack.addColorStop(1, "rgba(0,0,0,1)");
        ctx.fillStyle = grdBlack;
        ctx.fillRect(0, 0, widthBlock, heightBlock);
      }
    }
  }

  function mousedown(e: React.MouseEvent) {
    drag = true;
    changeColor(e);
  }

  function mousemove(e: React.MouseEvent) {
    if (drag) {
      changeColor(e);
    }
  }

  function mouseup() {
    drag = false;
  }

  function click(e: React.MouseEvent) {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const canvasStripEl = canvasStrip.current;
    const contextStrip = canvasStripEl?.getContext("2d");
    if(canvasStripEl && contextStrip) {
      const imageData = contextStrip.getImageData(x, y, 1, 1).data;
      rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
      fillGradient();
      setColor(rgbaColor)
    }
  }

  function changeColor(e: React.MouseEvent) {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const canvasBlockEl = canvasBlock.current;
    const contextBlock = canvasBlockEl?.getContext("2d");
    if(canvasBlockEl && contextBlock) {
      const imageData = contextBlock.getImageData(x, y, 1, 1).data;
      rgbaColor = "rgba(" + imageData[0] + "," + imageData[1] + "," + imageData[2] + ",1)";
    }
    
  }

  useEffect(() => {
    const canvasBlockEl = canvasBlock.current;
    if (canvasBlockEl) {
      const ctx1 = canvasBlockEl?.getContext("2d");
      const widthBlock = canvasBlockEl?.width;
      const heightBlock = canvasBlockEl?.height;

      ctx1?.rect(0, 0, widthBlock, heightBlock);
      fillGradient();
    }

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
        ref={canvasBlock}
        height="150"
        width="150"
        onMouseDown={mousedown}
        onMouseUp={mouseup}
        onMouseMove={mousemove}
      ></canvas>
      <canvas
        ref={canvasStrip}
        height="150"
        width="30"
        onClick={click}
      ></canvas>
    </div>
  );
}
