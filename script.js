var navigator = window.navigator;
var isPopUpShown = [false, false, false, false, false];
var isShownAlert = false;
function alertOnce(msg) {
  if (!isShownAlert) {
    alert(msg);
    isShownAlert = true;
  }

}

function showPopUp(target, index) {
  target.style.display = "none";
  isPopUpShown[index] = true;

  if (isPopUpShown[0] && isPopUpShown[1] && isPopUpShown[2] && isPopUpShown[3] && isPopUpShown[4]) {
    alertOnce("okay!");
  }
}

function processStream(stream) {
  var audioContext = new AudioContext();
  var analyser = audioContext.createAnalyser();
  
  microphone = audioContext.createMediaStreamSource(stream);
  javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

  analyser.smoothingTimeConstant = 0.8;
  analyser.fftSize = 1024;

  microphone.connect(analyser);
  analyser.connect(javascriptNode);
  javascriptNode.connect(audioContext.destination);

  var flameTimer = 0;
  var fire0 = document.getElementById("fire0");
  var fire1 = document.getElementById("fire1");
  var fire2 = document.getElementById("fire2");
  var fire3 = document.getElementById("fire3");
  var fire4 = document.getElementById("fire4");

  javascriptNode.onaudioprocess = function() {
      var array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      var values = 0;

      var length = array.length;
      for (var i = 0; i < length; i++) {
        values += (array[i]);
      }

      var average = values / length;
    
      if (flameTimer <= 50) flameTimer++;
      if ((average < 5) && (flameTimer > 50) && (fire4.style.display != "none")) {
        flameTimer = 0;
        fire0.style.display = "block";
        fire1.style.display = "block";
        fire2.style.display = "block";
        fire3.style.display = "block";
        fire4.style.display = "block";
        isPopUpShown = [false, false, false, false, false];
      }
    
      if (average > 5) showPopUp(fire0,0);
      if (average > 10) showPopUp(fire1,1);
      if (average > 15) showPopUp(fire2,2);
      if (average > 20) showPopUp(fire3,3);
      if (average > 30) showPopUp(fire4,4);
    }
}

