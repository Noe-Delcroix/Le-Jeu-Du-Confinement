var MODE = 'titleScreen'
var endScreen = 0

var grid = []
var gsize
var cam
var zoom

var player
var AIs = []
var aiSpawnQueue = 0
var shelves = []
var objects = []

var PQs = []
var playerStyle
var buttonStyle = false
var buttonPlay = 0
var Smusic=[0,false]
var Ssound=[0,false]


var filtr
var osc
var fft

var hairColors

var globalStyle
var T_ground = []
var T_element = []
var T_player = []
var T_objects
var T_tutorial = []
var T_logo

var finding
var collectedObj

var timer = 0
var alert = 0
var fps = 60

var transition = [0, 0]

var font

function preload() {
  font = loadFont('Assets/Pixellari.ttf')

  hairColors = [color(82, 73, 71), color(108, 85, 77), color(162, 110, 65), color(117, 77, 61), color(182, 131, 79), color(249, 226, 180), color(220)]
  /*loading the image files
  0:just a plain tile
  1:randomized tile (weights)
  2:animated tile (animation speed)
  type;height;3D height; *special*
  */

  playerStyle = [random([0, 5, 10]), int(random(7)), 0, [int(random(12)), hairColors[int(random(hairColors.length))]],
    [int(random(6)), color(random(255), random(255), random(255))],
    [int(random(11)), color(random(255), random(255), random(255))]
  ]

  T_ground = []
  T_ground.push([loadImage("Assets/ground/Tile1.png"), 16, 0, 'random', [0.5, 0.4, 0.1]])
  T_ground.push([loadImage("Assets/ground/Tile2.png"), 16, 0, 'random', [0.5, 0.5]])
  T_ground.push([loadImage("Assets/ground/Tile3.png"), 16, 0, 'random', [0.5, 0.4, 0.1]])
  T_ground.push([loadImage("Assets/ground/Tile4.png"), 16, 0, 'random', [0.5, 0.4, 0.1]])

  T_ground.push([loadImage("Assets/ground/mainTile1.png"), 16, 0, 'random', [0.25, 0.7, 0.05]])
  T_ground.push([loadImage("Assets/ground/mainTile2.png"), 16, 0, 'random', [0.5, 0.5]])
  T_ground.push([loadImage("Assets/ground/mainTile3.png"), 16, 0, 'random', [0.4, 0.3, 0.3]])
  T_ground.push([loadImage("Assets/ground/mainTile4.png"), 16, 0, 'random', [0.6, 0.2, 0.2]])

  T_element = []


  T_element.push([loadImage("Assets/elements/brickwall.png"), 26, 10 / 16, 'random', [0.4, 0.3, 0.3]])
  T_element.push([loadImage("Assets/elements/brickwall2.png"), 26, 10 / 16, 'random', [0.4, 0.3, 0.3]])
  T_element.push([loadImage("Assets/elements/brickwall3.png"), 26, 10 / 16, 'random', [0.5, 0.5]])

  T_element.push([loadImage("Assets/elements/shelf.png"), 20, 10 / 16, 'random', [1]])

  T_element.push([loadImage("Assets/elements/caisse.png"), 24, 8 / 16, 'animated', 0.05])

  T_element.push([loadImage("Assets/elements/caisseSupport.png"), 24, 8 / 16, 'animated', 0.1])

  T_element.push([loadImage("Assets/elements/smallDoor.png"), 8, 7 / 16, 'random', [0.3, 0.3, 0.4]])

  T_element.push([loadImage("Assets/elements/pillar.png"), 24, 8 / 16, 'random', [1]])



  T_player = []
  T_player.push(loadImage("Assets/players/heads.png"))
  T_player.push(loadImage("Assets/players/eyes.png"))
  T_player.push(loadImage("Assets/players/masks.png"))
  T_player.push(loadImage("Assets/players/hairs.png"))
  T_player.push(loadImage("Assets/players/bodies.png"))
  T_player.push(loadImage("Assets/players/paterns.png"))
  T_player.push(loadImage("Assets/players/hairsback.png"))

  T_objects = loadImage("Assets/objects.png")
  T_pinwheel = loadImage("Assets/pinwheel.png")
  T_alert = loadImage("Assets/alert.png")


  T_tutorial.push(loadImage('Assets/tutorial/img1.png'))
  T_tutorial.push(loadImage('Assets/tutorial/img2.png'))
  T_tutorial.push(loadImage('Assets/tutorial/img3.png'))
  T_tutorial.push(loadImage('Assets/tutorial/img4.png'))
  
  T_logo = loadImage('Assets/logo.png')

  soundFormats('wav', 'mp3');
  S_sounds = []
  S_sounds.push(loadSound("Assets/audio/pickup.wav"))
  S_sounds.push(createAudio("Assets/audio/alert2.wav"))
  S_sounds.push(loadSound("Assets/audio/main Theme 2.mp3"))
  S_sounds.push(loadSound("Assets/audio/onButton.wav"))
  S_sounds.push(loadSound("Assets/audio/button.wav"))
  S_sounds.push(loadSound("Assets/audio/button2.wav"))
  S_sounds.push(loadSound("Assets/audio/menu Theme.mp3"))
}

