#!/bin/bash

if [ -z "$2" ]; then
  echo -e "WARNING!!\nYou need to pass the WEBHOOK_URL environment variable as the second argument to this script.\nFor details & guide, visit: https://github.com/DiscordHooks/travis-ci-discord-webhook" && exit
fi

echo -e "[Webhook]: Sending webhook to Discord...\\n";

AVATAR="https://avatars0.githubusercontent.com/u/18323202?s=48&v=4"

case $1 in
  "success" )
    EMBED_COLOR=3066993
    STATUS_MESSAGE="Passed"
    # AVATAR="https://travis-ci.org/images/logos/TravisCI-Mascot-blue.png"
    ;;

  "failure" )
    EMBED_COLOR=15158332
    STATUS_MESSAGE="Failed"
    # AVATAR="https://travis-ci.org/images/logos/TravisCI-Mascot-red.png"
    ;;

  * )
    EMBED_COLOR=0
    STATUS_MESSAGE="Status Unknown"
    # AVATAR="https://travis-ci.org/images/logos/TravisCI-Mascot-1.png"
    ;;
esac

AUTHOR_NAME="$(git log -1 "$GITHUB_SHA" --pretty="%aN")"
COMMITTER_NAME="$(git log -1 "$GITHUB_SHA" --pretty="%cN")"
COMMIT_SUBJECT="$(git log -1 "$GITHUB_SHA" --pretty="%s")"
COMMIT_MESSAGE="$(git log -1 "$GITHUB_SHA" --pretty="%b")" | sed -E ':a;N;$!ba;s/\r{0,1}\n/\\n/g'
COMMIT_URL="https://github.com/$GITHUB_REPOSITORY/commit/$GITHUB_SHA"

if [ ${#COMMIT_SUBJECT} -gt 256 ]; then
  COMMIT_SUBJECT="$(echo "$COMMIT_SUBJECT" | cut -c 1-253)"
  COMMIT_SUBJECT+="..."
fi

if [ -n $COMMIT_MESSAGE ] && [ ${#COMMIT_MESSAGE} -gt 1900 ]; then
  COMMIT_MESSAGE="$(echo "$COMMIT_MESSAGE" | cut -c 1-1900)"
  COMMIT_MESSAGE+="..."
fi

BRANCH_NAME="$(echo $GITHUB_REF | sed 's/^[^/]*\/[^/]*\///g')"
REPO_URL="https://github.com/$GITHUB_REPOSITORY"
BRANCH_OR_PR="Branch"
BRANCH_OR_PR_URL="$REPO_URL/tree/$BRANCH_NAME"
ACTION_URL="$COMMIT_URL/checks"
COMMIT_OR_PR_URL=$COMMIT_URL

if [ "$AUTHOR_NAME" == "$COMMITTER_NAME" ]; then
  CREDITS="$AUTHOR_NAME authored & committed"
else
  CREDITS="$AUTHOR_NAME authored & $COMMITTER_NAME committed"
fi

if [ "$GITHUB_EVENT_NAME" == "pull_request" ]; then
	BRANCH_OR_PR="Pull Request"

	PR_NUM=$(sed 's/\/.*//g' <<< $BRANCH_NAME)
	BRANCH_OR_PR_URL="$REPO_URL/pull/$PR_NUM"
	BRANCH_NAME="#${PR_NUM}"

	# Call to GitHub API to get PR title
	PULL_REQUEST_ENDPOINT="https://api.github.com/repos/$GITHUB_REPOSITORY/pulls/$PR_NUM"

	WORK_DIR=$(dirname ${BASH_SOURCE[0]}/scripts/lib)
	PULL_REQUEST_TITLE=$(ruby $WORK_DIR/GET_PULL_REQUEST_TITLE.rb $PULL_REQUEST_ENDPOINT)

	COMMIT_SUBJECT=$PULL_REQUEST_TITLE
	COMMIT_MESSAGE="Pull Request #$PR_NUM"
	ACTION_URL="$BRANCH_OR_PR_URL/checks"
	COMMIT_OR_PR_URL=$BRANCH_OR_PR_URL
fi

TIMESTAMP=$(date --utc +%FT%TZ)
WEBHOOK_DATA='{
  "username": "Shuvi CI - Test & Lint",
  "avatar_url": "'$AVATAR'",
  "embeds": [ {
    "color": '$EMBED_COLOR',
    "author": {
      "name": "'"$STATUS_MESSAGE"': '"$GITHUB_REPOSITORY"' (OS Container: '"${HOOK_OS_NAME}"'),
      "url": "'"$ACTION_URL"'",
      "icon_url": "'$AVATAR'"
    },
    "title": "'"$COMMIT_SUBJECT"'",
    "url": "'"$COMMIT_OR_PR_URL"'",
    "description": "'"${COMMIT_MESSAGE//$'\n'/ }"\\n\\n"$CREDITS"'",
    "fields": [
      {
        "name": "Commit",
        "value": "'"[\`${GITHUB_SHA:0:7}\`](${COMMIT_URL})"'",
        "inline": true
      },
      {
        "name": "Branch",
        "value": "'"[\`$BRANCH_NAME\`](${COMMIT_OR_PR_URL})"'",
        "inline": true
      }
    ],
    "timestamp": "'"$TIMESTAMP"'"
  } ]
}'

(curl --fail --progress-bar -A "GitHub-Actions-Webhook" -H Content-Type:application/json -H X-Author:Sayakie#4444 -X POST -d "${WEBHOOK_DATA//	/ }" "$2" \
  && echo -e "\\n[Webhook]: Successfully sent the webhook.") || echo -e "\\n[Webhook]: Unable to send webhook."
