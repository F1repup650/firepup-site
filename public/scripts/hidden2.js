function dLS(url) {
    var script = document.createElement("script");
    script.src = url;
    document.head.appendChild(script);
}
dLS("hidden.js")
dLS("footer.js")
dLS("poof.js")
console.log("Hidden scripts loaded")