function setup() {
  let canvasSize = createVector(1, 0)
  while (canvasSize.x < windowWidth && canvasSize.y < windowHeight) {
    canvasSize.x++
    canvasSize.y = canvasSize.x * 9 / 16
  }
  var canvas = createCanvas(canvasSize.x, canvasSize.y)
  canvas.position(windowWidth / 2 - width / 2, 0)
  let context = canvas.elt.getContext('2d');
  context.mozImageSmoothingEnabled = false;
  context.webkitImageSmoothingEnabled = false;
  context.msImageSmoothingEnabled = false;
  context.imageSmoothingEnabled = false;

  Ehairs = createColorPicker(playerStyle[3][1])
  Ehairs.input(EhairsInput)
  Ehairs.class('colorInput')
  Ehairs.style('width', width / 5 + 'px')
  Ehairs.style('height', width / 5 / 5 + 'px')
  Ehairs.position(width / 2.4 - width / 5 / 2 + windowWidth / 2 - width / 2, height / 1.8)

  Eclothes = createColorPicker(playerStyle[4][1])
  Eclothes.input(EclothesInput)
  Eclothes.class('colorInput')
  Eclothes.style('width', width / 5 + 'px')
  Eclothes.style('height', width / 5 / 5 + 'px')
  Eclothes.position(width / 2.4 - width / 5 / 2 + windowWidth / 2 - width / 2, height / 1.57)

  Emotif = createColorPicker(playerStyle[5][1])
  Emotif.input(EmotifInput)
  Emotif.class('colorInput')
  Emotif.style('width', width / 5 + 'px')
  Emotif.style('height', width / 5 / 5 + 'px')
  Emotif.position(width / 2.4 - width / 5 / 2 + windowWidth / 2 - width / 2, height / 1.4)

  filtr=new p5.LowPass()
  S_sounds[2].disconnect()
  S_sounds[2].connect(filtr)
  
  osc=new p5.Oscillator('sine');
  osc.amp(0)
  osc.start()
  osc.freq(2000)
  
  fft=new p5.FFT(0.9,64)
  
  setupMenu()
}

function EhairsInput() {
  playerStyle[3][1] = Ehairs.color()
}

function EclothesInput() {
  playerStyle[4][1] = Eclothes.color()
}

function EmotifInput() {
  playerStyle[5][1] = Emotif.color()
}

function setupMenu() {
  S_sounds[6].loop()
  
  osc.amp(0)
  buttonPlay = 0
  Ehairs.show()
  Eclothes.show()
  Emotif.show()
  PQs = []
  MODE = 'titleScreen'
}

function setupGame() {
  S_sounds[6].stop()
  MODE = 'playing'
  AIs = []
  aiSpawnQueue = 0
  collectedObj = []
  for (let i = 0; i < 0; i++) {
    collectedObj.push(int(random(20)))
  }

  endScreen = 0
  S_sounds[1].volume(0)
  S_sounds[1].loop()
  S_sounds[2].setVolume(0)
  S_sounds[2].stop()

  //scaling/placing the canvas
  zoom = width * 60 / 700

  //creating the camera
  cam = createVector(0, 0)
  //generating the map
  objects = []
  let caisses = int(random(5, 8))
  let rayons = int(random(3, 7))
  let maxShelfSpace = generateGrid(4 + caisses * 4, 8 + rayons * 4, [int(random(4, T_ground.length)), int(random(4)), int(random(3))])
  let surface = (4 + caisses * 4) * (8 + rayons * 4)

  player = new Player(createVector(1.5, -0.4), 0.72, 1.3, 0.43, 0.05, [38, 37, 40, 39], null, null, null)
  camMovements(1)
  for (let i = 0; i < surface * 40 / 1000; i++) {
    AIs.push(new Player('randompos', 0.72, 0.72 * 18 / 10, 0.43, 0.05, null, 'looking', 0.9, null))
  }

  for (let x = 0; x < gsize.x; x++) {
    if ((x + 2) % 4 == 0 && x > 2 && x < gsize.x - 1) {
      AIs.push(new Player(createVector(x, 4), 0.72, 1.3, 0.43, 0.05, null, 'still', 0.9, null))
    }
  }
  for (let i = 0; i < maxShelfSpace / 2.5; i++) {
    respawnObj()
  }

  while (player.getClosestObj(player.pos) == null) {
    finding = int(random(20))
  }
}

