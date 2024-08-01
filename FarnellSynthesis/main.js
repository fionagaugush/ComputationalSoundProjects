document.addEventListener("DOMContentLoaded", function(event) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.5;
    gainNode.connect(audioCtx.destination);
    var thisBrownNoise;
    var thisNoise


    function createBrownNoise(){
        var bufferSize = 10 * audioCtx.sampleRate,
        noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate),
        output = noiseBuffer.getChannelData(0);

        var lastOut = 0;
        for (var i = 0; i < bufferSize; i++) {
            var brown = Math.random() * 2 - 1;

            output[i] = (lastOut + (0.02 * brown)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
        }

        brownNoise = audioCtx.createBufferSource();
        brownNoise.buffer = noiseBuffer;
        brownNoise.loop = true;
        return brownNoise;
    }



    function createLowpassFilter(cutoffFrequency) {
        var filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = cutoffFrequency;
        return filter;
    }



      document.getElementById("babbling_brook").onclick = function (){
      document.getElementById("babbling_brook").disabled = true;
      thisBrownNoise = createBrownNoise();
      thisBrownNoise.start()

      var lowpassFilter1 = createLowpassFilter(400);
      var lowpassFilter2 = createLowpassFilter(14);

      thisBrownNoise.connect(lowpassFilter1)
      thisBrownNoise.connect(lowpassFilter2)


    add_osc = audioCtx.createOscillator()
    add_osc.frequency.value = 500


     var resonantHighpassFilter = audioCtx.createBiquadFilter();
     resonantHighpassFilter.type = "highpass";
     resonantHighpassFilter.Q.value = 33.3;


      var gainNode2 = audioCtx.createGain();
      gainNode2.gain.value = 400;

      lowpassFilter2.connect(gainNode2);

      add_gain = audioCtx.createGain()
      add_gain.gain.value = 5

      gainNode2.connect(add_gain)
      add_osc.connect(add_gain)

      add_gain.connect(resonantHighpassFilter.frequency);


      lowpassFilter1.connect(resonantHighpassFilter)

      finalGain = audioCtx.createGain()
      finalGain.gain.value = 0.1
      finalGain.connect(audioCtx.destination)
      resonantHighpassFilter.connect(finalGain);



    }

    document.getElementById("babbling_brook_off").onclick = function (){
    document.getElementById("babbling_brook").disabled = false;
        if (thisBrownNoise) {

            thisBrownNoise.stop();
        }
    }









    document.getElementById("noise").onclick = function () {
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        var num_of_osc = 9;
        var freq = 200;
        var decay = 2;
        var freq_decay = 0.25;
        var freq_final = 80;
        var time_to_bounce = 3;
        var delayBetweenSounds = 500;


        function bounceBall(index) {
            if (index < num_of_osc) {
                var bounce = audioCtx.createGain();
                bounce.gain.value =   0.7 - (0.05 * index);;
                 var filter = audioCtx.createBiquadFilter();
                filter.type = "lowpass";
                filter.Q.value = 30
                var osc = audioCtx.createOscillator();

               osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
               osc.frequency.linearRampToValueAtTime(freq_final, audioCtx.currentTime + freq_decay);

                osc.connect(filter)
                filter.connect(bounce);
                bounce.gain.setValueAtTime(bounce.gain.value, audioCtx.currentTime);

                bounce.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + time_to_bounce);
                bounce.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);

                osc.start();
                bounce.connect(gainNode)

                osc.stop(audioCtx.currentTime + time_to_bounce + 0.1);

                 time_to_bounce +=-0.2;
                 freq += -10

                setTimeout(function () {
                    bounceBall(index + 1);
                }, delayBetweenSounds-=(15*2*index));
            }
        }

        bounceBall(0);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 5);


    };








});