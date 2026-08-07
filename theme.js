const html = document.documentElement;
const themeToggleBtn = document.getElementById('themeToggleBtn');

const saveTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', saveTheme);

function toggleTheme() {
  let currentTheme = html.getAttribute('data-theme');
  let newTheme = currentTheme === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  renderThemeIcon();
}

function renderThemeIcon() {
  const currentTheme = html.getAttribute('data-theme');
  if (currentTheme === 'light') {
    themeToggleBtn.innerHTML = `<svg class="icon-theme"><use href="fonts/sprite.svg#light-theme"></use></svg>`;
  } else {
    themeToggleBtn.innerHTML = `<svg class="icon-theme"><use href="fonts/sprite.svg#dark-theme"></use></svg>`;
  }
}

themeToggleBtn.addEventListener('click', toggleTheme);

export {toggleTheme, renderThemeIcon};
