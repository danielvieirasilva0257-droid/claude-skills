#!/usr/bin/env bash
# Builds the release APK (arm64-v8a). Demo mode by default (EXPO_PUBLIC_DEMO=1:
# works with no server); EXPO_PUBLIC_DEMO=0 uses EXPO_PUBLIC_SUPABASE_URL/ANON_KEY.
# Usage (inside app-barbeiros/): bash scripts/apk/gerar-apk.sh
# Output: android/app/build/outputs/apk/release/app-release.apk
set -eo pipefail
cd "$(dirname "$0")/../.."
export ANDROID_HOME="${ANDROID_HOME:-/root/android-sdk}" JAVA_HOME="${JAVA_HOME:-/usr/lib/jvm/java-21-openjdk-amd64}"
export EXPO_PUBLIC_GALERIA=0 NODE_ENV=production EXPO_PUBLIC_DEMO="${EXPO_PUBLIC_DEMO:-1}"
[ -d android ] || EXPO_OFFLINE=1 CI=1 npx expo prebuild --platform android --no-install
# prebuild runs only once: keep the native version in sync with app.json on every build.
VERSAO=$(node -p "require('./app.json').expo.version")
CODIGO=$(node -p "require('./app.json').expo.android.versionCode")
sed -i -E "s/versionCode [0-9]+/versionCode $CODIGO/; s/versionName \"[^\"]+\"/versionName \"$VERSAO\"/" android/app/build.gradle
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
sed -i 's/^reactNativeArchitectures=.*/reactNativeArchitectures=arm64-v8a/' android/gradle.properties
sed -i 's/^org.gradle.jvmargs=.*/org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m/' android/gradle.properties
cd android
# espelho-maven.gradle: Google's Maven Central mirror first (Maven Central answers 429 to shared proxies).
./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a --console=plain \
  --init-script ../scripts/apk/espelho-maven.gradle \
  -Porg.gradle.java.installations.paths=/usr/lib/jvm/java-17-openjdk-amd64 -Porg.gradle.java.installations.auto-download=false
ls -la app/build/outputs/apk/release/
