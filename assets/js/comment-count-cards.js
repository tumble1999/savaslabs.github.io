---
---

$(document).ready(
    function() {
        var commentServer = "{{ site.comment_server_url }}";
        var requri = commentServer + '/api/comments/count';
        $.getJSON(
            requri, function(json) {

                $(".card .url").each(function(index) {
                    var truncatedSlug = $(this).attr('href').substring(1, $(this).attr('href').length);
                    if (truncatedSlug in json.data[0]) {
                        var commentString = 'comments';
                        if (json.data[0][truncatedSlug] == 1) {
                            commentString = 'comment';
                        }
                        $(this).find(".comment-count").html('<a href="' + $(this).attr('href') + '">' + json.data[0][truncatedSlug] + ' ' + commentString + '</a>');
                    }
                    else {
                        $(this).find(".comment-count").text("No comments");
                    }
                });

                }
            );
    });
