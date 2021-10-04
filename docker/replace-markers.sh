
#!/bin/bash

# replace the markers in any file.
# we need to prepend the protocol, otherwise hugo will try to optimize.
# we cannot use @@ for markers, as they will get escaped in some cases.

cp -a /app_template/* /www

find /www -type f -exec \
    sed -i \
        -e "s%https://__VERIFICATION_HUGO_BASE_URL__%${VERIFICATION_HUGO_BASE_URL}%" \
        -e "s%__SHOW_DEMO_DISCLAIMER__%${SHOW_DEMO_DISCLAIMER}%" \
        -e "s%__DEPLOYMENT_STAGE__%${DEPLOYMENT_STAGE}%" \
        -e "s%__ACCESS_TOKEN_BVDW__%${ACCESS_TOKEN_BVDW}%" \
        -e "s%__ACCESS_TOKEN_BVDWL__%${ACCESS_TOKEN_BVDWL}%" \
        -e "s%__ACCESS_TOKEN_GD__%${ACCESS_TOKEN_GD}%" \
        -e "s%__ACCESS_TOKEN_GDVCC__%${ACCESS_TOKEN_GDVCC}%" \
        -e "s%__ACCESS_TOKEN_GELSENKIRCHEN__%${ACCESS_TOKEN_GELSENKIRCHEN}%" \
        -e "s%__ACCESS_TOKEN_UBC__%${ACCESS_TOKEN_UBC}%" \
        -e "s%__ACCESS_TOKEN_VP2__%${ACCESS_TOKEN_VP2}%" \
        -e "s%__ACCESS_TOKEN_VP3__%${ACCESS_TOKEN_VP3}%" \
        -e "s%__ACCESS_TOKEN_IMMUNKARTE__%${ACCESS_TOKEN_IMMUNKARTE}%" \
        -e "s%__TRANSFORM_UPP2DCC_BASE_URL__%${TRANSFORM_UPP2DCC_BASE_URL}%" \
        {} \;
