const app = {
  init: () => {
    document.addEventListener(
      "DOMContentLoaded",
      console.log("Page loaded"),
      app.load()
    );
  },
  load: () => {
    app.pageIdentifier();
  },
  //watch for what page you are in and load only the necessary code for this specific page
  pageIdentifier: () => {
    const page = document.body.id;
    switch (page) {
      case "page-1":
        app.searchCoin();
        app.pagination()
        break;
      case "page-2":
        app.loadFavorites();
        app.searchCoin();
        break;
      case "page-3":
        app.getDetailedCoin();
        app.searchCoin();
        break
     
    }
  },
  //get trending coins
  coins: (page) => {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=gecko_desc&per_page=100&page=${page}&sparkline=false`;
    let req = new Request(url);
    fetch(req)
      .then((resp) => resp.json())
      .then((data) => app.basicData(data))
      .catch((err) => console.log(err));
  },
  pagination:()=>{

  // setting default page when page loads
  let page = 1
  app.coins(page)

 //when clicked,goes to the next page

 const get_next_btn = document.querySelector(".ntx-btn")
 get_next_btn.addEventListener("click",()=>{
  event.preventDefault()
   page = page + 1
   app.coins(page)

 })


 // when clicked,goes to the previus page

 const get_prev_btn = document.querySelector(".ntx-previus")
 get_prev_btn.addEventListener("click",()=>{
  event.preventDefault()


  if(page <= 1){
    console.log(page)
    return
  }
  else{
    console.log(page)
    page = page - 1
    app.coins(page)
  }
 })




  }
  ,
  basicData: (data) => {
    console.log("i was here")
    app.coins_contructor(data, ".coins-items");
    app.addNewFavoriteItem(data);
  },
  searchCoin: () => {
    const getQueryCoin = () => {
      const search_bar = document.querySelector(".search-bar-el");
      const searchButton = document.querySelector(".search-btn")
      const close_btn = document.querySelector(".fa-rectangle-xmark")
      const coins_query_container = document.querySelector(".search-container")
      const coins_query_container2 = document.querySelector(".search-container2")


      const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
  
      
     

      searchButton.addEventListener("click", () => {    
         coins_query_container.classList.add("show_container")
         coins_query_container2.classList.add("show_container")   
      });
     searchButton.addEventListener("click",()=>{
         
      letters.forEach(letter => {
        if(search_bar.value.includes(letter) === false){
          return
        }
        else{
          fetchQueryCoin(search_bar.value)
        }


      });
      
     })
     
     close_btn.addEventListener("click",()=>{
      coins_query_container.classList.remove("show_container")
      coins_query_container2.classList.remove("show_container")      
    })
      
    };
    getQueryCoin();
    
    const fetchQueryCoin = (coin_name) => {
      const url = `https://api.coingecko.com/api/v3/search?query=${coin_name}`;
      let req = new Request(url);
      fetch(req)
        .then((resp) => resp.json())
        .then((data) => app.queryCoin_constructor(data.coins))
        .catch((err) => console.log(err));
    };
  },
  queryCoin_constructor: (search_bar_coin_name) => {
    
    const html_container = document.querySelector(".coin-2");
    html_container.innerHTML = ""


    search_bar_coin_name.forEach((coin) => {
      html_container.innerHTML += `
        <div class="querycoin" data-id=${coin.id}>
                 <div class="querycoin-name" >
                  <p class="querycoin-name-clicable" data-id=${coin.id}>${coin.name}</p>  
                 </div>      
                 <div class="querycoin-image" >
                 <img src="${coin.large}" width=30px">
                 </div>   

            </div>
        `;
    });
    
  app.get_query_coin_page()

  },
  get_query_coin_page:()=>{
     const getQueryCoins = document.querySelectorAll(".querycoin")
     const arrFromCoins = Array.from(getQueryCoins)
     arrFromCoins.forEach(coin=>{
      coin.addEventListener("click",()=>{
        localStorage.setItem("selectedCoin", coin.dataset.id);
        window.location = "detailedcoin.html" })
     })
  },
  get_query_favorite_page:()=>{
    const getQueryCoins = document.querySelectorAll(".coin-name-favorite")
    const arrFromCoins = Array.from(getQueryCoins)
    arrFromCoins.forEach(coin=>{
     coin.addEventListener("click",()=>{
       localStorage.setItem("selectedCoin", coin.dataset.id);
       window.location = "detailedcoin.html" })
    })
 },
  
  coins_contructor: (coins, container) => {
    const html_container = document.querySelector(`${container}`);
    html_container.innerHTML = ""
    coins.forEach((item) => {
      html_container.innerHTML += `
      <div class="coin" data-id=${item.id}>
               <div class="coin-name" >
                <p><i class="fa-regular fa-star" data-id=${item.id}></i></p>
                <p>${item.market_cap_rank}</p>
                <img src="${item.image}" width=30px">
                <p class="coin-name-clicable" data-id=${item.id}>${
        item.name
      }</p>  
               </div>
               <div class="coin-price"><p>${Intl.NumberFormat("en-US", {
                 style: "currency",
                 currency: "USD",
               }).format(item.current_price)}</p></div>
               <div class="price-change"><p>${Intl.NumberFormat("en-US", {
                 style: "currency",
                 currency: "USD",
               }).format(item.price_change_24h)}</p></div>
               <div class="coin-high"><p>${Intl.NumberFormat("en-US", {
                 style: "currency",
                 currency: "USD",
               }).format(item.high_24h)}</p></div>
               <div class="coin-low"><p>${Intl.NumberFormat("en-US", {
                 style: "currency",
                 currency: "USD",
               }).format(item.low_24h)}</p></div>
          
          </div>
      `;
    });

  },

  addNewFavoriteItem: (data) => {
    const selected_items = JSON.parse(localStorage.getItem("coins")) || [];
    const selected_coin = document.querySelectorAll(".fa-regular");
    const arrayOfSelectedCoins = Array.from(selected_coin);
    const popup = document.querySelector(".popup-container");
    arrayOfSelectedCoins.forEach((item) => {
      item.addEventListener("click", () => {
        duplicates(item.dataset.id);
      });
    });

    const store_coins = (coins) => {
      localStorage.setItem("coins", JSON.stringify(coins));
    };
    const duplicates = (coins) => {
      const checkDuplicates = selected_items.includes(coins);

      if (checkDuplicates === true) {
        popup.innerHTML = `<div class="popup-have"> <i class="fa-regular fa-circle-xmark"></i> ${coins.toUpperCase()} is already in favorites</div>
        `;
      } else {
        popup.innerHTML = `<div class="popup-added"> <i class="fa-solid fa-check"></i> ${coins.toUpperCase()}  was added to your favorites</div>
       `;
        selected_items.push(coins);
        store_coins(selected_items);
      }
    };
    app.getCoin();
  },
  loadFavorites: () => {
    console.log("Page 2 loaded");
      
    const fetchFavorites = (selectedCoin) => {
      const url = `https://api.coingecko.com/api/v3/coins/${selectedCoin}
      `;
      let req = new Request(url);
      fetch(req)
        .then((resp) => resp.json())
        .then((data) => favoriteCoinsConstructor(data))
        .catch((err) => console.log(err));
    };

    const getSelectedFavorites = () => {
      const coins_array = JSON.parse(localStorage.getItem("coins"));

      coins_array.forEach((coin) => {
        fetchFavorites(coin);
      });
    };
    const favoriteCoinsConstructor = (coins) => {
      const html_container = document.querySelector(".coin-selected-filled");
      html_container.innerHTML += `
      <div class="coin" data-id=${coins.id}>
               <div class="coin-name" >     
               <p><i class="fa-solid fa-star" data-id=${coins.id}></i></p>
               <p>${coins.market_cap_rank}#</p>
               <p><img src="${coins.image.small}"></p>
               <p class="coin-name-favorite"data-id=${coins.id}>${coins.name} </p> 
               </div>
               <div class="coin-price"><p>${Intl.NumberFormat("en-US", {
                 style: "currency",
                 currency: "USD",
               }).format(coins.market_data.current_price.usd)}</p></div>
               <div class="price-change"><p>${Intl.NumberFormat("en-US", {
                 style: "currency",
                 currency: "USD",
               }).format(
                 coins.market_data.price_change_24h_in_currency.usd
               )}</p></div>
               <div class="coin-high"><p>${Intl.NumberFormat("en-US", {
                 style: "currency",
                 currency: "USD",
               }).format(coins.market_data.high_24h.usd)}</p></div>
               <div class="coin-low"><p>${Intl.NumberFormat("en-US", {
                 style: "currency",
                 currency: "USD",
               }).format(coins.market_data.low_24h.usd)}</p></div>
              
          </div>
      `;
    };

    const deleteFavorite = () => {
      const getAllFavStars = document.querySelectorAll(".fa-solid");
      const arrayFromFavStars = Array.from(getAllFavStars);
      console.log(arrayFromFavStars);

      arrayFromFavStars.forEach((item) => {
        item.addEventListener("click", () => {
          deleteFromLocalStorage(item.dataset.id);
          window.location = "favorites.html";
        });
      });

      const deleteFromLocalStorage = (id) => {
        const coins_array = JSON.parse(localStorage.getItem("coins"));
        coins_array.splice(coins_array.indexOf(id), 1);

        localStorage.setItem("coins", JSON.stringify(coins_array));
        app.getCoin();
      };
    };
    setTimeout(() => {
      deleteFavorite();
      app.get_query_favorite_page()

    }, 1000);

    getSelectedFavorites();
  },

  getCoin: () => {
    const coins = document.querySelectorAll(".coin-name-clicable");
    const coinsArr = Array.from(coins);

    console.log(coinsArr);

    coinsArr.forEach((coin) => {
      coin.addEventListener("click", () => {
        localStorage.setItem("selectedCoin", coin.dataset.id);
        window.location = "detailedcoin.html";
      });
    });
  },

  getDetailedCoin: () => {
    const coin = localStorage.getItem("selectedCoin");
    const url = `https://api.coingecko.com/api/v3/coins/${coin}`;
    let req = new Request(url);
    fetch(req)
      .then((resp) => resp.json())
      .then((data) => createCoinContainer(data))
      .catch((err) => console.log(err));

    const createCoinContainer = (item) => {
      const html_container = document.querySelector(".left-row");

      html_container.innerHTML = `
   <div class="item">
          
   <div class="header-item">
     <div class="update"><small><p> ${item.last_updated}</p></small></div>
     <div class="rank"><p>Rank ${item.market_cap_rank}#</p></div>
     
     <div class="image"><img src="${
       item.image.large
     }" alt="" width="70px"></div>
     <div class="name"><h3>${item.name}</h3></div>
     <div class="price-selected"><p>${Intl.NumberFormat("en-US", {
       style: "currency",
       currency: "USD",
     }).format(item.market_data.current_price.usd)}</p></div>
   
     <div class="variation"> <p>  <progress
      
       value="${item.market_data.current_price.usd}" 
        max="${item.market_data.ath.usd}"></progress></p></div>
     <div class="alltimerange">
   <p>${Intl.NumberFormat("en-US", {
     style: "currency",
     currency: "USD",
   }).format(item.market_data.current_price.usd)}</p>
  <p class="hover-text"> ATH Range <span class="ask"> ? </span>
  <span class="tooltip-text" id="fade">ATH stands for : All time high, the maximum value that the coin has reached in its life time</span>
   </p>

 
   <p>${Intl.NumberFormat("en-US", {
     style: "currency",
     currency: "USD",
   }).format(item.market_data.ath.usd)}</p>
  </div>
   <div class="body-item">
   <div class="info-item"><p>Low 24h </p><p>${Intl.NumberFormat("en-US", {
     style: "currency",
     currency: "USD",
   }).format(item.market_data.low_24h.usd)}</p></p></div>
   <div class="info-item"><p> High 24h  </p><p>${Intl.NumberFormat("en-US", {
     style: "currency",
     currency: "USD",
   }).format(item.market_data.high_24h.usd)}</p></p></div>
   
    <div class="info-item"><p>Fully diluted valuation </p><p>${Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    ).format(item.market_data.fully_diluted_valuation.usd)}</p></p></div>
    <div class="info-item"><p>Total suply </p><p>${
      item.market_data.total_supply
    }</p></div>
    <div class="info-item"><p>Circulating syply </p><p>${
      item.market_data.circulating_supply
    }</p></div>
    <div class="info-item"><p>Market cap </p><p>$${Intl.NumberFormat(
      "en-US",
      {}
    ).format(item.market_data.market_cap.usd)}</p></div>

   </div>
   <div class="footer-item">
     <div class="porcentage-variation-coin-change">
     <div class="variation-item"><p>24h</p><p>${
       item.market_data.price_change_percentage_24h
     }%</p></div>
     <div class="variation-item"><p>7d</p><p>${
       item.market_data.price_change_percentage_7d
     }%</p></div>
     <div class="variation-item"><p>14d</p><p>${
       item.market_data.price_change_percentage_14d
     }%</p></div>
     <div class="variation-item"><p>30d</p><p>${
       item.market_data.price_change_percentage_30d
     }%</p></div>
     <div class="variation-item"><p>60d</p><p>${
       item.market_data.price_change_percentage_60d
     }%</p></div>
      </div>

   </div>
   </div>
   
   `;
      changecolors();
      makeChart(item);
    };
    const changecolors = () => {
      const changeColorsVariation =
        document.querySelectorAll(".variation-item");
      const changeColorsArr = Array.from(changeColorsVariation);
      changeColorsArr.forEach((item) => {
        if (item.innerHTML.includes("-") === true) {
          item.style.color = "red";
    
        } else {
          item.style.color = "green";
        }
      });
    };
    const makeChart = (data) => {
      console.log(data);

      const ctx = document.getElementById("myChart1");

      new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Low 24h", "Current price", "High 24"],
          datasets: [
            {
              label: "24h Valuation in $",
              data: [
                data.market_data.low_24h.usd,
                data.market_data.current_price.usd,
                data.market_data.high_24h.usd,
              ],
              borderWidth: 1,
              borderColor: "rgb(75, 192, 200)",
              backgroundColor: "rgba(255, 99, 132, 0.0)",
              tension: 0.3,
            },
          ],
        },
        options: {
          scales: {
            y: {},
          },
        },
      });
      // chart 2

      const ctx2 = document.getElementById("myChart2");

      new Chart(ctx2, {
        type: "line",
        data: {
          labels: [
            "All time high price",
            "Current price",
            "All time low price",
          ],
          datasets: [
            {
              label: "Price $",
              data: [
                data.market_data.ath.usd,
                data.market_data.current_price.usd,
                data.market_data.atl.usd,
              ],
              borderWidth: 1,
              borderColor: "rgb(75, 192, 200)",
              backgroundColor: "rgba(255, 99, 132, 0.0)",
              tension: 0.3,
            },
          ],
        },
        options: {
          scales: {
            y: {},
          },
        },
      });
      //
    };
  },
};
app.init();


console.log(window.location.pathname)