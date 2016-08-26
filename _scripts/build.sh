#!/bin/bash

# Enable error reporting to the console.
set -e

# Clean up master branch.
pwd
git status
ls -lah
ls -lah ../savaslabs.github.io.master
git branch
rm -rf ../savaslabs.github.io.master

# Clone master branch using encrypted GH_TOKEN for authentication.
git clone https://${GH_TOKEN}@github.com/savaslabs/savaslabs.github.io.git ../savaslabs.github.io.master
git status
ls -lah ../savaslabs.github.io.master

# Copy generated HTML site to master branch.
cp -R _site/* ../savaslabs.github.io.master
git status
ls -lah ../savaslabs.github.io.master

# Commit and push generated content to master branch.
cd ../savaslabs.github.io.master
ls -lah ../savaslabs.github.io.master
git config user.email ${GH_EMAIL}
git config user.name "savas-bot"
git add -A .
git commit -a -m "Travis #$TRAVIS_BUILD_NUMBER"
git push --quiet origin master > /dev/null 2>&1
