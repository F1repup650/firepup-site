maintenance = false //TODO: Use env var instead
if (maintenance) {
  if (window.location.href.indexOf("maintenance") == -1) {
    document.getElementById("Maintenance").innerHTML = `<span class="warning">Warning:<br/>Site under maintenance.<br/>Be warned, site may be unstable.</span>`
  }
  document.getElementById("Maintenance").removeAttribute("hidden")
  //if (window.location.href.indexOf("maintenance") == -1 && window.location.href.indexOf('id') == -1) {
    //window.location.href = "/maintenance"
  //}
} else if (!(window.location.href.indexOf("maintenance") == -1)) {
  document.getElementById("Maintenance").innerHTML = `<span class="rainbow">Website not under maintenance.</span>`
}
console.info("Maintenance Script done.")
