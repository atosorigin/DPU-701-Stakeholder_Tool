window.onload = function(){
	setup();
}

/* Variables */
var backgroundCanvas;
var canvas;
var backCtx;
var ctx;

var stakeholders = [];

var canvasSide;
var canvasArea;

function setup(){
    document.getElementById("projectID").focus();

    //Get canvas objects
	backgroundCanvas = document.getElementById('backgroundCanvas');
	canvas = document.getElementById('draggableCanvas');
	backCtx = backgroundCanvas.getContext("2d");
	ctx = canvas.getContext('2d');

    stakeholders = [];

    //Get the appropriate size for the canvas
    canvasSide;
    canvasArea;
    screenChanged();

	canvas.addEventListener('mousedown', mouseDown, false);

	window.addEventListener('mouseup', mouseUp, false);
	window.addEventListener("resize", screenChanged);

	document.getElementById('addNewStakeholderForm').addEventListener('submit', addStakholder, false);
	document.getElementById('exportButton').addEventListener('click', savePNG, false);
	document.getElementById('resetButton').addEventListener('click', reset, false);
	//document.getElementById('helpButton').addEventListener('click', drawHelp, false);
	
	draw();
}

function mouseUp()
{
    window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e){
    for(var i = 0; i < stakeholders.length; i++){

        var staker = stakeholders[i];

        if(detectHit(staker.x, staker.y, e.clientX, e.clientY, staker.w, staker.h)){
            currentObject = staker;
            window.addEventListener('mousemove', divMove, true);
            break;
        }
    }
}

function divMove(e){
    currentObject.x = e.clientX - canvasArea.left -25;
    currentObject.y = e.clientY - canvasArea.top -25;
    draw();
}

function detectHit(objx, objy, mousex, mousey, objw, objh){

    mousex -= canvasArea.left;
    mousey -= canvasArea.top;


    if((mousex > objx && mousex < (objx+objw)) && (mousey > objy && mousey < (objy+objh))){
        return true;
    }else{
        return false;
    }
}

function draw(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(var i = 0; i < stakeholders.length; i++){
        var staker = stakeholders[i];

        ctx.fillStyle = staker.colour;
        ctx.fillRect(staker.x, staker.y, staker.w, staker.h)
        ctx.font = '15px Arial';
        ctx.fillStyle = "#000000";
        ctx.fillText(staker.stakeholderName, staker.x, staker.y + staker.h + 12)
    }
}

function savePNG(){
    var output = document.createElement('canvas');

    output.height = canvasSide - 5;
    output.width = output.height;
    var outCtx = output.getContext('2d');

    outCtx.drawImage(backgroundCanvas, 0, 0);
    for(var i = 0; i < stakeholders.length; i++){
        var staker = stakeholders[i];

        outCtx.fillStyle = staker.colour;
        outCtx.fillRect(staker.x, staker.y, staker.w, staker.h)
        outCtx.font = '15px Arial';
        outCtx.fillStyle = "#000000";
        outCtx.fillText(staker.stakeholderName, staker.x, staker.y + staker.h + 12);
    }

    var dataURL = output.toDataURL("image/png");
    document.getElementById('exportButton').href = dataURL;

    drawHelp();
}

function drawBackground(){
    var backgroundImage = new Image();
    backgroundImage.onload = function(){

        backCtx.drawImage(backgroundImage, 0, 0, backgroundCanvas.width, backgroundCanvas.height);
    }
    backgroundImage.src = "images/axis.svg";
}

function setupCanvas(){

    backgroundCanvas.height = canvasSide - 5;
    backgroundCanvas.width = backgroundCanvas.height;

    var backgroundAres = backgroundCanvas.getBoundingClientRect();

    canvas.style.top = backgroundAres.top + "px";
    canvas.style.left = backgroundAres.left  + "px";

    canvas.height = canvasSide - 5;
    canvas.width = canvas.height;
}

function addStakholder(e){
    e.preventDefault

    if(document.getElementById("stakeholderName").value){
        var newStaker = {
            x:20, y:20, w:70, h:70,
            colour:randomColour(),
            stakeholderName: document.getElementById("stakeholderName").value
        };

        document.getElementById("stakeholderName").value = "";
        stakeholders.push(newStaker);

        drawStakeholderList();

        draw();
    }else{
        alert('Please enter a name');
    }
}

function randomColour(){
    return '#'+Math.floor(Math.random()*16777215).toString(16);
}

function getDimensions(){
    var winHeight = window.innerHeight;
    var winWidth = window.innerWidth * 2/3; //Take controls panel into account.

    if(winHeight < winWidth){
        return winHeight;
    }else{
        return winWidth;
    }
}

function setupMenu(){
    var controls = document.getElementById("controls");

    controls.style.height = window.innerHeight + "px";
    controls.style.width = window.innerWidth/3  + "px";
}

function reset(){
    stakeholders = [];
    drawStakeholderList();
    draw();
}

function screenChanged(){
    canvasSide = getDimensions()-6; //take 3px margin around canvas into account.
    setupMenu();
    setupCanvas();
    drawBackground();
    canvasArea = canvas.getBoundingClientRect();
    draw();
}

function drawHelp(){
    var overlay = new Image();
    overlay.onload = function(){

        ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);
    }
    overlay.src = "images/helpOverlay.svg";
}

function drawStakeholderList(){
    var listItem = '';
    document.getElementById("stakeholderList").innerHTML = listItem;

    for(var i = 0; i<stakeholders.length; i++){
        var stake = stakeholders[i];
        listItem = '<div class="greyBoarder inline vSpacingSmall">'+
                        '<a id="colourKey'+ i +'" href="#" class="colourKey"></a>'+
                        '<input type="text" class="steakHeight" readonly value="'+ stake.stakeholderName +'"/>'+
                   '</div>'+
                   '<input id="deleteSteak'+ i +'" type="button" class="delete steakHeight" value="X" onclick="deleteSteak('+ i +')"/>'
        document.getElementById("stakeholderList").innerHTML += listItem;

        document.getElementById("colourKey"+ i).style.background = stake.colour;
    }
}

function deleteSteak(stakeID){
    stakeholders.splice(stakeID, 1);
    drawStakeholderList();
    draw();
}
