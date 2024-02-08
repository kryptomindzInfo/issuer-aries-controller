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
  var schemaId = data.MEMBERSHIP.schema;
  console.log("schema id", schemaId);
  var credentialDefinitionId = data.MEMBERSHIP.definition;

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

  //fetch input values
  let start_date = $("#start-date").val();
  let validity = $("#validity").val();
  let type = $("#mem-type option:selected").text();
  let group = $("#mem-group option:selected").text();
  let logo = $("#mem-group").val();
  let attribs = [
    {
      name: "start_date",
      value: formatDate(start_date),
    },
    {
      name: "validity",
      value: validity,
    },
    {
      name: "type",
      value: type,
    },
    {
      name: "group",
      value: group,
    },
    { name: "logo", value: LOGOS[logo] },
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
