const fs = require("fs");
const path = require("path");

const timers = require("../skyblock-timers");
const template = fs.readFileSync(path.join(__dirname, "..", "templates", "simple-timer.html"), "utf8");

// https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string/17606289#17606289
String.prototype.replaceAll = function (search, replacement) {
    let target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


Object.keys(timers).forEach(key => {
    console.log("Generating " + key + "...");
    let timer = timers[key];
    timer.key = key;

    if (!timer.timerTextPre)
        timer.timerTextPre = "The %%name%% Event will begin in about";
    if (!timer.timerTextActive)
        timer.timerTextActive = "The %%name%% Event is currently";
    if(!timer.timerTextActiveValue)
        timer.timerTextActiveValue = "ACTIVE";
    if(!timer.timerTextEnd)
        timer.timerTextEnd = "It will end in about";


    let html = template;

    for (let i = 0; i < 2; i++) {
        Object.keys(timer).forEach(placeholder => {
            html = html.replaceAll("%%" + placeholder + "%%", timer[placeholder]);
        });
    }

    console.log("Writing " + timer.path + "/index.html");
    fs.mkdirSync(path.join(__dirname, "..", timer.path), {recursive: true});
    fs.writeFileSync(path.join(__dirname, "..", timer.path, "index.html"), html, "utf8");
});


