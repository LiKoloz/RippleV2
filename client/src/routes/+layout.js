export const ssr = false;
/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    let role
    let email = localStorage.getItem("email")
    if(email != null && email != ""){
        role = await check_role();
    }
    else{
        role = "none"
    }
    let posts = await check_role();
    return { role: role};
}


let check_role = async () => {
    let email = localStorage.getItem("email")
    let res = await fetch(`http://localhost:8080/users/role/${email}`)

    if(res.ok){
        let result = await res.text()
        console.log("Role " + result)
        return result
    }
}