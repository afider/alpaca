document.getElementById('svg-icons').innerHTML = SVG_SPRITE;

(function () {
    const buttons = document.querySelectorAll('[data-toggle-menu]');
    const page = document.getElementsByTagName('body')[0];
    const openState = 'is-menu-open';
    const openItemState = 'is-open';
    const menuItemName = 'data-menu-parent';
    const menuItems = document.querySelectorAll(`[${menuItemName}]`);

    toggleMobileMenu();
    toggleParentMenuItems();

    function toggleMobileMenu() {
        window.addEventListener('resize', debounce(function() {
            page.classList.remove(openState);

            Array.from(menuItems).map((el) => {
                el.parentElement.classList.remove(openItemState);
            });
        }));

        document.addEventListener('keyup', (event) => {
            if (event.code.toUpperCase() === 'ESCAPE') {
                page.classList.remove(openState);
            }
        });

        Array.from(buttons).map((el) => {
            el.addEventListener('click', () => {
                page.classList.toggle(openState);
            });
        });
    }

    function debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    function toggleParentMenuItems() {
        Array.from(menuItems).map((el) => {

            el.addEventListener('click', (event) => {
                const childParents = el.parentElement.querySelectorAll(`[${menuItemName}]`);

                Array.from(childParents).map((childEl) => {
                    if (childEl !== el) {
                        childEl.parentElement.classList.remove(openItemState);
                    }
                });

                el.parentElement.classList.toggle(openItemState);
            });
        });
    }
}());