class Player {
  constructor(pos, w, h, hw, hh, keys, aiState, radius, parent) {
    this.hitbox = createVector(hw, hh)
    if (pos == 'randompos') {
      this.pos = createVector(random(0, gsize.x - 1), random(6, gsize.y - 1))
      while (this.collide()) {
        this.pos = createVector(random(0, gsize.x - 1), random(6, gsize.y - 1))
      }
    } else {
      this.pos = pos
    }
    this.del=false
    this.vel = createVector(0, 0)
    this.acc = createVector(0, 0)
    this.size = createVector(w, h)
    this.keys = keys
    
    this.shelf=null
    this.radius = radius
    this.parent = parent

    this.gpos = null
    if (this.keys) {
      this.aiState = null
      this.contamination = 0
      this.crender = 0
    } else {
      this.aiState = aiState
      this.aiTimer = 0
    }

    //head;eyes;mask;[hair;hair color];[body; body color];[patern:patern color]
    if (this.keys) {
      this.style = playerStyle
    } else {
      //randomized character
      if (this.aiState == 'child') {
        this.style = [this.parent.style[0], int(random(7)), 0, [int(random([0, 1, 2, 3, 7, 8, 9, 10, 11, 12])), this.parent.style[3][1]],
          [int(random(6)), color(random(255), random(255), random(255))],
          [int(random(11)), color(random(255), random(255), random(255))]
        ]
      } else {
        this.style = [random([0, 5, 10]), int(random(7)), 0, [int(random(12)), hairColors[int(random(hairColors.length))]],
          [int(random(6)), color(random(255), random(255), random(255))],
          [int(random(11)), color(random(255), random(255), random(255))]
        ]
      }
    }
    this.bodyparts = [T_player[0].get(10 * this.style[0], 0, 10, 18),
      T_player[1].get(10 * this.style[1], 0, 10, 18),
      T_player[2].get(10 * this.style[2], 0, 10, 18),
      tintImage(T_player[3].get(10 * this.style[3][0], 0, 10, 18), this.style[3][1]),
      tintImage(T_player[4].get(10 * this.style[4][0], 0, 10, 18), this.style[4][1]),
      tintImage(T_player[5].get(10 * this.style[5][0], 0, 10, 18), this.style[5][1]),
      tintImage(T_player[6].get(10 * this.style[3][0], 0, 10, 18), this.style[3][1])
    ]
    if (red(this.style[3][1]) == red(hairColors[hairColors.length - 1]) && green(this.style[3][1]) == green(hairColors[hairColors.length - 1]) && blue(this.style[3][1]) == blue(hairColors[hairColors.length - 1])) {
      this.radius *= 2
    } else if (this.aiState == 'looking' || this.aiState == 'entering') {
      if (random(1) < 0.1) {
        let s = random(1.2, 1.7)
        AIs.push(new Player(this.pos.copy(), 0.72 / s, 0.72 / s * 18 / 10, 0.43, 0.05, null, 'child', 0.7, this))
      }
    }
  }
  update() {
    if (this.keys) {
      //player code
      if (this.contamination<100){
        this.playerControls(0.03, 0.7)
      }else{
        this.vel=createVector()
      }
      //this.AIControls()
    } else {
      //AIs code
      this.AIControls()
    }
  }
  render() {
    push()
    translate((this.pos.x - cam.x - this.size.x / 2) * zoom, (this.pos.y - cam.y - this.size.y) * zoom)
    translate(0, map(sin(timer / 2), -1, 1, 0, -this.size.y * zoom * this.vel.mag()))
    imageMode(CORNER)
    //body+patern
    image(this.bodyparts[4], 0, 0, this.size.x * zoom, this.size.y * zoom)
    image(this.bodyparts[5], 0, 0, this.size.x * zoom, this.size.y * zoom)

    translate(0, map(sin(timer / 2 - PI / 2), -1, 1, 0, -this.size.y * zoom * this.vel.mag()))
    //head
    image(this.bodyparts[0], 0, 0, this.size.x * zoom, this.size.y * zoom)
    if (this.vel.y > -0.001 && this.aiState != 'looking') {
      //front view
      image(this.bodyparts[1], 0, 0, this.size.x * zoom, this.size.y * zoom)
      image(this.bodyparts[2], 0, 0, this.size.x * zoom, this.size.y * zoom)
      image(this.bodyparts[3], 0, 0, this.size.x * zoom, this.size.y * zoom)
    } else {
      //back view
      image(this.bodyparts[6], 0, 0, this.size.x * zoom, this.size.y * zoom)
    }
    pop()
    if (debug()) {
      rectMode(CENTER)
      fill(0, 255, 0, 100)
      stroke(0, 255, 0)
      rect((this.pos.x - cam.x) * zoom, (this.pos.y - cam.y) * zoom, this.hitbox.x * zoom, this.hitbox.y * zoom)

      if (!this.keys) {
        fill(0)
        stroke(255)
        strokeWeight(zoom / 50)
        textAlign(CENTER, CENTER)
        textSize(zoom / 3)
        text(this.aiState, (this.pos.x - cam.x) * zoom, (this.pos.y - cam.y - this.size.y) * zoom)
        text(this.aiTimer, (this.pos.x - cam.x) * zoom, (this.pos.y - cam.y - this.size.y * 1.2) * zoom)
      }
    }
    if (this.keys) {
      this.renderGUI()
    }

  }
  renderRadius() {
    if (this != player) {
      let d = constrain(this.pos.dist(player.pos), this.radius, this.radius * 4)

      if (map(d, this.radius, this.radius * 4, 100, 0) != 0 && this.aiLineOfSight()) {
        noFill()
        strokeWeight(zoom / 20)
        stroke(255, 0, 0, map(d, this.radius, this.radius * 4, 100, 0))
        circle((this.pos.x - cam.x) * zoom, (this.pos.y - cam.y) * zoom, this.radius * zoom * 2, this.radius * zoom * 2)
      }
    }
  }
  aiLineOfSight() {
    let pos = this.pos.copy()
    while (pos.dist(player.pos) > 1) {
      pos.add(p5.Vector.sub(player.pos, pos).setMag(0.9))
      if (pos.x>=0 && pos.y>=0 && pos.x<gsize.x && pos.y<gsize.y && grid[int(pos.y + 0.5)][int(pos.x + 0.5)].hitbox) {
        return false
      }
    }
    return true

  }



