// receives emotions
// generates key
// generates scale
// generates notes
// Plays notes
// Stops playback

// Initialize synthesizer from Tone.js to use for playback
let synth = new Tone.Synth().toDestination();
// for allow
// Initialize the musicrnn model.
music_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');

// callback to dispose of synth once it has stopped playing
synth.onsilence = function () {
    synth.dispose()
    stop()
}

let major = [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84];
let minor = [60, 62, 63, 65, 67, 68, 70, 72, 74, 75, 77, 79, 80, 82, 84];
let emotionsArray = [];
let startTime;
let endTime;
let seedSequence = {
    totalQuantizedSteps: null,
    quantizationInfo: {
        // the higher the number the "faster" it is, basically how many the base length is divided into
        stepsPerQuarter: 4
    },
    notes: []
}

// these variables apply to the overall structure of the melodies, are global because they need to be available to multiple functions
let overallEmotionEmoji;
let transposition;
let continueSequenceChord;
// anything above 1.5 will essentially result in random results.
let continueSequenceTemperature;

// gets emotional analysis from tweets.js and finds maximum values from each object to determine dominant emotion
function setEmotions(data, tweetArray) {
    // updating the status dom element.
    document.getElementById('status').textContent = `Creating emotional analysis`
    let unfilteredEmotionsArray = data
    for (let i = 0; i < unfilteredEmotionsArray.length; i++) {
        // find dominant emotion by finding emotion with highest value in object
        let allValues = Object.values(unfilteredEmotionsArray[i]);
        let max = Math.max(...allValues);
        let emotion = Object.keys(unfilteredEmotionsArray[i]).find(key => unfilteredEmotionsArray[i][key] === max);
        emotionsArray.push(emotion);
    }
    getOverallEmotion();
    getMelodiesByEmotion(tweetArray);
    // updating the status dom element.
    document.getElementById('status').textContent = `Please press play`;
    document.getElementById("loadingScreen").remove();
    playButtonDiv = document.createElement('div');
    // let controls = document.getElementById('controls');
    playButton = document.createElement('button');
    // let stopButton = document.createElement('button');
    playButtonDiv.setAttribute('id', 'playButtonDiv')
    playButton.setAttribute('id','playButton');
    // stopButton.setAttribute('id','stopButton');
    playButton.textContent = 'Play';
    playButton.addEventListener("click",play);
    // stopButton.textContent = 'Stop';
    // stopButton.addEventListener("click",stop);
    playButtonDiv.appendChild(playButton)
    document.body.appendChild(playButtonDiv);
    // controls.appendChild(stopButton);


}

// this function finds the most commonly occurring emotion of all the tweets to set larger variables that affect the individual tweet melodies
// if there are multiple emotions with the same amount of occurrences, the first one that occurrs in alphabetical order would be used. A future improvement would be developing nuances for ties in dominant emotions
function getOverallEmotion() {
    // created sort copy of emotions array without modifying original array
    let sortedEmotions = [...emotionsArray].sort();
    let max = {
        value: sortedEmotions[0],
        total: 1
    };
    let current = 1;
    for (let i = 1; i < sortedEmotions.length; i++) {
        if (sortedEmotions[i] === sortedEmotions[i-1]) {
            current++;
            if (current > max.total) {
                max.value = sortedEmotions[i];
                max.total = current;
            }
        }
        else {
            current = 1;
        }
    };
    getTransposition(max.value);
}

function reloadPage(){
    Location.reload();  
}


function getNotes(scale, indexArray, minNoteLength, maxNoteLength, emotion, tweetText) {
    let notesPerTweet = 8;
    for (let i = 0; i < notesPerTweet; i++) {
        let newNoteLength = returnNoteLength(minNoteLength, maxNoteLength);
        let note = { pitch: returnNote(scale, indexArray) + transposition, startTime: startTime, endTime: startTime + newNoteLength, emotion, tweet: tweetText }
        seedSequence.notes.push(note);
        startTime += newNoteLength;
    }
}

function returnNote(scale, indexArray) {
    let randomNumber = Math.floor(Math.random() * (indexArray.length));
    let scaleIndex = indexArray[randomNumber];
    return scale[scaleIndex];
}

function returnNoteLength(minNoteLength, maxNoteLength) {
    let noteLength = Math.random() * (maxNoteLength - minNoteLength) + minNoteLength;
    return noteLength
}
function getTransposition(dominantEmotion) {
    switch(dominantEmotion) {
        case "excited":
            continueSequenceChord = ['GM'];
            continueSequenceTemperature = 1.5;
            transposition = -5;
            overallEmotionEmoji = "😃";
            break;
        case "indifferent":
            continueSequenceChord = ['CM'];
            continueSequenceTemperature = 0.9;
            transposition = -12;
            overallEmotionEmoji = "😐";
            break;
        case "angry": 
            continueSequenceChord = ['BM'];
            continueSequenceTemperature = 1.25;
            transposition = -1;
            overallEmotionEmoji = "😡";
            break;
        case "happy":
            continueSequenceChord = ['BbM'];
            continueSequenceTemperature = 1.1;
            transposition = -2;
            overallEmotionEmoji = "🙂";
            break;
        case "fear":
            continueSequenceChord = ['gm'];
            continueSequenceTemperature = 1.5;
            transposition = -5;
            overallEmotionEmoji = "😧";
            break;
        case "sad":
            continueSequenceChord = ['ebm'];
            continueSequenceTemperature = 0.5;
            transposition = -9;
            overallEmotionEmoji = "😢";
            break;
        default:
            continueSequenceChord = ['CM'];
            continueSequenceTemperature = 1.5;
            transposition = -12;
            overallEmotionEmoji = "🤪";
            break;
    }
}

