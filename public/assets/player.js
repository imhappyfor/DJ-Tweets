// receives emotions
// generates key
// generates scale
// generates notes
// Plays notes
// Stops playback
let synth = new Tone.Synth().toDestination();

// callback to dispose of synth once it has stopped playing
synth.onsilence = function () {
    synth.dispose()
    stop()
}

let major = [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84];
let minor = [60, 62, 63, 65, 67, 68, 70, 72, 74, 75, 77, 79, 80, 82, 84];
let emotionsArray = [];
let startTime = 0;
let endTime;
let totalTime;
let seedSequence = {
    totalQuantizedSteps: null,
    quantizationInfo: {
        // the higher the number the "faster" it is, basically how many the base length is divided into
        stepsPerQuarter: 4
    },
    notes: []
}

// these variables values will be determined by emotional content of each tweet
let minNoteLength;
let maxNoteLength;
let keyTransposition;
let continueSequenceChord;
// anything above 1.5 will essentially result in random results.
let continueSequenceTemperature

// TODO: generate notes from emotion.
// function setEmotions(data){
//     emotionsArray = data
// }

// Initialize the model.
music_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');

function getNotes(transposition, scale, indexArray) {
    notesPerTweet = 6;
    for (let i = 0; i < notesPerTweet; i++) {
        let newNoteLength = returnNoteLength();
        let note = { pitch: returnNote(scale, indexArray) + transposition, startTime: startTime, endTime: startTime + newNoteLength }
        seedSequence.notes.push(note);
        startTime += newNoteLength;
    }
}

function returnNote(scale, indexArray) {
    let randomNumber = Math.floor(Math.random() * (indexArray.length));
    let scaleIndex = indexArray[randomNumber];
    return scale[scaleIndex];
}

function returnNoteLength() {
    let noteLength = Math.random() * (maxNoteLength - minNoteLength) + minNoteLength;
    return noteLength
}
function getTransposition(overallEmotion) {
    // console.log(overallEmotion)
    switch(overallEmotion) {
        case "excited":
            continueSequenceChord = ['GM'];
            continueSequenceTemperature = 1.5;
            return -5;
        case "indifferent":
            continueSequenceChord = ['CM'];
            continueSequenceTemperature = 0.9;
            return -12;
        case "angry": 
            continueSequenceChord = ['BM'];
            continueSequenceTemperature = 1.25;
            return -1;
        case "happy":
            continueSequenceChord = ['BbM'];
            continueSequenceTemperature = 1.1;
            return -2;
        case "fear":
            continueSequenceChord = ['gm'];
            continueSequenceTemperature = 1.5;
            return -5;
        case "sad":
            continueSequenceChord = ['ebm'];
            continueSequenceTemperature = 0.5;
            return -9;
        default:
            continueSequenceChord = ['CM'];
            continueSequenceTemperature = 1.5;
            return -12;
    }
}

function getEmotionMelodies() {
    startTime = 0;
    seedSequence.notes = [];
    keyTransposition = getTransposition(emotionsArray[emotionsArray.length-1]);
    // console.log(emotionsArray)
    for (let i = 0; i < emotionsArray.length-1; i++) {
        switch(emotionsArray[i]) {
            case "excited":
                minNoteLength = 0.1;
                maxNoteLength = 0.3;
                scale = major;
                indexArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
                break;
            case "indifferent":
                minNoteLength = 0.5;
                maxNoteLength = 0.5;
                scale = major;
                indexArray = [0,1];
                break;
            case "angry": 
                minNoteLength = 0.1;
                maxNoteLength = 0.8;
                scale = major;
                indexArray = [0,1,2,3,4,5,6,7];
                break;
            case "happy":
                minNoteLength = 0.3;
                maxNoteLength = 1.0;
                scale = major;
                indexArray = [0,2,4,7,9,11];
                break;
            case "fear":
                minNoteLength = 0.1;
                maxNoteLength = 0.5;
                scale = minor;
                indexArray = [7,8,9,10,11,12,13,14];
                break;
            case "sad":
                minNoteLength = 0.5;
                maxNoteLength = 1.0;
                scale = minor;
                indexArray = [0,1,2,3,4,5,6,7];
                break;
            default:
                minNoteLength = 0.5;
                maxNoteLength = 1.5;
                scale = major;
                indexArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
                break;
        }
        getNotes(keyTransposition, scale, indexArray)
    }
}

