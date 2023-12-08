const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const derajat = Math.PI / 180;

canvas.width = 480;
canvas.height = 720;

const sprite = new Image();
sprite.src = 'img/sprite.png';

const backgroundImage = new Image();
backgroundImage.src = 'img/background.png';

const night = new Image();
night.src = 'img/night.jpeg';

const night_2 = new Image();
night_2.src = 'img/background_night.webp';

const birdYellow = new Image();
birdYellow.src = 'img/flappybird_yellow.png';

const pipeTop = new Image();
pipeTop.src = 'img/top_pipe.png';

const pipeBottom = new Image();
pipeBottom.src = 'img/bottom_pipe.png';

const newScore = new Image();
newScore.src = 'img/new.png';

const images = [night, night_2, pipeTop, pipeBottom];

// Suara
const Die = new Audio('audio/sfx_die.wav');
const Flap = new Audio('audio/sfx_flap.wav');
const Hit = new Audio('audio/sfx_hit.wav');
const Point = new Audio('audio/sfx_point.wav');
const Swooshing = new Audio('audio/sfx_swooshing.wav');
const Transition = new Audio('audio/sfx_transition.mp3');
const Score = new Audio('audio/sfx_score.mp3');
const BestScore = new Audio('audio/sfx_bestscore.wav');

// Background Game
const background = {
  sX: 0,
  sY: 0,
  sWidth: 275,
  sHeight: 226,

  dX: 0,
  dY: canvas.height,
  dWidth: 450,
  dHeight: 420,

  kecepatanAnimasi: 2.8,

  draw: function () {
    if (score.value >= 50 && score.value < 100) {
      ctx.drawImage(night, 0, 0, canvas.width - 80, canvas.height);
      ctx.drawImage(night, canvas.width - 90, 0, canvas.width, canvas.height);
    } else if (score.value >= 100) {
      ctx.drawImage(night_2, 0, 0, canvas.width - 80, canvas.height);
      ctx.drawImage(night_2, canvas.width - 90, 0, canvas.width, canvas.height);
    } else {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width - 80, canvas.height);
      ctx.drawImage(backgroundImage, canvas.width - 90, 0, canvas.width, canvas.height);
    }
  },
};

// land
const land = {
  sX: 276,
  sY: 0,
  sWidth: 224,
  sHeight: 112,
  dX: 0,
  dY: canvas.height - 150,
  dWidth: 400,
  dHeight: 150,

  draw: function () {
    ctx.drawImage(sprite, this.sX, this.sY, this.sWidth, this.sHeight, this.dX, this.dY, this.dWidth, this.dHeight);
    ctx.drawImage(sprite, this.sX, this.sY, this.sWidth, this.sHeight, this.dX + this.dWidth - 2, this.dY, this.dWidth, this.dHeight);
  },

  landAnimation: function () {
    if (state.play) {
      this.dX = (this.dX - background.kecepatanAnimasi) % (400 / 2);
    }
  },
};

// Status Game
const state = {
  getReady: true,
  play: false,
  gameOver: false,

  clickHandler: (e) => {
    if (state.getReady) {
      state.getReady = false;
      state.play = true;
      Swooshing.play();
    } else if (state.play) {
      Flap.play();
      bird.fly();
    } else if (state.gameOver) {
      setTimeout(() => {
        restartButton.click(e);
      }, 1500)
    }
  },

  keydownHandler: (e) => {
    if (state.getReady && e.key == ' ') {
      state.getReady = false;
      state.play = true;
      Swooshing.play();
    } else if (state.play && e.key == ' ' || e.key == 'ArrowUp') {
      Flap.play();
      bird.fly();
    }
  }
};

// Persiapan
const getReady = {
  sX: 0,
  sY: 228,
  sWidth: 173,
  sHeight: 152,
  dX: canvas.width,
  dY: 150,
  dWidth: 300,
  dHeight: 220,

  draw: function () {
    if (state.getReady) {
      ctx.drawImage(sprite, this.sX, this.sY, this.sWidth, this.sHeight, this.dX / 2 - this.dWidth / 2, this.dY, this.dWidth, this.dHeight);
    }
  },
};

// Game Berakhir
const gameOver = {
  sX: 175,
  sY: 228,
  sWidth: 225,
  sHeight: 202,
  dX: canvas.width,
  dY: 150,
  dWidth: 320,
  dHeight: 280,

  draw: function () {
    if (state.gameOver) {
      ctx.drawImage(sprite, this.sX, this.sY, this.sWidth, this.sHeight, this.dX / 2 - this.dWidth / 2, this.dY, this.dWidth, this.dHeight);
    }
  },
};

