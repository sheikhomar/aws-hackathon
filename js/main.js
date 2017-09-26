$(function() {
  
  var camera;
  var s3;

  //var bucketName = 'fantastic-four'; var region = 'us-east-1';
  var bucketName = 'aws-hackaton-uploads';var region = 'eu-west-1';
  var options = {
    shutter_ogg_url: "jpeg_camera/shutter.ogg",
    shutter_mp3_url: "jpeg_camera/shutter.mp3",
    swf_url: "jpeg_camera/jpeg_camera.swf"
  };

  camera = new JpegCamera("#camera", options).ready(function(info) {
    // camera is ready
    console.log("Camera resolution: " + info.video_width + "x" + info.video_height);
    //$('#camera').css('height', info.video_height + 'px').css('width',  info.video_width + 'px')
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

    var scroll = $container.scrollWidth() - $container.innerWidth();

    $container.animate({
      scrollLeft: scroll
    }, 200);
  };

  var upload_snapshot = function(imageBlob) {
    console.log('Uploading snapshot... ');
    var snapshot = this;
    var imageName = 'snapshot-' + Math.floor(Date.now() / 1000);
    s3.upload({
      Key: imageName,
      Body: imageBlob
    }, function(err, data) {
      if (err) {
        console.log(err);
        return alert('There was an error uploading your photo: ', err.message);
      }
      var url = 'https://nwxtvslk82.execute-api.us-east-1.amazonaws.com/prod/ff/recognize';
      $.post( url, { image: imageName } ).done(function(data) {
        alert( "Data Loaded: " + data );
      })
    });
  };

  $('#take_snapshots').click(function() {
    var snapshot = camera.capture();

    if (JpegCamera.canvas_supported()) {
      //snapshot.get_canvas(add_snapshot);
      console.log('Uploading snapshot...');
      snapshot.get_blob(upload_snapshot);
    } else {
      alert('Canvas not supported.');
    }
  });

  var configureS3 = function() {
    AWS.config.update({
        region: region
    });

    var s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {Bucket: bucketName}
    });

    return s3;
  };


  $('#upload_image').click(function() {
    var files = document.getElementById('file_upload').files;
    if (!files.length) {
      alert('Please choose a file to upload first.');
      return false;
    }

    var file = files[0];
    var fileName = file.name;
    s3.upload({
      Key: fileName,
      Body: file
    }, function(err, data) {
      if (err) {
        return alert('There was an error uploading your photo: ', err.message);
      }
      alert('Successfully uploaded photo.');
    });
  });

  s3 = configureS3();
});
