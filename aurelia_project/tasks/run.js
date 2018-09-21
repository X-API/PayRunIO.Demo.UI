import gulp from 'gulp';
import build from './build';
import watch from './watch';

let run = gulp.series(build, done => { 
  watch(); 
  done(); 
});

export default run;
