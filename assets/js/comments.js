---
---

$(document).ready(
    function() {

        // Expandable comment section.
        var expanderTrigger = document.getElementById("js-expander-trigger");
        var expanderContent = document.getElementById("js-expander-content");

        $('#js-expander-trigger').click(
            function(){
                $(this).toggleClass("expander-hidden");

                // Create variable for request URI.
                var commentServer = "{{ site.comment_server_url }}";
                var postSlug = window.location.pathname;
                // Remove leading forward slash.
                var truncatedSlug = postSlug.substring(1, postSlug.length);
                var encodedSlug = encodeURIComponent(truncatedSlug);
                var requri = commentServer+'/api/comments/post/'+encodedSlug;

                $.getJSON(
                    requri, function(json) {
                        var outhtml = '';
                        // Loop through comments.
                        $.each(
                            json.data, function( i, val ) {

                                // Assign JSON data points to variables.
                                var name = json.data[i].name;
                                var created = json.data[i].created_at;
                                var comment = json.data[i].comment;

                                // Create HTML output.
                                outhtml = outhtml + '<div class="comment"><h5>'+name+' says:</h5>';
                                outhtml = outhtml + '<p class="comment-date">'+created+'</p>';
                                outhtml = outhtml + '<p class="comment-text">'+comment+'</p></div>';
                            }
                        );
                        $('#post-comments').html(outhtml);
                    }
                );

                // Output new comment.
                var form = $('form');
                var submit = $('#submit');
                var newrequri = commentServer+'/api/comments/new';

                form.on(
                    'submit', function(e) {
                        // Prevent default action.
                        e.preventDefault();

                        // Send ajax request.
                        $.ajax(
                            {
                                url: commentServer+'/api/comments/new',
                                type: 'POST',
                                dataType: 'json',
                                data: form.serialize(),
                                beforeSend: function(){
                                    // Change submit button value text and disable it.
                                    // submit.val('Submitting...').attr('disabled', 'disabled');
                                    $('.flash-error').remove();
                                    $('.flash-success').remove();
                                },
                                success: function(data){
                                    // Check to see if we got an error from the server.
                                    if (data.success == false) {
                                        var message = '<div class="flash-error">' + data.message + '</div>';
                                        $('#post-comments').prepend(message);
                                        return;
                                    }

                                    var name = $(data)[0].data[0].name;
                                    var created = $(data)[0].data[0].created_at;
                                    var comment = $(data)[0].data[0].comment;

                                    // Create HTML output.
                                    var thanks = '<div class="flash-success">Thanks for submitting your comment!</div>';
                                    $('#post-comments').prepend(thanks);
                                    form.trigger('reset');
                                    form.hide();

                                    // Append new comment.
                                    var outhtml = '';
                                    outhtml = outhtml + '<div class="comment new"><h5>'+name+' says:</h5>';
                                    outhtml = outhtml + '<p class="comment-date">'+created+'</p>';
                                    outhtml = outhtml + '<p class="comment-text">'+comment+'</p></div>';

                                    // Append with fadeIn, see http://stackoverflow.com/a/978731
                                    var item = $(outhtml).hide().fadeIn(800);
                                    $('#post-comments').append(item);
                                },
                                error: function(e){
                                    submit.val('Submit').removeAttr('disabled');
                                    $('#post-comments').prepend('<div class="flash-error">' + 'An error occurred. Sorry ¯\\\_(ツ)_/¯' + '</div>');
                                }
                            }
                        );
                    }
                );
            }
        );
    }
);
