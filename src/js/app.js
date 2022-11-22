App = {
  web3Provider: null,
  loading: false,
  contracts: {},
  account: null,
  accountBalance: null,
  testToken: null,
  testTokenSale: null,
  tokenPriceInWei: null,
  tokenPriceInETH: null,
  tokensSold: null,
  tokensAvailable: 750000,

  init: function () {
    App.initWeb3();
  },

  initWeb3: async function () {
    if (typeof web3 == "undefined") {
      console.error("Web 3 is not injected via MetaMask");
      //   App.web3Provider = new Web3.providers.WebsocketProvider(
      //     "HTTP://127.0.0.1:7545"
      //   );
      //   web3 = new Web3(App.web3Provider);
    } else {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    }
    App.initContracts();
  },

  initContracts: function () {
    $.getJSON("TestTokenSale.json", async function (tokenSale) {
      App.contracts.TestTokenSale = TruffleContract(tokenSale);
      App.contracts.TestTokenSale.setProvider(App.web3Provider);
      App.testTokenSale = await App.contracts.TestTokenSale.deployed();
    }).done(function () {
      $.getJSON("TestToken.json", async function (token) {
        App.contracts.TestToken = TruffleContract(token);
        App.contracts.TestToken.setProvider(App.web3Provider);
        App.testToken = await App.contracts.TestToken.deployed();
        App.listenForEvents(App.contracts.TestTokenSale);
        App.render();
      });
    });
  },

  render: async function () {
    if (App.loading) return;
    App.activateLoadingStatus();

    // Load account data.
    App.account = await web3.eth.getCoinbase();
    $("#accountAddress").html("Your Account: " + App.account);

    // Load account balance
    let accountBalanceObject = await App.testToken.balanceOf(App.account);
    App.accountBalance = accountBalanceObject.toNumber();
    $(".account-balance").html(App.accountBalance);

    // Get token price in Wei and ETH
    let tokenPriceObject = await App.testTokenSale.tokenPrice();
    App.tokenPriceInWei = tokenPriceObject.toNumber();
    App.tokenPriceInETH = web3.utils.fromWei(
      App.tokenPriceInWei.toString(),
      "ether"
    );
    $(".token-price").html(App.tokenPriceInETH);

    // Get sold and available tokens numbers
    let tokensSoldObject = await App.testTokenSale.tokensSold();
    App.tokensSold = tokensSoldObject.toNumber();
    $(".tokens-sold").html(App.tokensSold);
    $(".tokens-available").html(App.tokensAvailable);

    // Calculate the percentage
    let progressPercentage = (App.tokensSold / App.tokensAvailable) * 100;
    $("#progressBar").css("width", progressPercentage + "%");

    // Update loading state
    App.finishLoadingStatus();
  },

  buyTokens: async function () {
    App.activateLoadingStatus();

    let numberOfTokens = $("#numberOfTokens").val();
    try {
      console.log(numberOfTokens, App.tokenPriceInWei);
      let receipt = await App.testTokenSale.buyTokens(numberOfTokens, {
        from: App.account,
        value: numberOfTokens * App.tokenPriceInWei,
        gas: 500000, // TODO: make it dynamic
      });
      console.log("buy operation succeeded");
      $("form").trigger("reset");
      // wait for sell event
    } catch (error) {
      console.error(error);
    }
  },
  activateLoadingStatus: function () {
    App.loading = true;
    $("#loader").show();
    $("#content").hide();
  },
  finishLoadingStatus: function () {
    App.loading = false;
    $("#loader").hide();
    $("#content").show();
  },
  listenForEvents: async function (testTokenSale) {
    // let sellEvent = await App.testTokenSale.Sell(
    //   {},
    //   {
    //     fromBlock: 0,
    //     toBlock: "latest",
    //   }
    // );

    // let eventProxy = new Proxy(sellEvent, {
    //   set: function (target, key, value) {
    //     console.log(changes[0]);
    //     console.log("event triggered", target);
    //     App.render();
    //     return true;
    //   },
    // });

    // Object.observe(listenForEvents, function (changes) {
    //   console.log(changes[0]);
    //   console.log("event triggered", event);
    //   App.render();
    // });

    // sellEvent.watch(function(error, event) {
    // 	console.log("event triggered", event);
    // 	App.render();
    // });

    // testTokenSale.deployed().then(function (instance) {
    //   instance
    //     .Sell(
    //       {},
    //       {
    //         fromBlock: 0,
    //         toBlock: "latest",
    //       }
    //     )
    //     .watch(function (error, event) {
    //       console.log("event triggered", event);
    //       App.render();
    //     });
    // });
  },
};

$(document).ready(function () {
  App.init();
});
