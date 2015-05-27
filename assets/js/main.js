---
library: jquery-2.1.3.min.js
date_format_library: jquery-dateFormat.min.js
---

{% include_relative _lib/{{page.library}} %}
{% include_relative _lib/{{page.date_format_library}} %}

$(document).ready(function() {
  var menuToggle = $('#js-mobile-menu').unbind();
  $('#js-navigation-menu').removeClass("show");

  menuToggle.on('click', function(e) {
    e.preventDefault();
    $('#js-navigation-menu').slideToggle(function(){
      if($('#js-navigation-menu').is(':hidden')) {
        $('#js-navigation-menu').removeAttr('style');
      }
    });
  });

  // Expandable comment section.
  var expanderTrigger = document.getElementById("js-expander-trigger");
  var expanderContent = document.getElementById("js-expander-content");

  $('#js-expander-trigger').click(function(){
    $(this).toggleClass("expander-hidden");

    // Create variable for request URI.
    var commentServer = "{{ site.comment_server_url }}";
    var postSlug = window.location.pathname;
    // Remove leading forward slash.
    var truncatedSlug = postSlug.substring(1, postSlug.length);
    var encodedSlug = encodeURIComponent(truncatedSlug);
    var requri = commentServer+'/api/comments/post/'+encodedSlug;

    $.getJSON(requri, function(json) {
      var outhtml = '';
      // Loop through comments.
      $.each( json.data, function( i, val ) {

        // Assign JSON data points to variables.
          var name = json.data[i].name;

          // var created = $.format.date(json.data[i].created_at, "MMM d, yyyy h:mma");
          console.log(json.data[i].created_at);
          var created = json.data[i].created_at;
          var comment = json.data[i].comment;

          // Create HTML output.
          outhtml = outhtml + '<div class="comment"><h5>'+name+' says:</h5>';
          outhtml = outhtml + '<p class="comment-date">'+created+'</p>';
          outhtml = outhtml + '<p class="comment-text">'+comment+'</p></div>';
      });
      $('#post-comments').html(outhtml);
    });

    // Output new comment.
    var form = $('form');
    var submit = $('#submit');
    var newrequri = commentServer+'/api/comments/new';

    form.on('submit', function(e) {
      // Prevent default action.
      e.preventDefault();

        var data = form.serialize();

        // Send ajax request.
        $.ajax({
            url: commentServer+'/api/comments/new',
            type: 'POST',
            dataType: 'json',
            data: data,
            beforeSend: function(){
                // Change submit button value text and disable it.
                submit.val('Submitting...').attr('disabled', 'disabled');
            },
            success: function(data){
                // Append with fadeIn, see http://stackoverflow.com/a/978731
                var item = $(data).hide().fadeIn(800);
                $('#post-comments').append('<div class="comment">'+item+'</div>');

                // Reset form and button.
                // @todo Hide the form entirely.
                // @todo Check data.success to make sure it's true, otherwise display error.
            },
            error: function(e){
                form.trigger('reset');
                submit.val('Submit').removeAttr('disabled');
                $('#post-comments').append('<div class="comment error">' + 'An error occurred. Sorry.' + '</div>');
                // @todo :shrug:
            }
        });
    });
  });
});
