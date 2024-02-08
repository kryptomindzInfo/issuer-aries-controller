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
  var schemaId = data["ACADEMIC"].schema;
  console.log("schema id", schemaId);
  var credentialDefinitionId = data.ACADEMIC.definition;

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

  let name = $("#name_stu").val();
  let issueDate = $("#date_of_issue").val();

  let date_of_issue = formatDate(issueDate);
  console.log("date of issue", date_of_issue);
  let degree = $("#degree").val();
  let timestamp = $("#timestamp").val();
  // let birthdate = $("#birthdate_dateint").val();
  // console.log("birthdate", birthdate);
  // let date = new Date(birthdate);
  // const birthdate_dateint = Math.floor(date.getTime() / 1000).toString();
  // console.log("birth in int", birthdate_dateint);
  let attribs = [
    {
      name: "name",
      value: name,
    },
    {
      name: "date",
      value: date_of_issue,
    },
    {
      name: "degree",
      value: degree,
    },
    // {
    //   name: "birthdate_dateint",
    //   value: birthdate_dateint,
    // },
    {
      name: "timestamp",
      value: timestamp,
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
