$(window).load(function(){
  $(".option-header").on("click", function() {
    var $body = $(this).next();
    $body.toggle(200);
  });

  $(".option-item").on("click", function() {
    handleItemSelected.call(this);
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