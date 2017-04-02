// variable indicate we are fetching data from server
var isFetching = false;
var currentOpenedGame = null;

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

  $("#review-form").submit(onReviewFormSubmit);
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

function openGameDetail(game) {
  currentOpenedGame = game;
  $("#review-form").hide();
  var $modal = $('#card-detail-container');
  $modal.modal('show');
  $modal.find(".card-detail-image").attr("src", game.image[0]);
  $modal.find(".card-detail-description").text(game.description);
  $modal.find(".card-detail-name").text(game.name);
  // empty content and add the list detail
  var $cardDetailContentList = $modal.find(".card-detail-content-list");
  $cardDetailContentList.empty();
  var detailKeys = ["publisher", "platforms", "price", "rating"];
  detailKeys.forEach(function(key) {
    var value = game[key] || "";
    if ($.isArray(value)) {
      value = value.join(", ");
    }
    $cardDetailContentList.append(
      "<div class='card-detail-content-item'>" + 
        "<span class='card-detail-content-item-key'>" + key + "</span>" +
        "<span class='card-detail-content-item-value'>" + value + "</span>" +
      "</div>"
    )
  });
  // show game star
  var $rating = $modal.find(".card-detail-rating");
  $rating.empty();
  $rating.append(generateRating(game.rating || 0, "card-detail-rating-star rating-star"));
  // comments
  var $comments = $modal.find(".card-detail-comments")
  $comments.find(".comment").remove();
  mockComment.forEach(function(review) {
    $comments.append(generateComment(review));
  });
  // clear review form
  resetReviewForm();
}

function updateGameList(gameList) {
  var $template = $("#card-template");
  var $container = $("#main-container");
  gameList.forEach(function(game, index) {
    var $item = $template.clone();
    $item.removeAttr("id");
    $item.find(".card-image")
      .attr("src", game.image[0])
    $item.find(".card-name")
      .html(game.name);
    $item.find(".card-rating")
      .append(generateRating(game.rating || 0, "rating-star"));
    $item.on("click", function() {
      openGameDetail(game);
    });
    $container.append($item[0]);
  })
}

function handleSearch() {
  if (isFetching) {
    return;
  }
  var data = collectFormData();
  startFetching();
  $.post("/api/search", data)
    .done(function(response) {
      // TODO: handle real data here
    })
    .fail(function(response) {
      $("#main-container-warning").transition('scale');
    })
    .always(function() {
      updateGameList(mockData);
      finishFetching();
    });      
}

function generateRating(rating, classes) {
  var result = "";
  var flooredRating = Math.floor(rating);
  for (var i = flooredRating; i > 0; i--) {
    result += '<i class="star icon ' + classes + '"></i>';
  }
  let remainRating = rating - flooredRating;
  if (remainRating > 0.25 && remainRating < 0.75) {
    result += '<i class="half empty star icon ' + classes + '"></i>';
  }
  if (remainRating >= 0.75) {
    result += '<i class="star icon ' + classes + '"></i>';
  }
  return "<span>" + result + "</span>";
}

function generateComment(review) {
  var imageWidth = 500;
  var imageHeight = 500;
  var avaSize = 35;
  var margintop  =  Math.floor((Math.random() * (imageWidth-avaSize)));
  var marginleft =  Math.floor((Math.random() * (imageHeight-avaSize)));;

  return `
    <div class="comment">
      <div class="avatar" style="height:35px !important;overflow: hidden;">
        <img src="/static/images/avatar.png" style="width:` + imageWidth + `px;height:` + imageHeight + `px;
                                            margin-top:-` + margintop + `px;margin-left:-` + marginleft + `px">
      </div>
      <div class="content">
        <a class="author">` + review.author + `</a>
        <div class="metadata">
          <span class="date">Today at 5:42PM</span>
        </div>
        <br/>
        <div class="metadata">` + generateRating(review.stars, "rating-star") + `</div>
        <div class="text">` + review.comment + `</div>
      </div>
    </div>`;
}

function toggleReviewForm() {
  var $form = $("#review-form");
  if ($form.is(":visible")) {
    $form.slideUp(200);
    resetReviewForm();
  } else {
    $form.slideDown(200);      
  }
}

function reviewStarClicked(rating) {
  $(".review-stars").find(".review-star").each(function(index, star) {
    if (index <= rating - 1) {
      $(star).removeClass("empty");
    } else {
      $(star).addClass("empty");
    }
  });
  $("#review-form").find("input[name='review-stars']").val(rating);
}

