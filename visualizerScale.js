var $vis = $("#visualizer");
var visHeight = $vis.outerHeight();
var visWidth = $vis.outerWidth();

var $wrapper = $("#wrapper");

$wrapper.resizable({
  resize: doResize
});

function doResize(event, ui) {
  
  var scale, origin;
    
  scale = Math.min(
    ui.size.width / visWidth,    
    ui.size.height / visHeight
  );
  
  $vis.css({
    transform: "translate(-50%, -50%) " + "scale(" + scale + ")"
  });
}

var starterData = { 
  size: {
    width: $wrapper.width(),
    height: $wrapper.height()
  }
}
doResize(null, starterData);