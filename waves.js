window.onload = function () {
    const canvas = document.getElementById('musicCanvas');
    const ctx = canvas.getContext("2d");
    const audioContext = new AudioContext();
    let audioSource;
    let analyser;
  
    document.getElementById('musicFile').addEventListener('change', function () {
      const file = this.files[0];
      const reader = new FileReader();
  
      reader.onload = function (e) {
        const arrayBuffer = e.target.result;
        audioContext.decodeAudioData(arrayBuffer, function (buffer) {
          if (audioSource) audioSource.disconnect();
          audioSource = audioContext.createBufferSource();
          analyser = audioContext.createAnalyser();
          audioSource.buffer = buffer;
          audioSource.connect(analyser);
          analyser.connect(audioContext.destination);
          audioSource.loop = true;
        });
      };
      reader.readAsArrayBuffer(file);
    });
  
    document.querySelector('button').addEventListener('click', playMusic);
  
    function playMusic() {
      if (audioSource) audioSource.start();
      visualizeMusic();
    }
  
    function visualizeMusic() {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);
  
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
  
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        ctx.fillStyle = `hsl(${(i / bufferLength) * 360}, 100%, 50%)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
  
      requestAnimationFrame(visualizeMusic);
    }
  };
  