const canvas = document.createElement("canvas"),
      ctx = canvas.getContext("2d"),
      html = document.querySelector('html');
canvas.width = html.clientWidth;
canvas.height = html.clientHeight - 70;
document.body.appendChild(canvas);

const resources = new Resources();
resources.load([
    'images/bird/birds.png',
    'images/explode/explode.png',
    'images/airplanes/airplane.png'
]);
resources.onReady(init);

let lastTime;
function init() {
    enemies.push({
        pos: [canvas.width,
            Math.random() * (canvas.height - 39)],
        sprite: new Sprite('images/bird/birds.png', [0, 0], [46, 50],
            10, [0, 1, 2, 3, 2, 1])
    });


    // reset();
    lastTime = Date.now();
    main();
}

let player = {
    pos: [0, canvas.height/2],
    sprite: new Sprite('images/airplanes/airplane.png', [0, 0], [195, 67])
};

let playerSpeed = 200,
    enemySpeed = 500;

let enemies = [],
    explode;

let gameTime = 0,
    isGameOver;

let score = 0;

const timerEl = document.querySelector('.timer'),
      scoreEl = document.querySelector('.score');

function main() {
    let now = Date.now();
    let dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    lastTime = now;
    let animFrameId = requestAnimationFrame(main);
}

function update(dt) {
    gameTime += dt;

    handleInput(dt);
    updateEntities(dt);

    // if(Math.random() < 1 - Math.pow(.993, gameTime)) {
    //     enemies.push({
    //         pos: [canvas.width,
    //             Math.random() * (canvas.height - 39)],
    //         sprite: new Sprite('images/bird/birds.png', [0, 0], [46, 50],
    //             6, [0, 1, 2, 3, 2, 1])
    //     });
    // }

    checkCollisions();

    scoreEl.innerHTML = score;
    timerEl.innerHTML = gameTime;
}

function updateEntities(dt) {
    player.sprite.update(dt);

    // Update all the enemies
    for(let i = 0; i < enemies.length; i++) {
        enemies[i].pos[0] -= enemySpeed * dt;
        enemies[i].sprite.update(dt);

        // Remove if offscreen
        if(enemies[i].pos[0] + enemies[i].sprite.size[0] < 0) {
            console.log(2)
            enemies.splice(i, 1);
            i--;
        }
    }
}

function handleInput(dt) {
    if(input.isDown('DOWN') || input.isDown('s')) {
        player.pos[1] += playerSpeed * dt;
    }

    if(input.isDown('UP') || input.isDown('w')) {
        player.pos[1] -= playerSpeed * dt;
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
        player.pos[0] -= playerSpeed * dt;
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        player.pos[0] += playerSpeed * dt;
    }
}

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
        b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
        pos[0] + size[0], pos[1] + size[1],
        pos2[0], pos2[1],
        pos2[0] + size2[0], pos2[1] + size2[1]);
}

function checkCollisions() {
    checkPlayerBounds();

    // Run collision detection for all enemies and bullets
    for(let i=0; i<enemies.length; i++) {
        let pos = enemies[i].pos;
        let size = enemies[i].sprite.size;
        if(boxCollides(pos, size, player.pos, player.sprite.size)) {
            const explode = {
                pos: player.pos,
                sprite: new Sprite('images/explode/explode.png',
                    [0, 0],
                    [55, 50],
                    16,
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    null,
                    true)
            };
            explode.sprite.update(0.017);
            renderEntity(explode);
            gameOver();
        }
    }
}

function checkPlayerBounds() {
    // Check bounds
    if(player.pos[0] < 0) {
        player.pos[0] = 0;
    }
    else if(player.pos[0] > canvas.width - player.sprite.size[0]) {
        player.pos[0] = canvas.width - player.sprite.size[0];
    }

    if(player.pos[1] < 0) {
        player.pos[1] = 0;
    }
    else if(player.pos[1] > canvas.height - player.sprite.size[1]) {
        player.pos[1] = canvas.height - player.sprite.size[1];
    }
}

function render() {
    ctx.fillStyle = 'skyblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render the player if the game isn't over
    if(!isGameOver) {
        renderEntity(player);
    }

    renderEntities(enemies);
}

function renderEntities(list) {
    for(let i = 0; i < list.length; i++) {
        renderEntity(list[i]);
    }
}

function renderEntity(entity) {
    entity.sprite.render(ctx, entity.pos[0], entity.pos[1]);
}
