var height = window.innerHeight;
var width = window.innerWidth;

function createBg(left,top,width,height,tag="left"){
  var bg = document.createElement("div");
  bg.style.position="absolute";
  bg.style.zIndex="1100";
  bg.style.background="rgba(0,0,0,0.4)";
  bg.style.top=(top)+"px";
  bg.style.left=(left)+"px";
  console.log(left,top,width,height)
  if(window.innerWidth-left>=width-left){
    bg.style.width=width-left+"px";
  } else {
    bg.style.width=window.innerWidth-left+"px";
  }
  if(window.innerHeight-top>=height-top){
    bg.style.height=height-top+"px";
  } else {
    bg.style.height=window.innerHeight-top+"px";
  }
  // /bg.style.border="1px solid";
  bg.setAttribute("class",tag);
  document.body.appendChild(bg);
}
var height = window.innerHeight;
var width = window.innerWidth;

function randomFly(x,y){
  var sq = document.createElement("div");
  sq.setAttribute("class","fly");
  sq.innerHTML="<span>"+document.querySelectorAll(".fly").length+"</span>";
  sq.style.top=y + "px";
  sq.style.left=x + "px";
  document.body.appendChild(sq);
}

function searchBoxV2(boxesCordsY,eX,eY){
  for(var b=0;b<boxesCordsY.length;b++){
    var anterior=0;
    var siguiente=eY;
    if(b-1>=0){
      anterior=boxesCordsY[b-1].bottom;
    }
    siguiente=boxesCordsY[b].top;
    console.log(anterior,siguiente);
    console.log("e");
    createBg(0,anterior,eX,siguiente);
    //izq
    var maxedYL=0;
    var maxedYR=0;
    for(var bn=0;bn<boxesCordsY.length;bn++){
      if(bn!=b){
        if(boxesCordsY[bn].right<boxesCordsY[b].x&&
          ( boxesCordsY[bn].bottom>boxesCordsY[b].y && boxesCordsY[bn].bottom<boxesCordsY[b].bottom
            ||
            boxesCordsY[bn].y<boxesCordsY[b].bottom && boxesCordsY[bn].y>boxesCordsY[b].y
          )
        ){
          maxedYL=boxesCordsY[bn].bottom;
          if(boxesCordsY[bn].y<boxesCordsY[b].bottom && boxesCordsY[bn].y>boxesCordsY[b].y){
            createBg(
              0,
              boxesCordsY[b].top,
              boxesCordsY[b].left,
              boxesCordsY[bn].top
            );
          } else {
            createBg(
              boxesCordsY[bn].right,
              boxesCordsY[b].top,
              boxesCordsY[b].left,
              boxesCordsY[bn].bottom
            );
          }
        } else if(boxesCordsY[bn].x>boxesCordsY[b].right&&
          ( boxesCordsY[bn].bottom>boxesCordsY[b].y && boxesCordsY[bn].bottom<boxesCordsY[b].bottom
            ||
            boxesCordsY[bn].y<boxesCordsY[b].bottom && boxesCordsY[bn].y>boxesCordsY[b].y
          )
        ){
        maxedYR=boxesCordsY[bn].bottom;
          if(boxesCordsY[bn].y<boxesCordsY[b].bottom && boxesCordsY[bn].y>boxesCordsY[b].y){
            createBg(
              boxesCordsY[b].right,
              boxesCordsY[b].top,
              eX,
              boxesCordsY[bn].top,
              "right"
            );
          } else {
            createBg(
              boxesCordsY[b].right,
              boxesCordsY[b].top,
              boxesCordsY[bn].left,
              boxesCordsY[bn].bottom,
              "right"
            );
          }
        }
      }
    }
    if(maxedYL==0){
      createBg(
        0,
        boxesCordsY[b].top,
        boxesCordsY[b].left,
        boxesCordsY[b].bottom
      );
    } else if(maxedYL<boxesCordsY[b].bottom){
      createBg(
        0,
        maxedYL,
        boxesCordsY[b].left,
        boxesCordsY[b].bottom
      );
    }
    if(maxedYR==0){
      createBg(
        boxesCordsY[b].right,
        boxesCordsY[b].top,
        eX,
        boxesCordsY[b].bottom,
        "right"
      );
    } else if(maxedYR<boxesCordsY[b].bottom){
      createBg(
        boxesCordsY[b].right,
        maxedYR,
        eX,
        boxesCordsY[b].bottom,
        "right"
      );
    }
  }
  createBg(0,boxesCordsY[boxesCordsY.length-1].bottom,eX,eY);
}

function generateBg(){
  var boxes = document.querySelectorAll(".fly");
  var boxesCordsX=[];
  var boxesCordsY=[];
  for(var b=0;b<boxes.length;b++){
    var o = boxes[b].getBoundingClientRect();
    o.id=b;
    boxesCordsX.push(o);
    boxesCordsY.push(o);
  }
  boxesCordsY.sort(function(a, b) {
      return a.y - b.y;
  });
  //searchBox(boxesCords,0,0,0,0,width,height);
  searchBoxV2(boxesCordsY,width,height);
}

window.onload=function(){
  if(document.querySelectorAll(".fly").length===0){
    for(var i=0;i<2;i++){
      randomFly(Math.floor((Math.random() * (width-100)) + 1),Math.floor((Math.random() * (height-100)) + 1));
    }
  }
  generateBg();
}
