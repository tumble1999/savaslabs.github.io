---
layout: post
title: "Drupal 8 Theming Basics"
date: 2015-06-10
author: Anne Tomasevich
tags: drupal8 theming sass drupal
summary: Theming in Drupal 8 means a lot of changes for current Drupalers and a lot of awesome stuff for everyone. I'll cover what's new and how to create a custom theme in Drupal 8.
---

purpose/goals behind changes
Change in base themes (classy) and theme folder location
theme.info.yml, .libraries, and .breakpoints
adding css and js
adding regions

twig
theme functions

Theming in Drupal 8 means a lot of changes for current Drupalers and a lot of awesome stuff for everyone. I'll cover what's new and how to create a custom theme in Drupal 8.

### Why all the changes?

Though the theming layer in Drupal 8 is quite different from Drupal 7 and will required some relearning, these changes come with great improvements, including:

- Fewer Drupal-specific conventions and more thoroughly-vetted, popular frameworks (such as Twig), meaning non-Drupalers can jump in much more quickly. Let’s face it - Drupal 7 theming has a major learning curve, which can keep developers from using Drupal at all. Already know Drupal and frustrated that you’re the one who has to learn new systems? Don’t worry, there are plenty of other benefits of using Drupal 8.
- Template files are more secure since they no longer contain PHP code (thanks to Twig). Sanders at [d8.sqndr.com](http://d8.sqndr.com/) offers this nice/scary example of PHP code that could be executed in a Drupal 7 template file:

{% highlight php %}
// This really shouldn’t be allowed to work, and it won’t in D8.
<?php
  db_query('DROP TABLE {users}');
?>
{% endhighlight %}

- Even more security: text is automatically escaped in Twig, meaning a lower chance of XSS attacks.
- D8 themers don’t need to know PHP to whip up a theme.
- Separation of logic from appearance, leading to more modular (reusable) code.
- Speaking of more modular code, Twig introduces [template inheritance](http://twig.sensiolabs.org/doc/templates.html#template-inheritance)
- More semantic CSS classes and far fewer uses of IDs in CSS (http://d8.sqndr.com/drupal8/changes.html). D8 is using the SMACSS system of file organization and BEM for CSS class names. There’s even a brand new base class whose purpose is to set up CSS classes (aptly named Classy, which I’ll go into later).
- A general trend towards more extendable, modular, well-organized, better-performing code. With the adoption of OOPHP, Sass, Twig, YAML, etc. (write more on this)


There are plenty of other advantages to using D8, along with new challenges and plenty of new things to learn. Generally, I think that D8 is going to be much better (need more transition material here)

### Creating a custom theme in Drupal 8
So, now that we’ve covered some reasons that D8 theming will be awesome, let’s create a custom theme using Classy as a base.

The first thing to note is the different file structure. The `core` folder now holds all the the modules and themes that ship with Drupal, and contributed and custom modules and themes are now found respectively in the `modules` and `theme` folders in the Drupal document root. (show file structure)
Let’s create a folder for our new theme. Savas is working on a Drupal 8 mapping project, so I’ll use that as an example. Our theme is called “Mappy,” so we’ve created a folder for our theme within themes/custom.

The first file we’ll want to create is [theme-name].info.yml, which replaces D7’s [theme-name].info file. I’ve created mappy.info.yml, and I’ll go through each of the lines below. If you’re new to YAML, Symfony has a nice writeup on syntax and the Collections section is particularly helpful (http://symfony.com/doc/current/components/yaml/yaml_format.html#collections)





Assets (from https://api.drupal.org/api/drupal/core!modules!system!theme.api.php/group/themeable/8)
We can distinguish between three types of assets:
Unconditional page-level assets (loaded on all pages where the theme is in use): these are defined in the theme's *.info.yml file.
Conditional page-level assets (loaded on all pages where the theme is in use and a certain condition is met): these are attached in hook_page_attachments_alter(), e.g.:
 function THEME_page_attachments_alter(array &$page) {
    if ($some_condition) {
      $page['#attached']['library'][] = 'mytheme/something';
    }
  }

Template-specific assets (loaded on all pages where a specific template is in use): these can be added by in preprocessing functions, using
 $variables['#attached']
, e.g.:
 function THEME_preprocess_menu_local_action(array &$variables) {
    // We require Modernizr's touch test for button styling.
    $variables['#attached']['library'][] = 'core/modernizr';
  }
