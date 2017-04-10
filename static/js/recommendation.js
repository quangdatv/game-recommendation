// variable indicate we are fetching data from server
var isFetching = false;
var currentOpenedGame = null;
var currentOpenedGameExtra = {like_count: 10, dislike_count: 5};

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
  $('.ui.modal').modal();
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
  // status
  // TODO: get real data + fetching data here
  updateGameDetailStatus();
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
    $item.find(".card-like-count").text(10);
    $item.find(".card-dislike-count").text(5);
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

function onReviewFormSubmit(event) {
  event.preventDefault();
  var $form = $("#review-form");
  var reviewComment = $form.find("textarea[name='review-comment']").val();
  reviewComment = reviewComment.trim();
  if (reviewComment.length == 0) {
    return false;
  } 
  // TODO: submit form here
  return true;
}

function resetReviewForm() {
  var $form = $("#review-form");
  $form.find("textarea[name='review-comment']").val("");
}

function likeButtonClicked() {
  if (!currentOpenedGameExtra) return;
  // is_like = true / false / undefined corresponding to like / dislike / none
  var likeStatus = currentOpenedGameExtra.is_liked;
  if (likeStatus === true) {
    // TODO: call unlike-api here
    currentOpenedGameExtra.is_liked = null;
    currentOpenedGameExtra.like_count -= 1;
  } else {
    // TODO: call like-api here
    currentOpenedGameExtra.is_liked = true;
    currentOpenedGameExtra.like_count += 1;
    if (likeStatus === false) currentOpenedGameExtra.dislike_count -= 1;
  }
  updateGameDetailStatus();
}

function dislikeButtonClicked() {
  if (!currentOpenedGameExtra) return;
  var likeStatus = currentOpenedGameExtra.is_liked;
  if (likeStatus === false) {
    // TODO: call undislike-api here
    currentOpenedGameExtra.is_liked = null;
    currentOpenedGameExtra.dislike_count -= 1;
  } else {
    // TODO: call dislike-api here
    currentOpenedGameExtra.is_liked = false
    currentOpenedGameExtra.dislike_count += 1;
    if (likeStatus === true) currentOpenedGameExtra.like_count -= 1
  }
  updateGameDetailStatus();
}

function updateGameDetailStatus() {
  $("#card-detail-container .card-detail-like-count").text(currentOpenedGameExtra.like_count);
  $("#card-detail-container .card-detail-dislike-count").text(currentOpenedGameExtra.dislike_count);
  $("#card-detail-container .like-button").removeClass("active").addClass("outline");
  $("#card-detail-container .dislike-button").removeClass("active").addClass("outline");
  var likeStatus = currentOpenedGameExtra.is_liked
  if (likeStatus === undefined || likeStatus === null) return;
  if (likeStatus) {
    $("#card-detail-container .like-button").addClass("active").removeClass("outline");
  } else {
    $("#card-detail-container .dislike-button").addClass("active").removeClass("outline");
  }
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

var mockComment = [{"comment": "This game sucks", "author": "Cristiano Ronaldo"},
                  {"comment": "I love you chiu chiu",  "author": "Messi"},
                  {"comment": "This game sucks",  "author": "Cristiano Ronaldo"},
                  {"comment": "I love you chiu chiu",  "author": "Messi"},
                  {"comment": "This game sucks", "author": "Cristiano Ronaldo"},
                  {"comment": "I love you chiu chiu", "author": "Messi"},
                  {"comment": "This game sucks", "author": "Cristiano Ronaldo"},
                  {"comment": "I love you chiu chiu", "author": "Messi"}];