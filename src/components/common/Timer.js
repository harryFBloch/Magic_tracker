export function Timer(defaultInterval, callback){
  var interval = defaultInterval;
  var running = true;
  function loop(){
    callback();
    if(running){
       setTimeout(function(){
          loop();
       }, interval);
    }
  }

  loop();
  return {
    setInterval: function(newInterval){
       interval = newInterval;
    },
    stop: function(){
        running = false;
    },
    start: function(){
         if(running===false){
            running = true;
            loop();
         }
    },
    add: function(milliToAdd){
         interval += milliToAdd*1;
    }

  }
}
