var rocket;
var population;
var lifespan = 200;
var lifeP;
var count = 0;
var gen = 0;
var target;

function setup() {
  createCanvas(400, 300);
  rocket = new Rocket();
  population = new Population();
  lifeP = createP();
  genP = createP();
  target = createVector(width/2, 10);
}

function draw() {
  background(0);
  population.run();
  
  lifeP.html("Frame: " + count);
  genP.html("Generation: " + gen);
  count++;
  if(count == lifespan){
  	count = 0;
    population.evaluate();
    population.naturalSelection();
    gen++;
  }
  
  ellipse(target.x, target.y, 16, 16);
}

function Population(){
	this.rockets = [];
  this.popsize = 30;
  this.matingPool = [];
  
  for(var i = 0; i < this.popsize; i++){
  	this.rockets[i] = new Rocket();
  }
  
  this.evaluate = function(){
    var maxFit = 0;
    for(var i = 0; i < this.popsize; i++){
  		this.rockets[i].calcFitness();
      if(this.rockets[i].fitness > maxFit){
        maxFit = this.rockets[i].fitness;
      }
    	
  	}
    
    for(var y = 0; y < this.popsize; y++){
  		this.rockets[y].fitness /= maxFit;
    	
  	}
    
    this.matingPool = [];
    
    for(var x = 0; x < this.popsize; x++){
  		var n = this.rockets[x].fitness * 100;
      for(j = 0; j < n; j++){
      	this.matingPool.push(this.rockets[x]);
      }
    	
  	}
  }
  
  this.naturalSelection = function(){
    var newRockets = [];
    for(i = 0; i < this.rockets.length; i++){
      var parentA = random(this.matingPool).dna;
      var parentB = random(this.matingPool).dna;
      var child = parentA.crossover(parentB);
      newRockets[i] = new Rocket(child);
    }
    this.rockets = newRockets;
    
  }
  
  this.run = function(){
  	for(var i = 0; i < this.popsize; i++){
  		this.rockets[i].update();
      this.rockets[i].show();
  	}
  }
}

function DNA(genes){
  
  if(genes){
  	this.genes = genes;
  } else {
    this.genes = [];
    for(var i = 0; i < lifespan; i++){
      this.genes[i] = p5.Vector.random2D();
      this.genes[i].setMag(0.1);
    }
  }
  
  this.crossover = function(partner){
  	var newgenes = [];
    var mid = floor(random(this.genes.length))
    for(var i = 0; i < this.genes.length; i++){
    	if(i > mid){
        newgenes[i] = this.genes[i];
      } else {
      	newgenes[i] = partner.genes[i];
      }
    }
    return new DNA(newgenes);
  }
}

function Rocket(dna){
	this.pos = createVector(width/2, height);
  this.vel = createVector();
  this.acc = createVector();
  if(dna){
  	this.dna = dna
  } else {
    this.dna = new DNA();
    this.fitness = 0;
  }
  this.applyForce = function(force){
  	this.acc.add(force);
  }
  
  this.update = function(){
    this.applyForce(this.dna.genes[count]);
  	this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
  }  
  
  this.calcFitness = function(){
  	var d = dist(this.pos.x, this.pos.y, target.x, target.y);
    
    this.fitness = map(d, 0, width, width, 0);
    
  }
  
  this.show = function(){
    push();
    translate(this.pos.x, this.pos.y);
    fill(random(255),random(255), random(255), 150);
    noStroke();
    rotate(this.vel.heading());
    ellipseMode(CENTER);
    ellipse(0,0,10,10);
    pop();
  }
  
}