  playerControls(speed, friction) {
    this.vel.x += (keyIsDown(39)||keyIsDown(68)) * speed + (keyIsDown(37)||keyIsDown(81)) * -speed
    this.vel.x *= friction
    this.pos.x += this.vel.x
    if (this.collide()) {
      while (this.collide()) {
        this.pos.x += abs(this.vel.x) / this.vel.x * -1 / zoom
      }
    }
    this.vel.y += (keyIsDown(40)||keyIsDown(83)) * speed + (keyIsDown(38)||keyIsDown(90)) * -speed
    this.vel.y *= friction
    this.pos.y += this.vel.y


    if (this.collide()) {
      while (this.collide()) {
        this.pos.y += abs(this.vel.y) / this.vel.y * -1 / zoom
      }
    }
    if (this.playerToClose()) {
      this.contamination += 1
    }

  }
  playerToClose() {
    for (let ai of AIs) {
      if (this.pos.dist(ai.pos) < ai.radius && this.contamination < 100 && ai.aiLineOfSight()) {
        return true
      }
    }
    return false
  }

  renderGUI() {
    this.crender += (this.contamination - this.crender) / 20

    let a = map(max(abs(this.vel.x), abs(this.vel.y)), 0, 0.07, 255, 0)
    if (this.playerToClose()) {
      a = 255
    }

    push()
    translate((this.pos.x - cam.x) * zoom, (this.pos.y - cam.y - this.size.y * 1.3) * zoom)
    rectMode(CORNER)

    noStroke()
    fill(30, a)

    rect(-this.size.x * zoom * 2 / 2, 5, this.size.x * zoom * 2, zoom / 5)

    fill(232, 51, 51, a)
    let w = map(this.crender, 0, 100, 0, this.size.x * zoom * 2)
    rect(-this.size.x * zoom * 2 / 2, 5, w, zoom / 5)

    stroke(255, a)
    strokeWeight(zoom / 30)
    noFill()
    rect(-this.size.x * zoom * 2 / 2, 5, this.size.x * zoom * 2, zoom / 5)

    fill(30, a)
    stroke(255, a)
    strokeWeight(zoom / 50)
    textAlign(CENTER, CENTER)
    textSize(zoom / 4)
    textFont(font)
    text(int(this.contamination) + '%', 0, 0.4)

    fill(30)
    stroke(255)
    strokeWeight(zoom / 30)
    let sz = map(sin(timer / 20), -1, 1, zoom / 4 + map(a, 0, 255, 0.2, 0) * zoom, zoom / 3 + map(a, 0, 255, 0.2, 0) * zoom)

    circle(0, -zoom / 2.5 + map(a, 0, 255, 0.25, 0) * zoom, zoom / 2 + sz / 3)

    imageMode(CENTER)

    image(T_objects, 0, -zoom / 2.5 + map(a, 0, 255, 0.25, 0) * zoom, sz, sz, finding * 8, 0, 8, 8)
    pop()


    push()
    translate((this.pos.x - cam.x) * zoom, (this.pos.y - cam.y - this.size.y * 1.3 - 0.4) * zoom + map(a, 0, 255, 0.25, 0) * zoom)
    rotate(p5.Vector.sub(this.getClosestObj(this.pos).pos, this.pos).heading() + PI / 2)
    fill(255, 0, 0, map(a, 0, 255, 255, 0))
    stroke(128, 0, 0, map(a, 0, 255, 255, 0))
    strokeWeight(zoom / 30)
    triangle(-zoom / 8, -zoom / 3, zoom / 8, -zoom / 3, 0, -zoom / 4 - zoom / 3)
    pop()


  }
  getClosestObj(pos) {
    let bestDist = Infinity
    let bestObj = null
    for (let o of objects) {
      if (o.t == finding && o.pos.dist(pos) < bestDist) {
        bestDist = o.pos.dist(pos)
        bestObj = o
      }
    }
    return bestObj
  }

