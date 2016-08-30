// inner variables
var canvas, ctx;

var iStart ;
var bRightBut = false;
var bLeftBut = false;
var oBall, oPadd, oBricks;
var aSounds = [];
var iPoints = 0;
var iGameTimer;
var iElapsed = iMin = iSec = 0;
var bestTime = 0, bestPoints = 0;
var onoff = 0;
var live = 0;
var level = 1;
var su = 1;
var xi;
// objects :
function Ball(x, y, dx, dy, r) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
}
function Padd(x, w, h, img) {
    this.x = x;
    this.w = w;
    this.h = h;
    this.img = img;
}
function Bricks(w, h, r, c, p) {
    this.w = w;
    this.h = h;
    this.r = r; // rows
    this.c = c; // cols
    this.p = p; // padd
    this.objs;
    this.colors = ['#9d9d9d', '#f80207', '#feff01', '#0072ff', '#fc01fc', '#03fe03']; // colors for rows
}

// -------------------------------------------------------------
// draw functions :

function clear() { // clear canvas function
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // fill background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawScene() { // main drawScene function
 
    clear(); // clear canvas
    
    // draw Ball (circle)
    ctx.fillStyle = '#f66';
    ctx.beginPath();
    ctx.arc(oBall.x, oBall.y, oBall.r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    // draw Padd (rectangle)
    ctx.drawImage(oPadd.img, oPadd.x, ctx.canvas.height - oPadd.h);

    // draw bricks (from array of its objects)
      
    for (i=0; i < oBricks.r; i++) {
        ctx.fillStyle = oBricks.colors[i];
        for (j=0; j < oBricks.c; j++) {
       
            if (oBricks.objs[i][j] == 1) {
                ctx.beginPath();
                ctx.rect((j * (oBricks.w + oBricks.p)) + oBricks.p, (i * (oBricks.h + oBricks.p)) + oBricks.p, oBricks.w, oBricks.h);
                ctx.closePath();
                ctx.fill();
                
            }
        }
    }
}
function control(){
   if(live == 1){
    drawScene() ;
     su = 1;
   for (i=0; i < oBricks.r; i++) 
    for (j=0; j < oBricks.c; j++) 
{
    if(oBricks.objs[i][j] == 1)
        su = 0;
	 
 }
   if(su == 1)
{
 ctx.fillText('click to next mission ', 300, 250);
	  clearInterval(iStart);
        clearInterval(iGameTimer); 
}

    if (bRightBut)
      { if(oPadd.x + oPadd.w < ctx.canvas.width)
        oPadd.x += 5;}
    if (bLeftBut)
     {      if(oPadd.x  > 0)
        oPadd.x -= 5;
}
   
 // reverse X position of ball
    if (oBall.x + oBall.dx + oBall.r > ctx.canvas.width || oBall.x + oBall.dx - oBall.r < 0) {
        oBall.dx = -oBall.dx;
    }
    // collision detection
   var iRowH, iColW ,iRow,iCol,iR2,iC2;
    iRowH = oBricks.h + oBricks.p;
    iColW = oBricks.w + oBricks.p;

    iR2 = Math.floor((oBall.y + oBall.dy ) / iRowH);
    iC2 = Math.floor((oBall.x +oBall.dx )/ (oBricks.w + oBricks.p));
    if(oBall.dy >0)
    iRow = Math.floor((oBall.y + oBall.dy + oBall.r) / iRowH);
    else 
     iRow = Math.floor((oBall.y + oBall.dy - oBall.r) / iRowH);
    if(oBall.dx >= 0)
    iCol = Math.floor((oBall.x +oBall.dx + oBall.r)/ (oBricks.w + oBricks.p));
    else 
    iCol = Math.floor((oBall.x +oBall.dx -oBall.r)/ (oBricks.w + oBricks.p));




    
    // mark brick as broken (empty) and reverse brick
    
if (iRow<=5 && iRow >= 0 && iCol <=7 && iCol >= 0)
  {
         if(iC2>=0 && iC2<=7 &&iR2>=0 && iR2<=5)
     {  
         if(oBricks.objs[iRow][iC2]== 1 && oBricks.objs[iR2][iCol]==1 )
         { 
            if( iRow == iR2 &&  iCol == iC2)
            {
              	aSounds[0].play(); 
			iPoints++;
      			 oBricks.objs[iRow][iC2]= 0;

          	   if(oBall.dy < 0)
   xi = ((iRow + 1)*iRowH - oBall.y ) * ( oBall.dx /oBall.dy )+ oBall.x ;
     		 if(oBall.dy > 0) 
     	xi = (iRow * iRowH - oBall.y)* ( oBall.dx / oBall.dy )+ oBall.x ;
  
    if( xi >= iC2*(oBricks.w + oBricks.p)&& xi <= (iC2 + 1)*	(oBricks.w + oBricks.p ) ) 
            oBall.dy = -oBall.dy;
       	 else
            oBall.dx = -oBall.dx;

       	 }
     		 if( iRow == iR2 && iCol != iC2 ||
             iRow != iR2 && iCol != iC2  )
 		{
         
              aSounds[0].play(); 
			iPoints++;
      		 oBricks.objs[iRow][iC2]= 0;
      
             oBall.dy = -oBall.dy;   
    
	      }   
            if( iRow != iR2 && iCol == iC2 )
            {
		aSounds[0].play(); 
			iPoints++;
      		 oBricks.objs[iR2][iC2]= 0;
      
             oBall.dx = -oBall.dx;   

	     }

        }
   else {
		if(oBricks.objs[iRow][iC2]== 1 )
			{
				 aSounds[0].play(); 
			iPoints++;
      		 oBricks.objs[iRow][iC2]= 0;
      
             oBall.dy = -oBall.dy;   
    

			}
            if(oBricks.objs[iR2][iCol]==1 )
			{
				aSounds[0].play(); 
			iPoints++;
      		 oBricks.objs[iR2][iCol]= 0;
      
             oBall.dx = -oBall.dx;   
			}
	}
  }
     else
  {
  if(iR2>=0 && iR2<=5)
      {
    		 if( oBricks.objs[iR2][iCol]==1 )
		{
			aSounds[0].play(); 
			iPoints++;
      		 oBricks.objs[iR2][iCol]= 0;
      
             oBall.dx = -oBall.dx;   
		}

     }
  if(iC2>=0 && iC2<=7 )

       {
		 if( oBricks.objs[iRow][iC2]==1 )
		{
			aSounds[0].play(); 
			iPoints++;
      		 oBricks.objs[iRow][iC2]= 0;
      
             oBall.dy = -oBall.dy;   
		}
      }

   }  
 }  
  else{
      if( iR2>=0 && iR2<=5 && iCol <=7 && iCol >= 0)
{
	 if( oBricks.objs[iR2][iCol]==1 )
		{
			aSounds[0].play(); 
			iPoints++;
      		 oBricks.objs[iR2][iCol]= 0;
      
             oBall.dx = -oBall.dx;   
		}


}

}

    if (oBall.y + oBall.dy - oBall.r < 0) {
        oBall.dy = -oBall.dy;
    } else if (oBall.y + oBall.dy + oBall.r > ctx.canvas.height - oPadd.h) {
        if (oBall.x >= oPadd.x && oBall.x <= oPadd.x + oPadd.w) {
            oBall.dx = 10 * ((oBall.x-(oPadd.x+oPadd.w/2))/oPadd.w);
         // 反弹算法
            oBall.dy = -oBall.dy;

            aSounds[2].play(); // play sound
        }
        else if (oBall.y + oBall.dy + oBall.r > ctx.canvas.height) {
            

            // HTML5 Local storage - save values 新特性：本地存储
           if(iPoints > bestPoints )
            {
            localStorage.setItem('best-time', iMin + ':' + iSec);
            localStorage.setItem('best-points', iPoints);
            }             
             live = 0;
             aSounds[1].play();
            clearInterval(iStart);
            clearInterval(iGameTimer);
              ctx.fillText('GAME OVER ' , 320, 350);
           ctx.fillText('click to restart ' , 310, 380); // play sound
        }          
    }

    oBall.x += oBall.dx;
    oBall.y += oBall.dy;

    ctx.font = '16px Verdana';
    ctx.fillStyle = '#fff';
    iMin = Math.floor(iElapsed / 60);
    iSec = iElapsed % 60;
    if (iMin < 10) iMin = "0" + iMin;
    if (iSec < 10) iSec = "0" + iSec;
    ctx.fillText('Level: '+ level,600,580);
    ctx.fillText('Time: ' + iMin + ':' + iSec, 600, 520);
    ctx.fillText('Points: ' + iPoints, 600, 550);

    if (bestTime != null && bestPoints != null) {
        ctx.fillText('Best Time: ' + bestTime, 600, 460);
        ctx.fillText('Best Points: ' + bestPoints, 600, 490);
    }
}
}

 function start(){
    canvas = document.getElementById('scene');
    ctx = canvas.getContext('2d');

    var width = canvas.width;
    var height = canvas.height;

    var padImg = new Image();
    padImg.src = 'images/padd.png';
    padImg.onload = function() {};
    
    oBall = new Ball(width / 2, 550, 0.5, -3,7); // new ball object
    oPadd = new Padd(width / 2, 120, 20, padImg); // new padd object
  oBricks = new Bricks((width / 8)-2, 20, 6, 8, 2); // new bricks object

    oBricks.objs = new Array(oBricks.r); // fill-in bricks
    for (i=0; i < oBricks.r; i++) {
        oBricks.objs[i] = new Array(oBricks.c);
        for (j=0; j < oBricks.c; j++) {
            oBricks.objs[i][j] = 1;
        }
    }
    aSounds[0] = new Audio('media/snd1.wav');
    aSounds[0].volume = 0.9;
    aSounds[1] = new Audio('media/snd2.wav');
    aSounds[1].volume = 0.9;
    aSounds[2] = new Audio('media/snd3.wav');
    aSounds[2].volume = 0.9;

    live = 1;
   
    // HTML5 Local storage - get values
    bestTime = localStorage.getItem('best-time');
    bestPoints = localStorage.getItem('best-points');
    control();
    $(window).keydown(function(event){ // keyboard-down alerts
        switch (event.keyCode) {
            case 37: // 'Left' key
                bLeftBut = true;
                break;
            case 39: // 'Right' key
                bRightBut = true;
                break;
        }
    });
    $(window).keyup(function(event){ // keyboard-up alerts
        switch (event.keyCode) {
            case 37: // 'Left' key
                bLeftBut = false;
                break;
            case 39: // 'Right' key
                bRightBut = false;
                break;
        }
    });

    var iCanvX1 = $(canvas).offset().left;
    var iCanvX2 = iCanvX1 + width;
//鼠标响应
    $('#scene').mousemove(function(e) { // binding mousemove event
        if(onoff  == 1)
        if (e.pageX > iCanvX1 && e.pageX < iCanvX2) {
            oPadd.x = Math.max(e.pageX - iCanvX1 - (oPadd.w/2), 0);
            oPadd.x = Math.min(ctx.canvas.width - oPadd.w, oPadd.x);
        }
    });

    $('#scene').mousedown(function(q) { // binding mousedown event
     if( live == 1)
{
       if(su == 0)
{
       if( onoff == 0)
{
    onoff = 1;
    iStart = setInterval(control, 10); // loop drawScene刷频时间
    iGameTimer = setInterval(countTimer, 1000); // inner game timer
   
}
    else
{
            onoff = 0;
            clearInterval(iStart);
            clearInterval(iGameTimer);
           
}
}
else{
           

		  for (i=0; i < oBricks.r; i++) 
        for (j=0; j < oBricks.c; j++) 
             oBricks.objs[i][j] = 1;  
              level ++;
        oBall.x = width / 2;
        oBall.y = 550;
        oBall.dx = 0.5;
        oBall.dy = -2-level;
        oPadd.x =width / 2 ; 
          live = 1;
        onoff = 0;
        control();
       

}
}

else 
{ 
       
          iPoints = 0;
          iElapsed = iMin = iSec = 0;
          onff = 0;
          for (i=0; i < oBricks.r; i++) 
        for (j=0; j < oBricks.c; j++) 
             oBricks.objs[i][j] = 1;  
        level = 1;
        oBall.x = width / 2;
        oBall.y = 550;
        oBall.dx = 0.5;
        oBall.dy = -2-level;
        oPadd.x =width / 2 ; 
        bestTime = localStorage.getItem('best-time');
        bestPoints = localStorage.getItem('best-points');
          live = 1;
         
      
 }
    });


}
// initialization
$(function(){
    start();
  });

function countTimer() {
    iElapsed++;
}