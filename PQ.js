class PQ{
  constructor(){
    this.size=width/random(10,20)
    this.pos=createVector(random(width),-this.size)
    this.del=false
    this.rotation=random(-PI,PI)
    this.rotSpeed=random(0.01,0.03)
    this.sprite=tintImage(T_objects.get(136,0,8,8),color(255,50))
  }
  update(){
    this.rotation+=this.rotSpeed
    this.pos.y+=map(this.size,width/10,width/20,5,2)
    if (this.pos.y>height+this.size){
      this.del=true
    }
    this.render()
  }
  render(){
    push()
    translate(this.pos.x,this.pos.y)
    rotate(this.rotation)
    imageMode(CENTER)
    image(this.sprite,0,0,this.size,this.size)
    pop()
  }
}