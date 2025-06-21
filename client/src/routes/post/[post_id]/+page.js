/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    let post = await getPostsWithAutor(params);
    let role = await check_role()
    post.is_liked = await check_like(params.post_id);
    return { post: post, role: role};
}

async function getPostsWithAutor(params) { 
    let res = await fetch(`http://localhost:8080/posts/${params.post_id}`);

    if(res.ok){
        let body = await res.json()
        console.log(body.comments)
        return body
    }

}

let check_role = async () => {
    let email = localStorage.getItem("email")
    if(!email || email =='') return "none"
    let res = await fetch(`http://localhost:8080/users/role/${email}`)

    if(res.ok){
        let result = await res.text()
        console.log("Role " + result)
        return result
    }
}

let check_like = async(post_id) => {
    let email = localStorage.getItem("email")
    if(!email || email =='') return "false" 
    let res = await fetch(`http://localhost:8080/posts/like`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user_id: localStorage.getItem("id"), post_id: post_id})
    })
    console.log('RES  ', res.status)
    if(res.ok)
        return true
    return false
}
// TODO: Сделать получение лайкал ли пользователь