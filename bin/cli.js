#!/usr/bin/env node

const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const app = require('../app');

const root_path = path.resolve("./");
const root_dirname = path.basename(root_path);

const git_config_path = path.resolve("./.git/config");
let git_remote_origin = null;
if (fs.existsSync(git_config_path)){
    const git_config_raw = fs.readFileSync(git_config_path, "utf8");
    const parsed = app.parse(git_config_raw);
    const remote_origin_prop = 'remote "origin".url';
    if (_.has(parsed, remote_origin_prop)){
        git_remote_origin = _.get(parsed, remote_origin_prop);
    }
}

const name = _.kebabCase(_.deburr(root_dirname)),
    title = _.upperFirst(_.startCase(name));

const options = app.args({
    "verbose": false,
    "template": "default",
    "name": name,
    "version": "0.0.1",
    "license": "GPL-2.0-or-later",
    "title": title,
    "description": null,
    "repository": git_remote_origin,
    "author": {
        "name": "FooPlugins",
        "email": "info@fooplugins.com",
    },
    "bugs": "https://fooplugins.com",
    "config": {
        "namespace": null
    }
});

const questions = [{
    "property": "name",
    "text": "package name: ",
    "default": options.name
}, {
    "property": "version",
    "text": "package version: ",
    "default": options.version
}, {
    "property": "license",
    "text": "package license: ",
    "default": options.license
},{
    "property": "title",
    "text": "package title: ",
    "default": options.title
}, {
    "property": "description",
    "text": "package description: ",
    "default": options.description
}, {
    "property": "repository",
    "text": "package repository: ",
    "default": options.repository
}, {
    "property": "author.name",
    "text": "package author name: ",
    "default": options.author.name
}, {
    "property": "author.email",
    "text": "package author email: ",
    "default": options.author.email
}, {
    "property": "bugs",
    "text": "package bugs: ",
    "default": options.bugs
}, {
    "property": "config.namespace",
    "text": "package config namespace: ",
    "default": options.config.namespace
}];

app.ask(questions).then((answers) => {
    if (options.verbose) console.log("answers: ", answers);
    console.log("creating files...");
    return app.create(options.template, root_path, answers);
}).then((files) => {
    if (options.verbose) console.log("processed: ", files);
    console.log("installing dependencies...");
    return app.install(root_path, "@steveush/gulp-tasks", "@wordpress/scripts", "gulp");
}).then(() => {
    console.log("run gulp to build the repo!");
}).catch((err) => {
    console.log(err);
});