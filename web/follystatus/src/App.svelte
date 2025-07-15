<script>
    import Dropdown from "./components/Dropdown.svelte";
    import Promptbox from "./components/Promptbox.svelte";
    import Outbox from "./components/Outbox.svelte";

    let selectedCode = $state(200);
    let prompt = $state("");
</script>

<main class="container">
    <div class="header">
        <span class="folly">folly</span>
        <span class="status">status</span>
    </div>
    <div class="inputArea">
        <span class="dropdown"><Dropdown bind:selectedCode /></span>
        <span class="promptinput"><Promptbox bind:prompt /></span>
    </div>
    <Outbox {selectedCode} {prompt} />
</main>

<style>
    .container {
        max-width: 720px;
        margin: 2rem auto;
        padding: 1rem;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
            "Segoe UI Symbol";
        color: #333;
    }

    .header {
        text-align: center;
        display: inline-block;
        font-size: 2em;
        color: #112D4E;
        padding-bottom: 50px;
    }

    .folly {
        font-family: "Cursive", sans-serif;
        font-size: 3em;
        display: inline-block;
        animation: slight-rotation 3s infinite alternate ease-in-out; 
    }

    @keyframes slight-rotation {
        0% {
            transform: rotate(-5deg);
        }
        100% {
            transform: rotate(5deg);
        }
    }

    .inputArea {
        display: flex;
        gap: 1rem;
        width: 100%;
        align-items: flex-end;
        margin-bottom: 2rem;
    }

    .inputArea .dropdown {
        flex: 0 0 35%;
    }

    .inputArea .promptinput {
        flex: 1 1 65%;
    }

    @media (max-width: 680px) {
        .inputArea {
            flex-direction: column;
            align-items: stretch;
        }
        .inputArea .dropdown,
        .inputArea .promptinput {
            flex: 1 1 100%;
        }
    }
</style>
