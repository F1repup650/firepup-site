var text = ``
var array = ["87","69","76","67","79","77","69",
             "spc","84","79",
             "spc","84","72","69",
             "spc","72","73","68","68","69","78",
             "spc","80","65","71","69","46",
             "spc","67","79","77","77","69","78","84",
             "spc","73","45","65","77","45","65","45","83","85","80","69","82","45","83","69","65","82","67","72","69","82",
             "spc","73","70","spc","89","79","85",
             "spc","67","65","78",
             "spc","82","69","65","68",
             "spc","84","72","73","83","46"]
array.forEach(
  (item) => {
  if (item != "spc") {
    //text += `<img src="https://www.dcode.fr/tools/sheikah/images/char(`+item+`).png" class="no-bounce" alt="char(`+item+`)"></img>`
    text += `<img src="/images/sheikah/char(`+item+`).png" class="no-bounce" alt="char(`+item+`)"></img>`
  }
  else {
    text += "<br/>"
  }})
document.getElementById("shh").innerHTML = text
console.log("Page loaded.")