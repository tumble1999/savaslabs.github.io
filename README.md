[![Build Status](https://travis-ci.org/savaslabs/savaslabs.github.io.svg?branch=master)](https://travis-ci.org/savaslabs/savaslabs.github.io)

This is the website for [Savas Labs](http://savaslabs.com).

The site is built using Jekyll. To run locally:

1. Clone the repo
2. `bundle install`
3. `bundle exec jekyll serve --config _config.yml,_config.test.yml,_config.dev.yml`

### Tests

To run the tests:

`$ bash _tests/run-tests.sh`

### Tags

To add a new tag, complete the following:

1. Add the tag to _data/tags.yml.
2. Add a new markdown file for the tag in news/tag. This creates a page for posts with that tag.
3. Add the tag to the front matter of your post.