#!/usr/bin/env bash
set -e
bundle exec jekyll build --config _config.yml,_config.test.yml
bundle exec htmlproof ./_site --verbose --only-4xx
