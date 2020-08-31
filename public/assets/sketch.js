function setup(){
createCanvas(windowWidth, 500);
// maxX = Math.floor(windowWidth/2);    
// maxY = Math.floor(500/2); 
// hasMaxed = false;
// rectangleWidth = 800;
// rectangleHeight = 400;
// x = -rectangleWidth/2
// y = -rectangleHeight/2
// i = 0.0001;
// noteWidth = 50;
searchQuery = 'andrewyang'
musicalData = undefined
// onePass = false
}
function notesToSketch(data){
    clear();
    
    musicalData = {}
    musicalData["data"] = data;
    musicalData["totalTime"] =  data[data.length - 1]["endTime"] - data[0]["startTime"];
    musicalData["highestPitch"] = data[Object.keys(data).reduce(function(a, b){ 
        return data[a]["pitch"] > data[b]["pitch"] ? a : b
    })]["pitch"];
    musicalData["lowestPitch"] = data[Object.keys(data).reduce(function(a, b){ 
        return data[a]["pitch"] < data[b]["pitch"] ? a : b
    })]["pitch"];
    console.log(musicalData["data"],Tone.now())
}

function draw(){
    
    background(50,20,96);
    // for (let x = 0; x < notes*notes; x++){
    //     fill(x*20*i,50,10*i);
    //     rect((-maxX + x*(noteWidth/windowWidth)*noteWidth),0,(noteWidth/windowWidth)*noteWidth,10);
    //     i += 0.0001;
    // }
    
    displayNotes(musicalData);
    

    // SPLIT VIEW EXAMPLE
        // fill('red');
        // rect(-(width/2),-(height/2),width/2,height);
        // fill('blue');
        // rect(0,-(height/2),width/2,height);
    
}

function stopDraw(){
    musicalData = undefined
}
function displayNotes(a){
    if(a){
        for (let note = 0; note < a["data"].length; note++){
            let currentTime = synth.context.transport.now()
            let noteDuration = a["data"][note]["endTime"] - a["data"][note]["startTime"]
            let multiplier = windowWidth/a["totalTime"]
            fill(20,50,10);
            if (note == a["data"].length-1){
                // console.log(note)
                // console.log(a["data"][note])
                fill('blue');
            }
            if ( a["data"][note]["startTime"] <= currentTime){
            fill('white')
            }
            rect(
                // x
                a["data"][note]["startTime"] * multiplier
            // note * noteDuration/a["totalTime"] *  windowWidth
            // y
            // ,500/2

            ,a["data"][note]["pitch"]
            // ,((a["data"][note]["pitch"] / (a["highestPitch"] - a["lowestPitch"])) * a["data"][note]["pitch"] ) 
            // width
            , noteDuration * multiplier
            // ,noteDuration/a["totalTime"] *  windowWidth
            // height
            ,20
            );
            
        }
    }
    return
}

// 60.23529411764706 2560 42.5

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
