// variable indicate we are fetching data from server
var isFetching = false;
var browseGames = [];

$(window).load(function(){
  $(".option-header").on("click", function() {
    var $body = $(this).next();
    if ($body.is(":visible")) {
      $body.slideUp(200);  
    } else {
      $body.slideDown(200);      
    }
  });

  $(".option-item").on("click", function() {
    handleItemSelected.call(this);
  });

  $("#search-button").on("click", function() {
    handleSearch.call(this);
  });

  $('.message .close').on('click', function() {
    $(this)
      .closest('.message')
      .transition('scale');
    ;
  });
});

function handleItemSelected() {
  var $container = $($(this).parents()[1]);
  var allowMultipleValues = $container.attr("multiple-values") !== undefined;
  if (!allowMultipleValues) {
    $container.find(".option-item").each(function(index, item) {
      $(item).removeClass("selected");
    });
    $(this).addClass("selected");
  } else {
    $(this).toggleClass("selected");
  }
}

function collectFormData() {
  var data = {};
  $(".option-container").each(function (i, container) {
    var name = $(container).attr("name");
    var values = [];
    $(container).find(".option-item.selected").each(function(ii, item) {
      var value = $(item).attr("value");
      if (value !== undefined && value != null) {
        values.push(value);
      } 
    });
    data[name] = values.join(" ");
  });
  return data;
}

function startFetching() {
  isFetching = true;
  $("#main-container").find(".card-container").remove();
  $("#main-container-loader").toggle();
}

function finishFetching() {
  isFetching = false;
  $("#main-container-loader").toggle();
}

function updateGameList(gameList) {
  var $template = $("#card-template");
  var $container = $("#main-container");
  gameList.forEach(function(game, index) {
    var $item = $template.clone();
    $item.removeAttr("id");
    $item.find(".card-image")
      .attr("src", game.image[0])
      .attr("index", index);
    $item.find(".card-name")
      .html(game.name);
    $container.append($item[0]);
  })
}

function handleSearch() {
  if (isFetching) {
    return;
  }
  var data = collectFormData();
  startFetching();
  setTimeout(function() {
    $.getJSON("https://jsonplaceholder.typicode.com/posts", data)
    .done(function(response) {
      // TODO: handle real data here
      browseGames = mockData;
      updateGameList(mockData);
    })
    .fail(function(response) {
      $("#main-container-warning").transition('scale');
    })
    .always(function() {
      finishFetching();
    });      
  }, 2000); 
  
}

