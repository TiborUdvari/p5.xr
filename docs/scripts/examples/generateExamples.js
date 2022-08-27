const renderCode = function (exampleName) {
  const selector = 'language-js';
  const examples = document.getElementsByTagName('code');
  const filteredExamples = Array.from(examples).filter((example) => example.className.includes(selector));

  const getGeneratedPageURL = ({ html, css, js }) => {
    const getBlobURL = (code, type) => {
      const blob = new Blob([code], { type });
      return URL.createObjectURL(blob);
    };

    const cssURL = getBlobURL(css, 'text/css');
    const jsURL = getBlobURL(js, 'text/javascript');

    const source = `
      <html>
        <head>
          <meta charset='utf-8'>
          <meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=no'>
          <meta name='mobile-web-app-capable' content='yes'>
          <meta name='apple-mobile-web-app-capable' content='yes'>
          ${css && `<link rel="stylesheet" type="text/css" href="${cssURL}" />`}
          <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.2/p5.min.js"></script>
          <script src="https://github.com/stalgiag/p5.xr/releases/download/v0.4.65/p5xr.min.js"></script>
        </head>
        <body>
          ${html || ''}
          ${js && `<script src="${jsURL}"></script>`}
        </body>
      </html>
    `;

    return getBlobURL(source, 'text/html');
  };

  for (const example of filteredExamples) {
    const code = example.innerText;
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '200px';
    const parent = example.parentElement;
    parent.appendChild(iframe);
    const url = getGeneratedPageURL({
      html: null,
      css: '* {overflow: hidden;}',
      js: code,
    });

    iframe.src = url;
  }
};

window.onload = () => {
  setTimeout(renderCode, 1000);
};
