#!/usr/bin/env bash
set -e
bundle exec jekyll build --config _config.yml,_config.test.yml
bundle exec scss-lint assets/styles/scss/*/*.scss
bundle exec mdl . -c .mdlrc --git-recurse
bundle exec rake test -f Rakefile
