$(function(){
    // refocus and clear the input box every 20sec
    setInterval(function(){
        $("#rfid").focus();
        $("#rfid").val(null);
    }, 20000);

    $("#rfid").keydown(function(event){
        // prevent enter key from submitting form; we want AJAX if possible
        if (event.keyCode === 13){
            return false;
        }
    }).keyup(function(event){
        // store value
        value = $("#rfid").val();

        // start processing after the enter key
        if (event.keyCode === 13) {
            // wait to send the request for a sec to let them finish typing
            setTimeout(function(){
                // clear input box
                $("#rfid").val(null);
                // post value to server
                loading(true);
                if (!window.checkinLoading) {
                    // use global var to prevent simultaneous posts
                    window.checkinLoading = true;
                    console.log("Checking in...");
                    $.post("/checkin", {"rfid":value}, function(data){
                        console.log(data);
                        if (data.hasOwnProperty("success")) {
                            if (data.success) {
                                success(data.name);
                            } else {
                                failure();
                            }
                        } else {
                            error();
                        }
                    }, "json").fail(function(){
                        error();
                    }).always(function(){
                        loading(false);
                        window.checkinLoading = false;
                    });
                } else {
                    console.log("Already checking in; canceled.");
                }
            }, 250);
        }
    });
});


function loading(loading){
    if (loading) {
        $("#loading").removeClass("dn");
    } else {
        $("#loading").addClass("dn");
    }
}

function reset(){
    $("#name").text(null);
    $("#failure").addClass("dn");
    $("#success").addClass("dn");
    $("#error").addClass("dn");
}

function success(name){
    reset();
    setTimeout(function(){
        $("#name").text(name);
        $("#success").removeClass("dn");
        setTimeout(function(){ reset(); }, 6000); // 6000 to match door.js(const DELAY)
    }, 250);
}

function failure(){
    reset();
    setTimeout(function(){
        $("#failure").removeClass("dn");
        setTimeout(function(){ reset(); }, 6000); // 6000 to match door.js(const DELAY)
    }, 250);
}

function error(){
    reset();
    setTimeout(function(){
        $("#error").removeClass("dn");
        setTimeout(function(){ reset(); }, 6000); // 6000 to match door.js(const DELAY)
    }, 250);
}