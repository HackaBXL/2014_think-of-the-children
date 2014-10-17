#!/bin/bash
# push.sh


echo "Please enter your commit title if you want (default : update)"

read commit_title

commit_title=${commit_title:-update}

git pull
git add --all
git commit -m "$commit_title"
git push origin master