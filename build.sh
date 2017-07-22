# yarn run android:release

rm -rf build

mkdir build

cp android/app/build/outputs/apk/app-release.apk build/

cd build

git init

git remote add origin git@github.com:prijindal/readgit.git

git config user.email "priyanshujindal1995@gmail.com"

git config user.name "Priyanshu Jindal"

git checkout --orphan build

git add .

git commit -am "BUILD: $(date)"

git push -u origin build --force
