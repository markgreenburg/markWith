window.onload = () => {
    // Hide password and email confirmations until needed
    $("div.password-confirm").hide();
    $("div.email-confirm").hide();

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

    // Set up locals to enable POST checks
    const fName = $("input#first-name").val();
    const lName = $("input#last-name").val();
    const email = $("input#email").val();

    // Show & require password confirm if password changed
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
        // To-Do: conditional object that only POSTs what's been changed
        $.ajax()
    });
    // Create onsubmit handler to edit user info
    // Modify PW check to trigger on input
    // Onsubmit should replace form values ... abstract getUserInfo and call it again?
}