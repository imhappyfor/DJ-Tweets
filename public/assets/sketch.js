function setup(){
createCanvas(windowWidth, 500, WEBGL);
maxX = Math.floor(windowWidth/2);    
maxY = Math.floor(windowHeight/2); 
hasMaxed = false;
rectangleWidth = 800;
rectangleHeight = 400;
x = -rectangleWidth/2;
y = -rectangleHeight/2;
lhasChanged = false;
rhasChanged = false;
// container = function(){return rect(x,y,rectangleWidth,rectangleHeight) }
}
// let matrix = 3
function draw(left,right,leftSequence, rightSequence){
    // console.log(left,right)
    
    background(125,20,36);
    circle()
    // for (let x = 0; x < matrix*matrix; x++){
    //     fill(x*20,50,x*12);
    //     rect((20 + x*20),(20 - x*20),20,20);
    // }
    
    // if (x){
        
    // }
    
    // container();
    if (right) {
        rhasChanged = true;
        fill(120,Math.floor(Math.random()*100+1),Math.floor(Math.random()*120)+1);
        rect(-(width/2),-(height/2),width/2,height);
    }
    else {
        // fill('green')
        // translate(0, 0, 1);
        // push();
        // rotateZ(frameCount * 0.01);
        // rotateX(frameCount * 0.01);
        // rotateY(frameCount * 0.01);
        // torus(70, 10);
        // pop();
        fill('blue');
        rect(-(width/2),-(height/2),width/2,height);
    }

    if (left || lhasChanged){
        lhasChanged = true;
        fill('purple');
        rect(0,-(height/2),width/2,height);
    }
    else {
        fill('red');
        rect(0,-(height/2),width/2,height);
    }


    
    
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


var config = {
    noteHeight: 6,
    pixelsPerTimeStep: 30,  // like a note width
    noteSpacing: 1,
    noteRGB: '8, 41, 64',
    activeNoteRGB: '240, 84, 119',
}

let viz = null
const mvae = new music_vae.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small');
function userClicked(){
    mvae.initialize().then(() => {
        mvae.sample(1).then((samples) => 
        {

            console.log(samples[0])
            let seq = mm.sequences.unquantizeSequence(samples[0]);
            viz = new mm.PianoRollCanvasVisualizer(seq, document.getElementById('canvas'), config);
            player = new core.Player(false, {
                run: (note) => {
                    let newNote = {
                        endTime: note.endTime,
                        pitch: note.pitch,
                        startTime: note.startTime
                    }
                    viz.redraw(newNote)
                },
                stop: () => {console.log('done')}
            });
            player.start(samples[0])
            draw(null,null,samples[0])
            // player.start(TWINKLE_TWINKLE) 
            
        }
        );
    });
}