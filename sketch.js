let osc, playing, freq, amp;
let osc2, playing2, freq2, amp2, seed;
let fft;
let seed1, seed2, seed3;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.mousePressed(playOscillator);
  cnv.touchStarted(playOscillator);
  osc = new p5.Oscillator("sine");
  osc2 = new p5.Oscillator("sawtooth");
  reverb = new p5.Reverb();
  reverb.process(osc, 2, 1);
  delay = new p5.Delay();
  seed = 0;
  seed1 = random();
  seed2 = random();
  seed3 = random();

  // delay.process() accepts 4 parameters:
  // source, delayTime (in seconds), feedback, filter frequency
  delay.process(osc, 0.3, 0.25, 800);

  reverb2 = new p5.Reverb();
  reverb2.process(osc2, 2, 1);
  delay2 = new p5.Delay();
  delay2.process(osc2, 0.3, 0.25, 800);
  fft = new p5.FFT();

  colorMode(HSB);
}

function draw() {
  seed1 += 0.001;
  seed2 += 0.005;
  seed3 += 0.002;
  
  let backgroundColor = color(noise(seed1)*360, 80, 80, 0.05);
  //print (sin(frameCount * 0.001)*0.5+0.5);
  fill(backgroundColor);
  noStroke();
  rect(0, 0, windowWidth, windowHeight);
  freq = constrain(map(mouseY, height, 0, 30, 1000), 30, 1000);
  amp = constrain(map(mouseX, 0, width, 0, 1), 0.05, 1);
  freq2 = constrain(map(mouseY, height, 0, 33, 1010), 33, 1010);
  amp2 = constrain(map(mouseX, 0, width, 0, 1), 0.05, 1);
  seed += 0.01;

  if (!playing) {
    const pulse = sin(frameCount * 0.05) * 0.5 + 0.5;
    fill(map(pulse, 0, 1, 0, 255));
    textSize(windowHeight / 32);
    textFont("Helvetica");
    textAlign(CENTER, CENTER);
    text("Tap to draw", 150, 80);
  }
  // text('freq: ' + freq, 20, 40);
  // text('amp: ' + amp, 20, 60);

  if (playing) {
    // smooth the transitions by 0.1 seconds
    osc.freq(freq, 0.3);
    osc.amp(amp, 0.3);
    osc2.freq(freq2, 0.3);
    osc2.amp(amp2, 0.3);
    stroke(map(mouseX, 0, width, 360, 0), 100, 100);
    strokeWeight(
      map(mouseY, 0, height, 1, height / 6) +
        map(mouseX, 0, width, 1, width / 12) +
        noise(seed) * 60
    );
    line(mouseX, mouseY, pmouseX, pmouseY);
  }

  let spectrum = fft.waveform();
    noFill();
    beginShape();
    stroke(map(mouseX, 0, width, 360, 0), 100, 100);
    
    strokeWeight(1);
    for (let i = 0; i < spectrum.length; i++) {
      let x = map(i, 0, spectrum.length, 0, width);
      let y = map(spectrum[i], -1, 1, 0, height);
      vertex(x, y);
    }
    endShape();
}

function playOscillator() {
  // starting an oscillator on a user gesture will enable audio
  // in browsers that have a strict autoplay policy.
  // See also: userStartAudio();
  osc.start();
  osc2.start();
  playing = true;
}

function touchStarted(){
  return false;
}

function mouseReleased() {
  // ramp amplitude to 0 over 0.5 seconds
  osc.amp(0, 0.5);
  osc2.amp(0, 0.5);
  playing = false;
}
function windowResized() {
  cnv = resizeCanvas(windowWidth, windowHeight);
}