var mockData = [{
  image: ["http://media-titanium.cursecdn.com/attachments/69/840/fifa_17_reus.jpg"],
  name: "FIFA 17",
  description: "FIFA 17 is a sports video game in the FIFA series, released on 27 September 2016 in North America and 29 September 2016 for the rest of the world. This is the first FIFA game in the series to use the Frostbite game engine.[2] On 21 July 2016, it was announced that, after a public vote, Marco Reus would feature on the cover of the game.[3] The demo was released on 13 September 2016. The Play First Trial was released on 22 September 2016 in Microsoft Windows's Origin Access and Xbox One's EA Access.",
  publisher: "EA Sport",
  price: "50 USD",
  platforms: ["PS", "Xbox", "Window"]
}, {
  image: ["http://www.gadgetreview.com/wp-content/uploads/2013/08/GTA-V-big.jpg"],
  name: "Grand Theft Auto",
  description: "Grand Theft Auto (officially abbreviated GTA) is an action-adventure video game series created by David Jones and Mike Dailly;[2] the later titles of which were created by brothers Dan and Sam Houser, Leslie Benzies and Aaron Garbut. It is primarily developed by Rockstar North (formerly DMA Design), and published by Rockstar Games. The name of the series references the term used in the US for motor vehicle theft.",
  publisher: "Rockstar Games",
  price: "65 USD",
  platforms: ["PS", "Window"]
}, {
  image: ["https://cnet1.cbsistatic.com/img/D5BzKihICWRk4OotpApfVdoW3W0=/1600x900/2016/07/08/b23bd00c-7917-4385-b9d2-82cb1aaa708a/pokemon-go-logo.jpg"],
  name: "Pokémon Go",
  description: "Pokémon Go (stylized Pokémon GO) is a free-to-play, location-based augmented reality game developed by Niantic for iOS and Android devices. The game was the result of a collaboration between Niantic and Nintendo, by way of The Pokémon Company, and was initially released in selected countries in July 2016. In the game, players use a mobile device's GPS ability to locate, capture, battle, and train virtual creatures, called Pokémon, who appear on the screen as if they were in the same real-world location as the player. The game supports in-app purchases for additional in-game items.",
  publisher: "Niantic",
  price: "Free",
  platforms: ["iOS, Android"]
}, {
  image: ["http://media-titanium.cursecdn.com/attachments/69/840/fifa_17_reus.jpg"],
  name: "FIFA 17",
  description: "FIFA 17 is a sports video game in the FIFA series, released on 27 September 2016 in North America and 29 September 2016 for the rest of the world. This is the first FIFA game in the series to use the Frostbite game engine.[2] On 21 July 2016, it was announced that, after a public vote, Marco Reus would feature on the cover of the game.[3] The demo was released on 13 September 2016. The Play First Trial was released on 22 September 2016 in Microsoft Windows's Origin Access and Xbox One's EA Access.",
  publisher: "EA Sport",
  price: "50 USD",
  platforms: ["PS", "Xbox", "Window"]
}, {
  image: ["http://www.gadgetreview.com/wp-content/uploads/2013/08/GTA-V-big.jpg"],
  name: "Grand Theft Auto",
  description: "Grand Theft Auto (officially abbreviated GTA) is an action-adventure video game series created by David Jones and Mike Dailly;[2] the later titles of which were created by brothers Dan and Sam Houser, Leslie Benzies and Aaron Garbut. It is primarily developed by Rockstar North (formerly DMA Design), and published by Rockstar Games. The name of the series references the term used in the US for motor vehicle theft.",
  publisher: "Rockstar Games",
  price: "65 USD",
  platforms: ["PS", "Window"]
}, {
  image: ["https://cnet1.cbsistatic.com/img/D5BzKihICWRk4OotpApfVdoW3W0=/1600x900/2016/07/08/b23bd00c-7917-4385-b9d2-82cb1aaa708a/pokemon-go-logo.jpg"],
  name: "Pokémon Go",
  description: "Pokémon Go (stylized Pokémon GO) is a free-to-play, location-based augmented reality game developed by Niantic for iOS and Android devices. The game was the result of a collaboration between Niantic and Nintendo, by way of The Pokémon Company, and was initially released in selected countries in July 2016. In the game, players use a mobile device's GPS ability to locate, capture, battle, and train virtual creatures, called Pokémon, who appear on the screen as if they were in the same real-world location as the player. The game supports in-app purchases for additional in-game items.",
  publisher: "Niantic",
  price: "Free",
  platforms: ["iOS, Android"]
}, {
  image: ["http://media-titanium.cursecdn.com/attachments/69/840/fifa_17_reus.jpg"],
  name: "FIFA 17",
  description: "FIFA 17 is a sports video game in the FIFA series, released on 27 September 2016 in North America and 29 September 2016 for the rest of the world. This is the first FIFA game in the series to use the Frostbite game engine.[2] On 21 July 2016, it was announced that, after a public vote, Marco Reus would feature on the cover of the game.[3] The demo was released on 13 September 2016. The Play First Trial was released on 22 September 2016 in Microsoft Windows's Origin Access and Xbox One's EA Access.",
  publisher: "EA Sport",
  price: "50 USD",
  platforms: ["PS", "Xbox", "Window"]
}, {
  image: ["http://www.gadgetreview.com/wp-content/uploads/2013/08/GTA-V-big.jpg"],
  name: "Grand Theft Auto",
  description: "Grand Theft Auto (officially abbreviated GTA) is an action-adventure video game series created by David Jones and Mike Dailly;[2] the later titles of which were created by brothers Dan and Sam Houser, Leslie Benzies and Aaron Garbut. It is primarily developed by Rockstar North (formerly DMA Design), and published by Rockstar Games. The name of the series references the term used in the US for motor vehicle theft.",
  publisher: "Rockstar Games",
  price: "65 USD",
  platforms: ["PS", "Window"]
}, {
  image: ["https://cnet1.cbsistatic.com/img/D5BzKihICWRk4OotpApfVdoW3W0=/1600x900/2016/07/08/b23bd00c-7917-4385-b9d2-82cb1aaa708a/pokemon-go-logo.jpg"],
  name: "Pokémon Go",
  description: "Pokémon Go (stylized Pokémon GO) is a free-to-play, location-based augmented reality game developed by Niantic for iOS and Android devices. The game was the result of a collaboration between Niantic and Nintendo, by way of The Pokémon Company, and was initially released in selected countries in July 2016. In the game, players use a mobile device's GPS ability to locate, capture, battle, and train virtual creatures, called Pokémon, who appear on the screen as if they were in the same real-world location as the player. The game supports in-app purchases for additional in-game items.",
  publisher: "Niantic",
  price: "Free",
  platforms: ["iOS, Android"]
}];