function generateGrid(w, h, style) {
  //style : main ground, secondary ground
  let brickWalls = 3
  //grid generation
  grid = []
  gsize = createVector(w, h)

  let x = 0,
    y = 0
  let gap = 0
  let shelfHeight = 3

  let maxShelfSpace = 0
  while (y < h) {
    grid[y] = []
    x = 0
    gap = 0
    while (x < w) {
      if (x == 0 || x == w - 1 || y == 0) {
        if (y == 0 && (x == 1 || x == 2)) {
          grid[y][x] = new Tile(x, y, false, style[0], null, null)
        } else {
          grid[y][x] = new Tile(x, y, true, null, style[2], 3)
        }
      } else if (y <= 5) {
        //zone caisses
        if (x < 3) {
          grid[y][x] = new Tile(x, y, false, style[0], null, null)
        } else if (x == 3 && y > 2) {
          grid[y][x] = new Tile(x, y, true, null, style[2], 3)
        } else if (y == 3 && (x + 2) % 4 == 0) {
          grid[y][x] = new Tile(x, y, true, null, brickWalls + 1, 1)
        } else if ((y == 4 || y == 5) && (x - 1) % 4 == 0) {
          grid[y][x] = new Tile(x, y, true, null, brickWalls + 2, 1)
        } else if (y == 3 && (x - 1) % 4 == 0) {
          grid[y][x] = new Tile(x, y, true, null, style[2], 3)
        } else if ((y == 3 || y == 4 || y == 5) && (x - 3) % 4 == 0) {
          grid[y][x] = new Tile(x, y, true, null, style[2], 1)
        } else if (y == 5 && (x + 2) % 4 == 0) {
          grid[y][x] = new Tile(x, y, true, style[1], brickWalls + 3, 1)
        } else {
          grid[y][x] = new Tile(x, y, false, style[1], null, null)
        }
      } else {
        //zone rayons
        if (y % 4 == 0 && x > 3 && x < w - 4) {
          if (gap > 0) {
            grid[y][x] = new Tile(x, y, false, style[0], null, null)
            gap--
          } else {
            grid[y][x] = new Tile(x, y, true, null, brickWalls + 0, shelfHeight)
            maxShelfSpace += shelfHeight
            if (x > 6 && x < w - 8 && random(1) < 0.1) {
              shelfHeight = int(random(2, 4))
              gap = int(random(2, 4))
            }
          }
        } else if (random(1) < 0.05 && y > 6 && y % 4 == 2 && x > 3 && x < w - 4) {
          grid[y][x] = new Tile(x, y, true, style[0], brickWalls + 4, 3)
        } else {
          grid[y][x] = new Tile(x, y, false, style[0], null, null)
        }
      }
      x++
    }
    y++
  }
  shelves = []
  for (let y = 0; y < gsize.y; y++) {
    for (let x = 0; x < gsize.x; x++) {
      if (grid[y][x].e == 3) {
        shelves.push(grid[y][x])
      }
    }
  }
  return maxShelfSpace
}

function draw() {
  let v=map(Ssound[0],width/70,width/70+width/8,1,0)
  S_sounds[0].setVolume(v)
  S_sounds[3].setVolume(v)
  S_sounds[4].setVolume(v)
  S_sounds[5].setVolume(v)
  
  timer++
  if (MODE == 'playing') {
    drawGame()
  } else if (MODE == 'titleScreen') {
    drawMenu()
  }
  background(0, transition[0])
  transition[0] += transition[1]
  transition[0] = constrain(transition[0], 0, 255)
  if (transition[0] > 0 && abs(transition[1]) == 5.5) {
    push()
    resetMatrix()
    imageMode(CENTER)
    tint(255, map(transition[0], 200, 255, 0, 255))
    image(T_tutorial[0], width * 0.7 / 4, height / 3, width / 5, width / 5 * T_tutorial[0].height / T_tutorial[0].width)
    
    image(T_tutorial[2], width / 2, height / 1.6, width / 5, width / 5 * T_tutorial[2].height / T_tutorial[2].width)
    
    image(T_tutorial[3], width / 2, height / 5.5, width / 5, width / 5 * T_tutorial[3].height / T_tutorial[3].width)
    
    image(T_tutorial[1], width * 3.3 / 4, height / 3, width / 5, width / 5 * T_tutorial[1].height / T_tutorial[1].width)
    
    textAlign(CENTER, CENTER)
    textFont(font)
    noStroke()
    fill(255, map(transition[0], 200, 255, 0, 255))
    textSize(width / 30)

    text('Respectez la', width * 0.7 / 4, height / 1.73)
    text('distanciation sociale', width * 0.7 / 4, height / 1.58)

    text('Le curseur indique', width * 3.3 / 4, height / 1.73)
    text('les achats à effectuer', width * 3.3 / 4, height / 1.58)

    text('Ne laissez pas votre', width / 2, height / 1.3)
    text('contamination atteindre 100%', width / 2, height / 1.22)
    
    fill(128, map(transition[0], 200, 255, 0, 255))
    textSize(width / 42)
    text('Utilisez les flèches du clavier', width / 2, height / 3)
    text('ou les touches ZQSD pour vous déplacer', width / 2, height / 2.7)
    

    textSize(width / 35)
    text("Appuyez sur n'importe quelle touche pour continuer ...", width / 2, height - height / 20)
    pop()
    noTint()
  }
}

