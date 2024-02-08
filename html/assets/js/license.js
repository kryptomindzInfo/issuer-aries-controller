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

$(function () {
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
});

$("#submit-credential").on("click", async function () {
  var response = await fetch("./data.json");
  var data = await response.json();
  if (!data) {
    alert("Schema and Credential data missing.");
  }
  var schemaId = data.LICENSE.schema;
  console.log("schema id", schemaId);
  var credentialDefinitionId = data.LICENSE.definition;

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

  let name = $("#full_name").val();
  let date_of_birth = $("#date_of_birth").val();
  let license_no = $("#license_no").val();
  let date_of_issue = $("#date_of_issue").val();
  let validity = $("#validity").val();
  let address = $("#address").val();
  let state = $("#state").val();
  let class_of_license = $("#class-of-license").val();
  let attribs = [
    {
      name: "full_name",
      value: name,
    },
    {
      name: "birth_date",
      value: toTimestamp(date_of_birth),
    },
    {
      name: "validity",
      value: validity,
    },
    {
      name: "issue_date",
      value: formatDate(date_of_issue),
    },
    {
      name: "address",
      value: address,
    },
    {
      name: "issuing_state",
      value: state,
    },
    {
      name: "license_no",
      value: license_no,
    },
    {
      name: "class",
      value: class_of_license,
    },
  ];
  credential["credential_proposal"]["attributes"] = attribs;
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

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function toTimestamp(date) {
  var d = new Date(date);
  return Math.floor(d.getTime() / 1000).toString();
}
