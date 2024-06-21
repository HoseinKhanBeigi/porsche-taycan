canvasEl = document.querySelector("canvas");
var ctx = canvasEl.getContext("2d");

var options = {
  segments: 8,
  margin: 0.06,
  radius: 80,
  lineWidth: 3,
  fullInactiveLineWidth: 6,
  fullActiveLineWidth: 20,
  strokeStyle: "rgb(225, 32, 76)",
  activeStrokeStyle: "rgb(255, 255, 255)",
  glowColor: "#FF4A0F",
  glowAmount: 50,
  centerX: canvasEl.width / 2,
  centerY: canvasEl.height / 2,
  rotateOffset: Math.PI / 2,
};

var canvasWidth, canvasHeight;
canvasWidth = canvasEl.width;
canvasHeight = canvasEl.height;

var segments = [];
for (var x = 0; x < options.segments; x++) {
  var segmentSize = (2 * Math.PI) / options.segments;
  segments.push({
    lineWidth: options.fullInactiveLineWidth,
    strokeStyle: options.strokeStyle,
    startAngle: x * segmentSize - options.rotateOffset,
    endAngle: (x + 1) * segmentSize - options.margin - options.rotateOffset,
    anglePercent: 0,
    blurOpacity: 0,
  });
}

var tl = new TimelineLite({
  autoRemoveChildren: true,
});

function drawComboGui() {
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  //draw the placeholder lines
  for (var x = 0; x < options.segments; x++) {
    ctx.beginPath();
    ctx.strokeStyle = "#373739";
    ctx.lineWidth = options.lineWidth;
    ctx.arc(
      options.centerX,
      options.centerY,
      options.radius,
      x * segmentSize - options.rotateOffset,
      (x + 1) * segmentSize - options.margin - options.rotateOffset
    );
    ctx.stroke();
  }

  //draw the active segments
  for (var x = 0; x < segments.length; x++) {
    var segment = segments[x];

    var startAngle = segment.startAngle;
    var endAngle =
      segment.startAngle +
      (segment.endAngle - segment.startAngle) * segment.anglePercent;
    var middleAngle = startAngle + (endAngle - startAngle) / 2;

    //need to offset because the stroke grows in both directions and not only outwards
    var centerOffsetX = ((Math.cos(middleAngle) * segment.lineWidth) / 2) * 0;
    var centerOffsetY = ((Math.sin(middleAngle) * segment.lineWidth) / 2) * 0;

    //draw blur
    if (segment.blurOpacity > 0) {
      ctx.beginPath();
      ctx.globalAlpha = segment.blurOpacity;
      ctx.globalCompositeOperation = "lighten";
      ctx.strokeStyle = "white";
      ctx.lineWidth = segment.lineWidth;
      ctx.shadowBlur = options.glowAmount;
      ctx.shadowColor = options.glowColor;
      ctx.arc(
        options.centerX + centerOffsetX,
        options.centerY + centerOffsetY,
        options.radius + (segment.lineWidth / 2 - 1), //the 1 is for pixel correction
        startAngle,
        endAngle
      );
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    ctx.globalCompositeOperation = "source-over";

    //draw line
    ctx.beginPath();
    ctx.lineWidth = segment.lineWidth;
    ctx.strokeStyle = segment.strokeStyle;
    ctx.globalAlpha = 1;

    ctx.arc(
      options.centerX + centerOffsetX,
      options.centerY + centerOffsetY,
      options.radius + (segment.lineWidth / 2 - 1), //the 1 is for pixel correction
      startAngle,
      endAngle
    );
    ctx.stroke();
  }
}

var img = new Image();
img.src =
  "https://s3.amazonaws.com/stage.interlude.fm/pistons_game/archive/0.0.101/resources/sprites/superpower.png";
var targetImageSize = 140;

function render() {
  //draw the animations state
  drawComboGui();

  //draw the image
  ctx.drawImage(
    img,
    0,
    0,
    127,
    127,
    options.centerX - targetImageSize / 2 - 3,
    options.centerY - targetImageSize / 2 - 4,
    targetImageSize,
    targetImageSize
  );

  window.requestAnimationFrame(render);
}

render();

function addActiveSegment(index) {
  var growAnimLength = 0.4;
  var expandAnimLength = 0.4;

  if (index == 1) {
    tl.set(segments, { anglePercent: 0 });
  }

  tl.set(segments[index], { lineWidth: options.fullActiveLineWidth });

  tl.set(segments.slice(0, index), {
    lineWidth: options.fullInactiveLineWidth,
    colorProps: { strokeStyle: options.strokeStyle },
    anglePercent: 1,
    alpha: 1,
    blurOpacity: 0,
  });

  tl.to(segments.slice(0, index), growAnimLength, {
    lineWidth: options.fullActiveLineWidth,
    colorProps: { strokeStyle: options.activeStrokeStyle },
    blurOpacity: 1,
    ease: Power3.easeIn,
  });

  tl.fromTo(
    segments[index],
    expandAnimLength,
    {
      anglePercent: 0,
      blurOpacity: 1,
      alpha: 1,
      colorProps: { strokeStyle: options.activeStrokeStyle },
      immediateRender: false,
    },
    {
      anglePercent: 1,
      colorProps: { strokeStyle: options.activeStrokeStyle },
      ease: Power0.easeIn,
    }
  );

  //all segments to return to active size
  if (currentSegment <= options.segments - 1) {
    tl.to(segments.slice(0, index + 1), expandAnimLength, {
      lineWidth: options.fullInactiveLineWidth,
      colorProps: { strokeStyle: options.strokeStyle },
      blurOpacity: 0,
      alpha: 1,
      ease: Power3.easeIn,
    });
  }
}

var currentSegment = 0;

//cycle the animation
document.body.querySelector("button").addEventListener("click", function () {
  if (currentSegment == options.segments - 1) {
    currentSegment = 1;
  } else {
    currentSegment++;
  }

  addActiveSegment(currentSegment);
});
