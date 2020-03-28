var current_section;

function selectSection(section) {
  var x;
  x = document.getElementById(current_section);
  if (x) x.style.display = "none";
  x = document.getElementById(section);
  if (x) x.style.display = "block";
  current_section = section;
}

function onLoad(section) {
  selectSection(section);
}