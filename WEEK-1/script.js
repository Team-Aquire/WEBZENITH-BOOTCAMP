document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navMobile = document.getElementById('nav-mobile');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const closeIcon = document.querySelector('.close-icon');

    // Toggle menu
    menuToggle.addEventListener('click', () => {
        navMobile.classList.toggle('active');
        hamburgerIcon.style.display = navMobile.classList.contains('active') ? 'none' : 'block';
        closeIcon.style.display = navMobile.classList.contains('active') ? 'block' : 'none';
    });

    // Close menu when a link is clicked
    navMobile.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMobile.classList.remove('active');
            hamburgerIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        });
    });

    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});