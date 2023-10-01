function dLS(url) {
    var script = document.createElement("script");
    script.src = url;
    document.head.appendChild(script);
}
dLS("https://cdn.jsdelivr.net/npm/eruda@2.11.3/eruda.min.js")
dLS("/footer.js")
dLS("/maintenance.js")
dLS("/eruda_loader.js")
console.info("Main Script done.")