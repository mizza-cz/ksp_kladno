/*!
 * main.js
 */
document.addEventListener("DOMContentLoaded", () => {
  // Smooth scrolling to target
  const scrollToLinks = document.querySelectorAll(".js-scrollTo");

  if (scrollToLinks.length) {
    scrollToLinks.forEach((el) => {
      el.addEventListener("click", (ev) => {
        ev.preventDefault();

        const target = document.querySelector(el.getAttribute("href"));
        target.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  // Set current year to Footer text
  const currentYearEl = document.getElementById("js-setCurrentYear");
  if (currentYearEl) {
    const date = new Date();
    const currentYear = date.getFullYear();
    currentYearEl.innerText = currentYear;
  }

  // Baguette Box (photo gallery) init
  const baguetteBoxEl = document.querySelector(".js-photogallery");
  if (baguetteBoxEl) {
    baguetteBox.run(".js-photogallery");
  }

  // Table overflow wrappers
  const tables = document.querySelectorAll("table");
  if (tables.length) {
    tables.forEach((table) => {
      const wrapper = document.createElement("div");
      wrapper.style.overflowX = "auto";
      table.after(wrapper);
      wrapper.appendChild(table);
    });
  }

  // Swiper (carousel) init
  const carouselIntro = document.getElementById("js-carousel--intro");

  if (carouselIntro) {
    const swiperIntro = new Swiper("#js-carousel--intro", {
      loop: false,
      autoplay: {
        delay: 5000
      },
      centeredSlides: false,
      slidesPerView: 1,
      spaceBetween: 0
    });
  }
});

window.addEventListener("load", () => {
  // Remove Preload class
  document.documentElement.classList.remove("Preload");
});
