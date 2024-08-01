var audioCtx;

var timings;
var liveCodeState = [];
const playButton = document.querySelector('button');


function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)

    timings = audioCtx.createGain();
    timings.gain.value = 0;

    oscillators = []
    scheduleAudio()


}




  function scheduleAudio() {

      let timeElapsedSecs = 0;

      liveCodeState.forEach(noteData => {
          noteData["pitches"].forEach(pitch => {
              timings.gain.setTargetAtTime(1, audioCtx.currentTime + timeElapsedSecs, 0.01);
              const osc = audioCtx.createOscillator();
              osc.connect(timings).connect(audioCtx.destination);
              osc.frequency.setTargetAtTime(0, audioCtx.currentTime,   0.001);
              osc.frequency.setTargetAtTime(eval(pitch), audioCtx.currentTime + timeElapsedSecs, 0.01);

              osc.start();
              oscillators.push(osc);
              osc.stop(audioCtx.currentTime + timeElapsedSecs  + (noteData["length"] / 10.0));


          });
          timeElapsedSecs += noteData["length"] / 10.0;
          timings.gain.setTargetAtTime(0, audioCtx.currentTime + timeElapsedSecs, 0.01);
          timeElapsedSecs += 0.2;
          oscillators = [];


      });




      setTimeout(scheduleAudio, timeElapsedSecs * 1000);
  }

function parseCode(code) {
    //how could we allow for a repeat operation
    //(e.g. "3@340 2[1@220 2@330]"" plays as "3@340 1@220 2@330 1@220 2@330")
    //how could we allow for two lines that play at the same time?
    //what if we want variables?
    //how does this parsing technique limit us?
    let notes = code.split(" ");

    //notice this will fail if the input is not correct
    //how could you handle this? allow some flexibility in the grammar? fail gracefully?
    //ideally (probably), the music does not stop
    notes = notes.map(note => {
        noteData = note.split("@");

        pitches = {}


       pitches = noteData[1].split("&")
       console.log(pitches)



        return   {"length" : eval(noteData[0]), //the 'eval' function allows us to write js code in our live coding language
                "pitches" : pitches
                }
                //what other things should be controlled? osc type? synthesis technique?
    });


    return notes;
}

function genAudio(data) {
    liveCodeState = data;
}

function reevaluate() {
    var code = document.getElementById('code').value;
    var data = parseCode(code);
    genAudio(data);
}

playButton.addEventListener('click', function () {

    if (!audioCtx) {
        initAudio();
    }

    reevaluate();


});
