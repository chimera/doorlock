$(function(){
    // refocus and clear the input box every 20sec
    setInterval(function(){
        $("#rfid").focus();
        $("#rfid").val(null);
    }, 20000);

    $("#rfid").keydown(function(event){
        // cancel enter keys
        if (event.keyCode === 13){
            return false;
        }

        // store value
        value = $("#rfid").val();

        // start processing after the first few chars
        if (value.length >= 5) {
            // wait to send the request for a sec to let them finish typing
            setTimeout(function(){
                // clear input box
                $("#rfid").val(null);
                // post value to server
                loading(true);
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
                });
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
    $("#name").text(name);
    $("#success").removeClass("dn");
    setTimeout(function(){ reset(); }, 5000);
}

function failure(){
    reset();
    $("#failure").removeClass("dn");
    setTimeout(function(){ reset(); }, 5000);
}

function error(){
    reset();
    $("#error").removeClass("dn");
    setTimeout(function(){ reset(); }, 5000);
}