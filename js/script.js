(function () {
  var rm = matchMedia("(prefers-reduced-motion:reduce)").matches;
  document.querySelectorAll("[data-s]").forEach(function (e, n) {
    var s = e.dataset.s,
      g = e.dataset.g;
    s.split("").forEach(function (ch, i) {
      var x = document.createElement("span");
      x.className = "c";
      x.style.setProperty("--i", i + n * 6);
      if (g) {
        x.style.setProperty("--i", i);
        x.style.setProperty("--n", s.length);
        x.style.animationDelay = (i + 6) * 60 + 200 + "ms";
      }
      x.textContent = ch;
      x.setAttribute("aria-hidden", "true");
      e.appendChild(x);
    });
  });

  var w = [
    "IA générative",
    "Vision par ordinateur",
    "NLP",
    "LLM",
    "Machine Learning",
    "FastAPI",
    "PyTorch",
    "OCR",
    "YOLO",
    "Mathématiques appliquées",
  ];
  document.getElementById("m").innerHTML = w
    .concat(w)
    .map(function (x) {
      return "<span>" + x + "</span>";
    })
    .join("");
  var roles = [
      "l’IA générative",
      "le NLP et les LLM",
      "la vision par ordinateur",
      "les mathématiques appliquées",
    ],
    t = document.getElementById("t"),
    ri = 0,
    ci = 0,
    del = false;
  function type() {
    var r = roles[ri];
    if (rm) {
      t.textContent = r;
      return;
    }
    ci += del ? -1 : 1;
    t.textContent = r.slice(0, ci);
    if (!del && ci === r.length) {
      del = true;
      return setTimeout(type, 1500);
    }
    if (del && ci === 0) {
      del = false;
      ri = (ri + 1) % roles.length;
    }
    setTimeout(type, del ? 35 : 70);
  }

  type();
  var io = new IntersectionObserver(
    function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("on");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  document.querySelectorAll(".rv").forEach(function (e) {
    io.observe(e);
  });

  var gl = document.querySelector(".glow");
  addEventListener(
    "pointermove",
    function (e) {
      gl.style.setProperty("--x", e.clientX + "px");
      gl.style.setProperty("--y", e.clientY + "px");
    },
    { passive: true },
  );
  document.querySelectorAll(".pc").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var b = c.getBoundingClientRect(),
        x = (e.clientX - b.left) / b.width,
        y = (e.clientY - b.top) / b.height;
      c.style.setProperty("--mx", x * 100 + "%");
      c.style.setProperty("--my", y * 100 + "%");
      if (e.pointerType === "mouse" && !rm) {
        c.style.setProperty("--ry", (x - 0.5) * 8 + "deg");
        c.style.setProperty("--rx", (0.5 - y) * 8 + "deg");
      }
    });
    c.addEventListener("pointerleave", function () {
      c.style.setProperty("--rx", "0deg");
      c.style.setProperty("--ry", "0deg");
    });
  });

  var st = document.getElementById("strip");
  function go(d) {
    st.scrollBy({
      left: d * (st.querySelector(".pc").offsetWidth + 20),
      behavior: rm ? "auto" : "smooth",
    });
  }

  document.getElementById("pv").onclick = function () {
    go(-1);
  };

  document.getElementById("nx").onclick = function () {
    go(1);
  };

  var cv = document.getElementById("c"),
    cx = cv.getContext("2d"),
    W,
    H,
    P = [],
    mouse = { x: -999, y: -999 },
    D = Math.min(devicePixelRatio || 1, 2),
    cs = getComputedStyle(document.documentElement);
  function size() {
    var b = cv.getBoundingClientRect();
    W = b.width;
    H = b.height;
    cv.width = W * D;
    cv.height = H * D;
    cx.setTransform(D, 0, 0, D, 0, 0);
    var n = Math.round(Math.min(90, (W * H) / 14000));
    P = [];
    for (var i = 0; i < n; i++)
      P.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.8,
        k: Math.random() < 0.22,
      });
  }

  function frame() {
    cx.clearRect(0, 0, W, H);
    var L = cs.getPropertyValue("--lav").trim() || "#8b7fd6",
      C = cs.getPropertyValue("--coral").trim() || "#e8a798";
    cx.lineWidth = 0.8;
    for (var i = 0; i < P.length; i++) {
      var p = P[i];
      if (!rm) {
        var dx = mouse.x - p.x,
          dy = mouse.y - p.y,
          d = Math.hypot(dx, dy);
        if (d < 180) {
          p.vx += (dx / d) * 0.012;
          p.vy += (dy / d) * 0.012;
        }
        p.vx *= 0.995;
        p.vy *= 0.995;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      cx.fillStyle = p.k ? C : L;
      cx.strokeStyle = L;
      cx.globalAlpha = 0.85;
      cx.beginPath();
      cx.arc(p.x, p.y, p.r, 0, 6.283);
      cx.fill();
      for (var j = i + 1; j < P.length; j++) {
        var q = P[j],
          l = Math.hypot(p.x - q.x, p.y - q.y);
        if (l < 130) {
          cx.globalAlpha = (1 - l / 130) * 0.45;
          cx.beginPath();
          cx.moveTo(p.x, p.y);
          cx.lineTo(q.x, q.y);
          cx.stroke();
        }
      }
      var md = Math.hypot(mouse.x - p.x, mouse.y - p.y);
      if (md < 170) {
        cx.strokeStyle = C;
        cx.globalAlpha = (1 - md / 170) * 0.8;
        cx.lineWidth = 1;
        cx.beginPath();
        cx.moveTo(p.x, p.y);
        cx.lineTo(mouse.x, mouse.y);
        cx.stroke();
        cx.lineWidth = 0.8;
      }
    }
    if (!rm) requestAnimationFrame(frame);
  }

  var hr = cv.parentNode;
  hr.addEventListener("pointermove", function (e) {
    var b = cv.getBoundingClientRect();
    mouse.x = e.clientX - b.left;
    mouse.y = e.clientY - b.top;
  });

  hr.addEventListener("pointerleave", function () {
    mouse.x = mouse.y = -999;
  });

  addEventListener("resize", function () {
    size();
    if (rm) frame();
  });

  size();
  frame();
})();
