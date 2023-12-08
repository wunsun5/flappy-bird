import { draw, animations } from './functions.js';
import { canvas, ctx, images } from './object.js';

const play = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    animations();
    requestAnimationFrame(play);
}

Promise.all(images.map(image => new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
}))).then(() => {
    play();
}).catch(error => {
    console.log('Gagal memuat gambar : ', error)
})