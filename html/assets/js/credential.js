var credential = {
  comment: "string",
  credential_proposal: {
    "@type":
      "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview",
    attributes: [],
  },
  schema_issuer_did: "",
  connection_id: "",
  schema_version: "",
  schema_id: "",
  issuer_did: "",
  cred_def_id: "",
  schema_name: "",
};

defaultAttributes = [
  { name: "name", value: "Alice Smith" },
  { name: "date", value: "2020-01-01" },
  { name: "degree", value: "Maths" },
  { name: "birthdate_dateint", value: "20000101" },
  { name: "timestamp", value: "24" },
];

$(function () {
  var settings = {
    url: HOST + "/schemas/created",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    console.log("", response);
    let schemas = response.schema_ids;
    for (var schema of schemas) {
      $("#list-schemas").append($("<option>").val(schema).text(schema));
    }
  });

  settings = {
    url: HOST + "/credential-definitions/created",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    console.log("", response);
    var cred_defs = response.credential_definition_ids;
    for (var cred_def of cred_defs) {
      $("#list-cred-defs").append($("<option>").val(cred_def).text(cred_def));
    }
  });

  settings = {
    url: HOST + "/connections",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
    let connections = response.results;
    for (let connection of connections) {
      if (connection.state == "active" || connection.state == "request") {
        $("#list-connections").append(
          $("<option>")
            .val(connection.connection_id)
            .text(connection.their_label + ": " + connection.connection_id)
        );
      }
    }
  });

  $("#credentialAttributesObject").val(
    JSON.stringify(defaultAttributes, null, 2)
  );
});

$("#submit-credential").on("click", function () {
  var schemaId = $("#list-schemas").val();
  console.log("schema id", schemaId);
  var credentialDefinitionId = $("#list-cred-defs").val();

  var schemaArr = schemaId.split(":");
  console.log(schemaArr);
  credential["schema_issuer_did"] = schemaArr[0];
  credential["schema_version"] = schemaArr[3];
  credential["schema_id"] = schemaId;
  credential["schema_name"] = schemaArr[2];

  var credDefArr = credentialDefinitionId.split(":");
  credential["issuer_did"] = credDefArr[0];
  credential["cred_def_id"] = credentialDefinitionId;

  credential["connection_id"] = $("#list-connections").val();

  credential["credential_proposal"]["attributes"] = JSON.parse(
    $("#credentialAttributesObject").val()
  );
  console.log(credential);
  var settings = {
    url: HOST + "/issue-credential/send",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(credential),
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
    window.location.href = "connections/active.html";
  });
});
