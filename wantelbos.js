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
  document.getElementById("upro_aa").value = (100*latest.upro).toFixed(0)+"%";
  document.getElementById("tmf_aa").value = (100*latest.tmf).toFixed(0)+"%";
  document.getElementById("vfitx_aa").value = (100*latest.vfitx).toFixed(0)+"%";
  document.getElementById("upro_current").value = "10000";
  document.getElementById("tmf_current").value = "0";
  document.getElementById("vfitx_current").value = "0";
  document.getElementById("cash_current").value = "0";
  var date = new Date(latest.Date);
  document.getElementById("as_of").value = Months[date.getUTCMonth()]+" "+date.getUTCDate()+", "+date.getUTCFullYear();
  rebalance();
}

function toCurrency(value) {
  return "$"+value.toLocaleString('en-US', {minimumFractionDigits: 0});
}

function readField(field, update) {
  var data = parseInt(document.getElementById(field).value.replace('$','').replace(',',''));
  if (update) document.getElementById(field).value = toCurrency(data);
  return data;
}

function updateTarget(field, target) {
  document.getElementById(field).value = toCurrency(target);
}

function updateChange(field, change) {
  var action = "";
  if (change > 0) action = "Buy "+toCurrency(change);
  if (change < 0) action = "Sell "+toCurrency(-change);
  document.getElementById(field).value = action;
}

function rebalance() {
  var upro_current = readField("upro_current", true);
  var tmf_current = readField("tmf_current", true);
  var vfitx_current = readField("vfitx_current", true);
  var cash_current = readField("cash_current", true);
  var total = upro_current + tmf_current + vfitx_current + cash_current;
  document.getElementById("upro_change").value = "Total="+total;
  var upro_aa = readField("upro_aa");
  var tmf_aa = readField("tmf_aa");
  var vfitx_aa = readField("vfitx_aa");
  var upro_target = parseInt((total*upro_aa / 100).toFixed(0));
  var tmf_target = parseInt((total*tmf_aa / 100).toFixed(0));
  var vfitx_target = parseInt((total*vfitx_aa / 100).toFixed(0));
  updateTarget("upro_target", upro_target);
  updateTarget("tmf_target", tmf_target);
  updateTarget("vfitx_target", vfitx_target);
  var upro_change = upro_target - upro_current;
  var tmf_change = tmf_target - tmf_current;
  var vfitx_change = vfitx_target - vfitx_current;
  updateChange("upro_change", upro_change);
  updateChange("tmf_change", tmf_change);
  updateChange("vfitx_change", vfitx_change);
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