<script>
    import { Input,Button, Modal,  ModalBody, Form, FormGroup } from '@sveltestrap/sveltestrap';

    (function proverka() {
        if(localStorage.getItem('jwt') == null) {
            window.location.href = "/"
        }
    })()

    let open = $state(false);
    const toggle = () => (open = !open);

    let title = $state('')
    let mainText = $state('')
    let validated = false;

    async function create_post() {
        if(title.length == 0 || mainText.length == 0) return
        var res = await fetch('http://localhost:8080/posts/create', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'title': title, 
                'content': mainText,
                'author_id': localStorage.getItem('id')
            })
        })
        if(res.ok) {
            title = ''
            mainText = ''
            await toggle()
        }
    }
</script>

<div class="mt-5 p-5 border border-2 border-dark rounded d-flex flex-content-center flex-column align-self-center" >
    <h2 class="">Создание поста</h2>
    <hr class="mb-3 mt-2">
    <Form {validated} on:submit={(e) => e.preventDefault()}>
    <FormGroup class="area mt-5">
        <h3>Заголовок</h3>
        <Input class="area mt-2" 
            bind:value={title} 
            required
            placeholder="Введите заголовок"
            maxlength = 50
            >
        </Input>
    </FormGroup>
    <FormGroup class="area mt-3">
        <h3>Содержание</h3>
        <Input type="textarea" class="area mt-2  "
        style="height: 30vh;"
            bind:value={mainText} 
            required
            placeholder="Введите содержание"
            maxlength = 2000
            ></Input>
    </FormGroup>
    <div class="d-flex justify-content-center">
        <Button outline 
        color="secondary"
            on:click={async ()=> await create_post()}
            type="submit" 
            class="mt-3 w-25 align-self-center">
            Опубликовать</Button>
    </div>
    <Modal  isOpen={open} {toggle}>
        <ModalBody>
            <h4>Пост отправлен на проверку</h4>
            <hr>
            <p>
                Пост отправлен на проверку администраторам, после проверки он будет опубликован
            </p>
        </ModalBody>
    </Modal>
    </Form>
</div>

<style>

    h2,h3{
        text-align: center;
        font-family: 'Maki-Sans';
    }
</style>