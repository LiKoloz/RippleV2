<script>
    import {Card, CardHeader, CardBody, CardTitle, CardText,CardFooter,CardSubtitle, Input, Button, Form} from '@sveltestrap/sveltestrap';

    let {data} = $props()

    let post = $state(data.post)
    let new_comment = $state('')
    let validated = false;
    let comments = $state(post.comments)
    let role = $state(data.role.trim())
    console.log("liked: ", post)
    console.log('ROLE:', role)
    console.log("RoLEEEEEEEEE ", "moder" == role)
    console.log(role == "\"moder\"")
    let add_or_delete_like = async () => {
        let res = await fetch('http://85.198.80.78:8080/posts/add_or_delete_like', 
        {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({user_id: localStorage.getItem('id'), id: post.id, type: 'like', rating: 2})
        });
        if(res.ok) {
          post.is_liked = !post.is_liked
          console.log(post)
        }
    }

    let delete_post = async () => {
        let res = await fetch('http://85.198.80.78:8080/posts/delete',{
            method: "DELETE",
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(post)
        })
        if(res.ok){
            location.href = "/"
        }
    }

    let add_comment = async (post_id) => {
        console.log('add_comment')
        if(new_comment.length == 0) return
        console.log('add_comment2')
        let body = {content: new_comment, author_id: localStorage.getItem('id'), post_id: post_id}
        let res = await fetch('http://85.198.80.78:8080/comments/create', 
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(body)
        });
        if(res.ok) 
            location.reload();
        
    }
    let delete_comment = async (comment) => {
        let res = await fetch('http://85.198.80.78:8080/comments/delete', 
        {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(comment)
        });
        if(res.ok) 
            location.reload();
        
    }

    let check_rule =  role == "admin" || role=="\"moder\""
</script>
<div class="pt-3 pb-3">
    <Card >
        <CardHeader>
            <CardTitle>
                <a href="/profile/{post.author_id}" class="text-decoration-none text-black">{post.author}</a>
            </CardTitle>
        </CardHeader>
        <CardBody>
            <CardSubtitle>{post.title}</CardSubtitle>
            <CardText>{post.content}</CardText>
        </CardBody>
        <CardFooter class="d-flex justify-content-around">
            <div class="d-flex align-items-center flex-row gap-2">
              <button type="button" onclick={() => add_or_delete_like()} class="btn btn-outline"> 
                <div class="d-flex align-items-center flex-row gap-2"> 
                    {#if post.is_liked===true} <i class="bi bi-heart-fill"></i>
                    {:else} <i class="bi bi-heart"></i> {/if} {post.likes}
                </div>
              </button>
            </div>
            <div class="d-flex align-items-center flex-row gap-2">
                <button type="button" class="btn btn-outline"> 
                  <div class="d-flex align-items-center flex-row gap-2"> 
                    <i class="bi bi-chat-left-text-fill"></i> {post.comments_count}
                  </div>
                </button>
            </div>
            {#if check_rule}
            <div class="d-flex align-items-center flex-row gap-2">
                <button type="button" onclick={() => delete_post()} class="btn btn-outline"> 
                  <div class="d-flex align-items-center flex-row gap-2"> 
                    <i class="bi bi-bucket-fill"></i>
                  </div>
                </button>
            </div>
            {/if}
        </CardFooter>
    </Card>
    <hr>
    {#each comments as comment}
        <div class="pt-2 d-flex" style="max-width: 90vh; ">
            <Card class="w-100">
                <CardHeader>
                    <CardTitle >
                        <a href="/profile/{comment.author_id}" class="text-decoration-none text-black">@{comment.user.nick_name}</a>
                        {#if comment.user.role == "admin"}<i class="bi bi-check2-circle text-primary"></i> {/if}
                    </CardTitle>
                </CardHeader>   
                <CardBody>
                    <CardText>{comment.content}</CardText>
                </CardBody>
                {#if check_rule || comment.author_id == localStorage.getItem("id")}
                <CardFooter class="d-flex justify-content-center">
                    <Button onclick={async () => await delete_comment(comment)} class="ms-2 " color=""><i class="bi bi-trash"></i></Button>
                </CardFooter>
                {/if}
            </Card>
        </div>
    {/each}
    {#if localStorage.getItem("id") != "" &&  localStorage.getItem("id") != null}
    <Form class="d-flex flex-row gap-1 " {validated} on:submit={(e) => e.preventDefault()}>
        <Input class="area mt-2" 
        placeholder="Введите комментарии"
         bind:value={new_comment}
         required 
         feedback="Введите комментарии"></Input>
        <Button on:click={async () => await add_comment(post.id)} class="mt-2  h-25 "><i class="bi bi-send"></i></Button>
    </Form>
    {/if}
</div>