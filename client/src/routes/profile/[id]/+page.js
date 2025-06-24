/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  let user_data = await getData(params.id)
  let rating_history1 = await rating_history(params.id)
  console.log(rating_history1)
  console.log("id: " + params.id)
    return {
      user: JSON.parse(user_data),
      rating_history: JSON.parse(rating_history1)
    };
  }

async function getData(id) {
    let email = localStorage.getItem("email")
    console.log(`http://85.198.80.78:8080/users/get/${id}`)
    const res = await fetch(`http://85.198.80.78:8080/users/get/${id}`);

    const user = await res.json(); 

    return user;
}

async function rating_history(id){
  const res = await fetch(`http://85.198.80.78:8080/users/rating/history/${id}`);

  const rating_history = await res.json(); 

  return rating_history;
}