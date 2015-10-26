---
layout: post
title: "Drupalized Web Mapping @ NACIS 2015"
date: 2015-10-27
author: Tim Stallmann
tags: Drupal, Drupal Planet, Cartography
summary: Slides from Tim's talk on building web maps using Drupal at the 2015 NACIS conference.
---

Two weeks ago, I gave a presentation on "[Drupalized Web Mapping](http://timstallmann.github.io/nacis-drupal-mapping-talk/#/)" for the [North American Cartographic Information Society 2015](http://www.nacis.org) conference in Minneapolis, MN.
The full set of slides for the talk are [online via Github pages](http://timstallmann.github.io/nacis-drupal-mapping-talk/#/), but here I'm going to skip the "what is Drupal" side of the talk and focus on giving more detail on three different recommended workflows for building web maps in Drupal.

### The use case - why Drupal?

ArcGIS.com, Google My Maps, CartoDB, Mapbox -- the list of GUI-based web-mapping tools keeps getting longer. These tools are great
for a lot of purposes. But there are a few things which are hard to do *easily* using most conventional web-based mapping/GIS tools that Drupal makes easy:
 
 * Annotating features with rich text and longer text descriptions, and having that text be easily editable in a WYSIWYG format.
 * Attaching media (pictures, audio and video) to features without having to use a separate external service for storing media. ArcGIS.com and CartoDB both require you to upload photos elsewhere and then copy-and-paste a URL from the photo location, not the simplest workflow.
 * Incorporating faceted search.
 * Allowing multiple users to edit and comment on feature attributes, using versioning and permission controls.
 
This blog post covers how to add a styled web map of node locations to a Drupal website. There are also ways to add more powerful mapping
and GIS capabilities to Drupal (for example via [cartaro](http://www.cartaro.org), but I'm not going to talk about those here. I also assume you're already
familiar with basic Drupal concepts.

### Getting and storing geo-data

Geofield is the best module for adding location information to existing content types in a Drupal website. For most basic purposes, the default
storage settings will work just fine, although for more complicated geo-data you can also enable PostGIS integration for better performance on the back-end.
Geofield depends on the GeoPHP API module, which can also integrate with the GeOS PHP extension for some moderate performance gains.

Once you've added a Geofield to your content type to store location info, you'll need to populate the field. Geocoder module allows you to auto-populate a geofield by geocoding address information in another text field.
This can be a full address, or also just a city and state name. For production sites, you'll need to make sure that your site abides by the terms of use of your chosen geocoder (for example, sites using Google Geocoder must also display
their data on a Google Map). The MapQuest Nominatim Geocoder uses exclusively OpenStreetMap data, and as such has a much less restrictive use policy. I haven't played around with using Mapzen's opensource [Pelias](https://github.com/pelias/pelias) geocoder
with Drupal yet, but the Geocoder module has a really simple plugin system that allows you to define your own geocoding endpoint.

For sites where ease-of-use on the data-entry side is a lower priority, you can also just allow direct input of latitude and longitude coordinates via the node edit screen (or pasting in GeoJSON for more complicated geometries). Lat/long coordinates
are easy to find via Google Maps.

### Leaflet module

One of the simplest ways to add a web map to your site is using the Leaflet module, which is a wrapper around the Leaflet.js web mapping framework. With Leaflet installed, you can set the display mode
for your geofield to "Leaflet Map", which will add a locator map to each node page. With Leaflet Views also installed, you can set the display mode for a view to "Leaflet" to output a view as a map - you'll need to include
a geofield as one of the fields in the view before this will work, of course. With this set-up, to add search or filters to the map all you have to do is add them as exposed filters to the view!

Leaflet offers some basic customization options -- you can set popup title and content, choose a different point icon image, and choose from a couple of different basemaps. The Leaflet More Maps module also offers some additional basemaps. But there
are a lot of limitations on customizing maps made using the Leaflet module. If you want to add multiple layers, use tokens from a field in the view to set the icon image, or add custom behavior overlays to the map you'll need to either use OpenLayers or write your own
 custom code.

### OpenLayers module

OpenLayers is a wrapper for the OpenLayers web mapping framework. It offers much more customization via the various settings GUIs, but at the cost of more computational and memory overhead.


### Views GeoJSON + Custom leaflet.js code

This is a sort of "headless Drupal" approach, and it's the one we're using on Savas' first D8 site, the [Durham Civil Rights map](https://github.com/savaslabs/durham-civil-rights-map). By using the Views GeoJSON module, you can
render the output of any view containing location information as a GeoJSON feed (potentially even including exposed filters via the query path). Then, just like any GeoJSON feed, that data can be loaded via AJAX into a Leaflet (or OpenLayers, or other frameworks) map. Savas' Anne Tomasevich has a
great write-up on just how to do that [in Drupal 8 specifically](http://savaslabs.com/2015/07/06/map-in-drupal-8.html), and I wrote a post a while ago about [how to map GeoJSON data in Leaflet more generally](http://savaslabs.com/2015/05/18/mapping-geojson.html). This approach is still something we're 
experimenting with, so we'd love to hear your thoughts. One note -- using this approach it's also possible for any user with enough permissions to view the GeoJSON feed to very easily download the full dataset using this approach.
