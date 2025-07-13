<script>
    import Dropdown from "./components/Dropdown.svelte";
    import Promptbox from "./components/Promptbox.svelte";
    import Outbox from "./components/Outbox.svelte";

    let selectedCode = $state(200);
    let prompt = $state("");
</script>

<main class="container">
    <h1>FunStatus</h1>

    <div class="inputArea">
        <span class="dropdown"><Dropdown bind:selectedCode /></span>
        <span class="promptinput"><Promptbox bind:prompt/></span>
    </div>
    <Outbox {selectedCode} {prompt} />
</main>

<style>
    .container {
        max-width: 600px;
        margin: auto;
        padding: 1rem;
        font-family: sans-serif;
    }
    h1 {
        text-align: center;
    }

    .inputArea {
        display: flex;
        gap: 10px;
        width: 100%;
        align-items: stretch;
    }

    .inputArea .dropdown {
        flex: 0 0 30%;
    }

    .inputArea .promptinput {
        flex: 0 0 70%;
    }

    /* Small screens: stack vertically */
    @media (max-width: 600px) {
        .inputArea {
            flex-direction: column;
        }
        .inputArea .dropdown,
        .inputArea .promptinput {
            flex: 1 1 100%;
        }
    }
</style>