async function play() {
    emotionsArray = [];
    let emotionsUnfilteredArray = exportEmotions()[0].emotion;
    // for testing without api calls
    // let emotionsUnfilteredArray = [
    //     {
    //         angry: 0.99975,
    //         excited: 0.000021,
    //         fear: 0.000049,
    //         happy: 0.000012,
    //         indifferent: 0.000147,
    //         sad: 0.000021
    //     },
    //     {
    //         angry: 0.99975,
    //         excited: 0.000021,
    //         fear: 0.000049,
    //         happy: 0.000012,
    //         indifferent: 0.000147,
    //         sad: 0.000021
    //     },
    //     {
    //         angry: 0.000002,
    //         excited: 0.999982,
    //         fear: 0.000003,
    //         happy: 0.000008,
    //         indifferent: 0.000003,
    //         sad: 0.000002
    //     },
    //     {
    //         happy: 0.99975,
    //         excited: 0.000021,
    //         fear: 0.000049,
    //         angry: 0.000012,
    //         indifferent: 0.000147,
    //         sad: 0.000021
    //     },
    //     {
    //         angry: 0.000005,
    //         excited: 0.000005,
    //         fear: 0.000001,
    //         happy: 0.000016,
    //         indifferent: 0.99997,
    //         sad: 0.000003
    //     },
    //     {
    //         angry: 0.000005,
    //         excited: 0.000005,
    //         fear: 0.000001,
    //         happy: 0.000016,
    //         indifferent: 0.99997,
    //         sad: 0.000003
    //     },
    //     {
    //         happy: 0.99975,
    //         excited: 0.000021,
    //         fear: 0.000049,
    //         angry: 0.000012,
    //         indifferent: 0.000147,
    //         sad: 0.000021
    //     },
    //     {
    //         fear: 0.99975,
    //         excited: 0.000021,
    //         angry: 0.000049,
    //         happy: 0.000012,
    //         indifferent: 0.000147,
    //         sad: 0.000021
    //     },
    //     {
    //         sad: 0.99975,
    //         excited: 0.000021,
    //         fear: 0.000049,
    //         happy: 0.000012,
    //         indifferent: 0.000147,
    //         angry: 0.000021
    //     },
    //     {
    //         fear: 0.99975,
    //         happy: 0.000021,
    //         excited: 0.000049,
    //         indifferent: 0.000012,
    //         angry: 0.000147,
    //         sad: 0.000021
    //     },
    // ]
    for (let i = 0; i < emotionsUnfilteredArray.length; i++) {
        // find dominant emotion by finding emotion with highest value in object
        let allValues = Object.values(emotionsUnfilteredArray[i]);
        let max = Math.max(...allValues);
        let emotion = Object.keys(emotionsUnfilteredArray[i]).find(key => emotionsUnfilteredArray[i][key] === max);
        emotionsArray.push(emotion);
    }
    getEmotionMelodies();
    Tone.Transport.stop();

    if (synth._wasDisposed || synth._synced) {
        synth.dispose();
        synth = new Tone.Synth().toDestination()
        synth.onsilence = function () {
            console.log('test')
            synth.dispose()
            stop()
        }
    }

    await music_rnn.initialize();
    // musicrnn continues in quantized steps so probably will not equal number of notes... we may want to make it a little longer to compensate
    let continueSequenceSteps = (notesPerTweet * emotionsArray.length) * 2;
    let qns = mm.sequences.quantizeNoteSequence(seedSequence, 4);
    seedSequence.totalQuantizedSteps = qns.notes[qns.notes.length - 1].quantizedEndStep;
    // args: input sequence, how many steps into the future, temperature/how random, chord structure
    let sample = await music_rnn.continueSequence(seedSequence, continueSequenceSteps, continueSequenceTemperature, continueSequenceChord)
    sample.notes.forEach(note => {
        note.quantizedStartStep += qns.notes[qns.notes.length - 1].quantizedEndStep
        note.quantizedEndStep += qns.notes[qns.notes.length - 1].quantizedEndStep
    })
    let unquantizedSample = mm.sequences.unquantizeSequence(sample, 120);
    let allNotes = seedSequence.notes.concat(unquantizedSample.notes)
    sample.notes = allNotes;
    synth.sync();
    await sample.notes.forEach(async (note) => {
        synth.triggerAttackRelease(Tonal.Note.fromMidi(note.pitch), note.endTime - note.startTime, note.startTime)
    })
    Tone.Transport.start();
    Tone.start();
}

function stop() {
    synth.dispose();
    synth = new Tone.Synth().toDestination();
}