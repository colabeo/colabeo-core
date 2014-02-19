Build Tools
===========

This tool produces a minified and obfuscated version of a famo.us project.


What Does It Do
---------------

* require.js will be substituded with the almond.js shim loader
* Your project will be compiled down to a single JS file
* The JS file will be obfuscated (and linted) in the process


Dependencies
------------
* Java Runtime Environment (for Google Closure Compiler)
* r.js optimizer
* make

Java should be installed via an appropriate package for your OS

The r.js optimizer is installed via npm (from node.js)
    # npm install -g require.js

On OS X, make is part of the XCode command-line tools. 
On most Linux distros, it is part of some developer tools package.


Usage
=====

* Include this submodule inside the root of your famo.us project
* To minify your project, run `make`
* The obfuscated build will be in `build` directory


Note
----

Your project must be ES3-compliant in order to build.
This means that there are no trailing commas and no variable names are reserved keywords.
All annotations must also be compliant with Google Closure Compiler.

If your project uses a mix of quote and dot notation for object keys, ensure that they are consistent.
Otherwise, variable names will be mangled incorrectly by Closure Compiler, resulting in a build that will not run correctly.


Cleanup
=======

To clean this toolchain, run `make clean`.
This will remove the build directory and any temporary files.
