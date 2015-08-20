---
layout: post
title: "Sassy Drupal theming with Bourbon and Neat"
date: 2015-08-18
author: Anne Tomasevich
tags: drupal theming sass bourbon
summary: TODO
drupal_planet_summary: |
  TODO

---

Anyone who's talked to me for more than 15 seconds about front end development knows that I love Sass and that I'll choose to use Bourbon and Neat every time I have the opportunity to do so. Recently Savas [built a custom Drupal 8 theme](/2015/06/10/d8-theming-basics.html) using Bourbon for mixins and Neat as our grid framework. Since we were creating a theme from scratch, we took this opportunity to apply all the lessons we've learned about theming in an organized, semantic, maintainable way. We applied our favorite parts of SMACSS arthitecture and used BEM for naming CSS classes to mimic Drupal's core CSS classes, which are using BEM in Drupal 8.

In this post I'll detail our Sass architecture, our use of Bourbon and Neat, and some of the practices we consider best. These principles can be applied to any version of Drupal, or any non-Drupal site. Of course, we all have our own opinions about these things, so please feel free to take what works for you and leave the rest. And sound off about it in the [comments!](#js-expander-trigger)



### Definitions
Let's talk vocab.

##### Bourbon
A [Sass mixin library](http://bourbon.io/) by [thoughtbot, inc.](https://thoughtbot.com/) Bourbon makes sass easier and more powerful by providing extremely useful mixins, meaning you don't have to write them yourself. In particular, I enjoy using Bourbon for CSS3 mixins, which allow me to use modern CSS3 modules without having to worry about vendor prefixes.

##### Neat
A [lightweight grid framework](http://neat.bourbon.io/) written for Sass, also by thoughtbot. The best part of Neat, in my opinion, is the separation of content from layout that comes from defining layout in Sass files rather than template files. This makes your grid system easier to define, update and maintain and keeps your template files cleaner.

##### SCSS
"Sassy CSS." Early Sass, with the file extension `.sass`, used a syntax quite different from the CSS syntax we know and...well, we know. Version 3 of Sass brought SCSS, returning to the same syntax as CSS and proving easier to write for most developers. Files ending with the `.scss` extension are written in SCSS. I still call them "Sass files;" please don't be mad at me.

If you found that last paragraph terribly interesting, you should [read this](http://thesassway.com/editorial/sass-vs-scss-which-syntax-is-better).

##### Partial
An SCSS file that is not directly compiled into a CSS file, but is instead imported into another SCSS file. A partial is denoted by the underscore that begins its filename (e.g. `_base.scss`).

<hr>

### Create a Sass directory

Within the theme directory, create a directory called `sass.` In here, create the following directories:

{% highlight bash %}
# Inside the custom theme directory
sass
├── base
├── components
├── layouts
└── lib
{% endhighlight %}

<hr>

### Create a Gemfile

Next we'll install Bourbon and Neat, which are both Ruby gems. We could do a quick `gem install bourbon` then `bourbon install` to create a folder of the entire Bourbon library, but this isn't ideal if we're ever going to be sharing this code since each developer (or deployment environment) will need to have these gems installed on their machine. Enter [Bundler](http://bundler.io/), a package manager for Ruby gems. Per the documentation, we only need to do a few things:

##### 1. Install Bundler, which is a Ruby gem itself
{% highlight bash %}
$ gem install bundler
{% endhighlight %}

##### 2. Create a Gemfile in our theme directory
{% highlight bash %}
$ cd my-custom-theme
$ touch Gemfile
{% endhighlight %}

...and list out all the gems our theme requires.
{% highlight ruby %}
# Gemfile
source "https://rubygems.org"

gem 'compass'
gem 'sass'
gem 'bourbon'        # Import Bourbon mixin library.
gem 'neat'           # Import Bourbon Neat grid framework
{% endhighlight %}

Check out Bundler's [documentation](http://bundler.io/gemfile.html) to read about specifying versions within your Gemfile.

##### 3. Install all your dependencies.
{% highlight bash %}
$ bundle install
{% endhighlight %}

##### 4. Commit the Gemfile and Gemfile.lock to ensure that everyone is using the same libraries.
{% highlight bash %}
$ git add .
$ git commit -m "Add Gemfile and Gemfile.lock"
{% endhighlight %}

<hr>

### Install libraries

Now we can actually install the Bourbon and Neat libraries within our project.
{% highlight bash %}
$ cd sass/lib
$ bourbon install
$ neat install
$ git add .
$ git commit -m "Add Bourbon and Neat libraries"
{% endhighlight %}

Here's what we've got now:
{% highlight bash %}
# Inside the custom theme directory
sass
├── base
├── components
├── layouts
└── lib
    ├── bourbon
    └── neat
{% endhighlight %}

Now that we've got our libraries set up, we need to actually import them so that they're compiled into CSS.

<hr>

### Set up `styles.scss`

Create `styles.scss` in the `scss` directory. Inside `styles.scss`, we'll import all our SCSS partials. View a working example of this [here](https://github.com/savaslabs/durham-civil-rights-map/blob/master/docroot/themes/custom/mappy/sass/styles.scss). I generally organize the imports in this manner:

{% highlight scss %}
/**
 * @file
 * Styles are organized using the SMACSS technique. @see http://smacss.com/book/
 */

/* Import Sass mixins, variables, Compass modules, Bourbon and Neat, etc. */
@import "init";
@import "base/variables";

/* HTML element (SMACSS base) rules */
@import "base/normalize";
@import "base/base";

/* Layout rules */
// Import all layout files.

/* Component rules (called 'modules' in SMACSS) */
// Import all component files.
{% endhighlight %}

We haven't created any of these partials yet, but we will.

Some people may want to use [Sass globbing](https://github.com/chriseppstein/sass-globbing) here for brevity's sake. I prefer not to as I find the file to be more readable without it.

When you compile your Sass (which I do using [Compass](http://compass-style.org/help/)), a `CSS` directory will be created within your theme folder containing the file `styles.css`.

Making progress!
{% highlight bash %}
# Inside the custom theme directory
sass
├── base
├── components
├── layouts
├── lib
│   ├── bourbon
│   └── neat
└── styles.scss
{% endhighlight %}

<hr>

### Set up _init.scss

Within the `sass` directory, create a file called `_init.scss.`

In `_init.scss` we will (in this order):

1. Import Bourbon (the mixin library) and Neat Helpers (Neat's settings and functions)
2. Set some overrides
3. Import Neat itself
4. Import fonts

You can view an example of a full `_init.scss` file [here](https://github.com/savaslabs/durham-civil-rights-map/blob/master/docroot/themes/custom/mappy/sass/_init.scss), but I'll go through some of the highlights.

##### 1. Import `bourbon.scss` and `neat-helpers.scss`

First we import all of Bourbon and Neat's settings and functions, which are included in `neat-helpers.scss`.

{% highlight scss %}
// Import variables and mixins to be used (Bourbon).
@import "lib/bourbon/bourbon";
@import "lib/neat/neat-helpers";
{% endhighlight %}

##### 2. Create overrides

Now we'll override some of Neat's settings and create our breakpoints.

The visual grid is extremely helpful during development and makes creating your layout much easier. We set the total number of columns (12 is the default, actually) and our default font size and max-width. We use Neat's `new-breakpoint()` function to easily create breakpoints, and we could even customize how many columns the layout has at each screen size if we wanted to.

{% highlight scss %}
// Turn on Neat's visual grid for development.
$visual-grid:       true;
$visual-grid-color: #EEEEEE;

// Set to false if you'd like to remove the responsiveness.
$responsive:    true;

// Set number of columns.
$grid-columns:  12;

// We set the max width of the page using the px to em function in Bourbon.
// The first value is the pixel value of the width and the second is the base font size of your theme.
$font-size:     16px;
$max-width-px:  2000px;
$max-width:     em($max-width-px, $font-size);

// Define breakpoints.
// The last argument is the number of columns the grid will have for that screen size.
// We've kept them all equal here.
$mobile:   new-breakpoint(min-width em(320px, $font-size) $grid-columns);
$narrow:   new-breakpoint(min-width em(560px, $font-size) $grid-columns);
$wide:     new-breakpoint(min-width em(851px, $font-size) $grid-columns);
$horizontal-bar-mode: new-breakpoint(min-width em(950px, $font-size) $grid-columns);
{% endhighlight %}

##### 3. Import Neat

Now that we've completed our settings, we'll import the entire Neat library and our overrides will apply and cause the grid to function the way we want it to.

{% highlight scss %}
// Import grid to be used (Bourbon Neat) now that we've set our overrides.
@import "lib/neat/neat";
{% endhighlight %}

##### 4. Import fonts

I like to include my fonts in this file to be consistent about how I'm importing my libraries (e.g. the Font Awesome library, which I've included in `sass/lib`. Some people would probably move this into a `_typography.scss` file or something similar, perhaps residing in the `base` directory. Do what feels right!

{% highlight scss %}
// Fonts -----------------------------------------------------------------------

// Noto Serif (headings)
@import url(http://fonts.googleapis.com/css?family=Noto+Serif:400,700);

// Open Sans (copytext)
@import url(http://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,700,400);

// Font Awesome (icons)
@import 'lib/font-awesome/font-awesome';
{% endhighlight %}

Here we are now:
{% highlight bash %}
# Inside the custom theme directory
sass
├── _init.scss
├── base
├── components
├── layouts
├── lib
│   ├── bourbon
│   ├── font-awesome
│   └── neat
└── styles.scss
{% endhighlight %}

<hr>

### Drupal-flavored SMACSS

At this point we're ready to start styling. Let's take a look at the three folders that will hold our custom `.scss` files. These are loosely based on [SMACSS](https://smacss.com/). Acquia has a [decent writeup](https://dev.acquia.com/blog/organize-your-styles-introduction-smacss) of how SMACSS principles can be applied to Drupal, but I like to simplify it even further.

#### Base

I personally only have three files in the `sass/base` directory. Don't forget that we already imported these three partials in `styles.scss` above.

##### `_normalize.scss`
This is simply [`normalize.css`](https://necolas.github.io/normalize.css/) renamed as `_normalize.scss` - remember that CSS is valid SCSS. Thoughtbot recomments using `normalize.css` as your CSS reset along with Neat. Regardless of which reset you use, include it in `base`.

##### `_base.scss`
This is for HTML element styles only. No layout, no classes, nothing else. In here I'll apply font styles to the body and headings, link styles to the anchor element, and possibly a few other site-wide styles.

##### `_variables.scss`
This is where I house all of my Sass variables and custom mixins. [Here's an example file.](https://github.com/savaslabs/durham-civil-rights-map/blob/master/docroot/themes/custom/mappy/sass/base/_variables.scss) I typically have sections for colors, fonts, other useful stuff like a standard border radius or spacing between elements, variables for any [Refills](http://refills.bourbon.io/) I'm using, and custom mixins.

I'd definitely recomment including `_normalize.scss` in `base` if you're using Neat, but other than that do what works for you! If you're following my method, your `sass` folder should be looking like this:

{% highlight bash %}
# Inside the custom theme directory
sass
├── _init.scss
├── base
│   ├── _base.scss
│   ├── _normalize.scss
│   └── _variables.scss
├── components
├── layouts
├── lib
│   ├── bourbon
│   ├── font-awesome
│   └── neat
└── styles.scss
{% endhighlight %}

#### Layouts

This directory holds page-wide layout styles, which means we'll be making heavy use of the Neat grid here. This is flexible, but I recommend a single `.scss` partial for each unique template file that represents an entire page. Think about what works best for your site. For the sake of our example, let's say we're creating `_front-page.scss` and `_node-page.scss`. I like to also create `_base.scss` for layout styles that apply to all pages.

Remember that these styles only apply to the page's layout! I know I find myself moving styles from the `layouts` directory to the `base` or `components` sometimes. In these partials, you should be doing a lot of grid work and spacing. This is the entirety of my `sass/layouts/_base.scss` file on the Drupal 8 site I've been linking to:

{% highlight scss %}
/**
 * @file
 *
 * Site-wide layout styles.
 */

body {
  @include outer-container();

  main {
    @include span-columns(10);
    @include shift(1);
    @include clearfix;

    h1 {
      margin-top: em($navigation-height) + $general-spacing;
    }
  }
}
{% endhighlight %}

We're almost there:
{% highlight bash %}
# Inside the custom theme directory
sass
├── _init.scss
├── base
│   ├── _base.scss
│   ├── _normalize.scss
│   └── _variables.scss
├── components
├── layouts
│   ├── _base.scss
│   ├── _front-page.scss
│   └── _node-page.scss
├── lib
│   ├── bourbon
│   ├── font-awesome
│   └── neat
└── styles.scss
{% endhighlight %}

#### Components

In SMACSS this is called "modules," but that gets a little confusing in Drupal Land. This is for applying layout and theme styles to smaller chunks of your site, which in Drupal typically means regions. Create a separate partial for each region, or if you have several distinct components within a region, consider a separate partial for each of them.

Let's say we created partials for the header, footer, and sidebar regions. At this point, our `sass` directory is looking like this:

{% highlight bash %}
# Inside the custom theme directory
sass
├── _init.scss
├── base
│   ├── _base.scss
│   ├── _normalize.scss
│   └── _variables.scss
├── components
│   └── regions
│       ├── _footer.scss
│       ├── _header.scss
│       └── _sidebar.scss
├── layouts
│   ├── _base.scss
│   ├── _front-page.scss
│   └── _node-page.scss
├── lib
│   ├── bourbon
│   ├── font-awesome
│   └── neat
└── styles.scss
{% endhighlight %}

Now we've got a nicely organized, easy to navigate Sass directory, ready to hold your styles and compile them into one beautiful CSS file!

<hr>

### (My personal) best practices

To make sure that one CSS file is indeed beautiful, I've compiled some lessons learned along the way that have helped me write the most maintainable Sass I can.

#### Document the crap out of everything
One criticism of Sass is that, particularly because of nesting, things can get complicated quickly and other developers may not know what's going on when you pass off your code. I like to follow these three rules:

##### 1. Place a docblock comment in every `scss` file.
People may not be familiar with SMACSS or whatever personal version of it you're using. Placing a docblock comment makes your files easy to navigate.

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

##### 2. Comment on your grid layout technique.

{% highlight scss %}
// Title box: 10 columns on mobile and narrow, 6 on wide and up.
.node-title-box {
  @include span-columns(10 of 10);

  @include media ($horizontal-bar-mode) {
    @include span-columns(6 of 8);
    @include shift(1 of 8);
  }
}
{% endhighlight %}

##### 3. Comment on anything that isn't immediately obvious.

This is as much for yourself in 6 months as it is for other developers who may someday look at your code. Unless I'm the only one who forgets why I did something in the first place unless I comment it.

{% highlight scss %}
// On mobile, move zoom controls up so sidebar content doesn't cover it.
@media only screen and (max-width: 851px) {
  .leaflet-bottom {
    bottom: 15vh;
  }
}
{% endhighlight %}

#### gitignore the CSS directory

Every developer (and your production environment) should be compiling SCSS into CSS on their own local machine rather than passing along a compiled CSS file and potentially running into merge conflicts. Simply add your `CSS` directory and `sass-cache` to your `.gitignore` file.

{% highlight text %}
# Compiled source #
path/to/theme/.sass-cache/*
paht/to/theme/css/*
{% endhighlight %}

#### Variable names

One of the best things about Sass is being able to make huge changes with only one code edit thanks to variables.

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

Cool...until the client wants to overhaul the entire color scheme. You could simply change the hex colors and have very misleading variable names, or you could change the variable names to match the new colors and be stuck doing a find and replace on all the variable names throughout your SCSS files, effectively negating the advantage gained by using Sass.

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
