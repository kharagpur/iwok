const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const menuList = document.getElementById('menu-list');
const categoryNav = document.getElementById('category-nav');
const search = document.getElementById('menu-search');
const count = document.getElementById('menu-count');
const emptyMenu = document.getElementById('empty-menu');

async function loadMenu() {
  const response = await fetch('JS/menu-data.json');
  if (!response.ok) throw new Error('Menu data could not be loaded.');
  return response.json();
}

function initializeMenu({ categories: menuData }) {
  let activeCategory = 'all';

  function renderMenu() {
    const query = search.value.toLowerCase().trim();
    let total = 0;
    menuList.innerHTML = '';

    menuData.forEach(({ name: category, items: dishes }) => {
      const shown = dishes.filter(({ name, meta }) => (activeCategory === 'all' || activeCategory === slug(category)) && `${name} ${meta || ''}`.toLowerCase().includes(query));
      if (!shown.length) return;
      total += shown.length;

      const section = document.createElement('section');
      section.className = 'menu-category';
      section.id = `category-${slug(category)}`;
      section.innerHTML = `<h3>${category}</h3><div class="dish-grid">${shown.map(({ name, meta }) => `<article class="menu-item"><h4>${name}</h4>${meta ? `<p>${meta}</p>` : ''}</article>`).join('')}</div>`;
      menuList.append(section);
    });

    count.textContent = `${total} ${total === 1 ? 'dish' : 'dishes'}`;
    emptyMenu.hidden = total !== 0;
  }

  function renderCategories() {
    categoryNav.innerHTML = `<button class="active" type="button" data-category="all">All</button>${menuData.map(({ name }) => `<button type="button" data-category="${slug(name)}">${name}</button>`).join('')}`;
  }

  renderCategories();
  renderMenu();

  categoryNav.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    activeCategory = button.dataset.category;
    categoryNav.querySelectorAll('button').forEach(item => item.classList.toggle('active', item === button));
    renderMenu();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const headerHeight = document.querySelector('.site-header').getBoundingClientRect().height;
    const categoryHeight = categoryNav.getBoundingClientRect().height;
    const menuTop = menuList.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: Math.max(0, menuTop - headerHeight - categoryHeight - 16),
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
    categoryNav.scrollTo({
      left: Math.max(0, button.offsetLeft - (categoryNav.clientWidth - button.clientWidth) / 2),
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
  });

  search.addEventListener('input', renderMenu);
}

loadMenu().then(initializeMenu).catch(() => {
  categoryNav.hidden = true;
  count.textContent = '';
  menuList.innerHTML = '<p class="empty-menu">Our menu is temporarily unavailable. Please call the restaurant for current information.</p>';
});

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  toggle.querySelector('.sr-only').textContent = open ? 'Open navigation' : 'Close navigation';
  nav.classList.toggle('open', !open);
});

nav.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.querySelector('.sr-only').textContent = 'Open navigation';
  nav.classList.remove('open');
});

document.getElementById('year').textContent = new Date().getFullYear();
