---
library: jquery-2.1.3.min.js
---

{% include_relative _lib/{{page.library}} %}

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
    var truncatedSlug = postSlug.substring(1, postSlug.length)
    var encodedSlug = encodeURIComponent(truncatedSlug);
    var requri = commentServer+'/api/comments/post/'+encodedSlug;

    $.getJSON(requri, function(json) {
      var outhtml = '';
      // Loop through comments.
      $.each( json.data, function( i, val ) {

        // Assign JSON data points to variables.
        var name = json.data[i].name;
        var created = json.data[i].created_at;
        var comment = json.data[i].comment;

        // Create HTML output.
        outhtml = outhtml + '<div class="comment"><h5>'+name+'</h5>';
        outhtml = outhtml + '<p>'+created+'</p>';
        outhtml = outhtml + '<p>'+comment+'</p></div>';
      });
      $('#post-comments').html(outhtml);
    });
  });
});
