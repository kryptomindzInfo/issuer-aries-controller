$("#new-invite-btn").on("click", function (e) {
  showInvitation();
});

function showInvitation() {
  $.ajax({
    type: "POST",
    url: HOST + "/connections/create-invitation",
    success: function (result, status, xhr) {
      console.log("result: " + result);
      if (result != null) {
        let Invitation = result;
        $("#new-invite-btn").attr("disabled", "disabled");
        var children = `<div class="form-group">

        <div hidden class="form-group">
            <label>Copy the following invitation object:</label>
            <div class="input-group">
                <textarea id="invitationObject" class="form-control" cols="30" rows="10"
                    readonly="">${JSON.stringify(
                      Invitation.invitation,
                      null,
                      2
                    )}</textarea>
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary copy-invite" type="button">
                        <i class="fa fa-clipboard"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="form-group">
        <label>Alternatively copy the following invitation URL:</label>
        <div class="input-group">
            <input id="invitationUrl" type="text" class="form-control" readonly="" value="${
              Invitation.invitation_url
            }">
            <div class="input-group-append">
                <button class="btn btn-outline-secondary copy-invite" type="button">
                    <i class="fa fa-clipboard"></i>
                </button>
            </div>
        </div>
    </div>

    <div class="form-group">
        <label>Or scan the following QR Code:</label>
        <div class="qr-container">
          <div id="invite-qrcode" class="qr-code"></div>
        </div>
    </div>`;
        $("#invitation-form").append(children);
        $("#invite-qrcode").qrcode({
          text: Invitation.invitation_url,
          width: 512,
          height: 512,
        });
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
}

$("#invitation-form").on("click", ".copy-invite", function (e) {
  // Get the text field
  var copyText = $(this).closest(".input-group").find(":input");

  // Select the text field
  copyText.select();

  // Copy the text inside the text field
  document.execCommand("copy");

  // Alert the copied text
  console.log("copied text", copyText.val());
});
