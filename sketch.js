// CHANGE YOUR VARIABLES HERE!!! ----------------------------

// Where does the velocity selector end?
// (and the mass selector starts)
// (width of the canvas is 600)
let vSelectorEnd = 400;

// Field strengths
let eFieldStrength = 0.25; // Default 0.25
let bFieldStrength = 0.05; // Default 0.05

// E field acts downward always
// B field acts 90deg to the "left" of the particles velocity

// ----------------------------------------------------------

let particleVelocity = 5; // default velocity

// UI buttons and sliders and text
let velocitySlider;
let velocityText;
let instantiateButton;
let clearButton;

// To keep track of when particles are done simulating
let gotIntoMassSelector = [];
let reEnterVelocitySelector = [];

// List of particles
let particles = [];

// Types of forces (to send to drawForce function)
const ELECTRIC = "electric";
const MAGNETIC = "magnetic";

// Instantiate a particle
function instantiateParticle() {
  let pos = createVector(0, height / 2);
  let vel = createVector(particleVelocity, 0);
  let acc = createVector(0, 0);
  particles.push(new Particle(pos, vel, acc));
  gotIntoMassSelector.push(false);
  reEnterVelocitySelector.push(false);
}

// Clear all particles and free up processing power
function clearParticles() {
  particles = [];
  gotIntoMassSelector = [];
  reEnterVelocitySelector = [];
}

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES); // Working in degrees
  strokeWeight(3); // Thicc lines
  fill(247, 62, 49); // Color of particles
  
  // Setup sliders and buttons and text
  velocitySlider = createSlider(0.3, 20, particleVelocity, 0.1);
  velocityText = createP(`Velocity: ${particleVelocity}`);
  instantiateButton = createButton("Blast 'em!");
  instantiateButton.mousePressed(instantiateParticle);
  clearButton = createButton("Clear");
  clearButton.mousePressed(clearParticles);
}

function draw() {
  
  // Setting particle velocity (for new particles)
  particleVelocity = velocitySlider.value();
  velocityText.html(`Velocity: ${particleVelocity}`);
  
  background(240); // Draw background
  
  // Draw end of velocity selector
  line(vSelectorEnd, 0, vSelectorEnd, height);
  
  // Loop through particles
  let i = 0;
  for (let particle of particles) {
  
    if (!reEnterVelocitySelector[i]) {
      
      // Magnetic field is always applied
      // Start with velocity of particle
      let bFieldForce = particle.vel.copy();
      bFieldForce.rotate(-90); // Rotate 90deg anticlockwise
      // Force proportional to speed, no need to normalize
      bFieldForce.mult(bFieldStrength); // Scale by strength
      particle.drawForce(bFieldForce, MAGNETIC); // Draw

      // Electric field applied when inside velocity selector
      if (particle.pos.x < vSelectorEnd) { 
        
        if (!gotIntoMassSelector[i]) {
          
          // Downward force by electric field
          let eFieldForce = createVector(0, eFieldStrength);
          bFieldForce.add(eFieldForce); // Add to force
          particle.drawForce(eFieldForce, ELECTRIC); // Draw
          
        } else {
          
          // The particle has re-entered the VS!
          reEnterVelocitySelector[i] = true;
          
        }
        
      } else {
        
        // The particle has entered the MS!
        gotIntoMassSelector[i] = true;
        
      }

      // Apply force
      particle.acc = bFieldForce;

      // Particle update
      particle.update();
    }
    
    // Particle show
    particle.show();
    
    // Iterate counter
    i++
  }
}