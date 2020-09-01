function setup(render){
    if(render){
        createCanvas(windowWidth, 500);
    }
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
onePass = false
canDraw = false
tweetDiv = document.createElement('div');
emotionParagraph = document.createElement('p');
tweetParagraph = document.createElement('p');
hasReached = false
tweetParagraph.setAttribute('id','tweetParagraph');
emotionParagraph.setAttribute('id','emotionParagraph');
tweetDiv.style.display = "flex";
tweetDiv.style.flexDirection= "column";
tweetDiv.style.justifyContent ="center";
tweetDiv.style.alignItems = "center";
tweetParagraph.style.fontSize = "24px"
emotionParagraph.style.fontSize = "24px"
tweetParagraph.style.color = 'whitesmoke'
emotionParagraph.style.color = 'whitesmoke'
tweetDiv.appendChild(emotionParagraph);
tweetDiv.appendChild(tweetParagraph);
document.body.appendChild(tweetDiv);
}
function notesToSketch(data){
    setup(true);
    clear();
    canDraw = true;
    loadingScreen(false)
    musicalData = {}
    musicalData["data"] = data;
    musicalData["totalTime"] =  data[data.length - 1]["endTime"] - data[0]["startTime"];
    musicalData["highestPitch"] = data[Object.keys(data).reduce(function(a, b){ 
        return data[a]["pitch"] > data[b]["pitch"] ? a : b
    })]["pitch"];
    musicalData["lowestPitch"] = data[Object.keys(data).reduce(function(a, b){ 
        return data[a]["pitch"] < data[b]["pitch"] ? a : b
    })]["pitch"];

}

function draw(){
    if (canDraw)
    {   
        
        background(50,20,96);
        drawNotesAndEmotion(musicalData);
    }
    
    // for (let x = 0; x < notes*notes; x++){
    //     fill(x*20*i,50,10*i);
    //     rect((-maxX + x*(noteWidth/windowWidth)*noteWidth),0,(noteWidth/windowWidth)*noteWidth,10);
    //     i += 0.0001;
    // }
    
    
    

    // SPLIT VIEW EXAMPLE
        // fill('red');
        // rect(-(width/2),-(height/2),width/2,height);
        // fill('blue');
        // rect(0,-(height/2),width/2,height);
    
}

function stopDraw(){
    musicalData = undefined
}

function updateTweetData(tweetData){
    document.getElementById("emotionParagraph").textContent = tweetData[0]
    document.getElementById("tweetParagraph").textContent = tweetData[1]
}

function drawNotesAndEmotion(a){
    background(50,20,96);
    if(a){
        if(!onePass){
            a["data"]
            onePass = true;
        }
        for (let note = 0; note < a["data"].length; note++){

            let currentTime = synth.context.transport.now()
            let noteDuration = a["data"][note]["endTime"] - a["data"][note]["startTime"]
            let multiplier = windowWidth/a["totalTime"]
            fill(20,50,10);
            // if (note == a["data"].length-1){
            //     // console.log(note)
            //     // console.log(a["data"][note])
            //     fill('blue');
            // }





            if ( a["data"][note]["startTime"] <= currentTime){
                fill('white');

                updateTweetData(
                [`Tweet Emotion: ${a["data"][note]['emotion']}`,
                `Tweet: ${a["data"][note]['tweet']}`]
                )


                // textSize(32);
                // textAlign(CENTER);
                // text(`Tweet Emotion: ${a["data"][note]['emotion']}`, width/2, height*0.70);
                // textSize(12);
                // textAlign(CENTER);
                // text(`Tweet: ${a["data"][note]['tweet']}`, width/2, height*0.80);
                // fill('white')
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

            if ( musicalData["totalTime"] <= currentTime && !hasReached){
                clear();
                console.log('reached')
                hasReached = true;
                // remove lower tweet div
                tweetDiv.remove();
                emotionParagraph.remove();
                tweetParagraph.remove();
                // add button to refresh div
                let reloadButton = document.createElement('button');
                reloadButton.textContent = 'Try with another user';
                playButton.addEventListener("click",reloadPage);
                document.body.appendChild(reloadButton);
            }
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
