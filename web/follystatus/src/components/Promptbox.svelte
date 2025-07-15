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

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #4a5568;
    }

    .inputRow {
        display: flex;
        gap: 0.5rem;
        align-items: stretch;
    }


    #prompt-input {
        flex: 1;
        padding: 0.75rem;
        border: 1px solid #cbd5e0;
        border-radius: 0.5rem;
        background-color: #fff;
        font-size: 1rem;
        line-height: 1.5;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    #prompt-input:focus {
        outline: none;
        border-color: #112D4E;
        box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.7);
    }

    input[type="submit"] {
        padding: 0.75rem 1.5rem;
        border: 1px solid transparent;
        border-radius: 0.5rem;
        background-color: #3F72AF;
        color: #fff;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    input[type="submit"]:hover {
        background-color: #112D4E;
    }
</style>
