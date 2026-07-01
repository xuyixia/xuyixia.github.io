// 主题JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
  // 移动端菜单切换
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('nav ul');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }
});