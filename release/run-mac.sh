
#!/bin/bash

cd "$(dirname "$0")" || exit 1

echo "================================"
echo "       MedQueue HK"
echo "================================"
echo ""
echo "Open http://localhost:8080"
echo "Press Control + C to stop."
echo ""

java \
  -Djavax.net.ssl.trustStoreType=KeychainStore-ROOT \
  -Djavax.net.ssl.trustStore=NONE \
  -jar medqueue-hk.jar
