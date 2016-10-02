ionic platform add browser
chmod +x hooks/after_prepare/010_add_platform_class.js
ionic build browser
gzip -k -r --best --force platforms/browser/www