function getMelodiesByEmotion(tweetText) {
    startTime = 0;
    seedSequence.notes = [];
    let minNoteLength;
    let maxNoteLength;
    for (let i = 0; i < emotionsArray.length-1; i++) {
        switch(emotionsArray[i]) {
            case "excited":
                minNoteLength = 0.1;
                maxNoteLength = 0.3;
                scale = major;
                indexArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
                emotion = "😃";
                tweet = tweetText[i];
                break;
            case "indifferent":
                minNoteLength = 0.5;
                maxNoteLength = 0.5;
                scale = major;
                indexArray = [0,1];
                emotion = "😐";
                tweet = tweetText[i];
                break;
            case "angry": 
                minNoteLength = 0.1;
                maxNoteLength = 0.8;
                scale = major;
                indexArray = [0,1,2,3,4,5,6,7];
                emotion = "😡";
                tweet = tweetText[i];
                break;
            case "happy":
                minNoteLength = 0.3;
                maxNoteLength = 1.0;
                scale = major;
                indexArray = [0,2,4,7,9,11];
                emotion = "🙂";
                tweet = tweetText[i];
                break;
            case "fear":
                minNoteLength = 0.1;
                maxNoteLength = 0.5;
                scale = minor;
                indexArray = [7,8,9,10,11,12,13,14];
                emotion = "😧";
                tweet = tweetText[i];
                break;
            case "sad":
                minNoteLength = 0.5;
                maxNoteLength = 1.0;
                scale = minor;
                indexArray = [0,1,2,3,4,5,6,7];
                emotion = "😢";
                tweet = tweetText[i];
                break;
            default:
                minNoteLength = 0.5;
                maxNoteLength = 1.5;
                scale = major;
                indexArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
                emotion = "🤪";
                tweet = tweetText[i];
                break;
        }
        getNotes(scale, indexArray, minNoteLength, maxNoteLength, emotion, tweet)
    }
}

async function getFullMelody() {
    // we must quantize our seedSequence/melodies based on emotion so it can be based to the musicrnn continueSequence
    let qns = mm.sequences.quantizeNoteSequence(seedSequence, 4);
    // here we pass our quantized note sequence to continueSequence to generate a continuation
    let sample = await continueSequence(qns);
    // because we want to join our generated melodies with musicrnn's melody, we must adjust the start and end times of the generated melody to line up with the end of ours
    sample.notes.forEach(note => {
        note.startTime += qns.notes[qns.notes.length - 1].endTime;
        note.endTime += qns.notes[qns.notes.length - 1].endTime;
        note.emotion = overallEmotionEmoji;
        note.tweet = "MusicRNN's interpretation of this user's overall tweet mood";
    })
    // combine the two sequences
    let allNotes = seedSequence.notes.concat(sample.notes)
    sample.notes = allNotes;
    return sample;
}

async function continueSequence(qns) {
    // musicrnn continues in quantized steps so probably will not equal number of notes... we may want to make it a little longer to compensate
    let continueSequenceSteps = 80;
    // we must set totalQuantizedSteps to be accepted by musicrnn
    seedSequence.totalQuantizedSteps = qns.notes[qns.notes.length - 1].quantizedEndStep;
    // args: input sequence, how many steps into the future, temperature/how random, chord structure
    let sample = await music_rnn.continueSequence(seedSequence, continueSequenceSteps, continueSequenceTemperature, continueSequenceChord);
    // we must now unquantize this melody so our player will accept it... with just quantized start and end steps it will play at the wrong speed so we must get start and end times
    let unquantizedSample = mm.sequences.unquantizeSequence(sample, 120);
    return unquantizedSample;
}

async function play() {
    // getMelodiesByEmotion();
    // removing the status dom element after a user presses play. 
    Tone.Transport.stop();
    if (synth._wasDisposed || synth._synced) {
        synth.dispose();
        synth = new Tone.Synth().toDestination()
        synth.onsilence = function () {
            synth.unsync();
            synth.dispose();
            stop();
        }
    }

    await music_rnn.initialize();
    let sample = await getFullMelody();
    // // send the musical data to sketch.js
    // // this line below and Tone.Transport.start() need to be uncommented in order to be able to hit play multiple times
    synth.sync();

    await sample.notes.forEach(async (note) => {
        synth.triggerAttackRelease(Tonal.Note.fromMidi(note.pitch), note.endTime - note.startTime, note.startTime)    
    })
    
    Tone.start();
    Tone.Transport.start();
    notesToSketch(sample.notes)
}

function stop() {
    stopDraw();
    // console.log(Tone.Transport)
    // // synth.context.transport.cancel()
    // console.log("before dispose")
    // // console.log(synth.context.transport._scheduledEvents)
    // synth.clear();
    synth.dispose();
    // console.log("after dispose")
    // console.log(synth)
    // console.log("before context.transport.dipose")
    // // synth.context.transport.dispose();
    // console.log(synth)
    // console.log("after all")
    // worth it
    // Tone.Transport.cancel(0)
    
    
    // synth.unsync();
    // Tone.Transport.stop();
    // console.log(Tone.Transport)
    synth = new Tone.Synth().toDestination();
}