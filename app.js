// app.js
document.addEventListener('DOMContentLoaded', () => {
  MyFramework.onClick('.my-button', (e) => {
    alert('Button clicked!');
  });

  MyFramework.log('App Initialized');
});
