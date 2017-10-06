/*
Testing with Delaunay. 

I'm using a delaunay algorithm found through openprocessing to create a delaunay graphic. I'm just
testing this for future use. Hopefully, I'm okay. 
*/

var allParticles = [];
var maxLevel = 3;

var data = [];
var onPressed, showInstructions;

//Spark more triangle Particles
function Particle(x, y, level){
  this.level = level;
  this.life = 0;
  
  //position
  this.pos = new p5.Vector(x,y);
  //velocity
  this.vel = p5.Vector.random3D();
  //map(value, start1, stop1,start2,stop2)
  this.vel.mult(map(this.level, 0, maxLevel, 7, 2));
  
  this.move = function(){
    this.life++;
    
    this.vel.mult(0.9);
    
    this.pos.add(this.vel);
    
    if(this.life % 20 == 0){
      if(this.level > 0 ){
        this.level -= 1;
        
        var newParticle = new Particle(this.pos.x, this.pos.y,this.level-1);
        allParticles.push(newParticle);
      }
    }
    
    
  }
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
    colorMode(RGB, 360);

  showInstructions = true;
}

function draw() {
  
  //noStroke();
  //fill(0,30);
  rect(0,0, width, height);
  background(100, 0, 100);
    
  if(showInstructions){
    background(100, 0, 100);
    fill(218,122,147);
    textAlign(CENTER, CENTER);
    textSize(26);
    textLeading(36);
    text("Click and Drag to see Delaunay Triangles.", width* 0.5, height*0.5);
  }

  if(onPressed){
    //Move and spawn particles
    //Remove any that is below the velocity threshold
    for(var i =0; i < allParticles.length;i++){
      
      allParticles[i].move();
      
      if(allParticles[i].vel.mag() < 0.01){
        allParticles.splice(i,1);
      }
    }
    
    if(allParticles.length > 0){
      
      //Run script to get points to create triangles with
      data = Delaunay.triangulate(allParticles.map(function(pt) {
        
        return [pt.pos.x, pt.pos.y];
        
      }));
      
      strokeWeight(2);
      
      //Display triangles individually
      for(var i = 0; i < data.length; i +=3){
        
        //Collect particles that make this triangle
        var p1 = allParticles[data[i]];
        var p2 = allParticles[data[i+1]];
        var p3 = allParticles[data[i+2]];
        
        var distThresh = 100;
        //Don't draw trinagle if its area is to big
      if (dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y) > distThresh) {
          continue;
        }
        
        if (dist(p2.pos.x, p2.pos.y, p3.pos.x, p3.pos.y) > distThresh) {
          continue;
        }
        
        if (dist(p1.pos.x, p1.pos.y, p3.pos.x, p3.pos.y) > distThresh) {
          continue;
        }    
        
        
          stroke(165*p1.life*1.5,127,80);
          strokeWeight(1);
         
          fill(165+p1.life*1.5, 30, 60);
       
  
        
        triangle(p1.pos.x, p1.pos.y,
                 p2.pos.x, p2.pos.y, 
                 p3.pos.x, p3.pos.y);
      }
    }
    
  }
  
}

function mouseDragged(){
  allParticles.push(new Particle(mouseX, mouseY, maxLevel));
  onPressed = true;
  
  if(showInstructions){
    showInstructions = false;
  }
}

