---
layout: post
title: "Sassy Drupal theming: Best practices"
date: 2015-09-03
author: Anne Tomasevich
tags: drupal drupal-planet theming sass bourbon
summary: Some lessons learned about writing clear SCSS and taking advantage of what Sass has to offer.
drupal_planet_summary: |
  TODO

---

In my previous posts we:

- [Set up a `sass` directory](/2015/08/21/sassy-drupal-theming-part-1.html) containing the Bourbon and Neat libraries and learned how to use Compass to compile our SCSS
- [Used SMACSS](/2015/08/27/sassy-drupal-theming-part-2.html) to organize our lean, modular custom SCSS

To close out this series, I've compiled some lessons learned along the way that have helped me write the most maintainable Sass possible.

<hr>

### 1. Document the crap out of everything
One criticism of Sass is that, particularly because of nesting, things can get complicated quickly and other developers may not know what's going on when you pass off your code. I like to follow these three rules:

##### Place a docblock comment in every `scss` file.
People may not be familiar with SMACSS or whatever personal version of it you're using. Docblock comments makes your files easy to navigate.

In each file, I state the purpose of the file, and include anything that may not be extremely evident. This is the docblock of a layout partial for a tricky map page:

{% highlight scss %}
/**
 * @file
 *
 * Front page layout.
 *
 * On small screens, map takes up 85% of viewport height (vh) and sidebar
 * is below. On larger screens, everything is on top of map with 100% width
 * and height.
 */
{% endhighlight %}

##### Comment on your grid layout technique.

{% highlight scss %}
// Title box: 10 columns on mobile and narrow, 6 on wide and up.
.node-title-box {
  @include span-columns(10 of 10);

  @include media ($wide) {
    @include span-columns(6 of 8);
    @include shift(1 of 8);
  }
}
{% endhighlight %}

##### Comment on anything that isn't immediately obvious.

This is as much for yourself in 6 months as it is for other developers who may someday look at your code. (I'm not the only one who forgets why I did something in the first place unless I comment it, right?)

{% highlight scss %}
// On mobile, move zoom controls up so sidebar content doesn't cover it.
@include media ($wide) {
  .leaflet-bottom {
    bottom: 15vh;
  }
}
{% endhighlight %}

<hr>

### 2. gitignore the CSS directory

Every developer (and your production environment) should be compiling SCSS into CSS locally rather than passing along a compiled CSS file and potentially running into merge conflicts. Simply add your `stylesheets` directory and `sass-cache` to your `.gitignore` file.

{% highlight text %}
# Compiled source #
path/to/theme/.sass-cache/*
paht/to/theme/stylesheets/*
{% endhighlight %}

<hr>

### 3. Variable names

One of the best things about Sass is being able to make sweeping changes with only one code edit thanks to variables.

But keeping your variables maintainable requires a little thoughtfulness when naming them. For example, let's say these are my site's color variables:
{% highlight scss %}
// Colors
$eggshell: #FFFFF9;
$taupe: #DDE0D0;
$purple: #5F1251;
$green: #709130;
$light-green: lighten($link-color, 25%);
$brown: #5C5240;
{% endhighlight %}

Cool...until the client wants to overhaul the entire color scheme. You could simply change the hex codes and have very misleading variable names, or you could change the variable names to match the new colors and be stuck doing a find and replace on all the variable names throughout your SCSS files, effectively negating the advantage gained by using Sass.

A more semantic, maintainable way: naming your variables according to their function.

{% highlight scss %}
// Colors
$element-background-color: #FFFFF9;     // Eggshell
$page-background-color: #DDE0D0;        // Taupe
$heading-color: #5F1251;                // Purple
$link-color: #709130;                   // Green
$link-hover: lighten($link-color, 25%); // Lighter green
$copytext-color: #5C5240;               // Brown
{% endhighlight %}

With this method we can change any of the colors site-wide with a single edit.

<hr>

Now get out there and write some Sass! Got a different opinion about how to apply SMACSS or how to write the best Sass possible? Let me know about it in the comments!
