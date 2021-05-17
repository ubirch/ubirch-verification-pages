import {
  UbirchVerification,
  UbirchVerificationWidget,
  UbirchFormUtils,
  // @ts-ignore
} from './node_modules/@ubirch/ubirch-verification-js/dist';

interface params {
  algorithm: string;
  DATA_SCHEMA: string;
  formIds: string[] | null;
  paramsFormIdsMapping: string[] | null;
  language: string;
  accessTokens: { stage: string; token: string }[];
}

interface WindowWithParams extends Window {
  ubirchVerificationParams?: params;
}
const { ubirchVerificationParams } = window as WindowWithParams;

const {
  algorithm,
  accessTokens,
  formIds,
  paramsFormIdsMapping,
  DATA_SCHEMA,
  language,
} = ubirchVerificationParams || {};

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
    const handledJson = handleSpecials(formParams, DATA_SCHEMA);

    const ubirchVerification = new UbirchVerification({
      algorithm,
      stage: getDeploymentStage(),
      accessToken: parseToken(),
    });

    new UbirchVerificationWidget({
      hostSelector: '#widgetDiv',
      messenger: ubirchVerification.messenger,
      language,
    });

    if (!subscribe)
      subscribe = ubirchVerification.messenger.subscribe((msg: any) =>
        console.log(msg)
      );

    const hash = ubirchVerification.createHash(JSON.stringify(handledJson));
    ubirchVerification.verifyHash(hash);
  } catch (e) {
    console.log('Fehler! ' + e);
    // TODO: error handling
  }
}

interface VaccinationSchema {
  da: string;
  vp: string;
  pr: string;
  br: string;
  vs: string;
  bn?: string;
  vd?: string;
  ac?: string;
  di?: string;
  co?: string;
  nx?: string;
}

interface VaccinationSchemaV3 {
  fn: string;
  id: string;
  is: string;
  ve: string;
  vaccination: [VaccinationSchema];
  gn?: string;
  bd?: string;
  pn?: string;
  vf?: string;
  vu?: string;
}

function handleSpecials(json: any, DATA_SCHEMA: string) {
  switch (DATA_SCHEMA) {
    case 'certification-vaccination-v3':
      let vacc = {
        da: json.da,
        vp: json.vp,
        pr: json.pr,
        br: json.br,
        vs: json.vs,
      } as VaccinationSchema;
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
      } as VaccinationSchemaV3;
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
      return vaccV3Json;
    default:
      return json;
  }
}

document.addEventListener('DOMContentLoaded', verifyForm);
