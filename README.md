# IG-ME

## Motivation

Permanently deleting my Instagram account without losing a showcase for my artwork.

## Requesting a data dump from Instagram

This is done easily thanks to the EU General Data Protection Regulation (GDPR). However, you do lose a lot of metadata about each post (i.e., captions, precise dates, etc). Visit https://www.instagram.com/download/request to request a link for your data.

## Generate Data

Targeting the images directory from the above data dump, this script prepares a JSON mapping with some additional metadata about each image.

```
npm run gen:data
```

Running the above script adds a `data.json` file to the root of the project.

## Credit

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
