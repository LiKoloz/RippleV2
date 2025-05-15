<script>
    import {Card, CardHeader, CardBody, CardTitle, CardText,CardFooter,CardSubtitle} from '@sveltestrap/sveltestrap';

    let {data} = $props()

    let posts = $state(data.posts)
    let max_page =$state(data.max_page)
    let page = $state(1)


    async function getPostsWithAutor(page) { 
    const res = await fetch(`http://localhost:8080/posts/all/${page}`, {
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


    let add_or_delete_like = async (post_id) => {
        let res = await fetch('http://localhost:8080/posts/add_or_delete_like', 
        {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({user_id: localStorage.getItem('id'), id: post_id, type: 'like', rating: 2})
        });
        if(res.ok) {
          let post = posts.find(p => p.id == post_id)
          post.is_liked = !post.is_liked
          console.log(post)
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

</script>
<div class="d-flex justify-content-center">
{#if localStorage.getItem('jwt') != null}
    <a href="/create_post" aria-label="create_post">
        <i class="bi bi-patch-plus" ></i>
    </a>
{/if}
</div>
<div class="pt-3 pb-3">
    {#each posts as post} 
        <div class="pt-2" style="max-width: 90vh;">
            <Card style="background-color: #FAF3E0">
                <CardHeader>
                    <CardTitle>
                        <a href="/profile/{post.author_id}">{post.author}</a>
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <CardSubtitle>{post.title}</CardSubtitle>
                    <CardText>{post.content}</CardText>
                </CardBody>
                <CardFooter class="d-flex justify-content-around">
                    <div class="d-flex align-items-center flex-row gap-2">
                      <button type="button" onclick={() => add_or_delete_like(post.id)} class="btn btn-outline" aria-label="Лайк"> 
                        <div class="d-flex align-items-center flex-row gap-2"> 
                           {#if post.is_liked} <i class="bi bi-heart-fill"></i>
                           {:else} <i class="bi bi-heart"></i> {/if}
                        </div>
                      </button>
                    </div>
                    <div class="d-flex align-items-center flex-row gap-2" onclick={() => location.href = "/post/" + post.id }>
                        <button type="button" onclick={() => add_or_delete_like(post.id)} class="btn btn-outline"  aria-label="Комментарии"> 
                          <div class="d-flex align-items-center flex-row gap-2"> 
                            <i class="bi bi-chat-left-text"></i> 
                          </div>
                        </button>
                      </div>
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