$(function () {
  var settings = {
    url: HOST + "/connections",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
    let connections = response.results;
    let active = 0;
    let pending = 0;
    for (let connection of connections) {
      if (connection.state == "active" || connection.state == "request") {
        active++;
        $("#active-connections").append(
          ` <div class="col-lg-3 col-md-6">
        <div class="card">
          <div class="card-body">
            <button type="button" aria-label="Close" class="close">
              <span aria-hidden="true">×</span>
            </button>
            <div class="card-title">
              <small></small>
              <small class="text-muted">${formatDate(
                connection.created_at
              )}</small>
            </div>
            <div class="card-text">
              <span></span>
              <span>${connection.their_label}</span>
            </div>
            <div class="card-text">
              <span>
                <small class="text-muted">DID:</small>&nbsp;
              </span>
              <span>${connection.their_did}</span>
            </div>
          </div>
          <div class="card-footer">
            <p class="card-text">
              <small class="text-muted">
                Last updated ${formatDate(connection.updated_at)}
              </small>
            </p>
          </div>
        </div>
        </div>`
        );
      } else {
        pending++;
        $("#pending-connections").append(
          `<div class="col-lg-3 col-md-6">
        <div class="card">
            <div class="card-body">
                <button type="button" aria-label="Close" class="close">
                    <span aria-hidden="true">×</span>
                </button>
                <div class="card-title">
                    <small><span>Created</span>&nbsp;</small>
                    <small class="text-muted">${formatDate(
                      connection.created_at
                    )}</small>
                </div>
                <div class="card-text">
                    <div>
                        <small class="text-muted">Connection ID:</small>&nbsp;
                    </div>
                    <span>${connection.connection_id}</span>
                </div>
            </div>
            <div class="card-footer">
                <p class="card-text">
                    <small class="text-muted">
                        Last updated ${formatDate(connection.updated_at)}
                    </small>
                </p>
            </div>
        </div>
    </div>`
        );
      }
    }
    $("#active-count").html(active);
    $("#pending-count").html(pending);
  });
});

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(dateStr) {
  var date = new Date(dateStr);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + ":" + seconds + " " + ampm;
  return (
    monthNames[date.getMonth()] +
    " " +
    date.getDate() +
    ", " +
    date.getFullYear() +
    ", " +
    strTime
  );
}
