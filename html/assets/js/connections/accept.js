$("#accept-invitation").on("click", "button", function () {
  var invitation = $("#invitationObject").val();
  if (!invitation) {
    var invitation_url = $("#invitationUrl").val();
    const url = new URL(invitation_url);
    const invitationParam = url.searchParams.get("c_i");
    if (!invitationParam) {
      return;
    }

    invitation = JSON.parse(atob(invitationParam));
    console.log("invitaion from url", invitation);
  }
  $.ajax({
    type: "POST",
    data: JSON.stringify(invitation),
    url: HOST + "/connections/receive-invitation",
    success: function (result, status, xhr) {
      console.log("result: " + result);
      if (result != null) {
        console.log("receive invitation" + result);
        window.location.href = "connections/active.html";
      }
    },
    error: function (xhr, status, error) {
      console.log(
        "Result: " +
          status +
          " " +
          error +
          " " +
          xhr.status +
          " " +
          xhr.statusText
      );
    },
  });
});
