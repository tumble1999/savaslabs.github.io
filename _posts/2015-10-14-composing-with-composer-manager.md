---
layout: post
title: "Composing with Composer Manager"
date: 2015-10-14
author: Dan Murphy
tags: drupal composer module development
summary: Using composer manager to manage a custom module's dependencies.

---
We at Savas love [Composer](https://getcomposer.org/) and use it with many of our projects to help manage our automated testing dependencies. But recently, one of our projects required a custom module that depended on a PHP package that expected to be installed via Composer. 

While we were excited that we could use Composer to easily install the dependency, we hadn't used Composer to manage dependencies within a Drupal module before, and this requirement raised a new concern: What if more than one module requires the same package? In that scenario, how do we avoid duplicate code, and more seriously, how do we avoid version conflicts?

Luckily for us, [Composer Manager](https://www.drupal.org/project/composer_manager) thought this through and was there to address the problem.

Just to take a quick step back, [Composer](https://getcomposer.org/) is a package manager for PHP. If you want to go further down the rabbit hole ["a package is a namespace that organizes a set of related classes and interfaces”](https://docs.oracle.com/javase/tutorial/java/concepts/package.html.)

Basically, Composer allows you to manage dependencies on a per project basis. Those dependencies live within the project directory so that everything is encapsulated there.  And since you can specify package versions, different projects on your systems can depend on different versions. Composer also pulls in the dependencies of your project's dependencies, keeping you out of ['dependency hell'](https://en.wikipedia.org/wiki/Dependency_hell). You simply specify your projects dependencies in a `composer.json` file, then pull in all of your project's dependencies into a `/vendor` directory on the command line via `composer install`. (You can also update your dependencies via `composer update`).

As I stated previously though, things get a little more complex when Drupal modules start specifying dependencies. And that's where Composer Manager steps in.

[Composer Manager](https://www.drupal.org/project/composer_manager) is a Drupal contributed modules with releases for Drupal 6, 7, and 8.  From the project description:

```Composer Manager allows each contributed module to ship with its own composer.json file, listing the module-specific requirements. It then merges the requirements of all found modules into the consolidated composer.json file, consumed by composer install/update. This results in a single vendor directory shared across all modules which prevents code duplication and version mismatches.```

This module addressed our concerns in an easy and well thought out way. And while the module provides excellent documentation, I'll briefly describe some of the features:

The consolidated `composer.json` is created at `sites/default/files/composer/composer.json` by default. Meanwhile, the dependencies are installed to `sites/all/vendor` by default. Both of these locations are configurable and can easily be changed.

By default, if a module includes a `composer.json` file and is enabled or disabled via Drush, then Composer Manager automatically adds or removes the module's dependencies to/from the consolidated `composer.json` file, and installs and updates the required dependencies in the `vendor` directory.

You can also use Drush to manually update the consolidated `composer.json` file via `drush composer-json-rebuild`, and manually install or update dependencies via `drush composer-manager [COMMAND] [OPTIONS]`. For example `drush composer-manager update`.

We at Savas love any tool or module that makes our development easier, and [Composer Manager](https://www.drupal.org/project/composer_manager) fits that bill. As Drupal modules start making more and more use of libraries from the greater PHP community, we expect to be using Composer Manager on more and more projects.