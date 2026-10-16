#!/usr/bin/env bash
# Builds the release APK and names it after the app version: dist-apk/KaizenYoga-<version>.apk
#
# Version rule: bump "version" (minor: 1.1.0 → 1.2.0 → …) and android.versionCode (+1) in app.json BEFORE running.
# This script copies both into android/app/build.gradle so the number inside the APK matches the file name.
set -euo pipefail
cd "$(dirname "$0")/.."

VERSION=$(node -p "require('./app.json').expo.version")
CODE=$(node -p "require('./app.json').expo.android.versionCode")
GRADLE=android/app/build.gradle

sed -i -E "s/versionCode [0-9]+/versionCode ${CODE}/; s/versionName \"[^\"]+\"/versionName \"${VERSION}\"/" "$GRADLE"

( cd android && ANDROID_HOME="${ANDROID_HOME:-$HOME/Android}" ./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a )

mkdir -p dist-apk
OUT="dist-apk/KaizenYoga-${VERSION}.apk"
cp android/app/build/outputs/apk/release/app-release.apk "$OUT"
echo "Built $OUT (versionCode ${CODE})"
ls -l "$OUT" | awk '{print "size:", $5, "bytes"}'
sha256sum "$OUT"
