
const fetchGreetingAndPerson = async () =>{
  const response = await fetch('http://localhost:4000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
      query Greetings{
        greeting
      } 
      `
    })
  })

  const { data } = await response.json();
  return data.greeting;
}

fetchGreetingAndPerson().then((greeting) => {
  document.getElementById('greeting').textContent = greeting;
});