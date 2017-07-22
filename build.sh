yarn run android:release

cp android/app/build/outputs/apk/app-release.apk build/

cd build

git init

git remote add origin git@github.com:prijindal/readgit.git

git checkout --orphan build

git add .

git commit -am "BUILD: $(date)"

git push -u origin build
