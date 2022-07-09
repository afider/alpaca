window.addEventListener('DOMContentLoaded', function() {
    document.getElementById('svg-icons').innerHTML = SVG_SPRITE;

    toggleMobileMenu();

    function toggleMobileMenu() {
        const buttons = document.querySelectorAll('[data-toggle-menu]');
        const page = document.getElementsByTagName('body')[0];
        const openState = 'is-menu-open';
        const timeForWait = 300;

        window.addEventListener('resize', debounce(function() {
            page.classList.remove(openState);
        }, timeForWait));

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

    function debounce(func, timeout = 300){
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }
})