import { ITableSize } from "../../pages/home/home-page.model";

const drawBilliardTable = (context: CanvasRenderingContext2D, tableSize: ITableSize) => {
  const { width, height, x, y } = tableSize;
  context.fillStyle = "green";
  context.fillRect(x, y, width, height);
};

export const billiardTable = {
  drawBilliardTable
}