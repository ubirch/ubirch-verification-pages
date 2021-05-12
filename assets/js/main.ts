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
    accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Rva2VuLmRldi51YmlyY2guY29tIiwic3ViIjoiZDYzZWNjMDMtZjVhNy00ZDQzLTkxZDAtYTMwZDAzNGQ4ZGEzIiwiYXVkIjoiaHR0cHM6Ly92ZXJpZnkuZGV2LnViaXJjaC5jb20iLCJleHAiOjE2MjUwODY0ODQsImlhdCI6MTYxODg2NTcyMywianRpIjoiZjk1NjQyODktOGU3MC00Mjk0LWEyNDItODQ2MWZiMjdhOWE4Iiwic2NwIjpbInVwcDp2ZXJpZnkiXSwicHVyIjoiVGVzdCBUb2tlbiIsInRncCI6W10sInRpZCI6WyIqIl0sIm9yZCI6W119.CVUEKZmnQf22k5WToCMpHLuFz-1QgG5-6-YnZKFIKy8LllTG3BZQ4eKOTI0R7Nn0ac1ZrSumsk9qZsuWYP2wJw'
    // parseToken(),
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
