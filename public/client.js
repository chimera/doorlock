// by default don't show socket.io status popups
window.statusspy = false;

$(function(){
    // refocus and clear the input box and relay every 20sec for failsafe
    setInterval(function(){
        $("#rfid").focus();
        $("#rfid").val(null);
        window.relayActivated = false;
    }, 20000);

    $("#statusspybutton").click(function(event){
        // toggle
        window.statusspy = !window.statusspy;
        if (window.statusspy) {
            initSocketio(); // only load socketio if requested
            $(this).addClass("bg-success");
            $("#statusspyview").removeClass("dn");
        } else {
            $(this).removeClass("bg-success");
            $("#statusspyview").addClass("dn");
        }
    });

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
                            if (typeof data == "object" && data.hasOwnProperty("code")) {
                              data = data.code;
                            }
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
        $("#remaining").text(data.remaining == undefined ? "" : data.remaining);
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

function initSocketio() {
    var socket = io();
    socket.on('checkin', function(msg){
        if (window.statusspy) {
            console.log(msg);

            now = new Date(); // now

            name = "n/a";
            number = "n/a";
            status = msg.data;
            style = "";
            icon = "";

            if (msg.hasOwnProperty('success')) {
                if (msg.success) {
                    style = "bg-success";
                    icon = "<i class='fas fa-thumbs-up'></i>";
                    status = "You have "+msg.data.remaining+" checkins remaining."
                } else {
                    style = "bg-danger";
                    icon = "<i class='fas fa-hand-paper'></i>";
                }
            }

            if (msg.card) {
                if (msg.card.name) {
                    name = msg.card.name;
                }
                if (msg.card.number) {
                    // censor it
                    number = "****"+msg.card.number.toString().slice(-3);
                }
            }

            // non-card failures are yellow
            if (
                style == "bg-danger" &&
                msg.card && msg.card.name
            ) {
                style = "bg-warning-light";
                icon = "<i class='fas fa-exclamation-triangle'></i>";
            }

            // highlight header
            $(".page-heading").css("animation-play-state","running");

            $("#statusspylog tbody").prepend(
                "<tr class='"+style+"'>"+
                "<td class='date px-md py-sm' alt='"+now.toLocaleTimeString()+"' data-date='"+now.toISOString()+"'>Now</td>"+
                "<td class='px-md py-sm'>"+name+"</td>"+
                "<td class='px-md py-sm'>"+number+"</td>"+
                "<td class='px-md py-sm'>"+icon+" "+status+"</td></tr>");
        }
    });

    // every 15 secs, update times
    setInterval(function(){
        $("#statusspylog td.date").each(function(){
            then = new Date($(this).data('date'));
            $(this).text(timeSince(then)+" ago");
        });
    }, 15000)
}

function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval >= 1) {
    return interval + " year(s)";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval + " month(s)";
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval + " day(s)";
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval + " hour(s)";
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval + " minute(s)";
  }
  return Math.floor(seconds) + " seconds";
}