(function(window, document, undefined) {

  // code that should be taken care of right away

  window.onload = init;

  function init(){
    var COLORS, Confetti, NUM_CONFETTI, PI_2, canvas, confetti, context, drawCircle, drawCircle2, drawCircle3, i, range, xpos;

    NUM_CONFETTI = 60;

    COLORS = [[255, 255, 255], [255, 144, 0], [255, 255, 255], [255, 144, 0], [0, 277, 235]];

    PI_2 = 2 * Math.PI;

    canvas = document.getElementById("confeti");

    context = canvas.getContext("2d");

    window.w = 0;

    window.h = 0;

    window.resizeWindow = function() {
      window.w = canvas.width = window.innerWidth;
      return window.h = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeWindow, false);

    window.onload = function() {
      return setTimeout(resizeWindow, 0);
    };

    range = function(a, b) {
      return (b - a) * Math.random() + a;
    };

    drawCircle = function(x, y, r, style) {
      context.beginPath();
      context.moveTo(x, y);
      context.bezierCurveTo(x - 17, y + 14, x + 13, y + 5, x - 5, y + 22);
      context.lineWidth = 3;
      context.strokeStyle = style;
      return context.stroke();
    };

    drawCircle2 = function(x, y, r, style) {
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + 10, y + 10);
      context.lineTo(x + 10, y);
      context.closePath();
      context.fillStyle = style;
      return context.fill();
    };

    drawCircle3 = function(x, y, r, style) {
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + 10, y + 10);
      context.lineTo(x + 10, y);
      context.closePath();
      context.fillStyle = style;
      return context.fill();
    };

    xpos = 0.9;

    document.onmousemove = function(e) {
      return xpos = e.pageX / w;
    };

    window.requestAnimationFrame = (function() {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        return window.setTimeout(callback, 100 / 20);
      };
    })();

    Confetti = class Confetti {
      constructor() {
        this.style = COLORS[~~range(0, 5)];
        this.rgb = `rgba(${this.style[0]},${this.style[1]},${this.style[2]}`;
        this.r = ~~range(2, 6);
        this.r2 = 2 * this.r;
        this.replace();
      }

      replace() {
        this.opacity = 0;
        this.dop = 0.03 * range(1, 4);
        this.x = range(-this.r2, w - this.r2);
        this.y = range(-20, h - this.r2);
        this.xmax = w - this.r;
        this.ymax = h - this.r;
        this.vx = range(0, 2) + 8 * xpos - 5;
        return this.vy = 0.7 * this.r + range(-1, 1);
      }

      draw() {
        var ref;
        this.x += this.vx;
        this.y += this.vy;
        this.opacity += this.dop;
        if (this.opacity > 1) {
          this.opacity = 1;
          this.dop *= -1;
        }
        if (this.opacity < 0 || this.y > this.ymax) {
          this.replace();
        }
        if (!((0 < (ref = this.x) && ref < this.xmax))) {
          this.x = (this.x + this.xmax) % this.xmax;
        }
        drawCircle(~~this.x, ~~this.y, this.r, `${this.rgb},${this.opacity})`);
        drawCircle3(~~this.x * 0.5, ~~this.y, this.r, `${this.rgb},${this.opacity})`);
        return drawCircle2(~~this.x * 1.5, ~~this.y * 1.5, this.r, `${this.rgb},${this.opacity})`);
      }

    };

    confetti = (function() {
      var j, ref, results;
      results = [];
      for (i = j = 1, ref = NUM_CONFETTI; (1 <= ref ? j <= ref : j >= ref); i = 1 <= ref ? ++j : --j) {
        results.push(new Confetti());
      }
      return results;
    })();

    window.step = function() {
      var c, j, len, results;
      requestAnimationFrame(step);
      context.clearRect(0, 0, w, h);
      results = [];
      for (j = 0, len = confetti.length; j < len; j++) {
        c = confetti[j];
        results.push(c.draw());
      }
      return results;
    };

    step();
  }

  

})(window, document, undefined);

