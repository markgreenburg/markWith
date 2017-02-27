window.addEventListener('load', () => {
    $("form.signup-form").submit((event) => {
        event.preventDefault();
        const formData = {
            "fName": $("input#first-name").val(),
            "lName": $("input#last-name").val(),
            "email": $("input#email").val(),
            "password": $("input#password").val()
        };
        $.ajax({
            type: "POST",
            url: "/api/user/register",
            data: formData,
            encode: true,
            success: (response) => {
                if (response.success === true) {
                    const formData = {
                        "email": $("input#email").val(),
                        "password": $("input#password").val()
                    }
                    $.ajax({
                        type: "POST",
                        url: "/api/user/login",
                        data: formData,
                        encode: true,
                        success: (response) => {
                            if (response.success === true) {
                                window.location.assign('/documents');
                            } else {
                                window.location.assign('/user/login');
                            }
                        },
                        error: (err) => {
                            console.log(err);
                            window.location.assign('/user/login');
                        }
                    });
                } else {
                    $("div.messages").show();
                    showSignupError(response);
                }
            },
            error: (err) => {
                console.log(err);
                showSignupError(err);
            }
        });
    });
    const showSignupError = (response) => {
        const messageListItem = $("li#message");
        const msg = (response.message ? response.message 
                : "Sorry, couldn't create your account");
        $("div.messages").show();
        messageListItem.empty();
        messageListItem.text(msg);
    };
});
