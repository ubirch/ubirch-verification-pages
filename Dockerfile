FROM alombarte/hugo AS builder

ADD . /app/
WORKDIR /app/
RUN npm install
RUN hugo --config=config.prod.toml

FROM bitnami/nginx:latest
ENV \
    VERIFICATION_HUGO_BASE_URL=https://verify.govdigital.de/ \
    SHOW_DEMO_DISCLAIMER=none \
    DEPLOYMENT_STAGE=prod

# this is necessary for the startup script
# that creates config from environment vars
USER root
RUN chown 1001 /app
COPY --from=builder --chown=1001 /app/public/ /app_template
COPY --from=builder /app/docker/default.conf /opt/bitnami/nginx/conf/server_blocks/default.conf
COPY --chmod=555 docker/replace-markers.sh /replace-markers.sh
RUN chmod 555 /replace-markers.sh
RUN mkdir /www && chown 1001 /www

USER 1001

COPY docker/entrypoint.sh /entrypoint.sh

EXPOSE 8081

ENTRYPOINT [ "/entrypoint.sh" ]
CMD [ "/opt/bitnami/scripts/nginx/run.sh" ]
