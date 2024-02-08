#!/bin/bash
echo "Enter schema version:"
read VER
ACADEMIC_SCHEMA=$(curl -s -X POST http://localhost:8021/schemas \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d "{\"attributes\": [\"degree\", \"date\", \"name\", \"timestamp\"], \"schema_name\": \"academic\", \"schema_version\": \"$VER\" }" |
  jq -r '.schema_id')

echo -e "Academic Schema Created: $ACADEMIC_SCHEMA\n"

LICENSE_SCHEMA=$(curl -s -X POST \
  http://localhost:8021/schemas \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d "{
  \"attributes\": [
  \"issuing_state\",
   \"issue_date\",
      \"validity\",
      \"class\",
      \"full_name\",
      \"license_no\",
      \"address\",
      \"birth_date\"
  ],
  \"schema_name\": \"driving license\",
  \"schema_version\": \"$VER\"
}" | jq -r '.schema_id')

echo -e "Driving License Schema Created: $LICENSE_SCHEMA\n"

MEMBERSHIP_SCHEMA=$(curl -s -X POST \
  http://localhost:8021/schemas \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d "{
  \"attributes\": [
    \"group\",
      \"validity\",
      \"logo\",
      \"start_date\",
      \"type\"
  ],
  \"schema_name\": \"membership card\",
  \"schema_version\": \"$VER\"
}" | jq -r '.schema_id')

echo -e "Membership Card Schema Created: $MEMBERSHIP_SCHEMA\n"

ACADEMIC_CRED=$(curl -s -X POST http://localhost:8021/credential-definitions \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d "{
  \"schema_id\": \"$ACADEMIC_SCHEMA\",
  \"support_revocation\": false,
  \"tag\": \"lattice degree\"
}" | jq -r '.credential_definition_id')

printf "Credential Definition ID: %s\n" "$ACADEMIC_CRED"

LICENSE_CRED=$(curl -s -X POST http://localhost:8021/credential-definitions \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d "{
  \"schema_id\": \"$LICENSE_SCHEMA\",
  \"support_revocation\": false,
  \"tag\": \"lattice driving license\"
}" | jq -r '.credential_definition_id')

printf "Credential Definition ID: %s\n" "$LICENSE_CRED"

MEMBERSHIP_CRED=$(curl -s -X POST http://localhost:8021/credential-definitions \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d "{
  \"schema_id\": \"$MEMBERSHIP_SCHEMA\",
  \"support_revocation\": false,
  \"tag\": \"lattice membership card\"
}" | jq -r '.credential_definition_id')

printf "Credential Definition ID: %s\n" "$MEMBERSHIP_CRED"

json_string=$(
  jq -n \
    "{\"ACADEMIC\":{\"schema\":\"$ACADEMIC_SCHEMA\", \"definition\":\"$ACADEMIC_CRED\"},
      \"LICENSE\":{\"schema\":\"$LICENSE_SCHEMA\", \"definition\":\"$LICENSE_CRED\"},
      \"MEMBERSHIP\":{\"schema\":\"$MEMBERSHIP_SCHEMA\", \"definition\":\"$MEMBERSHIP_CRED\"}}"
)

echo $json_string >./html/data.json

verifier_json=$(
  jq -n \
    "{\"ACADEMIC\":{\"definition\":\"$ACADEMIC_CRED\"},
      \"LICENSE\":{\"definition\":\"$LICENSE_CRED\"},
      \"MEMBERSHIP\":{\"definition\":\"$MEMBERSHIP_CRED\"}}"
)

read -p "Enter verifier root path" VER_PATH
echo $verifier_json >$VER_PATH/html/data.json
