$(function() {
  
  var camera;
  var s3;

  var bucketName = 'aws-hackaton-uploads'
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

  var add_snapshot = function(element) {
    $(element).data("snapshot", this).addClass("item");

    var $container = $("#snapshots").append(element);
    var $camera = $("#camera");
    var camera_ratio = $camera.innerWidth() / $camera.innerHeight();

    var height = $container.height()
    element.style.height = "" + height + "px";
    element.style.width = "" + Math.round(camera_ratio * height) + "px";

    var scroll = $container[0].scrollWidth - $container.innerWidth();

    $container.animate({
      scrollLeft: scroll
    }, 200);
  };

  var upload_snapshot = function(imageBlob) {
    var snapshot = this;
    var params = {Bucket: bucketName, Key: 'key', Body: imageBlob};
    s3.upload(params, function(err, data) {
        console.log(err, data);
    });
  };

  $('#take_snapshots').click(function() {
    var snapshot = camera.capture();

    if (JpegCamera.canvas_supported()) {
      snapshot.get_canvas(add_snapshot);
      snapshot.get_blob(upload_snapshot);
    } else {
      alert('Canvas not supported.');
    }
  });

  var configureS3 = function() {
    AWS.config.update({
        region: 'eu-west-1',
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: 'eu-west-1:15e3a03b-1812-4037-8ae5-1da763037863'
        })
    });

    var s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {Bucket: bucketName}
    });

    return s3;
  };

  s3 = configureS3();

})
