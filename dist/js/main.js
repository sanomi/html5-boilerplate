(function() {
'use strict';

  var data, intervalId, remainingSeconds, currentSlideId = -1;

  function randColor() {
      return '#'+Math.floor(Math.random()*16777215).toString(16);
  }
  function invertColor(hexTripletColor) {
    var color = hexTripletColor;
    color = color.substring(1);           // remove #
    color = parseInt(color, 16);          // convert to integer
    color = 0xFFFFFF ^ color;             // invert three bytes
    color = color.toString(16);           // convert to hex
    color = ("000000" + color).slice(-6); // pad with leading zeros
    color = "#" + color;                  // prepend #
    return color;
  }

  function rgbToHex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  }                

  var showNextSlide = function() {

    var eventHandler = function() {
        event.stopPropagation();
        clearInterval(intervalId);
        showNextSlide();
        button.removeEventListener("click", eventHandler);
      }

    var button = document.querySelectorAll('button')[0];
    var buttonListener = button.addEventListener("click", 
     eventHandler);


    var body = document.querySelectorAll('body')[0];
    body.style.backgroundColor = randColor();
    var rgb = getComputedStyle(body)['background-color'];
    var hex = rgbToHex(rgb);
    body.style.color = invertColor(hex);

    var slideObject = data[++currentSlideId];

    var remainingSeconds = slideObject.seconds;
    var remainingSecondsDiv = document.getElementById('remainingSeconds');
    var instructionsDiv = document.getElementById('instructions');

    remainingSecondsDiv.textContent = remainingSeconds;
    instructionsDiv.textContent = slideObject.instructions;

    remainingSecondsDiv.textContent = remainingSeconds;

    var intervalId = setInterval(function() {
      remainingSecondsDiv.textContent = --remainingSeconds;
      if (remainingSeconds === 0) {
        clearInterval(intervalId);
        showNextSlide();
      }
  }, 1000);

      if (slideObject === data[data.length-1]) {
          instructionsDiv.textContent = 'Done.'
          remainingSecondsDiv.textContent = ' ';
      }
  };

  var countDown = function() {
    var total = 620;
     var originalSecondsDiv = document.getElementById('originalSeconds');
     // originalSecondsDiv.textContent = '0%';
     var progressBar = document.getElementById('progress');
     var totalRemainingSeconds = setInterval(function() {
      progressBar.style.width = (100- (--total/620) * 100 ).toFixed(2) + '%' ;
        }, 1000);
  }
  var request = new XMLHttpRequest();
  request.open('GET', '/data.json', true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
                  // Success!
    data = JSON.parse(request.responseText).data;
    showNextSlide();
    countDown();
      }

  };
  request.onerror = function() {
     // There was a connection error of some sort
  };
  request.send();

})();