$(window).load(function(){
  $('.ui.dropdown')
    .dropdown();
  $('.ui.checkbox')
    .checkbox();
  $("#new-form").form({
    name: {
      identifier: 'name',
      rules: [{
        type   : 'empty',
        prompt : 'Please enter the game\'s name'
      }]
    },
    description: {
      identifier: 'description',
      rules: [{
        type   : 'empty',
        prompt : 'Please enter the game\'s description'
      }]
    },
    genre: {
      identifier: 'genre',
      rules: [{
        type   : 'checked',
        prompt : 'Please specify at least one game genre'
      }]
    },
    mode: {
      identifier: 'mode',
      rules: [{
        type   : 'checked',
        prompt : 'Please specify at least one game mode'
      }]
    },
    platform: {
      identifier: 'platform',
      rules: [{
        type   : 'checked',
        prompt : 'Please specify at least one game support platform'
      }]
    },
    ageRange: {
      identifier: 'age-range',
      rules: [{
        type   : 'empty',
        prompt : 'Please specify the recommended age range'
      }]
    },
    difficulty: {
      identifier: 'difficulty',
      rules: [{
        type   : 'empty',
        prompt : 'Please specify the game estimated difficulty'
      }]
    }
  }, {
    onSuccess: function() {
      submitFormData();
      return false;
    },
    onFailure: function() {
      return false;
  }});
});

function submitFormData() {
}