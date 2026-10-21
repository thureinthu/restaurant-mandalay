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

  // Slim bar: once the nav has scrolled out of view, it becomes a fixed bar
  // that shows when scrolling up and hides when scrolling down. A spacer keeps
  // the page from jumping while the nav is out of the flow.
  var spacer = document.createElement('div');
  spacer.setAttribute('aria-hidden', 'true');
  var top = 0;
  var bottom = 0;
  var lastY = window.scrollY;
  var ticking = false;

  function measure() {
    var rect = nav.getBoundingClientRect();
    top = rect.top + window.scrollY;
    bottom = rect.bottom + window.scrollY;
  }

  function fix() {
    spacer.style.height = nav.offsetHeight + 'px';
    nav.parentNode.insertBefore(spacer, nav);
    // Start hidden without animating, so the bar doesn't flash while sliding away
    nav.style.transition = 'none';
    nav.classList.add('is-fixed');
    void nav.offsetHeight;
    nav.style.transition = '';
  }

  function unfix() {
    nav.classList.remove('is-fixed', 'is-shown');
    if (spacer.parentNode) spacer.parentNode.removeChild(spacer);
  }

  function update() {
    ticking = false;
    var y = window.scrollY;
    if (!mobile.matches) {
      unfix();
    } else if (!nav.classList.contains('is-fixed')) {
      if (y > bottom) fix();
    } else {
      var shown = nav.classList.contains('is-shown');
      if (y <= (shown ? top : bottom)) {
        unfix();
      } else if (y < lastY - 6) {
        nav.classList.add('is-shown');
      } else if (y > lastY + 6 && !isOpen()) {
        nav.classList.remove('is-shown');
      }
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

  // Switch from "everything in one list" to tabs
  tablist.hidden = false;
  updateCanDrag();
  menu.classList.add('is-tabbed');
  selectTab(tabs[0]);
  choose(options[0]);
})();
