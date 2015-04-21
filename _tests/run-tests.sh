#!/usr/bin/env bash
set -e
bundle exec jekyll build --config _config.yml,_config.test.yml
bundle exec htmlproof ./_site --verbose --href-ignore "/^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?drupal\.org(?:/.*)?$/"
