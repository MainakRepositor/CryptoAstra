let coinID = location.search.slice(1);
let BASE_URL = `https://api.coingecko.com/api/v3`;
let COIN_DATA_ENDPOINT = 
`/coins/${coinID}?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false`;
let MARKET_DATA_ENDPOINT = `/global`;
let coinUrl = BASE_URL + COIN_DATA_ENDPOINT;
let marketUrl = BASE_URL + MARKET_DATA_ENDPOINT;
let trendingurl = "https://api.coingecko.com/api/v3/search/trending";

$(document).ready( () => {
  $('body').on('mouseenter mouseleave','.nav-item',function(e){
    if ($(window).width() > 750) {
      var _d=$(e.target).closest('.nav-item');_d.addClass('show');
      setTimeout(function(){
      _d[_d.is(':hover')?'addClass':'removeClass']('show');
      },1);
    }
});	
  getApiData();
  refreshMarketTableBody();
  refreshTrendBody();
});

function generateListElements(data) {
  let number = Intl.NumberFormat("en-IN");
  $('#coinList').html(""); //clears list
  $('#coinList').append(
    $('<li class="list-group-item"></li>').text("Name: " + data.name),
    $('<li class="list-group-item"></li>').html(
      `<coingecko-coin-compare-chart-widget coin-ids="${data.id}" currency="inr" height="300" locale="en" background-color="#ffffff"></coingecko-coin-compare-chart-widget>`),
   
      $('<li class="list-group-item"></li>').html(
        `<coingecko-coin-converter-widget coin-id="${data.id}" currency="inr" height="300" locale="en" background-color="#ffffff"></coingecko-coin-converter-widget>`),
        
   
  );
  
  $('#coinList2').append(
    $('<li class="list-group-item"></li>').html(
      `<coingecko-coin-market-ticker-list-widget coin-id="${data.id}" currency="inr" height="400" locale="en" background-color="#ffffff"></coingecko-coin-market-ticker-list-widget>`),
  //   $('<li class="list-group-item"></li>').text("Algorithm: " + 
  //   data.hashing_algorithm),
  //   $('<li class="list-group-item"></li>').html("HomePage: " + 
  //   data.links.homepage[0].link(data.links.homepage[0]) + "<br>"),
  // $('<li class="list-group-item"></li>').text("Algorithm: " + 
  //   data.hashing_algorithm),
  // $('<li class="list-group-item"></li>').html("Description: " + 
  //   data.description.en),
  // $('<li class="list-group-item"></li>').html("Homepage: " + 
  //   data.links.homepage[0].link(data.links.homepage[0])),
  // $('<li class="list-group-item"></li>').text("Genesis: " + data.genesis_date),
  // $('<li class="list-group-item"></li>').text("All Time High: " + "$" + 
  //   number.format(data.market_data.ath.usd)),
  // $('<li class="text-danger list-group-item"></li>').text("From ATH: " + 
  //   Number(data.market_data.ath_change_percentage.usd).toFixed(2) + "%"),
  )
  $('#priceChange').append(
    $('<tr class="content-row"></tr>').append(
      $(`<td class=' text-center ${data.market_data.price_change_percentage_24h >= 0 ? "text-success" : "text-danger"} 
      text-right'></td>`).text(Number(data.market_data.price_change_percentage_24h).toFixed(2) + "%"),
      $(`<td class='text-center ${data.market_data.price_change_percentage_7d >= 0 ? "text-success" : "text-danger"} 
      text-right'></td>`).text(Number(data.market_data.price_change_percentage_7d).toFixed(2) + "%"),
      $(`<td class='text-center ${data.market_data.price_change_percentage_14d >= 0 ? "text-success" : "text-danger"} 
      text-right'></td>`).text(Number(data.market_data.price_change_percentage_14d).toFixed(2) + "%"),
      $(`<td class='text-center ${data.market_data.price_change_percentage_30d >= 0 ? "text-success" : "text-danger"} 
      text-right'></td>`).text(Number(data.market_data.price_change_percentage_30d).toFixed(2) + "%"),
      $(`<td class='text-center ${data.market_data.price_change_percentage_200d >= 0 ? "text-success" : "text-danger"} 
      text-right'></td>`).text(Number(data.market_data.price_change_percentage_200d).toFixed(2) + "%"),
      $(`<td class='text-center ${data.market_data.price_change_percentage_1y >= 0 ? "text-success" : "text-danger"} 
      text-right'></td>`).text(Number(data.market_data.price_change_percentage_1y).toFixed(2) + "%"),
    )
  )
  $('#headn').text(data.name + " " + "Price and Market Stats")

  $('#price_name').text(data.name + " " + "Price")
  $('#price').text("₹" + " " + number.format(data.market_data.current_price.inr))

  $('#market_cap').text(data.name + " " + "Market Cap")
  $('#market_cap_price').text("₹" + " " + number.format(data.market_data.market_cap.inr / 10000000) + " " + "Crore")

  $('#trading_vol_name').text(data.name + " " + "Trading Volume")
  $('#trading_volume').text("₹" + " " + number.format(data.market_data.total_volume.inr / 10000000) + " " + "Crore")

  $('#24_n').text(data.name + " " + "24h High / 24h Low")
  $('#24h').text("₹" + " " + number.format(data.market_data.high_24h.inr) +" "+ "/" +" "+ "₹" + " " + number.format(data.market_data.low_24h.inr))

  $('#athn').text(data.name + " " + "All-Time High")
  $('#ath').append(

    $(`<p class=' ${data.market_data.ath_change_percentage.inr >= 0 ? "text-success" : "text-danger"} 
 text-left'></p>`).text("₹" + " " + number.format(data.market_data.ath.inr)+ " "+"/"+"  "+ Number(data.market_data.ath_change_percentage.inr).toFixed(2) + "%")
  )

  $('#atln').text(data.name + " " + "All-Time Low")
  $('#atl').append(

    $(`<p class=' ${data.market_data.atl_change_percentage.inr >= 0 ? "text-success" : "text-danger"} 
 text-left'></p>`).text("₹" + " " + number.format(data.market_data.atl.inr)+ " "+"/"+"  "+ Number(data.market_data.atl_change_percentage.inr).toFixed(2) + "%" + " " )
  )

  $('#market_dom_n').text(data.name + " " + "Market Cap Rank")
  $('#market_dom').text( number.format(data.market_data.market_cap_rank))

  $('#tsn').text(data.name + " " + "Total Supply")
  $('#ts').text( number.format(data.market_data.total_supply / 10000000) + " " + "Crore")

  $('#csn').text(data.name + " " + "Circulating Supply")
  $('#cs').text( number.format(data.market_data.circulating_supply / 10000000) + " " + "Crore")

  $('#han').text(data.name + " " + "Hashing Algorithm")
  $('#ha').text((data.hashing_algorithm))

  $('#btname').text(data.name + " " + "Block Time")
  $('#bt').text((data.block_time_in_minutes) + " " + "Minutes")

  $('#dtn').text("What is"+ " "+data.name + " " + "?")
  $('#desc').html(data.description.en)

  $('#athnd').text(data.name + " " + "ATH Date")
  $('#athd').text((moment(data.market_data.ath_date.inr)).format("llll") + " " + "("+ (moment(data.market_data.ath_date.inr, "YYYYMMDD")).fromNow()+ ")")

  $('#atlnd').text(data.name + " " + "ATL Date")
  $('#atld').text((moment(data.market_data.atl_date.inr)).format("llll") + " " + "("+ (moment(data.market_data.atl_date.inr, "YYYYMMDD")).fromNow()+ ")")

};
function generateTrendBody(data){
  let btc = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr"
  btcData()
  btcData2()
  btcData3()
  btcData4()
  btcData5()
  btcData6()
  function btcData() {
    return fetch(btc)
    .then (res => {
      return res.json()
    }).then(databtc => {
      return $('#trend_price').text(("The current price is" + " " + "₹" + number.format(data.coins[0].item.price_btc * databtc.bitcoin.inr) + "." + " " + "With Current Score of" +" "+ number.format(data.coins[0].item.score) + " " + "and Market Rank of" +" "+ number.format(data.coins[0].item.market_cap_rank) ));
    }).catch (err => {
      console.log(err)
    })
  }
  function btcData2() {
    return fetch(btc)
    .then (res => {
      return res.json()
    }).then(databtc => {
      return $('#trend_price_2').text(("The current price is" + " " + "₹" + number.format(data.coins[1].item.price_btc * databtc.bitcoin.inr) + "." + " " + "With Current Score of" +" "+ number.format(data.coins[1].item.score) + " " + "and Market Rank of" +" "+ number.format(data.coins[1].item.market_cap_rank) ));
    }).catch (err => {
      console.log(err)
    })
  }
  function btcData3() {
    return fetch(btc)
    .then (res => {
      return res.json()
    }).then(databtc => {
      return $('#trend_price_3').text(("The current price is" + " " + "₹" + number.format(data.coins[2].item.price_btc * databtc.bitcoin.inr) + "." + " " + "With Current Score of" +" "+ number.format(data.coins[2].item.score) + " " + "and Market Rank of" +" "+ number.format(data.coins[2].item.market_cap_rank) ));
    }).catch (err => {
      console.log(err)
    })
  }

  function btcData4() {
    return fetch(btc)
    .then (res => {
      return res.json()
    }).then(databtc => {
      return $('#trend_price_4').text(("The current price is" + " " + "₹" + number.format(data.coins[3].item.price_btc * databtc.bitcoin.inr) + "." + " " + "With Current Score of" +" "+ number.format(data.coins[3].item.score) + " " + "and Market Rank of" +" "+ number.format(data.coins[3].item.market_cap_rank) ));
    }).catch (err => {
      console.log(err)
    })
  }

  function btcData5() {
    return fetch(btc)
    .then (res => {
      return res.json()
    }).then(databtc => {
      return $('#trend_price_5').text(("The current price is" + " " + "₹" + number.format(data.coins[4].item.price_btc * databtc.bitcoin.inr) + "." + " " + "With Current Score of" +" "+ number.format(data.coins[4].item.score) + " " + "and Market Rank of" +" "+ number.format(data.coins[4].item.market_cap_rank) ));
    }).catch (err => {
      console.log(err)
    })
  }

  function btcData6() {
    return fetch(btc)
    .then (res => {
      return res.json()
    }).then(databtc => {
      return $('#trend_price_6').text(("The current price is" + " " + "₹" + number.format(data.coins[5].item.price_btc * databtc.bitcoin.inr) + "." + " " + "With Current Score of" +" "+ number.format(data.coins[5].item.score) + " " + "and Market Rank of" +" "+ number.format(data.coins[5].item.market_cap_rank) ));
    }).catch (err => {
      console.log(err)
    })
  }

  let number = Intl.NumberFormat("en-IN");

    $('#trending').text( (data.coins[0].item.name))
    $('#trend_img').append(
      `<img src="${data.coins[0].item.thumb}" width="25">`)

      $('#trending_2').text( (data.coins[1].item.name))
    $('#trend_img_2').append(
      `<img src="${data.coins[1].item.thumb}" width="25">`)

      $('#trending_3').text( (data.coins[2].item.name))
      $('#trend_img_3').append(
        `<img src="${data.coins[2].item.thumb}" width="25">`)

        $('#trending_4').text( (data.coins[3].item.name))
        $('#trend_img_4').append(
          `<img src="${data.coins[3].item.thumb}" width="25">`)

          $('#trending_5').text( (data.coins[4].item.name))
        $('#trend_img_5').append(
          `<img src="${data.coins[4].item.thumb}" width="25">`)

          $('#trending_6').text( (data.coins[5].item.name))
          $('#trend_img_6').append(
            `<img src="${data.coins[5].item.thumb}" width="25">`)

            var html = '<blockquote class="col-sm-9">';
html += '<h3 class="leada">What is cryptocurrency market cap?</h3>';
html += '<p>Market cap is one of the most popular metrics in the industry that is used to gauge the value of an asset. The market cap of a cryptocurrency is calculated based on the coins total circulating supply multiplied by the current price. For detailed examples on how the market capitalization of a coin is calculated, please view our methodology page.</p>';
html += '<h3 class="leada">How can I use market cap?</h3>';
html += '<p>As a financial metric, market cap allows you to compare the total circulating value of one cryptocurrency with another. Large cap cryptocurrencies such as Bitcoin and Ethereum have a market cap of over $10 billion. They typically consist of protocols that have demonstrated track record, and have a vibrant ecosystem of developers maintaining and enhancing the protocol, as well as building new projects on top of them. From a trading perspective, large caps would typically be hosted on more exchanges, have higher liquidity, and are less volatile when compared against other mid and small cap cryptocurrencies.</p>';
html += '<br>'
html+= 'While market cap is a simple and intuitive comparison metric, it is not a perfect point of comparison. Some cryptocurrency projects may appear to have inflated market cap through price swings and the tokenomics of their supply. As such, it is best to use this metric as a reference alongside other metrics such as trading volume, liquidity, fully diluted valuation, and fundamentals during your research process.'
html += '<h3 class="leada">What are candlesticks in crypto charts?</h3>';
html += '<p>Candlestick charts give an overview to traders on the price movement based on previous trends. The body of the candlestick shows where the price of a coin opened and closed for the particular period of time which the candlestick represents. If the candle is green in a crypto chart, it represents positive changes in price while red candle represents negative changes in price. The shadow indicates the high price and low price for the period.</p>';

html += '</blockquote>'

$( "#test" ).append( html );
  
}

