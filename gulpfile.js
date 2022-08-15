// eslint-disable-next-line @typescript-eslint/no-var-requires
const { series, dest, src } = require('gulp');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = require('child_process').exec;

function build(cb) {
    exec('npm run build', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
}

async function copy() {
    return src('./package/package.json').pipe(dest('./dist'));
}

function publish(cb) {
    exec('cd dist && npm publish', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
}

exports.default = series(build, copy, publish);