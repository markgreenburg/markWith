window.addEventListener('load', () => {
    // Hide password and email confirmations until needed
    $("div.password-confirm").hide();
    $("div.email-confirm").hide();
    $("div.messages").hide();

    // Fill in user info
    $.ajax({
        method: "GET",
        url: "/api/user",
        success: (response) => {
            $("input#first-name").val(response.data.fName);
            $("input#last-name").val(response.data.lName);
            $("input#email").val(response.data.email);
        },
        error: (err) => {
            console.log(err);
            window.location.replace("/user/login");
        }
    });

    // Show & require password & confirm if change password
    $("div.password").on("input", () => {
        $("div.password-confirm").show();
        $("input#password-confirm").prop("required", true);
    });

    // Show & require email confirm if email changed
    $("div.email").on("input", () => {
        $("div.email-confirm").show();
        $("input#email-confirm").prop("required", true);
    });

    // Update user info
    $("form.update-form").submit((event) => {
        event.preventDefault();
        const formData = {
            fName: $("input#first-name").val(),
            lName: $("input#last-name").val(),
            email: $("input#email").val()
        };
        $.ajax({
            type: "POST",
            url: "/api/user/update",
            data: formData,
            encode: true,
            success: (res) => {
                showMessage((res.message
                        ? res.message : "info updated successfully"))
            },
            error: (err) => {
                console.log(err);
                showMessage((err.message 
                        ? err.message : "Sorry, couldn't save your update"));
            }
        });
    });

    // Update password
    $("form.password-form").submit((event) => {
        event.preventDefault();
        const formData = {
            password: $("input#first-name").val()
        };
        $.ajax({
            type: "POST",
            url: "/api/user/update",
            data: formData,
            encode: true,
            success: (response) => showMessage(response.message),
            error: (err) => {
                console.log(err);
                showMessage((err.message 
                        ? err.message : "Sorry, couldn't save your update"));
            }
        });
    });
    const showMessage = (msg) => {
        const listItem = $("li#message");
        $("div.messages").show();
        listItem.text(msg);
    };
});