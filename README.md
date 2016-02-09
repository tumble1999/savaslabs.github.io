[![Build Status](https://travis-ci.org/savaslabs/savaslabs.github.io.svg?branch=master)](https://travis-ci.org/savaslabs/savaslabs.github.io)

This is the website for [Savas Labs](http://savaslabs.com).

The site is built using Jekyll. To run locally:

1. Make sure [Bundler](http://bundler.io) and [Jekyll](http://jekyllrb.com/docs/installation/) are installed
   * `gem install bundler`
   * `gem install jekyll`
2. Clone the repo
3. `bundle install`
4. `bundle exec jekyll serve --config _config.yml,_config.test.yml,_config.dev.yml`
 - This convenient script also captures the config files specified above: `./_scripts/jekyll.sh`

### Tests

To run the tests:

`$ bash _tests/run-tests.sh`

### Syntax Highlighting

Since updating to Jekyll 3.0.2 which uses Kramdown/Rouge, to use syntax
highlighting in a post you just need to use backticks (similar to GitHub or
Slack highlighting).

Special tips:

1. You can include the language name after the first set of backticks with no
space e.g. ```bash
2. For php you must including an opening php tag to get proper highlighting
3. The syntax block must be proceeded and followed by a space e.g.

````
```bash
$ mkdir cat_photos
```
````

### Tags

To add a new tag, complete the following:

1. Add the tag to _data/tags.yml.
2. Add a new markdown file for the tag in news/tag. This creates a page for posts with that tag.
3. Add the tag to the front matter of your post.


### Staging site

We have a password protected [staging site](http://blabs.savasdev.com)!
Among other use cases, it can be used to share a site update with the team that
we don't yet want to make available to the public.

The staging site lives on the savasdev.com server.

If you would like to add your private repo to stage your code feel free

```
www@savasdev:~/blabs.savasdev.com/site$ git remote -v
origin	git@bitbucket.org:illmasterc/savas-labs-website.git (fetch)
origin	git@bitbucket.org:illmasterc/savas-labs-website.git (push)
upstream	git@github.com:savaslabs/savaslabs.github.io.git (fetch)
upstream	git@github.com:savaslabs/savaslabs.github.io.git (push)
```

The site is served from `/home/www/blabs.savasdev.com/site/_site` which can
be rebuilt by issuing `jekyll build` from within `/home/www/blabs.savasdev.com/site`