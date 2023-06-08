/*!
 * menu.js
 */
(function () {
  // Toggle menu
  const menu = document.getElementById("js-menu");
  const menuButton = document.getElementById("js-menu-toggle");
  const isActive = "is-active";
  const isBlocked = "is-blocked";

  const inactiveMenu = () => {
    menu.classList.remove(isActive);
    menuButton.classList.remove(isActive);
    menuButton.setAttribute("aria-expanded", false);
    document.body.classList.remove(isBlocked);
  };

  if (menu && menuButton) {
    menuButton.addEventListener("click", () => {
      menu.classList.toggle(isActive);
      menuButton.classList.toggle(isActive);
      menuButton.setAttribute("aria-expanded", menu.classList.contains(isActive));
      document.body.classList.toggle(isBlocked, menu.classList.contains(isActive));
    });

    document.addEventListener("click", (ev) => {
      if (menu.classList.contains(isActive) && !menu.contains(ev.target) && !menuButton.contains(ev.target)) {
        inactiveMenu();
      }
    });

    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") {
        inactiveMenu();
      }
    });
  }

  // Toggle submenus
  const subMenuLinks = document.querySelectorAll(".js-subMenu-toggle");

  const inactiveSubMenu = (subMenu, subMenuLink) => {
    subMenu.classList.remove(isActive);
    subMenuLink.classList.remove(isActive);
    subMenuLink.setAttribute("aria-expanded", false);
  };

  if (subMenuLinks.length) {
    subMenuLinks.forEach((subMenuLink) => {
      subMenuLink.addEventListener("click", (ev) => {
        ev.preventDefault();

        const subMenu = subMenuLink.nextElementSibling;

        if (subMenu) {
          subMenu.classList.toggle(isActive);
          subMenuLink.classList.toggle(isActive);
          subMenuLink.setAttribute("aria-expanded", subMenu.classList.contains(isActive));
        }

        const onPressEscape = (ev) => {
          if (ev.key === "Escape") {
            if (subMenu.classList.contains(isActive)) {
              inactiveSubMenu(subMenu, subMenuLink);
            }
            document.removeEventListener("keydown", onPressEscape);
          }
        };

        const onClickOutside = (ev) => {
          if (subMenu.classList.contains(isActive) && !subMenuLink.contains(ev.target) && !subMenu.contains(ev.target)) {
            inactiveSubMenu(subMenu, subMenuLink);
            document.removeEventListener("click", onClickOutside);
          }
        };

        document.addEventListener("keydown", onPressEscape);
        document.addEventListener("click", onClickOutside);
      });
    });
  }
})();
