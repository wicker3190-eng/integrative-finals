// Browse dropdown (shared by all pages)
(function () {
  const dd = document.getElementById('browseDropdown');
  const toggle = document.getElementById('browseToggle');
  if (!dd || !toggle) return;
  const set = (open) => {
    dd.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  };
  toggle.addEventListener('click', (e) => { e.stopPropagation(); set(!dd.classList.contains('open')); });
  document.addEventListener('click', () => set(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
})();