  /*
  ______________________________
  PATHFINDING STUFF HERE
  ______________________________
  */
  AIUpdate() {
    this.pos.x += this.vel.x
    if (this.collide()) {
      while (this.collide()) {
        this.pos.x += abs(this.vel.x) / this.vel.x * -1 / zoom
      }
    }
    this.pos.y += this.vel.y


    if (this.collide()) {
      while (this.collide()) {
        this.pos.y += abs(this.vel.y) / this.vel.y * -1 / zoom
      }
    }
    this.vel.add(this.acc)
    this.acc.mult(0)
  }
  AIseek(target, force, steerForce) {
    let desired = p5.Vector.sub(target, this.pos)
    desired.setMag(force)
    let st = p5.Vector.sub(desired, this.vel)
    st.limit(steerForce)
    this.acc.add(st)
  }

  AIControls() {
    if (this.aiState == 'child') {
      if (this.parent.pos.dist(this.pos) > 0.5) {
        this.AIseek(this.parent.pos, 0.03, 0.001)
      } else {
        this.vel = createVector(0, 0)
      }
      if (this.parent.del){
          this.del=true
        }
    } else if (this.aiState == 'looking') {
      this.vel = createVector(0, 0)
      if (this.aiTimer == 0) {
        if (random(1) < 0.1) {
          //exiting shop
          let caisses=0
          for (let ai of AIs){
            if (ai.aiState=='still'){
              caisses++
            }
          }
          this.generateExitGrid(int(random(0,caisses)))
          this.findPath(createVector(int(this.pos.x),int(this.pos.y)),createVector(int(random(1,3)),0))
          if (this.path!=null){
            this.aiState='exiting'
          }
        } else {
          //looking for shelf
          this.findPathToShelf()
        }
      } else {
        this.aiTimer--
      }
    } else if (this.aiState == 'moving') {
      if (this.path.length == 0) {
        this.aiTimer = int(random(120, 180))
        this.shelf=null
        this.aiState = 'looking'
      } else {
        if (this.pos.dist(this.path[0].pos.copy().add(this.gpos)) < 0.05) {
          this.path.splice(0, 1)
        } else {
          this.AIseek(this.path[0].pos.copy().add(this.gpos), 0.03, 0.003)
        }


      }
    }else if (this.aiState == 'exiting'){
      if (this.path.length == 0) {
        this.vel=createVector(0,-0.03)
        if (this.pos.y<-5){
          this.del=true
        }
      } else {
        if (this.pos.dist(this.path[0].pos.copy().add(this.gpos)) < 0.05) {
          this.path.splice(0, 1)
        } else {
          if (this.pos.y>3 && this.pos.y<5){
            this.AIseek(this.path[0].pos.copy().add(this.gpos), 0.01, 0.003)
          }else{
          this.AIseek(this.path[0].pos.copy().add(this.gpos), 0.03, 0.003)
          }
        }


      }
    }else if (this.aiState=='entering'){
      this.vel=createVector(0,0.03)
      if (this.pos.y>5 && random(1)<0.01){
        this.findPathToShelf()
      }
    }
    if (debug()) {
      this.renderPathfindingGrid()
    }

    this.AIUpdate()
  }
  findPathToShelf(){
    this.generatePathfindingGrid(20, 20)
    let s = shelves[int(random(shelves.length))]
    while (max(abs(this.pos.x-s.pos.x),abs(this.pos.y-s.pos.y)) > 8) {
      s = shelves[int(random(shelves.length))]
    }
    let sellfAlreadyTaken=false
    for (let ai of AIs){
      if (ai.shelf && ai.shelf==s){
        return
      }
    }
    
    this.shelf=s
    this.path = null
    this.findPath(createVector(10, 10), createVector(int(s.pos.x - this.gpos.x), int(s.pos.y + 1 - this.gpos.y)))
    if (this.path != null && this.path.length > 0) {
      this.aiState = 'moving'
    }
    
    
  }

