class Node{
  constructor(x,y,hitbox){
    this.pos=createVector(x,y)
    this.hitbox=hitbox
    
    this.gCost=0
    this.hCost=0
    
    this.parent=null
  }
  fCost(){
    return this.gCost+this.hCost
  }
}