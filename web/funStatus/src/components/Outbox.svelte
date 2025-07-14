<script>
    import Card from "./Card.svelte";
    import { Messages } from "../lib/messages.svelte.js";

    let { selectedCode, prompt } = $props();
    const codeMessages = new Map();

    let selectedMessages = $derived.by(() => {
        let selectedMessages = codeMessages.get(selectedCode);
        if (!selectedMessages || selectedMessages.prompt != prompt) {
            let newMessages = new Messages(selectedCode, prompt);
            codeMessages.set(selectedCode, newMessages);
            return newMessages;
        }
        return selectedMessages;
    });
</script>

<div class="container">
    {#if selectedMessages.length === 0}
        <div class="spinner"></div>
    {:else}
        <button
            class="nav-side nav-arrow nav-prev"
            onclick={() => selectedMessages.prev()}
            disabled={selectedMessages.currentIndex == 0}
        >
            &lt;
        </button>
        <div class="card-container">
            <Card
                {selectedCode}
                currentMessage={selectedMessages.currentMessage}
            />
        </div>
        <button
            class="nav-side nav-arrow nav-next"
            onclick={() => selectedMessages.next()}
        >
            &gt;
        </button>
        <div class="nav-bottom">
            <button
                class="nav-arrow nav-prev"
                onclick={() => selectedMessages.prev()}
                disabled={selectedMessages.currentIndex == 0}
            >
                &lt;
            </button>
            <button
                class="nav-arrow nav-next"
                onclick={() => selectedMessages.next()}
            >
                &gt;
            </button>
        </div>
    {/if}
</div>

<style>
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 40px 10px;
    }

    .nav-arrow {
        width: 60px;
        height: 60px;
        text-align: center;
        font-size: 2.4rem;
        cursor: pointer;
        user-select: none;
        transition: color 0.2s ease;
        flex-shrink: 0;
        border-radius: 50%;
        display: inline-block;
        border: none;
        background-color: transparent;
    }

    .nav-arrow:hover {
        color: #2d3748;
    }

    .nav-bottom {
        display: none;
    }

    .card-container {
        flex-grow: 1;
        aspect-ratio: 16/10;
        min-width: 300px;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #ccc;
        border-top: 4px solid #333;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 2rem auto;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    @media (max-width: 600px) {
        .container {
            flex-direction: column;
        }

        .nav-side {
            display: none;
        }

        .nav-bottom {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 40px;
            width: 100%;
        }

        .card-container {
            width: 95%;
        }

    }
</style>
