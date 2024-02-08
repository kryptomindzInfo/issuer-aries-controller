$(function () {
  var settings = {
    url: HOST + "/schemas/created",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    console.log("", response);
    let schemas = response.schema_ids;
    let count = 0;
    for (var schema of schemas) {
      count++;
      $("#list-schema").append($("<option>").val(schema).text(schema));
    }
    $("#schemas-count").html(count);
  });
});

$("#list-schema").on("change", function () {
  let schema_id = this.value;
  if (!schema_id) {
    return;
  }

  var settings = {
    url: HOST + "/schemas/" + schema_id,
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    $("#div-schema").html(`<div class="col-12">
  <div class="form-group">
      <label>Schema:</label>
      <div class="input-group">
          <textarea id="selectedSchemaObject" class="form-control" cols="30" rows="10" readonly="">${JSON.stringify(
            response,
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

$("#div-schema").on("click", ".fa-clipboard", function (e) {
  // Get the text field
  var copyText = $(this).closest(".input-group").find(":input");

  // Select the text field
  copyText.select();

  // Copy the text inside the text field
  document.execCommand("copy");

  // Alert the copied text
  console.log("copied text", copyText.val());
});