function onReviewFormSubmit(event) {
  event.preventDefault();
  var $form = $("#review-form");
  var reviewName = $form.find("input[name='review-name']").val();
  var reviewComment = $form.find("textarea[name='review-comment']").val();
  var reviewRating = parseInt($form.find("input[name='review-stars']").val());
  reviewComment = reviewComment.trim();
  reviewName = reviewName.trim();
  var errors = [];
  if (reviewName.length == 0) {
    errors.push("<div> Name should not be empty. </div>");
  }
  if (reviewComment.length == 0) {
    errors.push("<div> Comment should not be empty. </div>");
  }
  if (errors.length > 0) {
    $form.find(".review-errors").show();
    $form.find(".review-errors").empty().append("<span>" + errors.join("") +  "</span>");
    return false;
  } else {
    $form.find(".review-errors").hide();
  }
  // TODO: submit form here
  return true;
}

function resetReviewForm() {
  reviewStarClicked(5);
  var $form = $("#review-form");
  $form.find("input[name='review-name']").val("");
  $form.find("textarea[name='review-comment']").val("");
  $form.find("input[name='review-stars']").val(5);
  $form.find(".review-errors").hide();
}

var mockData = [{
  image: ["http://media-titanium.cursecdn.com/attachments/69/840/fifa_17_reus.jpg"],
  name: "FIFA 17",
  description: "FIFA 17 is a sports video game in the FIFA series, released on 27 September 2016 in North America and 29 September 2016 for the rest of the world. This is the first FIFA game in the series to use the Frostbite game engine.[2] On 21 July 2016, it was announced that, after a public vote, Marco Reus would feature on the cover of the game.[3] The demo was released on 13 September 2016. The Play First Trial was released on 22 September 2016 in Microsoft Windows's Origin Access and Xbox One's EA Access.",
  publisher: "EA Sport",
  price: "50 USD",
  rating: 3.5,
  platforms: ["PS", "Xbox", "Window"]
}, {
  image: ["http://www.gadgetreview.com/wp-content/uploads/2013/08/GTA-V-big.jpg"],
  name: "Grand Theft Auto",
  description: "Grand Theft Auto (officially abbreviated GTA) is an action-adventure video game series created by David Jones and Mike Dailly;[2] the later titles of which were created by brothers Dan and Sam Houser, Leslie Benzies and Aaron Garbut. It is primarily developed by Rockstar North (formerly DMA Design), and published by Rockstar Games. The name of the series references the term used in the US for motor vehicle theft.",
  publisher: "Rockstar Games",
  price: "65 USD",
  rating: 3.5,
  platforms: ["PS", "Window"]
}, {
  image: ["https://cnet1.cbsistatic.com/img/D5BzKihICWRk4OotpApfVdoW3W0=/1600x900/2016/07/08/b23bd00c-7917-4385-b9d2-82cb1aaa708a/pokemon-go-logo.jpg"],
  name: "Pokémon Go",
  description: "Pokémon Go (stylized Pokémon GO) is a free-to-play, location-based augmented reality game developed by Niantic for iOS and Android devices. The game was the result of a collaboration between Niantic and Nintendo, by way of The Pokémon Company, and was initially released in selected countries in July 2016. In the game, players use a mobile device's GPS ability to locate, capture, battle, and train virtual creatures, called Pokémon, who appear on the screen as if they were in the same real-world location as the player. The game supports in-app purchases for additional in-game items.",
  publisher: "Niantic",
  rating: 3.5,
  price: "Free",
  platforms: ["iOS, Android"]
}, {
  image: ["http://media-titanium.cursecdn.com/attachments/69/840/fifa_17_reus.jpg"],
  name: "FIFA 17",
  description: "FIFA 17 is a sports video game in the FIFA series, released on 27 September 2016 in North America and 29 September 2016 for the rest of the world. This is the first FIFA game in the series to use the Frostbite game engine.[2] On 21 July 2016, it was announced that, after a public vote, Marco Reus would feature on the cover of the game.[3] The demo was released on 13 September 2016. The Play First Trial was released on 22 September 2016 in Microsoft Windows's Origin Access and Xbox One's EA Access.",
  publisher: "EA Sport",
  rating: 3.5,
  price: "50 USD",
  platforms: ["PS", "Xbox", "Window"]
}, {
  image: ["http://www.gadgetreview.com/wp-content/uploads/2013/08/GTA-V-big.jpg"],
  name: "Grand Theft Auto",
  description: "Grand Theft Auto (officially abbreviated GTA) is an action-adventure video game series created by David Jones and Mike Dailly;[2] the later titles of which were created by brothers Dan and Sam Houser, Leslie Benzies and Aaron Garbut. It is primarily developed by Rockstar North (formerly DMA Design), and published by Rockstar Games. The name of the series references the term used in the US for motor vehicle theft.",
  publisher: "Rockstar Games",
  rating: 2.5,
  price: "65 USD",
  platforms: ["PS", "Window"]
}, {
  image: ["https://cnet1.cbsistatic.com/img/D5BzKihICWRk4OotpApfVdoW3W0=/1600x900/2016/07/08/b23bd00c-7917-4385-b9d2-82cb1aaa708a/pokemon-go-logo.jpg"],
  name: "Pokémon Go",
  description: "Pokémon Go (stylized Pokémon GO) is a free-to-play, location-based augmented reality game developed by Niantic for iOS and Android devices. The game was the result of a collaboration between Niantic and Nintendo, by way of The Pokémon Company, and was initially released in selected countries in July 2016. In the game, players use a mobile device's GPS ability to locate, capture, battle, and train virtual creatures, called Pokémon, who appear on the screen as if they were in the same real-world location as the player. The game supports in-app purchases for additional in-game items.",
  publisher: "Niantic",
  rating: 3.5,
  price: "Free",
  platforms: ["iOS, Android"]
}, {
  image: ["http://media-titanium.cursecdn.com/attachments/69/840/fifa_17_reus.jpg"],
  name: "FIFA 17",
  description: "FIFA 17 is a sports video game in the FIFA series, released on 27 September 2016 in North America and 29 September 2016 for the rest of the world. This is the first FIFA game in the series to use the Frostbite game engine.[2] On 21 July 2016, it was announced that, after a public vote, Marco Reus would feature on the cover of the game.[3] The demo was released on 13 September 2016. The Play First Trial was released on 22 September 2016 in Microsoft Windows's Origin Access and Xbox One's EA Access.",
  publisher: "EA Sport",
  rating: 4.5,
  price: "50 USD",
  platforms: ["PS", "Xbox", "Window"]
}, {
  image: ["http://www.gadgetreview.com/wp-content/uploads/2013/08/GTA-V-big.jpg"],
  name: "Grand Theft Auto",
  description: "Grand Theft Auto (officially abbreviated GTA) is an action-adventure video game series created by David Jones and Mike Dailly;[2] the later titles of which were created by brothers Dan and Sam Houser, Leslie Benzies and Aaron Garbut. It is primarily developed by Rockstar North (formerly DMA Design), and published by Rockstar Games. The name of the series references the term used in the US for motor vehicle theft.",
  publisher: "Rockstar Games",
  rating: 3.75,
  price: "65 USD",
  platforms: ["PS", "Window"]
}, {
  image: ["https://cnet1.cbsistatic.com/img/D5BzKihICWRk4OotpApfVdoW3W0=/1600x900/2016/07/08/b23bd00c-7917-4385-b9d2-82cb1aaa708a/pokemon-go-logo.jpg"],
  name: "Pokémon Go",
  description: "Pokémon Go (stylized Pokémon GO) is a free-to-play, location-based augmented reality game developed by Niantic for iOS and Android devices. The game was the result of a collaboration between Niantic and Nintendo, by way of The Pokémon Company, and was initially released in selected countries in July 2016. In the game, players use a mobile device's GPS ability to locate, capture, battle, and train virtual creatures, called Pokémon, who appear on the screen as if they were in the same real-world location as the player. The game supports in-app purchases for additional in-game items.",
  publisher: "Niantic",
  price: "Free",
  rating: 3,
  platforms: ["iOS, Android"]
}];

var mockComment = [{"comment": "This game sucks", "stars": 1, "author": "Cristiano Ronaldo"},
                  {"comment": "I love you chiu chiu", "stars": 4, "author": "Messi"},
                  {"comment": "This game sucks", "stars": 1, "author": "Cristiano Ronaldo"},
                  {"comment": "I love you chiu chiu", "stars": 4, "author": "Messi"},
                  {"comment": "This game sucks", "stars": 1, "author": "Cristiano Ronaldo"},
                  {"comment": "I love you chiu chiu", "stars": 4, "author": "Messi"}];