function dLS(url) {
    var script = document.createElement("script");
    script.src = url;
    document.head.appendChild(script);
}
dLS("pgen.js")
dLS("footer.js")
console.log("PwdGen scripts loaded")