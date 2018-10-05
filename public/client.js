$(function(){
    // refocus and clear the input box and relay every 20sec for failsafe
    setInterval(function(){
        $("#rfid").focus();
        $("#rfid").val(null);
        window.relayActivated = false;
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
                if (!window.checkinLoading && !window.relayActivated) {
                    // use global var to prevent simultaneous posts
                    window.checkinLoading = true;
                    console.log("Checking in...");
                    $.post("/checkin", {"rfid":value}, function(data){
                        console.log(data);
                        if (data.hasOwnProperty("success")) {
                            if (data.success) {
                                success(data.data);
                                window.relayActivated = true;
                            } else {
                                failure(data.data);
                            }
                        } else {
                            error(data);
                        }
                    }, "json").fail(function(res){
                        error(res.responseText);
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
    $("#errormessage").text("Something went wrong with the card reader.");
    loading(false);
}

function success(data){
    reset();
    setTimeout(function(){
        $("#name").text(data.name);
        $("#remaining").text(data.remaining);
        $("#success").removeClass("dn");
        setTimeout(function(){
            reset();
            // this is the only time when the relay is reset, besides the 20-sec reset
            window.relayActivated = false;
        }, 6000); // 6000 to match door.js(const DELAY)
    }, 250);
}

function failure(data){
    reset();
    console.log(data);
    setTimeout(function(){
        $("#failure").removeClass("dn");
        if (data) {
            $("#failuretitle").text("Problem with your membership")
            $("#failuremessage").text(data);
        } else {
          $("#failuretitle").text("Card not valid");
          $("#failuremessage").html("Sorry your card isn't valid. Please try again.<br><br><em>Maybe your membership has expired?</em>");
        }
        setTimeout(function(){ reset(); }, 6000); // 6000 to match door.js(const DELAY)
    }, 250);
}

function error(msg){
    console.log(msg);
    reset();
    setTimeout(function(){
        $("#error").removeClass("dn");
        if (msg) {
            $("#errormessage").text(msg);
        }
        setTimeout(function(){ reset(); }, 6000); // 6000 to match door.js(const DELAY)
    }, 250);
}