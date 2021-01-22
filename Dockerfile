FROM envimate/hugo:0.79.0 AS builder

ADD . /app/
WORKDIR /app/
RUN hugo --config=config.prod.toml


FROM nginx:latest
ENV \
    VERIFICATION_HUGO_BASE_URL=https://verify.govdigital.de/ \
    VERIFICATION_SCRIPT_URL=https://console.prod.ubirch.com/libs/verification/verification.js

COPY docker/replace-markers.sh /docker-entrypoint.d/
COPY --from=builder /app/public/ /usr/share/nginx/html/
