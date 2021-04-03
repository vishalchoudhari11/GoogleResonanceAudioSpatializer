// Import a few files

// Make your choice
let dimensionSelection = 'custom';
let materialSelection = 'marble';
let soundFile = 'Sounds/Trial_41_Conv1.wav';
let trajFile = 'Trajectories/Traj_Trial_1_Conv_1.csv';

// Read CSV file for the trajectory
var trajData;
  $.ajax({
    url: trajFile,
    async: false,
    success: function (csvd) {
        data = $.csv.toArrays(csvd);
    },
    dataType: "text",
    complete: function () {
        console.log(data[0])
    }
  });

// Define room dimensions.
// By default, room dimensions are undefined (0m x 0m x 0m).
let dimensions = {
  small: {
    width: 1.5, height: 2.4, depth: 1.3,
  },
  medium: {
    width: 4, height: 3.2, depth: 4,
  },
  large: {
    width: 8, height: 3.4, depth: 9,
  },
  huge: {
    width: 20, height: 10, depth: 20,
  },
  custom: {
    width: 6, height: 4, depth: 8,
  },
};

// Define materials for each of the room’s six surfaces.
// Room materials have different acoustic reflectivity.
let materials = {
  brick: {
    left: 'brick-bare', right: 'brick-bare',
    up: 'brick-bare', down: 'wood-panel',
    front: 'brick-bare', back: 'brick-bare',
  },
  curtains: {
    left: 'curtain-heavy', right: 'curtain-heavy',
    up: 'wood-panel', down: 'wood-panel',
    front: 'curtain-heavy', back: 'curtain-heavy',
  },
  marble: {
    left: 'marble', right: 'marble',
    up: 'marble', down: 'marble',
    front: 'marble', back: 'marble',
  },
  outside: {
    left: 'transparent', right: 'transparent',
    up: 'transparent', down: 'grass',
    front: 'transparent', back: 'transparent',
  },
};

// Create an AudioContext
let audioContext = new AudioContext();

// Create a Resonance Audio scene and pass to it
// the AudioContext.
let resonanceAudioScene = new ResonanceAudio(audioContext);

// Set the scene's desired ambisonic order
resonanceAudioScene.setAmbisonicOrder(3)

// Connect the scene’s binaural output to stereo out.
resonanceAudioScene.output.connect(audioContext.destination);

// Create an AudioElement.
let audioElement = document.createElement('audio');

// Load an audio file into the AudioElement.
audioElement.src = soundFile;

// Generate a MediaElementSource from the AudioElement.
let audioElementSource = audioContext.createMediaElementSource(audioElement);

// Add the room definition to the scene.
resonanceAudioScene.setRoomProperties(dimensions[dimensionSelection], materials[materialSelection]);

// Add the MediaElementSource to the scene as an audio input source.
let source = resonanceAudioScene.createSource();
audioElementSource.connect(source.input);

// For saving purposes
//Recorder.js object 
var rec;
rec = new Recorder(resonanceAudioScene.output);

let ctr = 0;
let next_update_time;
let start_time;
let ctr_max = data.length;

// console.log(ctr_max);

function resumeContext() 
{
  
  if (ctr == 0){
    set_trajectory();
    // console.log(source.position);
    audioContext.resume();
    audioElement.play();
    rec.record();
    start_time = audioContext.currentTime;
    next_update_time = start_time + 0.1;
    console.log(start_time);
    intID = setInterval(update_trajectory, 1);
  }
}

function update_trajectory()
{
  if (audioContext.currentTime > next_update_time){
    ctr = ctr + 1;
    set_trajectory();
    console.log("Update no: %d at: %f", ctr, audioContext.currentTime - start_time);
    next_update_time = next_update_time + 0.1;
  }

  if (ctr == ctr_max - 1){
    clearInterval(intID);
    setTimeout(stop_stuff, 300);
  }

}

function stop_stuff(){
  rec.stop();
  rec.exportWAV(createDownloadLink);
}

function set_trajectory(){
  x_pos = data[ctr][0];
  y_pos = data[ctr][1];
  z_pos = data[ctr][2];

  // Set the source position relative to the room center (source default position).
  source.setPosition(x_pos, y_pos, z_pos);

}

function createDownloadLink(blob) {
  var url = URL.createObjectURL(blob);
  var au = document.createElement('audio');
  var li = document.createElement('li');
  var link = document.createElement('a');
  //add controls to the <audio> element 
  au.controls = true;
  au.src = url;
  //link the a element to the blob 
  link.href = url;
  link.download = soundFile.split("/")[1].slice(0, -4) + '_Spatial_' + dimensionSelection +'_' + materialSelection + '.wav';
  link.innerHTML = link.download;
  //add the new audio and a elements to the li element 
  li.appendChild(au);
  li.appendChild(link);
  //add the li element to the ordered list 
  recordingsList.appendChild(li);
}