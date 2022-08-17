const {series, dest, src} = require('gulp');
const exec = require('child_process').exec;
const argv = require('yargs').argv;

function build(cb) {
    exec('npm run build', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
}

async function copy() {
    return src([
        './package/package.json',
        // '.npmrc',
    ]).pipe(dest('./dist'));
}

function publish(cb) {
    const { tag } = argv;
    exec(
        `cd dist && npm version ${tag} --no-git-tag-version && npm publish --access public`,
        function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        }
    );
}

exports.default = series(build, copy, publish);