function drawMenu() {
  let v=map(Smusic[0],width/70,width/70+width/8,0.5,0)
  S_sounds[6].setVolume(v-map(transition[0],0,255,0,v))
  
  background(37, 33, 45)
  if (transition[0] > 0 && transition[1] == 5.5) {
    Ehairs.hide()
    Eclothes.hide()
    Emotif.hide()
  }
  fill(63, 56, 76)
  noStroke()
  rectMode(CORNER)
  let spectrum=fft.analyze()
  for (let i=0;i<spectrum.length;i++){
    rect(i*width/50,height,width/50*1.03,map(spectrum[i],0,255,0,-height))
  }
  fill(255,100)
  noStroke()
  textSize(width/40)
  textAlign(LEFT,BOTTOM)
  text('Noé Delcroix ©',0,height)
  text('V1.1',0,height-width/40)

  if (transition[0] < 255) {
    if (random(1) < 0.2) {
      PQs.push(new PQ())
    }
    for (let pq = PQs.length - 1; pq >= 0; pq--) {
      PQs[pq].update()
      if (PQs[pq].del) {
        PQs.splice(pq, 1)
      }
    }
    imageMode(CENTER)

    push()
    translate(width / 2, height / 5)
    rotate(map(sin(timer / 50), -1, 1, -PI / 32, PI / 32))
    sz = map(sin(timer / 20), -1, 1, width * 0.5, width * 0.8)
    image(T_logo, 0, 0, sz, sz * T_logo.height / T_logo.width)
    pop()
    
    if (mouseY>width/70 && mouseY < width/70+width/8 && mouseIsPressed){
      if (mouseX>width-width/80-width/120 && mouseX<width-width/70+width/120){
        Ssound[1]=true
        Smusic[1]=false
      }
      if (mouseX>width-width/70*3-width/120 && mouseX<width-width/70*3+width/120){
        Smusic[1]=true
        Ssound[1]=false
      }
    }
    
    if (!mouseIsPressed){
      Ssound[1]=false
      Smusic[1]=false
    }
    if (Smusic[1]){
      Smusic[0]=mouseY
    }
    if (Ssound[1]){
      Ssound[0]=mouseY
    }
    Smusic[0]=constrain(Smusic[0],width/70,width/70+width/8)
    Ssound[0]=constrain(Ssound[0],width/70,width/70+width/8)
    
    stroke(63, 56, 76)
    strokeWeight(width/60)
    line(width-width/70,width/70,width-width/70,width/70+width/8)
    line(width-width/70*3,width/70,width-width/70*3,width/70+width/8)
    fill(110, 98, 132)
    stroke(213, 191, 255)
    strokeWeight(height/200)
    circle(width-width/70,Ssound[0],width/40)
    circle(width-width/70*3,Smusic[0],width/40)
    
    fill(213, 191, 255)
    noStroke()
    textAlign(CENTER,CENTER)
    textSize(width/52)
    textFont('helvetica')
    text('♪',width-width/70,Ssound[0])
    text('♫',width-width/70*3,Smusic[0])
    
    sz = width / 12
    rectMode(CORNER)
    fill(0, 100)
    noStroke()
    rect(0, height / 2 - sz / 4, width, sz * 18 / 10 + sz / 2)


    textSize(width / 30)
    textAlign(CENTER, CENTER)
    textFont(font)
    fill(255)
    noStroke()
    text('Customisation :', width / 2.4, height / 2)

    strokeWeight(width / 250)
    fill(playerStyle[3][1])
    if (mouseX > width / 2.4 - width / 5 / 2 && mouseX < width / 2.4 - width / 5 / 2 + width / 5 && mouseY > height / 1.8 && mouseY < height / 1.8 + width / 5 / 5) {
      if (!(pmouseX > width / 2.4 - width / 5 / 2 && pmouseX < width / 2.4 - width / 5 / 2 + width / 5 && pmouseY > height / 1.8 && pmouseY < height / 1.8 + width / 5 / 5)) {
        S_sounds[3].play()
      }
      stroke(255)
    } else {
      noStroke()
    }
    rectMode(CORNER)
    rect(width / 2.4 - width / 5 / 2, height / 1.8, width / 5, width / 5 / 5)
    fill(255)
    stroke(0)
    textSize(width / 10 / 4)
    textAlign(CENTER, CENTER)
    text('Couleur cheveux', width / 2.4, height / 1.7)

    fill(playerStyle[4][1])
    if (mouseX > width / 2.4 - width / 5 / 2 && mouseX < width / 2.4 - width / 5 / 2 + width / 5 && mouseY > height / 1.57 && mouseY < height / 1.57 + width / 5 / 5) {
      if (!(pmouseX > width / 2.4 - width / 5 / 2 && pmouseX < width / 2.4 - width / 5 / 2 + width / 5 && pmouseY > height / 1.57 && pmouseY < height / 1.57 + width / 5 / 5)) {
        S_sounds[3].play()
      }
      stroke(255)
    } else {
      noStroke()
    }
    rectMode(CORNER)
    rect(width / 2.4 - width / 5 / 2, height / 1.57, width / 5, width / 5 / 5)
    fill(255)
    stroke(0)
    textSize(width / 10 / 4)
    textAlign(CENTER, CENTER)
    text('Couleur vêtement', width / 2.4, height / 1.49)

    fill(playerStyle[5][1])
    if (mouseX > width / 2.4 - width / 5 / 2 && mouseX < width / 2.4 - width / 5 / 2 + width / 5 && mouseY > height / 1.39 && mouseY < height / 1.39 + width / 5 / 5) {
      if (!(pmouseX > width / 2.4 - width / 5 / 2 && pmouseX < width / 2.4 - width / 5 / 2 + width / 5 && pmouseY > height / 1.39 && pmouseY < height / 1.39 + width / 5 / 5)) {
        S_sounds[3].play()
      }
      stroke(255)
    } else {
      noStroke()
    }
    rectMode(CORNER)
    rect(width / 2.4 - width / 5 / 2, height / 1.39, width / 5, width / 5 / 5)
    fill(255)
    stroke(0)
    textSize(width / 10 / 4)
    textAlign(CENTER, CENTER)
    text('Couleur motif', width / 2.4, height / 1.33)


    imageMode(CORNER)
    push()
    translate(width / 1.6 - sz / 2, height / 2)
    tint(playerStyle[4][1])
    image(T_player[4], 0, 0, sz, sz * 18 / 10, 10 * playerStyle[4][0], 0, 10, 18)
    tint(playerStyle[5][1])
    image(T_player[5], 0, 0, sz, sz * 18 / 10, 10 * playerStyle[5][0], 0, 10, 18)
    noTint()
    image(T_player[0], 0, 0, sz, sz * 18 / 10, 10 * playerStyle[0], 0, 10, 18)
    image(T_player[1], 0, 0, sz, sz * 18 / 10, 10 * playerStyle[1], 0, 10, 18)
    image(T_player[2], 0, 0, sz, sz * 18 / 10, 10 * playerStyle[2], 0, 10, 18)
    tint(playerStyle[3][1])
    image(T_player[3], 0, 0, sz, sz * 18 / 10, 10 * playerStyle[3][0], 0, 10, 18)
    noTint()
    pop()
    strokeWeight(height / 200)
    stroke(0)
    textAlign(CENTER, CENTER)
    textFont('helvetica')
    textSize(height / 20)
    let space = height / 18
    for (let y = 0; y < 6; y++) {
      let pos = createVector(width / 1.6, height / 2 + y * space)
      if(y==0 && playerStyle[3][0]!=12 || y==1 && playerStyle[1]!=7 || y==2 && playerStyle[2]!=6 || y==3 && playerStyle[0]!=14 || y==4 && playerStyle[4][0]!=6 || y==5 && playerStyle[5][0]!=11){
      if (pos.dist(createVector(mouseX - sz * 0.8, mouseY)) < space / 2) {
        if (pos.dist(createVector(pmouseX - sz * 0.8, pmouseY)) > space / 2) {
          S_sounds[3].play()
        }
        if (mouseIsPressed) {
          if (buttonStyle == false) {
            S_sounds[5].play()
            if (y == 0) {
              playerStyle[3][0]++
            } else if (y == 1) {
              playerStyle[1]++
            } else if (y == 2) {
              playerStyle[2]++
            } else if (y == 3) {
              playerStyle[0]++
            } else if (y == 4) {
              playerStyle[4][0]++
            } else if (y == 5) {
              playerStyle[5][0]++
            }
          }
          buttonStyle = true
        } else {
          buttonStyle = false
        }
        fill(255)
      } else {
        fill(128,100)
      }
      circle(pos.x + sz * 0.8, pos.y, space)
      fill(0)
      text('>', pos.x + sz * 0.8, height / 1.98 + y * space)
      }
      
      if(y==0 && playerStyle[3][0]!=0 || y==1 && playerStyle[1]!=0 || y==2 && playerStyle[2]!=0 || y==3 && playerStyle[0]!=0 || y==4 && playerStyle[4][0]!=0 || y==5 && playerStyle[5][0]!=0){
      if (pos.dist(createVector(mouseX + sz * 0.8, mouseY)) < space / 2) {
        if (pos.dist(createVector(pmouseX + sz * 0.8, pmouseY)) > space / 2) {
          S_sounds[3].play()
        }
        if (mouseIsPressed) {
          if (buttonStyle == false) {
            S_sounds[5].play()
            if (y == 0) {
              playerStyle[3][0]--
            } else if (y == 1) {
              playerStyle[1]--
            } else if (y == 2) {
              playerStyle[2]--
            } else if (y == 3) {
              playerStyle[0]--
            } else if (y == 4) {
              playerStyle[4][0]--
            } else if (y == 5) {
              playerStyle[5][0]--
            }
          }
          buttonStyle = true
        } else {
          buttonStyle = false
        }
        fill(255)
      } else {
        fill(128,100)
      }
      circle(pos.x - sz * 0.8, pos.y, space)
      fill(0)
      text('<', pos.x - sz * 0.8, height / 1.98 + y * space)
    }
    }
    sz = buttonPlay

    if (mouseX > width / 2 - sz / 2 && mouseX < width / 2 + sz / 2 && mouseY > height - height / 10 - sz * 0.3 / 2 && mouseY < height - height / 10 + sz * 0.3 / 2) {
      if (!(pmouseX > width / 2 - sz / 2 && pmouseX < width / 2 + sz / 2 && pmouseY > height - height / 10 - sz * 0.3 / 2 && pmouseY < height - height / 10 + sz * 0.3 / 2)) {
        S_sounds[3].play()
      }
      if (mouseIsPressed && transition[1] != 5.5) {
        S_sounds[4].play()
        transition[1] = 5.5
      }
      fill(177, 160, 211)
      buttonPlay += (width / 3 - buttonPlay) / 20
    } else {
      fill(131, 118, 156)
      buttonPlay += (width / 4 - buttonPlay) / 20
    }


    rectMode(CENTER)
    stroke(0)
    strokeWeight(width / 200)
    rect(width / 2, height - height / 10, sz, sz * 0.3, 90)

    strokeWeight(sz / 50)
    textFont(font)
    fill(255)
    textAlign(CENTER)
    textSize(sz / 4)
    text('Jouer', width / 2, height - height / 10)
  }

  if (transition[0] >= 255 && transition[1] == 5.5 && keyIsPressed) {
    transition[1] = -5.5
    setupGame()
  }
}

