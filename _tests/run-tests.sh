#!/usr/bin/env bash
bundle exec jekyll build --config _config.yml,_config.test.yml
bundle exec scss-lint assets/styles/_scss/*.scss
bundle exec mdl . -c .mdlrc --git-recurse
bundle exec htmlproof ./_site --verbose --href-ignore "/^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?drupal\.org(?:/.*)?$/","/^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?linkedin\.com(?:/.*)?$/"
