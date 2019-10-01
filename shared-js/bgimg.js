function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

$(document).ready(function () {
    let bgIndex = getRndInteger(1, bgImgCount || 10);
    $("#bgImage").css("background-image", "url(img/bg/" + bgIndex + ".jpg), url(img/bg/" + bgIndex + ".png)");
});
