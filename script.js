// get canvas related references
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var WIDTH = canvas.width;
var HEIGHT = canvas.height;

//Set constants
const titleText = "This is a simple demonstration showing that a circle can always be formed between 3 points.";
const dotFill = "black";
const dotRadius = 15;
const circleStroke = "black";
const circleStrokeWidth = 1;

//Create dots
const dots = [];

//Dot1
dots.push({
	x: WIDTH / 2,
	y: HEIGHT / 2.2,
	isDragging: false,
});

//Dot2
dots.push({
	x: WIDTH / 2.5,
	y: HEIGHT / 2.5,
	isDragging: false,
});

//Dot3
dots.push({
	x: WIDTH / 3,
	y: HEIGHT / 1.8,
	isDragging: false,
});

//Drag related variables
var draging = false;
var mouseXOffset;
var mouseYOffset;

// listen for mouse events
canvas.onmousedown = myDown;
canvas.onmouseup = myUp;
canvas.onmousemove = myMove;
window.addEventListener('resize', myResize);

draw();

function draw() {
	clear();
	
	var x1 = dots[0]['x'];
	var y1 = dots[0]['y'];
	
	var x2 = dots[1]['x'];
	var y2 = dots[1]['y'];
	
	var x3 = dots[2]['x'];
	var y3 = dots[2]['y'];
	
	var m12 = (y2 - y1) / (x2 - x1);
	var m23 = (y3 - y2) / (x3 - x2);
	
	var pb12x = ((x2 - x1) / 2) + x1;
	var pb12y = ((y2 - y1) / 2) + y1;
	var pb12m = - 1 / m12;
	var pb12b = pb12m * (-1 * pb12x) + pb12y;
	
	var pb23x = ((x3 - x2) / 2) + x2;
	var pb23y = ((y3 - y2) / 2) + y2;
	var pb23m = - 1 / m23;
	var pb23b = pb23m * (-1 * pb23x) + pb23y;
	
	var x = (pb23b - pb12b) / (pb12m - pb23m);
	var y = (pb12m * x) + pb12b;
	var r = Math.sqrt(Math.pow(x1 - x, 2) + Math.pow(y1 - y, 2));
	
	drawDot(x1, y1);
	drawDot(x2, y2);
	drawDot(x3, y3);
	
	drawCircle(x, y, r);
	
	drawTitle(titleText);
}

function drawDot(x, y) {
	ctx.fillStyle = dotFill;
	ctx.beginPath();
	ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
	ctx.closePath();
	ctx.fill();
}

function drawCircle(x, y, r) {
	ctx.strokeStyle = circleStroke;
	ctx.lineWidth = circleStrokeWidth;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.stroke();
}

function drawTitle(text) {
	var params = {
		context: ctx,
		text: text,
		font: "30px Arial",
		maxWidth: WIDTH,
		alignment: "center",
		padding: 5,
		useBackground: true,
	};
	
	drawMultilineText(params);
}

// clear the canvas
function clear() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// handle mousedown events
function myDown(e){
	// tell the browser we're handling this mouse event
	e.preventDefault();
	e.stopPropagation();
	
	// get the current mouse position
	var mx = parseInt(e.clientX);
	var my = parseInt(e.clientY);
	
	// test each shape to see if mouse is inside
	draging = false;
	
	for(var i = 0; i < dots.length; i++){
		var dot = dots[i];
		
		var dx = dot.x - mx;
		var dy = dot.y - my;
		// test if the mouse is inside this circle
		if(dx * dx + dy * dy < dotRadius * dotRadius){
			draging = true;
			dot.isDragging = true;
			
			mouseXOffset = dx;
			mouseYOffset = dy;
			
			break;
		}
	}
}

// handle mouseup events
function myUp(e){
	// tell the browser we're handling this mouse event
	e.preventDefault();
	e.stopPropagation();
	
	// clear all the dragging flags
	draging = false;
	
	for(var i = 0;i < dots.length; i++){
		dots[i].isDragging = false;
	}
}

// handle mouse moves
function myMove(e){
	// if we're dragging anything...
	if(draging){
		// tell the browser we're handling this mouse event
		e.preventDefault();
		e.stopPropagation();
	
		// get the current mouse position
		var mx = parseInt(e.clientX);
		var my = parseInt(e.clientY);
	
		// move each rect that isDragging 
		// by the distance the mouse has moved
		// since the last mousemove
		for(var i = 0; i < dots.length; i++){
			var dot = dots[i];
			
			if(dot.isDragging){
				dot.x = mx + mouseXOffset;
				dot.y = my + mouseYOffset;
				
				break;
			}
		}
	
		// redraw the scene with the new rect positions
		draw();
	}
}

function myResize(e) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	WIDTH = canvas.width;
	HEIGHT = canvas.height;
	
	draw();
}