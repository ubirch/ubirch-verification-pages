FROM envimate/hugo:0.79.0 AS builder

ADD . /app/
WORKDIR /app/
RUN hugo


FROM nginx:latest

COPY --from=builder /app/public/ /usr/share/nginx/html/
