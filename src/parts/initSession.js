const initSession = async (obj) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const devHost = "https://api3dwizard.ozero.aegas.it";
  const prodHost = "https://api.qudrix.com";

  const url = window.location.href;
  const host = url.includes("webflow") ? devHost : prodHost;

  const raw = JSON.stringify(obj);

  const sessionCreateOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  return fetch(`${host}/sessions?projectId=1`, sessionCreateOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error creating session:', error);
      throw error;
    });
};

export default initSession;

