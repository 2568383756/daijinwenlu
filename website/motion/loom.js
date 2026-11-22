/* Daijin Loom — a local Canvas illustration driven by the actual design canvas. */
(function (global) {
  'use strict';
  var W = 600, H = 760, backdrop = null, paletteCache = new WeakMap();
  var TAU = Math.PI * 2;
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function round(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2); ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
  }
  function ellipse(ctx, x, y, rx, ry, color) {
    ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill();
  }
  function wood(ctx, x, y, w, h, vertical) {
    ctx.save(); ctx.shadowColor = 'rgba(37,25,13,.2)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 4;
    var g = ctx.createLinearGradient(x, y, vertical ? x + w : x, vertical ? y : y + h);
    g.addColorStop(0, '#a8672e'); g.addColorStop(.11, '#d29c54'); g.addColorStop(.28, '#f0c685');
    g.addColorStop(.7, '#dba85e'); g.addColorStop(.89, '#c48a43'); g.addColorStop(1, '#98602d');
    ctx.fillStyle = g; round(ctx, x, y, w, h, 7); ctx.fill(); ctx.shadowColor = 'transparent'; ctx.clip();
    ctx.strokeStyle = 'rgba(111,65,25,.17)'; ctx.lineWidth = 1.1;
    for (var i = 0; i < 5; i++) {
      var d = .14 + i * .17; ctx.beginPath();
      if (vertical) { var xx = x + w * d; ctx.moveTo(xx, y - 10); ctx.bezierCurveTo(xx + 5, y + h * .3, xx - 6, y + h * .6, xx + 2, y + h + 10); }
      else { var yy = y + h * d; ctx.moveTo(x - 10, yy); ctx.bezierCurveTo(x + w * .3, yy + 4, x + w * .68, yy - 4, x + w + 10, yy + 1); }
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255,235,183,.65)'; ctx.lineWidth = 1.3;
    ctx.beginPath(); if (vertical) {ctx.moveTo(x + 4, y + 8); ctx.lineTo(x + 4, y + h - 8);} else {ctx.moveTo(x + 8, y + 3); ctx.lineTo(x + w - 8, y + 3);} ctx.stroke();
    ctx.restore();
  }
  function coil(ctx, x, y) {
    ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(81,53,28,.38)'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(x + 3, y - 17); ctx.bezierCurveTo(x - 5, y - 18, x - 6, y + 18, x + 3, y + 18); ctx.stroke();
    ctx.strokeStyle = '#e6c689'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(x + 2, y - 18); ctx.bezierCurveTo(x - 5, y - 18, x - 5, y + 17, x + 3, y + 17); ctx.stroke();
    ctx.strokeStyle = '#fff0c1'; ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.moveTo(x + 1, y - 17); ctx.bezierCurveTo(x - 4, y - 16, x - 4, y + 10, x, y + 14); ctx.stroke();
  }
  function staticLoom() {
    if (backdrop) return backdrop;
    backdrop = document.createElement('canvas'); backdrop.width = W; backdrop.height = H;
    var ctx = backdrop.getContext('2d');
    var s = ctx.createRadialGradient(300, 710, 20, 300, 710, 240); s.addColorStop(0, 'rgba(27,34,22,.16)'); s.addColorStop(1, 'rgba(27,34,22,0)');
    ctx.save(); ctx.translate(0, 610); ctx.scale(1, .15); ctx.fillStyle = s; ctx.fillRect(0, -500, 600, 1300); ctx.restore();
    wood(ctx, 62, 39, 39, 617, true); wood(ctx, 499, 39, 39, 617, true);
    wood(ctx, 48, 101, 504, 21, false); wood(ctx, 45, 626, 510, 23, false);
    wood(ctx, 42, 71, 516, 33, false); wood(ctx, 42, 603, 516, 34, false);
    [82, 519].forEach(function (x) {
      [113, 639].forEach(function (y) {
        ellipse(ctx, x, y, 5.5, 5.5, '#b47838'); ellipse(ctx, x - 1, y - 1, 3.7, 3.7, '#f1cc87');
        ctx.strokeStyle = '#9f6a35'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 2, y + 1); ctx.lineTo(x + 2, y - 1); ctx.stroke();
      });
    });
    return backdrop;
  }
  function palette(source) {
    var stored = paletteCache.get(source); if (stored) return stored;
    var result = ['#b89148', '#277867', '#a6614f'];
    try {
      var c = document.createElement('canvas'); c.width = c.height = 20; var cx = c.getContext('2d'); cx.drawImage(source, 0, 0, 20, 20);
      var pixels = cx.getImageData(0, 0, 20, 20).data, bins = {}, picks = [];
      for (var i = 0; i < pixels.length; i += 4) {
        var r = pixels[i], g = pixels[i + 1], b = pixels[i + 2], hi = Math.max(r, g, b), lo = Math.min(r, g, b);
        if (pixels[i + 3] < 180 || hi - lo < 35 || hi < 75 || lo > 215) continue;
        var key = [Math.round(r / 32), Math.round(g / 32), Math.round(b / 32)].join('-');
        if (!bins[key]) bins[key] = {n: 0, r: 0, g: 0, b: 0};
        bins[key].n++; bins[key].r += r; bins[key].g += g; bins[key].b += b;
      }
      Object.keys(bins).map(function (key) {return bins[key];}).sort(function (a, b) {return b.n - a.n;}).some(function (a) {
        var col = [Math.round(a.r / a.n), Math.round(a.g / a.n), Math.round(a.b / a.n)];
        if (picks.every(function (v) {return Math.abs(v[0] - col[0]) + Math.abs(v[1] - col[1]) + Math.abs(v[2] - col[2]) > 100;})) picks.push(col);
        return picks.length === 3;
      });
      if (picks.length) {
        result = picks.map(function (c) {return 'rgb(' + c.join(',') + ')';});
        while (result.length < 3) result.push(result.length === 1 ? '#e7d5ab' : result[0]);
      }
    } catch (_) { /* A tainted source may still be drawn; sampling is optional. */ }
    paletteCache.set(source, result); return result;
  }
  function spool(ctx, x, y, color) {
    ellipse(ctx, x + 4, y + 35, 40, 7, 'rgba(31,31,17,.13)');
    ctx.save(); ctx.translate(x, y); wood(ctx, -7, -38, 14, 65, true);
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(-14, -27); ctx.quadraticCurveTo(-18, -4, -34, 27); ctx.quadraticCurveTo(0, 40, 34, 27); ctx.quadraticCurveTo(18, -4, 14, -27); ctx.closePath(); ctx.fill();
    var g = ctx.createLinearGradient(-35, 0, 35, 0); g.addColorStop(0, 'rgba(0,0,0,.25)'); g.addColorStop(.35, 'rgba(255,255,255,.24)'); g.addColorStop(.65, 'rgba(255,255,255,.03)'); g.addColorStop(1, 'rgba(0,0,0,.28)'); ctx.fillStyle = g; ctx.fill();
    for (var i = 0; i < 14; i++) {
      var yy = -26 + i * 4, wide = 14 + i * 1.45; ctx.lineWidth = 1.9;
      ctx.strokeStyle = 'rgba(255,250,219,.32)'; ctx.beginPath(); ctx.moveTo(-wide, yy); ctx.quadraticCurveTo(-1, yy + 8, wide, yy); ctx.stroke();
      ctx.lineWidth = .8; ctx.strokeStyle = 'rgba(20,35,18,.22)'; ctx.beginPath(); ctx.moveTo(-wide, yy + 1.8); ctx.quadraticCurveTo(1, yy + 9.8, wide, yy + 1.8); ctx.stroke();
    }
    ellipse(ctx, 0, -27, 14, 4, color); ellipse(ctx, 0, -28, 6, 2.7, '#69482b'); ctx.restore();
  }
  function shuttle(ctx, x, y, color, tilt) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); ctx.shadowColor = 'rgba(39,28,14,.25)'; ctx.shadowBlur = 5; ctx.shadowOffsetY = 4;
    var g = ctx.createLinearGradient(0, -17, 0, 17); g.addColorStop(0, '#f7d294'); g.addColorStop(.45, '#e8b66c'); g.addColorStop(1, '#a56c30'); ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(-67, 0); ctx.bezierCurveTo(-31, -26, 40, -27, 68, 0); ctx.bezierCurveTo(38, 23, -33, 23, -67, 0); ctx.fill();
    ctx.shadowColor = 'transparent'; ctx.strokeStyle = '#f7dca0'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#80522c'; round(ctx, -36, -9, 75, 19, 9); ctx.fill(); ctx.fillStyle = color; round(ctx, -33, -6, 69, 13, 6); ctx.fill();
    ctx.strokeStyle = 'rgba(255,247,213,.3)'; ctx.lineWidth = 1; for (var i = -28; i < 33; i += 4) {ctx.beginPath(); ctx.moveTo(i, -5); ctx.lineTo(i - 3, 5); ctx.stroke();}
    ctx.restore();
  }
  function paint(ctx, source, progress, timeMs) {
    if (!ctx || !source || !source.width || !source.height) return;
    var p = clamp(Number(progress) || 0, 0, 1), t = Math.max(0, Number(timeMs) || 0), colors = palette(source);
    var weave = clamp((p - .05) / .85, 0, 1), cycle = (t / 700) % 1, phase = cycle * TAU, shift = Math.sin(phase), beat = Math.pow(Math.max(0, Math.cos(phase)), 5);
    var scale = Math.min(378 / source.width, 425 / source.height), fw = source.width * scale, fh = source.height * scale;
    var fx = (W - fw) / 2, fy = 589 - fh, bottom = 589, edge = bottom - fh * weave;
    ctx.save(); ctx.setTransform(ctx.canvas.width / W, 0, 0, ctx.canvas.height / H, 0, 0); ctx.clearRect(0, 0, W, H);
    ctx.drawImage(staticLoom(), 0, 0);
    // The separate warp lines remain visible above the growing cloth.
    for (var j = 0; j < 49; j++) {
      var x = 108 + j * 8, active = x >= fx && x <= fx + fw, bend = p > .05 && p < .9 && active ? (j % 2 ? 1 : -1) * 2 * beat : 0;
      ctx.lineWidth = 2.8; ctx.strokeStyle = 'rgba(33,33,21,.15)'; ctx.beginPath(); ctx.moveTo(x + 1.2, 93); ctx.lineTo(x + 1.2, 615); ctx.stroke();
      ctx.lineWidth = 2; ctx.strokeStyle = active ? '#e8e7d9' : 'rgba(219,221,208,.72)'; ctx.beginPath(); ctx.moveTo(x, 93); ctx.quadraticCurveTo(x + bend, Math.max(145, edge - 25), x, 615); ctx.stroke();
      ctx.lineWidth = .65; ctx.strokeStyle = '#fffbed'; ctx.beginPath(); ctx.moveTo(x - .6, 96); ctx.lineTo(x - .6, 615); ctx.stroke();
    }
    if (weave > 0) {
      ctx.save(); ctx.shadowColor = 'rgba(30,29,16,.24)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 3;
      ctx.fillStyle = colors[1]; ctx.fillRect(fx, edge, fw, fh * weave); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(fx, edge, fw, fh * weave); ctx.clip(); ctx.drawImage(source, fx, fy, fw, fh);
      // Low-contrast, regular weft relief gives the source image a woven surface.
      for (var row = 0; row <= fh / 4; row++) {
        var yy = bottom - row * 4; ctx.fillStyle = 'rgba(22,26,17,.12)'; ctx.fillRect(fx, yy, fw, .8);
        ctx.fillStyle = 'rgba(255,249,221,.18)'; ctx.fillRect(fx, yy - 1.4, fw, .75);
      }
      ctx.globalAlpha = .16; ctx.strokeStyle = '#fff8df'; ctx.lineWidth = .7;
      for (var warp = fx + 3; warp < fx + fw; warp += 7) {ctx.beginPath(); ctx.moveTo(warp, fy); ctx.lineTo(warp, bottom); ctx.stroke();}
      ctx.restore();
      ctx.strokeStyle = 'rgba(255,246,205,.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(fx + 1, edge); ctx.lineTo(fx + 1, bottom); ctx.moveTo(fx + fw - 1, edge); ctx.lineTo(fx + fw - 1, bottom); ctx.stroke();
    }
    // Winding on each roller stays on top of the warp ends.
    for (var c = 0; c < 49; c++) {coil(ctx, 108 + c * 8, 87); coil(ctx, 108 + c * 8, 619);}
    // Three bobbins pick their yarn colors from the visitor's own composition.
    [190, 300, 410].forEach(function (sx, k) {
      var tx = fx + fw * (.25 + k * .25);
      ctx.lineWidth = 2.3; ctx.strokeStyle = colors[k]; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(tx, 591);
      ctx.bezierCurveTo(tx + (k - 1) * 15, 655, sx + 19, 645, sx, 680); ctx.stroke(); spool(ctx, sx, 700, colors[k]);
    });
    if (p >= .04 && p < .93) {
      var sy = clamp(edge - 19, 146, 556), sx = 300 + shift * Math.min(144, fw * .44), threadColor = colors[Math.floor(t / 1400) % colors.length];
      // The reed follows the cloth edge and gently presses each pass into place.
      var ry = clamp(edge - 1 - 11 * beat, 151, 571);
      ctx.save(); ctx.globalAlpha = .94; wood(ctx, fx - 11, ry, fw + 22, 8, false); ctx.restore();
      ctx.lineWidth = 2; ctx.strokeStyle = threadColor; ctx.beginPath(); ctx.moveTo(shift > 0 ? fx : fx + fw, sy + 2); ctx.quadraticCurveTo(300, sy + 7, sx, sy); ctx.stroke();
      shuttle(ctx, sx, sy, threadColor, shift * -.025);
    } else {
      // The shuttle settles beside the completed fabric rather than vanishing.
      shuttle(ctx, 430, 159, colors[0], -.08);
    }
    ctx.restore();
  }
  global.DaijinLoom = {paint: paint, width: W, height: H, invalidate: function (source) {if (source) paletteCache.delete(source);}};
})(window);
