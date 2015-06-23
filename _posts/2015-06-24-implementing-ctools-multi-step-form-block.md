---
layout: post
title: "Implementing a CTools multi-step form in a block"
date: 2015-06-23
author: Kosta Harlan
tags: drupal
summary: Some tips on how to implement a CTools multi-step form entirely in a block.
---
There are [many wonderful guides](https://duckduckgo.com/?q=ctools+multistep+form) on how to build a CTools multi-step form in Drupal. As far as I can tell, though, all of the guides assume that the form will live on a page.

On a recent project, a client asked us to create the form using only blocks, so it could be placed on a page using Panels. It turns out this is pretty straightforward but as it's not well documented elsewhere, here's a quick guide to what you need to do.

### Update your CTools form definition

In the main CTools form definition, which looks something like this:

{% highlight php startinline=true %}
$form_info = array(
  'id' => 'quote-form',
  'ajax' => TRUE,
  'path' => 'example-form/%step',
  'show trail' => TRUE,
  'show back' => TRUE,
  'show return' => FALSE,
);
{% endhighlight %}

We need to change path to use query parameters for advancing the form. So let's change `path` to `'path' => 'example-form?step=%step'`.

### Define the block

Next, we need an implementation of `hook_block_info()` and `hook_block_view()`. `hook_block_info()` is pretty unremarkable so I'm not including it here, other than to say you should consider setting `cache` to `DRUPAL_NO_CACHE` when declaring your block. Now, on to `hook_block_view()`:

{% highlight php startinline=true %}
/**
 * Implements hook_block_view().
 */
function example_block_view($delta = '') {
  $block = array();
  switch ($delta) {
    case 'example_form':
      $block['subject'] = t('Our example form');
      $parameters = drupal_get_query_parameters();
      $next_step = empty($parameters['step']) ? 'step-one' : $parameters['step'];
      $block['content'] = example_ctools_wizard($next_step);
      break;
  }
  return $block;
}
{% endhighlight %}

Let's take a closer look at this. `drupal_get_query_parameters()` is checking to see if there's a query parameter for `step` in the current URL (e.g. `http://localhost?step=step-two`). If so, we set the `$next_step` variable to that value; if not, we default to `step-one` as the starting point for the form. We then pass in the `$next_step` variable to our `example_ctools_wizard()` function, which generates the multi-step form.

### Send the user on their way

So far, so good. But there's one problem at this stage. If we try to use the form now, we'll get errors: clicking "Continue" on the form will take you to a 404 page of `http://localhost/example-form%3Fstep%3Dstep-two` instead of `http://localhost?step=step-two`. That's because CTools runs the path we declared in `'path' => 'example-form?step=%step'` through an encoding function.

The workaround is to use our `subtask_next` callback to redirect our user where we want them to go using `drupal_goto()`:

{% highlight php startinline=true %}
/**
 * Callback executed when the 'next' button is clicked.
 */
function example_subtask_next(&$form_state) {
  $values = (array) example_get_page_cache('quote');
  example_set_page_cache('quote', array_merge($values, $form_state['values']));
  // Because we are using query parameters to advance/rewind the form, and
  // Ctools doesn't like query parameters (URL encoding fails), we'll use
  // drupal_goto() to take the user where they need to go.
  $destination = substr($form_state['redirect'][0], strlen(example-form?step='));
  drupal_goto('example-form', array('query' => array('step' => $destination)));
}
{% endhighlight %}

The first two lines are caching form values so that as the user goes back and forth between steps on the form, their data is cached. Moving on: remember how CTools is sending us to a 404 page with the encoded value of the path we want to go to? It turns out the un-encoded value is in `$form_state['redirect'][0]`, in the form of `example-form?step=step-two`.

Since we know the base path, we can use `substr()` and `strlen()` to extract the value of `step=` and then pass that along to `drupal_goto()`. `drupal_goto()` bypasses CTools' own redirection, and thus we are able to avoid the unwanted encoding of the path, and can send our user happily along their way.
