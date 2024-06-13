#!/bin/bash

# Set the QR directory and the output JSON file
QR_DIR="./qr"
OUTPUT_FILE="./qr-list.json"

# Check if the QR directory exists
if [ ! -d "$QR_DIR" ]; then
  echo "QR directory '$QR_DIR' does not exist."
  exit 1
fi

# Get all filenames in the QR directory and filter out non-png files
qr_files=($(ls "$QR_DIR" | grep -i '\.png$'))

# Start the JSON array
echo "[" > "$OUTPUT_FILE"

# Loop through the QR files and add them to the JSON array
for qr_file in "${qr_files[@]}"; do
  echo "  \"$qr_file\"," >> "$OUTPUT_FILE"
done

# Remove the last comma and close the JSON array
sed -i '' '$ s/,$//' "$OUTPUT_FILE"
echo "]" >> "$OUTPUT_FILE"

echo "QR list updated in '$OUTPUT_FILE'."
