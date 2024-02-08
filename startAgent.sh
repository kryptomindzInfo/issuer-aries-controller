#!/bin/bash
ENDPOINT=http://159.89.11.173:8020
SEED=kcoders_issuer000000000000000000
curl -d "{\"seed\":\"$SEED\", \"role\":\"ENDORSER\", \"alias\":\"issuer.kcoders\"}" -X POST http://dev.greenlight.bcovrin.vonx.io/register -H "Content-Type: application/json"
docker run -d --rm -ti \
    --name issuer \
    -p 8020-8029:8020-8029 \
    -v "/home/$(whoami)/.aries/logs:/home/aries/logs" \
    bcgovimages/aries-cloudagent:py3.9-indy-1.16.0_0.10.0-rc0 start \
    --wallet-type askar \
    --seed $SEED \
    --wallet-key secretOfIssuer \
    --wallet-name issuer \
    --genesis-url http://dev.greenlight.bcovrin.vonx.io/genesis \
    --inbound-transport http 0.0.0.0 8020 \
    --outbound-transport http \
    --admin 0.0.0.0 8021 \
    --admin-insecure-mode \
    --endpoint $ENDPOINT \
    --auto-accept-requests \
    --label 'Secure Identity Issuer' \
    --auto-ping-connection \
    --auto-respond-messages \
    --preserve-exchange-records \
    --trace-target log \
    --trace-tag acapy.events \
    --trace-label issuer.agent.trace \
    --auto-accept-invites \
    --auto-accept-requests \
    --auto-store-credential \
    --auto-provision \
    --auto-verify-presentation \
    --debug-connections