// Burung
const bird = {
  animation: [
    { sX: 0, sY: 0 },
    { sX: 0, sY: 25 },
    { sX: 0, sY: 52 },
    { sX: 0, sY: 25 },
  ],

  frames: 100,
  frame: 0,
  rotasi: 0 * derajat,

  speed: 0,
  gravity: 0.25,
  jump: 5,

  dX: 100,
  dY: 255,
  sWidth: 34,
  sHeight: 26,
  dWidth: 60,
  dHeight: 42,

  flyAnimation: function () {
    setTimeout(() => {
      if (this.frames % 5 == 0) ++this.frame;
      if (this.frame === 4) this.frame = 0;
      this.frames++;
    }, 1000);
  },

  draw: function () {
    let bird = this.animation[this.frame];
    ctx.save();
    ctx.translate(this.dX, this.dY);
    ctx.rotate(this.rotasi);
    ctx.drawImage(birdYellow, bird.sX, bird.sY, this.sWidth, this.sHeight, - this.dWidth / 2, - this.dHeight / 2, this.dWidth, this.dHeight);
    ctx.restore();
  },

  fall: function () {
    if (!state.getReady) {
      this.speed += this.gravity;
      this.dY += this.speed;

      if (this.speed >= this.jump) {
        this.rotasi = 90 * derajat;
      } else {
        this.rotasi = -25 * derajat;
      }

      if (this.dY + 42 >= canvas.height - 150) {
        this.dY = canvas.height - 150 - 42 / 2;
        if (state.play) Die.play();
        state.play = false;
        state.gameOver = true;
      }
    }
  },

  fly: function () {
    this.speed = - this.jump;
    if (this.dY <= 0 - bird.dHeight) this.dY = 0 - bird.dHeight;
  },
}

// Pipa
const pipe = {
  pipeTop: {
    sX: 553,
    sY: 0,
  },
  pipeBottom: {
    sX: 502,
    sY: 0,
  },

  kecepatanPipe: 2.8,
  maxYpos: -150,
  pipeLength: 3,
  sWidth: 53,
  sHeight: 400,
  dWidth: 100,
  dHeight: 400,
  jangkauanPipe: 200,
  passed: false,

  posisiPipes: [
    {
      dX: canvas.width,
      dY: Math.floor(- 150 * (Math.random() + 1)),
      birdFrame: 0,
    },
    {
      dX: canvas.width + 250,
      dY: Math.floor(- 150 * (Math.random() + 1)),
      birdFrame: 1,
    },
    {
      dX: canvas.width + 500,
      dY: Math.floor(- 150 * (Math.random() + 1)),
      birdFrame: 2,
    },
    {
      dX: canvas.width + 750,
      dY: Math.floor(- 150 * (Math.random() + 1)),
      birdFrame: 3,
    },
  ],

  pipeAnimation: function () {
    if (state.play) {
      if (this.posisiPipes.length < 4) {
        this.posisiPipes.push({
          dX: canvas.width + 410,
          dY: Math.floor(this.maxYpos * (Math.random() + 1)),
          birdFrame: bird.frames,
        })
      }
    }
  },

  draw: function () {
    if (!state.getReady) {

      let pipes = [];

      // Mengubah posisi pipe ke arah kiri
      this.posisiPipes.forEach(posisiPipe => {
        if (state.play) {
          posisiPipe.dX -= this.kecepatanPipe * 1;
        }
      })

      this.posisiPipes.forEach(posisiPipe => {
        if (posisiPipe.dX + 100 <= 0) {
          this.posisiPipes.shift();
        }
      })

      // Mengecek apakah ada pipe yang duplikat ?
      this.posisiPipes.forEach(posisiPipe => {
        if (!pipes.some(pipe => pipe.birdFrame === posisiPipe.birdFrame)) {
          pipes.push(posisiPipe);
        }
      });



      // Mengecek apakah burung menabrak pipa ?
      pipes.forEach(pipe => {
        let posisiPipe = pipe;
        let bottomPipeY = posisiPipe.dY + this.jangkauanPipe + this.dHeight;

        if (
          (bird.dX + 30 / 2 > posisiPipe.dX && bird.dX - 30 / 2 < posisiPipe.dX + this.dWidth
            && bird.dY + 42 / 2 > posisiPipe.dY && bird.dY - 42 / 2 < posisiPipe.dY + this.dHeight) ||
          (bird.dX + 30 / 2 > posisiPipe.dX && bird.dX - 30 / 2 < posisiPipe.dX + this.dWidth
            && bird.dY + 42 / 2 > bottomPipeY && bird.dY - 42 / 2 < bottomPipeY + this.dHeight)
        ) {
          if (state.play) Hit.play();
          state.play = false;
        }
      });

      // Mengambar Pipe
      pipes.forEach(posisiPipe => {

        let pipe = posisiPipe;
        let topYpos = posisiPipe.dY;
        let bottomYpos = posisiPipe.dY + this.dHeight + this.jangkauanPipe;

        // Mengecek apakah burung melewati celah pipa ?
        if (!this.passed && bird.dX > pipe.dX + this.dWidth) {
          // this.passedPipes.push(pipe);
          this.passed = true;
          score.value += 1;
          Point.load();
          Point.play();

          // Jika score berkelipatan 5 maka kecepatan bertambah 0.2
          if (score.value > 4 && score.value % 5 === 0) {
            background.kecepatanAnimasi += 0.2;
            this.kecepatanPipe += 0.2;
            console.log(this.kecepatanPipe / 2.4)
          }
        }

        if (bird.dX < pipes[0].dX) {
          this.passed = false;
        }

        if (score.value >= 100) {
          ctx.drawImage(pipeTop, pipe.dX, topYpos, this.dWidth, this.dHeight);
          ctx.drawImage(pipeBottom, pipe.dX, bottomYpos, this.dWidth, this.dHeight);
        } else {
          ctx.drawImage(sprite, this.pipeTop.sX, this.pipeTop.sY, this.sWidth, this.sHeight, pipe.dX, topYpos, this.dWidth, this.dHeight);
          ctx.drawImage(sprite, this.pipeBottom.sX, this.pipeBottom.sY, this.sWidth, this.sHeight, pipe.dX, bottomYpos, this.dWidth, this.dHeight);
        }
      })
    }
  }
}

