module.exports = {
    zoo:{
      name: "Traveling Zoo Event",
      path: "skyblock-zoo-timer",
      image: "cat.png",
      ad: "9803173293",
      endpoint: "skyblock/zoo/estimate",
      refreshInterval: 60000,
      imageCount: 1
    },
    newyear: {
        name: "New Year's Event",
        path: "skyblock-newyear-timer",
        image: "Cake.png",
        ad: "8836152197",
        endpoint: "skyblock/newyear/estimate",
        refreshInterval: 60000,
        imageCount: 3
    },
    spookyfestival: {
        name: "Spooky Festival",
        path: "skyblock-spooky-festival-timer",
        image: "jack_o_lantern.png",
        ad: "6605372387",
        endpoint: "skyblock/spookyFestival/estimate",
        refreshInterval: 60000,
        imageCount: 3
    },
    darkauction: {
        name: "Dark Auction",
        path: "skyblock-dark-auction-timer",
        image: "auction.png",
        ad: "4893037759",
        endpoint: "skyblock/darkauction/estimate",
        refreshInterval: 60000,
        imageCount: 5
    },
    winter: {
        name: "Season Of Jerry",
        path: "skyblock-winter-timer",
        image: "Snowball.png",
        ad: "1028315874",
        endpoint: "skyblock/winter/estimate",
        refreshInterval: 60000,
        imageCount: 3
    },
    jerryWorkshop: {
        name: "Jerry's Workshop",
        path: "skyblock-jerry-workshop-timer",
        image: "jerry_santa.png",
        ad: "7360363858",
        endpoint: "skyblock/jerryWorkshop/estimate",
        refreshInterval: 60000,
        imageCount: 1,
        timerTextPre: "%%name%% will open in about",
        timerTextActive: "%%name%% is currently",
        timerTextActiveValue: "OPEN",
        timerTextEnd: "It will close in about"
    },
    interest: {
        name: "Bank Interest",
        path: "skyblock-bank-interest-timer",
        image: "gold_bag.png",
        ad: "4388165947",
        endpoint: "skyblock/bank/interest/estimate",
        refreshInterval: 60000,
        timerTextPre: "You will receive interest in about",
        timerTextActive: "You should receive interest",
        timerTextActiveValue: "NOW",
        imageCount: 3
    },
};
