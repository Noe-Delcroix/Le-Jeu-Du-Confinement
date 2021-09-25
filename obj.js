class Obj {
  constructor(x, y, z, t) {
    this.pos = createVector(x, y, z)
    this.size = 0.4
    this.t = t
    this.sprite = T_objects.get(8 * t, 0, 8, 8)
    this.xOffsetRender=random(-0.2,0.2)
    this.del=false

  }
  render() {
    if (finding == this.t) {
      push()
      translate((this.pos.x - cam.x + this.xOffsetRender) * zoom, (this.pos.y - cam.y - this.pos.z - this.size / 2) * zoom)
      rotate(timer / 20)
      imageMode(CENTER)
      let s = sin(timer / 20, -1, 1, 0, 1)
      image(T_pinwheel, 0, 0, this.size * 2 * zoom * s, this.size * 2 * zoom * s)
      pop()

    }
    push()
    translate((this.pos.x - cam.x - this.size / 2 + this.xOffsetRender) * zoom, (this.pos.y - cam.y - this.size - this.pos.z) * zoom)
    imageMode(CORNER)
    image(this.sprite, 0, 0, this.size * zoom, this.size * zoom)
    pop()
  }
  update(){
    if (finding==this.t && player.pos.y>this.pos.y && createVector(this.pos.x,this.pos.y).dist(player.pos)<0.51){
      
      respawnObj()
      
      S_sounds[0].play()
      collectedObj.push(this.t)
      this.del=true
      let f=finding
      while (player.getClosestObj(player.pos)==null || finding==f || player.getClosestObj(player.pos)<0.51){
        finding=int(random(20))
      }
    }
  }
  
  
  collideWith(p1, p2) {
    let l1 = createVector(this.pos.x + this.xOffsetRender - this.size / 2, this.pos.y - this.pos.z - this.size / 2)
    let r1 = createVector(this.pos.x + this.xOffsetRender + this.size / 2, this.pos.y - this.pos.z + this.size / 2)
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
    return this.collideWith(createVector(cam.x - width / zoom / 2, cam.y - height / zoom / 2 - this.size / 2), createVector(cam.x + width / zoom / 2 + this.size / 2, cam.y + height / zoom / 2 + this.size))

  }
}