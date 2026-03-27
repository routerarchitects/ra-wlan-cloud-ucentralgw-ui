#!/bin/sh

ENV_CONFIG_PATH=/usr/share/nginx/html/env-config.js

# Recreate config file
rm -f "$ENV_CONFIG_PATH"
touch "$ENV_CONFIG_PATH"

# Add assignment
echo "window._env_ = {" >> "$ENV_CONFIG_PATH"

# Read each REACT_* environment variable.
env | grep '^REACT_' | while IFS= read -r line; do
  echo "$line"

  # Split key/value by first '='.
  varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
  value=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')

  # Escape value for safe JS string output.
  escaped_value=$(printf '%s' "$value" | sed 's/\\/\\\\/g; s/"/\\"/g')

  # Append configuration property to JS file.
  echo "  $varname: \"$escaped_value\"," >> "$ENV_CONFIG_PATH"
done

echo "}" >> "$ENV_CONFIG_PATH"
