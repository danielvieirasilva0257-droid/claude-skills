#!/usr/bin/env bash
# Build the "Minha Dieta" APK without Gradle: aapt2 + javac + d8 + zipalign + apksigner.
# Usage: build.sh <page.html> <out-dir>   (needs Android platform-34 and build-tools 34 in $SDK)
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
PAGE="$1"; OUT="$2"
SDK="${SDK:-/root/android}"
BT="$SDK/bt/android-14"; JAR="$SDK/platform/android-34/android.jar"
KS="${KEYSTORE:-/root/.config/rotina/minha-dieta.jks}"; KSPASS_FILE="${KS%.jks}.pass"
VERSION_CODE="${VERSION_CODE:-1}"; VERSION_NAME="${VERSION_NAME:-1.0}"
W="$OUT/work"; rm -rf "$W"; mkdir -p "$W/res" "$W/assets" "$W/gen" "$W/classes" "$W/dex"

python3 "$HERE/prepare_assets.py" "$PAGE" "$W/assets" "$W/res"

"$BT/aapt2" compile --dir "$W/res" -o "$W/res.zip"
"$BT/aapt2" link -o "$W/base.apk" -I "$JAR" --manifest "$HERE/AndroidManifest.xml" -A "$W/assets" \
  --min-sdk-version 24 --target-sdk-version 34 --version-code "$VERSION_CODE" --version-name "$VERSION_NAME" \
  --java "$W/gen" "$W/res.zip"
javac -nowarn --release 11 -classpath "$JAR" -d "$W/classes" $(find "$HERE/src" "$W/gen" -name '*.java') 2>&1 | grep -v "^warning\|^Note" || true
"$BT/d8" --release --lib "$JAR" --min-api 24 --output "$W/dex" $(find "$W/classes" -name '*.class')
cp "$W/base.apk" "$W/unsigned.apk"; (cd "$W/dex" && zip -q -j "$W/unsigned.apk" classes.dex)
"$BT/zipalign" -f -p 4 "$W/unsigned.apk" "$W/aligned.apk"

if [ ! -f "$KS" ]; then
  mkdir -p "$(dirname "$KS")"; head -c 24 /dev/urandom | base64 | tr -dc 'A-Za-z0-9' > "$KSPASS_FILE"
  keytool -genkeypair -keystore "$KS" -storepass "$(cat "$KSPASS_FILE")" -keypass "$(cat "$KSPASS_FILE")" -alias minhadieta \
    -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Minha Dieta, O=Minha Dieta, C=BR" >/dev/null 2>&1
fi
"$BT/apksigner" sign --ks "$KS" --ks-pass "file:$KSPASS_FILE" --ks-key-alias minhadieta --out "$OUT/MinhaDieta.apk" "$W/aligned.apk"
"$BT/apksigner" verify --print-certs "$OUT/MinhaDieta.apk" | head -3
ls -la "$OUT/MinhaDieta.apk"
