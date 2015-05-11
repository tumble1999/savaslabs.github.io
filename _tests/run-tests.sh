#!/usr/bin/env bash
set -e
bundle exec jekyll build
bundle exec htmlproof ./_site --verbose --href-ignore "/^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?drupal\.org(?:/.*)?$/","/^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?linkedin\.com(?:/.*)?$/"
bundle exec scss-lint assets/styles/_scss/*.scss
