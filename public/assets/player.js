// receives emotions
// generates key
// generates scale
// generates notes
// Plays notes
// Stops playback
let synth = new Tone.Synth().toDestination()

        synth.onsilence = function () {
            synth.dispose()
            stop()
        }
        let cmajor = [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84];
        let cminor = [60, 62, 63, 65, 67, 68, 70, 72, 74, 75, 77, 79, 80, 82, 84];
        let emotionsArray
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

        function setEmotions(data){
            emotionsArray = data
        }
        
        // Initialize the model.
        music_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');

        function getNotes(transposition) {
            seedSequence.notes = []
            startTime = 0
            notesPerTweet = 1
            for (let i = 0; i < notesPerTweet; i++) {
                let newNoteLength = returnNoteLength();
                let note = { pitch: returnNote() + transposition, startTime: startTime, endTime: startTime + newNoteLength }
                seedSequence.notes.push(note);
                startTime += newNoteLength;
            }
        }

        function returnNote() {
            let randomNumber = Math.floor(Math.random() * (cmajor.length - 1));
            return cmajor[randomNumber];
        }

        function returnNoteLength() {
            let noteLength = Math.random() * (maxNoteLength - minNoteLength) + minNoteLength;
            return noteLength
        }

        function getEmotionMelodies() {
            for (let i = 0; i < emotionsArray.length; i++) {
                if (emotionsArray[i] === "excited") {
                    minNoteLength = 0.1;
                    maxNoteLength = 0.5;
                    keyTransposition = -8;
                }
                if (emotionsArray[i] === "indifferent") {
                    minNoteLength = 0.5;
                    maxNoteLength = 1.5;
                    keyTransposition = 0;
                }
                getNotes(keyTransposition)
            }
        }

        async function play() {
            getEmotionMelodies();
            Tone.Transport.stop();
            console.log(synth)
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
            // the generated melody is USUALLY in the key of the chord passed, sometimes in a closely related key like the 5th or relative major/minor
            // seems to accept most chord notation, ex. cm CM Cm F#m 
            // args: input sequence, how many steps into the future, temperature/how random, chord structure
            let qns = mm.sequences.quantizeNoteSequence(seedSequence, 4);
            seedSequence.totalQuantizedSteps = qns.notes[qns.notes.length - 1].quantizedEndStep;
            let sample = await music_rnn.continueSequence(seedSequence, 10, 1.5, ['Cm'])
            sample.notes.forEach(note => {

                note.quantizedStartStep += qns.notes[qns.notes.length - 1].quantizedEndStep
                note.quantizedEndStep += qns.notes[qns.notes.length - 1].quantizedEndStep
            })
            let unquantizedSample = mm.sequences.unquantizeSequence(sample, 120);
            let allNotes = seedSequence.notes.concat(unquantizedSample.notes)
            sample.notes = allNotes;
            synth.sync();

            await sample.notes.forEach(async (note) => {
                console.log(note.startTime)
                synth.triggerAttackRelease(Tonal.Note.fromMidi(note.pitch), note.endTime - note.startTime, note.startTime)
            })
            Tone.Transport.start();
            Tone.start();
        }
        // getEmotionMelodies();

        function stop() {
            synth.dispose() 
            synth = new Tone.Synth().toDestination()
        }