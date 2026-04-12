export type AppTheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme';

export const getInitialTheme = (): AppTheme => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : 'light';
};

export const applyTheme = (theme: AppTheme): void => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  const html = document.documentElement;

  if (theme === 'dark') {
    html.classList.add('dark');
    document.body.style.backgroundColor = '#0F172A';
    document.body.style.color = '#cbd5e1';
    return;
  }

  html.classList.remove('dark');
  document.body.style.backgroundColor = '#ffffff';
  document.body.style.color = '#0f172a';
};
