// Mobile navigation: full-screen menu + slim bar that slides in when scrolling up
(function () {
  var nav = document.querySelector('nav');
  var burger = nav.querySelector('.burger');
  var mobile = window.matchMedia('(max-width: 1024px)');

  function isOpen() { return nav.classList.contains('open'); }

  function setOpen(open) {
    nav.classList.toggle('open', open);
    document.documentElement.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  }

  burger.addEventListener('click', function () {
    setOpen(!isOpen());
  });

  nav.querySelectorAll('ul a').forEach(function (link) {
    link.addEventListener('click', function () { setOpen(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') {
      setOpen(false);
      burger.focus();
      return;
    }
    // Keep keyboard focus inside the open menu
    if (e.key === 'Tab') {
      var items = Array.prototype.slice.call(nav.querySelectorAll('a, button'));
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Sticky bar (phones and tablets): as soon as the page scrolls, the nav stays
  // at the top and shrinks step by step into a slim bar (and grows back on the
  // way up), following the scroll. A spacer keeps the page from jumping while
  // the nav is out of the flow.
  var spacer = document.createElement('div');
  spacer.setAttribute('aria-hidden', 'true');
  var bottom = 0;
  var lastY = window.scrollY;
  var ticking = false;

  function measure() {
    bottom = nav.getBoundingClientRect().bottom + window.scrollY;
  }

  function fix(p) {
    spacer.style.height = nav.offsetHeight + 'px';
    nav.parentNode.insertBefore(spacer, nav);
    // Appear in place, without the slide-in animation
    nav.style.transition = 'none';
    nav.classList.add('is-fixed', 'is-shown');
    // Jump links land below the slim bar (used by scroll-padding-top in the CSS)
    nav.style.setProperty('--p', '0');
    document.documentElement.style.setProperty('--bar-h', nav.offsetHeight + 'px');
    nav.style.setProperty('--p', p.toFixed(3));
    void nav.offsetHeight;
    nav.style.transition = '';
  }

  function unfix() {
    nav.classList.remove('is-fixed', 'is-shown');
    nav.style.removeProperty('--p');
    if (spacer.parentNode) spacer.parentNode.removeChild(spacer);
  }

  function update() {
    ticking = false;
    var y = window.scrollY;
    // How far the header has shrunk: 1 = big header (at the top),
    // 0 = slim bar (after scrolling the height of the header)
    // (measured from the very top of the page, where bar and big header are identical)
    var p = Math.min(1, Math.max(0, (bottom - y) / bottom));
    if (!mobile.matches) {
      unfix();
    } else if (y <= 0) {
      if (!isOpen()) unfix();   // at the top: the normal big header (looks identical)
    } else if (!nav.classList.contains('is-fixed')) {
      fix(p);                   // starts scrolling: stays on top and begins to shrink
    } else {
      nav.style.setProperty('--p', p.toFixed(3));
    }
    lastY = y;
  }

  measure();
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener('resize', function () {
    if (!nav.classList.contains('is-fixed')) measure();
    if (!mobile.matches && isOpen()) setOpen(false);
    update();
  });
})();

// "Back to top" bowl. Desktop/tablet: while the hero scrolls away, the Mohinga
// bowl glides from the hero into the bottom right corner, shrinks and flips
// into the top view halfway. Phones and legal pages (no bowl in the hero) and reduced
// motion: the top view fades in. Styles: "Back to top" bowl in styles.css.
(function () {
  var art = document.querySelector('.hero-art');
  var hero = document.querySelector('.hero');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Relative to this script, so it also works from pages in subfolders
  var base = new URL('../assets/images/drawings/', document.currentScript.src).href;

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'bowl-top';
  btn.setAttribute('aria-label', 'Zurück nach oben');
  // Up arrow above the bowl: a light outline drawn under the dark arrow
  var arrow = 'M12 19V5M6 11l6-6 6 6';
  // .bowl-top-art: hover wobble; .bowl-top-scale: shrinks during the flight
  btn.innerHTML =
    '<span class="bowl-top-art"><span class="bowl-top-scale">' +
    '<img class="side" src="' + base + 'mohinga.svg" alt="">' +
    '<img class="top" src="' + base + 'mohinga-top.svg" alt="">' +
    '</span></span>' +
    '<svg class="bowl-top-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path class="halo" d="' + arrow + '"/><path class="line" d="' + arrow + '"/>' +
    '</svg>';
  document.body.appendChild(btn);

  var CORNER = 84;   // size in the corner (px)
  var MARGIN = 20;   // distance from the screen edges (px)
  var scaler = btn.querySelector('.bowl-top-scale');
  var mode, start, range;
  var lastT = null;  // flight progress at the last update (for the scroll direction)
  var ticking = false;

  function clamp(v) { return Math.min(1, Math.max(0, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function setActive(on) {
    btn.classList.toggle('is-active', on);
    // Not reachable by keyboard / screen readers while it's only decoration
    btn.tabIndex = on ? 0 : -1;
    if (on) btn.removeAttribute('aria-hidden');
    else btn.setAttribute('aria-hidden', 'true');
  }

  function measure() {
    var visible = art && getComputedStyle(art).display !== 'none';
    mode = visible && !reduce.matches ? 'fly' : 'fade';
    document.documentElement.classList.toggle('bowl-fly', mode === 'fly');
    btn.classList.toggle('is-fade', mode === 'fade');
    if (mode === 'fly') {
      var r = art.getBoundingClientRect();
      start = { x: r.left, y: r.top + window.scrollY, w: r.width };
      // The flight is done when most of the hero has scrolled away
      range = Math.max(200, hero.offsetHeight * .8);
      // The button keeps its corner size; only the drawing inside is drawn at
      // the hero size and shrunk with a transform (no redraw of the crayon
      // filter on every frame)
      btn.style.width = btn.style.height = CORNER + 'px';
      scaler.style.width = scaler.style.height = start.w + 'px';
    } else {
      btn.style.width = btn.style.height = btn.style.transform = btn.style.position = '';
      scaler.style.width = scaler.style.height = scaler.style.transform = '';
      btn.classList.add('is-top');
    }
  }

  function update() {
    ticking = false;
    var y = window.scrollY;
    if (mode === 'fade') return setActive(y > 400);

    var t = clamp(y / range);
    var e = ease(t);
    var vw = document.documentElement.clientWidth;
    var vh = window.innerHeight;
    var x = lerp(start.x, vw - MARGIN - CORNER, e);
    var cornerY = vh - MARGIN - CORNER;
    var top;
    if (t < 1) {
      // In flight: part of the page, so it scrolls along natively with the
      // hero (no lag at the start); the script only adds the way to the corner
      btn.style.position = 'absolute';
      top = lerp(start.y, y + cornerY, e);
    } else {
      // Arrived: pinned to the corner of the screen
      btn.style.position = 'fixed';
      top = cornerY;
    }
    btn.style.transform = 'translate(' + x.toFixed(1) + 'px,' + top.toFixed(1) + 'px)';
    scaler.style.transform = 'scale(' + (lerp(start.w, CORNER, e) / start.w).toFixed(4) + ')';
    // Flip into the top view halfway on the way down; on the way up, flip
    // back earlier, so the flip is done before the bowl is back in the hero.
    // The flip itself is a short timed animation (CSS), so it never gets
    // stuck half done when scrolling stops.
    var down = lastT === null || t >= lastT;
    if (down && t > .5) btn.classList.add('is-top');
    else if (!down && t < .6) btn.classList.remove('is-top');
    else if (t < .5) btn.classList.remove('is-top');   // e.g. after a resize
    lastT = t;
    setActive(t > .95);
  }

  function refresh() { measure(); update(); }

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce.matches ? 'auto' : 'smooth' });
    // Keyboard users continue at the top of the page
    var logo = document.querySelector('.logo');
    if (logo) logo.focus({ preventScroll: true });
  });

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener('resize', refresh);
  reduce.addEventListener('change', refresh);
  // The drawing's size is only known once it has loaded
  if (art && !art.complete) art.addEventListener('load', refresh);
  refresh();
})();

// "Neu bei uns" slider controls (phones only; the slider itself is CSS scroll
// snap): ‹ arrow, one dot per dish (the active dot is stretched), › arrow.
// Auto loop: moves on every few seconds and wraps around. It pauses while the
// slider is touched, hovered or focused, or off screen, and stops for good as
// soon as someone uses the slider themselves. No auto loop with reduced motion.
(function () {
  var list = document.querySelector('.try-list');
  if (!list) return;
  var items = Array.prototype.slice.call(list.children);
  var phone = window.matchMedia('(max-width: 760px)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var DELAY = 5000;  // ms per dish
  var active = 0;
  var ticking = false;

  var controls = document.createElement('div');
  controls.className = 'try-controls';

  function arrow(cls, label, step) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'try-arrow ' + cls;
    b.setAttribute('aria-label', label);
    b.addEventListener('click', function () {
      stopAuto();
      goTo(active + step);
    });
    return b;
  }

  var dots = document.createElement('div');
  dots.className = 'try-dots';
  var buttons = items.map(function (item, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Gericht ' + (i + 1) + ' von ' + items.length + ': ' + item.querySelector('h3').textContent);
    b.addEventListener('click', function () {
      stopAuto();
      goTo(i);
    });
    dots.appendChild(b);
    return b;
  });

  controls.appendChild(arrow('prev', 'Vorheriges Gericht', -1));
  controls.appendChild(dots);
  controls.appendChild(arrow('next', 'Nächstes Gericht', 1));
  list.parentNode.insertBefore(controls, list.nextSibling);

  // Slide to a dish (wrapping around at both ends). Only the row scrolls,
  // never the page.
  function goTo(i) {
    var item = items[(i + items.length) % items.length];
    var pad = parseFloat(getComputedStyle(list).scrollPaddingLeft) || 0;
    var left = list.scrollLeft + item.getBoundingClientRect().left - list.getBoundingClientRect().left - pad;
    list.scrollTo({ left: left, behavior: reduce.matches ? 'auto' : 'smooth' });
  }

  // Active = the card closest to the start of the row (the last one once the
  // row can't scroll any further)
  function update() {
    ticking = false;
    if (list.scrollLeft >= list.scrollWidth - list.clientWidth - 1) {
      active = items.length - 1;
    } else {
      var start = list.getBoundingClientRect().left + (parseFloat(getComputedStyle(list).scrollPaddingLeft) || 0);
      var best = Infinity;
      items.forEach(function (item, i) {
        var d = Math.abs(item.getBoundingClientRect().left - start);
        if (d < best) { best = d; active = i; }
      });
    }
    buttons.forEach(function (b, i) {
      if (i === active) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
  }

  // Auto loop
  var auto = true;      // false for good once someone uses the slider
  var timer = null;
  var onScreen = false;
  var hovered = false;
  var focused = false;

  function sync() {
    var run = auto && phone.matches && !reduce.matches && onScreen && !hovered && !focused && !document.hidden;
    if (run && !timer) timer = setInterval(function () { goTo(active + 1); }, DELAY);
    if (!run && timer) { clearInterval(timer); timer = null; }
  }

  function stopAuto() {
    auto = false;
    sync();
  }

  // Swiping, dragging, scrolling with the mouse wheel or arrow keys
  ['pointerdown', 'wheel', 'keydown'].forEach(function (type) {
    list.addEventListener(type, stopAuto, { passive: true });
  });
  [list, controls].forEach(function (el) {
    el.addEventListener('mouseenter', function () { hovered = true; sync(); });
    el.addEventListener('mouseleave', function () { hovered = false; sync(); });
    el.addEventListener('focusin', function () { focused = true; sync(); });
    el.addEventListener('focusout', function () { focused = false; sync(); });
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      sync();
    }, { threshold: .6 }).observe(list);
  }
  document.addEventListener('visibilitychange', sync);
  phone.addEventListener('change', sync);
  reduce.addEventListener('change', sync);

  list.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// Menu: category tabs. "Hauptgerichte" shows all main courses; the arrow next
// to it opens a filter by type.
(function () {
  var menu = document.querySelector('.menu');
  if (!menu) return;
  var menuNav = menu.querySelector('.menu-nav');
  var tablist = menu.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
  var pickerTab = document.getElementById('tab-hauptgerichte');
  var toggle = tablist.querySelector('.picker-toggle');
  var pickerList = menu.querySelector('.picker-list');
  var options = Array.prototype.slice.call(pickerList.querySelectorAll('button'));
  var groups = menu.querySelectorAll('.menu-group');

  function selectTab(tab) {
    tabs.forEach(function (t) {
      var active = t === tab;
      t.setAttribute('aria-selected', active);
      t.tabIndex = active ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !active;
    });
    // The filter arrow is only reachable by keyboard while Hauptgerichte is open
    toggle.tabIndex = tab === pickerTab ? 0 : -1;
  }

  // Show one main course type, or all of them ("alle")
  function choose(option) {
    var value = option.dataset.value;
    options.forEach(function (o) { o.setAttribute('aria-pressed', o === option); });
    groups.forEach(function (g) { g.hidden = value !== 'alle' && g.dataset.group !== value; });
  }

  function setPickerOpen(open) {
    pickerList.hidden = !open;
    toggle.setAttribute('aria-expanded', open);
    if (!open) return;
    // Line the list up under the pill, but keep it inside the menu area
    var left = pickerTab.offsetLeft - tablist.scrollLeft;
    var maxLeft = menuNav.clientWidth - pickerList.offsetWidth;
    pickerList.style.left = Math.max(0, Math.min(left, maxLeft)) + 'px';
  }

  function openPicker() {
    setPickerOpen(true);
    pickerList.querySelector('[aria-pressed="true"]').focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      setPickerOpen(false);
      selectTab(tab);
      if (tab === pickerTab) choose(options[0]);
    });
    // Arrow keys move between tabs (standard tab keyboard pattern)
    tab.addEventListener('keydown', function (e) {
      if (tab === pickerTab && e.key === 'ArrowDown') {
        e.preventDefault();
        return openPicker();
      }
      var next;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (!next) return;
      e.preventDefault();
      setPickerOpen(false);
      next.focus();
      selectTab(next);
    });
  });

  toggle.addEventListener('click', function () {
    if (pickerList.hidden) openPicker();
    else setPickerOpen(false);
  });

  options.forEach(function (o, i) {
    o.addEventListener('click', function () {
      choose(o);
      selectTab(pickerTab);
      setPickerOpen(false);
      toggle.focus();
    });
    o.addEventListener('keydown', function (e) {
      var next;
      if (e.key === 'ArrowDown') next = options[(i + 1) % options.length];
      else if (e.key === 'ArrowUp') next = options[(i - 1 + options.length) % options.length];
      if (!next) return;
      e.preventDefault();
      next.focus();
    });
  });

  menuNav.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !pickerList.hidden) {
      setPickerOpen(false);
      toggle.focus();
    }
  });

  // Close when clicking or tabbing outside, scrolling the tab row or resizing
  document.addEventListener('click', function (e) {
    if (!menuNav.contains(e.target)) setPickerOpen(false);
  });
  menuNav.addEventListener('focusout', function (e) {
    if (e.relatedTarget && !menuNav.contains(e.relatedTarget)) setPickerOpen(false);
  });
  tablist.addEventListener('scroll', function () { setPickerOpen(false); });
  window.addEventListener('resize', function () {
    setPickerOpen(false);
    updateCanDrag();
  });

  // Drag the tab row sideways with the mouse (touch already swipes natively).
  // Only when the row is wider than the screen.
  var drag = null;
  var justDragged = false;

  function updateCanDrag() {
    tablist.classList.toggle('can-drag', tablist.scrollWidth > tablist.clientWidth);
  }

  tablist.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !tablist.classList.contains('can-drag')) return;
    drag = { x: e.clientX, left: tablist.scrollLeft, moved: false };
  });
  window.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) < 5) return;
    drag.moved = true;
    tablist.classList.add('is-dragging');
    tablist.scrollLeft = drag.left - dx;
  });
  window.addEventListener('pointerup', function () {
    if (!drag) return;
    if (drag.moved) {
      // Don't treat the end of a drag as a click on a tab
      justDragged = true;
      setTimeout(function () { justDragged = false; }, 0);
    }
    drag = null;
    tablist.classList.remove('is-dragging');
  });
  tablist.addEventListener('click', function (e) {
    if (!justDragged) return;
    e.stopPropagation();
    e.preventDefault();
  }, true);

  // Mouse wheel over the tab row only scrolls the row sideways, never the page
  // (also at either end). If all tabs fit, the page scrolls as usual.
  tablist.addEventListener('wheel', function (e) {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // trackpad sideways swipe: native
    if (tablist.scrollWidth <= tablist.clientWidth) return;
    e.preventDefault();
    tablist.scrollLeft += e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
  }, { passive: false });

  // Links elsewhere on the page that open a tab (e.g. "Alle Empfehlungen
  // ansehen" in "Neu bei uns"); the jump to #karte itself happens as usual
  document.querySelectorAll('a[data-tab]').forEach(function (link) {
    link.addEventListener('click', function () {
      var tab = document.getElementById(link.dataset.tab);
      if (!tab) return;
      setPickerOpen(false);
      selectTab(tab);
    });
  });

  // Switch from "everything in one list" to tabs
  tablist.hidden = false;
  updateCanDrag();
  menu.classList.add('is-tabbed');
  selectTab(tabs[0]);
  choose(options[0]);
})();
