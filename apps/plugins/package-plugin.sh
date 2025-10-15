#!/bin/bash

# Script to package and test the Cloudflare DNS Manager plugin

PLUGIN_DIR="/home/nginx-love/apps/plugins/cloudflare-dns-manager"
OUTPUT_DIR="/home/nginx-love/apps/plugins"
PLUGIN_NAME="cloudflare-dns-manager"
VERSION="1.0.0"
PACKAGE_NAME="${PLUGIN_NAME}-${VERSION}.zip"

echo "🔧 Packaging Cloudflare DNS Manager Plugin..."
echo "=============================================="

# Navigate to plugin directory
cd "$PLUGIN_DIR" || exit 1

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

if [ $? -ne 0 ]; then
  echo "❌ Failed to install dependencies"
  exit 1
fi

echo "✅ Dependencies installed successfully"

# Create package
echo ""
echo "📦 Creating plugin package..."
cd "$OUTPUT_DIR" || exit 1

# Remove old package if exists
rm -f "$PACKAGE_NAME"

# Create zip package (excluding node_modules for now, will be installed on target)
zip -r "$PACKAGE_NAME" "$PLUGIN_NAME" \
  -x "*/node_modules/*" \
  -x "*/.git/*" \
  -x "*/.*" \
  -x "*.log"

if [ $? -ne 0 ]; then
  echo "❌ Failed to create plugin package"
  exit 1
fi

# Calculate checksum
echo ""
echo "🔐 Calculating checksum..."
CHECKSUM=$(sha256sum "$PACKAGE_NAME" | awk '{print $1}')
echo "Checksum: $CHECKSUM"

# Get package size
SIZE=$(stat -f%z "$PACKAGE_NAME" 2>/dev/null || stat -c%s "$PACKAGE_NAME" 2>/dev/null)
SIZE_MB=$(echo "scale=2; $SIZE / 1024 / 1024" | bc)

echo ""
echo "✅ Plugin packaged successfully!"
echo "=============================================="
echo "📦 Package: $PACKAGE_NAME"
echo "📏 Size: ${SIZE_MB} MB"
echo "🔐 SHA256: $CHECKSUM"
echo "📂 Location: $OUTPUT_DIR/$PACKAGE_NAME"
echo ""

# Create metadata file for marketplace
METADATA_FILE="${OUTPUT_DIR}/${PLUGIN_NAME}-metadata.json"
cat > "$METADATA_FILE" <<EOF
{
  "id": "${PLUGIN_NAME}",
  "name": "Cloudflare DNS Manager",
  "version": "${VERSION}",
  "description": "Manage Cloudflare DNS records for your domains. Add, edit, and delete DNS records directly from the admin panel.",
  "author": "Nginx Love Team",
  "authorEmail": "support@nginx-love.com",
  "category": "integration",
  "tags": ["cloudflare", "dns", "domain", "records", "management"],
  "downloadUrl": "http://localhost:3000/plugins/${PACKAGE_NAME}",
  "checksum": "${CHECKSUM}",
  "size": ${SIZE},
  "createdAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "updatedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "rating": 5,
  "downloads": 0,
  "screenshots": [],
  "requiresConfig": true,
  "configFields": [
    {
      "key": "email",
      "label": "Cloudflare Email",
      "type": "email",
      "required": true
    },
    {
      "key": "apiKey",
      "label": "Cloudflare API Key",
      "type": "password",
      "required": true
    }
  ]
}
EOF

echo "📝 Metadata file created: $METADATA_FILE"
echo ""
echo "🧪 To test the plugin:"
echo "1. Copy package to /data/plugins/"
echo "   cp $OUTPUT_DIR/$PACKAGE_NAME /data/plugins/"
echo ""
echo "2. Install via API:"
echo "   curl -X POST http://localhost:3000/api/plugins/install \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -H 'Authorization: Bearer YOUR_TOKEN' \\"
echo "     -d '{\"packagePath\": \"/data/plugins/${PACKAGE_NAME}\"}'"
echo ""
echo "3. Or use the web interface:"
echo "   - Go to Plugins page"
echo "   - Click 'Install from file'"
echo "   - Select the package file"
echo ""
echo "✅ Done!"
