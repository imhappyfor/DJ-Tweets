function setup(){
createCanvas(windowWidth, 500, WEBGL);
maxX = Math.floor(windowWidth/2);    
maxY = Math.floor(windowHeight/2); 
hasMaxed = false;
rectangleWidth = 800;
rectangleHeight = 400;
x = -rectangleWidth/2
y = -rectangleHeight/2
// container = function(){return rect(x,y,rectangleWidth,rectangleHeight) }
}
// let matrix = 3
function draw(x){
    if (x){
        
    }
    
    background(125,20,36);
    circle()
    // for (let x = 0; x < matrix*matrix; x++){
    //     fill(x*20,50,x*12);
    //     rect((20 + x*20),(20 - x*20),20,20);
    // }
    
    
    // container();
    fill('red');
    rect(-(width/2),-(height/2),width/2,height);


    fill('blue');
    rect(0,-(height/2),width/2,height);
    
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
