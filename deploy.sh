npm run gulp build -- --release --change-host
chmod +x hooks/after_prepare/010_add_platform_class.js
chmod +x hooks/after_prepare/020_replace_text.js
chmod +x hooks/after_prepare/030_remove_onesync.js
npm run cordova platform add browser
npm run cordova build browser -- --release
gzip -k -r --best --force platforms/browser/www