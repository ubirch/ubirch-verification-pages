import {
  UbirchVerification,
  UbirchVerificationWidget,
  UbirchFormUtils,
  // @ts-ignore
} from './node_modules/@ubirch/ubirch-verification-js/dist';

type AccessToken = { stage: string; token: string };
interface VerificationParams {
  algorithm: string;
  DATA_SCHEMA: string;
  formIds: string[] | null;
  paramsFormIdsMapping: string[] | null;
  language: string;
  accessTokens: AccessToken[];
  transformUrl: string;
  transformTypeHeader: string;
}

function getVerificationParams() {
  const verificationParams = (
    document.getElementById('verificationParams') as HTMLInputElement
  )?.value;

  if (!verificationParams) {
    throw new Error('Verification parameters not found!');
  }
  return JSON.parse(verificationParams) as VerificationParams;
}

function getDeploymentStage() {
  const deploymentStage = (
    document.getElementById('deploymentStage') as HTMLInputElement
  )?.value;

  if (!deploymentStage) {
    throw new Error('Please set stage parameter in project config!');
  }
  return deploymentStage;
}

function parseToken(accessTokens: AccessToken[]) {
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
    const {
      algorithm,
      accessTokens,
      formIds,
      paramsFormIdsMapping,
      DATA_SCHEMA,
      language,
    } = getVerificationParams();
    const stage = getDeploymentStage();

    const formUtils = new UbirchFormUtils({
      formIds,
      paramsFormIdsMapping,
    });
    const formParams = formUtils.getFormParamsFromUrl(window, ';');
    formUtils.setDataIntoForm(formParams, window.document);
    const handledJson = handleSpecials(formParams, DATA_SCHEMA);

    const ubirchVerification = new UbirchVerification({
      algorithm,
      stage,
      accessToken: parseToken(accessTokens),
      // externalConfigUrl: 'https://raw.githubusercontent.com/ubirch/ubirch-static-files/main/ubirch-verification-js/blockchain-assets/blockchain-settings.json'
    });

    new UbirchVerificationWidget({
      hostSelector: '#widgetDiv',
      stage,
      messenger: ubirchVerification.messenger,
      // settings: ubirchVerification.settings,
      language,
      linkToConsole: true
    });

    if (!subscribe)
      subscribe = ubirchVerification.messenger.subscribe((msg: any) => {
        if (msg?.type === 'verification-state' && msg?.code === 'VERIFICATION_SUCCESSFUL') {
          showDCCConvertButton(handledJson);
        }
        console.log(msg);
      });

    const hash = ubirchVerification.createHash(JSON.stringify(handledJson));
    ubirchVerification.verifyHash(hash);
  } catch (e) {
    console.log('Fehler! ' + e);
    // TODO: error handling
  }
}

function showDCCConvertButton(formParams: any) {

  let dccCertificateUrl: string;
  const { transformUrl, transformTypeHeader } = getVerificationParams();
  if (!transformUrl || !transformTypeHeader) return;

  const dccButton = document.getElementById('dccConvertButton');
  dccButton?.removeAttribute('hidden');
  dccButton.addEventListener('click', () => fetchDCCCertificate());

  async function fetchDCCCertificate() {
    try {
      dccButton.setAttribute('disabled', 'true');
      if (dccCertificateUrl) { downloadCertificate(); }
      else {

        const headers = new Headers({
          'Content-Type': transformTypeHeader
        });

        const response = await fetch(transformUrl, {
          method: 'POST',
          body: JSON.stringify(formParams),
          headers
        });
        if (response.status === 200) {
          const blob = await response.blob();
          dccCertificateUrl = URL.createObjectURL(blob);
          downloadCertificate();
        } else { throw new Error(); }
      }
    } catch (err) {
      alert('Sorry there was an error while downloading your DCC Certificate. Please try again later');
    }
    dccButton.removeAttribute('disabled');
  }

  function downloadCertificate() {
    if (dccCertificateUrl) {
      const a = document.createElement('a');
      a.download = 'certificate.pdf';
      a.href = dccCertificateUrl;
      a.target = '_blank';
      a.click();
      dccButton.removeAttribute('disabled');
    }
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