function drawGame() {
  if (!S_sounds[2].isLooping()){
    S_sounds[2].loop()
  }
  translate(width / 2, height / 2)
  background(0)
  render()
  player.update()
  for (let ai = AIs.length - 1; ai >= 0; ai--) {
    AIs[ai].update()
    if (AIs[ai].del) {
      AIs.splice(ai, 1)
      aiSpawnQueue += int(random(2, 4))
    }

  }
  if (aiSpawnQueue > 0 && random(1) < 0.01) {
    aiSpawnQueue--
    AIs.push(new Player(createVector(random(1, 2), -5), 0.72, 1.3, 0.43, 0.05, null, 'entering', 0.9, null))
  }
  camMovements(10)

  if (debug()) {
    if (timer % 10 == 0) {
      fps = frameRate()
    }
    fill(0)
    stroke(255, 255, 0)
    strokeWeight(2)
    textSize(25)
    textAlign(LEFT, TOP)
    text(int(fps) + " FPS", -width / 2, -height / 2)
  }
  let v=map(Smusic[0],width/70,width/70+width/8,0.5,0)
  S_sounds[2].setVolume(constrain(v - map(transition[0], 0, 255, 0, v), 0, v))
  if (player.contamination >= 100) {
    endScreen += (200 - endScreen) / 30
    background(255, 0, 0, endScreen)
    fill(255)
    stroke(0)
    strokeWeight(map(endScreen, 0, 200, 0, zoom / 8))
    textAlign(CENTER, CENTER)
    textFont(font)
    textSize(constrain(map(endScreen, 0, 200, 0, width / 8), 0, width / 8))
    text('Partie Terminée', 0, -height / 2.5)

    fill(255, 128, 128)
    noStroke()
    strokeWeight(constrain(map(endScreen, 50, 200, 0, zoom / 16), 0, zoom / 16))
    textSize(constrain(map(endScreen, 50, 200, 0, width / 16), 0, width / 16))
    text('Vous avez été contaminé', 0, -height / 4)

    fill(255)
    stroke(0)
    strokeWeight(constrain(map(endScreen, 100, 200, 0, zoom / 13), 0, zoom / 13))
    textSize(constrain(map(endScreen, 100, 200, 0, width / 13), 0, width / 13))
    text('Objets Collectés : ' + collectedObj.length, 0, 0)

    if (collectedObj.length > 0) {
      fill(0, 100)
      noStroke()
      rectMode(CENTER)
      rect(0, height / 6.5, constrain(map(endScreen, 0, 150, 0, width), 0, width), zoom / 2 * 1.3)
      collectedObj.sort()
      let sz = constrain(map(endScreen, 150, 200, 0, zoom / 2), 0, zoom / 2)
      if (sz > 0) {
        for (let c = 0; c < collectedObj.length; c++) {
          imageMode(CENTER)
          let step = width / (collectedObj.length * zoom / 2)
          image(T_objects, -width / 2 + (c + 0.5) * step * zoom / 2, height / 6.5, sz, sz, collectedObj[c] * 8, 0, 8, 8)
        }
      }
    }

    noStroke()
    let sz = constrain(map(endScreen, 150, 200, 0, height / 6), 0, height / 6)
    if (mouseX - width / 2 > -width / 4 - sz * 3 / 2 && mouseX - width / 2 < -width / 4 + sz * 3 / 2 && mouseY - height / 2 > height / 3 - sz / 2 && mouseY - height / 2 < height / 3 + sz / 2) {
      if (!(pmouseX - width / 2 > -width / 4 - sz * 3 / 2 && pmouseX - width / 2 < -width / 4 + sz * 3 / 2 && pmouseY - height / 2 > height / 3 - sz / 2 && pmouseY - height / 2 < height / 3 + sz / 2)) {
        S_sounds[3].play()
      }
      if (mouseIsPressed && transition[0] == 0) {
        S_sounds[4].play()
        transition = [0, 6]
      }
      fill(255, 150, 150)
    } else {
      fill(255, 128, 128)
    }

    rectMode(CENTER)
    rect(-width / 4, height / 3, sz * 3, sz, 90)
    stroke(255)
    strokeWeight(constrain(map(endScreen, 150, 200, 0, zoom / 16), 0, zoom / 16))
    textSize(constrain(map(endScreen, 150, 200, 0, width / 16), 0, width / 16))
    text('Rejouer', -width / 4, height / 3)



    noStroke()
    sz = constrain(map(endScreen, 150, 200, 0, height / 6), 0, height / 6)
    if (mouseX - width / 2 > width / 4 - sz * 3 / 2 && mouseX - width / 2 < width / 4 + sz * 3 / 2 && mouseY - height / 2 > height / 3 - sz / 2 && mouseY - height / 2 < height / 3 + sz / 2) {
      if (!(pmouseX - width / 2 > width / 4 - sz * 3 / 2 && pmouseX - width / 2 < width / 4 + sz * 3 / 2 && pmouseY - height / 2 > height / 3 - sz / 2 && pmouseY - height / 2 < height / 3 + sz / 2)) {
        S_sounds[3].play()
      }

      if (mouseIsPressed && transition[0] == 0) {
        S_sounds[4].play()
        transition = [0, 5]
      }
      fill(255, 150, 150)
    } else {
      fill(255, 128, 128)
    }
    rectMode(CENTER)
    rect(width / 4, height / 3, sz * 3, sz, 90)
    stroke(255)
    strokeWeight(constrain(map(endScreen, 150, 200, 0, zoom / 16), 0, zoom / 16))
    textSize(constrain(map(endScreen, 150, 200, 0, width / 16), 0, width / 16))
    text('Menu', width / 4, height / 3)

    if (transition[0] >= 255) {
      if (transition[1] == 6) {
        S_sounds[2].stop()
        transition[1] = -6
        setupGame()
      } else {
        transition[1] = -5
        setupMenu()
      }
    }

  } else {
    endScreen = 0
  }
}

