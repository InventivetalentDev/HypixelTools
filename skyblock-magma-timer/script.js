$(document).ready(function () {
    function r() {
        c = Date.now();
        t++;
        var a = moment.duration(c - b.latest.spawn).asHours(), l = moment.duration(c - b.latest.death).asHours(), e = moment.duration(b.estimate - c).asMinutes(), f = moment.duration(c - b.latest.spawn).asMinutes(), g = moment.duration(c - b.latest.blaze).asMinutes(), d = moment.duration(c - b.latest.magma).asMinutes(), m = moment.duration(c - b.latest.music).asMinutes();
        $("#nextTime").text("(" + moment(b.estimate).format("MMMM Do YYYY, h:mm:ss a") + ")");
        var h = b.latest.death > b.latest.spawn,
            k = h ? b.latest.death : b.latest.spawn;
        $("#lastTrackedType").text(h ? "death" : "spawn");
        $("#lastTrackedTime").html(moment(k).fromNow() + "<br/> (" + moment(k).format("MMMM Do YYYY, h:mm:ss a") + ")" + (5 < a && 5 < l ? "<br/><i>The timer could likely be inaccurate, since server restarts etc. are not accounted for</i>" : ""));
        0 >= b.latest.death && 0 >= b.latest.spawn && $("#lastTrackedWrapper").hide();
        a = b.estimate - c;
        l = moment.utc(a).format("HH:mm:ss");
        0 < a ? ($("#time").text(l), $("#timerText").text("The Magma Boss should spawn in about"),
            $("head title", window.parent.document).text(l + " | Magma Boss Timer // Hypixel Skyblock")) : ($("#time").text("NOW"), $("#timerText").text("The Magma Boss should spawn"), $("head title", window.parent.document).text("NOW | Magma Boss Timer // Hypixel Skyblock"));
        15 < t && 0 === c % 2 && (25 < e ? $("#waveBlazeBtn").hide() : $("#waveBlazeBtn").show(), (30 > g && 5 < g || 0 === b.latest.blaze && 30 > d && 1 < d) && $("#waveBlazeBtn").attr("disabled", !0), 12E5 > c - b.latest.blaze ? ($("#waveBlazeTime").text("(" + moment(b.latest.blaze).fromNow() + ")"),
            $("#waveBlazeBtn").attr("data-tooltip", b.latestConfirmations.blaze + " Confirmations")) : ($("#waveBlazeTime").text(""), $("#waveBlazeBtn").attr("data-tooltip", "Not Confirmed")), 15 < e ? $("#waveMagmaBtn").hide() : $("#waveMagmaBtn").show(), (30 > d && 5 < d || 0 === b.latest.magma && 30 > m && 1 < m) && $("#waveMagmaBtn").attr("disabled", !0), 6E5 > c - b.latest.magma ? ($("#waveMagmaTime").text("(" + moment(b.latest.magma).fromNow() + ")"), $("#waveMagmaBtn").attr("data-tooltip", b.latestConfirmations.magma + " Confirmations")) : ($("#waveMagmaTime").text(""),
            $("#waveMagmaBtn").attr("data-tooltip", "Not Confirmed")), 5 < e ? $("#musicBtn").hide() : $("#musicBtn").show(), 30 > m && 5 < m && $("#musicBtn").attr("disabled", !0), 3E5 > c - b.latest.music ? ($("#musicTime").text("(" + moment(b.latest.music).fromNow() + ")"), $("#musicBtn").attr("data-tooltip", b.latestConfirmations.music + " Confirmations")) : ($("#musicTime").text(""), $("#musicBtn").attr("data-tooltip", "Not Confirmed")), 4 < e && 1 < f ? $("#spawnedBtn").hide() : $("#spawnedBtn").show(), 3E5 > c - b.latest.spawn ? ($("#spawnTime").text("(" +
            moment(b.latest.spawn).fromNow() + ")"), $("#spawnedBtn").attr("data-tooltip", b.latestConfirmations.spawn + " Confirmations")) : ($("#spawnTime").text(""), $("#spawnedBtn").attr("data-tooltip", "Not Confirmed")), 1 < e && 2 < f ? $("#deathBtn").hide() : $("#deathBtn").show(), 3E5 > c - b.latest.death ? ($("#deathTime").text("(" + moment(b.latest.death).fromNow() + ")"), $("#deathBtn").attr("data-tooltip", b.latestConfirmations.death + " Confirmations")) : ($("#deathTime").text(""), $("#deathBtn").attr("data-tooltip", "Not Confirmed")),
            $(".track-btn.tooltipped").tooltip({position: "left"}), $(".track-btn:visible").length ? $("#buttonNote").show() : $("#buttonNote").hide());
        e = "";
        3E5 > a ? (e = "Get ready!", "true" === localStorage.getItem("fiveMinNotification") && (n || (n = u("The Skyblock Magma Boss should spawn in less than five minutes!")))) : n = null;
        6E5 > a ? (e = "If you're not already in the Blazing Fortress, you should get going!", "true" === localStorage.getItem("tenMinNotification") && (p || n || (p = u("The Skyblock Magma Boss should spawn in less than 10 minutes!")))) :
            p = null;
        $("#suggestionMessage").text(e)
    }

    function h() {
        $.ajax("https://hypixel-api.inventivetalent.org/api/skyblock/bosstimer/magma/estimatedSpawn").done(function (a) {
            console.log(a);
            b = a;
            r();
            clearInterval(v);
            v = setInterval(r, 1E3)
        })
    }

    function w() {
        $.ajax({method: "POST", url: "https://hypixel-api.inventivetalent.org/api/skyblock/bosstimer/magma/ping", data: {lastFocused: Math.floor(x), minecraftUser: $("#mcUsername").val(), ipv4: g, ipv6: d}})
    }

    function f(a, b, c, d) {
        $("#addEventType").val(b);
        $("#confirmationModal").modal("open");
        a.attr("disabled", !0)
    }

    function y() {
        $.ajax("https://hypixel-api.inventivetalent.org/api/skyblock/bosstimer/magma/historyChart?hours=" + k).done(function (a) {
            Highcharts.chart("timelineChart", {
                chart: {zoomType: "x", type: "timeline", height: "20%", backgroundColor: "rgb(55, 40, 47)", marginLeft: 80, marginRight: 80}, xAxis: {type: "datetime", visible: !1}, yAxis: {gridLineWidth: 1, title: null, labels: {enabled: !1}}, legend: {enabled: !1}, title: {text: null}, tooltip: {
                    style: {}, formatter: function () {
                        var a = Highcharts.dateFormat("%y-%m-%d",
                            this.x), b = Highcharts.dateFormat("%H:%M:%S", this.x);
                        return '<span style="color:' + this.point.color + '">\u25cf</span> ' + this.point.name + "<br/><span>" + (a + " <b>" + b + "</b></span><br/><span>(") + (this.point.confirmations + " confirmations)</span>")
                    }, headerFormat: '<span style="color:{point.color}">\u25cf</span> {point.key}<br/>', pointFormat: "<span>{point.x:%y-%m-%d} <b>{point.x:%H:%M:%S}</b></span><br/>", footerFormat: ""
                }, series: [{dataLabels: {allowOverlap: !1}, marker: {symbol: "circle"}, data: a.chart}]
            })
        })
    }

    function u(a,
               b) {
        if ("Notification" in window) if ("granted" !== Notification.permission) console.warn("Notifications not granted"); else if (q && z) console.log("OneSignal push notifications are enabled, not sending another one."); else return new Notification(b || "Magma Boss Reminder", {
            body: a,
            icon: "https://hypixel.inventivetalent.org/img/Magma_Cube_50px.png"
        }); else console.warn("Browser does not support notifications")
    }

    $("#infoModal").modal();
    $("#timelineModal").modal({
        onOpenEnd: function () {
            y()
        }
    });
    $("#confirmationModal").modal({
        onCloseStart: function () {
            $("#addEventType").val("");
            $("#captchaConfirmSubmit").hide()
        }
    });
    $("#eventInfoModal").modal({
        onOpenEnd: function () {
            $("#blazeWaveVideo")[0].play();
            $("#magmaWaveVideo")[0].play();
            $("#magmaBossVideo")[0].play()
        }
    });
    $(".track-btn.tooltipped").tooltip({position: "left"});
    grecaptcha.ready(function () {
        console.log("recaptcha ready");
        $(".track-btn").attr("disabled", !1)
    });
    "#DEV" === window.location.hash && $("#d").text("DEV MODE ACTIVE");
    var c = (new Date).getTime(), t = 0, p, n, b = {}, v = -1, k = 4, x = c / 1E3, g = "", d = "", z = !1, q = !1;
    h();
    setInterval(h, 3E4);
    w();
    setInterval(w,
        3E4);
    $("#waveBlazeBtn").click(function () {
        var a = $(this);
        f(a, "blaze", "a blaze wave", !1)
    });
    $("#waveMagmaBtn").click(function () {
        var a = $(this);
        f(a, "magma", "a magma wave", !1)
    });
    $("#musicBtn").click(function () {
        var a = $(this);
        f(a, "music", "music", !1)
    });
    $("#spawnedBtn").click(function () {
        var a = $(this);
        f(a, "spawn", "a boss spawn", !1)
    });
    $("#deathBtn").click(function () {
        var a = $(this);
        f(a, "death", "a boss death", !0)
    });
    $("#eventConfirmationForm").on("submit", function (a) {
        a.preventDefault();
        $("#captchaConfirmSubmit").attr("disabled",
            !0);
        if (a = $("#addEventType").val()) {
            var b = grecaptcha.getResponse(), c = $("#mcUsername").val();
            $.ajax({method: "POST", url: "https://hypixel-api.inventivetalent.org/api/skyblock/bosstimer/magma/addEvent", data: {type: a, captcha: b, username: c, ipv4: g, ipv6: d}}).done(function () {
                $("#confirmationModal").modal("close");
                h()
            })
        }
    });
    $("#tenMinNotificationSwitch").prop("checked", "true" === localStorage.getItem("tenMinNotification") && "granted" === Notification.permission);
    $("#tenMinNotificationSwitch").change(function () {
        $(this).is(":checked") ?
            Notification.requestPermission().then(function (a) {
                console.log(a);
                localStorage.setItem("tenMinNotification", "true")
            }) : localStorage.setItem("tenMinNotification", "false")
    });
    $("#fiveMinNotificationSwitch").prop("checked", "true" === localStorage.getItem("fiveMinNotification") && "granted" === Notification.permission);
    $("#fiveMinNotificationSwitch").change(function () {
        $(this).is(":checked") ? Notification.requestPermission().then(function (a) {
            console.log(a);
            localStorage.setItem("fiveMinNotification", "true")
        }) : localStorage.setItem("fiveMinNotification",
            "false")
    });
    OneSignal.push(["getNotificationPermission", function (a) {
        console.log("OnePush Site Notification Permission:", a);
        z = "granted" === a
    }]);
    OneSignal.push(function () {
        OneSignal.on("subscriptionChange", function (a) {
            console.log("The user's subscription state is now:", a);
            q = a
        });
        OneSignal.isPushNotificationsEnabled(function (a) {
            a ? console.log("Push notifications are enabled!") : console.log("Push notifications are not enabled yet.");
            q = a
        })
    });
    $("#mcUsername").val(localStorage.getItem("mcUsername") || "");
    $("#mcUsername").on("change",
        function () {
            localStorage.setItem("mcUsername", $(this).val())
        });
    Highcharts.setOptions({time: {useUTC: !1}});
    $("#timelineLoadMore").click(function () {
        24 > k ? k += 2 : $(this).attr("disabled", !0);
        y()
    });
    $(window).on("focus blur", function () {
        x = Date.now() / 1E3
    });
    $.getJSON("https://api.ipify.org?format=jsonp&callback=?", function (a) {
        g = a.ip;
        console.log("IPv4: " + g)
    });
    $.getJSON("https://api6.ipify.org?format=jsonp&callback=?", function (a) {
        d = a.ip;
        console.log("IPv6: " + d)
    })
});
