ioic build --release
npm run octokat
# chmod +x hooks/after_prepare/010_add_platform_class.js
# npm run cordova platform add browser
# npm run cordova build browser -- --release
gzip -k -r --best --force www
