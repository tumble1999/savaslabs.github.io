---
---
$(document).ready(
    function() {
        // Create variable for request URI.
        var commentServer = "{{ site.comment_server_url }}";
        var postSlug = window.location.pathname;
        // Remove leading forward slash.
        var truncatedSlug = postSlug.substring(1, postSlug.length);
        var encodedSlug = encodeURIComponent(truncatedSlug);
        var requri = commentServer+'/api/comments/count';
                $.getJSON(
                    requri, function(json) {
                        if (truncatedSlug in json.data[0]) {
                            var commentString = 'comments';
                            if (json.data[0][truncatedSlug] == 1) {
                                commentString = 'comment';
                            }
                            $("#comment-count").html('<a href="#js-expander-trigger"><i class="fa fa-comment"></i>' + json.data[0][truncatedSlug] + ' ' + commentString + '</a>');
                        }
                    });
    });
