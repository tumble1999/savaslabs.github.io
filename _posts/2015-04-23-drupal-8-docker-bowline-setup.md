---
layout: post
title: "Drupal 8 development environment using Docker, Docker Compose, and Bowline on OS X"
date: 2015-04-23
author: Dan Murphy
tags: docker bowline osx drupal drupal8
comments_enabled: 1
summary: Learn how to use Docker, Docker Compose, and Bowline to set up a standardized local Drupal development environment on your Mac.
---
In preparation for a [code sprint our team is organizing to port Views GeoJSON to Drupal 8](/2015/04/16/codesprint-port-views-geojson-drupal-8.html), we decided it would be a great opportunity to standardize our Drupal 8 local development environments. To ease this process, we ended up using Docker, Docker Compose, and Bowline.

In this post I’ll give a brief overview of these awesome tools, and explain how we set them up on OS X to create identical Drupal 8 development environments on each team member’s computer.

### Background

There are a lot of different ways to setup a local development environment, and there are usually many challenges along the way. One problem that often arises is that a developer’s local environment differs from their co-workers and/or their staging or production environments. For example, maybe you’re running PHP 5.6, your colleague is running PHP 5.5, and production is running PHP 5.4. This can cause issues when you share or deploy code that works in one environment but not in another. Using Docker, Docker Compose, and Bowline we can remove this pain point by ensuring that all of the environments are the same.

First off what are Docker, Docker Compose, and Bowline?

