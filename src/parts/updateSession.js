const updateSession = (obj, sessionId) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify(obj);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  return fetch(`https://api.qudrix.com/sessions/${sessionId}/raw-data`, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error updating session:', error);
      throw error;
    });
};

export default updateSession;