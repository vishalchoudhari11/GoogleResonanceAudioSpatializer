# GoogleResonanceAudioSpatializer

This set of scripts allow one to spatialise sounds through HRTFs, add reverb and model shoebox environments. Makes use of Resonance Audio SDK for the Web, JavaScript and Web Audio API.

## Installation

1. Clone this repository to a folder named "GoogleResonanceAudioSpatializer" on your machine.
2. Download and install Visual Studio Code from: [https://code.visualstudio.com](https://code.visualstudio.com).
3. Launch Visual Studio Code.
4. Click on 'Open Folder' and then navigate to the cloned GitHub directory (named "GoogleResonanceAudioSpatializer").
5. Install "Live Server" extension on Visual Studio code.
6. Edit the "spatialise.js" file to set sound source, its trajectory data (from a CSV), edit room properties etc.
6. Under the "Explorer" pane, right click on "demo.html" file and select "Open With Live Server".
7. A web page ("demo.html") will open on your default browser (Chrome recommended).
8. Right-click on the web page, select Inspect, then select the Console tab. The output of JavaScript will be logged here.
9. Click on "Click to spatialize!" to start spatializing the sound. While the audio is being spatialized, it can be heard in real-time on the web browser. 
10. The spatialisation is complete, the file would be available for download.
11. Click on the <filename>.wav link in blue to download the spatialized file. 

## Conclusion

Comments/ideas for building more general features are welcome.