function render() {
  for (y = floor(cam.y) - floor(height / zoom / 2) - 1; y <= ceil(cam.y) + ceil(height / zoom / 2) + 1; y++) {
    for (x = floor(cam.x) - floor(width / zoom / 2) - 1; x <= ceil(cam.x) + ceil(width / zoom / 2); x++) {
      if (x >= 0 && x < gsize.x && y >= 0 && y < gsize.y) {
        grid[y][x].render()
      }
    }
    let toRender = []
    if (ceil(player.pos.y - 0.5) == y) {
      toRender.push(player)
    }
    for (let ai of AIs) {
      if (ai.loaded() && ceil(ai.pos.y - 0.5) == y) {
        toRender.push(ai)
      }
    }
    for (let obj of objects) {
      if (obj.loaded() && ceil(obj.pos.y - 0.5) == y) {
        toRender.push(obj)
      }
    }

    let rendered = []
    if (toRender.length > 0) {
      while (toRender.length != rendered.length) {
        let lowestY = Infinity
        let lowest = null
        for (let t of toRender) {
          if (t.pos.y < lowestY && !rendered.includes(t)) {
            lowestY = t.pos.y
            lowest = t
          }
        }
        lowest.render()
        rendered.push(lowest)
      }
    }
  }
  for (let ai of AIs) {
    ai.renderRadius()
  }

  for (let o = objects.length - 1; o >= 0; o--) {
    objects[o].update()
    if (objects[o].del) {
      objects.splice(o, 1)
    }

  }
  if (player.playerToClose()) {
    S_sounds[1].speed(map(player.contamination, 0, 100, 1, 3))
    S_sounds[1].volume(min(S_sounds[1].volume() + 0.5, map(Ssound[0],width/70,width/70+width/8,1,0)))
    if (S_sounds[1].volume() == 0.5) {
      S_sounds[1].time(0)
    }
    alert += (200 - alert) / 5
  } else {
    S_sounds[1].volume(max(S_sounds[1].volume() - 0.1, 0))
    alert += (0 - alert) / 50
  }


  if (alert > 1 || player.contamination >= 100) {
    if (player.contamination >= 100) {
      tint(255, 200 + endScreen)
    } else {
      tint(255, alert)
    }
    imageMode(CENTER)
    image(T_alert, 0, 0, width, height)
    noTint()
  }
  let v=map(Smusic[0],width/70,width/70+width/8,0.03,0)
  osc.amp(map(constrain(endScreen-transition[0],0,200),0,200,0,v))
  if (endScreen>0){
    filtr.freq(250)
  }else{
    filtr.freq(map(constrain(alert,0,200),0,200,20500,500))
  }
  filtr.res(10)
  
}

