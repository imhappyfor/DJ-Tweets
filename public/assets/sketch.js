function setup(){
createCanvas(windowWidth, 500, WEBGL);
maxX = Math.floor(windowWidth/2);    
maxY = Math.floor(windowHeight/2); 
hasMaxed = false;
rectangleWidth = 800;
rectangleHeight = 400;
x = -rectangleWidth/2
y = -rectangleHeight/2
i = 0.0001;
noteWidth = 50;
}
let notes = 20
function draw(){
    if (x){
        
    }
    background(125,20,36);
    // circle()
    for (let x = 0; x < notes*notes; x++){
        fill(x*20*i,50,10*i);
        rect((-maxX + x*noteWidth),0,noteWidth,10);
        i += 0.0001;
    }
    // split view
    // fill('red');
    // rect(-(width/2),-(height/2),width/2,height);


    // fill('blue');
    // rect(0,-(height/2),width/2,height);
    
}
function mousePressed(){
    
}

function windowResized(){
    resizeCanvas(windowWidth, 500);
    
}

function move(){
    if (x!=maxX && y != maxY && !hasMaxed) {
        x += 2
        y += 2
        console.log( x, y, maxX, maxY )
}

    if (x >= maxX || y >= maxY || hasMaxed) {    
        hasMaxed = true
        x -= 10
        y -= 10
    }
}
