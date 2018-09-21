import gulp from 'gulp';
import {CLIOptions, build as buildCLI} from 'aurelia-cli';
import transpile from './transpile';
import processMarkup from './process-markup';
import copyFiles from './copy-files';
import watch from './watch';
import project from '../aurelia.json';

console.log(project);

let build = gulp.series(
  readProjectConfiguration,
  gulp.parallel(
    transpile,
    processMarkup,
    copyFiles
  ),
  writeBundles
);

let main = build;

function readProjectConfiguration() {
  return buildCLI.src(project);
}

function writeBundles() {
  return buildCLI.dest();
}

export { main as default };
