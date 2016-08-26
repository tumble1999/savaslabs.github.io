[![Build Status](https://travis-ci.org/savaslabs/savaslabs.github.io.svg?branch=source)](https://travis-ci.org/savaslabs/savaslabs.github.io)

This is the website for [Savas Labs](http://savaslabs.com).

The site is built using Jekyll. To run locally:

1. Make sure [Bundler](http://bundler.io) and [Jekyll](http://jekyllrb.com/docs/installation/) are installed
   * `gem install bundler`
   * `gem install jekyll`
2. Clone the repo
3. `bundle install`
4. `bundle exec jekyll serve --config _config.yml,_config.test.yml,_config.dev.yml`
 - This convenient script also captures the config files specified above: `./_scripts/jekyll.sh`

### Git workflow

Because we're using Travis to build the site and push to master, which is then
deployed by Github Pages, the master branch contains the generated `_site`
directory. The main development branch you should pull from and open pull
requests against is `source`.

### Tests

To run the tests:

`$ bash _scripts/run-tests.sh`

### Writing blog posts

#### Headings

Your post title (stored in the post's front matter) will be an H1. Your
top-level headings should be H2's (##), then H3's (###), etc.

#### Images

You can include a featured image in the front matter using the `featured_image`
and `featured_image_alt` keys. This will work for our site and for Drupal Planet.
Please try to do this for every post!

### Syntax Highlighting

Since updating to Jekyll 3.0.2 which uses Kramdown/Rouge, to use syntax
highlighting in a post you just need to use backticks (similar to GitHub or
Slack highlighting).

Special tips:

1. You can include the language name after the first set of backticks with no
space e.g. ```bash
2. The syntax block must be proceeded and followed by blank lines.
3. For php you must including an opening php tag to get proper highlighting.

### Tags

To add a new tag, complete the following:

1. Add the tag to _data/tags.yml.
2. Add a new markdown file for the tag in blog/tag. This creates a page for posts with that tag.
3. Add the tag to the front matter of your post.

### Staging site

We have a password protected [staging site](http://blabs.savasdev.com)!
Among other use cases, it can be used to share a site update with the team that
we don't yet want to make available to the public.

The staging site lives on the savasdev.com server.

If you would like to add your private repo to stage your code feel free

```bash
www@savasdev:~/blabs.savasdev.com/site$ git remote -v
origin git@bitbucket.org:illmasterc/savas-labs-website.git (fetch)
origin git@bitbucket.org:illmasterc/savas-labs-website.git (push)
upstream git@github.com:savaslabs/savaslabs.github.io.git (fetch)
upstream git@github.com:savaslabs/savaslabs.github.io.git (push)
```

The site is served from `/home/www/blabs.savasdev.com/site/_site` which can
be rebuilt by issuing `jekyll build` from within `/home/www/blabs.savasdev.com/site`