<script>
    import { Input, Button} from '@sveltestrap/sveltestrap';

   let {data} = $props()
   let user = data.user
   let rating_history = data.rating_history

   let first_name = $state(user.first_name)
    let second_name = $state(user.second_name)
    let nick_name = $state(user.nick_name)
    let email = $state(user.email)
    let password = $state(user.password)

   let disabled = !(data.user.id == localStorage.getItem('id'))
   const date = new Date(user.createdAt);

   let normal_date = (date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }));
    let update_user = async () => {
        user = {...user, first_name: first_name, second_name: second_name, nick_name: nick_name, email: email, password: password}
        console.log(user)
        let res = await fetch("http://localhost:8080/users/update", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        if(res.ok){
            alert("Данные успешно обновлены")
        }
    }
</script>
  
    <div class="d-flex flex-column justify-content-center align-items-center m-3" >
    <div class="mt-3">
        <h5>Имя</h5>
        <Input bind:value ={first_name} disabled={disabled}/>
    </div>
    <div class="mt-3">
        <h5>Фамилию</h5>
        <Input bind:value ={second_name} disabled={disabled}/>
    </div>
    <div class="mt-3">
        <h5>Ник</h5>
        <Input bind:value ={nick_name} disabled={disabled}/>
    </div>
    <div class="mt-3">
        <h5>Почта</h5>
        <Input bind:value ={email} disabled={disabled} type="email"/>
    </div>
    <div class="mt-3">
        <h5>Рейтинга</h5>
        <Input bind:value ={user.rating} disabled />
    </div>


    {#if !disabled}
    <div class="mt-3">
        <h5>Пароль</h5> 
        <Input bind:value ={password} disabled={disabled} type="password"/>
    </div>
    <div class="mt-3">
        <p>Cоздан: {normal_date}</p>
    </div>
    <div class="d-flex gap-2 justify-content-center ">
        <Button outline color="secondary"  on:click={ async () => await update_user()} class="mt-3 w-25 align-self-center">Сохранить</Button>
        <Button outline color="secondary"  on:click={ () => {localStorage.clear(); window.location.href = "/"}} class="mt-3 w-25 align-self-center">Выйти</Button>
    </div>
    {/if}
    </div>
    <div class="mt-5">
        <h3>История рейтинга</h3>
     <table class="table">
    <thead>
    <tr>
      <th scope="col">User id</th>
      <th scope="col">Post id</th>
      <th scope="col">Type</th>
      <th scope="col">Count</th>
    </tr>
  </thead>
  <tbody>
    {#each  rating_history as item }
        <tr>
            <td>{item.user_id}</td>
            <td>{item.post_id}</td>
            <td>{item.type}</td>
            <td>{item.rating}</td>
        </tr>
    {/each}
  </tbody>
</table>
</div>

    <style>
    div{
        width: 100%;
    }
</style>