function getApiData() {
  fetch(coinUrl)
    .then(res => {
      res.json().then(res => {
        generateListElements(res);
      })
    })
    .catch(err => {
      console.log(err);
    });
};

function generateMarketTableBody(data) {
  let number = Intl.NumberFormat("en-US");
  $('#coinSpan').text(data.data.active_cryptocurrencies);
  $('#exchangesSpan').text(data.data.markets);
  $('#totalMarketCapSpan').text("$" + number.format(data.data.total_market_cap.usd.toFixed(0)));
  $('#totalMarketCapSpanPercent').addClass(`${data.market_cap_change_percentage_24h_usd >= 0 ?
     "text-success" : "text-danger"}`);
  $('#totalMarketCapSpanPercent').text(" " + (data.data.market_cap_change_percentage_24h_usd).toFixed(2) + "%");
  $('#_24hVolSpan').text("$" + number.format(data.data.total_volume.usd.toFixed(0)));
  $('#btcSpan').text("BTC " + Number(data.data.market_cap_percentage.btc).toFixed(1) +"%");
  $('#ethSpan').text(" | ETH " + Number(data.data.market_cap_percentage.eth).toFixed(1) +"%");
};

function getMarketData() {
  return fetch(marketUrl)
    .then(res => {
      return res.json();
    }).then(data => {
        return data;
      }).catch(err => {
      console.log(err);
        });
};

function getTrendData() {
  return fetch(trendingurl)
    .then(res => {
      return res.json();
    }).then(data => {
      console.log(data)
        return data;
      }).catch(err => {
      console.log(err);
        });
};
async function refreshMarketTableBody() {
  generateMarketTableBody(await getMarketData());
};

async function refreshTrendBody() {
  generateTrendBody(await getTrendData());
}
