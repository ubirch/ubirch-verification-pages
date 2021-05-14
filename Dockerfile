FROM envimate/hugo:0.79.0 AS builder

ADD . /app/
WORKDIR /app/
RUN hugo --config=config.prod.toml


FROM nginx:latest
ENV \
    VERIFICATION_HUGO_BASE_URL=https://verify.govdigital.de/ \
    SHOW_DEMO_DISCLAIMER=none \
    DEPLOYMENT_STAGE=prod

COPY docker/replace-markers.sh /docker-entrypoint.d/
COPY --from=builder /app/public/ /usr/share/nginx/html/
