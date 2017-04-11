var notLoginMessage = "Please sign in to use this feature!";

// variable indicate we are fetching data from server
var isFetching = false;
var currentDetailGame = null;

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

  // load the recommendation when lauching the page
  loadRecommendedGameList();
});

function handleItemSelected() {
  var $container = $($(this).parents()[1]);
  var allowMultipleValues = $container.attr("multiple-values") !== undefined;
  if (!allowMultipleValues) {
    var isCurrentSelected = $(this).hasClass("selected");
    $container.find(".option-item").each(function(index, item) {
      $(item).removeClass("selected");
    });
    if (!isCurrentSelected) {
      $(this).toggleClass("selected");
    }
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
  currentDetailGame = game;
  $("#review-form").hide();
  var $modal = $('#card-detail-container');
  $modal.modal('show');
  $modal.find(".card-detail-image").attr("src", game.image);
  $modal.find(".card-detail-description").text(game.description);
  $modal.find(".card-detail-name").text(game.name);
  // empty content and add the list detail
  var $cardDetailContentList = $modal.find(".card-detail-content-list");
  $cardDetailContentList.empty();
  var detailKeys = ["publisher", "platform", "age-range", "game-mode", "release-date", "length", "difficulty"];
  detailKeys.forEach(function(key) {
    var value = game[key] || "";
    if ($.isArray(value)) {
      value = value.join(", ");
    }
    console.log(value);
    if (!value || value.length == 0) return;
    if (key === "release-date") {
      value = new Date(value).toDateString();
    }
    $cardDetailContentList.append(
      "<div class='card-detail-content-item'>" +
        "<span class='card-detail-content-item-key'>" + key + "</span>" +
        "<span class='card-detail-content-item-value'>" + value + "</span>" +
      "</div>"
    )
  });
  // status
  updateCurrentGameStatus();
  // comments
  var loadingGameId = game.id
  $.get("/api/comments/" + loadingGameId)
    .done(function(response) {
      updateComments(loadingGameId, response.comments)
    })
  // clear review form
  resetReviewForm();
}

function updateComments(gameId, comments) {
  if (!currentDetailGame || currentDetailGame.id != gameId) return
  var $comments = $(".card-detail-comments");
  $comments.find(".comment").remove();
  comments.forEach(function(review) {
    $comments.append(generateComment(review));
  });
}

function updateGameList(gameList) {
  if (gameList.length == 0) {
    console.log("hahaha");
    $("#main-container-warning").transition('scale');
  }
  var $template = $("#card-template");
  var $container = $("#main-container");
  gameList.forEach(function(game, index) {
    var $item = $template.clone();
    $item.addClass("card-id-" + game.id);
    $item.removeAttr("id");
    $item.find(".card-image")
      .attr("src", game.image)
    $item.find(".card-name")
      .html(game.name);
    $item.find(".card-like-count").text(game.like_count);
    $item.find(".card-dislike-count").text(game.dislike_count);
    $item.on("click", function() {
      openGameDetail(game);
    });
    $container.append($item[0]);
  })
}

function loadRecommendedGameList() {
  startFetching();
  $.get("/api/recommendation")
    .done(function(response) {
      updateGameList(response.games)
    })
    .always(function() {
      finishFetching();
    });
}

function handleSearch() {
  if (isFetching) {
    return;
  }
  $('.search-result-header').show();
  $('.recommendation-header').hide();
  var data = collectFormData();
  startFetching();
  $.post("/api/search", data)
    .done(function(response) {
      updateGameList(response.games)
    })
    .fail(function(response) {
      $("#main-container-error").transition('scale');
    })
    .always(function() {
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
        <a class="author">` + review.username + `</a>
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
  if (!isLogin) {
    showErrorMessage(notLoginMessage);
    return false;
  }
  if (!currentDetailGame) return false;
  event.preventDefault();
  var $form = $("#review-form");
  var reviewComment = $form.find("textarea[name='review-comment']").val();
  reviewComment = reviewComment.trim();
  if (reviewComment.length == 0) {
    return false;
  }

  $.post("/api/make-comment/" + currentDetailGame.id, {comment: reviewComment})
    .done(function(response) {
      $(".card-detail-comments").append(generateComment(response.comment));
      toggleReviewForm();
    })
  return true;
}

function resetReviewForm() {
  var $form = $("#review-form");
  $form.find("textarea[name='review-comment']").val("");
}

function likeButtonClicked() {
  if (!isLogin) showErrorMessage(notLoginMessage);
  if (!isLogin || !currentDetailGame) return;
  // is_like = true / false / undefined corresponding to like / dislike / none
  var likeStatus = currentDetailGame.is_liked;
  if (likeStatus === true) {
    $.post("/api/unlike/" + currentDetailGame.id)
      .done(function(response) {
        currentDetailGame.is_liked = response.is_liked;
        currentDetailGame.like_count -= 1;
        updateCurrentGameStatus();
      });
  } else {
    $.post("/api/like/" + currentDetailGame.id)
      .done(function(response) {
        currentDetailGame.is_liked = response.is_liked;
        currentDetailGame.like_count += 1;
        if (likeStatus === false) currentDetailGame.dislike_count -= 1;
        updateCurrentGameStatus();
      });
  }
}

function dislikeButtonClicked() {
  if (!isLogin) showErrorMessage(notLoginMessage);  
  if (!isLogin || !currentDetailGame) return;
  var likeStatus = currentDetailGame.is_liked;
  if (likeStatus === false) {
    $.post("/api/undislike/" + currentDetailGame.id)
      .done(function(response) {
        currentDetailGame.is_liked = null;
        currentDetailGame.dislike_count -= 1;
        updateCurrentGameStatus();
      });
  } else {
    $.post("/api/dislike/" + currentDetailGame.id)
      .done(function(response) {
        currentDetailGame.is_liked = false
        currentDetailGame.dislike_count += 1;
        if (likeStatus === true) currentDetailGame.like_count -= 1
        updateCurrentGameStatus();
      });
  }
}

function updateCurrentGameStatus() {
  if (!currentDetailGame) return;
  $(".card-id-" + currentDetailGame.id + " .card-like-count").text(currentDetailGame.like_count);
  $(".card-id-" + currentDetailGame.id + " .card-dislike-count").text(currentDetailGame.dislike_count);
  $("#card-detail-container .card-detail-like-count").text(currentDetailGame.like_count);
  $("#card-detail-container .card-detail-dislike-count").text(currentDetailGame.dislike_count);
  $("#card-detail-container .like-button").removeClass("active").addClass("outline");
  $("#card-detail-container .dislike-button").removeClass("active").addClass("outline");
  var likeStatus = currentDetailGame.is_liked
  if (likeStatus === undefined || likeStatus === null) return;
  if (likeStatus) {
    $("#card-detail-container .like-button").addClass("active").removeClass("outline");
  } else {
    $("#card-detail-container .dislike-button").addClass("active").removeClass("outline");
  }
}

function showErrorMessage(message) {
  alert(message);
}