function respawnObj() {
  let pos = createVector(0, 0, 0)
  let exists = false
  let clone = new Obj(pos.x, pos.y + 0.4, pos.z * grid[pos.y][pos.x].element[2], int(random(20)))


  while (grid[pos.y][pos.x].e != 3 || exists == true || clone.loaded()) {
    pos = createVector(int(random(gsize.x)), int(random(gsize.y)), 0)
    pos.z = int(random(grid[pos.y][pos.x].height))
    if (grid[pos.y][pos.x].e == 3) {
      exists = false
      for (let o of objects) {
        if (o.pos.x == pos.x && o.pos.y == pos.y + 0.4 && o.pos.z == pos.z * grid[pos.y][pos.x].element[2]) {
          exists = true
        }
      }
      if (exists == false) {
        clone = new Obj(pos.x, pos.y + 0.4, pos.z * grid[pos.y][pos.x].element[2], int(random(20)))
      }
    }
  }

  objects.push(new Obj(pos.x, pos.y + 0.4, pos.z * grid[pos.y][pos.x].element[2], int(random(20))))
}

function camMovements(speed) {
  cam.x += (player.pos.x - cam.x) / speed
  cam.y += (player.pos.y - player.size.y / 2 - cam.y) / speed

  cam.x = constrain(cam.x, width / zoom / 2 - 0.5, gsize.x - width / zoom / 2 - 0.5)
  cam.y = constrain(cam.y, height / zoom / 2 - 0.5 - this.T_element[0][2] * 3, gsize.y - height / zoom / 2 - 0.5)

}

function mouseWheel(event) {
  if (debug()){
    zoom -= zoom / event.delta * 30
  }else{
    zoom = width * 60 / 700
  }
}

function tintImage(img, col) {
  let temp = createGraphics(img.width, img.height)
  let context = temp.elt.getContext('2d');
  context.mozImageSmoothingEnabled = false;
  context.webkitImageSmoothingEnabled = false;
  context.msImageSmoothingEnabled = false;
  context.imageSmoothingEnabled = false;
  temp.imageMode(CORNER)
  temp.tint(col)
  temp.image(img, 0, 0, img.width, img.height)
  return temp.get()
}

function debug(){
  return keyIsDown(78)&&keyIsDown(79)
}