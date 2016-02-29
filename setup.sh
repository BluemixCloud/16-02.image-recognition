#!/bin/bash

rm -rf node_modules
npm install body-parser express morgan --save
npm install babel-cli babel-core babel-loader babel-preset-es2015 babel-preset-node5 babel-preset-stage-0 del gulp gulp-shell run-sequence webpack --save-dev
