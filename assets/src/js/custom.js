document.getElementById('svg-icons').innerHTML = SVG_SPRITE;

(function () {
    const buttons = document.querySelectorAll('[data-toggle-menu]');
    const page = document.getElementsByTagName('body')[0];
    const openState = 'is-menu-open';
    const scrollbarState = 'has-scrollbar';
    const openItemState = 'is-open';
    const menuItemName = 'data-menu-parent';
    const menuItems = document.querySelectorAll(`[${menuItemName}]`);

    window.addEventListener('resize', debounce(function() {
        addClassNameIfPageHasVScrollbar();
        removeMenuItemsOpenState();

        page.classList.remove(openState);
    }));

    document.addEventListener('keyup', (event) => {
        if (event.code.toUpperCase() === 'ESCAPE') {
            removeMenuItemsOpenState();
            page.classList.remove(openState);
        }
    });

    Array.from(buttons).map((el) => {
        el.addEventListener('click', () => {
            removeMenuItemsOpenState();
            page.classList.toggle(openState);
        });
    });

    toggleParentMenuItems();
    addClassNameIfPageHasVScrollbar();

    function removeMenuItemsOpenState() {
        Array.from(menuItems).map((el) => {
            el.parentElement.classList.remove(openItemState);
        });
    }

    function addClassNameIfPageHasVScrollbar() {
        if(document.body.scrollHeight > document.body.clientHeight){
            page.classList.add(scrollbarState);
        } else {
            page.classList.remove(scrollbarState);
        }
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