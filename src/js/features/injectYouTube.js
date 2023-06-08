/*!
 * injectYouTube.js
 */
(function () {
  const injectYouTubeEls = document.querySelectorAll(".js-injectYouTube");
  const isPlaying = "is-playing";

  const injectYouTube = (trigger) => {
    trigger.addEventListener("click", () => {
      const src = trigger.getAttribute("data-youtube-src") || console.warn("No YouTube source");
      const iframe = `<iframe src="${src}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

      const container = document.querySelector(".js-youTubeVideo-container");
      container.insertAdjacentHTML("beforeend", iframe);

      container.parentElement.classList.add(isPlaying);
      trigger.setAttribute("aria-hidden", true);
    });
  };

  if (injectYouTubeEls.length) {
    injectYouTubeEls.forEach((injectYouTubeEl) => {
      injectYouTube(injectYouTubeEl);
    });
  }
})();
