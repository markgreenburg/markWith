window.onload(() => {
    $("form.login").submit((event) => {
        event.preventDefault();
        const formData = {
            "email": $("email-login").value(),
            "password": $("password-logn").value()
        };
        $.ajax({
            "type": "POST",
            "url": "/api/user/login",
            "data": formData,
            "dataType": "json",
            "encode": true,
            "success": (response) => {
                if (response.success === true) {
                    window.location.replace("/documents");
                } else {
                    showLoginError();
                }
            },
            "error": () => showLoginError()
        });
    });
});

const showLoginError = (() => {
    const messageListItem = $("li#message");
    $("div.messages").show();
    messageListItem.empty();
    messageListItem.text("Login failed, please try again");
});