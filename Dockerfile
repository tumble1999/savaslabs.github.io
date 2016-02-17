FROM ruby:2.3
MAINTAINER Kosta Harlan "kosta@savaslabs.com"

RUN apt-get update \
&& apt-get install -y \
node \
python-pygments \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/

# Install program to configure locales
RUN apt-get update
RUN apt-get install -y locales
RUN dpkg-reconfigure locales && \
locale-gen C.UTF-8 && \
/usr/sbin/update-locale LANG=C.UTF-8

# Install needed default locale for Makefly
RUN echo 'en_US.UTF-8 UTF-8' >> /etc/locale.gen && \
locale-gen

# Set default locale for the environment
ENV LC_ALL C.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8

RUN gem install \
github-pages \
jekyll \
jekyll-redirect-from \
kramdown \
rdiscount \
rouge \
mdl \
scss_lint \
html-proofer

VOLUME /src
EXPOSE 4000

WORKDIR /src

EXPOSE 4000
CMD ["jekyll", "s"]




