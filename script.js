var HEIGHT = window.innerHeight;
var WIDTH = window.innerWidth;

function createBg(left, top, width, height, tag, parent) {
  if (width == 0 || height == 0) {
    return;
  }
  var bg = document.createElement("div");
  bg.style.position = "absolute";
  bg.style.zIndex = "1100";
  bg.style.background = "rgba(0,0,0,0.4)";
  bg.style.top = top + "px";
  bg.style.left = left + "px";
  bg.style.width = Math.abs(width) + "px";
  bg.style.height = Math.abs(height) + "px";
  bg.setAttribute("class", tag);
  bg.setAttribute("owner", parent);
  document.body.appendChild(bg);
}

function randomFly(x, y) {
  var sq = document.createElement("div");
  sq.setAttribute("class", "fly");
  sq.innerHTML =
    "<span>" + document.querySelectorAll(".fly").length + "</span>";
  sq.style.top = y + "px";
  sq.style.left = x + "px";
  sq.style.backgroundColor =
    "rgba(" +
    Math.floor(Math.random() * 255) +
    "," +
    Math.floor(Math.random() * 255) +
    "," +
    Math.floor(Math.random() * 255) +
    ",0.3)";
  document.body.appendChild(sq);
}

function collision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function createArea(x, y, width, height) {
  return { x, y, width, height };
}

function searchAndCreate(areas, cords, depth = 0) {
  let collide = false;
  loop1: for (let a in areas) {
    const area = areas[a];
    loop2: for (let c in cords) {
      const cord = cords[c];
      if (collision(area, cord)) {
        collide = true;
        if (area.y + area.height > cord.y) {
          console.log(area);
          area.height = area.y - cord.y;
          console.log(area);
        } else if (
          area.x + area.width > cord.x &&
          area.y < cord.y + cord.height &&
          area.y + area.height > cord.y
        ) {
          console.log("hi");
          area.width = cord.x;
        } else if (
          area.x < cord.x + cord.width &&
          area.y < cord.y + cord.height &&
          area.y + area.height > cord.y
        ) {
          area.width = cord.x;
        }
        areas.push(createArea(area.x, cord.y, cord.x, cord.height));
        areas.push(
          createArea(
            cord.x + cord.width,
            cord.y,
            WIDTH - cord.x - cord.width,
            cord.height
          )
        );
        areas.push(
          createArea(
            area.x,
            cord.y + cord.height,
            WIDTH,
            HEIGHT - cord.y - cord.height
          )
        );
        break loop1;
      }
    }
  }
  if (collide && depth < 1) {
    return searchAndCreate(areas, cords, depth + 1);
  }
  return areas;
}

function searchBoxV2(cords, maxX, maxY) {
  cords.sort((a, b) => (a.y > b.y ? 1 : -1)); //up to down order
  const bigArea = {
    x: 0,
    y: 0,
    width: WIDTH,
    height: HEIGHT
  };
  const result = searchAndCreate([bigArea], cords);
  for (let r in result) {
    const box = result[r];
    createBg(box.x, box.y, box.width, box.height);
  }
}

function createBox(list, data) {
  const object = {
    ...data
  };
  object.id = list.length;
  object.top = data.y;
  object.left = data.x;
  object.right = data.x + data.width;
  object.bottom = data.y + data.height;
  return object;
}

function generateBg() {
  var boxes = document.querySelectorAll(".fly");
  var boxesCordsY = [];
  for (var b = 0; b < boxes.length; b++) {
    var o = boxes[b].getBoundingClientRect();
    boxesCordsY.push(o);
  }
  boxesCordsY.sort(function(a, b) {
    return a.y - b.y;
  });
  console.log(boxesCordsY);
  const cleanedBoxes = [];
  const skipBoxes = [];
  for (let b1 = 0; b1 < boxesCordsY.length; b1++) {
    let didBreak = false;
    for (let b2 = 0; b2 < boxesCordsY.length; b2++) {
      if (
        b1 !== b2 &&
        skipBoxes.indexOf(b1 + "." + b2) === -1 &&
        skipBoxes.indexOf(b2 + "." + b1) === -1
      ) {
        if (
          boxesCordsY[b1].x < boxesCordsY[b2].x + boxesCordsY[b2].width &&
          boxesCordsY[b1].x + boxesCordsY[b1].width > boxesCordsY[b2].x &&
          boxesCordsY[b1].y < boxesCordsY[b2].y + boxesCordsY[b2].height &&
          boxesCordsY[b1].height + boxesCordsY[b1].y > boxesCordsY[b2].y
        ) {
          const minX =
            boxesCordsY[b1].x < boxesCordsY[b2].x
              ? boxesCordsY[b1].x
              : boxesCordsY[b2].x;
          const minY =
            boxesCordsY[b1].y < boxesCordsY[b2].y
              ? boxesCordsY[b1].y
              : boxesCordsY[b2].y;
          const maxX =
            boxesCordsY[b1].x + boxesCordsY[b1].width >
            boxesCordsY[b2].x + boxesCordsY[b2].width
              ? boxesCordsY[b1].x + boxesCordsY[b1].width
              : boxesCordsY[b2].x + boxesCordsY[b2].width;
          console.log(maxX);
          const maxY =
            boxesCordsY[b1].y + boxesCordsY[b1].height >
            boxesCordsY[b2].y + boxesCordsY[b2].height
              ? boxesCordsY[b1].y + boxesCordsY[b1].height
              : boxesCordsY[b2].y + boxesCordsY[b2].height;

          cleanedBoxes.push(
            createBox(cleanedBoxes, {
              x: minX,
              y: minY,
              width: maxX - minX,
              height: maxY - minY
            })
          );
          skipBoxes.push(b1 + "." + b2);
          didBreak = true;
          break;
        }
      }
      if (
        skipBoxes.indexOf(b1 + "." + b2) !== -1 ||
        skipBoxes.indexOf(b2 + "." + b1) !== -1
      ) {
        didBreak = true;
        break;
      }
    }
    if (!didBreak) {
      cleanedBoxes.push(boxesCordsY[b1]);
    }
  }
  for (var b = 0; b < cleanedBoxes.length; b++) {
    cleanedBoxes[b].id = b + 1;
  }
  searchBoxV2(cleanedBoxes, WIDTH, HEIGHT);
}

window.onload = function() {
  if (document.querySelectorAll(".fly").length === 0) {
    for (var i = 0; i < 3; i++) {
      randomFly(
        Math.floor(Math.random() * (WIDTH - 100) + 1),
        Math.floor(Math.random() * (HEIGHT - 100) + 1)
      );
    }
  }
  generateBg();
};
