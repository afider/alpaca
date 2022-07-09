window.addEventListener('DOMContentLoaded', function() {
    document.getElementById('svg-icons').innerHTML = SVG_SPRITE;

    toggleMobileMenu();

    function toggleMobileMenu() {
        console.log('xxx');
        const buttons = document.querySelectorAll('[data-toggle-menu]');
        const page = document.getElementsByTagName('body')[0];
        const openState = 'is-menu-open';

        document.addEventListener('keyup', (event) => {
            if (event.code.toUpperCase() === 'ESCAPE') {
                page.classList.remove(openState);
            }
        });

        buttons.forEach((el) => {
            el.addEventListener('click', () => {
                page.classList.toggle(openState);
            });
        });
    }
})