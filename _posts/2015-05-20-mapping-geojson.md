---
layout: post
title: "Mapping GeoJSON data"
date: 2015-05-20
author: Tim Stallmann
tags: cartography leaflet
summary: [Leaflet.js](http://www.leafletjs.com) is a powerful, light-weight javascript API for mapping. In this post, I'll walk through how to use Leaflet to map GeoJSON data.
--
[Leaflet.js](http://www.leafletjs.com) is a powerful, light-weight javascript API for mapping. In this post, I'll walk through how to use Leaflet to map GeoJSON data.

The first step in any mapping project using Leaflet is to add a basic div to your page with `id=map`. Leaflet will grab onto this div and insert the map content dynamically. You'll need to fix the div size using CSS:

{% highlight css %}
#map {
  height: 300px; // Or whatever height you'd like
  width: 100%;
}
{% endhighlight %}



