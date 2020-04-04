function createBg(left, top, width, height, tag, parent) {
  if (width == 0 || height == 0) {
    return;
  }
  var bg = document.createElement("div");
  bg.style.position = "absolute";
  bg.style.zIndex = "1100";
  bg.style.background = "rgba(0,0,0,0.5)";
  bg.style.top = top + "px";
  bg.style.left = left + "px";
  bg.style.width = Math.abs(width) + "px";
  bg.style.height = Math.abs(height) + "px";
  document.body.appendChild(bg);
  return bg;
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
    Math.floor(Math.random() * 200 + 100) +
    "," +
    Math.floor(Math.random() * 200 + 100) +
    "," +
    Math.floor(Math.random() * 200 + 100) +
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

function loopX(cords, line, maxWidth) {
  let x = 0;
  const cuts = [];

  for (let c in cords) {
    if (line.y >= cords[c].y && line.y < cords[c].y + cords[c].height) {
      cuts.push({
        x: x,
        width: cords[c].x - x,
        y: line.y,
        height: 1,
      });
      x = cords[c].x + cords[c].width;
    }
  }
  cuts.push({
    x: x,
    width: Math.abs(maxWidth - x),
    height: 1,
    y: line.y,
  });
  const finalCuts = [];
  for (let c in cuts) {
    if (cuts[c].width <= 0) {
      continue;
    }
    let collide = false;
    for (let cord in cords) {
      collide = collision(cuts[c], cords[cord]);
      if (collide) break;
    }
    if (!collide) {
      finalCuts.push(cuts[c]);
    }
  }
  return finalCuts;
}

function searchAndCreate(cords, maxWidth, maxHeight) {
  const baseLine = { x: 0, y: 0, width: maxWidth, height: 1 };
  let lines = [];
  cords.sort(function (a, b) {
    return a.x - b.x;
  });
  for (let y = 0; y < maxHeight; y++) {
    const line = { ...baseLine };
    line.y = y;
    const cuts = loopX(cords, line, maxWidth);
    lines = lines.concat(cuts);
  }
  const areas = [];
  for (let l = 0; l < lines.length; l++) {
    let broke = false;
    for (let a in areas) {
      if (
        lines[l].y - areas[a].lastY === 1 &&
        lines[l].x === areas[a].x &&
        lines[l].width === areas[a].width
      ) {
        areas[a].height++;
        areas[a].lastY = lines[l].y;
        broke = true;
        break;
      }
    }
    if (!broke) areas.push({ ...lines[l], lastY: lines[l].y });
  }
  return areas;
}

function generateBg(width = null, height = null) {
  if (!width) {
    width = window.innerWidth;
  }
  if (!height) {
    height = window.innerHeight;
  }
  var boxes = document.querySelectorAll(".fly");
  var cords = [];
  for (var b = 0; b < boxes.length; b++) {
    cords.push(boxes[b].getBoundingClientRect());
  }
  cords.sort(function (a, b) {
    return a.y - b.y;
  });
  const result = searchAndCreate(cords, width, height);
  for (let r in result) {
    createBg(result[r].x, result[r].y, result[r].width, result[r].height);
  }
}

window.onload = function () {
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (document.querySelectorAll(".fly").length === 0) {
    for (var i = 0; i < 200; i++) {
      randomFly(
        Math.floor(Math.random() * (width - 100) + 1),
        Math.floor(Math.random() * (height - 100) + 1)
      );
    }
  }
  generateBg(width, height);
};
