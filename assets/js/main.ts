import {
  UbirchVerification,
  UbirchVerificationWidget,
  UbirchFormUtils,
  // @ts-ignore
} from './node_modules/@ubirch/ubirch-verification-js/dist';
// @ts-ignore
import params from '@params';

const { algorithm, accessTokens, formIds, paramsFormIdsMapping, DATA_SCHEMA } =
  params;

console.log(params);

function getDeploymentStage() {
  const deploymentStage = document.getElementById('deploymentStage')
    ? (document.getElementById('deploymentStage') as HTMLInputElement)?.value
    : undefined;
  if (!deploymentStage) {
    throw new Error('Please set stage parameter in project config!!');
  }
  return deploymentStage;
}

function parseToken() {
  const deploymentStage = getDeploymentStage();

  if (!accessTokens) {
    throw new Error(
      'Please provide accessTokens to use version 2 of verification widget with token support!!'
    );
  }
  const accessToken = accessTokens.find(
    ({ stage }) => stage === deploymentStage
  )?.token;

  if (!accessToken || accessToken.length === 0) {
    throw new Error(
      `Please provide accessToken for stage ${deploymentStage}!!`
    );
  }
  return accessToken;
}

let subscribe = null;

function verifyForm() {
  try {
    const formUtils = new UbirchFormUtils({
      formIds,
      paramsFormIdsMapping,
    });
    const formParams = formUtils.getFormParamsFromUrl(window, ';');
    formUtils.setDataIntoForm(formParams, window.document);

    const genJson = JSON.stringify(formParams);
    const handledJson = handleSpecials(genJson, DATA_SCHEMA);

    const ubirchVerification = new UbirchVerification({
      algorithm,
      stage: getDeploymentStage(),
      accessToken: parseToken(),
    });

    new UbirchVerificationWidget({
      hostSelector: '#widgetDiv',
      messenger: ubirchVerification.messenger,
    });

    if (!subscribe)
      subscribe = ubirchVerification.messenger.subscribe((msg: any) =>
        console.log(msg)
      );

    const hash = ubirchVerification.createHash(handledJson);
    ubirchVerification.verifyHash(hash);
  } catch (e) {
    console.log('Fehler! ' + e);
    // TODO: error handling
  }
}

function handleSpecials(flatJson: string, DATA_SCHEMA: string) {
  switch (DATA_SCHEMA) {
    case 'certification-vaccination-v3':
      const json = JSON.parse(flatJson);
      let vacc = {
        da: json.da,
        vp: json.vp,
        pr: json.pr,
        br: json.br,
        vs: json.vs,
      } as any;
      if (json.bn) {
        vacc.bn = json.bn;
      }
      if (json.vd) {
        vacc.vd = json.vd;
      }
      if (json.ac) {
        vacc.ac = json.ac;
      }
      if (json.di) {
        vacc.di = json.di;
      }
      if (json.co) {
        vacc.co = json.co;
      }
      if (json.nx) {
        vacc.nx = json.nx;
      }
      let vaccV3Json = {
        fn: json.fn,
        id: json.id,
        is: json.is,
        ve: json.ve,
        vaccination: [vacc],
      } as any;
      if (json.gn) {
        vaccV3Json.gn = json.gn;
      }
      if (json.bd) {
        vaccV3Json.bd = json.bd;
      }
      if (json.pn) {
        vaccV3Json.pn = json.pn;
      }
      if (json.vf) {
        vaccV3Json.vf = json.vf;
      }
      if (json.vu) {
        vaccV3Json.vu = json.vu;
      }
      return JSON.stringify(vaccV3Json);
    default:
      return flatJson;
  }
}

document.addEventListener('DOMContentLoaded', verifyForm);
