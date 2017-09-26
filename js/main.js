$(function() {
  
  var camera;



  var options = {
    shutter_ogg_url: "jpeg_camera/shutter.ogg",
    shutter_mp3_url: "jpeg_camera/shutter.mp3",
    swf_url: "jpeg_camera/jpeg_camera.swf"
  };

  camera = new JpegCamera("#camera", options).ready(function(info) {
    // camera is ready
    console.log("Camera resolution: " + info.video_width + "x" + info.video_height);

  });

  //$("#take_snapshots").click(function() {take_snapshots(3);});
  $("#show_stream").click(function() {
    camera.show_stream();
  });
})
