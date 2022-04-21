$(document).ready(function () {
    // Modal init
    $('#infoModal').modal();
    $("#confirmationModal").modal({
        onCloseStart: function () {
            $("#addEventType").val("");
            $("#captchaConfirmSubmit").hide();
        }
    });
    $('.track-btn.tooltipped').tooltip({
        position: "left"
    });

    let reCaptchaToken = null;
    try {
        grecaptcha.ready(function () {
            console.log("recaptcha ready");

            $(".track-btn").attr("disabled", false);
        });
    } catch (e) {
        console.warn(e);
    }

    const devMode = window.location.hash === "#DEV";
    if (devMode) {
        $("#d").text("DEV MODE ACTIVE");
    }

    let now = new Date().getTime();
    let twoHoursInMillis = 7.2e+6;
    let oneAndHalfHourInMillis = 5.4e+6;
    let twentyMinsInMillis = 1.2e+6;
    let tenMinsInMillis = 600000;
    let fiveMinsInMillis = 300000;

    let startCounter = 0;

    let tenMinuteNotification;
    let fiveMinuteNotification;

    let estimateData = {};

    let timerId = -1;
    let historyHours = 4;
    let lastFocused = now / 1000;

    let ipv4 = "";
    let ipv6 = "";

    let onePushNotificationsGranted = false;
    let onePushNotificationsEnabled = false;

    function updateTimer() {
        now = Date.now();

        startCounter++;

        let hoursSinceLastEruption = moment.duration(now - estimateData.latest.eruption).asHours();
        let minutesSinceLastEruption = moment.duration(now - estimateData.latest.eruption).asMinutes();
        let minutesUntilNextEruption = moment.duration(estimateData.estimate - now).asMinutes();


        $("#nextTime").text("(" + moment(estimateData.estimate).format('MMMM Do YYYY, h:mm:ss a') + ")");
        $("#confidenceScore").text("" + (Math.floor(estimateData.confidence * 10) * 10) + "% confidence")

        $("#lastTrackedTime").html(moment(estimateData.latest.eruption).fromNow() + "<br/> (" + moment(estimateData.latest.eruption).format('MMMM Do YYYY, h:mm:ss a') + ")" + ((hoursSinceLastEruption > 5) ? "<br/><i>The timer could likely be inaccurate, since server restarts etc. are not accounted for</i>" : "") + "");
        if (estimateData.latest.eruption <= 0) {
            $("#lastTrackedWrapper").hide();
        }

        let duration = estimateData.estimate - now;
        let formattedTimer = moment.utc(duration).format("HH:mm:ss");
        if (duration > 0) {
            $("#time").text(formattedTimer);
            $("#timerText").text("The Volcano should erupt in about");

            $('head title', window.parent.document).text(formattedTimer + " | Volcano Timer // Hypixel Skyblock");
        } else {
            $("#time").text("NOW");
            $("#timerText").text("The Volcano should erupt");

            $('head title', window.parent.document).text("NOW | Volcano Timer // Hypixel Skyblock");
        }

        // Start timeout before showing any buttons, since it looks like a lot of people like clicking buttons with shiny colors
        if (startCounter > 15) {
            if (now % 2 === 0) {
                if (minutesUntilNextEruption > 4 && minutesSinceLastEruption > 1 && estimateData.confidence > 0.3) {
                    $("#eruptedButton").hide();
                } else {
                    $("#eruptedButton").show();
                }
                if (now - estimateData.latest.spawn < fiveMinsInMillis) {
                    $("#eruptionTime").text("(" + moment(estimateData.latest.spawn).fromNow() + ")");
                    $("#eruptedButton").attr("data-tooltip", estimateData.latestConfirmations.spawn + " Confirmations");
                    // $("#musicBtn").attr("disabled", true);
                } else {
                    $("#eruptionTime").text("");
                    $("#eruptedButton").attr("data-tooltip", "Not Confirmed")
                }

                // update tooltips
                $('.track-btn.tooltipped').tooltip({
                    position: "left"
                });

                if ($('.track-btn:visible').length) {
                    $("#buttonNote").show()
                } else {
                    $("#buttonNote").hide();
                }
            }
        }


        let message = "";
        if (duration < fiveMinsInMillis) {
            message = "Get ready!";

            if (localStorage.getItem("fiveMinNotification") === "true") {
                if (!fiveMinuteNotification) {
                    fiveMinuteNotification = showNotification("The Skyblock Volcano should erupt in less than five minutes!");
                }
            }
        } else {
            fiveMinuteNotification = null;
        }
        if (duration < tenMinsInMillis) {
            message = "If you're not already on the Crimson Isle, you should get going!";

            if (localStorage.getItem("tenMinNotification") === "true") {
                if (!tenMinuteNotification && !fiveMinuteNotification) {
                    tenMinuteNotification = showNotification("The Skyblock Volcano should erupt in less than 10 minutes!");
                }
            }
        } else {
            tenMinuteNotification = null;
        }

        $("#suggestionMessage").text(message);
    }

    function refreshEstimate() {
        $.ajax("https://hypixel-api.inventivetalent.org/api/skyblock/volcano/estimatedEruption").done(function (data) {
            console.log(data);
            estimateData = data;


            updateTimer();
            clearInterval(timerId);
            timerId = setInterval(updateTimer, 1000);// tick every second
        });

        // $.ajax("https://hypixel-api.inventivetalent.org/api/skyblock/bosstimer/magma/activeUsers").done(function (data) {
        //     $("#activeUserCount").text(data.activeUsers);
        // })
    }

    refreshEstimate();
    setInterval(refreshEstimate, 30000);

    function ping() {
        $.ajax({
            method: "POST",
            url: "https://hypixel-api.inventivetalent.org/api/skyblock/volcano/ping",
            data: {
                lastFocused: Math.floor(lastFocused),
                minecraftUser: $("#mcUsername").val(),
                ipv4: ipv4,
                ipv6: ipv6
            }
        })
    }

    ping();
    setInterval(ping, 30000);

    $("#eruptedButton").click(function () {
        let $this = $(this);
        doEventPost($this, "eruption", "an eruption", false);
    });

    function doEventPost($this, event, eventDescription, skipEstimateRefresh) {
        showConfirmationModal(event);
        $this.attr("disabled", true);
        // let username = $("#mcUsername").val();
        // confirmAndCaptchaAdd(eventDescription, function (b) {
        //     if (b) {
        //         $this.attr("disabled", true);
        //         $.ajax({
        //             method: "POST",
        //             url: "https://hypixel-api.inventivetalent.org/api/skyblock/bosstimer/magma/addEvent",
        //             data: {
        //                 type: event,
        //                 captcha: reCaptchaToken,
        //                 username: username,
        //                 ipv4: ipv4,
        //                 ipv6: ipv6
        //             }
        //         }).done(function () {
        //             // $this.css("display", "none");
        //             $this.attr("disabled", true);
        //
        //             if (!skipEstimateRefresh)
        //                 refreshEstimate();
        //         })
        //     }
        // })
    }

    function showConfirmationModal(event) {
        $("#addEventType").val(event);
        $("#confirmationModal").modal("open");
    }

    $("#eventConfirmationForm").on("submit", function (e) {
        e.preventDefault();
        $("#captchaConfirmSubmit").attr("disabled", true);

        let event = $("#addEventType").val();
        if (!event) return;
        let captcha = grecaptcha.getResponse();

        let username = $("#mcUsername").val();


        $.ajax({
            method: "POST",
            url: "https://hypixel-api.inventivetalent.org/api/skyblock/volcano/addEvent",
            data: {
                type: event,
                captcha: captcha,
                username: username,
                ipv4: ipv4,
                ipv6: ipv6
            }
        }).done(function () {
            $("#confirmationModal").modal("close");

            refreshEstimate();

            grecaptcha.reset();
        })
    });


    // $("#tenMinNotificationSwitch").prop("checked", localStorage.getItem("tenMinNotification") === "true" && Notification.permission === "granted");
    // $("#tenMinNotificationSwitch").change(function () {
    //     let checked = $(this).is(":checked");
    //     if (checked) {
    //         Notification.requestPermission().then(function (result) {
    //             console.log(result);
    //             localStorage.setItem("tenMinNotification", "true");
    //         });
    //     } else {
    //         localStorage.setItem("tenMinNotification", "false");
    //     }
    // });


    // $("#fiveMinNotificationSwitch").prop("checked", localStorage.getItem("fiveMinNotification") === "true" && Notification.permission === "granted");
    // $("#fiveMinNotificationSwitch").change(function () {
    //     let checked = $(this).is(":checked");
    //     if (checked) {
    //         Notification.requestPermission().then(function (result) {
    //             console.log(result);
    //             localStorage.setItem("fiveMinNotification", "true");
    //         });
    //     } else {
    //         localStorage.setItem("fiveMinNotification", "false");
    //     }
    // });

    // OneSignal.push(["getNotificationPermission", function (permission) {
    //     console.log("OnePush Site Notification Permission:", permission);
    //     onePushNotificationsGranted = permission === "granted";
    // }]);
    // $("#pushNotificationSwitch").change(function () {
    //     let checked = $(this).is(":checked");
    //     if (checked) {
    //         OneSignal.push(function () {
    //             OneSignal.showNativePrompt();
    //             localStorage.setItem("pushNotifications", "true");
    //         });
    //     } else {
    //         localStorage.setItem("pushNotifications", "false");
    //     }
    // });
    // OneSignal.push(function () {
    //     // Occurs when the user's subscription changes to a new value.
    //     OneSignal.on('subscriptionChange', function (isSubscribed) {
    //         console.log("The user's subscription state is now:", isSubscribed);
    //         onePushNotificationsEnabled = isSubscribed;
    //     });
    //     OneSignal.isPushNotificationsEnabled(function (isEnabled) {
    //         if (isEnabled)
    //             console.log("Push notifications are enabled!");
    //         else
    //             console.log("Push notifications are not enabled yet.");
    //
    //         onePushNotificationsEnabled = isEnabled;
    //     });
    // });

    $("#mcUsername").val(localStorage.getItem("mcUsername") || "");
    $("#mcUsername").on("change", function () {
        localStorage.setItem("mcUsername", $(this).val());
    });

    Highcharts.setOptions({
        time: {
            useUTC: false
        }
    });


    $(window).on("focus blur", function () {
        lastFocused = Date.now() / 1000;
    });

    $.getJSON("https://api.ipify.org?format=jsonp&callback=?", function (json) {
        ipv4 = json.ip;
        console.log("IPv4: " + ipv4);
    });
    $.getJSON("https://api64.ipify.org?format=jsonp&callback=?", function (json) {
        ipv6 = json.ip;
        console.log("IPv6: " + ipv6);
    });

    function showNotification(body, title) {
        if (!("Notification" in window)) {
            console.warn("Browser does not support notifications");
            return;
        }
        if (Notification.permission !== "granted") {
            console.warn("Notifications not granted");
            return;
        }


        if (onePushNotificationsEnabled && onePushNotificationsGranted) {
            console.log("OneSignal push notifications are enabled, not sending another one.");
            return;
        }

        return new Notification(title || "Volcano Reminder", {
            body: body,
            icon: "https://hypixel.inventivetalent.org/img/Magma_Cube_50px.png"
        });
    }


    function confirmAndCaptchaAdd(type, cb) {
        function checkCaptcha() {
            grecaptcha.execute('6LeaYLIUAAAAAHfC2C6GsI84CW5sJjuaZA9FERRE', {action: (type || "homepage").replace(/ /gi, "_")}).then(function (token) {
                console.log("got recaptcha token");
                reCaptchaToken = token;

                cb(true);
            });
            return true;
        }

        return checkCaptcha()
    }

    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
})
