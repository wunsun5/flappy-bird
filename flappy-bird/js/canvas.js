const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 540;
canvas.height = 720;

document.body.append(canvas);

export { canvas, ctx };