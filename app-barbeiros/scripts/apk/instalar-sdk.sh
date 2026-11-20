#!/usr/bin/env bash
# Android SDK for the APK (versions from node_modules/react-native/gradle/libs.versions.toml).
# Needs dl.google.com allowed in the network. Usage: bash scripts/apk/instalar-sdk.sh
set -uo pipefail
export ANDROID_HOME="${ANDROID_HOME:-/root/android-sdk}"
ZIP=$(curl -s https://dl.google.com/android/repository/repository2-3.xml | grep -o 'commandlinetools-linux-[0-9]*_latest.zip' | sort -u -t- -k3 -n | tail -1)
mkdir -p "$ANDROID_HOME/cmdline-tools" && TMP=$(mktemp -d)
curl -sSL --retry 3 -o "$TMP/ct.zip" "https://dl.google.com/android/repository/$ZIP"
rm -rf "$ANDROID_HOME/cmdline-tools/latest" && unzip -q "$TMP/ct.zip" -d "$TMP" && mv "$TMP/cmdline-tools" "$ANDROID_HOME/cmdline-tools/latest"
yes 2>/dev/null | "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" --sdk_root="$ANDROID_HOME" \
  "platform-tools" "platforms;android-37" "build-tools;37.0.0" "ndk;27.1.12297006" "cmake;3.22.1"
# The React Native Gradle plugin asks for a Java 17 toolchain.
command -v apt-get >/dev/null && apt-get install -y -q openjdk-17-jdk-headless > /dev/null
echo "SDK pronto em $ANDROID_HOME"
