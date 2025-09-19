#!/bin/bash

echo "Testing ETag functionality..."
echo "First request should return 200, second should return 304 if content hasn't changed"

echo "Making first request to get ETag..."
ETAG=$(curl -s -I http://localhost:5000/api/vacancies/cmfl4jjap00014niohsr8k7b1 | grep -i etag | cut -d' ' -f2 | tr -d '\r\n')

if [ -z "$ETAG" ]; then
    echo "Error: No ETag received from server"
    echo "Response headers:"
    curl -s -I http://localhost:5000/api/vacancies/cmfl4jjap00014niohsr8k7b1
    exit 1
fi

echo "ETag received: $ETAG"
echo ""

echo "Making second request with If-None-Match header (should return 304 Not Modified):"
RESPONSE=$(curl -s -i -H "If-None-Match: $ETAG" http://localhost:5000/api/vacancies/cmfl4jjap00014niohsr8k7b1)
STATUS=$(echo "$RESPONSE" | head -1 | cut -d' ' -f2)

echo "Response status: $STATUS"

if [ "$STATUS" = "304" ]; then
    echo "✅ ETag working correctly - received 304 Not Modified"
else
    echo "❌ ETag not working - expected 304, got $STATUS"
    echo "Full response:"
    echo "$RESPONSE"
fi