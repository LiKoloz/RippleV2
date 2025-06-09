<script>
    import {Card, CardHeader, CardBody, CardTitle, CardFooter,CardText,CardSubtitle, Button} from '@sveltestrap/sveltestrap';

    let {data} = $props()
    let posts = $state(data.posts)
    let max_page =$state(data.max_page)
    let page = $state(1)

    console.log("Posts:" + JSON.parse(JSON.stringify(posts)))

    async function getPostsWithAutor(page) { 
    const res = await fetch(`http://localhost:8080/posts/all/noncheked/${page}`, {
      headers: {
        'user_id': localStorage.getItem('id')
      }
    });
    if (res.ok) { 
        let res_body = await res.json();
        console.log(res_body)
        let posts = (res_body).posts
        if (posts == "") {
            return {posts: [], max_page: 0};
        }
        console.log(posts + " posts")
        console.log(posts.length + " pslength")
        return {posts: posts, max_page: res_body.max_page};
    } else {
        console.error('Failed to fetch posts:', res.status);
        return {posts: [], max_page: 0}; 
    }
    }

    async function add_page() {
      page++
      let data = await getPostsWithAutor(page)
      posts = data.posts
      max_page = data.max_page
    }
   async function reduce_page() {
      page--
      let data = await getPostsWithAutor(page)
      posts = data.posts
      max_page = data.max_page
    }
    async function accept_all_posts() {
        let res = await fetch("http://localhost:8080/posts/accept/all", {
            method: "GET"
        })
        if (res.ok){
            posts = []
        }
    }
    async function reject_all_posts() {
        let res = await fetch("http://localhost:8080/posts/reject/all", {
            method: "DELETE"
        })
        if (res.ok){
            posts = []
        }
    }
    async function accept_post(id) {
        let res = await fetch(`http://localhost:8080/posts/accept/${id}`, {
            method: "GET"
        })
        console.log("RES OK:" + res.ok)
        if (res.ok){
            posts = posts.filter(p => p.id != id)
        }
        else{
            console.log("RES NOT OK")
        }
    }
    async function reject_post(id) {
        let res = await fetch(`http://localhost:8080/posts/reject/${id}`, {
            method: "DELETE"
        })
        if (res.ok){
            posts = posts.filter(p => p.id != id)
        }
        else{
        }
    }

</script>
<div>
    {#if posts.length != 0}
    <div class="d-flex justify-content-center">
        <Button onclick={async () => await accept_all_posts()} class="ms-2 border border-dark" color ="success"> Опубликовать все посты <i class="bi bi-check-circle"></i></Button>
        <Button onclick={async () => await reject_all_posts()} class="ms-2 border border-dark" color="danger">Удалить все посты <i class="bi bi-x-circle"></i></Button>
    </div>
    {/if}
    {#each posts as post} 
    <div class="pt-2" style="max-width: 90vh;">
        <Card style="background-color: #FAF3E0">
            <CardHeader>
                <CardTitle>
                    <a href="/profile/{post.author_id}">{post.author}</a>
                    {#if post.bad_words == true}<i class="bi bi-patch-check-fill text-danger"></i>{:else}
                    <i class="bi bi-patch-check-fill  text-success"></i>{/if}
                </CardTitle>
            </CardHeader>
            <CardBody onclick={() => location.href = "/post/" + post.id }>
                <CardSubtitle>{post.title}</CardSubtitle>
                <CardText>{post.content}</CardText>
            </CardBody>
            <CardFooter class="d-flex justify-content-around">
                <Button onclick={async () => await accept_post(post.id)} color ="success"><i class="bi bi-check-circle"></i></Button>
                <Button onclick={async () => await reject_post(post.id)} class="ms-2" color="danger"><i class="bi bi-x-circle"></i></Button>
            </CardFooter>
        </Card>
    </div>
{/each}
{#if posts.length != 0}
<div class="pagination">
    <button
      class="arrow"
      aria-label="Previous page"
      disabled={page == 1}
      onclick={reduce_page}
    >
      ←
    </button>
    
    <span class="page-number">{page}</span>
  
    <button
      class="arrow"
      aria-label="Next page"
      disabled={page == max_page}
      onclick={add_page}
    >
      →
    </button>
  </div>
  {/if}

<!-- 

    <div class="d-flex justify-content-center">
        <Button onclick={async () => await accept_all_posts()} class="ms-2 border border-dark" color =""> Опубликовать все посты <i class="bi bi-check-circle"></i></Button>
        <Button onclick={async () => await reject_all_posts()} class="ms-2 border border-dark" color="">Удалить все посты <i class="bi bi-x-circle"></i></Button>
    </div>
   
    <div class="pt-3 pb-3">
        {#each posts as post} 
            <div class="pt-2" style="max-width: 90vh;">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <a href="/profile/{post.author_id}" class="text-decoration-none text-black">{post.author}</a>
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <CardSubtitle>{post.title}</CardSubtitle>
                        <CardText>{post.content}</CardText>
                    </CardBody>
                    <CardFooter class="d-flex justify-content-center">
                        <Button onclick={async () => await accept_post(post.id, true)} color ="success"><i class="bi bi-check-circle"></i></Button>
                        <Button onclick={async () => await reject_post(post.id, true)} class="ms-2" color="danger"><i class="bi bi-x-circle"></i></Button>
                    </CardFooter>
                </Card>
            </div>
           
        {/each}
    </div> -->
</div>

<style>
    i{
       font-size: 1.3em;
       cursor: pointer;
    }
    a{
        text-decoration: none;
        color: #000
    }
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    margin: 0;
    padding: 0;
  }

  .arrow {
    background: none;
    border: none;
    padding: 4px 0;
    margin: 0;
  }

  .page-number {
    margin: 0 0.5rem;
  }
</style>
