window.onload = () => {
    const logoutLi = $("li#user-logout-li");
    const createDocLi = $("li#create-doc-li");
    
    // Log user out
    logoutLi.on('click', 'a', (event) => {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: '/api/user/logout',
            encode: true,
            success: (res) => {
                if (res.success) {
                    window.location.replace('/');
                } else {
                    console.log(res);
                }
            },
            error: (err) => console.log(err)
        });
    });

    // Create new doc, assign session user as owner
    createDocLi.on('click', 'a', (event) => {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: '/api/documents/create',
            encode: true,
            success: (res) => {
                if (res.success) {
                    window.location.replace('/documents/' + res.data._id);
                } else {
                    console.log(res);
                }
            },
            error: (err) => console.log(err)
        });
    });
}