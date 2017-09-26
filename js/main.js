$(function() {
  
  camera = new JpegCamera("#camera", options).ready(function(info) {
    // camera is ready
    console.log("Camera resolution: " + info.video_width + "x" + info.video_height);

  });

  //$("#take_snapshots").click(function() {take_snapshots(3);});
  $("#show_stream").click(function() {


  });
})