* Docker is ["an open-source project that automates the deployment of applications inside software containers."](http://en.wikipedia.org/wiki/Docker_%28software%29) Essentially, Docker runs a processes from within a container that includes all dependencies the process needs to run. This allows containers to run almost anywhere. For example, you may have a container for running MySQL.
* Docker Compose ["allows you to define an application's components -- their containers, configuration, links and volumes -- in a single file. Then a single command will set everything up and start your application running."](https://docs.docker.com/userguide/) For example, you may use Docker Compose to bundle a web server container and a MySQL container.
* Bowline is a ["Drupal focused docker container helper that ties everything together."](https://github.com/davenuman/bowline) Bowline can be used to easily create a standard, local Drupal development environment for you by building the requisite Docker containers and configuring your settings. By default, [Bowline creates two containers: mysql 5.5 and a web container that provides apache, php 5.4, and related software.](http://www.civicactions.com/blog/2015/jan/27/dockerizing-drupal-project-development-and-testing)

By using these tools, you can ensure that each member of your team has the same local setup. That way, if code works in one environment, then it works in all of them.

Now I’ll go through the steps I followed to set everything up on my Mac. For this tutorial I’ll be showing you how to set up a fresh Drupal 8 install, however you can also use these tools on new or existing Drupal 6 and 7 projects.

### Initial Setup

#### Install Docker on your machine

Unfortunately, [you can’t run Docker natively in OS X](https://docs.docker.com/installation/mac/), as explained in the Docker documentation:

> Instead, you must install the Boot2Docker application. The application includes a VirtualBox Virtual Machine (VM), Docker itself, and the Boot2Docker management tool. The Boot2Docker management tool is a lightweight Linux virtual machine made specifically to run the Docker daemon on Mac OS X.

To install Boot2Docker, I followed the [Docker Mac installation instructions.](https://docs.docker.com/installation/mac/). First, I installed Boot2Docker from [boot2docker/osx-installer](https://github.com/boot2docker/osx-installer/releases/latest) as explained in that tutorial. The docker and boot2docker binaries are installed in `/usr/local/bin` which you can access from your terminal. I then followed the instructions for starting Boot2Docker from the command line, running the following commands:

Setup Boot2Docker, this only needs to be run once during initial setup:
{% highlight bash %}
$ boot2docker init
{% endhighlight %}
Start the boot2docker application:
{% highlight bash %}
$ boot2docker start
{% endhighlight %}
Set the environment variables for the Docker client, so that it can access Docker running on the Boot2Docker virtual machine. Note, this needs to be run for each terminal window or tab you open:
{% highlight bash %}
$ eval "$(boot2docker shellinit)"
{% endhighlight %}
Verify that boot2docker is running:
{% highlight bash %}
$ boot2docker status
{% endhighlight %}
Verify that the Docker client environment is initialized:
{% highlight bash %}
$ docker version
{% endhighlight %}

#### Install Docker Compose

To install Docker Compose I followed the [Docker Compose installation
instructions](https://docs.docker.com/compose/install/#install-compose). I ran the following command:
{% highlight bash %}
$ curl -L https://github.com/docker/compose/releases/download/1.2.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
$ chmod +x /usr/local/bin/docker-compose
{% endhighlight %}

Verify the installation of Docker Compose:
{% highlight bash %}
$ docker-compose --version
{% endhighlight %}

Optionally, if you choose to install command completion for Docker Compose for the bash shell, you may follow [these steps](https://docs.docker.com/compose/completion/), however on OS X you will probably have to modify the bash_completion.d path as follows:
{% highlight bash %}
$ curl -L https://raw.githubusercontent.com/docker/compose/1.2.0/contrib/completion/bash/docker-compose > /usr/local/etc/bash_completion.d/docker-compose
{% endhighlight %}

#### Install Bowline and set up the Drupal 8 Project

The [Bowline project readme](https://github.com/davenuman/bowline/blob/master/readme.md) provides installation and setup instructions, however I needed to make some modifications. For example, Fig has been deprecated in place of Docker Compose. Explicitly I did the following:

Pull the Docker images:
{% highlight bash %}
$ docker pull davenuman/bowline-web-php
$ docker pull mysql:5.5
{% endhighlight %}

Navigate to your sites directory and create a new project for your drupal 8 site (for me, that directory is `/Users/dan/Sites`):
{% highlight bash %}
$ mkdir drupal8
$ cd drupal8
{% endhighlight %}

Setup bowline:
{% highlight bash %}
$ git init
$ git remote add bowline git@github.com:davenuman/bowline.git
$ git remote update
$ git checkout bowline/master .
$ git add . && git status
$ git rm --cached readme.md
$ rm readme.md
$ git commit -m 'Starting with bowline code'
{% endhighlight %}

Activate bowline and build the containers:
{% highlight bash %}
$ . bin/activate
$ build
{% endhighlight %}

Check that that the containers are running:
{% highlight bash %}
$ bowline
{% endhighlight %}

Download Drupal 8 to your project folder and rename the folder as docroot. You can [manually download it here](https://www.drupal.org/project/drupal), or you can use wget as follows:
{% highlight bash %}
$ wget http://ftp.drupal.org/files/projects/drupal-8.0.0-beta9.tar.gz
$ tar -xzvf drupal-8.0.0-beta9.tar.gz
$ mv drupal-8.0.0-beta9 docroot
$ rm drupal-8.0.0-beta9.tar.gz
{% endhighlight %}

Update Composer (not to be confused with Docker Compose) to use Drush 7 (Drupal 8 does not work with older versions of Drush):
{% highlight bash %}
$ composer require drush/drush:dev-master
{% endhighlight %}

Use bowline to initialize the site settings and then use drush to install Drupal
{% highlight bash %}
$ settings_init
$ drush si --sites-subdir=default
{% endhighlight %}

Your Drupal 8 site is now set up and running on the web and MySQL Docker containers you set up using Bowline. However, a few extra steps are required so that you can access your site on the Apache server that is running within the web container.

Run the bowline command to get the IP address of your web container, it
should be something like `http://172.17.0.2/`

Run the boot2docker ip command to get the IP address of the boot2docker virtual machine, it should be something like `192.168.59.103`

We now manually add a subnet route to the docker instance running inside
the boot2docker virtual machine as follows:
{% highlight bash %}
$ sudo route -n add 172.0.0.0/8 192.168.59.103
{% endhighlight %}

You should now be able to access your Drupal 8 site using the web IP address by ing the `bowline` command, for example `http://172.17.0.2/` for my setup.

One of the great things about Bowline is it sets up drush to work with your containers. You can use drush to get a one time login link for the admin user by simply running:
{% highlight bash %}
$ drush uli
{% endhighlight %}

You can also debug the site using XDebug. I will explain how to set this up in a future blog post.

### When you're done

Bowline, Boot2Docker, all docker containers, and the subnet route will all cease when you restart your machine, however you can manually stop them as follows:

Deactivate bowline:
{% highlight bash %}
$ deactivate
{% endhighlight %}
Stop all docker containers:
{% highlight bash %}
$ docker stop $(docker ps -a -q)
{% endhighlight %}
Remove all docker containers:
{% highlight bash %}
$ docker rm $(docker ps -a -q)
{% endhighlight %}
Stop the boot2docker virtual machine:
{% highlight bash %}
$ boot2docker stop
{% endhighlight %}
Remove the static route:
{% highlight bash %}
$ sudo route -n delete 172.0.0.0/8 192.168.59.103
{% endhighlight %}

### Running in the future

Next time you start you machine and want to fire up the development environment you’ll need to run the following commands from the project root.
{% highlight bash %}
$ boot2docker start
$ eval "$(boot2docker shellinit)"
$ . bin/activate
$ build
$ sudo route -n add 172.0.0.0/8 192.168.59.103
$ bowline
{% endhighlight %}

### Troubleshooting

For each new terminal window or tab you open, you have to set the Boot2Docker environment variables. If you see an error message like: "Couldn't connect to Docker daemon - you might need to run \`boot2docker up`." you may need to run:
{% highlight bash %}
$ eval "$(boot2docker shellinit)"
{% endhighlight %}
If you move to a different project within the same terminal window or tab, make sure you deactivate bowline:
{% highlight bash %}
$ deactivate
{% endhighlight %}
If drush status is working, but the site is not loading, double check that you are rerouting to the Boot2Docker IP address:
{% highlight bash %}
$ sudo route -n add 172.0.0.0/8 192.168.59.103
{% endhighlight %}

### Versions used in this tutorial
* Docker 1.6.0
* Boot2Docker 1.6.0
* Docker Compose 1.2.0
* Drupal 8.0.0-beta9
* Drush 7.0-dev
