let mediaSource,
    objectUrl;

let codecs = [];

// gets called on sourceopen event from mediaSource
function ready() {
    postMessage({topic: "mediaSourceOpen"});
    if (mediaSource.sourceBuffers.length == 0) {
        URL.revokeObjectURL(objectUrl);

        console.log(codecs);
        // add both source buffers, audio and video, with the respective codec
        codecs.forEach(codec => mediaSource.addSourceBuffer(codec));
    }
}

onmessage = function(e) {
    if (e.data.topic == "createMediaSource") {
        // Create Media Source
        mediaSource = new MediaSource();
        objectUrl = URL.createObjectURL(mediaSource);
        mediaSource.addEventListener('sourceopen', ready);
        postMessage({topic: 'objectUrl', arg: objectUrl});
    } else if (e.data.topic == "addSourceBuffer") {
        // Add codec to codecs list, sourceBuffers get added to sourceBufferList after sourceopen event
        codecs.push(e.data.codec);
    } else if (e.data.topic == "appendBuffer") {
        // Append new bytes to respective sourcebuffer
        // audio or video
        let type = e.data.type;
        try {
            if (type == "video") {
                mediaSource.sourceBuffers[0].appendBuffer(e.data.nextChunk);
            } else if (type == "audio") {
                mediaSource.sourceBuffers[1].appendBuffer(e.data.nextChunk);
            }
          } catch (e) {
              console.log(e.name);
          }
    }
  }