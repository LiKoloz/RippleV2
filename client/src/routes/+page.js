/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    let posts = await getPostsWithAutor();
    return { posts: posts.posts, max_page: posts.max_page };
}

async function getPostsWithAutor() {
    const res = await fetch('http://80.242.57.142:8080/posts/all/1', {
        headers: {
            'user_id': localStorage.getItem('id')
        }
    });
    if (res.ok) {
        let res_body = await res.json();
        console.log(res_body)
        let posts = (res_body).posts
        if (posts == "") {
            return { posts: [], max_page: 0 };
        }
        console.log(posts + " posts")
        console.log(posts.length + " pslength")
        return { posts: posts, max_page: res_body.max_page };
    } else {
        console.error('Failed to fetch posts:', res.status);
        return { posts: [], max_page: 0 };
    }
}