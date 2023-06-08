/*!
 * modal.js
 */
(function () {
  const modalOpenEls = document.querySelectorAll(".js-modal-open");
  const isActive = "is-active";
  const isBlocked = "is-blocked";
  const isClosing = "is-closing";

  const openModal = (modalOpenEl) => {
    modalOpenEl.addEventListener("click", (ev) => {
      ev.preventDefault();
      modalOpenEl.setAttribute("aria-expanded", true);
      const modal = document.querySelector(modalOpenEl.getAttribute("href")) || document.querySelector(modalOpenEl.dataset.target);
      modal.classList.add(isActive);
      modal.setAttribute("aria-modal", true);
      document.body.classList.add(isBlocked);
      closeModal(modalOpenEl, modal);
    });
  };

  const closeModal = (modalOpenEl, modal) => {
    const modalCloseEls = modal.querySelectorAll(".js-modal-close");

    modalCloseEls.forEach((modalCloseEl) => {
      modalCloseEl.addEventListener(
        "click",
        (ev) => {
          ev.preventDefault();
          modalOpenEl.setAttribute("aria-expanded", false);
          modal.classList.remove(isActive);
          modal.removeAttribute("aria-modal");
          modalClosingAnimation(modal);
          document.body.classList.remove(isBlocked);

          // Remove YouTube iframe
          const youTubeIframe = modal.querySelector(".js-youTubeVideo-container > iframe");
          if (youTubeIframe) {
            youTubeIframe.remove();
          }
        },
        { once: true }
      );
    });

    modal.addEventListener("click", (ev) => {
      if (ev.target.id === modal.id) {
        modalOpenEl.setAttribute("aria-expanded", false);
        modal.classList.remove(isActive);
        modal.removeAttribute("aria-modal");
        modalClosingAnimation(modal);
        document.body.classList.remove(isBlocked);

        // Remove YouTube iframe
        const youTubeIframe = modal.querySelector(".js-youTubeVideo-container > iframe");
        if (youTubeIframe) {
          youTubeIframe.remove();
        }
      }
    });

    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" && modal.classList.contains(isActive)) {
        modalOpenEl.setAttribute("aria-expanded", false);
        modal.classList.remove(isActive);
        modal.removeAttribute("aria-modal");
        modalClosingAnimation(modal);
        document.body.classList.remove(isBlocked);

        // Remove YouTube iframe
        const youTubeIframe = modal.querySelector(".js-youTubeVideo-container > iframe");
        if (youTubeIframe) {
          youTubeIframe.remove();
        }
      }
    });
  };

  const modalClosingAnimation = (modal) => {
    modal.classList.add(isClosing);
    modal.addEventListener(
      "animationend",
      () => {
        modal.classList.remove(isClosing);
      },
      { once: true }
    );
  };

  if (modalOpenEls.length) {
    modalOpenEls.forEach((modalOpenEl) => {
      openModal(modalOpenEl);
    });
  }
})();
