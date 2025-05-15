<script>
    let {data, children} = $props()
    import { Container, Icon } from '@sveltestrap/sveltestrap';
    import { on } from 'svelte/events';
    import { get } from 'svelte/store';


    
    let role =data.role.trim().replace(/^"|"$/g, '')
    let if_auth = () =>{
        let id = localStorage.getItem("id")
        console.log(id)
        if(id != null && id != ""){
            return "/profile/" + id
        }
        return "/sign_in"
    }
    let admin="admin"
</script>

<div class="d-flex" style="flex-direction: column; height: 100%; background-color: #FAF3E0;">
    <div style=" flex: 0 0 7%; border-bottom: 1px solid #000"> 
        <div class="container pt-2" style="margin-bottom: -0.5em;">
            <div class="row">
                <div class="col">
                    <Container fluid style="margin-left: -50% !important;">
                        <div>
                            <a href="/">
                                <h2 class='d-inline' style="font-family: 'Tesla';">Ripple</h2>
                            </a>
                        </div>
                    </Container>
                </div>
                <div class="col-9"></div> 
                <div class="col d-flex justify-content-center align-items-center">
                    <a href='{if_auth()}' aria-label="toProfile">
                        <i class="bi bi-person-circle"></i>
                    </a>
                    {#if role == admin}
                    <a href="/admin_panel" id='archive' aria-label="toAdminPanel">
                        <i class="bi bi-archive"></i>
                    </a>
                    {/if}
                </div>
            </div>
        </div>
    </div>

    <div style="background-color: #FAF3E0; flex: 0 0 83%;" class="d-flex justify-content-center">
        <div class="w-25"></div>
        <div class="flex-grow-1 pt-3 pb-3">
            {@render children()}
        </div>
        <div class="w-25"></div>
    </div>

    <footer class="pt-2" style="flex: 0 0 10%;">
        <div style="font-family: 'Tesla';">
            <h3 style="padding-top: 10%; padding-left: 10%;">@Ripple</h3>
        </div>
        <div>
            <p>Контакты:  <b style="font-family: 'Tesla';">support@ripple.com</b>   
            <br>Следите за нами в социальных сетях:  <b style="font-family: 'Tesla';">@RippleSocial</b></p>
        </div>
    </footer>

</div>

<style>
    i {
       font-size: 1.3em;
       cursor: pointer;
    }
    footer {
        background-color: #FAF3E0;
        border-top: 1px solid #000;
        display: flex;
        flex-direction: row;
        flex-wrap: no-wrap;
        justify-content: space-around;
    }
    p {
        white-space: pre-line;
        text-align: center;
    }
    a {
        text-decoration: none;
        color: #000;
    }
    #archive {
        margin-left: 2vh;
    }
</style>