  renderPathfindingGrid() {
    if (this.path) {
      stroke(0, 100)
      strokeWeight(zoom / 30)
      noFill()
      beginShape()
      vertex((this.pos.x - cam.x) * zoom, (this.pos.y - cam.y) * zoom)
      for (let p of this.path) {
        vertex((this.gpos.x + p.pos.x - cam.x) * zoom, (this.gpos.y + p.pos.y - cam.y) * zoom)
      }
      endShape()
      stroke(255, 0, 0)
      strokeWeight(zoom / 10)
      for (let p of this.path) {
        point((this.gpos.x + p.pos.x - cam.x) * zoom, (this.gpos.y + p.pos.y - cam.y) * zoom)
      }
    }
    stroke(0, 0, 255)
    strokeWeight(zoom / 20)
    line((this.pos.x - cam.x) * zoom, (this.pos.y - cam.y) * zoom, (this.pos.x - cam.x + this.vel.x * 20) * zoom, (this.pos.y - cam.y + this.vel.y * 20) * zoom)
  }
  generatePathfindingGrid(w, h) {
    this.g = []
    this.gpos = createVector(int(this.pos.x + 0.5) - w / 2, int(this.pos.y + 0.5) - h / 2)
    for (let y = this.gpos.y; y < this.gpos.y + h; y++) {
      this.g[y - this.gpos.y] = []
      for (let x = this.gpos.x; x < this.gpos.x + w; x++) {
        if (x >= 0 && x < gsize.x && y >= 6 && y < gsize.y) {
          this.g[y - this.gpos.y][x - this.gpos.x] = new Node(x - this.gpos.x, y - this.gpos.y, grid[y][x].hitbox)
        } else {
          this.g[y - this.gpos.y][x - this.gpos.x] = new Node(x - this.gpos.x, y - this.gpos.y, true)
        }
      }
    }
  }
  generateExitGrid(caisse) {
    this.g = []
    this.gpos = createVector(0, 0)
    for (let y = 0; y < gsize.y; y++) {
      this.g[y] = []
      for (let x = 0; x < gsize.x; x++) {
        if (y==5 && x!=4+caisse*4){
          this.g[y][x] = new Node(x, y, true)
        }else{
          this.g[y][x] = new Node(x, y, grid[y][x].hitbox)
        }
      }
    }
  }

