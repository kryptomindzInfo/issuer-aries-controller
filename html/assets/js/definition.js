$(function () {
  var settings = {
    url: HOST + "/credential-definitions/created",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    console.log("", response);
    var cred_defs = response.credential_definition_ids;
    let count = 0;
    for (var cred_def of cred_defs) {
      count++;
      $("#list-cred-def").append($("<option>").val(cred_def).text(cred_def));
    }
    $("#definitions-count").html(count);
  });
});

$("#list-cred-def").on("change", function () {
  let cred_def_id = this.value;
  console.log();
  if (!cred_def_id) {
    return;
  }

  var settings = {
    url: HOST + "/credential-definitions/" + cred_def_id,
    method: "GET",
  };

  $.ajax(settings).done(function (response) {
    $("#div-cred-def").html(`<div class="col-12">
  <div class="form-group">
      <label>Credential Definition:</label>
      <div class="input-group">
          <textarea id="selectedCredentialDefinitionObject" class="form-control" cols="30" rows="10" readonly="">${JSON.stringify(
            response.credential_definition,
            null,
            2
          )}</textarea>
          <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button">
                  <i class="fa fa-clipboard"></i>
              </button>
          </div>
      </div>
  </div>
</div>`);
  });
});

$("#div-cred-def").on("click", ".fa-clipboard", function (e) {
  // Get the text field
  var copyText = $(this).closest(".input-group").find(":input");

  // Select the text field
  copyText.select();

  // Copy the text inside the text field
  document.execCommand("copy");

  // Alert the copied text
  console.log("copied text", copyText.val());
});
