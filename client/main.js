const inputData = document.getElementById('url');
const submitButton = document.getElementById('submit');
const content = document.getElementById('content');
const urlValidate = document.getElementById('urlValidate');
const spinner = document.getElementById('spinner');
const diplayErr = document.getElementById('error');

if (inputData) {
  inputData.addEventListener("focus", () => {
    urlValidate.innerHTML = '',
      diplayErr.innerHTML = ''
  }, true);
}
function displaySpinner() {
  spinner.setAttribute("style",
    `height: 100%;
      background: rgba(0,0,0,.8);
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      `);
}

function stopSpinner() {
  spinner.setAttribute("style", "display: none");
}

if (submitButton) {
  submitButton.addEventListener('click', (e) => {
    e.preventDefault()

    content.innerHTML = ''

    if (!url.value) {
      urlValidate.innerHTML = 'URL is required *'
    } else {
      displaySpinner()
      const url = inputData.value;
      fetch('http://localhost:3001/api/script', {
        method: 'POST',
        body: JSON.stringify({ url }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
        .catch(error => console.error('Error:', error.message))
        .then(response => {
          console.log(response)
          if (response.success) {
            content.innerHTML = `
            <li><strong>Page title:</strong> ${response.results.pageTitle}</li>
            <li><strong>Page domain:</strong> ${response.results.domain}</li>
            <li><strong>Number of the links:</strong> ${response.results.links}</li>
            <li><strong>Number of unique domains for the links:</strong> ${response.results.uniqueDomainNumber}</li>
            <li><strong>Unique domain of the links:</strong> 
              ${response.results.filteredDomain.length > 0 ? response.results.filteredDomain
                .map(domain => `<br/><span class="domains">${domain}</span>`) : 'Not found!'}
            </li>
            <li><strong>Is the page run at secure manner?:</strong> ${response.results.isSecure ? 'Yes' : 'No'}</li>
            <li><strong>Is the page has google analytics?:</strong> ${response.results.isHasGoogleAnalytics ? 'Yes' : 'No'}</li>
            `
          }
          // Render the errors
          if (!response.message && !response.results) {
            diplayErr.innerHTML = 'URL not found or you have to add www or http:// before your URL'
          } else if (response.message) {
            diplayErr.innerHTML = `${response.message}`
          }
          stopSpinner()
        });
    }
  })
}
