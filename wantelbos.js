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

function updateVIX(vix_data) {
  latest = vix_data.data[vix_data.data.length-1];
  document.getElementById("vix").value = latest.vix.toFixed(1);
}

function updateAllocation(aw_data) {
  const Months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
  latest = aw_data.data[aw_data.data.length-1];
  document.getElementById("upro").value = (100*latest.upro).toFixed(0)+"%";
  document.getElementById("tmf").value = (100*latest.tmf).toFixed(0)+"%";
  document.getElementById("vfitx").value = (100*latest.vfitx).toFixed(0)+"%";
  var date = new Date(latest.Date);
  document.getElementById("as_of").value = Months[date.getUTCMonth()]+" "+date.getUTCDate()+", "+date.getUTCFullYear();
}

function onLoad(section) {
  selectSection(section);
  fetchJSON('graphs/recent_vix_data.json', function(vix_data) {
    console.log("VIX Data:", vix_data);
    updateVIX(vix_data);
  });
  fetchJSON('graphs/recent_allocation_weights.json', function(aw_data) {
    console.log("Allocation Weights:", aw_data);
    updateAllocation(aw_data);
  });

  // Local data
  var vix_data = {"schema": {"fields":[{"type":"datetime","name":"Date"},{"type":"number","name":"vix"}],"pandas_version":"0.20.0","primaryKey":["Date"]}, "data": [{"Date":"2020-02-10T00:00:00.000Z","vix":13.7623333136},{"Date":"2020-02-11T00:00:00.000Z","vix":13.798666652},{"Date":"2020-02-12T00:00:00.000Z","vix":13.8101666451},{"Date":"2020-02-13T00:00:00.000Z","vix":13.8451666355}]};
  updateVIX(vix_data);
  
  var aw_data = {"schema": {"fields":[{"type":"datetime","name":"Date"},{"type":"number","name":"upro"},{"type":"number","name":"tmf"},{"type":"number","name":"vfitx"}],"pandas_version":"0.20.0","primaryKey":["Date"]}, "data": [{"Date":"2020-02-10T00:00:00.000Z","upro":0.5559416672,"tmf":0.4440583328,"vfitx":0.0},{"Date":"2020-02-11T00:00:00.000Z","upro":0.5550333337,"tmf":0.4449666663,"vfitx":0.0},{"Date":"2020-02-12T00:00:00.000Z","upro":0.5547458339,"tmf":0.4452541661,"vfitx":0.0},{"Date":"2020-02-13T00:00:00.000Z","upro":0.5538708341,"tmf":0.4461291659,"vfitx":0.0}]}
  updateAllocation(aw_data);  
}