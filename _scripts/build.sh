#!/bin/bash

# Enable error reporting to the console.
set -e

# Clone master branch into a new directory using encrypted GH_TOKEN for
# authentication.
git clone https://${GH_TOKEN}@github.com/savaslabs/savaslabs.github.io.git ../savaslabs.github.io.master

# Move to new directory and copy generated HTML site from source.
cd ../savaslabs.github.io.master
git config user.email ${GH_EMAIL}
git config user.name "savas-bot"
rm -rf *
cp -R ../savaslabs.github.io/_site/* .
ls -lah

# Switch to the master branch, keeping the copied _site directory.
git stash
git status
git checkout master
git status
git stash apply
git status

# Commit and push generated content to master branch.
git add -A .
git status
git commit -a -m "Travis #$TRAVIS_BUILD_NUMBER"
git push --quiet origin master > /dev/null 2>&1
