import {
  UbirchVerification,
  UbirchVerificationWidget,
  UbirchFormUtils,
  models,
  // @ts-ignore
} from './node_modules/@ubirch/ubirch-verification-js/dist';
// @ts-ignore
import params from '@params';

const { EHashAlgorithms, EStages } = models;

console.log(params);

function parseToken() {
  const deploymentStage = document.getElementById('deploymentStage')
    ? (document.getElementById('deploymentStage') as HTMLInputElement)?.value
    : undefined;
  if (!deploymentStage) {
    throw new Error('Please set stage parameter in project config!!');
  }

  const accessTokensVal = params.accessTokens;
  if (!accessTokensVal) {
    throw new Error(
      'Please provide accessTokens to use version 2 of verification widget with token support!!'
    );
  }
  const accessToken = accessTokensVal.find(
    ({ stage }) => stage === deploymentStage
  )?.token;
  console.log(accessToken);

  if (!accessToken || accessToken.length === 0) {
    throw new Error(
      `Please provide accessToken for stage ${deploymentStage}!!`
    );
  }
  return accessToken;
}

let subscribe = null;

document.addEventListener('DOMContentLoaded', function () {
  const formUtils = new UbirchFormUtils();
  const params = formUtils.getFormParamsFromUrl(window, ';');
  formUtils.setDataIntoForm(params, window.document);

  const ubirchVerification = new UbirchVerification({
    algorithm: params.algorithm,
    stage: EStages.dev,
    accessToken: parseToken(),
  });

  new UbirchVerificationWidget({
    hostSelector: '#widgetDiv',
    messenger: ubirchVerification.messenger,
  });

  if (!subscribe)
    subscribe = ubirchVerification.messenger.subscribe((q: any) =>
      console.log(q)
    );

  const hash = ubirchVerification.createHash(JSON.stringify(params));
  ubirchVerification.verifyHash(hash);
});
