var current_section;

function selectSection(section) {
  var x;
  x = document.getElementById(current_section);
  if (x) x.style.display = "none";
  x = document.getElementById(section);
  if (x) x.style.display = "block";
  current_section = section;
}

function fetchJSON(url, cb) {
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var result = JSON.parse(this.responseText);
      cb(result);
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

function onLoad(section) {
  selectSection(section);
  fetchJSON('graphs/recent_vix_data.json', function(vix_data) {
    console.log(vix_data);
  });
}