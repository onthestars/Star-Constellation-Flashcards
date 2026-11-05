// js/external-links.js

function setupExternalLinks() {

    const button = document.getElementById("specialThanksBtn");

    if (!button) return;

    button.addEventListener("click", () => {

        window.open(
            "https://peteworden.github.io/Soleil/chart.html",
            "_blank"
        );

    });

}

setupExternalLinks();