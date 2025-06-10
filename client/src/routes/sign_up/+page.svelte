<script>
    (function proverka() {
        if(localStorage.getItem('jwt') != null) {
            window.location.href = "/"
        }
    })()
    import { Input,Button, Form, FormGroup} from '@sveltestrap/sveltestrap';
    let validated = false;

    let first_name = $state('')
    let second_name = $state('')
    let password = $state('')
    let nick_name = $state('')
    let email = $state((Math.random() + 10000).toString(36).substring(7) + '@gmail.com')
    let code = $state('')
    

   
    async function registration () {
        console.log(`${first_name} + ${password} + ${second_name} + ${nick_name}`)
        if(first_name == '' || password == '' || second_name == '' || nick_name == '') {
            alert('Заполните все поля!')
            return
        }
        else {
            let res = await fetch('http://85.198.80.78:8080/users/sign_up', {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    'first_name': first_name, 
                    'second_name': second_name,
                    'email': email,
                    'nick_name': nick_name,
                    'password': password,
                    'is_admin': code == "1239" ? "true" : "false",
                    'role': (function() {
                        if(code == "1239")
                            return "admin"
                        else if(code == "987")
                            return "moder"
                         return "user"
                    }())
                })
            }).then(async (response) => {
                if (response.ok) {
                    let body = await response.json()
                    console.log("ЭЭЭУ " + body.toString())
                    for (let i in body) {
                        console.log(i + ' - bodyy')
                        localStorage.setItem(i, body[i]);
                    }
                    console.log(body.id+ "id")
                    window.location.href = "/";
                }
            })
        }
    }
</script>

<div class="mt-5 p-5 border border-2 border-dark rounded d-flex flex-content-center flex-column align-self-center" style="width: 100%;">
    <h2 class="">Регистрация</h2>
    <hr class="mb-3 mt-2">
    <Form {validated} on:submit={(e) => e.preventDefault()}>
    <FormGroup class="area mt-5">
        <h3 >Имя</h3>
        <Input class="area mt-2" 
            bind:value={first_name} 
            required
            placeholder="Введите Имя"></Input>
    </FormGroup>
    <FormGroup class="mt-2 ">
        <h3 >Фамилию</h3>
        <Input class="area mt-2" 
            bind:value={second_name} 
            required
            placeholder="Введите Фамилию"></Input>
    </FormGroup>
    <FormGroup class="mt-2">
        <h3 >Никнейм</h3>
        <Input class="area mt-2" 
            bind:value={nick_name}
            required
            placeholder="Введите ник"></Input>
    </FormGroup>
    <FormGroup class="mt-2">
        <h3 >Почта</h3>
        <Input class="area mt-2" 
        bind:value={email}
            required
            type="email"
            placeholder="Введите почту"></Input>
    </FormGroup>
    <FormGroup class="mt-3">
        <h3>Пароль</h3>
        <Input class="area mt-2" v
            bind:value={password} 
            required
            placeholder="Введите пароль"></Input>
    </FormGroup>
    <FormGroup class="mt-3">
        <h3>Пригасительный код (если имеется)</h3>
        <Input class="area mt-2" 
            bind:value={code} 
            placeholder="Введите код"></Input>
    </FormGroup>
</Form>

    <Button outline color="secondary"  on:click={registration} class="mt-3 w-25 align-self-center">Регистрация</Button>
    <p class="pt-4">Есть аккаунт? <br><a href="/signin">Войти!</a></p>
</div>

<style>

    h2,h3,a,p{
        text-align: center;
        font-family: 'Maki-Sans';
    }
</style>