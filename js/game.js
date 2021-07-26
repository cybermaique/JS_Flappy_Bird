const sprites = new Image();
sprites.src = '../sprites.png';

const sound_HIT = new Audio();
sound_HIT.src = './efect/hit.wav';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

function toCollision(flappyBird, ground){
    const flappyBirdposY = flappyBird.posY + flappyBird.altura;
    const groundposY = ground.posY;

    if(flappyBirdposY >= groundposY) {
        return true;
    }

    return false;
}

//função cria flappybird
function createFlappybird () {
    const flappyBird = {
        spriteX:0,
        spriteY:0,
        largura:33,
        altura:24,
        posX:10,
        posY:50,
        vel:0,
        grav:0.25,
        jumpIn: 4.5,
    
        jump (){
            flappyBird.vel  = - flappyBird.jumpIn
        },
    
        gravity (){
    
            if (toCollision(flappyBird, ground)){
                sound_HIT.play();
                setTimeout(()=> {
                    frameSwitch(Frames.play)
                }, 500);

                return;
            }
            flappyBird.vel =  flappyBird.vel + flappyBird.grav ;
            flappyBird.posY = flappyBird.posY + flappyBird.vel ;
        },
    
        draw () {
            context.drawImage(
                sprites,
                flappyBird.spriteX,flappyBird.spriteY, //sprite X,Y
                flappyBird.largura, flappyBird.altura, //tamanho
                flappyBird.posX, flappyBird.posY, //posição dentro do canvas
                flappyBird.largura, flappyBird.altura, //tamanho a aparecer no canvas
            );
        }
    }
     return flappyBird;
}
//Objeto e posição do Flappy

//Objeto e posição do Chão
const ground = {
    spriteX:0,
    spriteY:610,
    largura:224,
    altura:112,
    posX:0,
    posY: canvas.height -112,

    draw () {
        context.drawImage(
            sprites,
            ground.spriteX, ground.spriteY, //sprite X,Y
            ground.largura, ground.altura, //tamanho
            ground.posX, ground.posY, //posição dentro do canvas
            ground.largura, ground.altura, //tamanho a aparecer no canvas
        );

        context.drawImage(
            sprites,
            ground.spriteX, ground.spriteY, //sprite X,Y
            ground.largura, ground.altura, //tamanho
            (ground.posX+ground.largura), ground.posY, //posição dentro do canvas
            ground.largura, ground.altura, //tamanho a aparecer no canvas
        );
    }
};
//Objeto e posição do Chão
const background = {
    spriteX:390,
    spriteY:0,
    largura:275,
    altura:204,
    posX:0,
    posY: canvas.height -204,

    draw () {
        context.fillStyle = '#70c5ce';
        context.fillRect(0,0, canvas.width, canvas.height);
    
        context.drawImage(
            sprites,
            background.spriteX, background.spriteY, //sprite X,Y
            background.largura, background.altura, //tamanho
            background.posX, background.posY, //posição dentro do canvas
            background.largura, background.altura, //tamanho a aparecer no canvas
        );

        context.drawImage(
            sprites,
            background.spriteX, background.spriteY, //sprite X,Y
            background.largura, background.altura, //tamanho
            (background.posX+background.largura), background.posY, //posição dentro do canvas
            background.largura, background.altura, //tamanho a aparecer no canvas
        );
    }
};
//Menu inicial
const menssegeGetReady = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,

    draw() {
      context.drawImage(
        sprites,
        menssegeGetReady.sX, menssegeGetReady.sY,
        menssegeGetReady.w, menssegeGetReady.h,
        menssegeGetReady.x, menssegeGetReady.y,
        menssegeGetReady.w, menssegeGetReady.h
      );
    }
  };

//
//
//  TELAS
//
//Chamada dos objetos, a ordem indica a camada que irá aparecer no canvas.

const globals = {};
let activeFrame = {};
function frameSwitch(newFrame) {
    activeFrame = newFrame;

    if(activeFrame.init) {
        activeFrame.init ();
    }
}

const Frames = {
    play: {
        init (){
            globals.flappyBird = createFlappybird();
        },
        draw (){
            background.draw ();
            ground.draw ();
            globals.flappyBird.draw ();    
            menssegeGetReady.draw ();

        },
        click(){
            frameSwitch(Frames.GAME);
        },
        reload (){
        }
    }
};

Frames.GAME = {
    draw () {
        background.draw();
        ground.draw ();
        globals.flappyBird.draw ();    
    },
    click (){
        globals.flappyBird.jump();
    },
    reload () {
        globals.flappyBird.gravity();
    }
};



function loop () {
    activeFrame.draw ();
    activeFrame.reload ();

    requestAnimationFrame (loop);//função adequada para o canvas ter a frequencia de 60hz no loop.
}

window.addEventListener ('click', function () {
    if( activeFrame.click ) {
        activeFrame.click();
    }
});


frameSwitch (Frames.play);
loop ();