(function() {
  

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLE1BQUEsRUFBQSxRQUFBLEVBQUEsWUFBQSxFQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQSxVQUFBLEVBQUEsV0FBQSxFQUFBLFdBQUEsRUFBQSxDQUFBLEVBQUEsS0FBQSxFQUFBOztFQUFBLFlBQUEsR0FBZTs7RUFDZixNQUFBLEdBQVMsQ0FBQyxDQUFDLEdBQUQsRUFBSyxHQUFMLEVBQVMsR0FBVCxDQUFELEVBQWdCLENBQUMsR0FBRCxFQUFLLEdBQUwsRUFBUyxDQUFULENBQWhCLEVBQTZCLENBQUMsR0FBRCxFQUFLLEdBQUwsRUFBUyxHQUFULENBQTdCLEVBQTRDLENBQUMsR0FBRCxFQUFLLEdBQUwsRUFBUyxDQUFULENBQTVDLEVBQXlELENBQUMsQ0FBRCxFQUFHLEdBQUgsRUFBTyxHQUFQLENBQXpEOztFQUNULElBQUEsR0FBTyxDQUFBLEdBQUUsSUFBSSxDQUFDOztFQUdkLE1BQUEsR0FBUyxRQUFRLENBQUMsY0FBVCxDQUF3QixTQUF4Qjs7RUFDVCxPQUFBLEdBQVUsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsSUFBbEI7O0VBRVYsTUFBTSxDQUFDLENBQVAsR0FBVzs7RUFDWCxNQUFNLENBQUMsQ0FBUCxHQUFXOztFQUVYLE1BQU0sQ0FBQyxZQUFQLEdBQXNCLFFBQUEsQ0FBQSxDQUFBO0lBQ3BCLE1BQU0sQ0FBQyxDQUFQLEdBQVcsTUFBTSxDQUFDLEtBQVAsR0FBZSxNQUFNLENBQUM7V0FDakMsTUFBTSxDQUFDLENBQVAsR0FBVyxNQUFNLENBQUMsTUFBUCxHQUFnQixNQUFNLENBQUM7RUFGZDs7RUFJdEIsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDLFlBQWxDLEVBQWdELEtBQWhEOztFQUNBLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLFFBQUEsQ0FBQSxDQUFBO1dB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Qkk7O0VBcENSOztFQWdFQSxRQUFBOztBQUFZO0lBQUEsS0FBc0IseUZBQXRCO21CQUFBLElBQUksUUFBSixDQUFBO0lBQUEsQ0FBQTs7OztFQUVaLE1BQU0sQ0FBQyxJQUFQLEdBQWMsUUFBQSxDQUFBLENBQUE7QUFDZCxRQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBO0lBQUUscUJBQUEsQ0FBc0IsSUFBdEI7SUFDQSxPQUFPLENBQUMsU0FBUixDQUFrQixDQUFsQixFQUFvQixDQUFwQixFQUFzQixDQUF0QixFQUF3QixDQUF4QjtBQUNBO0lBQUEsS0FBQSwwQ0FBQTs7bUJBQUEsQ0FBQyxDQUFDLElBQUYsQ0FBQTtJQUFBLENBQUE7O0VBSFk7O0VBS2QsSUFBQSxDQUFBO0FBOUlBIiwic291cmNlc0NvbnRlbnQiOlsiTlVNX0NPTkZFVFRJID0gNjBcbkNPTE9SUyA9IFtbMjU1LDI1NSwyNTVdLCBbMjU1LDE0NCwwXSwgWzI1NSwyNTUsMjU1XSwgWzI1NSwxNDQsMF0sIFswLDI3NywyMzVdXVxuUElfMiA9IDIqTWF0aC5QSVxuXG5cbmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkIFwiY29uZmV0aVwiXG5jb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQgXCIyZFwiXG5cbndpbmRvdy53ID0gMFxud2luZG93LmggPSAwXG5cbndpbmRvdy5yZXNpemVXaW5kb3cgPSAtPlxuICB3aW5kb3cudyA9IGNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoXG4gIHdpbmRvdy5oID0gY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAncmVzaXplJywgcmVzaXplV2luZG93LCBmYWxzZVxud2luZG93Lm9ubG9hZCA9IC0+IHNldFRpbWVvdXQgcmVzaXplV2luZG93LCAwXG5yYW5nZSA9IChhLGIpIC0+IChiLWEpKk1hdGgucmFuZG9tKCkgKyBhXG5cbmRyYXdDaXJjbGUgPSAoeCx5LHIsc3R5bGUpIC0+XG5cbiAgY29udGV4dC5iZWdpblBhdGgoKVxuICBjb250ZXh0Lm1vdmVUbyh4LCB5KVxuICBjb250ZXh0LmJlemllckN1cnZlVG8oeC0xNywgeSsxNCwgeCsxMywgeSs1LCB4LTUsIHkrMjIpXG4gIGNvbnRleHQubGluZVdpZHRoID0gM1xuICBjb250ZXh0LnN0cm9rZVN0eWxlID0gc3R5bGVcbiAgY29udGV4dC5zdHJva2UoKVxuXG5cbmRyYXdDaXJjbGUyID0gKHgseSxyLHN0eWxlKSAtPlxuXG4gIGNvbnRleHQuYmVnaW5QYXRoKClcbiAgY29udGV4dC5tb3ZlVG8oeCwgeSlcbiAgY29udGV4dC5saW5lVG8oeCsxMCwgeSsxMClcbiAgY29udGV4dC5saW5lVG8oeCsxMCwgeSlcbiAgY29udGV4dC5jbG9zZVBhdGgoKVxuICBjb250ZXh0LmZpbGxTdHlsZSA9IHN0eWxlXG4gIGNvbnRleHQuZmlsbCgpXG5cblxuZHJhd0NpcmNsZTMgPSAoeCx5LHIsc3R5bGUpIC0+XG5cbiAgY29udGV4dC5iZWdpblBhdGgoKVxuICBjb250ZXh0Lm1vdmVUbyh4LCB5KVxuICBjb250ZXh0LmxpbmVUbyh4KzEwLCB5KzEwKVxuICBjb250ZXh0LmxpbmVUbyh4KzEwLCB5KVxuICBjb250ZXh0LmNsb3NlUGF0aCgpXG4gIGNvbnRleHQuZmlsbFN0eWxlID0gc3R5bGVcbiAgY29udGV4dC5maWxsKClcblxuXG54cG9zID0gMC45XG5cbmRvY3VtZW50Lm9ubW91c2Vtb3ZlID0gKGUpIC0+XG4gIHhwb3MgPSBlLnBhZ2VYL3dcblxud2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGRvIC0+XG5cbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgICB8fFxuXG4gIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcblxuICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgIHx8XG5cbiAgd2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgICB8fFxuXG4gIHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgfHxcblxuICAoY2FsbGJhY2spIC0+IHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAgLyAyMClcblxuXG5jbGFzcyBDb25mZXR0aVxuXG4gIGNvbnN0cnVjdG9yOiAtPlxuXG4gICAgQHN0eWxlID0gQ09MT1JTW35+cmFuZ2UoMCw1KV1cblxuICAgIEByZ2IgPSBcInJnYmEoI3tAc3R5bGVbMF19LCN7QHN0eWxlWzFdfSwje0BzdHlsZVsyXX1cIlxuXG4gICAgQHIgPSB+fnJhbmdlKDIsNilcblxuICAgIEByMiA9IDIqQHJcblxuICAgIEByZXBsYWNlKClcblxuXG5cbiAgcmVwbGFjZTogLT5cblxuICAgIEBvcGFjaXR5ID0gMFxuXG4gICAgQGRvcCA9IDAuMDMqcmFuZ2UoMSw0KVxuXG4gICAgQHggPSByYW5nZSgtQHIyLHctQHIyKVxuXG4gICAgQHkgPSByYW5nZSgtMjAsaC1AcjIpXG5cbiAgICBAeG1heCA9IHctQHJcblxuICAgIEB5bWF4ID0gaC1AclxuXG4gICAgQHZ4ID0gcmFuZ2UoMCwyKSs4Knhwb3MtNVxuXG4gICAgQHZ5ID0gMC43KkByK3JhbmdlKC0xLDEpXG5cblxuXG4gIGRyYXc6IC0+XG5cbiAgICBAeCArPSBAdnhcblxuICAgIEB5ICs9IEB2eVxuXG4gICAgQG9wYWNpdHkgKz0gQGRvcFxuXG4gICAgaWYgQG9wYWNpdHkgPiAxXG5cbiAgICAgIEBvcGFjaXR5ID0gMVxuXG4gICAgICBAZG9wICo9IC0xXG5cbiAgICBAcmVwbGFjZSgpIGlmIEBvcGFjaXR5IDwgMCBvciBAeSA+IEB5bWF4XG5cbiAgICBpZiAhKDAgPCBAeCA8IEB4bWF4KVxuXG4gICAgICBAeCA9IChAeCArIEB4bWF4KSAlIEB4bWF4XG5cbiAgICBkcmF3Q2lyY2xlKH5+QHgsfn5AeSxAcixcIiN7QHJnYn0sI3tAb3BhY2l0eX0pXCIpXG4gICAgZHJhd0NpcmNsZTMofn5AeCowLjUsfn5AeSxAcixcIiN7QHJnYn0sI3tAb3BhY2l0eX0pXCIpXG4gICAgZHJhd0NpcmNsZTIofn5AeCoxLjUsfn5AeSoxLjUsQHIsXCIje0ByZ2J9LCN7QG9wYWNpdHl9KVwiKVxuXG5cblxuXG5cbmNvbmZldHRpID0gKG5ldyBDb25mZXR0aSBmb3IgaSBpbiBbMS4uTlVNX0NPTkZFVFRJXSlcblxud2luZG93LnN0ZXAgPSAtPlxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcbiAgY29udGV4dC5jbGVhclJlY3QoMCwwLHcsaClcbiAgYy5kcmF3KCkgZm9yIGMgaW4gY29uZmV0dGlcblxuc3RlcCgpIl19
//# sourceURL=coffeescript