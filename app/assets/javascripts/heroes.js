// app/assets/javascripts/heroes.js
var my_hero_id = null,
    step = 8,
    height = 65,
    field_height = 400,
    width = 60,
    field_width = 800,
    images = [
      'http://res.cloudinary.com/dtz0cql1c/image/upload/v1454429557/soldier_fcgddn.png',
      'http://res.cloudinary.com/dtz0cql1c/image/upload/v1454429557/dart-moll_yrevyt.png',
      'http://res.cloudinary.com/dtz0cql1c/image/upload/v1454429557/Eneken_hsf2a1.png',
      'http://res.cloudinary.com/dtz0cql1c/image/upload/v1454429557/Leia_bhuj3s.png',
      'http://res.cloudinary.com/dtz0cql1c/image/upload/v1454429557/obi-van_pdf0bo.png',
      'http://res.cloudinary.com/dtz0cql1c/image/upload/v1454429557/yoda_ahaiza.png',
      'http://res.cloudinary.com/dtz0cql1c/image/upload/v1454429557/boba-fet_qdk8ce.png',
      'http://res.cloudinary.com/dtz0cql1c/image/upload/v1454429557/c3po_g3e5ts.png',
      'http://res.cloudinary.com/dtz0cql1c/image/upload/v1454429558/r2d2_obe1c1.png'
    ];

// Adds new element to DOM
function add_soldier (soldier) {
  if ( $('#map').find('#'+soldier.id).length != 0 ) { return }
  var image      = images[soldier.image],
      background = 'background-image: url(\'' + image + '\');';
  $('#map').append('<div class="soldier" id="' + soldier.id + '" style="' + background + '"><div>'+ soldier.name +'</div></div>');
}

// changes element bottom and left styles.
function move_soldier(id, x, y) {
  $('#map').find('#' + id).css({bottom: y, left: x})
}

// Establish socket connection
var socket = new WebSocket("ws://" + window.location.host + "/battlefield");

// Callback fires, when connection is established
socket.onopen = function (event) {
  console.log('Connected')
}

// Callback fires, when new message is received from the server
socket.onmessage = function(event) {
  // transform string into json
  var data = jQuery.parseJSON(event.data);
  // Save your hero id
  my_hero_id = my_hero_id || data.id;
  // Add new soldire on a map
  add_soldier(data);
  // Add sodlier possition, dependng on position returned from the server
  move_soldier(data.id, data.x, data.y)
};

// Key 'Move' callbacks
$(document).keydown( function (e) {
  switch (e.which) {
    case 37: // left
      var x = parseInt($('#'+my_hero_id).css('left')) - step;
      if (x >= 0){
        socket.send(JSON.stringify({
          id: my_hero_id,
          x: x
        }));
      }
    break;

    case 38: // up
      var y = parseInt($('#'+my_hero_id).css('bottom')) + step;
      if (y <= field_height - height) {
        socket.send(JSON.stringify({
          id: my_hero_id,
          y: y
        }));
      }
    break;

    case 39: // right
      var x = parseInt($('#'+my_hero_id).css('left')) + step;
      if (x <= field_width - width) {
        socket.send(JSON.stringify({
          id: my_hero_id,
          x: x
        }));
      }
    break;

    case 40: // down
      var y = parseInt($('#'+my_hero_id).css('bottom')) - step;
      if (y >= 0){
        socket.send(JSON.stringify({
          id: my_hero_id,
          y: y
        }));
      }
    break;

    case 32: // space
      $('#'+my_hero_id).addClass('atack');
      setTimeout(function() {
        $('#'+my_hero_id).removeClass("atack");
      }, 200);
      var enemy_id = [];
      $('.soldier').each(function() {
        if ($(this).attr('id') != my_hero_id){
          if(intersect($('#'+my_hero_id).position(), $(this).position(), width, height)){
            enemy_id.push($(this).attr('id'));
            $(this).addClass('die');
            $(this).fadeOut(500, function(){ $(this).remove();});
          }
        }
      });
      //console.log(enemy_id);
      var y = parseInt($('#'+my_hero_id).css('bottom')) - step;
      socket.send(JSON.stringify({
        id: my_hero_id,
        atack: true,
        enemys: enemy_id
      }));
    break;

    default: return; // exit this handler for other keys
  }
  e.preventDefault(); // prevent the default action (scroll / move caret)
});

var intersect = function(a,b, width, height){
  return(
    (
      (
        ( a.left>=b.left && a.left<=b.left + width )||( a.left + width>=b.left && a.left + width<=b.left + width  )
      ) && (
        ( a.top>=b.top && a.top<=b.top + height )||( a.top + height>=b.top && a.top + height<=b.top + height )
      )
    )||(
      (
        ( b.left>=a.left && b.left<=a.left + width )||( b.left + width>=a.left && b.left + width<=a.left + width  )
      ) && (
        ( b.top>=a.top && b.top<=a.top + height )||( b.top + height>=a.top && b.top + height<=a.top + height )
      )
    )
  )||(
    (
      (
        ( a.left>=b.left && a.left<=b.left + width )||( a.left + width>=b.left && a.left + width<=b.left + width  )
      ) && (
        ( b.top>=a.top && b.top<=a.top + height )||( b.top + height>=a.top && b.top + height<=a.top + height )
      )
    )||(
      (
        ( b.left>=a.left && b.left<=a.left + width )||( b.left + width>=a.left && b.left + width<=a.left + width  )
      ) && (
        ( a.top>=b.top && a.top<=b.top + height )||( a.top + height>=b.top && a.top + height<=b.top + height )
      )
    )
  );
}