  getNeighbors(node) {
    let n = []
    if (node.pos.x != 0 && !this.g[node.pos.y][node.pos.x - 1].hitbox) {
      n.push(this.g[node.pos.y][node.pos.x - 1])
    }
    if (node.pos.y != 0 && !this.g[node.pos.y - 1][node.pos.x].hitbox) {
      n.push(this.g[node.pos.y - 1][node.pos.x])
    }
    if (node.pos.y != this.g.length - 1 && !this.g[node.pos.y + 1][node.pos.x].hitbox) {
      n.push(this.g[node.pos.y + 1][node.pos.x])
    }
    if (node.pos.x != this.g[0].length - 1 && !this.g[node.pos.y][node.pos.x + 1].hitbox) {
      n.push(this.g[node.pos.y][node.pos.x + 1])
    }

    //diagonals
    if (node.pos.x != 0 && node.pos.y != 0 && !this.g[node.pos.y - 1][node.pos.x - 1].hitbox && (!this.g[node.pos.y][node.pos.x - 1].hitbox && !this.g[node.pos.y - 1][node.pos.x].hitbox)) {
      n.push(this.g[node.pos.y - 1][node.pos.x - 1])
    }
    if (node.pos.x != 0 && node.pos.y != this.g.length - 1 && !this.g[node.pos.y + 1][node.pos.x - 1].hitbox && (!this.g[node.pos.y + 1][node.pos.x].hitbox && !this.g[node.pos.y][node.pos.x - 1].hitbox)) {
      n.push(this.g[node.pos.y + 1][node.pos.x - 1])
    }
    if (node.pos.x != this.g[0].length - 1 && node.pos.y != 0 && !this.g[node.pos.y - 1][node.pos.x + 1].hitbox && (!this.g[node.pos.y][node.pos.x + 1].hitbox && !this.g[node.pos.y - 1][node.pos.x].hitbox)) {
      n.push(this.g[node.pos.y - 1][node.pos.x + 1])
    }
    if (node.pos.x != this.g[0].length - 1 && node.pos.y != this.g.length - 1 && !this.g[node.pos.y + 1][node.pos.x + 1].hitbox && (!this.g[node.pos.y + 1][node.pos.x].hitbox && !this.g[node.pos.y][node.pos.x + 1].hitbox)) {
      n.push(this.g[node.pos.y + 1][node.pos.x + 1])
    }

    return n
  }

