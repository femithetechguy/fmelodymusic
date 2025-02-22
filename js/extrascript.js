
(function loadPageTitle() {
    let pageTitle = "FMelody Music";
    document.title = pageTitle;
})();

(function loadfavIcon() {
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = '../images/favicon.png';
})();

// (function loadheaderLeft() {
//     var headerTextLeft = document.getElementById("headerTextLeft");
//     if (!headerTextLeft) {
//         headerTextLeft = document.createElement('headerTextLeft');
//         document.head.appendChild(headerTextLeft);
//     }
//     headerTextLeft.textContent = "Jongleur Zone";
// })();
