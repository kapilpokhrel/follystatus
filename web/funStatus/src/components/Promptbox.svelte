<script>
    let { prompt = $bindable() } = $props();
</script>

<form
    class="textInput"
    onsubmit={(e) => {
        e.preventDefault();
        prompt = e.target[0].value;
    }}
>
    <label for="prompt-input">Special Prompt</label>
    <div class="inputRow">
        <input id="prompt-input" type="text" value={prompt} />
        <input type="submit" value="Set Prompt" />
    </div>
</form>

<style>
    form {
        width: 100%;
    }

    .inputRow {
        align-items: center;
        display: flex;
        gap: 5px;
    }
    
    .inputRow input {
        padding: 0.5rem;
        margin-bottom: 1rem;
    }

    .inputRow #prompt-input {
        flex: 1;
    }
</style>
