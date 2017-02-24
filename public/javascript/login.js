window.onload = () => {
    $("form.login").submit((event) => {
        event.preventDefault();
        const formData = {
            "email": $("email-login").value,
            "password": $("password-login").value
        };
        $.ajax({
            method: "POST",
            url: "/api/user/login",
            data: "'" + formData + "'",
            dataType: "json",
            processData: false,
            success: (response) => {
                if (response.success === true) {
                    console.log("login successful");
                    window.location.replace("/documents");
                } else {
                    console.log("got response but not successful");
                    showLoginError();
                }
            },
            "error": () => {
                console.log("response error");
                showLoginError();
            }
        });
    });
};

const showLoginError = (() => {
    const messageListItem = $("li#message");
    $("div.messages").show();
    messageListItem.empty();
    messageListItem.text("Login failed, please try again");
});