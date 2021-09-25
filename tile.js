class Tile {
  constructor(x, y, hitbox, ground, element, height) {
    this.pos = createVector(x, y)
    this.hitbox = hitbox
    if (ground == null) {
      this.ground = ground
    } else {
      this.ground = T_ground[ground]
      this.randground = random(1)
      let check = 0
      for (let i = 0; i < this.ground[4].length; i++) {
        check += this.ground[4][i]
        if (this.randground < check) {
          this.randground = i
          break
        }
      }
    }
    this.e=element
    if (element == null) {
      this.element = element
    } else {
      this.element = T_element[element]

      this.randelement = []
      for (let j = 0; j < height; j++) {
        let r = random(1)
        let check = 0
        for (let i = 0; i < this.element[4].length; i++) {
          check += this.element[4][i]
          if (r < check) {
            r = i
            break
          }
        }
        this.randelement.push(r)
      }
    }
    this.height = height
//     if (element==3){
//       for (let z=0;z<this.height;z++){
//         if (random(1)<0.5){
//           objects.push(new Obj(this.pos.x,this.pos.y+0.4,z*this.element[2],int(random(20))))

//         }
//       }
//     }
    this.randomAnimationStart=random(100000)
  }
  render() {
    imageMode(CENTER)
    if (this.ground != null) {
      if (this.ground[3] == 'random') {
        image(this.ground[0], (this.pos.x - cam.x) * zoom, (this.pos.y - cam.y) * zoom, zoom, zoom, 0, this.ground[1] * this.randground, this.ground[0].width, this.ground[1])
      } else if (this.ground[3] == 'animated') {
        image(this.ground[0], (this.pos.x - cam.x) * zoom, (this.pos.y - cam.y) * zoom, zoom, zoom, 0, this.ground[1] * (int(((timer+this.randomAnimationStart) * this.ground[4]) % (this.ground[0].height/this.ground[1]))), this.ground[0].width, this.ground[1])
      } else {
        image(this.ground[0], (this.pos.x - cam.x) * zoom, (this.pos.y - cam.y) * zoom, zoom, zoom)
      }
    }
    if (this.element != null) {
      for (let y = 0; y < this.height; y++) {
        if (this.element[3] == 'random') {
          image(this.element[0], (this.pos.x - cam.x) * zoom, (this.pos.y - cam.y - this.element[2] * y -(this.element[1]-16)*1/16/2) * zoom , zoom, zoom * this.element[1] / this.element[0].width, 0, this.element[1] * this.randelement[y], this.element[0].width, this.element[1])
        } else if (this.element[3] == 'animated') {
          image(this.element[0], (this.pos.x - cam.x) * zoom, (this.pos.y - cam.y - this.element[2] * y -(this.element[1]-16)*1/16/2) * zoom , zoom, zoom * this.element[1] / this.element[0].width, 0, this.element[1] * (int(((timer+this.randomAnimationStart) * this.element[4]) % (this.element[0].height/this.element[1]))), this.element[0].width, this.element[1])
        }
      }

    }
    if (this.hitbox && debug()){
      rectMode(CENTER)
      stroke(0,255,0)
      strokeWeight(zoom/20)
      fill(0,255,0,100)
      rect((this.pos.x - cam.x) * zoom, (this.pos.y - cam.y) * zoom, zoom, zoom)
    }
  }
} 