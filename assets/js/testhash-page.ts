import {
  UbirchVerification,
  UbirchVerificationWidget,
  // @ts-ignore
} from './node_modules/@ubirch/ubirch-verification-js/dist';

let ubirchVerification;
let ubirchVerificationWidget;
let subscription = null;
let initialized = false;
const hashAlgo = {
  sha256: 'sha256',
  sha512: 'sha512'
};
let selectedHashAlgo = hashAlgo.sha256;
const devStage = {
  dev: 'dev',
  demo: 'demo',
  qa: 'qa',
  prod: 'prod'
}
let selectedStage = devStage.dev;

setFormVisibility(initialized);

const updateLog = (msg) => {
  console.log(msg);

  (document.getElementById('log') as HTMLInputElement).value += JSON.stringify(msg, null, 2) + '\n\n';
};

// verify JSON button click listener
document.getElementById('set-token').addEventListener('click', function () {
  setupVerificationWidget();
});
// verify JSON button click listener
document.getElementById('verify-json').addEventListener('click', function () {
  if (!ubirchVerification) {
    // handle the error yourself and inform user about the missing token
    const msg = 'Verification Widget not initialized propertly - did you set a token?\n';
    window.alert(msg);
  } else {
    const json = (document.getElementById('json-input') as HTMLInputElement).value;
    if (!json) {
      // handle the error yourself and inform user about the missing JSON
      const msg = 'Please add a JSON to be verified\n';
      window.alert(msg);
    }
    try {
      const hash = ubirchVerification.createHash(json);
      ubirchVerification
        .verifyHash(hash)
        .then((response) => {
          const msg = 'Verification Result:\n' + JSON.stringify(response, null, 2);
          (document.getElementById('output') as HTMLInputElement).value = msg;
          console.log(response);
        })
        .catch((errResponse) => {
          const msg =
            'Verification failed!!\n\nErrorResponse:\n' + JSON.stringify(errResponse, null, 2);
          (document.getElementById('output') as HTMLInputElement).value = msg;
          console.log(errResponse);
        });
    } catch (e) {
      // handle the error yourself and inform user about the missing fields
      const msg = 'JSON Verification failed!\n';
      window.alert(msg);
    }
  }
});
// insert JSON test data button click listener
document.getElementById('trim-sort-json').addEventListener('click', function() {
  const jsonStr = (document.getElementById('json-input') as HTMLInputElement).value;
  const trimmedSortedJson = ubirchVerification.formatJSON(jsonStr, true);
  (document.getElementById('trimmed-json-input') as HTMLInputElement).value = trimmedSortedJson;
});

// get hash from JSON button click listener
document.getElementById('hash-from-json').addEventListener('click', function() {
  const genHash = ubirchVerification.createHash((document.getElementById('trimmed-json-input') as HTMLInputElement).value);
  (document.getElementById('hash-input') as HTMLInputElement).value = genHash;
});

// test hash button click listener
document.getElementById('hash-test').addEventListener('click', function() {
  ubirchVerification.verifyHash((document.getElementById('hash-input') as HTMLInputElement).value);
});

document.getElementsByName('stage').forEach(function(e: HTMLInputElement) {
  e.addEventListener("click", function() {
    changeStage(e.value);
  });
});

document.getElementsByName('hashalgo').forEach(function(e: HTMLInputElement) {
  e.addEventListener("click", function() {
    changeHashAlgo(e.value);
  });
});

function setupVerificationWidget() {
  const token = (document.getElementById('token-input') as HTMLInputElement).value;
  if (token) {
    // create UbirchVerification instance
    ubirchVerification = new UbirchVerification({
      algorithm: selectedHashAlgo,
      stage: selectedStage,
      accessToken: token,
    });
    ubirchVerificationWidget = new UbirchVerificationWidget({
      hostSelector: '#widget-root',
      messenger: window['UbirchMessenger$']
    });
    (document.getElementById('log') as HTMLInputElement).value = '';
    if (!subscription) subscription = ubirchVerification.messenger.subscribe(updateLog);
    setFormVisibility(true);
  } else {
    // handle the error yourself and inform user about the missing token
    setFormVisibility(false);
    const msg = 'Token input is empty!\n';
    window.alert(msg);
  }
}

function changeHashAlgo(elem: string) {
  console.log(elem);
  selectedHashAlgo = hashAlgo[elem];
  setupVerificationWidget();
}
function changeStage(elem: string) {
  console.log(elem);
  selectedStage = devStage[elem];
  setupVerificationWidget();
}
function setFormVisibility(visible) {
  initialized = visible;
  if (initialized) {
    document.getElementById("form-area").className = "";
  } else {
    document.getElementById("form-area").className = "hidden";
  }
}