// Medali
const medal = {
  allMedal: [
    { sX: 312, sY: 112 },
    { sX: 360, sY: 158 },
    { sX: 360, sY: 112 },
    { sX: 312, sY: 158 },
  ],

  medal: { sX: 310, sY: 112 },
  sWidth: 45,
  sHeight: 45,
  dX: 113,
  dY: 270,
  dWidth: 65,
  dHeight: 65,

  draw: function () {
    if (state.gameOver) {
      ctx.drawImage(sprite, this.medal.sX, this.medal.sY, this.sWidth, this.sHeight, this.dX, this.dY, this.dWidth, this.dHeight);
    }
    // ctx.beginPath()
    // ctx.fillStyle = 'green';
    // ctx.rect(130, 265, 70, 70);
    // ctx.fill();
  }
}

// Tombol Restart setelah game over
const restartButton = {
  x: canvas.width / 2 - 120 / 2,
  y: canvas.height / 2 - 35 + 65,
  w: 120,
  h: 35,

  click: (e) => {
    let rect = canvas.getBoundingClientRect();

    // console.log(rect.left)
    // console.log(e.clientX)
    // console.log(e.clientX - rect.left)
    let clickX = e.clientX - rect.left;
    let clickY = e.clientY - rect.top;

    if (clickX >= restartButton.x && clickX <= restartButton.x + restartButton.w
      && clickY >= restartButton.y && clickY <= restartButton.y + restartButton.h) {
      state.gameOver = false;
      location.reload();
      // state.play = true;
    }
  }

  // draw: function(){
  //   ctx.beginPath();
  //   ctx.fillStyle = 'green';
  //   ctx.rect(this.x, this.y , this.w, this.h);
  //   ctx.fill()
  // }
}

// Tampilan Score dan penyimpanan score
const score = {
  value: 0,
  bestScore: parseInt(localStorage.getItem('best-score') || 0),
  play: true,
  audio: true,

  draw: function () {
    ctx.fillStyle = "white";
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = "black";

    if (state.play) {
      ctx.font = '70px Teko';
      ctx.fillText(this.value, canvas.width / 2 - 25, 100);
      ctx.font = '25px Teko';
      ctx.fillText("Speed : " + (pipe.kecepatanPipe / 2.8).toFixed(1), 30, 70);
    } else if (state.gameOver) {
      ctx.font = '20px Teko';
      ctx.lineWidth = 0.5;


      if (this.value > this.bestScore && this.audio) {
        this.bestScore = this.value;
        localStorage.setItem('best-score', this.value);
        BestScore.play();
        this.audio = false;
      }else if((this.value == this.bestScore && this.audio) || (this.value < this.bestScore && this.audio)){
        Score.play();
        this.audio = false;
      }

      if (score.value >= 10 && score.value < 50) {
        medal.medal = medal.allMedal[1];
        ctx.fillStyle = '#C49C48';
        ctx.fillText('Bronze', 125, 352);
        // ctx.strokeText('Bronze', 125, 352);
      } else if (score.value >= 50 && score.value < 100) {
        medal.medal = medal.allMedal[2];
        ctx.fillStyle = '#C0C0C0';
        ctx.fillText('Silver', 130, 352);
        ctx.strokeText('Silver', 130, 352);
      } else if (score.value >= 100) {
        medal.medal = medal.allMedal[3];
        ctx.fillStyle = 'gold';
        ctx.fillText('Gold', 133, 352);
        // ctx.strokeText('Gold', 150, 352);
      } else {
        ctx.fillStyle = '#ddd';
        ctx.fillText('Batu', 133, 352);
        ctx.strokeText('Batu', 133, 352);
      }

      ctx.font = '40px Teko';
      ctx.fillStyle = 'white';
      ctx.fillText(this.value, 330, 284);
      ctx.fillText(this.bestScore, 330, 344);

      if (this.value == this.bestScore && this.value != 0) {
        ctx.drawImage(newScore, 323, 252, 30, 30);
      }
    }

    if (this.value == 50 && this.play) {
      Transition.play();
      this.play = false;
    } else if (this.value == 100 && !this.play) {
      Transition.play();
      this.play = true;
    }
  }
}

// Event yang terjadi ketika click area game dan keyboard
canvas.addEventListener("click", state.clickHandler);
window.addEventListener("keydown", state.keydownHandler);

document.body.append(canvas);

export { canvas, ctx, background, bird, land, pipe, getReady, gameOver, score, medal, restartButton, images};