const initSession = async (obj) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify(obj);

  const sessionCreateOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  return fetch("https://api3dwizard.ozero.aegas.it/sessions?projectId=1", sessionCreateOptions)
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