  getDistance(nodeA, nodeB) {
    let dstX = abs(nodeA.pos.x - nodeB.pos.x)
    let dstY = abs(nodeA.pos.y - nodeB.pos.y)

    if (dstX > dstY) {
      return 14 * dstY + 10 * (dstX - dstY)
    }
    return 14 * dstX + 10 * (dstY - dstX)
  }
  findPath(startPos, targetPos) {
    this.path = null
    this.startNode = this.g[startPos.y][startPos.x]
    this.targetNode = this.g[targetPos.y][targetPos.x]
    if (!this.startNode.hitbox && !this.targetNode.hitbox) {
      this.openSet = [this.startNode]
      this.closedSet = []

      while (this.openSet.length > 0) {
        let currentNode = this.openSet[0]
        for (let i = 1; i < this.openSet.length; i++) {
          if (this.openSet[i].fCost() < currentNode.fCost() || this.openSet[i].fCost() == currentNode.fCost() && this.openSet[i].hCost < currentNode.hCost) {
            currentNode = this.openSet[i]
          }
        }
        this.removeFromList(this.openSet, currentNode)
        this.closedSet.push(currentNode)
        if (currentNode == this.targetNode) {
          this.retracePath(this.startNode, this.targetNode)
          return
        }

        for (let n of this.getNeighbors(currentNode)) {
          if (n.hitbox || this.closedSet.includes(n)) {
            continue
          }
          let newMovementCost = currentNode.gCost + this.getDistance(currentNode, n)
          if (newMovementCost < n.gCost || !this.openSet.includes(n)) {
            n.gCost = newMovementCost
            n.hCost = this.getDistance(n, this.targetNode)
            n.parent = currentNode
            if (!this.openSet.includes(n)) {
              this.openSet.push(n)
            }
          }
        }
      }
    }
    //print('no path found')
  }
  retracePath(startNode, targetNode) {
    this.path = []
    let currentNode = targetNode
    while (currentNode != startNode) {
      this.path.push(currentNode)
      currentNode = currentNode.parent
    }
    this.path.push(startNode)
    let waypoints = this.simplifyPath(this.path.slice())
    waypoints.reverse()
    this.path = waypoints.slice()
  }
  simplifyPath(path) {
    let waypoints = []
    let oldDirection = createVector(1000, 1000)
    for (let i = 1; i < path.length; i++) {
      let newDirection = createVector(path[i - 1].pos.x - path[i].pos.x, path[i - 1].pos.y - path[i].pos.y)
      if (oldDirection.x != newDirection.x || oldDirection.y != newDirection.y) {
        waypoints.push(path[i - 1])
      }
      oldDirection = newDirection
    }

    return waypoints
  }
      
  removeFromList(list, item) {
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i] == item) {
        list.splice(i, 1)
        return
      }
    }
  }

  collide() {
    for (let y = floor(this.pos.y) - 1; y <= ceil(this.pos.y) + 1; y++) {
      for (let x = floor(this.pos.x) - 1; x <= ceil(this.pos.x) + 1; x++) {

        if (x >= 0 && x < gsize.x && y >= 0 && y < gsize.y) {
          if (grid[y][x].hitbox) {
            if (this.collideWith(createVector(grid[y][x].pos.x - 1 / 2, grid[y][x].pos.y - 1 / 2), createVector(grid[y][x].pos.x + 1 / 2, grid[y][x].pos.y + 1 / 2))) {
              return true
            }
          }
        }

      }
    }
    if (this.collideWith(createVector(0, gsize.y - 0.5), createVector(gsize.x, gsize.y + 0.5))) {
      return true
    }
    if (this.keys && this.collideWith(createVector(0, -1.5), createVector(3, -0.5))) {
      return true
    }
    return false
  }

  collideWith(p1, p2) {
    let l1 = createVector(this.pos.x - this.hitbox.x / 2, this.pos.y - this.hitbox.y / 2)
    let r1 = createVector(this.pos.x + this.hitbox.x / 2, this.pos.y + this.hitbox.y / 2)
    let l2 = p1
    let r2 = p2

    if (l1.x >= r2.x || l2.x >= r1.x) {
      return false
    }
    if (l1.y >= r2.y || l2.y >= r1.y) {
      return false
    }
    return true


  }

  loaded() {
    return this.collideWith(createVector(cam.x - width / zoom / 2, cam.y - height / zoom / 2 - this.size.x / 2), createVector(cam.x + width / zoom / 2 + this.size.x / 2, cam.y + height / zoom / 2 + this.size.y))


  }
}