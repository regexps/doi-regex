#!/usr/bin/env node
'use strict';

var doiRegex = require('./')
var _ = require('lodash')

if (process.argv.length <= 2) {
	console.error("Usage: " + process.argv[1] + " <doi>")
	console.error("Flags: \n\
	-e, --exact	Find an exact match \n\
	-d, --declared 	Find a DOI with a 'doi:' prefix\n\
	-m, --match	Find all matches within the given string");
	process.exit(-1)
}

// parse input
var flags = {
	"exact": ['-e', '--exact'],
	"declared": ['-d', '--declared'],
	"match": ['-m', '--match'],
	"groups": ['-g', '--groups']
};

for (var index in flags) {
	_(flags[index]).each(function(arg) {
		if (process.argv.indexOf(arg) != -1) {
			process.argv.splice(process.argv.indexOf(arg), 1)
			flags[index] = true
		}
	})

	if (flags[index] !== true) {
		flags[index] = null
	}
}

var doi = process.argv[2];

if (flags.match === true) {
	console.log(doi.match(doiRegex()))
} else if (flags.groups === true) {
	console.log(doiRegex.groups(doi));
} else {
	if (flags.exact && flags.declared) {
		console.log('Is this a declared DOI',
			doiRegex.declared({exact: true}).test(doi))
	} else if (flags.exact && !flags.declared) {
		console.log('Is this a DOI?', doiRegex({exact: true}).test(doi))
	} else if (!flags.exact && flags.declared) {
		console.log('Is the DOI declared?', doiRegex.declared().test(doi))
	} else {
		console.log('Does a DOI exist?', doiRegex().test(doi))
	}
}
