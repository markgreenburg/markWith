window.addEventListener('load', () => {
    const logoutA = $("a#user-logout");
    const createDocA = $("a#create-doc");
    
    // Log user out
    logoutA.on('click', (event) => {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: '/api/user/logout',
            encode: true,
            success: (res) => {
                if (res.success) {
                    window.location = '/';
                } else {
                    console.log(res);
                }
            },
            error: (err) => console.log(err)
        });
    });

    // Create new doc, assign session user as owner
    createDocA.on('click', (event) => {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: '/api/documents/create',
            encode: true,
            success: (res) => {
                if (res.success) {
                    window.location.assign('/documents/' + res.data._id);
                } else {
                    console.log(res);
                }
            },
            error: (err) => console.log(err)
        });
    });
});